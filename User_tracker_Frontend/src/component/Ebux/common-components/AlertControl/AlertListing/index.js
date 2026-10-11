
import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { calenderIcon } from "../../../../common-components/main-layout/HeaderDatePicker/utils/icons";

import {
  // faEllipsisVertical,
  faPlus,
  faMagnifyingGlass,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import AlertHistoryModal from "./AlertHistoryModal";
import AlertHistory from "./AlertHistory";
import ScopeModal from "./ScopeModal";
import { bulkDeleteAlert, bulkDuplicateAlert, deleteAlert, duplicateAlert, fetchAlertList, updateAlertStatus } from "../services/service";
import { useHistory } from "react-router-dom";

import { faArrowUpWideShort, faArrowDownWideShort } from "@fortawesome/free-solid-svg-icons";

//import { id } from "date-fns/locale";
import { setToastMessageHandler } from "../../../../../redux/action-creator/commonAction";
import { useDispatch } from "react-redux";
import Toast from "../../../../common-components/toast";
import { useEbuxContext } from "../../../Context/EbuxProvider";
import ConfirmDialog from "../ConfirmDialog";
import { ENTITY_TYPE, EVENTS, moduleMap, trackCustomEvent, TRACKING_COMPONENT } from "../../../../../tracker";

// const getTimeElapsed = (createdAt) => {
//   if (!createdAt) return "";
//   const date = new Date(createdAt);
//   if (isNaN(date.getTime())) return "";

//   const now = new Date();
//   const diffMs = now - date;
//   if (diffMs < 0) return "";

//   const diffHours = diffMs / (1000 * 60 * 60);
//   if (diffHours < 24) return `${Math.max(1, Math.floor(diffHours))}h`;

//   const diffDays = diffHours / 24;
//   if (diffDays < 14) return `${Math.floor(diffDays)}d`;

//   const diffWeeks = diffDays / 7;
//   if (diffDays < 60) return `${Math.floor(diffWeeks)}W`;

//   const diffMonths = diffDays / 30.44;
//   if (diffMonths < 12) return `${Math.floor(diffMonths)}M`;

//   const diffYears = diffDays / 365.25;
//   return `${Math.floor(diffYears)}Y`;
// };

export default function AlertListing() {

  const [alerts, setAlerts] = useState([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [fullHistory, setFullHistory] = useState(false);
  // const [ setOpenId] = useState(null);
  const [historyData, setHistoryData] = useState([]);
  const [selectedAlert, setSelectedAlert] = useState(null); // New state to store raw alert data
  const [selectedFormattedAlert, setSelectedFormattedAlert] = useState(null);
  const [isScopeModalOpen, setIsScopeModalOpen] = useState(false);
  const [selectedScopeAlert, setSelectedScopeAlert] = useState(null);
  // const menuRef = useRef(null);
  const [, setLoading] = useState(true);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [bulkDeleteConfirmOpen, setBulkDeleteConfirmOpen] = useState(false);
  const [newStatus, setNewStatus] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const scrollContainerRef = useRef(null);

  const { alertSearch, setAlertSearch, alertSort, setAlertSort, alertFilters, defaultAlertFilters } = useEbuxContext();

  const fetchingRef = useRef(false);
  const [openSort, setOpenSort] = useState(false);

  const ALERT_PAGE_LIMIT = 10;

  const sortRef = useRef(null);

  const history = useHistory();
  const dispatch = useDispatch();

  const trackerContext = {
    module: moduleMap.alert,
    page_name: "Alert Control",
    widget_name: ENTITY_TYPE.ALERT,
  };


  const [counts, setCounts] = useState({
    todayTriggerCount: 0,
    monthTriggerCount: 0,
    issueCount: 0,
    activeAlertCount: 0,
  });

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  //helper functions
  function formatConditions(orConditions) {
    if (!orConditions || orConditions.length === 0) {
      return "No Conditions";
    }

    const formatted = orConditions.map((andGroup) => {
      const andText = andGroup
        .map((condition) => {
          const { metric, operator, value, continuity } = condition;

          if (!metric || !operator || value === undefined) {
            return "";
          }

          let conditionStr = `${metric} ${operator} ${value}`;
          if (continuity) {
            conditionStr += ` with ${continuity} continuity`;
          }

          return conditionStr;
        })
        .filter(Boolean)
        .join(" AND ");

      return andGroup.length > 1 ? `(${andText})` : andText;
    });

    return formatted.join(" OR ");
  }



  function getNextRun(schedule) {
    if (!schedule) return "Not Scheduled";

    const now = new Date();
    let next = null;

    if (!Array.isArray(schedule) && schedule?.frequency === "daily") {
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);

      const targetDay = new Date(midnight);
      targetDay.setHours(0, 0, 0, 0);

      const time = midnight
        .toLocaleTimeString([], {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        })
        .toUpperCase();

      if (targetDay.getTime() === today.getTime()) {
        return `Today ${time}`;
      }

      if (targetDay.getTime() === tomorrow.getTime()) {
        return `Tomorrow ${time}`;
      }

      const date = midnight.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });

      return `${date}, ${time}`;
    }

    if (Array.isArray(schedule)) {
      const getNextRunFromCron = (cronStr, fromDate) => {
        const parts = cronStr.split(" ");
        if (parts.length < 5) return null;

        const match = (val, pattern) => {
          if (pattern === "*") return true;
          if (pattern.includes(",")) return pattern.split(",").map(Number).includes(val);
          if (pattern.includes("/")) return val % parseInt(pattern.split("/")[1], 10) === 0;
          return parseInt(pattern, 10) === val;
        };
        const matchDow = (val, pattern) => {
          if (pattern === "*") return true;
          if (pattern.includes(",")) return pattern.split(",").some(p => parseInt(p, 10) === val || (parseInt(p, 10) === 7 && val === 0));
          const p = parseInt(pattern, 10);
          return p === val || (p === 7 && val === 0);
        };

        let time = fromDate.getTime();
        time = Math.floor(time / 60000) * 60000 + 60000;

        for (let i = 0; i < 365 * 2; i++) {
          let d = new Date(time);
          if (match(d.getDate(), parts[2]) && match(d.getMonth() + 1, parts[3]) && matchDow(d.getDay(), parts[4])) {
            let startDay = d.getDate();
            while (new Date(time).getDate() === startDay) {
              let d2 = new Date(time);
              if (match(d2.getHours(), parts[1])) {
                let startHr = d2.getHours();
                while (new Date(time).getHours() === startHr) {
                  let d3 = new Date(time);
                  if (match(d3.getMinutes(), parts[0])) return d3;
                  time += 60000;
                }
              } else {
                let nextHr = new Date(time);
                nextHr.setHours(nextHr.getHours() + 1, 0, 0, 0);
                time = nextHr.getTime();
              }
            }
          } else {
            let nextDay = new Date(time);
            nextDay.setDate(nextDay.getDate() + 1);
            nextDay.setHours(0, 0, 0, 0);
            time = nextDay.getTime();
          }
        }
        return null;
      };

      schedule.forEach((cron) => {
        const runDate = getNextRunFromCron(cron, now);
        if (runDate && (!next || runDate < next)) {
          next = runDate;
        }
      });
    }

    if (!next) return "Not Scheduled";

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const targetDay = new Date(next);
    targetDay.setHours(0, 0, 0, 0);

    const time = next
      .toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
      .toUpperCase();

    if (targetDay.getTime() === today.getTime()) {
      return `Today ${time}`;
    }

    if (targetDay.getTime() === tomorrow.getTime()) {
      return `Tomorrow ${time}`;
    }

    const date = next.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    return `${date}, ${time}`;
  }

  const getAlerts = async (searchValue = "", sort = " ", filters = defaultAlertFilters, pageNumber = 1, limit = 10) => {

    if (fetchingRef.current) return;   // prevent double call
    fetchingRef.current = true;

    if (pageNumber === 1) {
      setLoading(true);
    }
    try {

      const res = await fetchAlertList(searchValue, sort, filters, pageNumber, limit);

      if (res?.data) {
        const formatted = res?.data.alerts.map((item) => ({
          id: item.id,
          name: item.name,
          status: item.status ? "Active" : "Inactive",
          description: item.description || "",
          entityType: item.entity || "-",
          scope: (() => {
            if (!item.selected_filters) return "0 Items";
            const total = Object.values(item.selected_filters).reduce((acc, curr) => {
              return acc + (Array.isArray(curr) ? curr.length : 0);
            }, 0);
            return `${total} Items`;
          })(),
          condition: formatConditions(item.or_conditions),
          trigger: `${item?.alert_history?.length ?? "0"} Times`,

          nextRun: getNextRun(item.schedule),
          lastTriggered: item.alert_history && item.alert_history.length > 0
            ? new Date(item.alert_history[0].createdAt).toLocaleString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            }).toUpperCase()
            : "Not Triggered",
          createdBy: item.created_by || "null",
          createdAt: (item.created_at || item.createdAt) ? new Date(item.created_at || item.createdAt).toLocaleString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          }).toUpperCase() : "-",
          is_delete: item.is_delete,
          checked: false,
          alert_history: item.alert_history || [],
          timeRange: item.time_range,
          raw: item,
        }));

        if (pageNumber === 1) {
          setAlerts(formatted);
        } else {
          setAlerts(prev => [...prev, ...formatted]);
        }
        setCounts(res.data.counts);
        if (formatted.length < 10) {
          setHasMore(false);
        }
      }

    } catch (error) {
      console.log("Error fetching alerts:", error);
    }
    finally {
      fetchingRef.current = false;
      setLoading(false); // stop loading
      setLoadingMore(false);
    }
  };

  //sort popup
  const SortPopup = ({ open, onSelect, onClose }) => {
    if (!open) return null;

    return (
      <div className="w-[165px] absolute right-1 mt-[2px]  bg-white flex flex-col gap-[8px] p-3 z-50 border border-[#EEEEEE] rounded-[8px] shadow-lg">

        <div
          className="flex items-center gap-[6px] cursor-pointer hover:bg-gray-100 rounded-lg"
          onClick={() => {
            trackCustomEvent(
              EVENTS.SORT,
              { order: "ASC", label: "Oldest to Newest" },
              ENTITY_TYPE.ALERT,
              {
                ...trackerContext,
                component_type: TRACKING_COMPONENT.DROPDOWN,
              }
            );
            onSelect("ASC");
            onClose();
          }}
        >
          <FontAwesomeIcon icon={faArrowUpWideShort} className="w-3 h-3" />
          <span className="text-sm text-[#000000]">Oldest to Newest</span>
        </div>

        <div
          className="flex items-center gap-[6px]  cursor-pointer hover:bg-gray-100 rounded-lg"
          onClick={() => {
            trackCustomEvent(
              EVENTS.SORT,
              { order: "DESC", label: "Newest to Oldest" },
              ENTITY_TYPE.ALERT,
              {
                ...trackerContext,
                component_type: TRACKING_COMPONENT.DROPDOWN,
              }
            );
            onSelect("DESC");
            onClose();
          }}
        >
          <FontAwesomeIcon icon={faArrowDownWideShort} className="w-3 h-3" />
          <span className="text-sm text-[#000000]">Newest to Oldest</span>
        </div>

      </div>
    );
  };

  //status toggle
  const StatusToggle = ({ status, onToggle }) => {
    return (
      <div className="flex items-center bg-[#FFFFFF] border border-[#F2F2F2] rounded-1 shadow-[0_2px_10px_0_rgba(0,0,0,0.08)] rounded-lg p-[5px] gap-1 w-fit">
        <button
          onClick={() => onToggle(true)}
          className={`px-[10px] py-1 text-sm font-medium rounded-1 transition ${status
            ? "bg-[#EBFFEB] text-[#24B224]"
            : "text-[#000000]"
            }`}
        >
          Active
        </button>

        <button
          onClick={() => onToggle(false)}
          className={`px-[10px] py-1 text-sm font-medium rounded-1 transition ${!status
            ? "bg-[#F7F7F7] text-red-500"
            : "text-[#000000]"
            }`}
        >
          Inactive
        </button>
      </div>
    );
  };

  const handleStatusClick = (alert, status) => {
    trackCustomEvent(
      EVENTS.TOGGLE_BUTTON,
      { item: alert.name, id: alert.id, status: status ? "Active" : "Inactive" },
      ENTITY_TYPE.STATUS_CHANGE,
      {
        ...trackerContext,
        component_type: TRACKING_COMPONENT.TOGGLE_BUTTON,
      }
    );
    setSelectedId(alert.id);
    setNewStatus(status);
    setConfirmOpen(true);
  };

  const confirmStatusChange = async () => {
    trackCustomEvent(
      EVENTS.APPLY,
      { action: "confirm_status_change", status: newStatus ? "Active" : "Inactive", id: selectedId },
      ENTITY_TYPE.CONFIRMATION,
      {
        ...trackerContext,
        component_type: TRACKING_COMPONENT.BUTTON,
      }
    );
    try {

      await updateAlertStatus({
        alert_id: selectedId,
        status: newStatus
      });

      setAlerts(prev =>
        prev.map(alert =>
          alert.id === selectedId
            ? { ...alert, status: newStatus ? "Active" : "Inactive" }
            : alert
        )
      );

      setToastMessageHandler("Status updated successfully", true);

    } catch (err) {

      setToastMessageHandler("Failed to update status", false);

    }

    setConfirmOpen(false);
  };


  const selectedAlerts = alerts.filter((alert) => alert.checked);
  const hasSelection = selectedAlerts.length > 0;

  const statsData = [
    {
      title: "Active Alerts",
      value: counts.activeAlertCount,
      icon: "/assets/images/alert-images/alertactive.svg",
    },
    {
      title: "Triggered Today",
      value: counts.todayTriggerCount,
      icon: "/assets/images/alert-images/alertnotification.svg",
    },
    {
      title: "Alerts Sent This Month",
      value: counts.monthTriggerCount,
      icon: "/assets/images/alert-images/alertshare.svg",
    },
    {
      title: "Alerts With Issues",
      value: counts.issueCount,
      icon: "/assets/images/alert-images/alertcircle.svg",
    },
  ];

  const StatCard = ({ title, value, icon }) => {
    return (
      <div className="bg-white rounded-[12px] border p-4 flex gap-4 cursor-pointer border-[#D9D9D9]">
        <div className="w-[52px] h-[52px] bg-[#F7F7F7] rounded-lg flex items-center justify-center">
          <img src={icon} alt="icon" className="w-5 h-5" />
        </div>


        <div className="flex flex-col gap-[10px] w-full">
          <p className="text-base text-[#000000] font-medium">{title}</p>

          <div className="flex items-center justify-between w-full">

            <div className="text-lg font-bold text-[#161A1D]">
              {value}
            </div>

            {title === "Alerts With Issues" && value !== 0 && (
              <p className="ml-auto bg-[#FFF9E5] px-3 py-2 text-[#E5BA39] text-sm font-medium rounded-[22px]">
                Action Required
              </p>
            )}

          </div>
        </div>
      </div>
    );
  };


  const toggleCheckbox = (id) => {
    const alert = alerts.find((a) => a.id === id);
    const willBeChecked = alert ? !alert.checked : true;
    trackCustomEvent(
      EVENTS.CHECKBOX,
      { item: alert?.name, id, checked: willBeChecked },
      ENTITY_TYPE.ALERT,
      {
        ...trackerContext,
        component_type: TRACKING_COMPONENT.CHECKBOX,
      }
    );
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === id ? { ...alert, checked: !alert.checked } : alert
      )
    );
  };


  const handleDeleteClick = (id) => {
    const alert = alerts.find((a) => a.id === id);
    trackCustomEvent(
      EVENTS.POPUP_OPEN,
      { action: "delete_alert_dialog", id, name: alert?.name },
      ENTITY_TYPE.CONFIRMATION,
      {
        ...trackerContext,
        component_type: TRACKING_COMPONENT.BUTTON,
      }
    );
    setSelectedId(id);
    setDeleteConfirmOpen(true);
  };

  const handleDelete = async () => {
    trackCustomEvent(
      EVENTS.DELETE,
      { action: "delete_alert", id: selectedId },
      ENTITY_TYPE.CONFIRMATION,
      {
        ...trackerContext,
        component_type: TRACKING_COMPONENT.BUTTON,
      }
    );
    try {
      const res = await deleteAlert(selectedId);

      if (res?.status?.code === 200) {

        dispatch(
          setToastMessageHandler(res?.status?.message || "Alert deleted successfully", true)
        );

        setAlerts(prev => prev.filter(alert => alert.id !== selectedId));

        await getAlerts();

      } else {

        dispatch(
          setToastMessageHandler(res?.status?.message || "Something went wrong", false)
        );

      }

    } catch (error) {

      dispatch(
        setToastMessageHandler(
          error?.res?.status?.message || "Something went wrong",
          false
        )
      );
    } finally {
      setDeleteConfirmOpen(false);
      setSelectedId(null);
    }
  };

  const handleBulkDeleteClick = () => {
    trackCustomEvent(
      EVENTS.POPUP_OPEN,
      { action: "bulk_delete_dialog", count: selectedAlerts.length, ids: selectedAlerts.map((a) => a.id) },
      ENTITY_TYPE.CONFIRMATION,
      {
        ...trackerContext,
        component_type: TRACKING_COMPONENT.BUTTON,
      }
    );
    setBulkDeleteConfirmOpen(true);
  };

  const handleBulkDelete = async () => {
    trackCustomEvent(
      EVENTS.DELETE,
      { action: "bulk_delete", count: selectedAlerts.length, ids: selectedAlerts.map((a) => a.id) },
      ENTITY_TYPE.CONFIRMATION,
      {
        ...trackerContext,
        component_type: TRACKING_COMPONENT.BUTTON,
      }
    );
    try {
      const selectedIds = alerts
        .filter((alert) => alert.checked)
        .map((alert) => alert.id);

      if (selectedIds.length === 0) return;

      const res = await bulkDeleteAlert(selectedIds);

      if (res?.status?.code === 200) {

        dispatch(
          setToastMessageHandler(res?.status?.message || "Action successful", true)
        );
        await getAlerts(); // refresh only after success

      } else {

        dispatch(
          setToastMessageHandler(res?.status?.message || "Something went wrong", false)
        );
      }

    } catch (error) {

      dispatch(
        setToastMessageHandler(error?.res?.status?.message || "Something went wrong", false)
      );
      console.error("Bulk delete error:", error);

    } finally {
      setBulkDeleteConfirmOpen(false);
    }
  };

  const handleDuplicate = async (alertId) => {
    const alert = alerts.find((a) => a.id === alertId);
    trackCustomEvent(
      EVENTS.BUTTON_CLICK,
      { action: "duplicate_alert", id: alertId, name: alert?.name },
      ENTITY_TYPE.ALERT,
      {
        ...trackerContext,
        component_type: TRACKING_COMPONENT.BUTTON,
      }
    );
    try {
      const res = await duplicateAlert(alertId);

      if (res?.status?.code === 200) {
        // setOpenId(null);

        dispatch(
          setToastMessageHandler(res?.status?.message || "Action successful", true)
        );
        await getAlerts();

      } else {

        dispatch(
          setToastMessageHandler(res?.status?.message || "Something went wrong", false)
        );
      }

    } catch (err) {


      dispatch(
        setToastMessageHandler(err?.res?.status?.message || "Duplicate failed", false)
      );
      console.error("Duplicate failed:", err);
    }
  };
  const handleBulkDuplicate = async () => {
    trackCustomEvent(
      EVENTS.BUTTON_CLICK,
      { action: "bulk_duplicate", count: selectedAlerts.length, ids: selectedAlerts.map((a) => a.id) },
      ENTITY_TYPE.BULK_ACTION,
      {
        ...trackerContext,
        component_type: TRACKING_COMPONENT.BUTTON,
      }
    );
    try {
      const ids = selectedAlerts.map((a) => a.id);
      if (ids.length === 0) return;

      const res = await bulkDuplicateAlert(ids);

      if (res?.status?.code === 200) {

        dispatch(
          setToastMessageHandler(res?.status?.message || "Action successful", true)
        );

        await getAlerts(); // refresh only after success

      } else {


        dispatch(
          setToastMessageHandler(res?.status?.message || "Something went wrong", false)
        );
      }

    } catch (err) {


      dispatch(
        setToastMessageHandler(err?.res?.status?.message || "Duplicates failed", false)
      );

      console.error("Bulk duplicate failed:", err);

    }
  };

  useEffect(() => {
    // console.log("alertsalerts", alerts);
  }, [alerts])
  useEffect(() => {

    const delay = setTimeout(() => {
      setLoading(true);
      setPage(1);          // reset pagination
      setAlerts([]);       // clear old alerts
      setHasMore(true);

      getAlerts(alertSearch, alertSort, alertFilters, 1, ALERT_PAGE_LIMIT);

    }, 300);

    return () => clearTimeout(delay);

  }, [alertSearch, alertSort, alertFilters]);

  useEffect(() => {

    if (page === 1) return; // already fetched above

    getAlerts(alertSearch, alertSort, alertFilters, page, ALERT_PAGE_LIMIT);


  }, [page]);

  // useEffect(() => {

  //   function handleClickOutside(e) {

  //     if (menuRef.current && !menuRef.current.contains(e.target)) {
  //       setOpenId(null);
  //     }

  //     if (sortRef.current && !sortRef.current.contains(e.target)) {
  //       setOpenSort(false);
  //     }

  //   }

  //   document.addEventListener("mousedown", handleClickOutside);

  //   return () => document.removeEventListener("mousedown", handleClickOutside);

  // }, []);


  useEffect(() => {
    // Try container ref first, fall back to window
    const scrollEl = scrollContainerRef.current || window;

    const handleScroll = () => {
      let scrollTop, windowHeight, fullHeight;

      if (scrollEl === window) {
        scrollTop = window.scrollY;
        windowHeight = window.innerHeight;
        fullHeight = document.documentElement.scrollHeight;
      } else {
        scrollTop = scrollEl.scrollTop;
        windowHeight = scrollEl.clientHeight;
        fullHeight = scrollEl.scrollHeight;
      }

      // console.log({ scrollTop, windowHeight, fullHeight, loadingMore, hasMore });

      if (
        scrollTop + windowHeight >= fullHeight - 200 &&
        !loadingMore &&
        hasMore && !fetchingRef.current
      ) {
        trackCustomEvent(
          EVENTS.PAGINATE,
          { page: page + 1, limit: ALERT_PAGE_LIMIT },
          ENTITY_TYPE.ALERT,
          {
            ...trackerContext,
            component_type: TRACKING_COMPONENT.TABLE,
          }
        );
        setLoadingMore(true);
        setPage((prev) => prev + 1);
      }
    };

    scrollEl.addEventListener("scroll", handleScroll);
    return () => scrollEl.removeEventListener("scroll", handleScroll);
  }, [loadingMore, hasMore]);

  return (
    <div className="min-h-screen overflow-y-auto max-h-screen" ref={scrollContainerRef}>
      <Toast></Toast>
      {/* <LocalToast toast={toast} /> */}
      {!fullHistory && (
        <div className="flex flex-col gap-3 bg-[#FFFFFF] border border-[#EAEAEA] rounded-[12px]">
          {/* HEADER */}
          <div className="flex items-center justify-between p-4 border-b border-[#EAEAEA]">

            <h2 className="text-2xl font-semibold text-gray-900">
              Alert Dashboard
            </h2>
            <div className="flex gap-[14px]">
              <div className="flex gap-[10px] items-center justify-center">
                <img src="/assets/images/alert-images/alertnotification.svg" className="w-5 h-5" />
                <img src="/assets/images/alert-images/alertcircle-question-mark.svg" className="w-5 h-5" />
              </div>
              <button
                className="flex items-center gap-2 px-4 py-2 bg-[#0081F7] text-white rounded-lg"
                onClick={() => {
                  trackCustomEvent(
                    EVENTS.BUTTON_CLICK,
                    { action: "create_new_alert" },
                    ENTITY_TYPE.ALERT,
                    {
                      ...trackerContext,
                      component_type: TRACKING_COMPONENT.BUTTON,
                    }
                  );
                  history.push("/alert-control/create");
                }}
              >
                <FontAwesomeIcon icon={faPlus} className="w-4 h-4" />
                Create New Alert
              </button>
            </div>
          </div>
          <div className="px-4 py-4 flex flex-col gap-3 bg-[#FFFFFF]">
            <div className="grid grid-cols-4 gap-4">
              {statsData.map((item, index) => (
                <StatCard key={index} {...item} />
              ))}
            </div>
            <>
              <div className="flex justify-between items-center">


                <div className="flex items-center gap-3">

                  {/* Search */}
                  <div className="relative flex-1 max-w-sm">
                    <FontAwesomeIcon
                      icon={faMagnifyingGlass}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4"
                    />

                    <input
                      type="text"
                      placeholder="Search alerts..."
                      //value={search}
                      value={alertSearch}
                      // onChange={(e) => setSearch(e.target.value)}
                      onChange={(e) => setAlertSearch(e.target.value)}
                      onBlur={(e) => {
                        if (e.target.value?.trim()) {
                          trackCustomEvent(
                            EVENTS.SEARCH,
                            { search_term: e.target.value },
                            ENTITY_TYPE.ALERT,
                            {
                              ...trackerContext,
                              component_type: TRACKING_COMPONENT.INPUT,
                            }
                          );
                        }
                      }}
                      className="w-full pl-10 pr-4 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                </div>


                <div className="flex items-center gap-4">

                  {/* Sort */}
                  <div className="relative" ref={sortRef}>
                    <button
                      className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                      onClick={() => {
                        trackCustomEvent(
                          !openSort ? EVENTS.POP_OVER_OPEN : EVENTS.POP_OVER_CLOSE,
                          { type: "sort_dropdown" },
                          ENTITY_TYPE.ALERT,
                          {
                            ...trackerContext,
                            component_type: TRACKING_COMPONENT.BUTTON,
                          }
                        );
                        setOpenSort(!openSort);
                      }}
                    >
                      <img src="/assets/images/alert-images/alertsort.svg" className="w-4 h-4" />
                      <span className="text-sm font-medium">Sort</span>
                    </button>

                    <SortPopup
                      open={openSort}
                      onSelect={(order) => {
                        // setSortOrder(order);
                        setAlertSort(order);
                        setOpenSort(false);
                      }}
                      onClose={() => setOpenSort(false)}
                    />
                  </div>

                  {/* Bulk actions */}
                  {hasSelection && (
                    <div className="flex gap-3 items-center">
                      <img
                        src="/assets/images/alert-images/alertcopy.svg"
                        className="w-5 h-5 cursor-pointer"
                        onClick={handleBulkDuplicate}
                      />

                      <img
                        src="/assets/images/alert-images/alerttrash.svg"
                        className="w-5 h-5 cursor-pointer"
                        onClick={handleBulkDeleteClick}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                {alerts.length === 0 ? (

                  <div className="w-full text-center py-10 text-gray-500 text-sm font-medium">
                    No alerts found
                  </div>

                ) : (
                  alerts.map((alert) => {
                    const conditionParts = alert.condition
                      ?.replace(/[()]/g, "")
                      ?.split(/\s+OR\s+/);   // better split

                    return (
                      <div
                        key={alert.id}
                        className="bg-white rounded-lg border border-[#D9D9D9] p-5"
                      >
                        <div className="flex items-start gap-4">
                          <input
                            type="checkbox"
                            checked={alert.checked}
                            onChange={() => toggleCheckbox(alert.id)}
                            className="mt-1 w-4 h-4"
                          />

                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-3 relative mt-[-8px]">
                              <div className="flex items-center gap-3">
                                <h3 className="text-base font-semibold text-[#000000D9]">
                                  {alert.name}
                                </h3>

                                {/* <span
                              className={`px-2 py-1 text-xs font-medium rounded ${alert.status === "Active"
                                ? "bg-[#EBFFEB] text-[#24B224]"
                                : "bg-gray-100 text-gray-700"
                                }`}
                            >
                              {alert.status}
                            </span> */}
                                <StatusToggle
                                  status={alert.status === "Active"}
                                  onToggle={(status) => handleStatusClick(alert, status)}

                                />
                              </div>

                              {/* <button
                                className="p-1 hover:bg-gray-100 rounded"
                                onClick={() =>
                                  setOpenId(openId === alert.id ? null : alert.id)
                                }
                              >
                                <FontAwesomeIcon
                                  icon={faEllipsisVertical}
                                  className="text-gray-600 w-4 h-4"
                                />
                              </button>

                              {openId === alert.id && ( */}
                              <div
                                // ref={menuRef}
                                className="flex right-0 py-2"
                              >
                                <button className="flex items-center gap-3 px-4 py-2 w-full hover:bg-gray-100 text-left text-[#000000] text-sm" onClick={() => {
                                  trackCustomEvent(
                                    EVENTS.BUTTON_CLICK,
                                    { action: "edit_alert", id: alert.id, name: alert.name },
                                    ENTITY_TYPE.ALERT,
                                    {
                                      ...trackerContext,
                                      component_type: TRACKING_COMPONENT.BUTTON,
                                    }
                                  );
                                  history.push("/alert-control/edit", {
                                    edit_alert: alert.raw
                                  });
                                }}
                                >
                                  <img
                                    src="/assets/images/alert-images/alertgrayedit.svg"
                                    className="w-3 h-3"
                                  />
                                  Edit
                                </button>

                                <button className="flex items-center gap-3 px-4 py-2 w-full hover:bg-gray-100 text-left text-[#000000] text-sm" onClick={() => handleDuplicate(alert.id)}>
                                  <img
                                    src="/assets/images/alert-images/alertgraycopy.svg"
                                    className="w-3 h-3"
                                  />
                                  Duplicate
                                </button>

                                <button className="flex items-center gap-3 px-4 py-2 w-full hover:bg-gray-100 text-left text-[#000000] text-sm" onClick={() => handleDeleteClick(alert.id)}>
                                  <img
                                    src="/assets/images/alert-images/alertgraytrash.svg"
                                    className="w-3 h-3"
                                  />
                                  Delete
                                </button>
                              </div>
                              {/* )} */}
                            </div>

                            <p className="text-sm text-[#000000A6] mb-3 text-start font-medium">
                              {alert.description}
                            </p>

                            <div className="grid grid-cols-4 gap-6 mb-3">
                              <div className="text-start">
                                <div className="text-sm text-[#000000A6] font-medium mb-1">
                                  Entity Type
                                </div>
                                <div className="text-base font-medium text-[#000000D9]">
                                  {alert.entityType}
                                </div>
                              </div>

                              <div className="text-start">
                                <div className="text-sm text-[#000000A6] font-medium mb-1">
                                  Scope
                                </div>
                                <div
                                  className={`text-base font-medium text-[#0081F7] w-fit underline ${alert.raw.selected_filters && Object.values(alert.raw.selected_filters).some(arr => Array.isArray(arr) && arr.length > 0)
                                    ? "cursor-pointer hover:underline"
                                    : ""
                                    }`}
                                  onClick={() => {
                                    const hasFilters = alert.raw.selected_filters && Object.values(alert.raw.selected_filters).some(arr => Array.isArray(arr) && arr.length > 0);
                                    if (hasFilters) {
                                      trackCustomEvent(
                                        EVENTS.POPUP_OPEN,
                                        { action: "view_scope", id: alert.id, name: alert.name, scope: alert.scope },
                                        ENTITY_TYPE.POPUP,
                                        {
                                          ...trackerContext,
                                          component_type: TRACKING_COMPONENT.LINK,
                                        }
                                      );
                                      setSelectedScopeAlert(alert.raw);
                                      setIsScopeModalOpen(true);
                                    }
                                  }}
                                >
                                  {alert.scope}
                                </div>
                              </div>

                              <div className="text-start">
                                <div className="text-sm text-[#000000A6] font-medium mb-1">
                                  Conditions Match
                                  {/* {alert.alert_history && alert.alert_history.length > 0 && (alert.raw.createdAt || alert.raw.created_at) ? `(${getTimeElapsed(alert.raw.createdAt || alert.raw.created_at)})` : ""} */}
                                </div>
                                <div className="text-base font-medium text-[#000000D9]">
                                  {alert.trigger}
                                </div>
                              </div>

                              <div className="text-start">
                                <div className="text-sm text-[#000000A6] font-medium mb-1">
                                  Next Run
                                </div>
                                <div className="text-base font-medium text-[#000000D9]">
                                  {alert.nextRun}
                                </div>
                              </div>

                              {/* <div className="text-start">
                            <div className="text-sm text-[#000000A6] font-medium mb-1">
                              Last Triggered
                            </div>
                            <div className="text-base font-medium text-[#000000D9]">
                              {alert.lastTriggered}
                            </div>
                          </div> */}
                            </div>

                            <div className="text-sm text-gray-500 flex gap-2 flex-wrap items-center">
                              <p>Condition:</p>
                              {/* <span className="px-2 py-1 bg-[#FFF9E5] text-[#DFB022] rounded font-medium text-xs">
                            {alert.condition}
                          </span> */}

                              {/* {alert.timeRange && (
                                <span className="px-2 py-1 bg-[#E8F0FE] text-[#1A73E8] rounded font-medium text-xs">
                                  {alert.timeRange === "1" ? "yesterday" : `last ${alert.timeRange} days`}
                                </span>
                              )} */}

                              {conditionParts.map((cond, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 bg-[#FFF9E5] text-[#DFB022] rounded font-medium text-xs"
                                >
                                  {cond.trim()}
                                </span>
                              ))}
                            </div>
                            <div className="flex items-center justify-between mt-3">
                              <div className="flex items-center gap-1 font-medium text-sm text-[#000000A6]">
                                {/* <img
                                  src="/assets/images/alert-images/alertclock.svg"
                                  className="w-[14px] h-[14px]"
                                /> */}
                                {calenderIcon}
                                Date Range : {alert.timeRange && (
                                  <span className="px-2 py-1 bg-[#E8F0FE] text-[#1A73E8] rounded font-medium text-xs">
                                    {alert?.timeRange?.toString() === "1001" ? "Month To Date" : alert?.timeRange?.toString() == "180" ? "Maximum" : alert.timeRange === "1" ? "yesterday" : `last ${alert.timeRange} days`}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center justify-between mt-3">
                              {/* <div className="flex items-center gap-1 font-medium text-sm text-[#000000A6]">
                            <img
                              src="/assets/images/alert-images/alertclock.svg"
                              className="w-[14px] h-[14px]"
                            />
                            Created by{" "}
                            {alert.createdBy}
                          </div> */}

                              <div className="flex items-center gap-1 font-medium text-sm text-[#000000A6]">
                                <img
                                  src="/assets/images/alert-images/alertclock.svg"
                                  className="w-[14px] h-[14px]"
                                />
                                Last Triggered: {alert.lastTriggered} • Created by{" "}
                                {alert.createdBy} • Created On: {alert.createdAt}
                              </div>

                              <button
                                className="flex items-center gap-1 text-sm text-[#0081F7] font-medium"
                                onClick={() => {
                                  trackCustomEvent(
                                    EVENTS.POPUP_OPEN,
                                    { action: "view_alert_history", id: alert.id, name: alert.name },
                                    ENTITY_TYPE.POPUP,
                                    {
                                      ...trackerContext,
                                      component_type: TRACKING_COMPONENT.BUTTON,
                                    }
                                  );
                                  setHistoryData(alert.alert_history || []);
                                  setSelectedId(alert.id); // store selected alert id if needed
                                  setSelectedAlert(alert.raw); // New state to store raw alert data
                                  setSelectedFormattedAlert(alert);
                                  setIsHistoryOpen(true);
                                }}
                              >
                                View History
                                <FontAwesomeIcon
                                  icon={faChevronRight}
                                  className="w-4 h-4"
                                />
                              </button>
                            </div>
                          </div>
                        </div>

                      </div>
                    )

                  })
                )}
              </div>
            </>
          </div>
        </div>
      )}
      {isHistoryOpen && !fullHistory && (

        <AlertHistoryModal
          historyData={historyData}
          alertData={selectedAlert}
          formattedAlertData={selectedFormattedAlert}
          setCloseHistory={() => {
            setIsHistoryOpen(false);
            // setHistoryData([]);
          }}
          setFullHistory={setFullHistory}
          trackerContext={trackerContext}
        />

      )}

      {fullHistory && (

        <AlertHistory
          setFullHistory={setFullHistory}
          historyData={historyData}
          alertData={selectedAlert}
          formattedAlertData={selectedFormattedAlert}
          trackerContext={trackerContext}
        />

      )}

      <ScopeModal
        isOpen={isScopeModalOpen}
        onClose={() => {
          setIsScopeModalOpen(false);
          setSelectedScopeAlert(null);
        }}
        alertData={selectedScopeAlert}
        trackerContext={trackerContext}
      />

      <ConfirmDialog
        open={confirmOpen}
        title={`Are you sure you want to ${newStatus ? "activate" : "inactivate"
          } this alert?`}
        onConfirm={confirmStatusChange}
        onCancel={() => {
          trackCustomEvent(
            EVENTS.CANCEL,
            { action: "cancel_status_change", id: selectedId },
            ENTITY_TYPE.CONFIRMATION,
            {
              ...trackerContext,
              component_type: TRACKING_COMPONENT.BUTTON,
            }
          );
          setConfirmOpen(false);
        }}
      />

      <ConfirmDialog
        open={deleteConfirmOpen}
        title="Are you sure you want to delete this alert?"
        onConfirm={handleDelete}
        onCancel={() => {
          trackCustomEvent(
            EVENTS.CANCEL,
            { action: "cancel_delete_alert", id: selectedId },
            ENTITY_TYPE.CONFIRMATION,
            {
              ...trackerContext,
              component_type: TRACKING_COMPONENT.BUTTON,
            }
          );
          setDeleteConfirmOpen(false);
        }}
      />

      <ConfirmDialog
        open={bulkDeleteConfirmOpen}
        title="Are you sure you want to delete these alerts?"
        onConfirm={handleBulkDelete}
        onCancel={() => {
          trackCustomEvent(
            EVENTS.CANCEL,
            { action: "cancel_bulk_delete", count: selectedAlerts.length },
            ENTITY_TYPE.CONFIRMATION,
            {
              ...trackerContext,
              component_type: TRACKING_COMPONENT.BUTTON,
            }
          );
          setBulkDeleteConfirmOpen(false);
        }}
      />
    </div>
  );
}
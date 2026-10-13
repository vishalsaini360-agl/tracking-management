import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import moment from "moment";
import { getMinMaxDate } from "../services/ebux.service";
import { safeJsonParse } from "../../../utils/helpers";

const optionsDate = [
  { label: "Last 7 days", value: '7' },
  { label: "Last 15 Days", value: '15' },
  { label: "Last 30 Days", value: '30' },
];

const MinMaxDateContext = createContext();

const getWeekFromDate = (targetDate) => {
  const today = moment().startOf('day');
  const targetM = moment(targetDate).startOf('day');

  let lastWeekMonday = targetM.clone().startOf("isoWeek").startOf('day');
  let lastWeekSunday = lastWeekMonday.clone().endOf("isoWeek").endOf('day');
  if (lastWeekSunday > today) {
    lastWeekMonday = targetM.clone().startOf("isoWeek").subtract(1, "week").startOf('day');
    lastWeekSunday = lastWeekMonday.clone().endOf("isoWeek").endOf('day');
  }
  return {
    weekOfYear: lastWeekMonday.isoWeek(),
    year: lastWeekMonday.isoWeekYear(),
    start: lastWeekMonday.startOf('day').format("YYYY-MM-DD"),
    end: lastWeekSunday.endOf('day').format("YYYY-MM-DD"),
  };
};

export const MinMaxDateProvider = ({ children }) => {
  const [activeClientProject, setActiveClientProject] = useState(
    safeJsonParse(localStorage.getItem("active_client_project"), {})
  );
  const [loading, setLoading] = useState(true);
  const [isApiCalled, setIsApiCalled] = useState(false);

  const [minDate, setMinDate] = useState(
    activeClientProject?.minDate ? new Date(activeClientProject?.minDate) : null
  );
  const [maxDate, setMaxDate] = useState(
    activeClientProject?.maxDate ? new Date(activeClientProject?.maxDate) : null
  );

  const initialMaxDate = activeClientProject?.maxDate
    ? new Date(activeClientProject?.maxDate)
    : new Date(moment().subtract(1, "days").format("YYYY-MM-DD"));
  const initialLastDays = (optionsDate?.[0]?.value ?? 7) - 1;
  const initialEndDate = moment(initialMaxDate).format("YYYY-MM-DD");
  const initialStartDate = moment(initialEndDate).subtract(initialLastDays, "days").format("YYYY-MM-DD");
  const initialPreviousEndDate = moment(initialStartDate).subtract(1, "days").format("YYYY-MM-DD");
  const initialPreviousStartDate = moment(initialPreviousEndDate).subtract(initialLastDays, "days").format("YYYY-MM-DD");
  const initialLastActiveWeek = getWeekFromDate(initialMaxDate);
  const initialPreviousWeek = getWeekFromDate(moment(initialMaxDate).subtract(1, "weeks"));
  const initialSelectedWeeks = {
    current: [initialLastActiveWeek],
    compare: [initialPreviousWeek],
    isCompareToPrevious: Boolean(activeClientProject?.isUseWidget),
  };

  const [dateState, setDateState] = useState({
    max_date: initialMaxDate,
    lastDays: initialLastDays,
    endDate: initialEndDate,
    startDate: initialStartDate,
    previousEndDate: initialPreviousEndDate,
    previousStartDate: initialPreviousStartDate,
    lastActiveWeek: initialLastActiveWeek,
    selectedWeeks: initialSelectedWeeks,
  });

  useEffect(() => {
    const checkLocalStorageProj = () => {
      try {
        const storedProj = safeJsonParse(localStorage.getItem("active_client_project"), {});
        if (storedProj?.client_project_id && storedProj?.client_project_id !== activeClientProject?.client_project_id) {
          setActiveClientProject(storedProj);
        }
      } catch (e) {
        console.error("Error reading localStorage in MinMaxDateProvider:", e);
      }
    };

    checkLocalStorageProj();
    window.addEventListener("storage", checkLocalStorageProj);
    const interval = setInterval(checkLocalStorageProj, 500);

    return () => {
      window.removeEventListener("storage", checkLocalStorageProj);
      clearInterval(interval);
    };
  }, [activeClientProject?.client_project_id]);

  const fetchMinMaxDate = useCallback(async () => {
    try {
      setLoading(true);
      const activeProj = safeJsonParse(localStorage.getItem("active_client_project"), {});
      const currentProj = activeProj?.client_project_id ? activeProj : activeClientProject;

      if (!currentProj?.client_project_id) {
        setLoading(false);
        setIsApiCalled(false);
        return;
      }

      const res = await getMinMaxDate();
      if (res) {
        const fetchedMin = res.minDate || res.min_date || null;
        const fetchedMax = res.maxDate || res.max_date || null;

        if (fetchedMin) {
          setMinDate(new Date(fetchedMin));
        }

        let parsedMaxDate = null;
        if (fetchedMax) {
          parsedMaxDate = new Date(fetchedMax);
          setMaxDate(parsedMaxDate);
        }

        const currentMaxDate = parsedMaxDate
          ? parsedMaxDate
          : currentProj?.maxDate
            ? new Date(currentProj?.maxDate)
            : new Date(moment().subtract(1, "days").format("YYYY-MM-DD"));

        const lastDays = (optionsDate?.[0]?.value ?? 7) - 1;
        const endDate = moment(currentMaxDate).format("YYYY-MM-DD");
        const startDate = moment(endDate).subtract(lastDays, "days").format("YYYY-MM-DD");
        const previousEndDate = moment(startDate).subtract(1, "days").format("YYYY-MM-DD");
        const previousStartDate = moment(previousEndDate).subtract(lastDays, "days").format("YYYY-MM-DD");

        const lastActiveWeek = getWeekFromDate(currentMaxDate);
        const previousWeek = getWeekFromDate(moment(currentMaxDate).subtract(1, "weeks"));
        const isCompareToPrevious = Boolean(currentProj?.isUseWidget || activeClientProject?.isUseWidget);
        const selectedWeeks = {
          current: [lastActiveWeek],
          compare: [previousWeek],
          isCompareToPrevious,
        };

        setDateState({
          max_date: currentMaxDate,
          lastDays,
          endDate,
          startDate,
          previousEndDate,
          previousStartDate,
          lastActiveWeek,
          selectedWeeks,
        });

        if (fetchedMin || fetchedMax) {
          setActiveClientProject((prev) => {
            const updated = {
              ...prev,
              ...(fetchedMin ? { minDate: fetchedMin } : {}),
              ...(fetchedMax ? { maxDate: fetchedMax } : {}),
            };
            localStorage.setItem("active_client_project", JSON.stringify(updated || {}));
            return updated;
          });
        }
        setIsApiCalled(true);
      }
    } catch (err) {
      console.error("Failed to load min-max date in MinMaxDateProvider:", err);
    } finally {
      setLoading(false);
    }
  }, [activeClientProject?.client_project_id]);

  useEffect(() => {
    fetchMinMaxDate();
  }, [fetchMinMaxDate]);

  const activeProjCheck = safeJsonParse(localStorage.getItem("active_client_project"), {});
  const hasClientProjectId = Boolean(activeProjCheck?.client_project_id || activeClientProject?.client_project_id);

  if (hasClientProjectId && (!isApiCalled || loading)) {
    return (
      <div className="w-full h-screen grid justify-items-stretch align-middle">
        <img
          className="w-1/6 justify-self-center inline-block align-middle mt-48 "
          src="/assets/images/egenie.gif"
          alt="loader"
        />
      </div>
    );
  }

  return (
    <MinMaxDateContext.Provider
      value={{
        minDateCtx: minDate,
        maxDateCtx: maxDate,
        fetchMinMaxDateCtx: fetchMinMaxDate,
        max_dateCtx: dateState.max_date,
        endDateCtx: dateState.endDate,
        startDateCtx: dateState.startDate,
        previousEndDateCtx: dateState.previousEndDate,
        previousStartDateCtx: dateState.previousStartDate,
        lastActiveWeekCtx: dateState.lastActiveWeek,
        selectedWeeksCtx: dateState.selectedWeeks,
      }}
    >
      {children}
    </MinMaxDateContext.Provider>
  );
};

export const useMinMaxDateContext = () => useContext(MinMaxDateContext);
export const minMaxDateProvider = MinMaxDateProvider;
export default MinMaxDateProvider;

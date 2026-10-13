
// import { useEffect, useState, useRef } from "react";
// import AlertHeader from "../AlertCreation/AlertHeader";
// import AlertFooter from "../AlertCreation/AlertFooter";
// import EntityComponent from "../AlertCreation/EntityComponent";
// import UniverseComponent from "../AlertCreation/UniverseComponent";
// import ConditionComponent from "../AlertCreation/ConditionComponent";
// import PreviewComponent from "../AlertCreation/PreviewComponent";
// import ScheduleComponent from "../AlertCreation/ScheduleComponent";
// import SuccessModal from "../AlertCreation/SuccessModal"; 
// import { useEbuxContext } from "../../../Context/EbuxProvider";
// import { saveAlert, editAlert } from "../services/service";
// import { useLocation, useHistory } from "react-router-dom";


// const DAY_MAP = {
//   Sunday: 0,
//   Monday: 1,
//   Tuesday: 2,
//   Wednesday: 3,
//   Thursday: 4,
//   Friday: 5,
//   Saturday: 6
// };
// const DAY_REVERSE_MAP = {
//   0: "Sunday",
//   1: "Monday",
//   2: "Tuesday",
//   3: "Wednesday",
//   4: "Thursday",
//   5: "Friday",
//   6: "Saturday"
// };

// const init_schedule = {
//   type: "daily", // continuous | daily | custom
//   mode: "", // weekly | monthly | datewise
//   weekly: {},
//   monthly: [],
//   datewise: []
// };

// export default function AlertControl() {
//   const {
//     // selectedFilters,
//     // filters,
//     initKpiSet
//   } = useEbuxContext();
//   useEffect(() => {
//     initKpiSet("OSA");
//   }, []);

//   const location = useLocation();
//   const history = useHistory();
//   const edit_alert = location.state?.edit_alert || null;

//   const [activeStep, setActiveStep] = useState(0);
//   const [alertControlObj, setAlertControlObj] = useState({
//     kpi: "OSA",
//     name: "",
//     desc: "",
//     entity: "Products",
//     items: {
//       selectedBrand: [],
//       selectedCategory: [],
//       selectedPlatform: [],
//       selectedLocation: [],
//       selectedProductId: []
//     },
//     conditions: [[{ type: null, metric: "", operator: "", value: "", continuity: "" }]],
//     metricType: null // "Product" or "Keyword"
//   });

//   const scheduleRef = useRef(null);
//   const [schedule, setSchedule] = useState(init_schedule);
//   const [initSchedule, setInitSchedule] = useState(init_schedule);
//   const [showSuccessModal, setShowSuccessModal] = useState(false);

//   useEffect(() => {
//     if (edit_alert) {
//       setAlertControlObj({
//         ...alertControlObj,
//         name: edit_alert.name || "",
//         desc: edit_alert.desc || "",
//         entity: edit_alert.entity || "Products",
//         items: edit_alert.items || alertControlObj.items,
//         conditions: edit_alert.conditions || alertControlObj.conditions,
//         metricType: edit_alert.metricType || null,
//         delivery: edit_alert.delivery || alertControlObj.delivery
//       });

//       const parsedSchedule = edit_alert.schedule ? parseCrontabToSchedule(edit_alert.schedule) : init_schedule;
//       setSchedule(parsedSchedule);
//       setInitSchedule(parsedSchedule);
//     }
//   }, [edit_alert]);

//   function parseCrontabToSchedule(crons = []) {
//     // CONTINUOUS
//     if (crons.length === 1 && crons[0] === "0 */2 * * *") {
//       return {
//         type: "continuous",
//         mode: "",
//         weekly: {},
//         datewise: [{ day: "", times: [""] }]
//       };
//     }

//     // DAILY
//     if (crons.length === 1 && crons[0] === "0 0 * * *") {
//       return {
//         type: "daily",
//         mode: "",
//         weekly: {},
//         datewise: [{ day: "", times: [""] }]
//       };
//     }

//     const weekly = {};
//     const monthlyMap = {};
//     const datewiseMap = {};

//     crons.forEach(expr => {
//       const [m, h, d, month, w] = expr.split(" ");
//       const time = `${h.padStart(2, "0")}:${m.padStart(2, "0")}`;

//       if (w !== "*") {
//         const day = DAY_REVERSE_MAP[w];
//         if (!weekly[day]) weekly[day] = [];
//         weekly[day].push({ time });
//       } else if (month !== "*") {
//         const dateKey = `${month}-${d}`;
//         if (!datewiseMap[dateKey]) datewiseMap[dateKey] = [];
//         datewiseMap[dateKey].push(time);
//       } else if (d !== "*") {
//         if (!monthlyMap[d]) monthlyMap[d] = [];
//         monthlyMap[d].push(time);
//       }
//     });

//     if (Object.keys(weekly).length > 0) {
//       return {
//         type: "custom",
//         mode: "weekly",
//         weekly,
//         monthly: [],
//         datewise: []
//       };
//     }

//     if (Object.keys(monthlyMap).length > 0) {
//       return {
//         type: "custom",
//         mode: "monthly",
//         weekly: {},
//         monthly: Object.entries(monthlyMap).map(([day, times]) => ({
//           day: Number(day),
//           times
//         })),
//         datewise: []
//       };
//     }

//     return {
//       type: "custom",
//       mode: "datewise",
//       weekly: {},
//       monthly: [],
//       datewise: Object.entries(datewiseMap).map(([dateKey, times]) => {
//         const [m, d] = dateKey.split("-");
//         const currentYear = new Date().getFullYear();
//         const date = new Date(currentYear, Number(m) - 1, Number(d));
//         return {
//           day: date.toISOString(),
//           times
//         };
//       })
//     };
//   }

//   function buildCrontab(schedule, timezone = "Asia/Kolkata") {
//     const crons = [];

//     // CONTINUOUS → every 2 hours
//     if (schedule.type === "continuous") {
//       crons.push({
//         expression: "0 */2 * * *",
//         timezone,
//         type: "continuous"
//       });
//       return crons;
//     }

//     // DAILY → midnight
//     if (schedule.type === "daily") {
//       crons.push({
//         expression: "0 0 * * *",
//         timezone,
//         type: "daily"
//       });
//       return crons;
//     }

//     // WEEKLY
//     if (schedule.type === "custom" && schedule.mode === "weekly") {
//       Object.entries(schedule.weekly).forEach(([day, times]) => {
//         times.forEach(({ time }) => {
//           if (!time) return;
//           const [h, m] = time.split(":");
//           crons.push({
//             expression: `${m} ${h} * * ${DAY_MAP[day]}`,
//             timezone,
//             type: "weekly"
//           });
//         });
//       });
//     }

//     // MONTHLY
//     if (schedule.type === "custom" && schedule.mode === "monthly") {
//       schedule.monthly.forEach(({ times, day }) => {
//         if (!day) return;
//         times.forEach(time => {
//           if (!time) return;
//           const [h, m] = time.split(":");
//           crons.push({
//             expression: `${m} ${h} ${day} * *`,
//             timezone,
//             type: "monthly"
//           });
//         });
//       });
//     }

//     // DATEWISE
//     if (schedule.type === "custom" && schedule.mode === "datewise") {
//       schedule.datewise.forEach(({ times, day }) => {
//         if (!day) return;
//         const date = new Date(day);
//         const d = date.getDate();
//         const month = date.getMonth() + 1;
//         times.forEach(time => {
//           if (!time) return;
//           const [h, m] = time.split(":");
//           crons.push({
//             expression: `${m} ${h} ${d} ${month} *`,
//             timezone,
//             type: "datewise"
//           });
//         });
//       });
//     }

//     return crons;
//   }

//   const { selectedFiltersWidget } = useEbuxContext();

//   const steps = [
//     "Entity",
//     "Universe",
//     "Conditions",
//     "Preview",
//     "Schedule",
//   ];

//   const handleNext = () => {
//     if (activeStep < steps.length - 1) {
//       if (activeStep === 1) {
//         // Consolidate items from UniverseComponent
//         setAlertControlObj(prev => ({
//           ...prev,
//           items: {
//             selectedBrand: selectedFiltersWidget?.selectedBrand || [],
//             selectedCategory: selectedFiltersWidget?.selectedCategory || [],
//             selectedPlatform: selectedFiltersWidget?.selectedPlatform || [],
//             selectedLocation: selectedFiltersWidget?.selectedLocation || [],
//             selectedProductId: selectedFiltersWidget?.selectedProductId || []
//           }
//         }));
//       }
//       setActiveStep(prev => prev + 1);
//     } else {
//       if (!alertControlObj.name?.trim()) {
//         alert("Alert Name is required");
//         return;
//       }

//       // Validate schedule if on the last step
//       if (scheduleRef.current) {
//         const isValid = scheduleRef.current.handleSave();
//         if (!isValid) return;
//       }

//       const crontab = buildCrontab(schedule);
//       console.log("Final Alert Data:", alertControlObj);
//       const payload = {
//         name: alertControlObj.name,
//         desc: alertControlObj.desc,
//         entity: alertControlObj.entity,
//         items: alertControlObj.items,
//         conditions: alertControlObj.conditions,
//         metricType: alertControlObj.metricType,
//         schedule: crontab.map(c => c.expression),
//         delivery: alertControlObj.delivery,
//         client_code: localStorage.getItem("client_code"),
//         user_id: localStorage.getItem("user_id"),
//         account_id: localStorage.getItem("client_id")
//       };

//       const apiCall = edit_alert ? editAlert({ id: edit_alert.id, ...payload }) : saveAlert(payload);

//       apiCall.then(res => {
//         if (res.status) {
//           setShowSuccessModal(true);
//         } else {
//           alert(`Failed to ${edit_alert ? "update" : "save"} alert: ` + (res.message || "Unknown error"));
//         }
//       }).catch(err => {
//         console.error("Error saving alert:", err);
//         alert("An error occurred while saving the alert.");
//       });
//     }
//   };

//   const handleModalClose = () => {
//     setShowSuccessModal(false);
//     history.push("/alert-control");
//   };

//   const handleCreateAnother = () => {
//     setShowSuccessModal(false);
//     setActiveStep(0);
//     setAlertControlObj({
//       kpi: "OSA",
//       name: "",
//       desc: "",
//       entity: "Products",
//       items: {
//         selectedBrand: [],
//         selectedCategory: [],
//         selectedPlatform: [],
//         selectedLocation: [],
//         selectedProductId: []
//       },
//       conditions: [[{ type: null, metric: "", operator: "", value: "", continuity: "" }]],
//       metricType: null
//     });
//     setSchedule(init_schedule);
//     setInitSchedule(init_schedule);
//   };

//   const handleBack = () => {
//     if (activeStep > 0) {
//       setActiveStep(prev => prev - 1);
//     }
//   };

//   const isNextDisabled = (() => {
//     if (activeStep === 2) {
//       // Conditions step: check if any condition has missing fields
//       const METRICS_WITHOUT_CONTINUITY = [
//         "On-Shelf Availability Percentage",
//         "Promotion Percentage",
//         "Product Ratings",
//         "Selling Price",
//         "Maximum Retail Price"
//       ];

//       return alertControlObj.conditions.some(group =>
//         group.some(cond => {
//           const isMetricMissing = !cond.metric;
//           const isOperatorMissing = !cond.operator;
//           const isValueMissing = cond.value === "" || cond.value === undefined || cond.value === null;

//           const isBasicMissing = isMetricMissing || isOperatorMissing || isValueMissing;
//           const isContinuityMissing = !METRICS_WITHOUT_CONTINUITY.includes(cond.metric) && (cond.continuity === "" || cond.continuity === undefined || cond.continuity === null);

//           return isBasicMissing || isContinuityMissing;
//         })
//       );
//     }
//     if (activeStep === 4) {
//       // Final step: check if alert name, recipients, and frequency are selected
//       const isNameMissing = !alertControlObj.name?.trim();
//       const isDeliveryMissing = !alertControlObj.delivery?.type;
//       const isRecipientsMissing = !alertControlObj.delivery?.recipients || alertControlObj.delivery.recipients.length === 0;

//       // Schedule (Frequency) validation
//       let isFrequencyInvalid = false;
//       if (!schedule.type) {
//         isFrequencyInvalid = true;
//       } else if (schedule.type === "custom") {
//         if (schedule.mode === "weekly") {
//           // Check if at least one day is selected
//           isFrequencyInvalid = !schedule.weekly || Object.values(schedule.weekly).every(v => !v);
//         } else if (schedule.mode === "monthly") {
//           // Check if at least one day is selected
//           isFrequencyInvalid = !schedule.monthly || schedule.monthly.length === 0;
//         } else if (schedule.mode === "datewise") {
//           // Check if at least one date is selected
//           isFrequencyInvalid = !schedule.datewise || schedule.datewise.length === 0;
//         } else {
//           // Custom selected but no mode or invalid mode
//           isFrequencyInvalid = true;
//         }
//       }

//       return isNameMissing || isDeliveryMissing || isRecipientsMissing || isFrequencyInvalid;
//     }
//     return false;
//   })();

//   console.log('alertControlObj', alertControlObj)
//   return (
//     <div className="w-full min-h-screen p-6 bg-gray-100">
//       <div className="max-w-full mx-auto rounded-lg bg-white shadow-sm border border-gray-200">

//         {/* Header */}
//         <AlertHeader activeStep={activeStep} />

//         {/* Middle Dynamic Content */}
//         <div className="p-8 min-h-[300px]">
//           {activeStep === 0 && <div><EntityComponent alertControlObj={alertControlObj} setAlertControlObj={setAlertControlObj} /></div>}
//           {activeStep === 1 && <div><UniverseComponent alertControlObj={alertControlObj} setAlertControlObj={setAlertControlObj} /></div>}
//           {activeStep === 2 && <div><ConditionComponent alertControlObj={alertControlObj} setAlertControlObj={setAlertControlObj} /></div>}
//           {activeStep === 3 && <div><PreviewComponent alertControlObj={alertControlObj} /></div>}
//           {activeStep === 4 && <div><ScheduleComponent alertControlObj={alertControlObj} setAlertControlObj={setAlertControlObj} schedule={schedule} initSchedule={initSchedule} setSchedule={setSchedule} ref={scheduleRef} edit_alert={edit_alert} /></div>}
//         </div>

//         {/* Footer */}
//         <AlertFooter
//           activeStep={activeStep}
//           handleNext={handleNext}
//           handleBack={handleBack}
//           isNextDisabled={isNextDisabled}
//         />

//       </div>

//       <SuccessModal
//         isOpen={showSuccessModal}
//         onClose={handleModalClose}
//         onCreateAnother={handleCreateAnother}
//         nextRunDate={schedule.type === "continuous" ? "today at 2:00 PM" : null}
//       />

//     </div>
//   );
// }

import { useEffect, useState, useRef } from "react";
import AlertHeader from "../AlertCreation/AlertHeader";
import AlertFooter from "../AlertCreation/AlertFooter";
import EntityComponent from "../AlertCreation/EntityComponent";
import UniverseComponent from "../AlertCreation/UniverseComponent";
import ConditionComponent from "../AlertCreation/ConditionComponent";
import PreviewComponent from "../AlertCreation/PreviewComponent";
import ScheduleComponent from "../AlertCreation/ScheduleComponent";
import SuccessModal from "../AlertCreation/SuccessModal";
import { useEbuxContext } from "../../../Context/EbuxProvider";
import { saveAlert } from "../services/service";
import { useLocation, useHistory } from "react-router-dom";
// import DiscardModal from "./DiscardModal";
import ConfirmDialog from "../ConfirmDialog";
import { useAlertContext } from "../Context/AlertProvider";
import Loader from "../../Loader";
import {
  moduleMap,
  ENTITY_TYPE,
  EVENTS,
  TRACKING_COMPONENT,
  trackCustomEvent,
} from "../../../../../tracker";
import { safeJsonParse } from "../../../../../utils/helpers";


const DAY_MAP = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6
};
const DAY_REVERSE_MAP = {
  0: "Sunday",
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday"
};

const init_schedule = {
  type: "daily", // continuous | daily | custom
  mode: "", // weekly | monthly | datewise
  weekly: {},
  monthly: [],
  datewise: []
};

export default function AlertControl() {
  const {
    // selectedFilters,
    // filters,
    initKpiSet,
    selectedFiltersWidget,
    setSelectedFiltersWidget
  } = useEbuxContext();

  const location = useLocation();
  const history = useHistory();
  const edit_alert = location.state?.edit_alert || null;

  const trackerContext = {
    module: moduleMap.alert,
    page_name: edit_alert ? "Alert Edit" : "Alert Create",
    widget_name: ENTITY_TYPE.CREATE_ALERT,
  };

  const [activeStep, setActiveStep] = useState(0);
  const [alertControlObj, setAlertControlObj] = useState({
    kpi: "OSA",
    name: "",
    desc: "",
    entity: "Products",
    time_range: "1",
    items: {
      selectedBrand: [],
      selectedCategory: [],
      selectedPlatform: [],
      selectedLocation: [],
      selectedProductId: [],
      selectedCompetitionBrand: [],
      selectedCompetitionProductId: [],
      selectedKeywordCategory: [],
      selectedKeyword: [],
      selectedTags: [],
      selectedTagsKW: [],
      selected_keyword_type: [],
      selectedRange: [],

      //      status: [],
      // entity: [],
      // conditions: [],
      // lastTriggered: [],
      // createdBy:[],
      // scheduling: {
      //   nextRun: [],
      //   frequency: []
      // },
    },
    conditions: [[{ type: null, metric: "", operator: "", value: "", continuity: "" }]],
    metricType: null // "Product" or "Keyword"
  });

  const { initFilterLoad, isAlertLoading } = useAlertContext();

  useEffect(() => {
    // if (initKpiSet && alertControlObj.kpi) {
    //   initKpiSet(alertControlObj.kpi);
    // }
    initFilterLoad();
  }, [alertControlObj.kpi]);

  useEffect(() => {
    const isKeyword = alertControlObj.metricType === "Keyword" || alertControlObj.entity === "Keywords" || alertControlObj.entity === "Keyword";
    const newKpi = isKeyword ? "SOS" : "OSA";

    if (alertControlObj.kpi !== newKpi) {
      setAlertControlObj(prev => ({ ...prev, kpi: newKpi }));
    }
  }, [alertControlObj.metricType, alertControlObj.entity, alertControlObj.kpi, initKpiSet]);

  const scheduleRef = useRef(null);
  const [schedule, setSchedule] = useState(init_schedule);
  const [initSchedule, setInitSchedule] = useState(init_schedule);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showDiscardModal, setShowDiscardModal] = useState(false);


  useEffect(() => {
    if (edit_alert) {
      setAlertControlObj({
        ...alertControlObj,
        name: edit_alert.name || "",
        id: edit_alert.id,
        desc: edit_alert.description || "",
        entity: edit_alert.entity || "Products",
        time_range: edit_alert.time_range || alertControlObj.time_range,
        items: edit_alert.selected_filters || alertControlObj.items,
        conditions: edit_alert.or_conditions || alertControlObj.conditions,
        metricType: edit_alert.metric_type || alertControlObj.metricType || null,
        delivery: edit_alert.delivery || {
          type: "email",
          recipients: Array.isArray(edit_alert.email_recipients)
            ? edit_alert.email_recipients
            : edit_alert.email_recipients
              ? [edit_alert.email_recipients]
              : []
        },
        kpi: edit_alert.kpi || alertControlObj.kpi || (edit_alert.metric_type === "Product" ? "OSA" : "SOS"),
        breakdown: edit_alert.breakdown || []
      });

      if (edit_alert.selected_filters && setSelectedFiltersWidget) {
        setSelectedFiltersWidget(prev => ({
          ...prev,
          ...edit_alert.selected_filters,
          selectedBrandCompetition: edit_alert.selected_filters.selectedCompetitionBrand || [],
          selectedProductCompetition: edit_alert.selected_filters.selectedCompetitionProductId || [],
          selectedTags: edit_alert.selected_filters.selectedTags || [],
          selectedTagsKW: edit_alert.selected_filters.selectedTagsKW || []
        }));
      }

      const parsedSchedule = edit_alert.schedule ? parseCrontabToSchedule(edit_alert.schedule) : init_schedule;
      setSchedule(parsedSchedule);
      setInitSchedule(parsedSchedule);
    } else {
      if (setSelectedFiltersWidget) {
        setSelectedFiltersWidget({
          selectedBrand: [],
          selectedCategory: [],
          selectedPlatform: [],
          selectedLocation: [],
          selectedProductId: [],
          selectedKeywordCategory: [],
          selectedKeyword: [],
          selectedTags: [],
          selectedTagsKW: [],
          selectedRange: []
        });
      }
    }
  }, [edit_alert, setSelectedFiltersWidget]);

  function parseCrontabToSchedule(crons = []) {
    // CONTINUOUS
    if (crons.length === 1 && crons[0] === "0 */2 * * *") {
      return {
        type: "continuous",
        mode: "",
        weekly: {},
        datewise: [{ day: "", times: [""] }]
      };
    }

    // DAILY
    if (crons.length === 1 && crons[0] === "0 9 * * *") {
      return {
        type: "daily",
        mode: "",
        weekly: {},
        datewise: [{ day: "", times: [""] }]
      };
    }

    const weekly = {};
    const monthlyMap = {};
    const datewiseMap = {};

    crons.forEach(expr => {
      const [m, h, d, month, w] = expr.split(" ");
      const time = `${h.padStart(2, "0")}:${m.padStart(2, "0")}`;

      if (w !== "*") {
        const day = DAY_REVERSE_MAP[w];
        if (!weekly[day]) weekly[day] = [];
        weekly[day].push({ time });
      } else if (month !== "*") {
        const dateKey = `${month}-${d}`;
        if (!datewiseMap[dateKey]) datewiseMap[dateKey] = [];
        datewiseMap[dateKey].push(time);
      } else if (d !== "*") {
        if (!monthlyMap[d]) monthlyMap[d] = [];
        monthlyMap[d].push(time);
      }
    });

    if (Object.keys(weekly).length > 0) {
      return {
        type: "custom",
        mode: "weekly",
        weekly,
        monthly: [],
        datewise: []
      };
    }

    if (Object.keys(monthlyMap).length > 0) {
      return {
        type: "custom",
        mode: "monthly",
        weekly: {},
        monthly: Object.entries(monthlyMap).map(([day, times]) => ({
          day: Number(day),
          times
        })),
        datewise: []
      };
    }

    return {
      type: "custom",
      mode: "datewise",
      weekly: {},
      monthly: [],
      datewise: Object.entries(datewiseMap).map(([dateKey, times]) => {
        const [m, d] = dateKey.split("-");
        const currentYear = new Date().getFullYear();
        const date = new Date(currentYear, Number(m) - 1, Number(d));
        return {
          day: date.toISOString(),
          times
        };
      })
    };
  }

  function buildCrontab(schedule, timezone = "Asia/Kolkata") {
    const crons = [];

    // CONTINUOUS → every 2 hours
    if (schedule.type === "continuous") {
      crons.push({
        expression: "0 */2 * * *",
        timezone,
        type: "continuous"
      });
      return crons;
    }

    // DAILY → 9am
    if (schedule.type === "daily") {
      crons.push({
        expression: "0 9 * * *",
        timezone,
        type: "daily"
      });
      return crons;
    }

    // WEEKLY
    if (schedule.type === "custom" && schedule.mode === "weekly") {
      Object.entries(schedule.weekly).forEach(([day, times]) => {
        times.forEach(({ time }) => {
          if (!time) return;
          const [h, m] = time.split(":");
          crons.push({
            expression: `${m} ${h} * * ${DAY_MAP[day]}`,
            timezone,
            type: "weekly"
          });
        });
      });
    }

    // MONTHLY
    if (schedule.type === "custom" && schedule.mode === "monthly") {
      schedule.monthly.forEach(({ times, day }) => {
        if (!day) return;
        times.forEach(time => {
          if (!time) return;
          const [h, m] = time.split(":");
          crons.push({
            expression: `${m} ${h} ${day} * *`,
            timezone,
            type: "monthly"
          });
        });
      });
    }

    // DATEWISE
    if (schedule.type === "custom" && schedule.mode === "datewise") {
      schedule.datewise.forEach(({ times, day }) => {
        if (!day) return;
        const date = new Date(day);
        const d = date.getDate();
        const month = date.getMonth() + 1;
        times.forEach(time => {
          if (!time) return;
          const [h, m] = time.split(":");
          crons.push({
            expression: `${m} ${h} ${d} ${month} *`,
            timezone,
            type: "datewise"
          });
        });
      });
    }

    return crons;
  }

  const steps = [
    "Entity",
    "Universe",
    "Conditions",
    "Preview",
    "Schedule",
  ];

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      trackCustomEvent(
        EVENTS.BUTTON_CLICK,
        {
          action: "next_step",
          current_step: steps[activeStep],
          next_step: steps[activeStep + 1],
          component: TRACKING_COMPONENT.BUTTON,
        },
        "Alert Footer",
        trackerContext
      );
      if (activeStep === 1) {
        // Consolidate items from UniverseComponent
        setAlertControlObj(prev => ({
          ...prev,
          items: {
            selectedBrand: selectedFiltersWidget?.selectedBrand || [],
            selectedCategory: selectedFiltersWidget?.selectedCategory || [],
            selectedPlatform: selectedFiltersWidget?.selectedPlatform || [],
            selectedLocation: selectedFiltersWidget?.selectedLocation || [],
            selectedProductId: selectedFiltersWidget?.selectedProductId || [],
            selectedCompetitionBrand: selectedFiltersWidget?.selectedBrandCompetition || [],
            selectedCompetitionProductId: selectedFiltersWidget?.selectedProductCompetition || [],
            selectedKeywordCategory: selectedFiltersWidget?.selectedKeywordCategory || [],
            selectedKeyword: selectedFiltersWidget?.selectedKeyword || [],
            selectedTags: selectedFiltersWidget?.selectedTags || [],
            selectedTagsKW: selectedFiltersWidget?.selectedTagsKW || [],
            selected_keyword_type: selectedFiltersWidget?.selected_keyword_type || [],
            selectedRange: selectedFiltersWidget?.selectedRange || []
            //          status:  [],
            // entity:  [],
            // conditions:  [],
            // lastTriggered:  [],
            // createdBy:[],
            // scheduling:  {
            //   nextRun: [],
            //   frequency: []
            // }
          }


        }));
      }
      setActiveStep(prev => prev + 1);
    } else {
      if (!alertControlObj.name?.trim()) {
        alert("Alert Name is required");
        return;
      }

      // Validate schedule if on the last step
      if (scheduleRef.current) {
        const isValid = scheduleRef.current.handleSave();
        if (!isValid) return;
      }

      trackCustomEvent(
        edit_alert ? EVENTS.SAVE : EVENTS.BUTTON_CLICK,
        {
          action: edit_alert ? "update_alert" : "create_alert",
          alert_name: alertControlObj.name,
          component: TRACKING_COMPONENT.BUTTON,
        },
        "Alert Footer",
        trackerContext
      );

      const crontab = buildCrontab(schedule);
      // console.log("Final Alert Data:", alertControlObj);

      const filteredItems = Object.fromEntries(
        Object.entries(alertControlObj.items || {}).filter((entries) => Array.isArray(entries[1]) && entries[1].length > 0)
      );

      const activeClientProject = safeJsonParse(localStorage.getItem("active_client_project"), {});
      const payload = {
        id: alertControlObj.id,
        name: alertControlObj.name,
        desc: alertControlObj.desc,
        entity: alertControlObj.entity,
        items: filteredItems,
        conditions: alertControlObj.conditions,
        metricType: alertControlObj.metricType,
        time_range: alertControlObj.time_range,
        schedule: crontab.map(c => c.expression),
        delivery: alertControlObj.delivery,
        breakdown: alertControlObj.breakdown || [],
        client_code: localStorage.getItem("client_code"),
        user_id: localStorage.getItem("user_id"),
        account_id: localStorage.getItem("client_id"),
        user_name: localStorage.getItem("full_name"),
        client_project_es_id: activeClientProject?.client_project_es_id
      };

      const apiCall = edit_alert ? saveAlert({ id: edit_alert.id, ...payload }) : saveAlert(payload);

      apiCall.then(res => {
        if (res.status) {
          setShowSuccessModal(true);
        } else {
          alert(`Failed to ${edit_alert ? "update" : "save"} alert: ` + (res.message || "Unknown error"));
        }
      }).catch(err => {
        console.error("Error saving alert:", err);
        alert("An error occurred while saving the alert.");
      });
    }
  };

  const handleModalClose = () => {
    trackCustomEvent(
      EVENTS.POPUP_CLOSE,
      {
        action: "close_success_modal",
        component: TRACKING_COMPONENT.BUTTON,
      },
      "Success Modal",
      trackerContext
    );
    setShowSuccessModal(false);
    history.push("/alert-control");
  };

  const handleCreateAnother = () => {
    trackCustomEvent(
      EVENTS.BUTTON_CLICK,
      {
        action: "create_another_alert",
        component: TRACKING_COMPONENT.BUTTON,
      },
      "Success Modal",
      trackerContext
    );
    setShowSuccessModal(false);
    setActiveStep(0);
    setAlertControlObj({
      kpi: "OSA",
      name: "",
      desc: "",
      entity: "Products",
      time_range: "1",
      items: {
        selectedBrand: [],
        selectedCategory: [],
        selectedPlatform: [],
        selectedLocation: [],
        selectedProductId: [],
        selectedCompetitionBrand: [],
        selectedCompetitionProductId: [],
        selectedKeywordCategory: [],
        selectedKeyword: [],
        selectedTags: [],
        selectedTagsKW: [],
        selected_keyword_type: [],
        selectedRange: []
      },
      conditions: [[{ type: null, metric: "", operator: "", value: "", continuity: "" }]],
      metricType: null
    });
    setSchedule(init_schedule);
    setInitSchedule(init_schedule);
    if (setSelectedFiltersWidget) {
      setSelectedFiltersWidget({
        selectedBrand: [],
        selectedCategory: [],
        selectedPlatform: [],
        selectedLocation: [],
        selectedProductId: [],
        selectedBrandCompetition: [],
        selectedProductCompetition: [],
        selectedKeywordCategory: [],
        selectedKeyword: [],
        selectedTags: [],
        selectedTagsKW: [],
        selected_keyword_type: [],
        selectedRange: []
      });
    }
  };

  // const handleBack = () => {
  //   if (activeStep > 0) {
  //     setActiveStep(prev => prev - 1);
  //   }
  // };

  const validateStep = (stepIndex) => {
    if (stepIndex === 2) {
      // Conditions step: check if any condition has missing fields
      return !alertControlObj.conditions.some(group =>
        group.some(cond => {
          const isMetricMissing = !cond.metric;
          const isOperatorMissing = !cond.operator;
          const isRangeOp = cond.operator === "between" || cond.operator === "not_between" || (([">=", "<="].includes(cond.operator)) && String(cond.value || "").includes(","));
          let isValueMissing = cond.value === "" || cond.value === undefined || cond.value === null;
          if (isRangeOp) {
            const vals = String(cond.value || "").split(",");
            isValueMissing = !vals[0] || !vals[1];
          }

          const isBasicMissing = isMetricMissing || isOperatorMissing || isValueMissing;

          let isContinuityMissing = false;
          if (cond.metric === "Out-of-Stocks Days") {
            isContinuityMissing = cond.continuity === "" || cond.continuity === undefined || cond.continuity === null;
          }

          return isBasicMissing || isContinuityMissing;
        })
      );
    }
    if (stepIndex === 4) {
      // Final step: check if alert name, recipients, and frequency are selected
      const isNameMissing = !alertControlObj.name?.trim();
      const isDeliveryMissing = !alertControlObj.delivery?.type;
      const isRecipientsMissing = !alertControlObj.delivery?.recipients || alertControlObj.delivery.recipients.length === 0;

      // Schedule (Frequency) validation
      let isFrequencyValid = true;
      if (!schedule.type) {
        isFrequencyValid = false;
      } else if (schedule.type === "custom") {
        if (schedule.mode === "weekly") {
          isFrequencyValid = schedule.weekly && Object.values(schedule.weekly).some(v => v);
        } else if (schedule.mode === "monthly") {
          isFrequencyValid = schedule.monthly && schedule.monthly.length > 0;
        } else if (schedule.mode === "datewise") {
          isFrequencyValid = schedule.datewise && schedule.datewise.length > 0;
        } else {
          isFrequencyValid = false;
        }
      }

      return !(isNameMissing || isDeliveryMissing || isRecipientsMissing || !isFrequencyValid);
    }
    return true; // Other steps are valid by default
  };

  const isNextDisabled = !validateStep(activeStep);

  const handleStepClick = (index) => {
    trackCustomEvent(
      EVENTS.TAB_SWITCH,
      {
        action: `switch_step_to_${steps[index]}`,
        step_index: index,
        step_name: steps[index],
        component: TRACKING_COMPONENT.TAB,
      },
      "Alert Stepper",
      trackerContext
    );

    if (index < activeStep) {
      setActiveStep(index);
    } else {
      // Check if all steps between current and target are valid
      for (let i = activeStep; i < index; i++) {
        if (!validateStep(i)) return; // Stop if any intermediate step is invalid

        // Handle side effects of passing through specific steps (like step 1 to 2)
        if (i === 1) {
          setAlertControlObj(prev => ({
            ...prev,
            items: {
              selectedBrand: selectedFiltersWidget?.selectedBrand || [],
              selectedCategory: selectedFiltersWidget?.selectedCategory || [],
              selectedPlatform: selectedFiltersWidget?.selectedPlatform || [],
              selectedLocation: selectedFiltersWidget?.selectedLocation || [],
              selectedProductId: selectedFiltersWidget?.selectedProductId || [],
              selectedCompetitionBrand: selectedFiltersWidget?.selectedBrandCompetition || [],
              selectedCompetitionProductId: selectedFiltersWidget?.selectedProductCompetition || [],
              selectedKeywordCategory: selectedFiltersWidget?.selectedKeywordCategory || [],
              selectedKeyword: selectedFiltersWidget?.selectedKeyword || [],
              selectedTags: selectedFiltersWidget?.selectedTags || [],
              selectedTagsKW: selectedFiltersWidget?.selectedTagsKW || [],
              selected_keyword_type: selectedFiltersWidget?.selected_keyword_type || [],
              selectedRange: selectedFiltersWidget?.selectedRange || []
            }
          }));
        }
      }
      setActiveStep(index);
    }
  };

  // console.log('alertControlObj', alertControlObj)
  return (
    <div className="w-full min-h-screen p-6 bg-gray-100">
      <Loader show={isAlertLoading} fullScreen={true} />
      <div className="max-w-full mx-auto rounded-lg bg-white shadow-sm border border-gray-200">

        {/* Header */}
        <AlertHeader activeStep={activeStep} onStepClick={handleStepClick} />

        {/* Middle Dynamic Content */}
        <div className="px-6 min-h-[300px]">
          {activeStep === 0 && <div><EntityComponent alertControlObj={alertControlObj} setAlertControlObj={setAlertControlObj} trackerContext={trackerContext} /></div>}
          {activeStep === 1 && <div><UniverseComponent alertControlObj={alertControlObj} setAlertControlObj={setAlertControlObj} trackerContext={trackerContext} /></div>}
          {activeStep === 2 && <div><ConditionComponent alertControlObj={alertControlObj} setAlertControlObj={setAlertControlObj} trackerContext={trackerContext} /></div>}
          {activeStep === 3 && <div><PreviewComponent alertControlObj={alertControlObj} setAlertControlObj={setAlertControlObj} trackerContext={trackerContext} /></div>}
          {activeStep === 4 && <div><ScheduleComponent alertControlObj={alertControlObj} setAlertControlObj={setAlertControlObj} schedule={schedule} initSchedule={initSchedule} setSchedule={setSchedule} ref={scheduleRef} edit_alert={edit_alert} trackerContext={trackerContext} /></div>}
        </div>

        {/* Footer */}
        <AlertFooter
          activeStep={activeStep}
          handleNext={handleNext}
          // handleBack={handleBack}
          isNextDisabled={isNextDisabled}
          isEdit={!!edit_alert}
          handleDiscard={() => {
            trackCustomEvent(
              EVENTS.BUTTON_CLICK,
              {
                action: "discard_alert_click",
                component: TRACKING_COMPONENT.BUTTON,
              },
              "Alert Footer",
              trackerContext
            );
            setShowDiscardModal(true);
          }}
        />


      </div>

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleModalClose}
        onCreateAnother={handleCreateAnother}
        nextRunDate={schedule.type === "continuous" ? "today at 2:00 PM" : null}
      />

      {/* <DiscardModal
        isOpen={showDiscardModal}
        onClose={() => setShowDiscardModal(false)}
        onDiscard={() => {
          setShowDiscardModal(false);
          history.push("/alert-control");
        }}
      /> */}
      <ConfirmDialog
        open={showDiscardModal}
        title="Discard Alert"
        onConfirm={() => {
          trackCustomEvent(
            EVENTS.BUTTON_CLICK,
            {
              action: "discard_alert_confirm",
              component: TRACKING_COMPONENT.BUTTON,
            },
            "Discard Alert",
            trackerContext
          );
          setShowDiscardModal(false);
          history.push("/alert-control");
        }}
        onCancel={() => {
          trackCustomEvent(
            EVENTS.CANCEL,
            {
              action: "discard_alert_cancel",
              component: TRACKING_COMPONENT.BUTTON,
            },
            "Discard Alert",
            trackerContext
          );
          setShowDiscardModal(false);
        }}
      />

    </div>
  );
}
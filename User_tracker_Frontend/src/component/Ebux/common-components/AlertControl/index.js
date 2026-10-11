// import { useEffect, useState, useRef } from "react";
// import AlertHeader from "./AlertCreation/AlertHeader";
// import AlertFooter from "./AlertCreation/AlertFooter";
// import EntityComponent from "./AlertCreation/EntityComponent";
// import UniverseComponent from "./AlertCreation/UniverseComponent";
// import ConditionComponent from "./AlertCreation/ConditionComponent";
// import PreviewComponent from "./AlertCreation/PreviewComponent";
// import ScheduleComponent from "./AlertCreation/ScheduleComponent";
// import { useEbuxContext } from "../../Context/EbuxProvider";
// import { saveAlert, editAlert } from "./services/service";
// import { useLocation, useHistory } from "react-router-dom";
import AlertListing from "./AlertListing";
import { useParams } from "react-router-dom";
import AlertCreation from './AlertCreation';
import { AlertProvider } from "./Context/AlertProvider";
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
//   type: "continuous", // continuous | daily | custom
//   mode: "", // weekly | monthly | datewise
//   weekly: {},
//   monthly: [],
//   datewise: []
// };

export default function AlertControl() {
  // const {
  //   // selectedFilters,
  //   // filters,
  //   initKpiSet
  // } = useEbuxContext();
  // useEffect(() => {
  //   initKpiSet("OSA");
  // }, []);

  // const location = useLocation();
  // const history = useHistory();
  // const edit_alert = location.state?.edit_alert || null;

  // const [activeStep, setActiveStep] = useState(0);
  // const [alertControlObj, setAlertControlObj] = useState({
  //   kpi: "OSA",
  //   name: "",
  //   desc: "",
  //   entity: "Products",
  //   items: {
  //     selectedBrand: [],
  //     selectedCategory: [],
  //     selectedPlatform: [],
  //     selectedLocation: [],
  //     selectedProductId: []
  //   },
  //   conditions: [[{ type: null }]],
  //   metricType: null // "Product" or "Keyword"
  // });

  // const scheduleRef = useRef(null);
  // const [schedule, setSchedule] = useState(init_schedule);
  // const [initSchedule, setInitSchedule] = useState(init_schedule);

  // useEffect(() => {
  //   if (edit_alert) {
  //     setAlertControlObj({
  //       ...alertControlObj,
  //       name: edit_alert.name || "",
  //       desc: edit_alert.desc || "",
  //       entity: edit_alert.entity || "Products",
  //       items: edit_alert.items || alertControlObj.items,
  //       conditions: edit_alert.conditions || alertControlObj.conditions,
  //       metricType: edit_alert.metricType || null,
  //       delivery: edit_alert.delivery || alertControlObj.delivery
  //     });

  //     const parsedSchedule = edit_alert.schedule ? parseCrontabToSchedule(edit_alert.schedule) : init_schedule;
  //     setSchedule(parsedSchedule);
  //     setInitSchedule(parsedSchedule);
  //   }
  // }, [edit_alert]);

  // function parseCrontabToSchedule(crons = []) {
  //   // CONTINUOUS
  //   if (crons.length === 1 && crons[0] === "0 */2 * * *") {
  //     return {
  //       type: "continuous",
  //       mode: "",
  //       weekly: {},
  //       datewise: [{ day: "", times: [""] }]
  //     };
  //   }

  //   // DAILY
  //   if (crons.length === 1 && crons[0] === "0 0 * * *") {
  //     return {
  //       type: "daily",
  //       mode: "",
  //       weekly: {},
  //       datewise: [{ day: "", times: [""] }]
  //     };
  //   }

  //   const weekly = {};
  //   const monthlyMap = {};
  //   const datewiseMap = {};

  //   crons.forEach(expr => {
  //     const [m, h, d, month, w] = expr.split(" ");
  //     const time = `${h.padStart(2, "0")}:${m.padStart(2, "0")}`;

  //     if (w !== "*") {
  //       const day = DAY_REVERSE_MAP[w];
  //       if (!weekly[day]) weekly[day] = [];
  //       weekly[day].push({ time });
  //     } else if (month !== "*") {
  //       const dateKey = `${month}-${d}`;
  //       if (!datewiseMap[dateKey]) datewiseMap[dateKey] = [];
  //       datewiseMap[dateKey].push(time);
  //     } else if (d !== "*") {
  //       if (!monthlyMap[d]) monthlyMap[d] = [];
  //       monthlyMap[d].push(time);
  //     }
  //   });

  //   if (Object.keys(weekly).length > 0) {
  //     return {
  //       type: "custom",
  //       mode: "weekly",
  //       weekly,
  //       monthly: [],
  //       datewise: []
  //     };
  //   }

  //   if (Object.keys(monthlyMap).length > 0) {
  //     return {
  //       type: "custom",
  //       mode: "monthly",
  //       weekly: {},
  //       monthly: Object.entries(monthlyMap).map(([day, times]) => ({
  //         day: Number(day),
  //         times
  //       })),
  //       datewise: []
  //     };
  //   }

  //   return {
  //     type: "custom",
  //     mode: "datewise",
  //     weekly: {},
  //     monthly: [],
  //     datewise: Object.entries(datewiseMap).map(([dateKey, times]) => {
  //       const [m, d] = dateKey.split("-");
  //       const currentYear = new Date().getFullYear();
  //       const date = new Date(currentYear, Number(m) - 1, Number(d));
  //       return {
  //         day: date.toISOString(),
  //         times
  //       };
  //     })
  //   };
  // }

  // function buildCrontab(schedule, timezone = "Asia/Kolkata") {
  //   const crons = [];

  //   // CONTINUOUS → every 2 hours
  //   if (schedule.type === "continuous") {
  //     crons.push({
  //       expression: "0 */2 * * *",
  //       timezone,
  //       type: "continuous"
  //     });
  //     return crons;
  //   }

  //   // DAILY → midnight
  //   if (schedule.type === "daily") {
  //     crons.push({
  //       expression: "0 0 * * *",
  //       timezone,
  //       type: "daily"
  //     });
  //     return crons;
  //   }

  //   // WEEKLY
  //   if (schedule.type === "custom" && schedule.mode === "weekly") {
  //     Object.entries(schedule.weekly).forEach(([day, times]) => {
  //       times.forEach(({ time }) => {
  //         if (!time) return;
  //         const [h, m] = time.split(":");
  //         crons.push({
  //           expression: `${m} ${h} * * ${DAY_MAP[day]}`,
  //           timezone,
  //           type: "weekly"
  //         });
  //       });
  //     });
  //   }

  //   // MONTHLY
  //   if (schedule.type === "custom" && schedule.mode === "monthly") {
  //     schedule.monthly.forEach(({ times, day }) => {
  //       if (!day) return;
  //       times.forEach(time => {
  //         if (!time) return;
  //         const [h, m] = time.split(":");
  //         crons.push({
  //           expression: `${m} ${h} ${day} * *`,
  //           timezone,
  //           type: "monthly"
  //         });
  //       });
  //     });
  //   }

  //   // DATEWISE
  //   if (schedule.type === "custom" && schedule.mode === "datewise") {
  //     schedule.datewise.forEach(({ times, day }) => {
  //       if (!day) return;
  //       const date = new Date(day);
  //       const d = date.getDate();
  //       const month = date.getMonth() + 1;
  //       times.forEach(time => {
  //         if (!time) return;
  //         const [h, m] = time.split(":");
  //         crons.push({
  //           expression: `${m} ${h} ${d} ${month} *`,
  //           timezone,
  //           type: "datewise"
  //         });
  //       });
  //     });
  //   }

  //   return crons;
  // }

  // const { selectedFiltersWidget } = useEbuxContext();

  // const steps = [
  //   "Entity",
  //   "Universe",
  //   "Conditions",
  //   "Preview",
  //   "Schedule",
  // ];

  // const handleNext = () => {
  //   if (activeStep < steps.length - 1) {
  //     if (activeStep === 1) {
  //       // Consolidate items from UniverseComponent
  //       setAlertControlObj(prev => ({
  //         ...prev,
  //         items: {
  //           selectedBrand: selectedFiltersWidget?.selectedBrand || [],
  //           selectedCategory: selectedFiltersWidget?.selectedCategory || [],
  //           selectedPlatform: selectedFiltersWidget?.selectedPlatform || [],
  //           selectedLocation: selectedFiltersWidget?.selectedLocation || [],
  //           selectedProductId: selectedFiltersWidget?.selectedProductId || []
  //         }
  //       }));
  //     }
  //     setActiveStep(prev => prev + 1);
  //   } else {
  //     if (!alertControlObj.name?.trim()) {
  //       alert("Alert Name is required");
  //       return;
  //     }

  //     // Validate schedule if on the last step
  //     if (scheduleRef.current) {
  //       const isValid = scheduleRef.current.handleSave();
  //       if (!isValid) return;
  //     }

  //     const crontab = buildCrontab(schedule);
  //     console.log("Final Alert Data:", alertControlObj);
  //     const payload = {
  //       name: alertControlObj.name,
  //       desc: alertControlObj.desc,
  //       entity: alertControlObj.entity,
  //       items: alertControlObj.items,
  //       conditions: alertControlObj.conditions,
  //       metricType: alertControlObj.metricType,
  //       schedule: crontab.map(c => c.expression),
  //       delivery: alertControlObj.delivery,
  //       client_code: localStorage.getItem("client_code"),
  //       user_id: localStorage.getItem("user_id"),
  //       account_id: localStorage.getItem("client_id")
  //     };

  //     const apiCall = edit_alert ? editAlert({ id: edit_alert.id, ...payload }) : saveAlert(payload);

  //     apiCall.then(res => {
  //       if (res.status) {
  //         alert(`Alert ${edit_alert ? "updated" : "saved"} successfully!`);
  //         history.push("/alert-control");
  //       } else {
  //         alert(`Failed to ${edit_alert ? "update" : "save"} alert: ` + (res.message || "Unknown error"));
  //       }
  //     }).catch(err => {
  //       console.error("Error saving alert:", err);
  //       alert("An error occurred while saving the alert.");
  //     });
  //   }
  // };

  // const handleBack = () => {
  //   if (activeStep > 0) {
  //     setActiveStep(prev => prev - 1);
  //   }
  // };
  //console.log('alertControlObj', alertControlObj)

  const { page } = useParams();

 if (page === "create" || page === "edit") {
    return (
      <AlertProvider>
        <AlertCreation/>
      </AlertProvider>
    );
  }

  return (
    <div className="w-full min-h-screen p-4 bg-gray-100">
      {/* <div className="max-w-full mx-auto rounded-lg bg-white shadow-sm border border-gray-200"> */}

        {/* Header */}
        {/* <AlertHeader activeStep={activeStep} /> */}

        {/* Middle Dynamic Content */}
        {/* <div className="p-8 min-h-[300px]">
          {activeStep === 0 && <div><EntityComponent alertControlObj={alertControlObj} setAlertControlObj={setAlertControlObj} /></div>}
          {activeStep === 1 && <div><UniverseComponent alertControlObj={alertControlObj} setAlertControlObj={setAlertControlObj} /></div>}
          {activeStep === 2 && <div><ConditionComponent alertControlObj={alertControlObj} setAlertControlObj={setAlertControlObj} /></div>}
          {activeStep === 3 && <div><PreviewComponent alertControlObj={alertControlObj} /></div>}
          {activeStep === 4 && <div><ScheduleComponent alertControlObj={alertControlObj} setAlertControlObj={setAlertControlObj} schedule={schedule} initSchedule={initSchedule} setSchedule={setSchedule} ref={scheduleRef} edit_alert={edit_alert} /></div>}
        </div> */}

        {/* Footer */}
        {/* <AlertFooter
          activeStep={activeStep}
          handleNext={handleNext}
          handleBack={handleBack}
        /> */}

      
{/* 
      </div> */}
      
        <AlertListing/>


    </div>
  );
}
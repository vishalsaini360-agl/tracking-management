import React, { useEffect, useMemo, useRef, useState } from "react";

import moment from "moment";
/**
 * Date helpers (no external libs)
 */
// function getISOWeekInfo(date) {
//   const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
//   const day = d.getUTCDay() === 0 ? 7 : d.getUTCDay(); // Monday=1, Sunday=7
//   d.setUTCDate(d.getUTCDate() + 4 - day); // shift to Thursday
//   const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
//   const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
//   return { week: weekNo, year: d.getUTCFullYear() };
// }
function getISOWeekInfo(date) {
  const m = moment(date);
  return {
    week: m.isoWeek(),
    year: m.isoWeekYear()
  };
}

// function mondayOf(date) {
//   const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
//   const day = d.getDay() || 7;
//   d.setDate(d.getDate() - (day - 1));
//   d.setHours(0, 0, 0, 0);
//   return d;
// }
function mondayOf(date) {
  return moment(date).startOf("isoWeek"); // Monday 00:00:00
}
function sundayOf(mondayDate) {
  return moment(mondayDate).endOf("isoWeek"); // Sunday 23:59:59.999
}

// function sundayOf(mondayDate) {
//   const d = new Date(mondayDate);
//   d.setDate(d.getDate() + 6);
//   d.setHours(23, 59, 59, 999);
//   return d;
// }

// function formatShort(date) {
//   const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
//   return `${date.getDate()} ${months[date.getMonth()]}`;
// }
function formatShort(date) {
  return moment(date).format("D MMM");
}

const MONTHS = ["Jan", "Feb", "March", "Apr", "May", "June", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
const QUARTERS = [
  { label: "Quarter 1", months: [0, 1, 2] },
  { label: "Quarter 2", months: [3, 4, 5] },
  { label: "Quarter 3", months: [6, 7, 8] },
  { label: "Quarter 4", months: [9, 10, 11] },
];

// function majorityMonthOfWeek(mondayDate) {
//   const dayCounts = {};
//   for (let i = 0; i < 7; i++) {
//     const d = new Date(mondayDate);
//     d.setDate(d.getDate() + i);
//     const key = `${d.getFullYear()}-${d.getMonth()}`;
//     dayCounts[key] = (dayCounts[key] || 0) + 1;
//   }
//   const majorityKey = Object.entries(dayCounts).sort((a, b) => b[1] - a[1])[0][0];
//   const [year, month] = majorityKey.split("-").map(Number);
//   return { year, month };
// }
function majorityMonthOfWeek(mondayDate) {
  const dayCounts = {};
  const start = moment(mondayDate).startOf("isoWeek");

  for (let i = 0; i < 7; i++) {
    const d = start.clone().add(i, "days");
    const key = `${d.year()}-${d.month()}`;
    dayCounts[key] = (dayCounts[key] || 0) + 1;
  }

  const majorityKey = Object.entries(dayCounts).sort((a, b) => b[1] - a[1])[0][0];
  const [year, month] = majorityKey.split("-").map(Number);

  return { year, month };
}

// function buildIsoYearWeeks(targetYear) {
//   const start = new Date(Date.UTC(targetYear - 1, 11, 28));
//   const end = new Date(Date.UTC(targetYear + 1, 0, 10));
//   const weeks = [];

//   for (let d = new Date(start); d <= end; d.setUTCDate(d.getUTCDate() + 1)) {
//     if (d.getUTCDay() === 1) {
//       const localMonday = new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
//       const iso = getISOWeekInfo(localMonday);
//       if (iso.year === targetYear) {
//         const mon = mondayOf(localMonday);
//         const sun = sundayOf(mon);
//         const majority = majorityMonthOfWeek(mon);
//         weeks.push({
//           key: `${iso.year}-${iso.week}`,
//           isoWeek: iso.week,
//           isoYear: iso.year,
//           monday: mon,
//           sunday: sun,
//           monthIdx: majority.month,
//           majorityYear: majority.year,
//         });
//       }
//     }
//   }
//   weeks.sort((a, b) => a.isoWeek - b.isoWeek);
//   return weeks;
// }
function buildIsoYearWeeks(targetYear) {
  const weeks = [];
  const start = moment.utc([targetYear - 1, 11, 28]); // Dec 28 previous year
  const end = moment.utc([targetYear + 1, 0, 10]);   // Jan 10 next year

  for (let d = start.clone(); d.isSameOrBefore(end, "day"); d.add(1, "day")) {
    if (d.isoWeekday() === 1) { // Monday
      const iso = getISOWeekInfo(d);
      if (iso.year === targetYear) {
        const mon = mondayOf(d);
        const sun = sundayOf(mon);
        const majority = majorityMonthOfWeek(mon);
        weeks.push({
          key: `${iso.year}-${iso.week}`,
          isoWeek: iso.week,
          isoYear: iso.year,
          monday: mon,
          sunday: sun,
          monthIdx: majority.month,
          majorityYear: majority.year,
        });
      }
    }
  }

  weeks.sort((a, b) => a.isoWeek - b.isoWeek);
  return weeks;
}

/**
 * Main component
 */
export default function DateRangeQuarterWeekPicker({
  // initialYear,
  isCurrent=true,
  initialYear = new Date().getFullYear(),
  defaultSelectedWeeks = [], // pass array [{ weekOfYear, year }]
  onApply = (selectedWeeks) => console.log("apply", selectedWeeks),
  onCancel = () => null,
  minDate = null,
  maxDate = null,
}) {
  const [year, setYear] = useState(initialYear);
  // useEffect(()=>{
  //   setYear(initialYear);
  // },[initialYear])
  const [selected, setSelected] = useState(() => new Set());
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, text: "" });
  const today = useMemo(() => new Date(), []);
  const currentIso = useMemo(() => getISOWeekInfo(today), [today]);
  const containerRef = useRef(null);

  const allWeeks = useMemo(() => buildIsoYearWeeks(year), [year]);
  const weeksByMonth = useMemo(() => {
    const arr = Array.from({ length: 12 }, () => []);
    allWeeks.forEach((w) => arr[w.monthIdx].push(w));
    return arr;
  }, [allWeeks]);
  const maxRows = useMemo(() => Math.max(...weeksByMonth.map((m) => m.length)), [weeksByMonth]);

  const weekKeyToWeek = useMemo(() => {
    const map = {};
    allWeeks.forEach((w) => (map[w.key] = w));
    return map;
  }, [allWeeks]);

  const isDisabled = (week) => {
    if (!week) return true;
    if (minDate && moment(week.sunday).isBefore(moment(minDate), "day")) return true;
    if (maxDate && moment(week.monday).isAfter(moment(maxDate), "day")) return true;
    if (week.isoYear > currentIso.year) return true;
    if (week.isoYear === currentIso.year && week.isoWeek >= currentIso.week) return true;
    return false;
  };

  function toggleWeekKey(key) {
    const w = weekKeyToWeek[key];
    if (!w || isDisabled(w)) return;
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  const keysOf = (weekList) => weekList.map((w) => w.key);

  function toggleMonth(monthIdx) {
    const monthWeeks = weeksByMonth[monthIdx] || [];
    const wkKeys = keysOf(monthWeeks).filter((k) => !isDisabled(weekKeyToWeek[k]));
    if (wkKeys.length === 0) return;
    const allSelected = wkKeys.every((k) => selected.has(k));
    setSelected((prev) => {
      const next = new Set(prev);
      if (allSelected) wkKeys.forEach((k) => next.delete(k));
      else wkKeys.forEach((k) => next.add(k));
      return next;
    });
  }

  function toggleQuarter(qIdx) {
    const months = QUARTERS[qIdx].months;
    const qWeekKeys = months.flatMap((mIdx) => keysOf(weeksByMonth[mIdx] || []))
      .filter((k) => !isDisabled(weekKeyToWeek[k]));
    if (qWeekKeys.length === 0) return;
    const allSelected = qWeekKeys.every((k) => selected.has(k));
    setSelected((prev) => {
      const next = new Set(prev);
      if (allSelected) qWeekKeys.forEach((k) => next.delete(k));
      else qWeekKeys.forEach((k) => next.add(k));
      return next;
    });
  }

  const isMonthFullySelected = (mIdx) => {
    const monthWeeks = weeksByMonth[mIdx] || [];
    const keys = keysOf(monthWeeks).filter((k) => !isDisabled(weekKeyToWeek[k]));
    return keys.length > 0 && keys.every((k) => selected.has(k));
  };

  const isQuarterFullySelected = (qIdx) => {
    const months = QUARTERS[qIdx].months;
    const qKeys = months.flatMap((mIdx) => keysOf(weeksByMonth[mIdx] || []))
      .filter((k) => !isDisabled(weekKeyToWeek[k]));
    return qKeys.length > 0 && qKeys.every((k) => selected.has(k));
  };

  function showTooltipFor(week, ev) {
    if (!week) return;
    const rect = ev.currentTarget.getBoundingClientRect();
    const text = `Week ${week.isoWeek} • ${formatShort(week.monday)} — ${formatShort(week.sunday)} • ${week.majorityYear}`;
    const parentRect = containerRef.current?.getBoundingClientRect();
    let x = rect.left - (parentRect?.left ?? 0) + rect.width / 2;
    let y = rect.top - (parentRect?.top ?? 0) - 10;
    setTooltip({ visible: true, x, y, text });
  }

  function hideTooltip() {
    setTooltip((t) => ({ ...t, visible: false }));
  }

  // function apply() {
  //   const keys = Array.from(selected).sort();
  //   const weeks = keys
  //     .map((k) => weekKeyToWeek[k])
  //     .filter(Boolean)
  //     .map((w) => ({
  //       weekOfYear: w.isoWeek,
  //       year: w.isoYear,
  //       start: w.monday,
  //       end: w.sunday,
  //     }));
  //   onApply(weeks);
  //   onCancel();
  // }

  function apply() {
    const keys = Array.from(selected).sort();
    const weeks = keys.map((k) => {
      const [y, w] = k.split("-").map(Number);
      const allWeeksOfYear = buildIsoYearWeeks(y); // build for that year
      const week = allWeeksOfYear.find((wk) => wk.isoWeek === w);
      if (!week) return null;
      return {
        weekOfYear: week.isoWeek,
        year: week.isoYear,
        start: week.monday.format("YYYY-MM-DD"),
        end: week.sunday.format("YYYY-MM-DD"),
      };
    }).filter(Boolean).sort((a,b)=>{
       const d1= new Date(a?.start);
       const d2= new Date(b?.start);
       return d1-d2;
    });
    if(weeks?.length){
      onApply(weeks);
    }else{
      onReset();
    }
  }

  // handle default selection
  useEffect(() => {
    if (!defaultSelectedWeeks || defaultSelectedWeeks.length === 0) return;
    const keys = defaultSelectedWeeks.map((w) => `${w.year}-${w.weekOfYear}`);
    setSelected(new Set(keys));
  }, [
    // year, 
    defaultSelectedWeeks]);
  const onReset=()=>{
    const todayM = moment().startOf('day');
    
        // Last completed ISO week
        const lastWeekMonday = todayM.clone().startOf("isoWeek").subtract(1, "week").startOf('day');
        const lastWeekSunday = lastWeekMonday.clone().endOf("isoWeek").endOf('day');
    
        const w= {
          weekOfYear: lastWeekMonday.isoWeek(),
          year: lastWeekMonday.isoWeekYear(),
          start: lastWeekMonday.startOf('day').format("YYYY-MM-DD"),
          end: lastWeekSunday.endOf('day').format("YYYY-MM-DD"),
        };
        setYear(new Date(lastWeekSunday.endOf('day').format("YYYY-MM-DD")).getFullYear());
        setSelected(new Set([`${w.year}-${w.weekOfYear}`]));
  }

    const refOne = useRef(null);
    const handleClickOutside = (event) => {
      if (refOne.current && !refOne.current.contains(event.target)) {
        onCancel();
      }
    };
    useEffect(() => {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);
  return (
    <div ref={refOne}   className="w-full max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-4 rounded-lg border border-gray-200 items-end justify-end m-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">{isCurrent ? "Current" : "Compare"} Date Range</h2>
        <div className="flex items-center space-x-2">
          <button onClick={() => setYear((y) => y - 1)} className="px-3 py-1 border rounded-lg hover:bg-gray-100">&lt;</button>
          <span className="text-lg font-medium">{year}</span>
          <button onClick={() => setYear((y) => y + 1)} className="px-3 py-1 border rounded-lg hover:bg-gray-100">&gt;</button>
        </div>
      </div>

      {/* Main card */}
      <div ref={containerRef} className="border rounded-3xl p-4 relative">
        {/* Quarters header */}
        <div className="grid grid-cols-4 gap-4 mb-4">
          {QUARTERS.map((q, qi) => {
            const active = isQuarterFullySelected(qi);
            return (
              <button key={q.label} onClick={() => toggleQuarter(qi)}
                className={`py-3 rounded-lg font-medium ${active ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                {q.label}
              </button>
            );
          })}
        </div>

        {/* Months header row */}
        <div className="grid grid-cols-12 gap-2 mb-3 text-sm font-medium text-gray-600">
          {MONTHS.map((m, idx) => {
            const active = isMonthFullySelected(idx);
            return (
              <button key={m} onClick={() => toggleMonth(idx)}
                className={`py-2 rounded-md ${active ? "bg-blue-200 text-blue-800" : "hover:bg-gray-50"}`}>
                {m}
              </button>
            );
          })}
        </div>

        {/* Weeks grid */}
        <div className="grid grid-cols-12 gap-2">
          {Array.from({ length: maxRows }).map((_, rowIdx) => (
            <React.Fragment key={`row-${rowIdx}`}>
              {Array.from({ length: 12 }).map((_, monthIdx) => {
                const week = weeksByMonth[monthIdx]?.[rowIdx] ?? null;
                const key = week?.key;
                const disabled = week ? isDisabled(week) : true;
                const isSelected = key ? selected.has(key) : false;

                const baseClasses = "py-3 rounded-lg text-center text-sm border transition select-none";
                const enabledClasses = disabled
                  ? "bg-transparent text-gray-300 border-transparent cursor-not-allowed"
                  : isSelected
                    ? "bg-blue-200 border-blue-400 text-blue-800 cursor-pointer"
                    : "bg-gray-50 hover:bg-blue-50 border-gray-200 text-gray-800 cursor-pointer";

                return (
                  <div key={`${monthIdx}-${rowIdx}`} className="flex items-center justify-center">
                    {week ? (
                      <button
                        onClick={() => toggleWeekKey(key)}
                        onMouseEnter={(e) => showTooltipFor(week, e)}
                        onMouseLeave={hideTooltip}
                        className={`${baseClasses} ${enabledClasses} w-full`}
                        disabled={disabled}
                        aria-pressed={isSelected}
                        // title={`${formatShort(week.monday)} — ${formatShort(week.sunday)} • ${week.majorityYear}`}
                      >
                        {week.isoWeek}
                      </button>
                    ) : <div className="w-full h-12" />}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>

        {/* Tooltip */}
        {tooltip.visible && (
          <div style={{ position: "absolute", left: tooltip.x, top: tooltip.y - 48, transform: "translate(-50%,0)", zIndex: 60 }}>
            <div className="bg-white border shadow-md text-sm px-3 py-2 rounded-md whitespace-nowrap">{tooltip.text}</div>
          </div>
        )}
      </div>

      {/* Footer buttons */}
      <div className="flex justify-end space-x-3 mt-3">

        <button className="px-5 py-2 rounded-xl border hover:bg-gray-100" onClick={onReset}>Reset</button>
        <button className="px-5 py-2 rounded-xl border hover:bg-gray-100" onClick={onCancel}>Cancel</button>
        <button className="px-6 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700" onClick={apply}>Apply</button>
      </div>
    </div>
  );
}

import React, { useEffect, useRef, useState } from "react";
import moment from "moment";
import { leftArrowIcon, rightArrowIcon } from "./utils/icons";
import { ENTITY_TYPE, EVENTS, trackCustomEvent } from "../../../../tracker";

export default function DateRangeCalender({
  monthsToShow = 2,
  onChange,
  minDate,
  maxDate = new Date(),
  defaultStart = new Date(),
  defaultEnd= new Date()
}) {
  const [currentMonth, setCurrentMonth] = useState(
    // defaultStart ? moment(defaultStart) : moment()
    defaultEnd ? moment(defaultEnd) : moment()
  );
  const [range, setRange] = useState({
    start: defaultStart ? moment(defaultStart) : null,
    end: defaultEnd ? moment(defaultEnd) : null
  });
  useEffect(() => {
    if (defaultStart) {
        // setCurrentMonth(moment(defaultStart));
        setRange((prev) => ({
            ...prev,
            start: moment(defaultStart)
        }));
    }
    if (defaultEnd) {
        setCurrentMonth(moment(defaultEnd));
        setRange((prev) => ({
            ...prev,
            end: moment(defaultEnd)
        }));
    }
  },[defaultStart, defaultEnd]);
  const [hoverDate, setHoverDate] = useState(null);

  const isDisabled = (day) => {
    if (minDate && day.isBefore(moment(minDate), "day")) return true;
    if (maxDate && day.isAfter(moment(maxDate), "day")) return true;
    return false;
  };

  const handleDayClick = (day) => {
    if (isDisabled(day)) return;

    let newRange;
    if (!range.start || (range.start && range.end)) {
      newRange = { start: day, end: null };
      trackCustomEvent(EVENTS.CLICK, { action: "select_start_date", date: day.format("YYYY-MM-DD") }, ENTITY_TYPE.CALENDAR);
    } else if (range.start && !range.end) {
      if (day.isBefore(range.start, "day")) {
        newRange = { start: day, end: range.start };
      } else {
        newRange = { start: range.start, end: day };
      }
      trackCustomEvent(EVENTS.DATE_CHANGE, {
        action: "select_date_range",
        startDate: newRange.start.format("YYYY-MM-DD"),
        endDate: newRange.end.format("YYYY-MM-DD")
      }, ENTITY_TYPE.CALENDAR);
    }
    setRange(newRange);
    setHoverDate(null);
    if (onChange&&newRange?.end) onChange(newRange);
  };

  const handleMouseEnter = (day) => {
    if (range.start && !range.end && !isDisabled(day)) {
      setHoverDate(day);
    }
  };

  const renderMonth = (showNavigation=false,monthMoment,id) => {
    
    
    const start = monthMoment.clone().startOf("month");
    const end = monthMoment.clone().endOf("month");
    const days = [];

    let day = start.clone().startOf("week");
    const lastDay = end.clone().endOf("week");

    while (day.isSameOrBefore(lastDay, "day")) {
        days.push(day.clone());
        day.add(1, "day");
    }
    return (
      <div className="w-full" key={id}>
        <div className="flex justify-between items-center ">
          <h2 className="text-gray-800 font-semibold">{monthMoment.format("MMMM YYYY")}</h2>
          {/* Navigation */}
            {showNavigation ? (
                
            <div className="flex justify-end">
                <button
                onClick={() => {
                  trackCustomEvent(EVENTS.BUTTON_CLICK, { action: "previous_month" }, ENTITY_TYPE.CALENDAR);
                  setCurrentMonth(currentMonth.clone().subtract(1, "month"));
                }}
                className="p-1 text-gray-700 hover:bg-gray-200 rounded"
                >
                {leftArrowIcon("currentColor")}
                </button>
                <button
                onClick={() => {
                  trackCustomEvent(EVENTS.BUTTON_CLICK, { action: "next_month" }, ENTITY_TYPE.CALENDAR);
                  setCurrentMonth(currentMonth.clone().add(1, "month"));
                }}
                className="p-1 text-gray-700 hover:bg-gray-200 rounded"
                >
                {rightArrowIcon}
                </button>
            </div>
            ):( 
            <div className="flex">
                <button disabled className="p-1" >
                {leftArrowIcon("none")}
                </button>
            </div>
            )}
        </div>

        {/* Weekday headers */}
        <div className="grid grid-cols-7 gap-1 text-[13px] text-gray-500 mb-1">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d} className="text-center">{d}</div>
          ))}
        </div>

        {/* Dates */}
        <div className="grid grid-cols-7 gap-1 text-center">
          {days.map((dayMoment, idx) => {
            const isSelectedStart = range.start && dayMoment.isSame(range.start, "day");
            const isSelectedEnd = range.end && dayMoment.isSame(range.end, "day");

            const inRange =
              range.start &&
              range.end &&
              dayMoment.isBetween(range.start, range.end, "day", "[]");

            const inHoverRange =
              range.start &&
              !range.end &&
              hoverDate &&
              ((dayMoment.isAfter(range.start, "day") && dayMoment.isBefore(hoverDate, "day")) ||
                (dayMoment.isBefore(range.start, "day") && dayMoment.isAfter(hoverDate, "day")) ||
                dayMoment.isSame(hoverDate, "day"));

            const isOutsideMonth = !dayMoment.isSame(monthMoment, "month");
            const disabled = isDisabled(dayMoment);
            

            let bgClass = "",notAllowedClass=false;
            if (isSelectedStart || isSelectedEnd) {
              if (isOutsideMonth&&monthsToShow>1) {
                notAllowedClass = true;
                bgClass = `bg-white text-gray-400`;
              }else{
                bgClass = "bg-blue-500 text-white";
              }
            } else if (inRange || inHoverRange) {
              if (isOutsideMonth&&monthsToShow>1) {
                notAllowedClass = true;
                bgClass = `bg-white text-gray-400`;
              }else{
                bgClass = "bg-blue-100 text-black";
              }
            } else if (isOutsideMonth) {
               if (monthsToShow>1) {
                notAllowedClass = true;
               }
              bgClass = `bg-white text-gray-400`;
            } else {
              bgClass = "bg-white text-gray-800";
            }

            return (
              <div
                key={idx}
                onClick={() => handleDayClick(dayMoment)}
                onMouseEnter={() => handleMouseEnter(dayMoment)}
                className={`${bgClass}  text-[12px] py-1 rounded cursor-pointer ${notAllowedClass?"cursor-not-allowed":"hover:bg-blue-200"} ${
                  disabled ? "opacity-40 cursor-not-allowed hover:bg-inherit " : ""
                }`}
              >
                {(isOutsideMonth&&monthsToShow>1) ? "": dayMoment.format("D")}
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  const refOne = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (refOne.current && !refOne.current.contains(event.target)) {
        if (range.start && !range.end) {
          const newRange = { ...range, end: range.start };
          // const newRange = {start:defaultStart, end: defaultEnd };
          setRange(newRange);
          setHoverDate(null);
          if (onChange && newRange?.end) onChange(newRange);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [range, onChange]);
  return (
    <div className="flex flex-col bg-white justify-center items-center  inline-block">
      

      {/* Month Grid */}
      <div ref={refOne}  className="flex justify-between gap-8 p-1 w-full">
        {Array.from({ length: monthsToShow>1?2:1 }).map((_, idx) =>
          renderMonth((monthsToShow>1 && idx==0 ?false:true),(monthsToShow>1 && idx==0 ?currentMonth.clone().subtract(1, "month"):currentMonth.clone()),idx)
        )}
      </div>
    </div>
  );
}

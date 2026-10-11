import * as React from "react";
import "./style.css";
import { DateRangePicker, defaultStaticRanges } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { convertDateFormat } from "../../utils/helpers";
import { FaRegCalendarAlt } from "react-icons/fa";

const DatePicker = ({
  onChangeDate,
  applyDate,
  cancelDate,
  state,
  setCalState,
  calState,
  position,
  platform,
  dashboard,
  top,
  source,
  positionLeft,
  component,
  className = "",
  boxClassName = "",
}) => {
  // console.log(platform, "<<< okar")
  // const apply = () => {
  //   onChangeDate({ selection: state[0] });
  //   setCalState({
  //     showCalender: false,
  //     fullCalender: false,
  //     dateApplied: true,
  //   });
  // };
  const onDateRangeClick = () => {
    setCalState({
      ...calState,
      showCalender: !calState.showCalender,
      fullCalender: false,
    });
    // if (
    //   state[0].startDate !== addDays(new Date(), -7) &&
    //   state[0].endDate !== new Date() &&
    //   !calState.dateApplied
    // ) {
    //   setState([
    //     {
    //       startDate: addDays(new Date(), -7),
    //       endDate: new Date(),
    //       key: "selection",
    //     },
    //   ]);
    // }
  };
  React.useEffect(() => {
    //this will select custom label and add click event which on click show the full calender
    const selector = ".calClass .rdrInputRanges";
    // const selector = ".calClass .rdrInputRanges .rdrInputRange  span ";
    const customButton = document?.querySelector(selector);
    if (customButton) {
      customButton.addEventListener("click", () => {
        setCalState({
          ...calState,
          fullCalender: true,
        });
      });
    }
  }, [calState.showCalender]);

  const datePickerRef = React.useRef(null);

  const handleClickOutside = (event) => {
    if (
      datePickerRef.current &&
      !datePickerRef.current.contains(event.target)
    ) {
      if (calState && (calState.showCalender || calState?.fullCalender)) {
        setCalState({ ...calState, showCalender: false, fullCalender: false });
        if (
          dashboard === "dashboard" ||
          dashboard === "campmanage" ||
          dashboard === "report"
        ) {
          //setTempDate({});
          cancelDate();
        }
        // if(platform==="zepto" && dashboard==="campmanage"){
        //   cancelDate();
        // }
        // else{
        //   cancelDate();
        // }
      }
    }
  };

  React.useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [calState]);

  React.useEffect(() => {
    datePickerRef.current?.style;
  }, []);

  const borderCss =
    platform === "ams"
      ? "!border-[#ef880f] !border-2"
      : platform === "blinkit"
      ? "!border-[#11B07A] !border-2"
      : platform === "flipkart"
      ? "!border-[#0081f7] !border-2"
      : platform === "zepto"
      ? "!border-[#3C006B] !border-2"
      : platform === "instamart"
      ? "!border-[#851853] !border-2"
      : "";

  return (
    <div
      className={[
        "calClass",
        platform === "ams" && "calClass--ams",
        platform === "blinkit" && "calClass--blinkit ",
        platform === "zepto" && "calClass--zepto ",
        platform === "instamart" && "calClass--instamart ",
      ].join(" ")}
      ref={datePickerRef}
    >
      <div
        className={`${
          boxClassName ? `customHeight h-[32px] ${boxClassName}` : "selectDate"
        } ${
          calState.showCalender && borderCss
        } transition border-opacity-0 hover:border-opacity-100  duration-300 ease-in-out`}
        onClick={onDateRangeClick}
      >
        <div className="pr-2">
          <FaRegCalendarAlt />
        </div>
        <h6 className="truncate" title={`${convertDateFormat(state[0]?.startDate)} - ${state[0]?.endDate <= new Date()
            ? convertDateFormat(state[0]?.endDate)
            : convertDateFormat(new Date())}`}>
          {/* <i class="fas fa-calendar mr-2"></i> */}
          {/* <i class="fa-solid fa-calendar"></i> */}
          {convertDateFormat(state[0]?.startDate)} -{" "}
          {state[0]?.endDate <= new Date()
            ? convertDateFormat(state[0]?.endDate)
            : convertDateFormat(new Date())}
        </h6>
      </div>

      {calState.showCalender ? (
        <div
          style={{
            left: calState.fullCalender
              ? position === "left"
                ? "0px"
                : "auto"
              : "14px ",

            right: calState.fullCalender
              ? position === "right"
                ? "auto"
                : source === "blinkit"
                ? "10px"
                : "10px"
              : "auto",
            top: top ? "100%" : "",
          }}
          className={[
            source === "blinkit" && "!top-12",
            "calenderOuter",
            positionLeft === "calLeft" && "calenderOuterLeft",
            !calState.fullCalender && "calenderHide",
            className,
          ].join(" ")}
        >
          <DateRangePicker
            onChange={(item) => onChangeDate(item)}
            moveRangeOnFirstSelection={false}
            editableDateInputs
            ranges={state}
            direction="horizontal"
            months={2}
            showSelectionPreview={false}
            showMonthAndYearPickers={false}
            showDateDisplay={false}
            showMonthArrow={true}
            rangeColors={
              platform === "ams"
                ? ["#ef880f", "#ef880f", "#ef880f"]
                : platform === "blinkit"
                ? ["#11B07A", "#11B07A", "#11B07A"]
                : platform === "zepto"
                ? ["#3C006B", "#3C006B", "#3C006B"]
                : platform === "instamart"
                ? ["#851853", "#851853", "#851853"]
                : platform === "flipkart"
                ? ["#0081F7", "#0081F7", "#0081F7"]
                : []
            }
            staticRanges={[...defaultStaticRanges]}
            inputRanges={[
              {
                label: "Custom",
              },
            ]}
            maxDate={
              calState.fullCalender // "This Month" option selected
                ? new Date()
                : new Date(
                    state[0].startDate.getFullYear(),
                    state[0].startDate.getMonth(),
                    new Date(
                      state[0].startDate.getFullYear(),
                      state[0].startDate.getMonth() + 1,
                      0
                    ).getDate()
                  )
            }
          />

          <div className="calenderBtnContainer">
            <div className="calDate">
              {convertDateFormat(state[0].startDate)} -{" "}
              {convertDateFormat(state[0].endDate)}
            </div>
            <button
              className={[
                "calBtnCancel",
                platform === "ams" && "calBtnCancel--ams",
                component === "custom-report" && "calBtnCancel--customreport",
              ].join(" ")}
              onClick={() => {
                if (
                  dashboard === "dashboard" ||
                  dashboard === "campmanage" ||
                  dashboard === "report"
                ) {
                  //setTempDate({});
                  cancelDate();
                }
                // if(platform==="zepto" && dashboard==="campmanage"){
                //   cancelDate();
                // }
                // else{
                //   cancelDate();
                // }
                setCalState({
                  ...calState,
                  showCalender: false,
                  fullCalender: false,
                });
              }}
              //onClick={cancelDate}
            >
              Cancel
            </button>
            <button
              className={[
                "calBtnApply ",
                platform === "ams" && "calBtnApply--ams",
                platform === "blinkit" && "calBtnApply--blinkit",
                platform === "zepto" && "calBtnApply--zepto",
                platform === "instamart" && "calBtnApply--insta",
              ].join(" ")}
              onClick={applyDate}
            >
              Apply
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default DatePicker;

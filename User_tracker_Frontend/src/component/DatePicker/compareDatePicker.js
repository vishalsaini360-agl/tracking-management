import * as React from "react";
import "./style.css";
import _ from "lodash";
import { addDays } from "date-fns";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { convertDateFormat, areDatesInSameMonthAndYear, dateRangeDropdown, getCompDates } from "../../utils/helpers";
import DialogBox from "../common-components/dialogBox.js";
import { FaRegCalendarAlt } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { setToastMessageHandler } from "../../redux/action-creator/commonAction.js";
import WhenPermitted from "../common-components/WhenPermitted.js";
import { PERMISSIONS } from "../../utils/constants.js";

const DatePicker = ({
  onChangeDate,
  state,
  setState,
  setCalState,
  calState,
  position,
  saveComp,
  compDates,
  loadCompData,
  compareId,
  setCompId,
  editCompDate,
  deleteComp,
  platform,
  mainCalendarRange,
  handleApplyButton,
  editCampMode = false,
  className = "",
}) => {
  const [name, setName] = React.useState("");
  const [customMenu, setCustomMenu] = React.useState(false);
  const [showPreviousMonth, setShowPreviousMonth] = React.useState(true);
  const [showDateRange, setShowDateRange] = React.useState(false);
  const [showPreviousYear, setShowPreviousYear] = React.useState(false);
  const [editMode, setEditMode] = React.useState(false);
  const [editId, setEditId] = React.useState("");
  const [validInput, setValidInput] = React.useState(true);
  const [open, setOpen] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [nameFlag, setNameFlag] = React.useState(false);
  const [tempName, setTempName] = React.useState("");
  const [applyButtonFlag, setApplyButtonFlag] = React.useState(false);
  // eslint-disable-next-line no-unused-vars
  const [initialStartDate, setInitialStartDate] = React.useState(null);
  // eslint-disable-next-line no-unused-vars
  const [initialEndDate, setInitialEndDate] = React.useState(null);

  const dispatch = useDispatch();

  const datePickerRef = React.useRef(null);
  const deleteRef = React.useRef(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleDeleteOpen = () => {
    setOpenDelete(true);
    deleteRef.current = true;
  };

  const handleClose = () => {
    setOpen(false);
    setName("");
  };
  const handleDeleteClose = () => {
    setOpenDelete(false);
  };
  const mainCalStartDate = mainCalendarRange[0]?.startDate;
  const mainCalEndDate = mainCalendarRange[0]?.endDate;
  const {startDate: newStartDate, endDate: newEndDate} = getCompDates(mainCalStartDate, mainCalEndDate, compareId);

  const onDateRangeClick = () => {
    setCalState({
      ...calState,
      showCalender: !calState.showCalender,
      fullCalender: true,
    });
    if (
      state[0].startDate !== newStartDate &&
      state[0].endDate !== newEndDate &&
      !calState.dateApplied &&
      (initialEndDate !== mainCalendarRange[0]?.endDate ||
        initialStartDate !== mainCalendarRange[0]?.startDate) && ['1','2','3','4'].includes(compareId)
    ) {
      setState([
        {
          startDate: newStartDate,
          endDate: newEndDate,
          key: "selection",
        },
      ]);
    }
  };
  React.useEffect(() => {
    setInitialStartDate(mainCalendarRange[0]?.startDate);
    setInitialEndDate(mainCalendarRange[0]?.endDate);
  }, []);

  React.useEffect(()=>{
   const isPreviousMonthVisible = areDatesInSameMonthAndYear(mainCalendarRange[0]?.startDate, mainCalendarRange[0]?.endDate, false);
   const isPreviousYearVisible = areDatesInSameMonthAndYear(mainCalendarRange[0]?.startDate, mainCalendarRange[0]?.endDate, true);
   setShowPreviousMonth(isPreviousMonthVisible);
   setShowPreviousYear(isPreviousYearVisible);
   if (!isPreviousMonthVisible && compareId === '3') {
    setCompId('1');
    setApplyButtonFlag(false);
  }
  if (!isPreviousYearVisible && compareId === '4') {
    setCompId('1');
    setApplyButtonFlag(false);
  }
  },[mainCalendarRange])

  React.useEffect(() => {
    if (editCampMode != false) {
      editCampMode(nameFlag);
    }
  }, [nameFlag]);

  React.useEffect(() => {
    if (!nameFlag && compareId != "1") {
      setApplyButtonFlag(true);
    }
    // if (platform === "blinkit") {
    if (compareId === "previous") {
      if (
        state[0].startDate !== newStartDate &&
        state[0].endDate !== newEndDate &&
        !calState.dateApplied
      ) {
        setState([
          {
            startDate: newStartDate,
            endDate: newEndDate,
            key: "selection",
          },
        ]);
      }
      // }
    } else {
      if (["2", "3", "4"].includes(compareId)) {
        setApplyButtonFlag(true);
        if (
          state[0].startDate !== newStartDate &&
          state[0].endDate !== newEndDate &&
          !calState.dateApplied
        ) {
          setState([
            {
              startDate: newStartDate,
              endDate: newEndDate,
              key: "selection",
            },
          ]);
        }
      }
    }
  }, [compareId]);

  const checkDuplicate = () => {
    if (editMode) {
      return (
        tempName !== name &&
        compDates.some((item) => item.comparison_name === name)
      );
    } else {
      return compDates.some((item) => item.comparison_name === name);
    }
  };

  const createComp = () => {
    setApplyButtonFlag(false);
    setNameFlag(true);
    setName("");
    setEditMode(false);
    setCalState({
      ...calState,
      showCalender: true,
      fullCalender: true,
    });

    if (
      state[0].startDate !== addDays(new Date(), -30) &&
      state[0].endDate !== new Date() &&
      !calState.dateApplied
    ) {
      setState([
        {
          startDate: addDays(new Date(), -30),
          endDate: new Date(),
          key: "selection",
        },
      ]);
    }
  };

  const editComp = (item) => {
    setValidInput(true);
    setEditId(item._id);
    setEditMode(true);
    setName(item.comparison_name);
    setTempName(item.comparison_name);
    setState([
      {
        startDate: new Date(item.start_date),
        endDate: new Date(item.end_date),
        key: "selection",
      },
    ]);
  };

  const validateInput = async (createdBy) => {
    if (checkDuplicate()) {
      setValidInput(false);
      return;
    }
    if (name.length > 0) {
      await saveComp(state, name);
      handleClickOpen();

      setNameFlag("");
      setEditMode(false);
      setApplyButtonFlag(true);
      if (createdBy) {
        deleteRef.current = true;
      }
    } else setValidInput(false);
  };

  const validateEditInput = async () => {
    if (checkDuplicate()) {
      setValidInput(false);
      return;
    }
    if (name.length > 0) {
      await editCompDate(state, name, editId);
      handleClickOpen();
      setNameFlag("");
      setTempName("");
      setEditMode(false);
      setApplyButtonFlag(true);
    } else setValidInput(false);
  };

  const handleAgree = () => {
    setName("");
    setOpen(false);
  };

  const handleDelete = () => {
    deleteComp(editId);
    if (compareId == editId && platform !== "blinkit") setCompId("2");
    else if (platform === "blinkit") {
      setCompId("2");
    }

    dispatch(
      setToastMessageHandler("Custom date range deleted successfully", true)
    );

    setOpenDelete(false);
    setName("");
    setNameFlag("");
    setEditMode(false);
    setApplyButtonFlag(true);
  };

  React.useEffect(() => {
    loadCompData();
    //this will select custom label and add click event which on click show the full calender
    const selector = ".calClass .rdrInputRanges";
    // const selector = ".calClass .rdrInputRanges .rdrInputRange  span ";
    const customButton = document.querySelector(selector);
    if (customButton) {
      customButton.addEventListener("click", () => {
        setCalState({
          ...calState,
          fullCalender: true,
        });
      });
    }
  }, [calState.showCalender]);

  const handleClickOutside = (event) => {
    if (
      datePickerRef.current &&
      !datePickerRef.current.contains(event.target)
    ) {
      if (calState && (calState.showCalender || calState?.fullCalender) && !deleteRef.current) {
        setCalState({ ...calState, showCalender: false, fullCalender: false });
      }
      deleteRef.current = false;
    }
  };

  React.useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [calState]);

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

  function comparisonTitle() {
    const comparison = dateRangeDropdown.find(item => item.compareId === compareId);
    if (comparison) {
      return comparison.title;
    }
    const fallbackComparison = compDates.find(item => item._id === compareId);
    return fallbackComparison?.comparison_name || (compareId === undefined ? "No Comparison" : compareId);
  }
  const displayText = `Compare: ${compareId === "1" ? "No Comparison" : comparisonTitle()}`;
  return (
    <div className="calClass compDate" ref={datePickerRef}>
      {platform !== "" ? (
        <>
          <div
            className={`selectDate ${calState.showCalender && borderCss}`}
            onClick={onDateRangeClick}
          >
            <div className="pr-2">
              <FaRegCalendarAlt />
            </div>
            <div
              className="truncate"
              title={displayText}
            >
              {displayText}
            </div>
          </div>
          {calState.showCalender ? (
            <div
              style={{
                left: calState.fullCalender
                  ? position === "left"
                    ? "10px"
                    : "auto"
                  : "14px",
                right: calState.fullCalender
                  ? position === "left"
                    ? "auto"
                    : "10px"
                  : "auto",
              }}
              className={[
                "calenderOuter",
                !calState.fullCalender && "calenderHide",
                className,
              ].join(" ")}
            >
              <div className="compCalenderBtnContainer pt-2 ">
                {/* <div className="selectCompDate ml-2">
              <h6
                style={{
                  display: "inline-block ",
                }}
              >
                {convertDateFormat(state[0].startDate)}
                <i class="fas fa-calendar ml-2"></i>
              </h6>
            </div> */}
                <div className="selectCompDateRight px-2">
                  <h6
                    className=""
                  >
                    {displayText}
                    <i className="fas fa-calendar ml-2"></i>
                  </h6>
                </div>
                <button
                  onClick={() => {
                    setCalState({
                      ...calState,
                      showCalender: false,
                      fullCalender: false,
                    });
                  }}
                  type="button"
                  className="  mr-2 text-gray-400 bg-transparent hover:text-gray-900 
                  rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center
                   dark:hover:bg-gray-400 dark:hover:text-black"
                  data-modal-hide="defaultModal"
                >
                  <svg
                    className="w-3 h-3 text-gray-500 hover:text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
              </div>

              <div className="grid grid-flow-col bg-white border border">
                {/* <div className="row-span-6 w-48  bg-white border-r-2 mt-1"> */}
                <div
                  className={
                    compareId !== "1"
                      ? "row-span-6 w-48  bg-white border-r-2 mt-1"
                      : "row-span-6 w-63 bg-white border-r-2 mt-1"
                  }
                >
                  <ul className="space-y-2">
                    <li>
                      <div
                        onClick={() => {
                          setApplyButtonFlag(false);
                          setCompId("1");
                          setCalState({
                            ...calState,
                            showCalender: false,
                            fullCalender: false,
                          });
                        }}
                        className={`${
                          compareId === "1" ? "selComp" : ""
                        } cursor-pointer flex items-center p-2 text-base font-normal text-gray-800 rounded-lg
                     hover:text-white hover:bg-gray-300 dark:hover:bg-gray-400`}
                      >
                        <span className="ml-3">No Comparison</span>
                      </div>
                    </li>
                    <li>
                    <div
                        onClick={() => {
                          setShowDateRange(!showDateRange);
                        }}
                        className="cursor-pointer flex items-center p-2 text-base font-normal
                         text-gray-800 rounded-lg hover:text-black hover:bg-gray-100 
                         dark:hover:bg-gray-400"
                      >
                        <span className="ml-3">Previous Range</span>
                        <i
                          className={
                            showDateRange
                              ? "fa fa-angle-up ml-8"
                              : "fa fa-angle-down ml-8"
                          }
                        ></i>
                      </div>
                      {showDateRange &&
                      <ul
                      className="space-y-2 overflow-auto  hover:bg-gray-100"
                      style={{ maxHeight: "250px" }}
                    >
                      {_.map(dateRangeDropdown, ele => {

                        if ((ele.compareId === '3' && !showPreviousMonth) || (ele.compareId === '4' && !showPreviousYear)) {
                          return null;
                        }
                        return (
                          <div
                          onClick={() => {
                            setCompId(ele.compareId);
                            setNameFlag(false);
                            setApplyButtonFlag(true);
                          }}
                          className={[
                            `${
                              compareId === ele.compareId ? "selComp" : ""
                            } cursor-pointer flex items-center p-2 text-base font-normal 
                          text-gray-800 rounded-lg hover:text-white hover:bg-gray-300 dark:hover:bg-gray-400`,
                          ].join(" ")}
                        >
                          <span className="ml-3">{ele.title}</span>
                        </div>
                        )
                      })}
                      </ul>
                      }
                    </li>
                    <li style={{ background: customMenu ? "" : "" }}>
                      <div
                        onClick={() => {
                          setCustomMenu(!customMenu);
                          // setApplyButtonFlag(false);
                        }}
                        className="cursor-pointer flex items-center p-2 text-base font-normal
                         text-gray-800 rounded-lg hover:text-black hover:bg-gray-100 
                         dark:hover:bg-gray-400"
                      >
                        <span className="ml-3">Custom Date Range</span>
                        <i
                          className={
                            customMenu
                              ? "fa fa-angle-up ml-2"
                              : "fa fa-angle-down ml-2"
                          }
                        ></i>
                      </div>
                      {customMenu && (
                        <ul
                          className="space-y-2 overflow-auto  hover:bg-gray-100"
                          style={{ maxHeight: "250px" }}
                        >
                         <WhenPermitted permission={PERMISSIONS.EDIT_COMP_CAL} platform="dashboard">
                          {compareId != "1" && (
                            <li
                              onClick={createComp}
                              className=" comparecal__createbtn "
                            >
                              <i
                                className="fa fa-plus font-medium"
                                aria-hidden="true"
                              ></i>
                              <span className="ml-1 font-medium">Create</span>
                            </li>
                          )}
                          </WhenPermitted>
                          {compDates.map((item, tabIndex) => {
                            return (
                              <li
                                key={tabIndex}
                                onClick={() => {
                                  setCompId(item._id);
                                  editComp(item);
                                  // setApplyButtonFlag(false);
                                }}
                                className={`${
                                  compareId === item._id
                                    ? "selComp text-black"
                                    : ""
                                }
                              flex justify-between  cursor-pointer items-center  text-base font-normal px-4 py-2
                               text-gray-800 rounded-lg  hover:bg-gray-300 dark:hover:bg-gray-300 
                               hover:text-white`}
                              >
                                <div
                                  onClick={() => {
                                    // setCompId(item._id);
                                    // editComp(item);
                                    setApplyButtonFlag(true);

                                    setNameFlag(false);
                                  }}
                                  className=" w-[90%] "
                                >
                                  {/* <span
                                onClick={() => {
                                  // setCompId(item._id);
                                  // editComp(item);
                                }}
                                className="ml-3 bg-red-400"
                              > */}
                                  {item.comparison_name.length > 15
                                    ? item.comparison_name.slice(0, 15) + "..."
                                    : item.comparison_name}
                                  {/* </span> */}
                                  {/* <img
                              
                                onClick={() => {
                                  // editComp(item);
                                  setNameFlag(true);
                                }}
                                class="header-buttons mr-1 bg-yellow-300"
                                src="/assets/images/edit.svg"
                                alt=""
                              ></img> */}
                                </div>
                               <WhenPermitted permission={PERMISSIONS.EDIT_COMP_CAL} platform="dashboard"> 
                                <img
                                  onClick={() => {
                                    setCompId(item._id); 
                                    editComp(item);
                                    setNameFlag(true);
                                    setApplyButtonFlag(false);
                                  }}
                                  className="header-buttons mr-1 cursor-pointer right-0"
                                  src="/assets/images/edit.svg"
                                  alt=""
                                ></img>
                                </WhenPermitted>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </li>
                  </ul>
                </div>
                {/* {console.log(compareId, "<< comare id")} */}
                {compareId !== "1" && (
                  <div className="">
                    <div className="bg-white flex mb-3 p-2">
                      {nameFlag === true && (
                        <div>
                          <input
                            required
                            value={name}
                            className={`border-2 h-8 pl-2 rounded border-gray-400${
                              !validInput ? "border-rose-600" : ""
                            }`}
                            maxLength={30}
                            placeholder="Name"
                            onChange={(e) => {
                              setValidInput(true);
                              setName(e.target.value);
                            }}
                          ></input>
                          {!validInput && (
                            <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                              {checkDuplicate()
                                ? "Name already used"
                                : "Name is required"}
                            </p>
                          )}
                        </div>
                      )}

                      <div className="selectCompDate ml-2 ">
                        <h6
                          style={{
                            display: "inline-block ",
                          }}
                        >
                          {convertDateFormat(state[0].startDate)}
                          <i className="fas fa-calendar ml-2"></i>
                        </h6>
                      </div>

                      <div className="selectCompDate ml-2">
                        <h6
                          style={{
                            display: "inline-block ",
                          }}
                        >
                          {convertDateFormat(state[0].endDate)}
                          <i className="fas fa-calendar ml-2"></i>
                        </h6>
                      </div>
                    </div>
                    {/* {console.log(state, "<< state")} */}
                    <DateRangePicker
                      onChange={(item) => onChangeDate(item)}
                      moveRangeOnFirstSelection={false}
                      rangeColors={
                        platform === "ams"
                          ? ["#EF880F", "#EF880F", "#EF880F"]
                          : platform === "blinkit"
                          ? ["#11B07A", "#11B07A", "#11B07A"]
                          : platform === "zepto"
                          ? ["#3C006B", "#EF880F", "#11B07A"]
                          : platform === "instamart"
                          ? ["#851853", "#851853", "#851853"]
                          : []
                      }
                      editableDateInputs
                      ranges={state}
                      direction="horizontal"
                      months={2}
                      showSelectionPreview={false}
                      showMonthAndYearPickers={false}
                      showDateDisplay={false}
                      showMonthArrow={true}
                      staticRanges={[]}
                      inputRanges={[
                        {
                          label: "Custom",
                        },
                      ]}
                      maxDate={
                        calState.fullCalender // "This Month" option selected
                          ? new Date()
                          : new Date()
                      }
                    />
                  </div>
                )}
              </div>

              {(nameFlag || open || openDelete) && (
                <div
                  className="calenderBtnContainer border-x border-b"
                  // style={{ background: "#F3F8FC" }}
                >
                  {nameFlag === true && (
                    <>
                      <button
                        className="calBtnCancel"
                        onClick={() => {
                          setCalState({
                            ...calState,
                            showCalender: false,
                            fullCalender: false,
                          });
                          setState([
                            {
                              startDate: addDays(new Date(), -30),
                              endDate: new Date(),
                              key: "selection",
                            },
                          ]);
                        }}
                      >
                        Cancel
                      </button>
                      {editMode && (
                        <button
                          className="calBtnDlt"
                          onClick={handleDeleteOpen}
                        >
                          Delete
                        </button>
                      )}
                      <button
                        className={[
                          "calBtnApply",
                          platform === "ams" && "calBtnApply--amazon",
                          platform === "blinkit" && "calBtnApply--blinkit",
                          platform === "zepto" && "calBtnApply--zepto",
                          platform === "instamart" && "calBtnApply--insta",
                        ].join(" ")}
                        onClick={() => {
                          editMode ? validateEditInput() : validateInput(true);
                        }}
                      >
                        {editMode ? "Update" : "Save"}
                      </button>
                    </>
                  )}
                  {open && (
                    <DialogBox
                      title="Success"
                      buttonName="Ok"
                      onAccept={handleAgree}
                      onCancel={handleClose}
                      platform={platform}
                    >
                      Your selected ({convertDateFormat(state[0].startDate)} to{" "}
                      {convertDateFormat(state[0].endDate)}) date range has been
                      saved for {name}
                    </DialogBox>
                  )}

                  {openDelete && (
                    <DialogBox
                      title="Confirmation"
                      buttonName="Done"
                      onAccept={handleDelete}
                      onCancel={handleDeleteClose}
                      platform={platform}
                    >
                      Are you sure want to delete the custom scenario ?
                    </DialogBox>
                  )}
                </div>
              )}

              {applyButtonFlag === true && (
                <div className="bg-white border border-t-0 text-right pb-5 pr-4">
                  <button
                    className={[
                      "calBtnApply ",
                      platform === "ams" && "calBtnApply--amazon",
                      platform === "blinkit" && "calBtnApply--blinkit",
                      platform === "instamart" && "calBtnApply--insta",
                      platform === "zepto" && "calBtnApply--zepto",
                    ].join(" ")}
                    onClick={() => {
                      handleApplyButton();
                      setCalState({
                        ...calState,
                        showCalender: false,
                        fullCalender: false,
                      });
                    }}
                  >
                    Apply
                  </button>
                </div>
              )}
            </div>
          ) : null}
        </>
      ) : (
        <>
          <div className="selectDate" onClick={onDateRangeClick}>
            <h6
              style={{
                display: "inline-block ",
              }}
            >
              {`Compare: ${
                compareId === "nocomparison"
                  ? "No Comparison"
                  : compareId === "previous"
                  ? "Previous Period"
                  : compDates.find((item) => item._id === compareId)
                      ?.comparison_name
              }`}
              <i className="fas fa-calendar ml-2"></i>
            </h6>
          </div>
          {calState.showCalender ? (
            <div
              style={{
                left: calState.fullCalender
                  ? position === "left"
                    ? "10px"
                    : "auto"
                  : "14px",
                right: calState.fullCalender
                  ? position === "left"
                    ? "auto"
                    : "10px"
                  : "auto",
              }}
              className={[
                "calenderOuter",
                !calState.fullCalender && "calenderHide",
              ].join(" ")}
            >
              <div className="compCalenderBtnContainer ">
                {/* <div className="selectCompDate ml-2">
              <h6
                style={{
                  display: "inline-block ",
                }}
              >
                {convertDateFormat(state[0].startDate)}
                <i class="fas fa-calendar ml-2"></i>
              </h6>
            </div> */}
                <div className="selectCompDateRight">
                  <h6
                    className=""
                    style={{
                      display: "inline-block ",
                    }}
                  >
                    {`Compare: ${
                      compareId === "nocomparison"
                        ? "No Comparison"
                        : compareId === "previous"
                        ? "Previous Period"
                        : compDates.find((item) => item._id === compareId)
                            ?.comparison_name
                    }`}
                    <i className="fas fa-calendar ml-2"></i>
                  </h6>
                </div>
                <button
                  onClick={() => {
                    setCalState({
                      ...calState,
                      showCalender: false,
                      fullCalender: false,
                    });
                    setState([
                      {
                        startDate: addDays(new Date(), -30),
                        endDate: new Date(),
                        key: "selection",
                      },
                    ]);
                  }}
                  type="button"
                  className="  mr-2 text-gray-400 bg-transparent hover:bg-gray-200 h
                  over:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center 
                  items-center dark:hover:bg-gray-400 dark:hover:text-black"
                  data-modal-hide="defaultModal"
                >
                  <svg
                    className="w-3 h-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
              </div>

              <div className="grid grid-flow-col bg-white">
                {/* <div className="row-span-6 w-48  bg-white border-r-2 mt-1"> */}
                <div
                  className={
                    compareId !== "nocomparison"
                      ? "row-span-6 w-48  bg-white border-r-2 mt-1"
                      : "row-span-6 w-63 bg-white border-r-2 mt-1"
                  }
                >
                  <ul className="space-y-2">
                    <li>
                      <div
                        onClick={() => {
                          setCompId("nocomparison");
                          setApplyButtonFlag(false);
                        }}
                        className={`${
                          compareId === "nocomparison" ? "selComp" : ""
                        } cursor-pointer flex items-center p-2 text-base font-normal text-gray-800 rounded-lg
                     hover:text-black
                     hover:bg-gray-100 dark:hover:bg-gray-400`}
                      >
                        <span className="ml-3">No Comparison</span>
                      </div>
                    </li>
                    <li>
                      <div
                        onClick={() => {
                          setCompId("previous");
                          setNameFlag(false);
                          setApplyButtonFlag(true);
                        }}
                        className={`${
                          compareId == "previous" ? "selComp" : ""
                        } cursor-pointer flex items-center p-2 text-base font-normal text-gray-800 rounded-lg hover:text-black hover:bg-gray-100 dark:hover:bg-gray-400`}
                      >
                        <span className="ml-3">Previous period</span>
                      </div>
                    </li>
                    <li style={{ background: customMenu ? "#EEF0F2" : "" }}>
                      <div
                        onClick={() => {
                          setCustomMenu(!customMenu);
                          // setApplyButtonFlag(false);
                        }}
                        className="cursor-pointer flex items-center p-2 text-base font-normal 
                        text-gray-800 rounded-lg hover:text-black hover:bg-gray-100
                         dark:hover:bg-gray-400"
                      >
                        <span className="ml-3">Custom date range</span>
                        <i
                          className={
                            customMenu
                              ? "fa fa-angle-up ml-2"
                              : "fa fa-angle-down ml-2"
                          }
                        ></i>
                      </div>
                      {customMenu && (
                        <ul
                          className="space-y-2 overflow-auto bg-gray-50 hover:bg-gray-100"
                          style={{ maxHeight: "220px" }}
                        >
                          {compareId !== "1" && (
                            <li
                              onClick={createComp}
                              className="cursor-pointer ml-5 "
                            >
                              <i
                                className="fa fa-plus font-medium"
                                aria-hidden="true"
                              ></i>
                              <span className="ml-1 font-medium ">Create</span>
                            </li>
                          )}
                          {compDates.map((item, index) => {
                            return (
                              <li
                                key={index}
                                onClick={() => {
                                  setCompId(item._id);
                                  editComp(item);
                                }}
                                className={`${
                                  compareId == item._id
                                    ? "selComp text-black"
                                    : ""
                                }
                              flex justify-between  cursor-pointer items-center p-2 text-base 
                              font-normal text-gray-800 rounded-lg  hover:bg-gray-500 
                              dark:hover:bg-gray-400 hover:text-black`}
                              >
                                <div
                                  onClick={() => {
                                    // setCompId(item._id);
                                    // editComp(item);
                                    setNameFlag(false);
                                    setApplyButtonFlag(true);
                                  }}
                                  className=" w-[90%] "
                                >
                                  {/* <span
                                onClick={() => {
                                  // setCompId(item._id);
                                  // editComp(item);
                                }}
                                className="ml-3 bg-red-400"
                              > */}
                                  {item.comparison_name.length > 15
                                    ? item.comparison_name.slice(0, 15) + "..."
                                    : item.comparison_name}
                                  {/* </span> */}
                                  {/* <img
                              
                                onClick={() => {
                                  // editComp(item);
                                  setNameFlag(true);
                                }}
                                class="header-buttons mr-1 bg-yellow-300"
                                src="/assets/images/edit.svg"
                                alt=""
                              ></img> */}
                                </div>
                                <img
                                  onClick={() => {
                                    setCompId(item._id);
                                    editComp(item);
                                    setNameFlag(true);
                                    setApplyButtonFlag(false);
                                  }}
                                  className="header-buttons mr-1 cursor-pointer right-0"
                                  src="/assets/images/edit.svg"
                                  alt=""
                                ></img>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </li>
                  </ul>
                </div>
                {/* {console.log(compareId, "<< comare id")} */}
                {compareId !== "nocomparison" && (
                  <div className="">
                    <div className="bg-white flex mb-3 p-2">
                      {nameFlag === true && (
                        <div>
                          <input
                            required
                            value={name}
                            className={`border-2 h-8 pl-2 rounded border-gray-400${
                              !validInput ? "border-rose-600" : ""
                            }`}
                            placeholder="Name"
                            onChange={(e) => {
                              setValidInput(true);
                              setName(e.target.value);
                            }}
                            maxLength={30}
                          ></input>
                          {!validInput && (
                            <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                              Name is required.
                            </p>
                          )}
                        </div>
                      )}

                      <div className="selectCompDate ml-2 ">
                        <h6
                          style={{
                            display: "inline-block ",
                          }}
                        >
                          {convertDateFormat(state[0].startDate)}
                          <i className="fas fa-calendar ml-2"></i>
                        </h6>
                      </div>

                      <div className="selectCompDate ml-2">
                        <h6
                          style={{
                            display: "inline-block ",
                          }}
                        >
                          {convertDateFormat(state[0].endDate)}
                          <i className="fas fa-calendar ml-2"></i>
                        </h6>
                      </div>
                    </div>
                    {/* {console.log(state, "<< state")} */}
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
                      staticRanges={[]}
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
                  </div>
                )}
              </div>

              <div
                className="calenderBtnContainer bg-red-700"
                // style={{ background: "#F3F8FC" }}
              >
                {nameFlag == true && (
                  <>
                    <button
                      className="calBtnCancel"
                      onClick={() => {
                        setCalState({
                          ...calState,
                          showCalender: false,
                          fullCalender: false,
                        });
                        setState([
                          {
                            startDate: addDays(new Date(), -30),
                            endDate: new Date(),
                            key: "selection",
                          },
                        ]);
                      }}
                    >
                      Cancel
                    </button>
                    {editMode && (
                      <button className="calBtnDlt" onClick={handleDeleteOpen}>
                        Delete
                      </button>
                    )}
                    <button
                      className="calBtnApply"
                      onClick={() => {
                        editMode ? validateEditInput() : validateInput();
                      }}
                    >
                      {editMode ? "Update" : "Save"}
                    </button>
                  </>
                )}
                {open && (
                  <DialogBox
                    title="Success"
                    buttonName="Ok"
                    onAccept={handleAgree}
                    onCancel={handleClose}
                  >
                    Your selected ({convertDateFormat(state[0].startDate)} to{" "}
                    {convertDateFormat(state[0].endDate)}) date range has been
                    saved for {name}
                  </DialogBox>
                )}

                {openDelete && (
                  <DialogBox
                    title="Confirmation"
                    buttonName="Done"
                    onAccept={handleDelete}
                    onCancel={handleDeleteClose}
                    platform
                  >
                    Are you sure want to delete the custom scenario ?
                  </DialogBox>
                )}
              </div>
              {applyButtonFlag === true && (
                <div className="bg-white flex justify-end">
                  <button
                    className="calBtnApply "
                    onClick={() => {
                      handleApplyButton();
                      setCalState({
                        ...calState,
                        showCalender: false,
                        fullCalender: false,
                      });
                    }}
                  >
                    Apply
                  </button>
                </div>
              )}
            </div>
          ) : null}
        </>
      )}
    </div>
  );
};

export default DatePicker;

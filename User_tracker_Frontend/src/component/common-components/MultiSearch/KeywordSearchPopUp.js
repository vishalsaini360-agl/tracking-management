import React, { useEffect, useState } from "react";
import { Chips } from "primereact/chips";

export default function KeywordSearchPopUp({
  popUpData,
  showPopUp,
  setShowPopUp,
  setSearchFilter,
  searchType,
  onPopUpClose,
}) {
  const [notContainsValue, setNotContainsValue] = useState([]);
  const [nameIdError, setNameIdError] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [condition, setConditions] = useState("contains");
  const [value, setValue] = useState([]);
  const [metricFrom, setMetricFrom] = useState("");
  const [metricTo, setMetricTo] = useState("");
  const [metricType, setMetricType] = useState("single");
  const [error, setError] = useState("");
  // const [showError, setShowError] = useState(false);
  //const [filter,setFilter] = useState({key:"",value:"",condition:""});
  useEffect(() => {
    setShowModal(true);
  }, [showPopUp]);
  useEffect(() => {
    // console.log(searchType);
    if (searchType === "metric") {
      setConditions("is_greater_than");
    }
  }, [popUpData, searchType]);

  // function prepareFilter() {
  //   let filter = {};
  //   let splitKey = popUpData.key.split("-");
  //   filter.pkey = splitKey[0];
  //   filter.key = splitKey[1];
  //   filter.condition = condition;
  //   if (metricType === "metric") {
  //     filter.value = metricFrom + "," + metricTo;
  //   } else {
  //     filter.value = value;
  //   }
  //   if (!filter.value || filter.value.trim() === "" || filter.value === ",") {
  //     setError("p-inputtext p-component p-invalid mr-2");
  //     setShowError(true);
  //     return false;
  //   }
  //   setSearchFilter(filter);
  //   // console.log(filter);
  //   setShowPopUp(false);
  // }

  function prepareFilter() {
    if (popUpData.key.split("-")[0] === "name_id") {
      if (value.length == 0 && notContainsValue.length == 0) {
        setNameIdError(true);
      } else {
        setNameIdError(false);
        const filters = [
          {
            pkey: popUpData.key.split("-")[0],
            key: popUpData.key.split("-")[1],
            condition: "contains",
            value: value,
          },
          {
            pkey: popUpData.key.split("-")[0],
            key: popUpData.key.split("-")[1],
            condition: "not_contains",
            value: notContainsValue,
          },
        ];
        setSearchFilter(filters);
        setShowPopUp(false);
      }
    } else {
      let filter = {};
      let splitKey = popUpData.key.split("-");
      filter.pkey = splitKey[0];
      filter.key = splitKey[1];
      filter.condition = condition;
      if (
        (metricType === "single" && (value.length === 0 || value === "")) ||
        (metricType === "metric" && (metricFrom === "" || metricTo === ""))
      ) {
        setNameIdError(true);
      } else {
        if (metricType === "metric") {
          setNameIdError(false);
          filter.value = metricFrom + "," + metricTo;
        } else {
          filter.value = value;
        }
        setSearchFilter(filter);
        setShowPopUp(false);
      }
    }
  }

  function setCondition(val) {
    if (val === "is_between" || val === "isnt_between") {
      setMetricType("metric");
    } else {
      setMetricType("single");
    }
    setConditions(val);
  }
  // when cancel button pressed remove added search item
  function removeNodeFromSearch(key) {
    onPopUpClose(key);
    setShowPopUp(false);
  }

  return (
    <>
      {showModal && searchType !== "segment" ? (
        <>
          <div className="justify-center md-5 items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative my-6 mx-auto max-w-2xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between pl-4 pt-2 border-b border-solid border-slate-200 rounded-t bg-gray-200">
                  <p>{popUpData.data}</p>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setShowPopUp()}
                  >
                    <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                      ×
                    </span>
                  </button>
                </div>
                {/*body*/}

                <div className="relative p-6 flex-auto">
                  {searchType !== "metric" ? (
                    <div className="campaign-name-wrap">
                      {/* <div className="flex gap-6"> */}
                      <div className="flex items-center mr-4 mb-2">
                        <label
                          htmlFor="inline-radio"
                          className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          Contains
                        </label>
                      </div>
                      {/* </div> */}

                      {/* <div className=" items-center w-full">
                        <Chips
                          value={value}
                          onChange={(e) => setValue(e.value)}
                        />
                      </div> */}
                      <div
                        className="flex items-center w-full"
                        style={{
                          overflowY: "auto",
                          maxWidth: "250px",
                          minWidth: "250px",
                        }}
                      >
                        <Chips
                          value={value}
                          onChange={(e) => {
                            setValue(e.value);
                          }}
                        />
                      </div>

                      <div className="flex items-center mr- mb-2">
                        <label
                          htmlFor="inline-2-radio"
                          className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          {`Doesn't Contains`}
                        </label>
                      </div>

                      <div
                        className="flex items-center w-full"
                        style={{
                          maxWidth: "250px",
                          minWidth: "250px",
                          overflowY: "auto",
                        }}
                      >
                        <Chips
                          value={notContainsValue}
                          onChange={(e) => setNotContainsValue(e.value)}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="campaign-name-wrap">
                      <div className="flex gap-6">
                        <div className="flex items-center mr-4">
                          <div className="flex items-center mr-4">
                            <input
                              id="inline-radio"
                              type="radio"
                              checked={condition === "is_greater_than"}
                              value="is_greater_than"
                              name="inline-radio-group"
                              onChange={() => setCondition("is_greater_than")}
                              className="w-4 h-4 "
                            />
                            <label
                              htmlFor="inline-radio"
                              className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                            >
                              is greater than
                            </label>
                          </div>
                          <div className="flex items-center mr-4">
                            <input
                              id="inline-2-radio"
                              type="radio"
                              checked={condition === "is_less_than"}
                              value="is_less_than"
                              onChange={() => setCondition("is_less_than")}
                              name="inline-radio-group"
                              className="w-4 h-4 "
                            />
                            <label
                              htmlFor="inline-2-radio"
                              className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                            >
                              is lesser than
                            </label>
                          </div>
                          <div className="flex items-center mr-4">
                            <input
                              id="inline-radio"
                              type="radio"
                              checked={condition === "is_between"}
                              value="is_between"
                              name="inline-radio-group"
                              onChange={() => setCondition("is_between")}
                              className="w-4 h-4 "
                            />
                            <label
                              htmlFor="inline-radio"
                              className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                            >
                              is between
                            </label>
                          </div>
                          <div className="flex items-center mr-4">
                            <input
                              id="inline-radio"
                              type="radio"
                              checked={condition === "isnt_between"}
                              value="isnt_between"
                              name="inline-radio-group"
                              onChange={() => setCondition("isnt_between")}
                              className="w-4 h-4 "
                            />
                            <label
                              htmlFor="inline-radio"
                              className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                            >
                              {`isn't between`}
                            </label>
                          </div>
                        </div>
                      </div>
                      <br />
                      <div>
                        {metricType === "single" ? (
                          <div className="flex items-center mr-4">
                            <input
                              type="number"
                              value={value}
                              onChange={(e) => {
                                setError("");
                                setValue(e.target.value);
                              }}
                              placeholder="Search"
                              name="search"
                              className={`form-control ${error}`}
                              onKeyPress={(e) => {
                                if (e.key === "e" || e.key === "E") {
                                  e.preventDefault();
                                }
                              }}
                            />
                          </div>
                        ) : (
                          <div className="flex">
                            <div className="flex items-center mr-4">
                              <input
                                type="number"
                                value={metricFrom}
                                onChange={(e) => {
                                  setError("");
                                  setMetricFrom(e.target.value);
                                }}
                                placeholder="0"
                                name="metricFrom"
                                className={`form-control ${error}`}
                                onKeyPress={(e) => {
                                  if (e.key === "e" || e.key === "E") {
                                    e.preventDefault();
                                  }
                                }}
                              />
                            </div>
                            <div className="flex items-center mr-4"> to </div>
                            <div className="flex items-center mr-4">
                              <input
                                type="number"
                                value={metricTo}
                                onChange={(e) => {
                                  setError("");
                                  setMetricTo(e.target.value);
                                }}
                                placeholder="0"
                                name="metricTo"
                                className={`form-control ${error}`}
                                onKeyPress={(e) => {
                                  if (e.key === "e" || e.key === "E") {
                                    e.preventDefault();
                                  }
                                }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                {nameIdError && (
                  <p className="text-red-500 text-[12px] text-center">
                    {popUpData.key.split("-")[0] === "name_id"
                      ? "Press the Enter key after you've entered the input"
                      : "Fill all the parameters"}
                  </p>
                )}

                {/*footer*/}

                <div className="flex items-center justify-end p-2  border-solid border-slate-200 rounded-b">
                  <button
                    className="forTreeSelect bg-gray-500 text-white active:bg-gray-500 text-sm px-3 py-1 rounded shadow hover:bg-black  outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => removeNodeFromSearch(popUpData.key)}
                  >
                    Close
                  </button>
                  <button
                    className={["forTreeSelect searchPopupFlipkart "].join(" ")}
                    type="button"
                    onClick={() => prepareFilter()}
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </>
  );
}

import React, { useEffect, useState } from "react";

export default function KeywordSearchPopUp({
  popUpData,
  showPopUp,
  setShowPopUp,
  setSearchFilter,
  searchType,
  onPopUpClose,
}) {
  const [showModal, setShowModal] = useState(false);
  const [condition, setConditions] = useState("contains");
  const [value, setValue] = useState("");
  const [metricFrom, setMetricFrom] = useState("");
  const [metricTo, setMetricTo] = useState("");
  const [metricType, setMetricType] = useState("single");
  const [error, setError] = useState("");
  const [showError,setShowError] = useState(false)
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

  function prepareFilter() {
    let filter = {};
    let splitKey = popUpData.key.split("-");
    filter.pkey = splitKey[0];
    filter.key = splitKey[1];
    filter.condition = condition;
    if (metricType === "metric") {
      filter.value = metricFrom + "," + metricTo;
    } else {
      filter.value = value;
    }
    if (!filter.value || filter.value.trim() === "" || filter.value === ",") {
      setError("p-inputtext p-component p-invalid mr-2");
      setShowError(true)
      return false;
    }
    setSearchFilter(filter);
    // console.log(filter);
    setShowPopUp(false);
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
      {showModal ? (
        <>
          <div className="justify-center md-5 items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none ">
            <div className="relative my-6 mx-auto max-w-2xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between pl-4 pt-2 border-b border-solid border-slate-200 rounded-t bg-gray-200">
                  <p>{popUpData.data}</p>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setShowPopUp(false)}
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
                      <div className="flex gap-6">
                        <div className="flex items-center mr-4">
                          <div className="flex items-center mr-4">
                            <input
                              id="inline-radio"
                              type="radio"
                              value="contains"
                              name="inline-radio-group"
                              checked={condition === "contains"}
                              onChange={() => setCondition("contains")}
                              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                            />
                            <label
                              htmlFor="inline-radio"
                              className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                            >
                              Contains
                            </label>
                          </div>
                          <div className="flex items-center mr-4">
                            <input
                              id="inline-2-radio"
                              type="radio"
                              checked={condition === "not_contains"}
                              value="not_contains"
                              onChange={() => setCondition("not_contains")}
                              name="inline-radio-group"
                              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                            />
                            <label
                              htmlFor="inline-2-radio"
                              className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                            >
                              {`Doesn't Contains `}
                            </label>
                          </div>
                        </div>
                      </div>
                      <br />
                      <div>
                        <div className="flex items-center mr-4">
                          <input
                            type="text"
                            value={value}
                            onChange={(e) => {
                              setError("");
                              setShowError(false)
                              setValue(e.target.value);
                            }}
                            placeholder="Search"
                            name="search"
                            className={`form-control ${error}`}
                          />
                        </div>
                        {
                          showError ? (
                            <div className="text-xm text-red-500">
                              Please fill the parameter!
                            </div>
                          ) : null
                        }
                        
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
                              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
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
                              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                            />
                            <label
                              htmlFor="inline-2-radio"
                              className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                            >
                              is less than
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
                              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
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
                              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                            />
                            <label
                              htmlFor="inline-radio"
                              className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                            >
                              {`isn't between` }
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
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-2  border-solid border-slate-200 rounded-b">
                  <button
                    className="bg-gray-500 text-white active:bg-gray-500 text-sm px-3 py-1 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => removeNodeFromSearch(popUpData.key)}
                  >
                    Close
                  </button>
                  <button
                    className="bg-blue-500 text-white active:bg-blue-600 text-sm px-3 py-1 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
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

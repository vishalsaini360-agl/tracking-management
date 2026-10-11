import React, { useEffect, useRef, useState } from "react";
import CustomSelectNew from "../CustomSelectNew";
import { createPortal } from "react-dom";
import { buttonThemeObj } from "../../../style/StyleConstants";

export default function SearchPopUp({
  popUpData,
  showPopUp,
  setShowPopUp,
  setSearchFilter,
  searchType,
  onPopUpClose,
  selectedFilter,
  handleSelectedNames,
  platform,
}) {
  const [showModal, setShowModal] = useState(false);
  const [condition, setConditions] = useState("contains");
  // holds the value of contains array
  const [value, setValue] = useState([]);
  // holds the value of does not contains array
  // eslint-disable-next-line no-unused-vars
  const [notContainsValue, setNotContainsValue] = useState([]);
  const [containsType, setContainsType] = useState("Contains");
  const [showNestedPopup, setShowNestedPopup] = useState({
    show: false,
    pageX: "",
    pageY: "",
    index: 0,
    currentValues: [],
  });
  const [form, setForm] = useState({
    contains: [],
    notContains: [],
    chips: {},
    match: true,
    condition: "and",
  });
  const [metricFrom, setMetricFrom] = useState("");
  const [metricTo, setMetricTo] = useState("");
  const [metricType, setMetricType] = useState("single");
  const [error, setError] = useState("");
  //const [filter,setFilter] = useState({key:"",value:"",condition:""});
  const [nameIdError, setNameIdError] = useState(false);

  // useEffect(() => {
  //   console.log(
  //     // value,
  //     // "value of contains",
  //     notContainsValue,
  //     "not contains value"
  //   );
  // }, [notContainsValue]);

  useEffect(() => {
    // console.log(selectedFilter, "selectedFilter", searchType);
    let filter = {};
    if (
      [
        "campaign_budget_type",
        "campaign_status",
        "platform",
        "segment",
        "amazon_campaign_type",
        "zepto_campaign_type",
        "blinkit_campaign_type",
        "flipkart_campaign_type",
      ].indexOf(searchType) > -1
    ) {
      filter = { 
        key: selectedFilter[1],
        value: selectedFilter[1],
        condition: "contains",
        pkey: selectedFilter[0],
      };
      setSearchFilter(filter);
      setShowPopUp(false);
    }
  }, [selectedFilter]);

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
  //   // if (!filter.value || filter.value.trim() === "" || filter.value === ",") {
  //   //   setError("p-inputtext p-component p-invalid mr-2");
  //   //   return false;
  //   // }
  //   console.log(filter, "filter from popup");
  //   setSearchFilter(filter);
  //   setShowPopUp(false);
  // }

  const handleForm = ({ name, value }) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePopup = (event, index, currentValues, name) => {
    // Get the mouse position relative to the entire document
    const { pageX, pageY } = event;
    setShowNestedPopup({
      show: true,
      pageX,
      pageY,
      index,
      currentValues,
      name,
    });
  };

  function prepareFilter() {
    const type = popUpData.key.split("-")[0] === "name_id";
    if (type) {
      const mapKey = popUpData.mapKey;
      // eslint-disable-next-line no-console
      // console.warn(popUpData,"ppoop")
      let containsArr = value?.map((word) => `+${word}`);
      let notContainsArr = notContainsValue?.map((word) => `-${word}`);
      handleSelectedNames({
        [mapKey]: [...containsArr, ...notContainsArr],
      });
      if (form?.contains?.length == 0 && form?.notContains?.length == 0) {
        setNameIdError(true);
      } else {
        setNameIdError(false);
        const filters = [
          {
            pkey: popUpData.key.split("-")[0],
            key: popUpData.key.split("-")[1],
            condition: "contains",
            matchCondition: form.condition,
            value: form.contains,
          },
          {
            pkey: popUpData.key.split("-")[0],
            key: popUpData.key.split("-")[1],
            condition: "not_contains",
            matchCondition: form.condition,
            value: form.notContains,
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

    // console.log(filters, "<<<< filters");
  }

  const handleClosePopup = () => {
    setShowNestedPopup({
      show: false,
      pageX: "",
      pageY: "",
      index: 0,
      name: "",
      currentValues: [],
    });
  };
  const handlePopupSubmit = (obj) => {
    const arr = form[obj?.name];
    const oldValue = Array.isArray(arr[showNestedPopup?.index])
      ? arr[showNestedPopup?.index][0]
      : arr[showNestedPopup?.index];
    const newArr = [oldValue, ...obj.value];
    arr[showNestedPopup?.index] = newArr;
    const containsValue = obj?.name === "contains" ? arr : form?.contains;
    const notContainsValue =
      obj?.name === "notContains" ? arr : form?.notContains;
    const newChips = { contains: containsValue, notContains: notContainsValue };
    setForm((prev) => ({ ...prev, chips: newChips }));
    handleClosePopup();
  };

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
    // alert("etste");
    // console.log("key:::::::::::::::::::::", key);
    onPopUpClose(key);
    setShowPopUp(false);
  }
  useEffect(() => {
    setNameIdError(false);
  }, [value, notContainsValue, metricFrom, metricTo, metricType, condition]);

  const buttonColor =
    platform === "amazon"
      ? "!bg-amsPrimary "
      : platform === "blinkit"
      ? "!bg-blinkitPrimary"
      : platform === "flipkart"
      ? "!bg-flipkartPrimary"
      : platform === "zepto"
      ? "!bg-zeptoPrimary"
      : platform === "instamart"
      ? "!bg-instamartPrimary"
      : "bg-black";

  const boxColor =
    platform === "amazon"
      ? "accent-orange-600 "
      : platform === "blinkit"
      ? "accent-green-600 "
      : platform === "zepto"
      ? "accent-purple-600 "
      : platform === "instamart"
      ? "accent-pink-600 "
      : "";
  return (
    <>
      {showModal &&
      searchType !== "segment" &&
      searchType !== "platform" &&
      searchType !== "campaign_status" &&
      searchType !== "campaign_budget_type" ? (
        <>
          <div className="justify-center md-5 items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative my-6 mx-auto max-w-2xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-center justify-between px-4 py-1 border-b border-solid border-slate-200 rounded-t bg-gray-200">
                  <p>{popUpData.data}</p>
                  <button
                    className="ml-auto border-0 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setShowPopUp()}
                  >
                    <p className=" text-2xl block outline-none focus:outline-none">
                      ×
                    </p>
                  </button>
                </div>
                {/*body*/}

                <div className="relative px-6 py-4 flex-auto">
                  {searchType !== "metric" ? (
                    <div className="campaign-name-wrap w-[300px]">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="flex items-center">
                          <input
                            id="broad-match"
                            type="radio"
                            checked={form?.match}
                            onChange={() =>
                              setForm((prev) => ({ ...prev, match: true }))
                            }
                            className={`w-4 h-4 `}
                          />
                          <label
                            htmlFor="broad-match"
                            className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                          >
                            Broad Match
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            id="exact-match"
                            type="radio"
                            checked={!form?.match}
                            onChange={() =>
                              setForm((prev) => ({ ...prev, match: false }))
                            }
                            className={`w-4 h-4 `}
                          />
                          <label
                            htmlFor="exact-match"
                            className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                          >
                            Exact Match
                          </label>
                        </div>
                      </div>

                      {!form?.match && (
                        <div className="mb-3">
                          <CustomSelectNew
                            platform={platform}
                            value={containsType}
                            options={[
                              { label: "Contains", value: "Contains" },
                              {
                                label: "Doesn't Contains",
                                value: "notContains",
                              },
                            ]}
                            onChange={setContainsType}
                          />
                        </div>
                      )}

                      <div className="grid w-full items-center gap-4">
                        {(form?.match || containsType === "Contains") && (
                          <div className="flex flex-col space-y-1.5">
                            <label
                              className="text-sm mb-1 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              htmlFor="contains"
                            >
                              Contains
                            </label>
                            <MultiInput
                              id="contains"
                              placeholder="Eg- Fresh"
                              name="contains"
                              chips={form?.chips["contains"]}
                              handleChange={handleForm}
                              handlePopup={form?.match && handlePopup}
                            />
                          </div>
                        )}

                        {form?.match && (
                          <>
                            <div className="flex justify-center items-center py-1 gap-4">
                              <div className="flex items-center">
                                <input
                                  id="and"
                                  type="radio"
                                  checked={form?.condition === "and"}
                                  onChange={() =>
                                    setForm((prev) => ({
                                      ...prev,
                                      condition: "and",
                                    }))
                                  }
                                  className={`w-4 h-4 `}
                                />
                                <label
                                  htmlFor="and"
                                  className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                >
                                  And
                                </label>
                              </div>
                              <div className="flex items-center">
                                <input
                                  id="or"
                                  type="radio"
                                  checked={form?.condition === "or"}
                                  onChange={() =>
                                    setForm((prev) => ({
                                      ...prev,
                                      condition: "or",
                                    }))
                                  }
                                  className={`w-4 h-4 `}
                                />
                                <label
                                  htmlFor="or"
                                  className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                >
                                  Or
                                </label>
                              </div>
                            </div>
                          </>
                        )}

                        {(form?.match || containsType === "notContains") && (
                          <div className="flex flex-col space-y-1.5">
                            <label
                              className="text-sm mb-1 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              htmlFor="notContains"
                            >
                              Doesn&apos;t Contains
                            </label>
                            <MultiInput
                              id="notContains"
                              placeholder="Eg- Abc"
                              name="notContains"
                              chips={form?.chips["notContains"]}
                              handleChange={handleForm}
                              handlePopup={form?.match && handlePopup}
                            />
                          </div>
                        )}
                      </div>
                      {showNestedPopup?.show && (
                        <MultiInputPopOver
                          showNestedPopup={showNestedPopup}
                          setShowNestedPopup={setShowNestedPopup}
                          platform={platform}
                          handleSubmit={handlePopupSubmit}
                          handleClose={handleClosePopup}
                        />
                      )}
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
                              className={`w-4 h-4 ${boxColor} `}
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
                              className={`w-4 h-4 ${boxColor} `}
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
                              className={`w-4 h-4 ${boxColor} `}
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
                              className={`w-4 h-4 ${boxColor} `}
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

                <div className="flex items-center justify-end p-2 mb-1 border-solid border-slate-200 rounded-b">
                  <button
                    className="forTreeSelect bg-gray-500 text-white active:bg-gray-500 text-sm px-3 py-1 rounded shadow hover:bg-black  outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => removeNodeFromSearch(popUpData.key)}
                  >
                    Close
                  </button>
                  <button
                    className={`forTreeSelect text-white text-sm px-3 py-1 rounded dark:bg-black shadow hover:bg-black  outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150  ${buttonColor}`}
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

const MultiInput = ({
  name = "",
  chips = [],
  handleChange = false,
  handlePopup = false,
  ...rest
}) => {
  const [text, setText] = useState("");
  const [listArr, setListArr] = useState([]);

  const handleRemoveChip = (index) => {
    const newArr = listArr?.filter((_, listIndex) => {
      return index !== listIndex;
    });
    setListArr(newArr);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && text.length > 0) {
      let newArr = [...listArr, text];
      setListArr(newArr);
      setText("");
    } else if (
      event.key === "Backspace" &&
      text.length === 0 &&
      listArr.length > 0
    ) {
      let newArr = [...listArr];
      newArr.pop();
      setListArr(newArr);
      setText("");
    }
  };

  useEffect(() => {
    handleChange && handleChange({ name, value: listArr });
  }, [listArr]);

  useEffect(() => {
    if (chips?.length > 0) {
      setListArr(chips);
    }
  }, [chips]);

  return (
    <div className="flex items-center ring-1 p-1 max-h-24 overflow-y-auto flex-wrap gap-1 rounded-md shadow-sm ">
      {listArr?.map((value, index) => {
        return (
          <InputChip
            key={index}
            value={value}
            index={index}
            name={name}
            handleRemove={() => handleRemoveChip(index)}
            handlePopup={handlePopup}
          />
        );
      })}
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex h-9 flex-1 border text-sm transition-colors border-none outline-none pl-1"
        name={name}
        {...rest}
      />
    </div>
  );
};

const MultiInputPopOver = ({
  handleSubmit = false,
  showNestedPopup,
  handleClose,
  platform = "ams",
}) => {
  const popupRef = useRef(null);
  const [value, setValue] = useState({});

  const handleChange = (obj) => {
    setValue(obj);
  };

  useEffect(() => {
    if (popupRef.current) {
      popupRef.current.style.top = `${showNestedPopup?.pageY + 10}px`;
      popupRef.current.style.left = `${showNestedPopup?.pageX - 40}px`;
    }
  }, [showNestedPopup]);

  return createPortal(
    <div
      ref={popupRef}
      className="absolute w-[300px] bg-white flex flex-col gap-4 p-4 z-[600] border rounded-md shadow-sm "
    >
      <MultiInput
        id={showNestedPopup?.name}
        placeholder="Eg- Fresh"
        name={showNestedPopup?.name}
        chips={showNestedPopup?.currentValues}
        handleChange={handleChange}
      />
      <div className="items-center pt-0 flex justify-end gap-2">
        <button
          onClick={handleClose}
          className="border rounded-md text-sm font-medium hover:bg-gray-100 shadow hover:bg-primary/90 px-4 py-2"
        >
          Cancel
        </button>
        <button
          type="submit"
          onClick={() => {
            handleSubmit(value);
          }}
          className={`${buttonThemeObj[platform]} border rounded-md text-sm font-medium text-white shadow hover:bg-primary/90 px-4 py-2`}
        >
          Save
        </button>
      </div>
    </div>,
    document.body
  );
};

const InputChip = ({ value, index, handlePopup, handleRemove, name }) => {
  return (
    <div className="px-2 py-1 flex gap-1 hover:font-medium items-center text-sm rounded-md border-2 border-gray-200 text-slate-900 bg-gray-100 cursor-pointer">
      {Array.isArray(value) ? value[0] : value}
      {handlePopup && (
        <span
          className="flex items-center gap-0.5"
          onClick={(e) =>
            handlePopup(
              e,
              index,
              Array.isArray(value) ? value.slice(1) : [],
              name
            )
          }
        >
          <svg
            width="11"
            height="11"
            viewBox="0 0 11 11"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`hover:text-blue-500 font-semibold" ${
              Array.isArray(value) && value?.length > 0 && "text-blue-500"
            }`}
          >
            <path
              d="M6.46863 0.375977H5.53113C5.44779 0.375977 5.40613 0.417643 5.40613 0.500977V5.40723H0.750244C0.666911 5.40723 0.625244 5.44889 0.625244 5.53223V6.46973C0.625244 6.55306 0.666911 6.59473 0.750244 6.59473H5.40613V11.501C5.40613 11.5843 5.44779 11.626 5.53113 11.626H6.46863C6.55196 11.626 6.59363 11.5843 6.59363 11.501V6.59473H11.2502C11.3336 6.59473 11.3752 6.55306 11.3752 6.46973V5.53223C11.3752 5.44889 11.3336 5.40723 11.2502 5.40723H6.59363V0.500977C6.59363 0.417643 6.55196 0.375977 6.46863 0.375977Z"
              fill="currentColor"
              fillOpacity="100"
            />
          </svg>
          {Array.isArray(value) && value?.length > 1 && (
            <span className="text-blue-500">{value.length - 1}</span>
          )}
        </span>
      )}

      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#000000"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="hover:text-red-600 stroke-current"
        onClick={handleRemove}
      >
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </div>
  );
};

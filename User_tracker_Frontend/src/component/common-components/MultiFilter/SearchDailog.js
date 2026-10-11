import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { buttonThemeObj } from "../../../style/StyleConstants";
import CustomSelectNew from "../CustomSelectNew";

const SearchDailog = ({
  dailogObj = {},
  reopenData = {},
  platform = "ams",
  handleValue,
  handleValueUpdate,
  handleClose = false,
}) => {
  const [form, setForm] = useState({
    contains: [],
    notContains: [],
    match: true,
    condition: "and",
  });
  const [nameIdError, setNameIdError] = useState(false);
  const [containsType, setContainsType] = useState("Contains");
  const [showNestedPopup, setShowNestedPopup] = useState({
    show: false,
    pageX: "",
    pageY: "",
    index: 0,
    currentValues: [],
  });

  const handleForm = ({ name, value }) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (form?.contains?.length == 0 && form?.notContains?.length == 0) {
      setNameIdError(true);
      return;
    }

    let pKey = "";
    let key = "";
    let joinKey = "";
    let label = "";

    if (reopenData?.contains) {
      pKey = dailogObj?.pkey;
      key = dailogObj?.key;
      joinKey = dailogObj?.joinKey;
      label = dailogObj?.label;
    } else {
      pKey = dailogObj?.key?.split("-")[0]; //"name_id"
      key = dailogObj?.key?.split("-")[1]; // The key is seperated here "portfolio"
      joinKey = dailogObj?.key; // That's why we created join key which depicts key feaure of list like '"name_id-portfolio"'
      label = dailogObj?.data?.split("-")[0]; // For chips title
    }

    const filterArr = [
      {
        pkey: pKey,
        key: key,
        label: label,
        joinKey: joinKey,
        isExact: !form?.match,
        condition: "contains",
        matchCondition: form?.condition,
        value: form?.contains,
        action: dailogObj?.action, // For open search dailog again when clicking on chips
      },
      {
        pkey: pKey,
        key: key,
        joinKey: joinKey,
        isExact: !form?.match,
        condition: "not_contains",
        matchCondition: form?.condition,
        value: form?.notContains,
        label: dailogObj?.data?.split("-")[0], // For chips title
        action: dailogObj?.action, // For open search dailog again when clicking on chips
      },
    ];

    setNameIdError(false);

    if (reopenData?.contains) {
      handleValueUpdate(pKey, joinKey, filterArr, dailogObj?.action);
    } else {
      handleValue(pKey, joinKey, filterArr, dailogObj?.action);
    }

    handleClose();
  };

  const handleBackgroundClick = (event) => {
    // Check if the click is outside the dialog (on the overlay)
    if (event.target.classList.contains("modal-overlay")) {
      handleClose();
    }
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
    const arr = [...form[obj?.name]]; // obj?.name is contains or notContains
    const oldValue = Array.isArray(arr[showNestedPopup?.index]) // If that index value is array
      ? arr[showNestedPopup?.index][0]
      : arr[showNestedPopup?.index];

    const newValue =
      obj?.value?.length > 0 ? [oldValue, ...obj.value] : oldValue; // Add value at end of old value

    arr[showNestedPopup?.index] = newValue;
    const containsValue = obj?.name === "contains" ? arr : form?.contains;
    const notContainsValue =
      obj?.name === "notContains" ? arr : form?.notContains;

    setForm((prev) => ({
      ...prev,
      contains: containsValue,
      notContains: notContainsValue,
    }));
    handleClosePopup();
  };

  const handleCheckbox = (value) => {
    if (value === "exact") {
      const containsValue = form?.contains?.map((item) => {
        return Array.isArray(item) ? item[0] : item;
      });

      setForm((prev) => ({
        ...prev,
        contains: containsValue,
        notContains: [],
        match: false,
      }));
    } else {
      setForm((prev) => ({ ...prev, match: true }));
    }
  };

  const handleExactDropdown = (value) => {
    setForm((prev) => ({
      ...prev,
      contains: [],
      notContains: [],
    }));
    setContainsType(value);
  };

  useEffect(() => {
    if (reopenData?.contains && reopenData?.notContains) {
      if (reopenData?.isExact) {
        const type = // For dropdown of exact
          reopenData?.contains?.length > 0 ? "Contains" : "notContains";
        setContainsType(type);
      }
      setForm({
        contains: reopenData?.contains,
        notContains: reopenData?.notContains,
        match: !reopenData?.isExact,
        condition: reopenData?.matchCondition,
      });
    }
  }, [reopenData]);

  return createPortal(
    <div
      className="modal-overlay w-full h-full bg-black/20 absolute top-0 z-[500] flex justify-center items-center"
      onClick={handleBackgroundClick}
    >
      <div
        className="rounded-xl border bg-card text-card-foreground shadow w-[350px] bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col space-y-1.5 px-6 pt-6">
          <h3 className="font-semibold leading-none tracking-tight">
            {dailogObj?.data} Search
          </h3>
          <p className="text-sm text-muted-foreground">
            Find your searches in one click
          </p>
        </div>
        <div className="px-6 pb-6 ">
          <div className="flex items-center gap-2 py-4">
            <div className="flex items-center">
              <input
                id="broad-match"
                type="radio"
                checked={form?.match}
                onChange={() => handleCheckbox("broad")}
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
                onChange={() => handleCheckbox("exact")}
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
                  { label: "Doesn't Contains", value: "notContains" },
                ]}
                onChange={handleExactDropdown}
              />
            </div>
          )}

          <div className="grid w-full items-center gap-4">
            {(form?.match || containsType === "Contains") && (
              <div className="flex flex-col space-y-1.5">
                <label
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  htmlFor="contains"
                >
                  Contains
                </label>
                <MultiInput
                  id="contains"
                  placeholder="Eg- Fresh"
                  name="contains"
                  chips={form?.contains}
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
                        setForm((prev) => ({ ...prev, condition: "and" }))
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
                        setForm((prev) => ({ ...prev, condition: "or" }))
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
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  htmlFor="notContains"
                >
                  Doesn&apos;t Contains
                </label>
                <MultiInput
                  id="notContains"
                  placeholder="Eg- Abc"
                  name="notContains"
                  chips={form?.notContains}
                  handleChange={handleForm}
                  handlePopup={form?.match && handlePopup}
                />
              </div>
            )}
          </div>
          {nameIdError && (
            <div className="text-red-500 text-[12px] pt-2">
              Fill all the parameters
            </div>
          )}
        </div>
        <div className="items-center p-6 pt-0 flex justify-end gap-2">
          <button
            onClick={handleClose}
            className="border rounded-md text-sm font-medium hover:bg-gray-100 shadow hover:bg-primary/90 px-4 py-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className={`${buttonThemeObj[platform]} border rounded-md text-sm font-medium text-white shadow hover:bg-primary/90 px-4 py-2`}
          >
            Apply
          </button>
        </div>
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
    </div>,
    document.body
  );
};

export default SearchDailog;

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
      <div className="truncate max-w-[235px]">
      {Array.isArray(value) ? value[0] : value}
      </div>
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

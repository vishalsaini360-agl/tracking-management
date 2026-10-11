import { createPortal } from "react-dom";
import { buttonThemeObj } from "../../../style/StyleConstants";
import { useEffect, useState } from "react";

const MetricDailog = ({
  dailogObj = {},
  reopenData = {},
  platform = "ams",
  handleValue,
  handleValueUpdate,
  handleClose = false,
}) => {
  const [condition, setCondition] = useState("is_greater_than");
  const [value, setValue] = useState(""); // Holds value of single input field
  const [metricType, setMetricType] = useState("single"); // For showing single input or two input boxes
  const [metricFrom, setMetricFrom] = useState("");
  const [metricTo, setMetricTo] = useState("");
  const [error, setError] = useState("");
  const [nameIdError, setNameIdError] = useState(false);

  function handleCondition(val) {
    if (val === "is_between" || val === "isnt_between") {
      setMetricType("metric");
    } else {
      setMetricType("single");
    }
    setCondition(val);
  }

  const handleSubmit = () => {
    if (
      (metricType === "single" && (value.length === 0 || value === "")) ||
      (metricType === "metric" && (metricFrom === "" || metricTo === ""))
    ) {
      setNameIdError(true);
      return;
    }

    let pKey = "";
    let key = "";
    let joinKey = "";
    let label = "";
    if (reopenData?.value) {
      pKey = dailogObj?.pkey;
      key = dailogObj?.key;
      joinKey = dailogObj?.joinKey;
      label = dailogObj?.label;
    } else {
      pKey = dailogObj?.key.split("-")[0];
      key = dailogObj?.key.split("-")[1];
      joinKey = dailogObj?.key;
      label = dailogObj?.data?.split("-")[0]; // For chips title
    }

    const filterObj = {
      pkey: pKey,
      key: key,
      joinKey: joinKey,
      condition: condition,
      label: label,
      action: dailogObj?.action, // For open search dailog again when clicking on chips
    };

    if (metricType === "metric") {
      filterObj.value = metricFrom + "," + metricTo;
    } else {
      filterObj.value = value;
    }
    setNameIdError(false);

    if (reopenData?.value) {
      handleValueUpdate(pKey, joinKey, filterObj, dailogObj?.action);
    } else {
      handleValue(pKey, joinKey, filterObj, dailogObj?.action);
    }

    handleClose();
  };

  const handleBackgroundClick = (event) => {
    // Check if the click is outside the dialog (on the overlay)
    if (event.target.classList.contains("modal-overlay")) {
      handleClose();
    }
  };

  useEffect(() => {
    if (reopenData?.value && reopenData?.condition) {
      handleCondition(reopenData?.condition);

      if (
        reopenData?.condition === "is_between" ||
        reopenData?.condition === "isnt_between"
      ) {
        const arr = reopenData?.value?.split(",");
        setMetricFrom(arr[0]);
        setMetricTo(arr[1]);
      } else {
        setValue(reopenData?.value);
      }
    }
  }, [reopenData]);

  return createPortal(
    <div
      className="modal-overlay w-full h-full bg-black/20 absolute top-0 z-[500] flex justify-center items-center"
      onClick={handleBackgroundClick}
    >
      <div
        className="rounded-xl border bg-card text-card-foreground shadow w-[500px] bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col space-y-1.5 p-6">
          <h3 className="font-semibold leading-none tracking-tight">
            {dailogObj?.data}
          </h3>
          <p className="text-sm text-muted-foreground">
            Apply comparision on filter
          </p>
        </div>
        <div className="p-6 pt-0">
          <div className="flex items-center gap-3">
            <div className="flex items-center">
              <input
                id="greater-than"
                type="radio"
                checked={condition === "is_greater_than"}
                name="greater-than-group"
                onChange={() => handleCondition("is_greater_than")}
                className={`w-4 h-4 `}
              />
              <label
                htmlFor="greater-than"
                className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                is greater than
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="less-than"
                type="radio"
                checked={condition === "is_less_than"}
                onChange={() => handleCondition("is_less_than")}
                name="inline-radio-group"
                className={`w-4 h-4 `}
              />
              <label
                htmlFor="less-than"
                className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                is lesser than
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="between"
                type="radio"
                checked={condition === "is_between"}
                name="between-group"
                onChange={() => handleCondition("is_between")}
                className={`w-4 h-4 `}
              />
              <label
                htmlFor="between"
                className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                is between
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="not-between"
                type="radio"
                checked={condition === "isnt_between"}
                name="not-between-group"
                onChange={() => handleCondition("isnt_between")}
                className={`w-4 h-4 `}
              />
              <label
                htmlFor="not-between"
                className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                {`isn't between`}
              </label>
            </div>
          </div>

          <div className="pt-4 ">
            {metricType === "single" ? (
              <div className="flex items-center">
                <input
                  type="number"
                  value={value}
                  onChange={(e) => {
                    setError("");
                    setValue(e.target.value);
                  }}
                  placeholder="Eg- 123"
                  name="search"
                  className={`px-2 py-2 border w-full outline-none focus-visible:ring-1 rounded-md ${error}`}
                  onKeyPress={(e) => {
                    if (e.key === "e" || e.key === "E") {
                      e.preventDefault();
                    }
                  }}
                />
              </div>
            ) : (
              <div className="flex justify-between">
                <div className="flex items-center flex-[0.48]">
                  <input
                    type="number"
                    value={metricFrom}
                    onChange={(e) => {
                      setError("");
                      setMetricFrom(e.target.value);
                    }}
                    placeholder="0"
                    name="metricFrom"
                    className={`px-2 py-2 border w-full outline-none focus-visible:ring-1 rounded-md ${error}`}
                    onKeyPress={(e) => {
                      if (e.key === "e" || e.key === "E") {
                        e.preventDefault();
                      }
                    }}
                  />
                </div>
                <div className="flex items-center"> to </div>
                <div className="flex items-center flex-[0.48]">
                  <input
                    type="number"
                    value={metricTo}
                    onChange={(e) => {
                      setError("");
                      setMetricTo(e.target.value);
                    }}
                    placeholder="0"
                    name="metricTo"
                    className={`px-2 py-2 border w-full outline-none focus-visible:ring-1 rounded-md ${error}`}
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
            className={`${buttonThemeObj[platform]} rounded-md text-sm font-medium text-white shadow hover:bg-primary/90 px-4 py-2`}
          >
            Apply
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default MetricDailog;

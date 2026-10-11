/* eslint-disable */
import { useRef, useState } from "react";
import { useCloseWhenClickOutside } from "./useCloseWhenClickOutside";
import { saveLocalStorageAccounts } from "../../utils/helpers";

const CustomSelect = ({
  label,
  options,
  value,
  onChange,
  platform,
  name,
  className = "",
  localStorageAccounts = false,
}) => {
  // console.log("value??????????????", value);
  const [showOptions, setShowOptions] = useState(false);
  let selectedLabel = label;

  if (
    (name === "campaignManagerAms" || name === "customreport") &&
    options?.length > 0
  ) {
    let object = options.find((obj) => obj.value == value);
    if (object) {
      selectedLabel = object.label;
    } else {
      // Handle the case where no object with the specified value is found
      console.error("No object found with value:", value);
    }
  }

  const outerRef = useRef(null);
  useCloseWhenClickOutside(showOptions, setShowOptions, outerRef);
  return (
    <div className="relative" ref={outerRef}>
      <button
        className={[
          name == "customreport"
            ? "customselect__ams  campaignselect--amazon text-left"
            : "campaignselect__ams  campaignselect--amazon text-left",
          showOptions && name !== "customreport" && "amsRing",
          (platform === "ams" ||
            platform === "/amazon" ||
            platform === "amazon") &&
            "amsRing",
          (platform === "blinkit" || platform === "/blinkit") &&
            "campaignselect--blinkit blinkitRing",
          (platform === "instamart" || platform === "/instamart") &&
            "campaignselect--instamart instamartRing",
          (platform === "zepto" || platform === "/zepto") &&
            "campaignselect--zepto zeptoRing",
          (platform === "/flipkart" || platform === "flipkart") &&
            "campaignselect--flipkart flipkartRing",
          className,
        ].join(" ")}
        onClick={() => {
          setShowOptions(!showOptions);
        }}
      >
        {selectedLabel}
        {/* <div className=""><BiSolidDownArrow/></div>  */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 ">
          <img src="/assets/images/down-drop.svg" alt="" />
        </div>
      </button>

      {showOptions && (
        <div className=" absolute top-full pt-0 left-0 w-full z-[99] ">
          <ul
            className="border  w-full bg-white campaignselect__optionsContainer
           text-gray-600 text-xs"
          >
            {options.map((item, i) => (
              <li
                key={i}
                value={item[value]}
                onClick={() => {
                  if (localStorageAccounts) {
                    saveLocalStorageAccounts([item.label]);
                  }
                  onChange(item.value);
                  setShowOptions(false);
                  // setSelected(item.label);
                }}
                className="campaignselect__options py-0.5"
              >
                {item.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CustomSelect;

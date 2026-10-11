import { useEffect, useRef, useState } from "react";
import {
  ringThemeObj,
  selectOptionThemeObj,
} from "../../../style/StyleConstants";

const defaultList = [
  {
    label: "No list",
    disable: true,
  },
];

const CustomSelectDirection  = ({
  label,
  options = [],
  value,
  onChange,
  platform,
  className = "",
  disableValue,
  optionValue = "value",
  optionLabel = "label",
}) => {
  let listArr = options?.length > 0 ? options : defaultList;
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownDirection, setDropdownDirection] = useState("down"); // 'up' or 'down'

  let selectedLabel = label;

  if (options?.length > 0) {
    let object = options?.find((obj) => obj[optionValue] == value);

    if (object) {
      selectedLabel = object[optionLabel];
    } else {
      // Handle the case where no object with the specified value is found
      console.error("No object found with value:", value);
    }
  }

  const selectRef = useRef(null);

  const handleClickOutside = (event) => {
    if (selectRef.current && !selectRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  const calculateDropdownPosition = () => {
    if (selectRef.current) {
      const rect = selectRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;

      if (spaceBelow < 320 && spaceAbove > spaceBelow) {
        setDropdownDirection("up");
      } else {
        setDropdownDirection("down");
      }
    }
  };

  useEffect(() => {
    if (isOpen) {
      calculateDropdownPosition();
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={selectRef}>
      <button
        className={[
          "text-left customselect_outer !outline-none",
          ringThemeObj[platform],
          className,
        ].join(" ")}
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        {selectedLabel}
        <div className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 ">
          <img src="/assets/images/down-drop.svg" alt="" />
        </div>
      </button>

      {isOpen && (
        <div
          className={`absolute ${
            dropdownDirection === "up" ? "bottom-full" : "top-full"
          } pt-0 left-0 w-full z-[99]`}
        >
          <ul className="border w-full bg-white text-gray-600 text-xs shadow-[0_5px_5px_#ddd] overflow-y-auto max-h-[200px]">
            {listArr?.map((item, i) => (
              <li
                key={i}
                onClick={() => {
                  if (disableValue !== item[optionValue] && !item?.disable) {
                    onChange(item[optionValue]);
                    setIsOpen(false);
                  }
                }}
                className={`px-2 cursor-pointer py-0.5 
                  ${
                    disableValue === item[optionValue] || item?.disable
                      ? "hover:bg-none text-gray-500 hover:bg-gray-100"
                      : `${selectOptionThemeObj[platform]} hover:text-white`
                  }`}
              >
                {item[optionLabel]}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CustomSelectDirection ;

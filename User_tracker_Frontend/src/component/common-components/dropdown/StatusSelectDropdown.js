import { memo, useState } from "react";
import { Dropdown } from "primereact/dropdown";
import { DROPDOWNDESIGN } from "./CONSTANTS";
import "./style.css";

function StatusSelectDropdown({
  handleSuccess,
  state = "Unknown",
  optionList = [],
  statusFlagObj,
  ...props
}) {
  let stateValidate = state ? state?.toUpperCase() : "Unknown";
  // eslint-disable-next-line no-console
  // console.log(stateValidate, ">>>>>>>>>>>>");
  let rowState = DROPDOWNDESIGN[stateValidate.toUpperCase()]
    ? DROPDOWNDESIGN[stateValidate.toUpperCase()]
    : {
        stateText: "Unknown",
        statusImg: "/assets/images/pause.svg",
        className: "w-[5px] top-[6px] left-2",
      };
  // let statusImage = DROPDOWNDESIGN[stateValidate.toUpperCase()]?.statusImg;
  const [selectedOption, setSelectedOption] = useState({});

  const handleChange = (obj) => {
    setSelectedOption(null);
    handleSuccess({ status: obj?.status, statusFlag: statusFlagObj });
  };

  return (
    <div className="card flex justify-content-center relative">
      <img
        className={`absolute z-10 ${rowState?.className}`}
        src={rowState?.statusImg}
      />

      <Dropdown
        value={selectedOption}
        onChange={(e) => handleChange(e.value)}
        options={optionList}
        optionLabel="name"
        placeholder={rowState.stateText}
        className={`min-w-[5rem]  px-1 !font-medium !leading-tight ${rowState?.stateText
          .split(" ")
          .join("-")} ${props.disabled && "hideArrow pr-3"}`}
        {...props}
      />
    </div>
  );
}

export default memo(StatusSelectDropdown);

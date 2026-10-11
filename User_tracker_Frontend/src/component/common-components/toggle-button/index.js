import React from "react";
import "./style.css";

const Toggle = ({ label1, label2, setVal, platform,className="" }) => {
  return (
    <React.Fragment>
      <label
        className={[
          "toggleSwitch nolabel",
          platform === "blinkit" && "toggleSwitch--blinkit",
          platform === "ams" && "toggleSwitch--amazon",
          platform === "zepto" && "toggleSwitch--zepto !w-[150px] !bottom-[-14px]",
          platform === "instamart" && "toggleSwitch--instamart",
          className
        ].join(" ")}
        // onClick={setVal}
      >
        
        <input
          type="checkbox"
          onChange={() => {
            setVal();
          }}
        />
        <a></a>
        <span>
          <span className="left-span">{label1}</span>
          <span className="right-span">{label2}</span>
        </span>
      </label>
    </React.Fragment>
  );
};

export default Toggle;

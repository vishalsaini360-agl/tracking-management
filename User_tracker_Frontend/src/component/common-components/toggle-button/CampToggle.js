import React from "react";
import "./style.css";

const Toggle = ({ label1, label2, setVal, platform, check, campaignManager }) => {
  return (
    <React.Fragment>
      <label
        className={[
          "toggleSwitch nolabel",
          platform === "blinkit" && (campaignManager ? "toggleSwitch--blinkitCampaign" : "toggleSwitch--blinkit"),
          platform === "ams" && "toggleSwitch--amazon",
          platform === "zepto" && (campaignManager ? "toggleSwitch--zeptoCampaign" : "toggleSwitch--zepto"),
          platform === "instamart" && (campaignManager ? "toggleSwitch--instamartCampaign" : "toggleSwitch--instamart"),
        ].join(" ")}
        // onClick={setVal}
      >
        
        <input
          type="checkbox"
          onChange={() => {
            setVal();
          }}
          checked={check}
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

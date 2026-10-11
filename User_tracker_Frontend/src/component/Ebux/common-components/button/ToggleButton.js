import React from "react";
import "./ToggleButton.css"; // You'll add styles here

const ToggleButton = ({ status, is_verified, triggerHandler=()=>{},my_style=false,disabled=false }) => {
  // console.log();

  return (
    <div
      className={`toggle-switch-new ${status && disabled==false ? "is-enabled" : ""}`}
      style={my_style!=false?my_style:{ cursor: is_verified ? "pointer" : "not-allowed" }}
      onClick={() => {
        if (is_verified && disabled==false) {
          triggerHandler(status);
        }
      }}
    >
      <div className="toggle-knob"></div>
    </div>
  );
};

export default ToggleButton;

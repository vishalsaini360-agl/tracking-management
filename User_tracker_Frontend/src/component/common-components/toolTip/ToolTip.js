import React, { useState } from "react";
import { AiOutlineInfoCircle } from "react-icons/ai";
// import { BiMessageSquareError } from "react-icons/bi";
import "./styles.css";

const Tooltip = ({ title, className }) => {
  // const [selectedOption, setSelectedOption] = useState("");
  const [showTooltip, setShowTooltip] = useState(false);
  // const [showHelp, setShowHelp] = useState(false);

  const toggleTooltip = () => {
    setShowTooltip(!showTooltip);
  };
  
  return (
    <>
      <div
        className="tooltip-container"
        onMouseEnter={toggleTooltip}
        onMouseLeave={toggleTooltip}
      >
        <AiOutlineInfoCircle className="h-4  pt-1" />
        {showTooltip && (
          <span className={`tooltip-text ${className}`}>
            {title
              ? title
              : "This is a test statement"}
           
          </span>
        )}
      </div>
    </>
  );
};

export default Tooltip;

import React, { useState } from "react";

const Accordion = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="accordion">
      <div className="flex capitalize" onClick={toggleAccordion}>
        <div className="accordion-title">{title}</div>
        <div
          className={`accordion-icon ${
            isOpen ? "open" : "closed"
          } cursor-pointer `}
        >
          <img
            src="/assets/images/down-arrow.png"
            alt=""
            style={{
              width: 14,
              cursor: "pointer",
              paddingTop: "6px",
              marginLeft: "1px",
            }}
          />
        </div>
      </div>
      {isOpen && <div className="accordion-content">{children}</div>}
    </div>
  );
};

export default Accordion;

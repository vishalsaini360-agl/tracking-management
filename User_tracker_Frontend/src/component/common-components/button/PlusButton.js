import React from "react";

const PlusButton = ({ onClick, platform }) => {
  return (
    <>
      <div className="p-1">
        <button
          className={[
            "h-full flipkart__primarycard flipkart__primarycard--plusbutton ",
            platform === "ams" && " flipkart__primarycard--amzn ",
            platform === "blinkit" && " flipkart__primarycard--blinkit ",
            platform === "zepto" && " flipkart__primarycard--zepto ",
          ].join("")}
          onClick={() => onClick()}
        >
          <img src="assets/images/plus.svg" alt="" className="mx-auto" />
        </button>
      </div>
    </>
  );
};
export default PlusButton;

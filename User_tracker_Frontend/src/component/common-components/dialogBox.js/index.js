import React from "react";
import "./dialog.css";

const DialogBox = ({
  title,
  children,
  onAccept,
  onCancel,
  buttonName,
  cancelbuttonName,
  platform,
  // color,
}) => {
  // console.log("platform>>>>>>>>>", platform);
  return (
    <div
      className=" dialog fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 
    flex justify-center items-center"
    >
      <div className="bg-white w-96 p-6 rounded shadow">
        <div className="mb-4">
          <h3 className="text-xl font-bold">{title}</h3>
        </div>
        <div className="mb-6">{children}</div>
        <div className="flex justify-end">
          {onCancel && (
            <button className="bg-[#E3E3E3] conCanBtn" onClick={onCancel}>
              {cancelbuttonName ? cancelbuttonName : "Cancel"}
            </button>
          )}
          <button
            className={[
              "confActBtn",
              // `bg-[${color}]`,
              platform === "blinkit" && "confActBtnblinkit",
              platform === "ams" && "confActBtnAmazon",
              platform === "zepto" && "confActBtnZepto",
              platform === "instamart" && "confActBtnInstamart",
            ].join(" ")}
            onClick={onAccept}
            // style={{ background: color + " !important" }}
          >
            {buttonName}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DialogBox;

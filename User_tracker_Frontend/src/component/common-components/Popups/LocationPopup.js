import React, { useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
const LocationPopup = ({
  smallsize,
  title,
  setShowPopup,
  children,
  subTitle,
  footerless,
  applyAction,
  popup_id_container,
  popup_content,
  apply_button_css,
  cutomButton = [],
  extrasmall,
  mediumsize,
  platform = false,
  setTempView,
  disableButton,
  component,
  customHeight,
  progress
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      setShowPopup(false);
    }, 500);
    if (component === "custom_report") {
      setShowPopup(false);
    } else if (platform === "ams") {
      setTempView();
    } else if (platform === "blinkit") {
      setTempView();
    } else if (platform === "zepto") {
      setTempView();
    } else if (platform === "flipkart") {
      setTempView();
    } else if (platform === "instamart") {
      setTempView();
    }
  };

  return (
    <>
      {isOpen && (
        <div className="popup">
          <div
            id={popup_id_container}
            className={`popup__container bg-[#f0f2f5] ${isOpen ? "open" : ""} ${
              smallsize && "popup__container--small"
            } ${extrasmall && "w-[440px]"}
                ${mediumsize && "popup__container--mediumsize"}
                ${customHeight && customHeight}
              } `}
          >
            <div
              className={[
                "py-4 px-6 bg-white",
                subTitle && "popup__heading--subTitle",
              ].join(" ")}
            >
              <div className="row justify-start gap-2 items-center">
                <div>
                  <button className="w-6 h-6 mt-1" onClick={handleClose}>
                    <IoCloseOutline size={20} />
                  </button>
                </div>
                <div>
                  <h4 className="font-roboto text-lg font-medium leading-6 text-left">
                    {title}
                  </h4>
                  {subTitle && <h4 className="">{subTitle}</h4>}
                </div>
              </div>
            </div>
            <div className="popup__content " id={popup_content}>
              {children}
            </div>
            {!footerless && (
              <div className="popup__footer">
                <div className="text-right mr-2">
                  {cutomButton.length > 0 ? (
                    cutomButton.map((item) => {
                      return (
                        <>
                          <button
                            className={["popup__button", item.style].join(" ")}
                            disabled={item.disabled}
                            onClick={item.handleClick}
                          >
                            {item.label}
                          </button>
                        </>
                      );
                    })
                  ) : (
                    <>
                      <button
                        className={[
                          "popup__button bg-white border  text-gray-800  text-sm",
                          platform === "ams" && "bg-gray-200",
                        ].join(" ")}
                        onClick={handleClose}
                      >
                        Cancel
                      </button>
                      <button
                        disabled={disableButton}
                        onClick={applyAction}
                        className={
                          apply_button_css === true
                            ? "hidden"
                            : disableButton
                            ? platform === "ams"
                              ? "popup__ams--customcol text-sm cursor-not-allowed" // Apply custom style for "ams" when disabled
                              : platform === "blinkit"
                              ? "bg-[#11B07A] popup__blinkit--customcol text-sm cursor-not-allowed" // Apply custom style for "blinkit" when disabled
                              : platform === "zepto"
                              ? "bg-[#3C006B] popup__button text-sm cursor-not-allowed" // Apply custom style for "zepto" when disabled
                              : platform === "instamart"
                              ? "bg-[#851853] popup__button text-sm cursor-not-allowed" // Apply custom style for "instamart" when disabled
                              : "popup__button text-sm cursor-not-allowed" // Default style when button is disabled
                            : platform === "ams"
                            ? "popup__ams--customcol text-sm" // Apply custom style for "ams"
                            : platform === "blinkit"
                            ? "bg-[#11B07A] popup__blinkit--customcol text-sm" // Apply custom style for "blinkit"
                            : platform === "zepto"
                            ? "bg-[#3C006B] popup__button text-sm" // Apply custom style for "zepto"
                            : platform === "instamart"
                            ? "bg-[#851853] popup__button text-sm" // Apply custom style for "instamart"
                            : "popup__button text-sm" // Default style
                        }
                      >
                        {progress ? "In Progress.." : "Add"}
                      
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default LocationPopup;

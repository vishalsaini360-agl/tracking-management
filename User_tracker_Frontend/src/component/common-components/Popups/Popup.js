import React, { useState } from "react";

const Popup = ({
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
  largesize,
  extrasmall,
  mediumsize,
  platform = false,
  setTempView = false,
  disableButton,
  component,
  customStyle = {},
  notRequiredPopupContent,
  buttonText = "Apply",
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      setShowPopup(false);
    }, 500);
    if (component === "custom_report") {
      setShowPopup(false);
    } else if (platform === "ams" && setTempView) {
      setTempView();
    } else if (platform === "blinkit" && setTempView) {
      setTempView();
    } else if (platform === "zepto" && setTempView) {
      setTempView();
    } else if (platform === "flipkart" && setTempView) {
      setTempView();
    } else if (platform === "instamart" && setTempView) {
      setTempView();
    }
  };

  return (
    <>
      {isOpen && (
        <div className="popup">
          <div
            id={popup_id_container}
            style={customStyle}
            className={`popup__container ${isOpen ? "open" : ""} ${
              smallsize && "popup__container--small"
            } ${extrasmall && "popup__container--extrasm"}
                ${mediumsize && "popup__container--mediumsize"}
                ${largesize && "popup__container--largesize"}
              } `}
          >
            <div
              className={[
                "popup__heading",
                subTitle && "popup__heading--subTitle",
              ].join(" ")}
            >
              <div className="row justify-between items-center">
                <div>
                  <h4 className="font-bold text-lg capitalize ">{title}</h4>
                  {subTitle && <h4 className="">{subTitle}</h4>}
                </div>
                <div>
                  <button className="w-5 h-5" onClick={handleClose}>
                    <img src="/assets/images/clear-icon.svg" className="w-full" alt="x" />
                  </button>
                </div>
              </div>
            </div>
            <div
              className={notRequiredPopupContent ? "" : "popup__content"}
              id={popup_content}
            >
              {children}
            </div>
            {!footerless && (
              <div className="popup__footer pt-2">
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
                            ? " popup__button text-sm cursor-not-allowed"
                            : platform === "ams"
                            ? "popup__ams--customcol text-sm"
                            : platform === "blinkit"
                            ? "popup__blinkit--customcol text-sm"
                            : platform === "zepto"
                            ? "bg-[#3C006B] popup__button text-sm"
                            : platform === "flipkart"
                            ? "bg-[#0081f7] popup__button text-sm"
                            : platform === "instamart"
                            ? "bg-[#851853] popup__button text-sm"
                            : "popup__button text-sm "
                        }
                      >
                        {buttonText}
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

export default Popup;

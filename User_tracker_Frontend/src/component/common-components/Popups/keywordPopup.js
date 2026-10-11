import React, { useState } from "react";

const KeywordPopup = ({ setShowPopup, subTitle, apply, platform }) => {
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      setShowPopup(false);
    }, 500);
  };

  return (
    <>
      {isOpen && (
        <div className="keywordpopup ">
          <div className={`keywordpopup__container ${isOpen ? "open" : ""}`}>
            <div>
              <div className="keywordpopup__content text-black px-2 text-start">
                {subTitle}
              </div>
              <div className="popup__footer pt-2">
                <div className="text-right">
                  <button
                    className="popup__button bg-slate-100 text-black  text-sm h-fit"
                    onClick={handleClose}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={apply}
                    className={[
                      "popup__button text-sm h-fit",
                      platform === "ams" && "bg-[#EF880F]",
                    ].join(" ")}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default KeywordPopup;

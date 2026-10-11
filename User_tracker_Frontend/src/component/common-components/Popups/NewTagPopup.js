import React, { useEffect, useRef } from "react";
import { useCloseWhenClickOutside } from "../useCloseWhenClickOutside";
import { createPortal } from "react-dom";
import { applyBtnObj, cancelBtnObj } from "./constant";

const NewTagPopup = ({
  open,
  setOpen,
  platform = "",
  tagData,
  schedulerPosition,
  selectedTagIds,
  handleTagCheckboxChange,
  setSelectedTagIds,
  handleAddButtonClick,
}) => {
  const popupRef = useRef(null);
  const handleClose = () => {
    setOpen(false);
    setSelectedTagIds([]);
  };

  useCloseWhenClickOutside(open, setOpen, popupRef);
  useEffect(() => {
    const calculateModalPosition = (e) => {
      if (!popupRef.current) return;
      const modalHeight = popupRef.current.clientHeight;
      const buttonTop = e.top;

      var modalTop = Math.max(buttonTop - modalHeight, 0);
      popupRef.current.style.top = `${modalTop + 5}px`;

      const modalWidth = popupRef.current.clientWidth;
      const buttonLeft = e.left;
      const windowWidth = window.innerWidth;
      const spaceRight = windowWidth - (buttonLeft + modalWidth);
      if (spaceRight < modalWidth) {
        const modalLeft = Math.min(
          buttonLeft - spaceRight,
          windowWidth - modalWidth + spaceRight
        );
        popupRef.current.style.left = `${modalLeft}px`;
      } else {
        popupRef.current.style.left = `${e.left - 220}px`;
      }
    };

    if (schedulerPosition) {
      calculateModalPosition(schedulerPosition);
    }
  }, [schedulerPosition, window]);

  useEffect(() => {
    if (open) {
      const handleScroll = (e) => {
        if (e.target.id !== "popover") {
          handleClose();
        }
      };

      window.addEventListener("scroll", handleScroll, true);

      return () => {
        window.removeEventListener("scroll", handleScroll, true);
      };
    }
  }, [open, handleClose]);

  const accentCss =
    platform === "ams"
      ? "accent-orange-600"
      : platform === "blinkit"
      ? "accent-green-600"
      : platform === "instamart"
      ? "accent-pink-800"
      : platform === "zepto"
      ? "accent-purple-900"
      : "";

  return createPortal(
    <div
      ref={popupRef}
      className={`absolute z-[100] drop-shadow-md border-t px-4 pt-2 pb-4 rounded bg-white w-max border-gray-300`}
    >
      <div className="max-h-[80vh] overflow-y-auto " id="popover">
        {tagData &&
          tagData.length > 0 &&
          tagData?.map((tags, index) => (
            <div className="flex items-center" key={index}>
              <input
                className={`mr-2 ${accentCss}`}
                type="checkbox"
                checked={selectedTagIds?.includes(tags._id)}
                onChange={(e) =>
                  handleTagCheckboxChange(e.target.checked, tags._id)
                }
              />
              <div
                style={{
                  backgroundColor: tags?.color,
                  width: "14px",
                  height: "14px",
                  borderRadius: "100%",
                  marginRight: "5px",
                  border: "1px solid gray",
                }}
              ></div>
              <div className=" text-[14px]">{tags?.tag_name}</div>
            </div>
          ))}
      </div>

      {tagData && tagData?.length > 0 ? (
        <div className="mt-4">
          <button
            className={cancelBtnObj[platform] || "cancel_btn_ams"}
            onClick={handleClose}
          >
            Cancel
          </button>
          <button
            className={applyBtnObj[platform] || "apply_btn_ams"}
            disabled={selectedTagIds?.length <= 0}
            onClick={(e) => {
              handleClose();
              handleAddButtonClick(e, "newTag");
            }}
          >
            Add
          </button>
        </div>
      ) : (
        <>
          <p>No tags</p>
          <button
            className={cancelBtnObj[platform] || "cancel_btn_ams"}
            onClick={handleClose}
          >
            Cancel
          </button>
        </>
      )}
    </div>,
    document.body
  );
};

export default NewTagPopup;

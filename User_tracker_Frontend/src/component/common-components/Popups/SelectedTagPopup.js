import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useCloseWhenClickOutside } from "../useCloseWhenClickOutside";
import { applyBtnObj, cancelBtnObj } from "./constant";

const SelectedTagPopup = ({
  open,
  setOpen,
  platform="",
  tagData,
  addedTags,
  schedulerPosition = false,
  selectedTagIds = [],
  setSelectedTagIds,
  handleEditTagCheckboxChange,
  handleAddButtonClick,
}) => {
  const popupRef = useRef(null);


  const handleClose = () => {
    setOpen(false);
    setSelectedTagIds([]);
  };

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

  
  useCloseWhenClickOutside(open, setOpen, popupRef);

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


  const accentCss=platform==="ams"?"accent-orange-600":platform==="blinkit"?"accent-green-600":platform==="instamart"?"accent-pink-800":platform==="zepto"?"accent-purple-900":"";

  return createPortal(
    <div
      ref={popupRef}
      className="absolute z-[100] drop-shadow-md border-t px-4 pt-2 pb-4 rounded bg-white min-w-max  border-gray-300"
    >
      <div className="max-h-[80vh] overflow-y-auto " id="popover">

      {addedTags?.length > 0 && <p className="font-semibold">Selected Tags</p>}
      {addedTags?.map((item) => {
        const tag = tagData?.find((tagItem) => tagItem._id === item);
        if (tag) {
          return (
            <div key={tag._id}>
              <div className="flex items-center">
                <input
                  className={`mr-2 ${accentCss}`}
                  type="checkbox"
                  checked={addedTags.includes(tag._id)}
                  onChange={(e) => handleEditTagCheckboxChange(e, tag._id)}
                />
                <div
                  style={{
                    backgroundColor: tag?.color,
                    width: "14px",
                    height: "14px",
                    borderRadius: "100%",
                    marginRight: "5px",
                    borderColor: "green",
                  }}
                ></div>
                <div className=" text-[14px]"> {tag?.tag_name}</div>
              </div>
            </div>
          );
        } else {
          return null;
        }
      })}
      {tagData?.length !== addedTags?.length && (
        <p className="font-semibold">Select more tags</p>
      )}
      {tagData?.map((tag) => {
        if (!addedTags?.includes(tag?._id)) {
          return (
            <div key={tag._id}>
              <div className="flex items-center">
                <input
                  className="mr-2 accent-orange-600"
                  type="checkbox"
                  checked={selectedTagIds?.includes(tag?._id)} // Check if the tag is selected
                  onChange={(e) => handleEditTagCheckboxChange(e, tag._id)}
                />
                <div
                  style={{
                    backgroundColor: tag?.color,
                    width: "14px",
                    height: "14px",
                    borderRadius: "100%",
                    marginRight: "5px",
                    border:"1px solid gray"
                  }}
                ></div>
                <div className=" text-[14px]"> {tag?.tag_name}</div>
              </div>
            </div>
          );
        } else {
          return null;
        }
      })}

      </div>

      {tagData?.length > 0 ? (
        <div className="mt-4">
          <button className={cancelBtnObj[platform]||"cancel_btn_ams"} onClick={handleClose}>
            Cancel
          </button>
          <button
            className={applyBtnObj[platform]||"apply_btn_ams"}
            // disabled={
            //   addedTags.length + selectedTagIds.length <= 0
            // }
            onClick={(e) => {
              handleClose();
              handleAddButtonClick(e, "moreTag");
            }}
          >
            Add
          </button>
        </div>
      ) : (
        <>
          <div>No tag</div>
          <button
            className={cancelBtnObj[platform]||"cancel_btn_ams"}
            onClick={() => {
              handleClose();
            }}
          >
            Cancel
          </button>
        </>
      )}
    </div>,
    document.body
  );
};

export default SelectedTagPopup;

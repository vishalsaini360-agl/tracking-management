import { createPortal } from "react-dom";
import { buttonThemeObj } from "../../../style/StyleConstants";
import { useState } from "react";

const SaveSearchDailog = ({
  platform = "ams",
  searchFilter,
  clearAllValues,
  handleSave,
  handleClose = false,
}) => {
  const [text, setText] = useState("");
  const [error, setError] = useState(false);
  const handleBackgroundClick = (event) => {
    // Check if the click is outside the dialog (on the overlay)
    if (event.target.classList.contains("modal-overlay")) {
      handleClose();
    }
  };

  return createPortal(
    <div
      className="modal-overlay w-full h-full bg-black/20 absolute top-0 z-[500] flex justify-center items-center"
      onClick={handleBackgroundClick}
    >
      <div
        className="rounded-xl border bg-card text-card-foreground shadow w-[350px] bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col space-y-1.5 p-6">
          <h3 className="font-semibold leading-none tracking-tight">
            Save Search
          </h3>
          <p className="text-sm text-muted-foreground">
            Access your save searches later
          </p>
        </div>
        <div className="p-6 pt-0">
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <input
                value={text}
                onChange={(e) => {
                  error && setError(false);
                  setText(e.target.value);
                }}
                className={`px-2 py-2 border w-full outline-none focus-visible:ring-1 rounded-md `}
              />
              {error && (
                <div className="text-red-500 text-[12px] pt-2">
                  Please enter name
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="items-center p-6 pt-0 flex justify-end gap-2">
          <button
            onClick={handleClose}
            className="border rounded-md text-sm font-medium hover:bg-gray-100 shadow hover:bg-primary/90 px-4 py-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={() => {
              if (text.length > 1) {
                handleSave(searchFilter, text, () => {
                  clearAllValues();
                  handleClose();
                });
              } else {
                setError(true);
              }
            }}
            className={`${buttonThemeObj[platform]} border rounded-md text-sm font-medium text-white shadow hover:bg-primary/90 px-4 py-2`}
          >
            Save
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default SaveSearchDailog;

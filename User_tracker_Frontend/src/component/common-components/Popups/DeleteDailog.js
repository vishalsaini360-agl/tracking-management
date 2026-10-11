import { createPortal } from "react-dom";

const DeleteDailog = ({ heading = "", text = "", handleClose = false }) => {
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
        className="rounded-xl border bg-card text-card-foreground shadow max-w-[500px] bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col space-y-1.5 p-6 text-center sm:text-left">
          <h2 className="mb-2 text-lg font-semibold">
            {heading || `Are you absolutely sure?`}
          </h2>
          <p id="radix-:r44:" className="text-sm text-muted-foreground">
            {text ||
              `This action cannot be undone. This will permanently delete your
           remove your data from our servers.`}
          </p>
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
            className={`bg-[#e53a3a] rounded-md text-sm font-medium text-white shadow hover:bg-primary/90 px-4 py-2`}
          >
            Delete
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default DeleteDailog;

import React from "react";

const ConfirmationPopup = ({
  status = "default",
  handleSuccess = false,
  handleCancel = false,
  buttonCss="bg-amber-500 border-amber-500 ",
  entity="campaign"
}) => {
  return (
    <div className="popup">
      <div className="font-inter px-8 pt-8 pb-6 bg-white rounded-sm shadow flex-col justify-start items-end gap-5 inline-flex">
        <div className=" font-inter w-[352px] justify-start items-start gap-4 inline-flex">
          <img
            className=" imgicon"
            src={"/assets/images/confirmAlert.svg"}
            alt=""
          />
          <div className="font-inter grow shrink basis-0 flex-col justify-start items-start gap-2 inline-flex">
            <div className="font-inter self-stretch text-black/opacity-90 text-base font-medium  leading-normal">
              Confirmation
            </div>
            <div className="font-inter self-stretch text-black/opacity-90 text-sm  leading-snug">
              {`Are you sure you want to ${status} this ${entity}?`}
            </div>
          </div>
        </div>
        <div className="font-inter justify-end items-start gap-4 inline-flex">
          <div
            onClick={() => handleCancel && handleCancel()}
            className="justify-start items-center gap-2 cursor-pointer flex"
          >
            <div className="font-inter px-[15px] py-1 bg-white rounded-sm shadow border border-zinc-300 justify-center items-center gap-2.5 flex">
              <div className="font-inter text-center text-black/opacity-90 text-sm  leading-snug">
                Cancel
              </div>
            </div>
          </div>
          <div
            onClick={() => handleSuccess && handleSuccess()}
            className="justify-start items-center gap-2 flex cursor-pointer"
          >
            <div className={`font-inter px-[15px] py-1 ${buttonCss} rounded-sm shadow border justify-center items-center gap-2 flex`}>
              <div className="font-inter text-center text-white text-sm  leading-snug">
                Confirm
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPopup;

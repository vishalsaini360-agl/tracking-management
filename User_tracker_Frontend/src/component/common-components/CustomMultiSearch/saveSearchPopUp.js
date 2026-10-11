import React, { useState } from "react";
import { buttonThemeObj, ringThemeObj } from "../../../style/StyleConstants";

export default function SaveSearchPopUp({
  setSearchName,
  platform,
  setSaveSearchModal,
}) {
  // const [showModal, setShowModal] = useState(false);
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  // useEffect(() => {
  //   setShowModal(true);
  // }, [showPopUp]);
  function prepareSearchName() {
    setSearchName(value);
    // console.log(value);
    setSaveSearchModal(false);
    // setShowModal(false);
  }
  return (
    <>
      {/* {showModal ? (
        <> */}
      <div
        className="justify-center md-5 items-center flex overflow-x-hidden
           overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
      >
        <div className="relative my-6 mx-auto max-w-2xl">
          {/*content*/}
          <div
            className="border-0 rounded-lg shadow-lg relative flex flex-col
              bg-white outline-none focus:outline-none !w-64"
          >
            {/*header*/}
            <div
              className="flex items-start justify-between px-4 py-2 border-b border-solid 
                border-slate-200 rounded-t bg-gray-200 font-semibold"
            >
              <p>Save Your Search</p>
              <button
                className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 
                  float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
              >
                <span
                  className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block 
                    outline-none focus:outline-none"
                >
                  ×
                </span>
              </button>
            </div>
            {/*body*/}
            <div className="campaign-name-wrap">
              <div className="relative  py-7 px-4">
                <div>
                  <div className="flex gap-6"></div>
                  <div className="flex items-center">
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => {
                        setError("");
                        setValue(e.target.value);
                      }}
                      placeholder="Search"
                      name="search"
                      className={`form-control w-full ${error} ${ringThemeObj[platform]}`}
                    />
                  </div>
                </div>
              </div>
            </div>
            {/*footer*/}
            <div className="flex items-center justify-end p-2  border-solid border-slate-200 rounded-b">
              <button
                className="bg-gray-500 text-white active:bg-gray-500 text-sm px-3 py-1 rounded shadow 
                    hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
                onClick={() => {
                  // setShowModal(false);
                  setSaveSearchModal(false);
                }}
              >
                Close
              </button>
              <button
                disabled={value.replace(/\s/g, "").length === 0}
                className={[
                  " text-white text-sm px-3 py-1 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150",
                  // platform === "blinkit" && "bg-green-600 active:bg-green-600",
                  buttonThemeObj[platform],
                  value.replace(/\s/g, "").length === 0 && "cursor-not-allowed",
                ].join(" ")}
                type="button"
                onClick={() => prepareSearchName()}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
    // : (
    //   ""
    // )}
    // </>
  );
}

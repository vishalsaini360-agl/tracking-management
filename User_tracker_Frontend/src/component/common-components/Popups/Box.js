import React from "react";

const Box = ({ title, platform }) => {
  return (
    <>
      <div
        className={`mt-4 mr-3 border rounded cursor-pointer min-w-[10rem] relative ${
          platform === "zepto"
            ? "bg-[#E3DBEA] border-[#3C006B]"
            : platform === "flipkart"
            ? "bg-blue-100 border-blue-400"
            : platform === "amazon"
            ? "bg-green-100 border-green-400"
            : platform === "blinkit"
            ? "bg-purple-100 border-purple-400"
            : "bg-gray-100 border-gray-400"
        }`}
      >
        <div className="crossButton flex flex-row-reverse absolute  ">
          <img className="flex-end" src="assets/images/cross-icon.svg" alt="" />
        </div>
        <div className=" p-4 row">
          <div>
            <img src="assets/images/more-vertical.svg " alt=""></img>
          </div>
          <div className="capitalize pl-2">{title}</div>
        </div>
      </div>
    </>
  );
};
export default Box;

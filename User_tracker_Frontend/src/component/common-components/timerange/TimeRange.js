import React, { useState, useEffect } from "react";
import CustomSelectNew from "../CustomSelectNew";

const timeArr=[
  {
    label:"Maximum",
    value:"Maximum"
  },
  {
    label:"Yesterday",
    value:"1"
  },
  {
    label:"Last 2 days",
    value:"2"
  },
  {
    label:"Last 3 days",
    value:"3"
  },
  {
    label:"Last 7 days",
    value:"7"
  },
  {
    label:"Last 14 days",
    value:"14"
  },
  {
    label:"Last 28 days",
    value:"28"
  },
  {
    label:"Last 30 days",
    value:"30"
  },
  {
    label:"Last 60 days",
    value:"60"
  },
]

const TimeRange = ({ timeRange, platform="flipkart" }) => {
  const [time, setTime] = useState("Maximum");

  useEffect(() => {
    timeRange(time);
  }, [time]);

  return (
    <div className="flex flex-col w-full">
      <div className="">
        <label htmlFor="" className="createrulepopup-forms">
          Time range
          <span className="">
            {/* <img
              src="http://13.200.12.223/amsfrontend/upload/avatar/info.svg"
              alt=""
              data-toggle="tooltip"
              title="This is no of days you would like to apply your rule to"
            /> */}
          </span>
        </label>
      </div>
      <div className="flex-1 mt-1">
        <CustomSelectNew
          label={"Select Time"}
          options={timeArr}
          value={time}
          onChange={setTime}
          platform={platform}
          className="border-gray-300 w-full"
        />
        {/* <select
          name="time_range"
          id="time_range"
          className=" border border-gray-300 text-black h-[32px] outline-none w-full px-1 rounded"
          value={time}
          onChange={(e) => {
            setTime(e.target.value);
          }}
        >
          <option value="Maximum">Maximum</option>
          <option value="1">Yesterday</option>
          <option value="2">Last 2 days</option>
          <option value="3">Last 3 days</option>
          <option value="7">Last 7 days</option>
          <option value="14">Last 14 days</option>
          <option value="28">Last 28 days</option>
          <option value="30">Last 30 days</option>
          <option value="60">Last 60 days</option>
        </select> */}
      </div>
    </div>
  );
};

export default TimeRange;

import React from "react";
import { BsTable } from "react-icons/bs";
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';

const IconToggleTabs = ({ setGraphVisible, isGraphVisible, cardColor="bg-[#0081f7]" }) => {
  return (
    <div className="border border-[#ccc] rounded-sm flex">
      <div
        onClick={() => setGraphVisible(true)}
        className={`${
          isGraphVisible ? cardColor : "bg-white"
        } px-3 py-[2px] rounded-sm ml-[3px] my-[3px] cursor-pointer`}
      >
        <SignalCellularAltIcon style={{ color: isGraphVisible ? "white" : "#999" }} />
      </div>
      <div
        onClick={() => setGraphVisible(false)}
        className={`${
          !isGraphVisible ? cardColor : "bg-white"
        } px-3 py-[6px] rounded-sm mr-[3px] my-[3px] cursor-pointer`}
      >
        <BsTable color={!isGraphVisible ? "white" : "#999"} style={{margin:1}} />
      </div>
    </div>
  );
};

export default IconToggleTabs;

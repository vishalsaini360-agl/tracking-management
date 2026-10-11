import React, { useMemo } from "react";
import { chipLabelNameFixObj, FILTERACTION, mathSign } from "./FilterConstant";

const MetricChip = ({ obj, handleAction, handleRemoveSearch }) => {
  let mapObj = useMemo(() => {
    let newObj = { value: "", sign: "" }; // For expression filters like spends > 10, click between 10-20
    if (
      obj?.action !== FILTERACTION.APPLY &&
      obj?.action !== FILTERACTION.TAG
    ) {
      //In case of "apply" action we don't need sign and value , we need only in case of "metric"
      newObj.value = obj?.value;
      newObj.sign = mathSign[obj?.condition];
    }
    return newObj;
  }, [obj]);

  return (
    <div
      className="rounded-md px-2 flex items-center !bg-white border border-[#D6D6D7] font-semibold cursor-pointer"
      onClick={() => {
        obj?.action === FILTERACTION.METRIC &&
          handleAction(obj, { condition: obj?.condition, value: obj?.value }); // For open again
      }}
    >
      <div className="py-1 pr-1">
        <span className=" px-1 capitalize">
          {FILTERACTION.TAG === obj.action ? "Tag" : obj?.label}
        </span>
      </div>
      <div className="p-1 border-l ">
        <span className="my-1 ml-1 px-2 rounded-sm bg-[#cce6fd] text-[#0081F7]  ">
          {/* label is actual name in saved search */}
          {FILTERACTION.TAG === obj.action
            ? obj?.label
            : chipLabelNameFixObj[obj?.key] || obj.key}
        </span>
      </div>
      <>
        {mapObj?.sign && (
          <div className="p-1 border-l flex items-center">
            {mapObj?.sign === "between" || mapObj?.sign === "isn't between" ? (
              <span className="font-normal">{mapObj?.sign}</span>
            ) : (
              <span className="px-1 border rounded-sm">{mapObj?.sign}</span>
            )}
          </div>
        )}
        {mapObj?.value && (
          <div className="p-1 border-l">
            <span className="my-1 rounded-sm px-2 bg-[#cce6fd] group-hover:bg-[#eec4c4] text-[#0081F7] group-hover:text-[#DD4242] ">
              {mapObj?.value}
            </span>
          </div>
        )}
      </>
      <span
        onClick={(e) => {
          e.stopPropagation();
          handleRemoveSearch({
            keyName: obj?.pkey,
            joinKeyName: obj?.joinKey,
          });
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="15"
          height="15"
          viewBox="0 0 25 25"
          fill="none"
          stroke="#000000"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4 h-4 stroke-current hover:text-[#DD4242]"
        >
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </span>
    </div>
  );
};

export default MetricChip;

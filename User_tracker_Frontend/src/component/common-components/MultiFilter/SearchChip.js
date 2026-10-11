import React, { useMemo } from "react";

const SearchChip = ({ arr, handleAction, handleRemoveSearch }) => {
  let nameObj = useMemo(() => {
    let newObj = { contains: [], not_contains: [], label: "" };
    arr?.forEach((obj) => {
      newObj[obj?.condition] = obj?.value;
    });
    newObj.label = arr[0]?.label;
    return newObj;
  }, [arr]);

  return (
    <div
      className="rounded-md px-2 flex items-center !bg-white border border-[#D6D6D7] font-semibold cursor-pointer"
      onClick={() =>
        handleAction(arr[0], {
          contains: arr[0]?.value,
          notContains: arr[1]?.value,
          matchCondition: arr[0]?.matchCondition || false, // arr[1]?.matchCondition is also same
          isExact: arr[0]?.isExact,
        })
      }
    >
      <div className="py-1 pr-1">
        <span className=" px-1 capitalize"> {nameObj?.label}</span>
      </div>
      {nameObj?.contains?.length > 0 && (
        <>
          <div className="p-1 border-l ">
            <span className="my-1 px-1 font-normal">contains</span>
          </div>
          <div className="p-1 border-l ">
            <span className="my-1 px-2 rounded-sm bg-[#cce6fd] text-[#0081F7]  ">
              {nameObj?.contains
                ?.map((el) => {
                  if (Array.isArray(el)) {
                    return "(" + el.join(" & ") + ")";
                  }
                  return el;
                })
                .join(" || ")}
            </span>
          </div>
        </>
      )}
      {nameObj?.not_contains?.length > 0 && (
        <>
          <div className="p-1 border-l ">
            <span className="my-1 px-1 font-normal">not contains</span>
          </div>
          <div className="p-1 border-l ">
            <span className="my-1 px-2 rounded-sm bg-[#cce6fd] text-[#0081F7]  ">
              {nameObj?.not_contains
                ?.map((el) => {
                  if (Array.isArray(el)) {
                    return "(" + el.join(" & ") + ")";
                  }
                  return el;
                })
                .join(" || ")}
            </span>
          </div>
        </>
      )}
      <span
        onClick={(e) => {
          e.stopPropagation();
          handleRemoveSearch({
            keyName: arr[0]?.pkey,
            joinKeyName: arr[0]?.joinKey,
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

export default SearchChip;

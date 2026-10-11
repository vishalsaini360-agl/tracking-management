import React from "react";

const SkeletonPlatformCard = () => {
  return (
    <div className="bg-white h-full border shadow rounded-sm py-4 px-3 max-w-xs w-full mx-auto">
      <div className={`animate-pulse flex flex-col gap-2.5`}>
        <div className="bg-slate-100 h-3 w-[90%] rounded" />
        <div className="flex justify-between ">
          <div className="bg-slate-100 h-3 w-[35%] rounded" />
          <div className="bg-slate-100 h-3 w-[35%] rounded" />
        </div>
      </div>
    </div>
  );
};

export default SkeletonPlatformCard;

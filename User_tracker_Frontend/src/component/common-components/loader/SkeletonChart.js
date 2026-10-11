import React from "react";

const SkeletonChart = ({ height = "h-64" }) => {
  return (
    <div className={`w-full ${height} px-4 bg-white`}>
      <div className="border border-t-0  h-full w-full flex items-end gap-1 px-2 animate-pulse">
        <div className="h-[50%] flex-[0.1] bg-slate-100 rounded-t-md" />
        <div className="h-[70%] flex-[0.1] bg-slate-100 rounded-t-md" />
        <div className="h-[90%] flex-[0.1] bg-slate-100 rounded-t-md" />
        <div className="h-[60%] flex-[0.1] bg-slate-100 rounded-t-md" />
        <div className="h-[50%] flex-[0.1] bg-slate-100 rounded-t-md" />
        <div className="h-[80%] flex-[0.1] bg-slate-100 rounded-t-md" />
        <div className="h-[90%] flex-[0.1] bg-slate-100 rounded-t-md" />
        <div className="h-[50%] flex-[0.1] bg-slate-100 rounded-t-md" />
        <div className="h-[40%] flex-[0.1] bg-slate-100 rounded-t-md" />
        <div className="h-[30%] flex-[0.1] bg-slate-100 rounded-t-md" />
      </div>
    </div>
  );
};

export default SkeletonChart;

import React from "react";
import { MOCK_MODULES_USED } from "./mockTrackerData";

const ModulesBarChart = ({ modules = MOCK_MODULES_USED }) => {
  const maxCount = 400; // Reference max for scale

  return (
    <div className="bg-white rounded-xl border border-gray-200/80 p-5 shadow-xs flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-gray-900 tracking-tight">
          Modules Used by This User
        </h3>
        <button
          type="button"
          className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
        >
          View All Modules
        </button>
      </div>

      {/* Horizontal Progress Bars */}
      <div className="space-y-3.5 my-auto">
        {modules.map((item) => {
          const widthPercent = (item.count / maxCount) * 100;

          return (
            <div key={item.name} className="flex items-center gap-3 text-xs">
              <span className="w-28 text-gray-600 font-medium truncate shrink-0">
                {item.name}
              </span>

              {/* Bar track and fill */}
              <div className="flex-1 bg-gray-100/90 h-3.5 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500 ease-out"
                  style={{
                    width: `${widthPercent}%`,
                    backgroundColor: item.color,
                  }}
                />
              </div>

              {/* Count label */}
              <span className="w-8 text-right font-mono font-semibold text-gray-800 shrink-0">
                {item.count}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ModulesBarChart;

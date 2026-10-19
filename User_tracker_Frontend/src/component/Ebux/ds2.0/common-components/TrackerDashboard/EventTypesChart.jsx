import React from "react";
import { MOCK_EVENT_TYPES_DISTRIBUTION } from "./mockTrackerData";

const EventTypesChart = ({ data = MOCK_EVENT_TYPES_DISTRIBUTION }) => {
  const maxVal = 460; // Max ceiling for scaling

  return (
    <div className="bg-white rounded-xl border border-gray-200/80 p-5 shadow-xs flex flex-col justify-between h-full">
      {/* Header */}
      <h3 className="text-sm font-bold text-gray-900 tracking-tight mb-4">
        Event Types Distribution
      </h3>

      {/* Vertical Bar Chart Container */}
      <div className="flex items-end justify-between gap-2 sm:gap-4 h-48 pt-6 pb-2 px-2 border-b border-gray-200/80">
        {data.map((item) => {
          const heightPercent = Math.max(8, (item.count / maxVal) * 100);

          return (
            <div
              key={item.name}
              className="flex-1 flex flex-col items-center justify-end h-full group relative"
            >
              {/* Number on top of bar */}
              <span className="text-[11px] font-mono font-semibold text-gray-700 mb-1.5 transition-transform group-hover:scale-110">
                {item.count}
              </span>

              {/* Bar */}
              <div
                className="w-full max-w-[42px] rounded-t-sm transition-all duration-500 ease-out hover:opacity-90 cursor-pointer"
                style={{
                  height: `${heightPercent}%`,
                  backgroundColor: item.color,
                }}
                title={`${item.name}: ${item.count} events`}
              />
            </div>
          );
        })}
      </div>

      {/* X-axis Labels */}
      <div className="flex items-center justify-between gap-2 sm:gap-4 px-2 pt-2">
        {data.map((item) => (
          <div
            key={`label-${item.name}`}
            className="flex-1 text-center text-[10px] sm:text-[11px] font-semibold text-gray-600 truncate"
            title={item.name}
          >
            {item.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventTypesChart;

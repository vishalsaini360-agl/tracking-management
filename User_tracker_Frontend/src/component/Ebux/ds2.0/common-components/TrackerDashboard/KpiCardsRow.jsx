import React from "react";
import {
  FiUsers,
  FiPlay,
  FiClock,
  FiDownload,
  FiMousePointer,
  FiTrendingUp,
} from "react-icons/fi";
import { MOCK_KPI_METRICS } from "./mockTrackerData";

const renderIcon = (type) => {
  switch (type) {
    case "events":
      return <FiUsers className="w-5 h-5 text-blue-600" />;
    case "sessions":
      return <FiPlay className="w-5 h-5 text-blue-600 ml-0.5" />;
    case "time":
      return <FiClock className="w-5 h-5 text-blue-600" />;
    case "downloads":
      return <FiDownload className="w-5 h-5 text-blue-600" />;
    case "clicks":
      return <FiMousePointer className="w-5 h-5 text-blue-600" />;
    default:
      return <FiUsers className="w-5 h-5 text-blue-600" />;
  }
};

const KpiCardsRow = ({ metrics = MOCK_KPI_METRICS }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3.5 mb-4">
      {metrics.map((item) => (
        <div
          key={item.id}
          className="bg-white rounded-xl border border-gray-200/80 p-4 shadow-xs hover:shadow transition-shadow flex items-center gap-3.5"
        >
          {/* Circular / Rounded Square Icon Container */}
          <div className="w-11 h-11 rounded-full bg-blue-50/90 border border-blue-100 flex items-center justify-center shrink-0">
            {renderIcon(item.iconType)}
          </div>

          {/* Metric Details */}
          <div className="min-w-0">
            <div className="text-[11px] font-medium text-gray-500 truncate">
              {item.label}
            </div>
            <div className="text-xl font-bold text-gray-900 tracking-tight leading-tight my-0.5">
              {item.value}
            </div>
            <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
              <span className="flex items-center">
                <FiTrendingUp className="w-3 h-3 inline mr-0.5" />
                {item.trend}
              </span>
              <span className="text-gray-400 font-normal truncate">
                {item.period}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default KpiCardsRow;

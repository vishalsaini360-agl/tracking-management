import React from "react";
import { MOCK_RECENT_SESSIONS } from "./mockTrackerData";

const getSessionPillColor = (color) => {
  switch (color) {
    case "green":
      return "bg-emerald-50 text-emerald-700 border border-emerald-200";
    case "purple":
      return "bg-purple-50 text-purple-700 border border-purple-200";
    case "orange":
      return "bg-orange-50 text-orange-700 border border-orange-200";
    default:
      return "bg-blue-50 text-blue-700 border border-blue-200";
  }
};

const RecentSessionsCard = ({ sessions = MOCK_RECENT_SESSIONS }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200/80 p-5 shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
        <h3 className="text-sm font-bold text-gray-900 tracking-tight">
          Recent Sessions
        </h3>
        <button
          type="button"
          className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
        >
          View All
        </button>
      </div>

      {/* Sessions Timeline List */}
      <div className="space-y-4">
        {sessions.map((session) => (
          <div key={session.id} className="space-y-1.5">
            {/* Blue Indicator Dot + Time Range */}
            <div className="flex items-start gap-2 text-xs">
              <span className="w-2 h-2 rounded-full bg-blue-600 mt-1 shrink-0" />
              <span className="font-semibold text-gray-900 leading-tight">
                {session.timeRange}
              </span>
            </div>

            {/* Duration & Event Count */}
            <div className="text-[11px] text-gray-500 pl-4 font-medium">
              {session.duration} | {session.eventsCount} events
            </div>

            {/* Product Breakdown Pills */}
            <div className="flex items-center gap-1.5 pl-4 flex-wrap pt-0.5">
              {session.badges.map((b) => (
                <span
                  key={`${session.id}-${b.label}`}
                  className={`px-2 py-0.5 rounded text-[10px] font-semibold ${getSessionPillColor(
                    b.color
                  )}`}
                >
                  {b.label} {b.count}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentSessionsCard;

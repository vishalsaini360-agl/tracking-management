import React, { useState } from "react";
import toast from "react-hot-toast";
import { FiDownload, FiMoreVertical, FiArrowDown } from "react-icons/fi";
import { MOCK_ACTIVITY_DETAILS } from "./mockTrackerData";
import EventDetailModal from "./EventDetailModal";

const getProductBadge = (product) => {
  switch (product) {
    case "DS":
      return "bg-emerald-50 text-emerald-700 border border-emerald-200";
    case "PIM":
      return "bg-blue-50 text-blue-700 border border-blue-200";
    case "BM":
      return "bg-orange-50 text-orange-700 border border-orange-200";
    default:
      return "bg-gray-50 text-gray-700 border border-gray-200";
  }
};

const ActivityDetailsTable = ({ events = MOCK_ACTIVITY_DETAILS }) => {
  const [selectedEvent, setSelectedEvent] = useState(null);

  const handleExport = () => {
    try {
      const headers = [
        "#",
        "Timestamp",
        "Product",
        "Event Type",
        "Action Type",
        "Module",
        "Page",
        "Object",
        "Session ID",
        "Active Time",
      ];
      const rows = events.map((e) => [
        e.id,
        e.timestamp,
        e.product,
        e.eventType,
        e.actionType,
        e.module,
        e.page,
        e.object,
        e.sessionId,
        e.activeTime,
      ]);

      const csvContent =
        "data:text/csv;charset=utf-8," +
        [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `User_Activity_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Activity details exported successfully!");
    } catch (err) {
      toast.error("Failed to export activity details");
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200/80 p-5 shadow-xs">
        {/* Table Header Controls */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-gray-900 tracking-tight">
            Activity Details
          </h3>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExport}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50 rounded-lg text-xs font-semibold text-gray-700 shadow-2xs transition-colors"
            >
              <FiDownload className="w-3.5 h-3.5 text-gray-500" />
              <span>Export</span>
            </button>

            <button
              type="button"
              className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              title="More Options"
            >
              <FiMoreVertical className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto -mx-5 px-5">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-gray-200/80 text-[11px] font-semibold text-gray-500 bg-gray-50/50">
                <th className="py-2.5 px-3 w-8">#</th>
                <th className="py-2.5 px-3">
                  <span className="flex items-center gap-1 cursor-pointer hover:text-gray-900">
                    Timestamp
                    <FiArrowDown className="w-3 h-3 text-gray-400 inline" />
                  </span>
                </th>
                <th className="py-2.5 px-3">Product</th>
                <th className="py-2.5 px-3">Event Type</th>
                <th className="py-2.5 px-3">Action Type</th>
                <th className="py-2.5 px-3">Module</th>
                <th className="py-2.5 px-3">Page</th>
                <th className="py-2.5 px-3">Object</th>
                <th className="py-2.5 px-3">Session ID</th>
                <th className="py-2.5 px-3">Active Time</th>
                <th className="py-2.5 px-3 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {events.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-slate-50/80 transition-colors group"
                >
                  <td className="py-3 px-3 font-mono text-gray-400">{row.id}</td>
                  <td className="py-3 px-3 font-mono font-medium text-gray-800 whitespace-nowrap">
                    {row.timestamp}
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-semibold ${getProductBadge(
                        row.product
                      )}`}
                    >
                      {row.product}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-semibold text-gray-800 whitespace-nowrap">
                    {row.eventType}
                  </td>
                  <td className="py-3 px-3 text-gray-600 font-mono text-[11px] whitespace-nowrap">
                    {row.actionType}
                  </td>
                  <td className="py-3 px-3 text-gray-700 font-medium whitespace-nowrap">
                    {row.module}
                  </td>
                  <td className="py-3 px-3 font-mono text-blue-600 text-[11px] whitespace-nowrap">
                    {row.page}
                  </td>
                  <td className="py-3 px-3 text-gray-600 whitespace-nowrap">
                    {row.object}
                  </td>
                  <td className="py-3 px-3 font-mono text-gray-500 whitespace-nowrap">
                    {row.sessionId ? `${row.sessionId.slice(0, 8)}...` : "-"}
                  </td>
                  <td className="py-3 px-3 font-mono text-gray-700 whitespace-nowrap">
                    {row.activeTime}
                  </td>
                  <td className="py-3 px-3 text-right whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => setSelectedEvent(row)}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for viewing detailed event */}
      {selectedEvent && (
        <EventDetailModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </>
  );
};

export default ActivityDetailsTable;

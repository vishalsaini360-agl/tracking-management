import React, { useState } from "react";
import toast from "react-hot-toast";
import { FiCalendar, FiChevronDown } from "react-icons/fi";
import { MOCK_RECENT_SESSIONS } from "./mockTrackerData";

const FilterSidebar = ({ onApplyFilters }) => {
  const [selectedProducts, setSelectedProducts] = useState({
    pim: true,
    ds: true,
    bm: true,
  });

  const [dateRange, setDateRange] = useState("01 Jan 2025 - 31 Jan 2025");
  const [eventType, setEventType] = useState("All Event Types");
  const [moduleName, setModuleName] = useState("All Modules");
  const [sessionId, setSessionId] = useState("");

  const handleToggleProduct = (key) => {
    setSelectedProducts((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleReset = () => {
    setSelectedProducts({ pim: true, ds: true, bm: true });
    setDateRange("01 Jan 2025 - 31 Jan 2025");
    setEventType("All Event Types");
    setModuleName("All Modules");
    setSessionId("");
    if (onApplyFilters) {
      onApplyFilters({
        products: { pim: true, ds: true, bm: true },
        dateRange: "01 Jan 2025 - 31 Jan 2025",
        eventType: "All Event Types",
        moduleName: "All Modules",
        sessionId: "",
      });
    }
    toast.success("Filters reset to default");
  };

  const handleApply = (e) => {
    e.preventDefault();
    if (onApplyFilters) {
      onApplyFilters({
        products: selectedProducts,
        dateRange,
        eventType,
        moduleName,
        sessionId,
      });
    }
    toast.success("Filters applied successfully!");
  };

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

  return (
    <div className="space-y-4">
      {/* 1. Filters Card */}
      <div className="bg-white rounded-xl border border-gray-200/80 p-5 shadow-xs">
        {/* Filters Card Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
          <h3 className="text-sm font-bold text-gray-900 tracking-tight">
            Filters
          </h3>
          <button
            type="button"
            onClick={handleReset}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
          >
            Reset
          </button>
        </div>

        <form onSubmit={handleApply} className="space-y-4 text-xs">
          {/* Product Section */}
          <div>
            <label className="block text-[11px] font-semibold text-gray-700 mb-1.5">
              Product
            </label>
            <div className="relative mb-2">
              <select className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-3 py-1.5 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option>All Products</option>
                <option>Digital Shelf (DS)</option>
                <option>PIM</option>
                <option>Business Monitoring (BM)</option>
              </select>
              <FiChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none w-3.5 h-3.5" />
            </div>

            {/* Checkboxes */}
            <div className="space-y-1.5 pl-0.5">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={selectedProducts.pim}
                  onChange={() => handleToggleProduct("pim")}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
                />
                <span className="text-gray-700 text-xs">PIM</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={selectedProducts.ds}
                  onChange={() => handleToggleProduct("ds")}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
                />
                <span className="text-gray-700 text-xs">Digital Shelf (DS)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={selectedProducts.bm}
                  onChange={() => handleToggleProduct("bm")}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
                />
                <span className="text-gray-700 text-xs">
                  Business Monitoring (BM)
                </span>
              </label>
            </div>
          </div>

          {/* Date Range Section */}
          <div>
            <label className="block text-[11px] font-semibold text-gray-700 mb-1.5">
              Date Range
            </label>
            <div className="relative">
              <input
                type="text"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-lg pl-8 pr-3 py-1.5 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <FiCalendar className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
            </div>
          </div>

          {/* Event Type Section */}
          <div>
            <label className="block text-[11px] font-semibold text-gray-700 mb-1.5">
              Event Type
            </label>
            <div className="relative">
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-3 py-1.5 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option>All Event Types</option>
                <option>CLICK</option>
                <option>PAGE_ENTER</option>
                <option>NAVIGATE</option>
                <option>EXPORT</option>
                <option>PAGE_EXIT</option>
                <option>FILTER</option>
              </select>
              <FiChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none w-3.5 h-3.5" />
            </div>
          </div>

          {/* Module Section */}
          <div>
            <label className="block text-[11px] font-semibold text-gray-700 mb-1.5">
              Module
            </label>
            <div className="relative">
              <select
                value={moduleName}
                onChange={(e) => setModuleName(e.target.value)}
                className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-3 py-1.5 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option>All Modules</option>
                <option>Dashboard</option>
                <option>Product Catalog</option>
                <option>Reports</option>
                <option>User Management</option>
                <option>Settings</option>
              </select>
              <FiChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none w-3.5 h-3.5" />
            </div>
          </div>

          {/* Session ID Section */}
          <div>
            <label className="block text-[11px] font-semibold text-gray-700 mb-1.5">
              Session ID
            </label>
            <input
              type="text"
              value={sessionId}
              onChange={(e) => setSessionId(e.target.value)}
              placeholder="Enter session ID"
              className="w-full bg-white border border-gray-300 rounded-lg px-3 py-1.5 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
            />
          </div>

          {/* Apply Filters Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg text-xs shadow-xs transition-colors mt-2"
          >
            Apply Filters
          </button>
        </form>
      </div>

      {/* 2. Recent Sessions Card */}
      <div className="bg-white rounded-xl border border-gray-200/80 p-5 shadow-xs">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-3">
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

        {/* Sessions List */}
        <div className="space-y-4">
          {MOCK_RECENT_SESSIONS.map((session) => (
            <div key={session.id} className="space-y-1.5">
              {/* Dot + Time Range */}
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

              {/* Product Pills */}
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
    </div>
  );
};

export default FilterSidebar;

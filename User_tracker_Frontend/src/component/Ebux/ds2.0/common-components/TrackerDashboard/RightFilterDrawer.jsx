/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  FiX,
  FiCalendar,
  FiChevronDown,
  FiChevronRight,
} from "react-icons/fi";
import { MOCK_RECENT_SESSIONS } from "./mockTrackerData";

const INITIAL_PLATFORMS = [
  { id: "amazon", label: "Amazon", logo: "/assets/images/AmazonIcon.svg" },
  { id: "blinkit", label: "Blinkit", logo: "/assets/images/BLinkitIcon.svg" },
  { id: "flipkart", label: "Flipkart", logo: "/assets/images/FlipkartIcon.svg" },
  { id: "zepto", label: "Zepto" },
  { id: "instamart", label: "Instamart" },
];

const INITIAL_BRANDS = [
  { id: "alfa", label: "ALFA" },
  { id: "aristocrat", label: "Aristocrat" },
  { id: "footloose", label: "FOOTLOOSE" },
  { id: "vip", label: "VIP" },
  { id: "skybags", label: "Skybags" },
];

const RightFilterDrawer = ({ isOpen, onClose, onApplyFilters }) => {
  // Product checkboxes
  const [selectedProducts, setSelectedProducts] = useState({
    pim: true,
    ds: true,
    bm: true,
  });

  const [dateRange, setDateRange] = useState("01 Jan 2025 - 31 Jan 2025");
  const [eventType, setEventType] = useState("All Event Types");
  const [moduleName, setModuleName] = useState("All Modules");
  const [sessionId, setSessionId] = useState("");

  // Advanced filters state
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [selectedPlatforms, setSelectedPlatforms] = useState(new Set());
  const [selectedBrands, setSelectedBrands] = useState(new Set());

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Lock background scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

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
    setSelectedPlatforms(new Set());
    setSelectedBrands(new Set());

    if (onApplyFilters) {
      onApplyFilters({
        products: { pim: true, ds: true, bm: true },
        dateRange: "01 Jan 2025 - 31 Jan 2025",
        eventType: "All Event Types",
        moduleName: "All Modules",
        sessionId: "",
        platforms: [],
        brands: [],
        appliedCount: 0,
      });
    }

    toast.success("Filters reset to default");
  };

  const handleApply = (e) => {
    if (e) e.preventDefault();

    let count = 0;
    if (!selectedProducts.pim || !selectedProducts.ds || !selectedProducts.bm) {
      count += 1;
    }
    if (eventType !== "All Event Types") count += 1;
    if (moduleName !== "All Modules") count += 1;
    if (sessionId.trim()) count += 1;
    count += selectedPlatforms.size;
    count += selectedBrands.size;

    if (onApplyFilters) {
      onApplyFilters({
        products: selectedProducts,
        dateRange,
        eventType,
        moduleName,
        sessionId,
        platforms: Array.from(selectedPlatforms),
        brands: Array.from(selectedBrands),
        appliedCount: count,
      });
    }

    toast.success("Filters applied successfully!");
    onClose();
  };

  const togglePlatform = (id) => {
    setSelectedPlatforms((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleBrand = (id) => {
    setSelectedBrands((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fadeIn">
      {/* Dark backdrop overlay */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-2xs transition-opacity duration-300"
      />

      {/* Slide-over panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-xs sm:max-w-md bg-[#F8FAFC] shadow-2xl flex flex-col h-full transform transition-transform duration-300 ease-out font-sans border-l border-gray-200">
          {/* 1. Drawer Header */}
          <div className="flex items-center justify-between px-5 py-3.5 bg-white border-b border-gray-200 shrink-0">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="p-1 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Close filters"
              >
                <FiX className="w-5 h-5" />
              </button>
              <h2 className="text-base font-bold text-gray-900 tracking-tight">
                Filters
              </h2>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
            >
              Reset
            </button>
          </div>

          {/* 2. Scrollable Body: Exactly matching the uploaded screenshot */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* PART 1: Filters Card (Matching Screenshot exactly) */}
            <div className="bg-white rounded-xl border border-gray-200/80 p-5 shadow-xs">
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
                  <div className="relative mb-2.5">
                    <select className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option>All Products</option>
                      <option>Digital Shelf (DS)</option>
                      <option>PIM</option>
                      <option>Business Monitoring (BM)</option>
                    </select>
                    <FiChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none w-3.5 h-3.5" />
                  </div>

                  {/* Product Checkboxes */}
                  <div className="space-y-2 pl-0.5">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={selectedProducts.pim}
                        onChange={() => handleToggleProduct("pim")}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                      />
                      <span className="text-gray-700 text-xs font-medium">PIM</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={selectedProducts.ds}
                        onChange={() => handleToggleProduct("ds")}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                      />
                      <span className="text-gray-700 text-xs font-medium">
                        Digital Shelf (DS)
                      </span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={selectedProducts.bm}
                        onChange={() => handleToggleProduct("bm")}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                      />
                      <span className="text-gray-700 text-xs font-medium">
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
                      className="w-full bg-white border border-gray-300 rounded-lg pl-9 pr-3 py-2 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium"
                    />
                    <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
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
                      className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium"
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
                      className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium"
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
                    className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 font-medium"
                  />
                </div>

                {/* Apply Filters Button */}
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg text-xs shadow-xs transition-colors cursor-pointer"
                >
                  Apply Filters
                </button>
              </form>
            </div>

            {/* PART 2: Recent Sessions Card (Matching Screenshot exactly) */}
            <div className="bg-white rounded-xl border border-gray-200/80 p-5 shadow-xs">
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-3.5">
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
                {MOCK_RECENT_SESSIONS.map((session) => (
                  <div key={session.id} className="space-y-1">
                    {/* Blue dot + Time Range */}
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

            {/* Optional Collapsible Advanced Platform / Brand Section */}
            <div className="bg-white rounded-xl border border-gray-200/80 p-4 shadow-xs">
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="w-full flex items-center justify-between text-xs font-bold text-gray-800"
              >
                <span>Additional Platform & Brand Filters</span>
                {showAdvanced ? (
                  <FiChevronDown className="w-4 h-4 text-gray-500" />
                ) : (
                  <FiChevronRight className="w-4 h-4 text-gray-400" />
                )}
              </button>

              {showAdvanced && (
                <div className="pt-3 space-y-3 border-t border-gray-100 mt-2 text-xs">
                  {/* Platforms */}
                  <div>
                    <span className="font-semibold text-gray-700 block mb-1">
                      Platforms:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {INITIAL_PLATFORMS.map((p) => (
                        <label
                          key={p.id}
                          className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 px-2 py-1 rounded text-[11px] cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedPlatforms.has(p.id)}
                            onChange={() => togglePlatform(p.id)}
                            className="rounded border-gray-300 text-blue-600 w-3 h-3"
                          />
                          <span>{p.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Brands */}
                  <div>
                    <span className="font-semibold text-gray-700 block mb-1">
                      Brands:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {INITIAL_BRANDS.map((b) => (
                        <label
                          key={b.id}
                          className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 px-2 py-1 rounded text-[11px] cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedBrands.has(b.id)}
                            onChange={() => toggleBrand(b.id)}
                            className="rounded border-gray-300 text-blue-600 w-3 h-3"
                          />
                          <span>{b.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 3. Sticky Bottom Actions Bar */}
          <div className="sticky bottom-0 bg-white border-t border-gray-200 px-5 py-3 flex items-center justify-end gap-3 shadow-md shrink-0">
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-1.5 border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-colors shadow-2xs"
            >
              Clear All
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="px-6 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors shadow-xs"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightFilterDrawer;

import React, { useState, useMemo } from "react";
import toast from "react-hot-toast";
import {
  FiSearch,
  FiFilter,
  FiMaximize2,
  FiMinimize2,
  FiCopy,
  FiCheck,
  FiLayers,
  FiServer,
  FiUserCheck,
  FiActivity,
  FiX,
} from "react-icons/fi";
import LogRow from "./LogRow";
import { MOCK_LOGS_RESPONSE } from "./mockLogsData";

const LogViewer = () => {
  const [responseMeta] = useState({
    success: MOCK_LOGS_RESPONSE.success,
    product: MOCK_LOGS_RESPONSE.product,
    client_id: MOCK_LOGS_RESPONSE.client_id,
    total: MOCK_LOGS_RESPONSE.total,
    limit: MOCK_LOGS_RESPONSE.limit,
    offset: MOCK_LOGS_RESPONSE.offset,
    has_more: MOCK_LOGS_RESPONSE.has_more,
  });

  const [logs] = useState(MOCK_LOGS_RESPONSE.data);
  const [expandedIds, setExpandedIds] = useState(
    new Set([MOCK_LOGS_RESPONSE.data[0]?.event_id]) // Expand first item by default
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEventType, setSelectedEventType] = useState("ALL");
  const [isCopiedAll, setIsCopiedAll] = useState(false);

  // Distinct Event Types for Filter Buttons
  const eventTypes = useMemo(() => {
    const types = Array.from(new Set(logs.map((item) => item.event_type).filter(Boolean)));
    return ["ALL", ...types];
  }, [logs]);

  // Filtered Logs
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      // Event Type Filter
      if (selectedEventType !== "ALL" && log.event_type !== selectedEventType) {
        return false;
      }

      // Search Query Filter
      if (!searchQuery.trim()) return true;
      const query = searchQuery.toLowerCase().trim();

      const searchIn = [
        log.event_id,
        log.event_type,
        log.user_email,
        log.user_id,
        log.page_name,
        log.page_url,
        log.tab,
        log.component_type,
        log.entity_type,
        log.widget_name,
        log.client_name,
        log.client_id,
        log.session_id,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchIn.includes(query);
    });
  }, [logs, selectedEventType, searchQuery]);

  // Toggle single log expansion
  const handleToggleRow = (eventId) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(eventId)) {
        next.delete(eventId);
      } else {
        next.add(eventId);
      }
      return next;
    });
  };

  // Expand all currently filtered logs
  const handleExpandAll = () => {
    setExpandedIds(new Set(filteredLogs.map((item) => item.event_id)));
    toast.success("Expanded all logs");
  };

  // Collapse all
  const handleCollapseAll = () => {
    setExpandedIds(new Set());
    toast.success("Collapsed all logs");
  };

  // Copy full response JSON
  const handleCopyAll = () => {
    try {
      navigator.clipboard.writeText(JSON.stringify(MOCK_LOGS_RESPONSE, null, 2));
      setIsCopiedAll(true);
      toast.success("Full logs response copied to clipboard!");
      setTimeout(() => setIsCopiedAll(false), 2000);
    } catch (err) {
      toast.error("Failed to copy response");
    }
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedEventType("ALL");
  };

  return (
    <div className="w-full max-w-full mx-auto space-y-4">
      {/* 1. Header & Summary Stats */}
      <div className="bg-white rounded-xl shadow-xs border border-gray-200 p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-gray-100 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <FiActivity className="w-5 h-5" />
              </span>
              <div>
                <h1 className="text-xl font-bold text-gray-900 tracking-tight">
                  User Tracking & Activity Logs
                </h1>
                <p className="text-xs text-gray-500 mt-0.5">
                  Real-time event tracking telemetry with expandable diagnostics
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={handleCopyAll}
              className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              {isCopiedAll ? (
                <FiCheck className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <FiCopy className="w-3.5 h-3.5 text-gray-500" />
              )}
              Copy JSON
            </button>

            <button
              type="button"
              onClick={handleExpandAll}
              className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1.5 shadow-2xs"
              title="Expand all currently visible logs"
            >
              <FiMaximize2 className="w-3.5 h-3.5 text-gray-500" />
              Expand All
            </button>

            <button
              type="button"
              onClick={handleCollapseAll}
              className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1.5 shadow-2xs"
              title="Collapse all visible logs"
            >
              <FiMinimize2 className="w-3.5 h-3.5 text-gray-500" />
              Collapse All
            </button>
          </div>
        </div>

        {/* Metric Cards Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
          {/* Total Events */}
          <div className="bg-slate-50 border border-slate-100 rounded-lg p-3">
            <div className="flex items-center justify-between text-gray-500 mb-1">
              <span className="text-xs font-medium">Total Events</span>
              <FiLayers className="w-4 h-4 text-blue-500" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-gray-900 font-mono">
                {responseMeta.total.toLocaleString()}
              </span>
              <span className="text-[11px] text-gray-500">
                ({filteredLogs.length} shown)
              </span>
            </div>
          </div>

          {/* Client ID */}
          <div className="bg-slate-50 border border-slate-100 rounded-lg p-3">
            <div className="flex items-center justify-between text-gray-500 mb-1">
              <span className="text-xs font-medium">Client</span>
              <FiUserCheck className="w-4 h-4 text-purple-500" />
            </div>
            <div className="text-sm font-bold text-gray-900 truncate">
              {logs[0]?.client_name || "Vip Bags"}
            </div>
            <div className="text-[11px] text-gray-400 font-mono">
              {responseMeta.client_id}
            </div>
          </div>

          {/* Product & Service */}
          <div className="bg-slate-50 border border-slate-100 rounded-lg p-3">
            <div className="flex items-center justify-between text-gray-500 mb-1">
              <span className="text-xs font-medium">Product / Service</span>
              <FiServer className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-sm font-bold text-gray-900">
              {responseMeta.product} ({logs[0]?.service || "DS"})
            </div>
            <div className="text-[11px] text-gray-400 font-mono">
              DSM ID: {logs[0]?.dsm_client_id || "111"}
            </div>
          </div>

          {/* Environment */}
          <div className="bg-slate-50 border border-slate-100 rounded-lg p-3">
            <div className="flex items-center justify-between text-gray-500 mb-1">
              <span className="text-xs font-medium">Environment</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>
            <div className="text-sm font-bold uppercase text-emerald-700">
              {logs[0]?.environment || "QA"}
            </div>
            <div className="text-[11px] text-gray-400">
              Status: Active Telemetry
            </div>
          </div>
        </div>
      </div>

      {/* 2. Filters & Search Toolbar */}
      <div className="bg-white rounded-xl shadow-xs border border-gray-200 p-4 space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative w-full md:w-96">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search event type, user, page, session..."
              className="w-full pl-9 pr-8 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow bg-gray-50/50 focus:bg-white"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <FiX className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Showing Count */}
          <div className="flex items-center gap-2 self-start md:self-auto text-xs text-gray-500">
            <span>
              Showing <strong className="text-gray-900">{filteredLogs.length}</strong> of{" "}
              <strong className="text-gray-900">{logs.length}</strong> loaded logs
            </span>
            {(searchQuery || selectedEventType !== "ALL") && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-xs text-blue-600 hover:text-blue-800 underline font-medium ml-2"
              >
                Reset filters
              </button>
            )}
          </div>
        </div>

        {/* Event Type Filter Pills */}
        <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-gray-100">
          <div className="flex items-center gap-1 text-xs text-gray-400 mr-1">
            <FiFilter className="w-3.5 h-3.5" />
            <span>Type:</span>
          </div>
          {eventTypes.map((type) => {
            const isSelected = selectedEventType === type;
            const count =
              type === "ALL"
                ? logs.length
                : logs.filter((l) => l.event_type === type).length;

            return (
              <button
                key={type}
                type="button"
                onClick={() => setSelectedEventType(type)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-blue-600 text-white shadow-xs"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <span>{type}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected ? "bg-blue-700 text-blue-100" : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Log Records List with Accordion Rows */}
      <div className="space-y-2">
        {filteredLogs.length > 0 ? (
          filteredLogs.map((log) => (
            <LogRow
              key={log.event_id}
              log={log}
              isExpanded={expandedIds.has(log.event_id)}
              onToggle={() => handleToggleRow(log.event_id)}
            />
          ))
        ) : (
          /* Empty Search State */
          <div className="bg-white rounded-xl border border-dashed border-gray-300 p-12 text-center">
            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-400 mb-3">
              <FiSearch className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-semibold text-gray-900 mb-1">
              No matching tracking logs found
            </h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto mb-4">
              We couldn&apos;t find any log events matching &quot;{searchQuery}&quot;. Try searching for
              a different event type, user, or reset filters.
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-xs"
            >
              Clear Search & Filters
            </button>
          </div>
        )}
      </div>

      {/* 4. Footer Pagination / Info Note */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-3">
        <div>
          Offset: <strong className="font-mono text-gray-800">{responseMeta.offset}</strong> • Limit:{" "}
          <strong className="font-mono text-gray-800">{responseMeta.limit}</strong> • Has More:{" "}
          <span className="font-semibold text-emerald-600">
            {responseMeta.has_more ? "Yes" : "No"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-gray-400 text-[11px]">
            Tip: Click anywhere on a row to expand or collapse details.
          </span>
        </div>
      </div>
    </div>
  );
};

export default LogViewer;

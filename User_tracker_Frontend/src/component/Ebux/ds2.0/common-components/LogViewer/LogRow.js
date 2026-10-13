import React, { useState } from "react";
import toast from "react-hot-toast";
import {
  FiChevronDown,
  FiChevronRight,
  FiCopy,
  FiCheck,
  FiClock,
  FiUser,
  FiMonitor,
  FiCode,
  FiInfo,
  FiLayers,
} from "react-icons/fi";

const getEventTypeBadge = (type) => {
  switch (type) {
    case "PAGE_HIDDEN":
      return "bg-purple-50 text-purple-700 border-purple-200 ring-purple-600/20";
    case "POPUP_CLOSE":
      return "bg-amber-50 text-amber-700 border-amber-200 ring-amber-600/20";
    case "BUTTON_CLICK":
      return "bg-blue-50 text-blue-700 border-blue-200 ring-blue-600/20";
    case "PAGE_VIEW":
      return "bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-600/20";
    default:
      return "bg-slate-50 text-slate-700 border-slate-200 ring-slate-600/20";
  }
};

const formatTime = (isoString) => {
  if (!isoString) return "-";
  try {
    const d = new Date(isoString);
    return d.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      fractionalSecondDigits: 3,
    });
  } catch (e) {
    return isoString;
  }
};

const formatDate = (isoString) => {
  if (!isoString) return "";
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString([], {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  } catch (e) {
    return "";
  }
};

const calculateLatency = (eventTime, receivedAt) => {
  if (!eventTime || !receivedAt) return null;
  try {
    const diff = (new Date(receivedAt) - new Date(eventTime)) / 1000;
    if (isNaN(diff)) return null;
    return diff.toFixed(2);
  } catch (e) {
    return null;
  }
};

const LogRow = ({ log, isExpanded, onToggle }) => {
  const [activeTab, setActiveTab] = useState("structured"); // "structured" | "json"
  const [copiedKey, setCopiedKey] = useState(null);

  const handleCopy = (text, keyName, label = "Value") => (e) => {
    e.stopPropagation();
    if (!text) return;
    try {
      navigator.clipboard.writeText(
        typeof text === "object" ? JSON.stringify(text, null, 2) : String(text)
      );
      setCopiedKey(keyName);
      toast.success(`${label} copied to clipboard!`);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch (err) {
      toast.error("Failed to copy");
    }
  };

  const latency = calculateLatency(log.event_time, log.received_at);

  return (
    <div
      className={`border transition-all duration-200 rounded-lg overflow-hidden bg-white mb-2 shadow-sm ${
        isExpanded
          ? "border-blue-400 ring-1 ring-blue-100 shadow-md"
          : "border-gray-200 hover:border-gray-300 hover:shadow"
      }`}
    >
      {/* Accordion Row Header */}
      <div
        onClick={onToggle}
        className="cursor-pointer select-none px-4 py-3 bg-white flex flex-col md:flex-row md:items-center justify-between gap-2 transition-colors hover:bg-slate-50"
      >
        {/* Left Section: Chevron + Timestamp + Event Type + Path */}
        <div className="flex items-center gap-3 flex-wrap flex-1 min-w-0">
          <button
            type="button"
            className="text-gray-400 hover:text-gray-700 p-0.5 rounded transition-transform"
            aria-label="Toggle Log Details"
          >
            {isExpanded ? (
              <FiChevronDown className="w-5 h-5 text-blue-600 transition-transform duration-200" />
            ) : (
              <FiChevronRight className="w-5 h-5 text-gray-500 transition-transform duration-200" />
            )}
          </button>

          {/* Timestamp */}
          <div className="flex items-baseline gap-1.5 min-w-[170px]">
            <FiClock className="w-3.5 h-3.5 text-gray-400 inline" />
            <span className="text-xs font-mono font-semibold text-gray-800">
              {formatTime(log.event_time)}
            </span>
            <span className="text-[11px] text-gray-400">
              {formatDate(log.event_time)}
            </span>
          </div>

          {/* Event Type Badge */}
          <span
            className={`px-2 py-0.5 text-xs font-semibold rounded-md border ring-1 ${getEventTypeBadge(
              log.event_type
            )}`}
          >
            {log.event_type || "UNKNOWN"}
          </span>

          {/* Page & Tab Path */}
          <div className="flex items-center gap-1.5 text-xs text-gray-600 truncate max-w-md">
            <span className="font-medium text-gray-900 truncate">
              {log.page_name || log.page_url || "-"}
            </span>
            {log.tab && (
              <>
                <span className="text-gray-300">/</span>
                <span className="text-gray-500 truncate">{log.tab}</span>
              </>
            )}
          </div>

          {/* Component / Entity Type Tag */}
          {(log.component_type || log.entity_type) && (
            <div className="hidden lg:flex items-center gap-1 text-[11px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
              <FiLayers className="w-3 h-3 text-gray-400" />
              <span>
                {[log.component_type, log.entity_type]
                  .filter(Boolean)
                  .join(" • ")}
              </span>
            </div>
          )}
        </div>

        {/* Right Section: User Info, Device & Copy ID */}
        <div className="flex items-center gap-3 self-end md:self-auto text-xs text-gray-500 shrink-0">
          {/* User Email / ID */}
          {log.user_email && (
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded text-gray-700">
              <FiUser className="w-3.5 h-3.5 text-gray-400" />
              <span className="truncate max-w-[140px] font-mono text-[11px]">
                {log.user_email}
              </span>
            </div>
          )}

          {/* Device & Browser Badge */}
          <div className="hidden sm:flex items-center gap-1.5 text-gray-500 bg-gray-50 border border-gray-200 px-2 py-0.5 rounded text-[11px]">
            <FiMonitor className="w-3 h-3 text-gray-400" />
            <span>
              {log.browser || "Browser"} • {log.operating_system || "OS"}
            </span>
          </div>

          {/* Copy Event ID Button */}
          <button
            type="button"
            title="Copy Event ID"
            onClick={handleCopy(log.event_id, `eid-${log.event_id}`, "Event ID")}
            className="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
          >
            {copiedKey === `eid-${log.event_id}` ? (
              <FiCheck className="w-4 h-4 text-emerald-600" />
            ) : (
              <FiCopy className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Accordion Expanded Detail Pane */}
      {isExpanded && (
        <div className="border-t border-gray-100 bg-slate-50/70 p-4 transition-all">
          {/* Subheader & Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-3 border-b border-gray-200 gap-2">
            {/* Quick Metadata Bar */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600">
              <div className="flex items-center gap-1 font-mono bg-white px-2 py-1 rounded border border-gray-200">
                <span className="text-gray-400">ID:</span>
                <span className="font-semibold text-gray-800">{log.event_id}</span>
                <button
                  type="button"
                  onClick={handleCopy(log.event_id, `sub-eid-${log.event_id}`, "Event ID")}
                  className="ml-1 text-gray-400 hover:text-gray-700"
                >
                  {copiedKey === `sub-eid-${log.event_id}` ? (
                    <FiCheck className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <FiCopy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              {log.session_id && (
                <div className="flex items-center gap-1 font-mono bg-white px-2 py-1 rounded border border-gray-200">
                  <span className="text-gray-400">Session:</span>
                  <span className="truncate max-w-[120px] text-gray-700">
                    {log.session_id}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopy(log.session_id, `sid-${log.session_id}`, "Session ID")}
                    className="ml-1 text-gray-400 hover:text-gray-700"
                  >
                    {copiedKey === `sid-${log.session_id}` ? (
                      <FiCheck className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <FiCopy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              )}

              {latency && (
                <span className="bg-sky-50 text-sky-700 border border-sky-200 px-2 py-0.5 rounded text-[11px] font-mono">
                  Latency: {latency}s
                </span>
              )}

              {log.event_version && (
                <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-[11px] font-mono">
                  v{log.event_version}
                </span>
              )}
            </div>

            {/* View Switcher: Structured vs Raw JSON */}
            <div className="flex items-center gap-1 bg-gray-200/80 p-0.5 rounded-lg self-start sm:self-auto text-xs">
              <button
                type="button"
                onClick={() => setActiveTab("structured")}
                className={`px-3 py-1 rounded-md font-medium transition-colors flex items-center gap-1.5 ${
                  activeTab === "structured"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <FiInfo className="w-3.5 h-3.5" />
                Structured View
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("json")}
                className={`px-3 py-1 rounded-md font-medium transition-colors flex items-center gap-1.5 ${
                  activeTab === "json"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <FiCode className="w-3.5 h-3.5" />
                Raw JSON
              </button>
            </div>
          </div>

          {/* TAB 1: Structured View */}
          {activeTab === "structured" ? (
            <div className="space-y-4">
              {/* 3 Grid Sections */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* 1. Event & Target */}
                <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-xs">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2 flex items-center gap-1">
                    <FiLayers className="w-3.5 h-3.5 text-blue-500" />
                    Target & Action
                  </h4>
                  <dl className="space-y-1.5 text-xs">
                    <div className="flex justify-between py-0.5 border-b border-gray-50">
                      <dt className="text-gray-500">Component:</dt>
                      <dd className="font-medium text-gray-800">
                        {log.component_type || "-"}
                      </dd>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-gray-50">
                      <dt className="text-gray-500">Entity Type:</dt>
                      <dd className="font-medium text-gray-800">
                        {log.entity_type || "-"}
                      </dd>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-gray-50">
                      <dt className="text-gray-500">Action Type:</dt>
                      <dd className="font-medium text-gray-800">
                        {log.action_type || "-"}
                      </dd>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-gray-50">
                      <dt className="text-gray-500">Object ID:</dt>
                      <dd className="font-mono text-gray-800">
                        {log.object_id || "-"}
                      </dd>
                    </div>
                    <div className="flex justify-between py-0.5">
                      <dt className="text-gray-500">Duration:</dt>
                      <dd className="font-mono text-gray-800">
                        {log.duration_ms ? `${log.duration_ms} ms` : "0 ms"}
                      </dd>
                    </div>
                  </dl>
                </div>

                {/* 2. Navigation & Page Context */}
                <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-xs">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2 flex items-center gap-1">
                    <FiInfo className="w-3.5 h-3.5 text-emerald-500" />
                    Navigation Context
                  </h4>
                  <dl className="space-y-1.5 text-xs">
                    <div className="flex justify-between py-0.5 border-b border-gray-50">
                      <dt className="text-gray-500">Page Name:</dt>
                      <dd className="font-medium text-gray-800 truncate max-w-[180px]">
                        {log.page_name || "-"}
                      </dd>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-gray-50">
                      <dt className="text-gray-500">Page URL:</dt>
                      <dd className="font-mono text-blue-600 truncate max-w-[180px]">
                        {log.page_url || "-"}
                      </dd>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-gray-50">
                      <dt className="text-gray-500">Tab:</dt>
                      <dd className="text-gray-800 truncate max-w-[180px]">
                        {log.tab || "-"}
                      </dd>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-gray-50">
                      <dt className="text-gray-500">Widget:</dt>
                      <dd className="text-gray-800 truncate max-w-[180px]">
                        {log.widget_name || log.widget_id || "-"}
                      </dd>
                    </div>
                    <div className="flex justify-between py-0.5">
                      <dt className="text-gray-500">Module:</dt>
                      <dd className="text-gray-800">{log.module || "-"}</dd>
                    </div>
                  </dl>
                </div>

                {/* 3. Client & User Details */}
                <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-xs">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2 flex items-center gap-1">
                    <FiUser className="w-3.5 h-3.5 text-purple-500" />
                    Client & Session
                  </h4>
                  <dl className="space-y-1.5 text-xs">
                    <div className="flex justify-between py-0.5 border-b border-gray-50">
                      <dt className="text-gray-500">Client:</dt>
                      <dd className="font-medium text-gray-800">
                        {log.client_name} ({log.client_id})
                      </dd>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-gray-50">
                      <dt className="text-gray-500">DSM Client ID:</dt>
                      <dd className="font-mono text-gray-800">{log.dsm_client_id}</dd>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-gray-50">
                      <dt className="text-gray-500">User ID:</dt>
                      <dd className="font-mono text-gray-800">{log.user_id}</dd>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-gray-50">
                      <dt className="text-gray-500">Service:</dt>
                      <dd className="font-semibold text-blue-600">{log.service}</dd>
                    </div>
                    <div className="flex justify-between py-0.5">
                      <dt className="text-gray-500">Environment:</dt>
                      <dd className="uppercase font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded text-[10px]">
                        {log.environment}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>

              {/* Metadata & User Agent Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Metadata Card */}
                <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                      Metadata
                    </span>
                    {log.metadata && (
                      <button
                        type="button"
                        onClick={handleCopy(
                          log.metadata,
                          `meta-${log.event_id}`,
                          "Metadata"
                        )}
                        className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                      >
                        {copiedKey === `meta-${log.event_id}` ? (
                          <FiCheck className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <FiCopy className="w-3.5 h-3.5" />
                        )}
                        Copy
                      </button>
                    )}
                  </div>
                  {log.metadata && Object.keys(log.metadata).length > 0 ? (
                    <pre className="bg-gray-50 text-gray-800 p-2.5 rounded font-mono text-[11px] overflow-x-auto border border-gray-100 max-h-36">
                      {JSON.stringify(log.metadata, null, 2)}
                    </pre>
                  ) : (
                    <p className="text-xs text-gray-400 italic">No metadata available</p>
                  )}
                </div>

                {/* Device & User Agent Card */}
                <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                      User Agent & System
                    </span>
                    {log.user_agent && (
                      <button
                        type="button"
                        onClick={handleCopy(
                          log.user_agent,
                          `ua-${log.event_id}`,
                          "User Agent"
                        )}
                        className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                      >
                        {copiedKey === `ua-${log.event_id}` ? (
                          <FiCheck className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <FiCopy className="w-3.5 h-3.5" />
                        )}
                        Copy
                      </button>
                    )}
                  </div>
                  <div className="space-y-1.5 text-xs">
                    <div className="text-[11px] text-gray-500 font-mono bg-gray-50 p-2 rounded border border-gray-100 break-all leading-relaxed">
                      {log.user_agent || "No user agent string"}
                    </div>
                    <div className="flex items-center gap-4 text-gray-600 pt-1 text-[11px]">
                      <span>
                        <strong className="text-gray-400">Device:</strong>{" "}
                        {log.device_type}
                      </span>
                      <span>
                        <strong className="text-gray-400">Browser:</strong>{" "}
                        {log.browser}
                      </span>
                      <span>
                        <strong className="text-gray-400">OS:</strong>{" "}
                        {log.operating_system}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* TAB 2: Raw JSON View */
            <div className="relative">
              <div className="absolute top-2 right-2 z-10">
                <button
                  type="button"
                  onClick={handleCopy(log, `raw-${log.event_id}`, "Full Log JSON")}
                  className="px-2.5 py-1 bg-gray-800 text-white rounded text-xs hover:bg-gray-700 flex items-center gap-1 shadow"
                >
                  {copiedKey === `raw-${log.event_id}` ? (
                    <FiCheck className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <FiCopy className="w-3.5 h-3.5" />
                  )}
                  Copy Full JSON
                </button>
              </div>
              <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg font-mono text-xs overflow-x-auto max-h-96 leading-relaxed">
                {JSON.stringify(log, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LogRow;

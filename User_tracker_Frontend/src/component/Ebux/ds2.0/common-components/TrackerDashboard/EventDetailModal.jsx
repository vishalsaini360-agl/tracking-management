import React, { useState } from "react";
import toast from "react-hot-toast";
import { FiX, FiCopy, FiCheck, FiInfo, FiCode } from "react-icons/fi";

const EventDetailModal = ({ event, onClose }) => {
  const [activeTab, setActiveTab] = useState("structured");
  const [isCopied, setIsCopied] = useState(false);

  if (!event) return null;

  const handleCopy = (data, label = "Event JSON") => {
    try {
      navigator.clipboard.writeText(
        typeof data === "object" ? JSON.stringify(data, null, 2) : String(data)
      );
      setIsCopied(true);
      toast.success(`${label} copied!`);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (e) {
      toast.error("Failed to copy");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/70">
          <div>
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <span>Event Details</span>
              <span className="text-xs font-mono font-medium text-gray-400">
                #{event.id}
              </span>
            </h3>
            <p className="text-xs text-gray-500 font-mono mt-0.5">
              {event.event_id || event.sessionId}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleCopy(event, "Full Event Payload")}
              className="p-1.5 text-gray-500 hover:text-gray-800 hover:bg-gray-200/70 rounded-lg transition-colors"
              title="Copy JSON"
            >
              {isCopied ? (
                <FiCheck className="w-4 h-4 text-emerald-600" />
              ) : (
                <FiCopy className="w-4 h-4" />
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-200/70 rounded-lg transition-colors"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 px-6 pt-3 border-b border-gray-100 bg-white text-xs">
          <button
            type="button"
            onClick={() => setActiveTab("structured")}
            className={`pb-2.5 px-3 font-semibold border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === "structured"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            <FiInfo className="w-3.5 h-3.5" />
            Structured View
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("raw")}
            className={`pb-2.5 px-3 font-semibold border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === "raw"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            <FiCode className="w-3.5 h-3.5" />
            Raw JSON
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {activeTab === "structured" ? (
            <div className="space-y-4 text-xs">
              {/* Key Attributes Grid */}
              <div className="grid grid-cols-2 gap-3 bg-gray-50 p-4 rounded-xl border border-gray-200/70">
                <div>
                  <span className="text-gray-400 block text-[11px]">Timestamp</span>
                  <span className="font-semibold text-gray-800 font-mono">
                    {event.timestamp}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[11px]">Product</span>
                  <span className="font-semibold text-gray-800">
                    {event.product}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[11px]">Event Type</span>
                  <span className="font-semibold text-blue-600 font-mono">
                    {event.eventType}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[11px]">Action Type</span>
                  <span className="font-semibold text-gray-800 font-mono">
                    {event.actionType}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[11px]">Module</span>
                  <span className="font-semibold text-gray-800">{event.module}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[11px]">Page URL</span>
                  <span className="font-semibold text-blue-600 font-mono">
                    {event.page}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[11px]">Object</span>
                  <span className="font-semibold text-gray-800">{event.object}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[11px]">Active Time</span>
                  <span className="font-semibold text-gray-800 font-mono">
                    {event.activeTime}
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-400 block text-[11px]">Session ID</span>
                  <span className="font-mono text-gray-700 bg-white px-2 py-0.5 rounded border border-gray-200 block truncate">
                    {event.sessionId}
                  </span>
                </div>
              </div>

              {/* Metadata */}
              {event.metadata && (
                <div>
                  <div className="text-xs font-semibold text-gray-700 mb-1.5">
                    Metadata
                  </div>
                  <pre className="bg-gray-900 text-gray-100 p-3 rounded-lg font-mono text-[11px] overflow-x-auto">
                    {JSON.stringify(event.metadata, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          ) : (
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-xl font-mono text-xs overflow-x-auto leading-relaxed">
              {JSON.stringify(event, null, 2)}
            </pre>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-gray-100 bg-gray-50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg text-xs font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventDetailModal;

import React, { useState } from "react";
import ReactECharts from "echarts-for-react";
import { MOCK_ACTIVITY_TREND } from "./mockTrackerData";

const ActivityTrendChart = () => {
  const [activeTab, setActiveTab] = useState("events"); // "events" | "activeUsers" | "activeTime"

  const getSeriesData = () => {
    if (activeTab === "activeUsers") {
      return {
        data: MOCK_ACTIVITY_TREND.activeUsers,
        max: 40,
        interval: 10,
      };
    }
    if (activeTab === "activeTime") {
      return {
        data: MOCK_ACTIVITY_TREND.activeTime,
        max: 300,
        interval: 75,
      };
    }
    return {
      data: MOCK_ACTIVITY_TREND.events,
      max: 200,
      interval: 50,
    };
  };

  const { data: currentData, max: yMax, interval: yInterval } = getSeriesData();

  const option = {
    tooltip: {
      trigger: "axis",
      backgroundColor: "rgba(15, 23, 42, 0.95)",
      borderColor: "#334155",
      borderWidth: 1,
      padding: [8, 12],
      textStyle: { color: "#ffffff", fontSize: 11 },
    },
    grid: {
      left: "2%",
      right: "3%",
      bottom: "6%",
      top: "14%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: MOCK_ACTIVITY_TREND.dates,
      axisLine: { lineStyle: { color: "#CBD5E1" } },
      axisTick: { show: false },
      axisLabel: { color: "#64748B", fontSize: 10, margin: 10 },
    },
    yAxis: {
      type: "value",
      min: 0,
      max: yMax,
      interval: yInterval,
      splitLine: {
        lineStyle: {
          color: "#F1F5F9",
          type: "solid",
        },
      },
      axisLabel: { color: "#64748B", fontSize: 10 },
    },
    series: [
      {
        name: "PIM",
        type: "line",
        smooth: true,
        data: currentData.pim,
        itemStyle: { color: "#2563EB" },
        lineStyle: { width: 2.2, color: "#2563EB" },
        showSymbol: true,
        symbol: "circle",
        symbolSize: 5,
      },
      {
        name: "DS",
        type: "line",
        smooth: true,
        data: currentData.ds,
        itemStyle: { color: "#10B981" },
        lineStyle: { width: 2.2, color: "#10B981" },
        showSymbol: true,
        symbol: "circle",
        symbolSize: 5,
      },
      {
        name: "BM",
        type: "line",
        smooth: true,
        data: currentData.bm,
        itemStyle: { color: "#F97316" },
        lineStyle: { width: 2.2, color: "#F97316" },
        showSymbol: true,
        symbol: "circle",
        symbolSize: 5,
      },
    ],
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200/80 p-5 shadow-xs flex flex-col justify-between h-full">
      {/* Chart Header + Filter Tabs + Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 gap-3">
        <h3 className="text-sm font-bold text-gray-900 tracking-tight">
          Activity Trend
        </h3>

        <div className="flex items-center gap-4 flex-wrap">
          {/* Legend */}
          <div className="flex items-center gap-3 text-xs text-gray-600">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              <span className="text-[11px] font-medium">PIM</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="text-[11px] font-medium">DS</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-orange-500"></span>
              <span className="text-[11px] font-medium">BM</span>
            </span>
          </div>

          {/* Metric Selector Buttons */}
          <div className="flex items-center border border-gray-200 rounded-lg p-0.5 bg-gray-50/80 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab("events")}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                activeTab === "events"
                  ? "bg-white text-blue-600 shadow-2xs border border-gray-200/70"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              Events
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("activeUsers")}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                activeTab === "activeUsers"
                  ? "bg-white text-blue-600 shadow-2xs border border-gray-200/70"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              Active Users
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("activeTime")}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                activeTab === "activeTime"
                  ? "bg-white text-blue-600 shadow-2xs border border-gray-200/70"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              Active Time
            </button>
          </div>
        </div>
      </div>

      {/* ECharts Container */}
      <div className="w-full h-56 pt-2">
        <ReactECharts
          option={option}
          style={{ height: "100%", width: "100%" }}
          opts={{ renderer: "svg" }}
        />
      </div>
    </div>
  );
};

export default ActivityTrendChart;

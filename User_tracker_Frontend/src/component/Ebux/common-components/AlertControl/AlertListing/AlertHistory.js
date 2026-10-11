import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  //faArrowLeft,
  faChevronLeft,
  // faEllipsisVertical,
  faMagnifyingGlass,
  faFilter,
  faSort,
} from "@fortawesome/free-solid-svg-icons";
import { fetchPreviewData } from "../services/service";
import Excel from "exceljs";
import { calenderIcon } from "../../../../common-components/main-layout/HeaderDatePicker/utils/icons";
import { DateRangeProvider, useDateRangeContext } from "../../../../common-components/main-layout/HeaderDatePicker/context/dateRangeProvider";
import DateRangePicker from "../../../../common-components/main-layout/HeaderDatePicker/dateRangePicker";
import { ENTITY_TYPE, EVENTS, trackCustomEvent, TRACKING_COMPONENT } from "../../../../../tracker";

const FilterButtonWithDate = ({ onDateChange }) => {
  const { displayDateRangePicker, setDisplayDateRangePicker } = useDateRangeContext();
  return (
    <div className="relative">
      <button
        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 bg-white shadow-sm"
        onClick={() => setDisplayDateRangePicker(!displayDateRangePicker)}
      >
        <FontAwesomeIcon icon={faFilter} className="w-4 h-4 text-gray-500" />
        <span className="text-sm font-medium text-gray-700">Filter</span>
      </button>

      {displayDateRangePicker && (
        <div className="absolute top-[100%] right-0 z-50 mt-2 min-w-[600px]">
          <DateRangePicker
            allowedMaxDate={new Date()}
            onChange={(ranges) => {
              onDateChange(ranges);
            }}
            defaultComparisonMode={false}
            hideCompareAndSave={true}

          />
        </div>
      )}
    </div>
  );
};
export default function AlertHistory({ setFullHistory, historyData, alertData, formattedAlertData, trackerContext = {} }) {
  // console.log("historyData", historyData);
  const [downloading, setDownloading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState(null);
  const [sortOrder, setSortOrder] = useState("desc");
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return "No Date Recorded";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid Date";
    return date.toLocaleString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });
  };

  const handleDownload = async (createdAt) => {
    if (!alertData) return;
    trackCustomEvent(
      EVENTS.DOWNLOAD,
      { type: "alert_history_csv", alert_id: alertData.id, alert_name: alertData.name, createdAt },
      ENTITY_TYPE.ALERT,
      {
        ...trackerContext,
        component_type: TRACKING_COMPONENT.BUTTON,
      }
    );
    setDownloading(true);
    try {
      const activeClientProject = JSON.parse(localStorage.getItem("active_client_project") || "{}");
      const payload = {
        kpi: alertData.kpi,
        entity: alertData.entity,
        items: alertData.selected_filters,
        conditions: alertData.or_conditions,
        metricType: alertData.metric_type,
        time_range: alertData.time_range,
        type: "download_excel",
        createdAt: createdAt,
        client_project_es_id: activeClientProject?.client_project_es_id
      };

      const response = await fetchPreviewData(payload);

      const processedData = Array.isArray(response)
        ? Array.isArray(response[0])
          ? response.flat()
          : response
        : [];

      if (processedData.length === 0) {
        alert("No data found to download.");
        return;
      }

      const workbook = new Excel.Workbook();
      const worksheet = workbook.addWorksheet("Alert Preview Data");

      // Get all unique keys from data to build headers
      const rawKeys = [...new Set(processedData.flatMap(item => Object.keys(item)))];

      // Filter out internal or unwanted keys
      const excludedKeys = new Set(['id', '_id', 'date', 'month_year', 'market', 'quarter_year']);
      const filteredKeys = rawKeys.filter(key => !excludedKeys.has(key));

      // Define header mappings for known keys
      const headerMap = {
        Products: (() => {
          const entity = alertData.entity || "Products";
          if (entity === "Products") return "Product Name";
          if (entity === "Brands") return "Brand Name";
          if (entity === "Keywords") return "Keyword Name";
          if (entity === "Categories") return "Category Name";
          if (entity === "Platforms") return "Platform Name";
          if (entity === "Locations") return "Location Name";
          if (entity === "keywordCategory") return "Keyword Category";
          return "Name";
        })(),
        osa: "OSA",
        price_sp: "Selling Price",
        price_rp: "MRP",
        rating_value: "Ratings",
        review_count: "Reviews",
        sos: "SOS",
        paid_sos: "Paid SOS",
        organic_sos: "Organic SOS",
        or: "OR",
        paid_or: "Paid OR",
        organic_or: "Organic OR",
        oos_total: "Stock Days (Total)",
        oos_consecutive: "Stock Days (Consecutive)",
        total_score: "Content Score",
        title_score: "Title Score",
        desc_score: "Description Score",
        bulletin_score: "Bulletin Score",
        image_score: "Image Score",
        video_score: "Video Score",
        highlight_score: "Highlight Score",
        a_plus_score: "A+ Score",
        promotion: "Promotion",
        promo_val: "Promotion",
        brand: "Brand",
        client_name: "Client",
        platform: "Platform",
        location: "Location",
      };

      const formatHeader = (key) => {
        if (headerMap[key]) return headerMap[key];
        return key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
      };

      const headers = filteredKeys.map(formatHeader);

      worksheet.addRow(headers);

      processedData.forEach(item => {
        const row = filteredKeys.map(key => {
          let value = item[key];

          // Special handling for Products if entity is Products (splitting "::")
          if (key === 'Products' && (!alertData.entity || alertData.entity === "Products") && typeof value === 'string' && value.includes("::")) {
            value = value.split("::")[1];
          }

          if (typeof value === 'object' && value !== null) {
            return JSON.stringify(value);
          }
          return value ?? "-";
        });
        worksheet.addRow(row);
      });

      // Style headers
      worksheet.getRow(1).font = { bold: true };
      worksheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE9EEF5' }
      };

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `alert_data_${alertData.name.replace(/\s+/g, '_')}_${Date.now()}.xlsx`;
      link.click();
    } catch (error) {
      console.error("Error downloading CSV:", error);
      alert("Failed to download CSV.");
    } finally {
      setDownloading(true);
      setTimeout(() => setDownloading(false), 500);
    }
  };

  return (
    <div className="w-full">
      {/* Modal Container */}
      <div className="bg-white w-full rounded-lg shadow-xl relative">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 ">
          <div
            className="flex gap-2 cursor-pointer"
            onClick={() => {
              trackCustomEvent(
                EVENTS.BUTTON_CLICK,
                { action: "back_to_alerts" },
                ENTITY_TYPE.ALERT,
                {
                  ...trackerContext,
                  component_type: TRACKING_COMPONENT.BUTTON,
                }
              );
              setFullHistory(false);
            }}
          >
            <FontAwesomeIcon icon={faChevronLeft} />{" "}
            <p className="text-[14px] font-medium text-[#000000D9]">Back</p>
          </div>

          {/* <FontAwesomeIcon
            icon={faXmark}
            className="text-gray-500 cursor-pointer text-lg"
            onClick={() => setCloseHistory(false)}
          /> */}
        </div>

        {/* Alert Details Section */}
        {formattedAlertData && (
          <div className="px-6 py-2 flex flex-col gap-3 bg-white">
            <div className="flex justify-between items-start">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-semibold text-[#000000D9]">{formattedAlertData.name}</h2>
                  <div className="flex items-center bg-[#FFFFFF] border border-[#F2F2F2] rounded-[8px] shadow-[0_2px_10px_0_rgba(0,0,0,0.08)] p-[3px] gap-1">
                    <div className={`px-3 py-1 text-xs font-medium rounded-md ${formattedAlertData.status === "Active" ? "bg-[#EBFFEB] text-[#24B224]" : "text-[#000000]"}`}>Active</div>
                    <div className={`px-3 py-1 text-xs font-medium rounded-md ${formattedAlertData.status === "Inactive" ? "bg-[#F7F7F7] text-red-500" : "text-[#000000]"}`}>Inactive</div>
                  </div>
                </div>
                <p className="text-sm text-[#000000A6] mt-1">{formattedAlertData.description}</p>
              </div>
              {/* <div>
                <FontAwesomeIcon icon={faEllipsisVertical} className="text-gray-500 cursor-pointer text-lg" />
              </div> */}
            </div>

            <div className="grid grid-cols-4 gap-6 mt-1">
              <div className="text-start">
                <div className="text-xs text-[#000000A6] font-medium mb-1">Entity Type</div>
                <div className="text-sm font-medium text-[#000000D9]">{formattedAlertData.entityType}</div>
              </div>
              <div className="text-start">
                <div className="text-xs text-[#000000A6] font-medium mb-1">Scope</div>
                <div className="text-sm font-medium text-[#000000D9]">{formattedAlertData.scope}</div>
              </div>
              <div className="text-start">
                <div className="text-xs text-[#000000A6] font-medium mb-1">Conditions Match</div>
                <div className="text-sm font-medium text-[#000000D9]">{formattedAlertData.trigger}</div>
              </div>
              <div className="text-start">
                <div className="text-xs text-[#000000A6] font-medium mb-1">Next Run</div>
                <div className="text-sm font-medium text-[#000000D9]">{formattedAlertData.nextRun}</div>
              </div>
            </div>

            <div className="text-sm text-gray-500 flex gap-2 flex-wrap items-center">
              <span className="text-xs text-[#000000A6] font-medium">Condition:</span>
              {formattedAlertData.condition?.replace(/[()]/g, "").split(/\s+OR\s+/).map((cond, index) => (
                <span key={index} className="px-3 py-1 bg-[#FFF9E5] text-[#DFB022] rounded-full font-medium text-xs">
                  {cond.trim()}
                </span>
              ))}
            </div>
            <div className="flex items-center justify-between mt-[-10px]">
              <div className="flex items-center gap-1 font-medium text-sm text-[#000000A6]">
                {/* <img
                                              src="/assets/images/alert-images/alertclock.svg"
                                              className="w-[14px] h-[14px]"
                                            /> */}
                {calenderIcon}
                Date Range : {formattedAlertData.timeRange && (
                  <span className="px-2 bg-[#E8F0FE] text-[#1A73E8] rounded font-medium text-xs">
                    {formattedAlertData?.timeRange?.toString() === "1001" ? "Month To Date" : formattedAlertData?.timeRange?.toString() == "180" ? "Maximum" : formattedAlertData.timeRange === "1" ? "yesterday" : `last ${formattedAlertData.timeRange} days`}
                  </span>
                )}
              </div>
            </div>

            <div className="flex justify-between items-center mt-2">
              <div className="relative w-[300px]">
                <FontAwesomeIcon icon={faMagnifyingGlass} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onBlur={(e) => {
                    if (e.target.value?.trim()) {
                      trackCustomEvent(
                        EVENTS.SEARCH,
                        { search_term: e.target.value, alert_id: alertData?.id },
                        ENTITY_TYPE.ALERT,
                        {
                          ...trackerContext,
                          component_type: TRACKING_COMPONENT.INPUT,
                        }
                      );
                    }
                  }}
                  className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
              <div className="flex gap-3">
                <DateRangeProvider>
                  <FilterButtonWithDate onDateChange={(ranges) => {
                    trackCustomEvent(
                      EVENTS.DATE_CHANGE,
                      { date_range: ranges },
                      ENTITY_TYPE.ALERT,
                      {
                        ...trackerContext,
                        component_type: TRACKING_COMPONENT.DATE_PICKER,
                      }
                    );
                    setDateRange(ranges);
                  }} />
                </DateRangeProvider>
                <div className="relative">
                  <button
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 bg-white shadow-sm"
                    onClick={() => {
                      trackCustomEvent(
                        !showSortDropdown ? EVENTS.POP_OVER_OPEN : EVENTS.POP_OVER_CLOSE,
                        { type: "sort_history" },
                        ENTITY_TYPE.ALERT,
                        {
                          ...trackerContext,
                          component_type: TRACKING_COMPONENT.BUTTON,
                        }
                      );
                      setShowSortDropdown(!showSortDropdown);
                    }}
                  >
                    <FontAwesomeIcon icon={faSort} className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">Sort</span>
                  </button>
                  {showSortDropdown && (
                    <div className="absolute top-[100%] right-0 mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
                      <div
                        className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-50 ${sortOrder === 'desc' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'}`}
                        onClick={() => {
                          trackCustomEvent(
                            EVENTS.SORT,
                            { order: "desc", label: "Newest to Oldest" },
                            ENTITY_TYPE.ALERT,
                            {
                              ...trackerContext,
                              component_type: TRACKING_COMPONENT.DROPDOWN,
                            }
                          );
                          setSortOrder('desc');
                          setShowSortDropdown(false);
                        }}
                      >
                        Newest to Oldest
                      </div>
                      <div
                        className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-50 ${sortOrder === 'asc' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'}`}
                        onClick={() => {
                          trackCustomEvent(
                            EVENTS.SORT,
                            { order: "asc", label: "Oldest to Newest" },
                            ENTITY_TYPE.ALERT,
                            {
                              ...trackerContext,
                              component_type: TRACKING_COMPONENT.DROPDOWN,
                            }
                          );
                          setSortOrder('asc');
                          setShowSortDropdown(false);
                        }}
                      >
                        Oldest to Newest
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Body */}
        <div className="px-8 py-8 relative">
          {(() => {
            const filteredHistory = (historyData || []).filter(item => {
              let matchSearch = true;
              if (searchTerm) {
                const term = searchTerm.toLowerCase();
                const dateStr = formatDate(item.createdAt).toLowerCase();
                const statusStr = (item.status || (item.items_triggered > 0 ? "Success" : "No Results")).toLowerCase();
                const messageStr = (item.message || (item.items_triggered > 0 ? `Alert triggering for ${item.items_triggered} items meeting conditions` : "No items met the alert conditions during this schedule run")).toLowerCase();
                matchSearch = dateStr.includes(term) || statusStr.includes(term) || messageStr.includes(term);
              }

              let matchDate = true;
              if (dateRange && dateRange.currentPeriod) {
                const itemDate = new Date(item.createdAt);
                const start = new Date(dateRange.currentPeriod.startDate);
                start.setHours(0, 0, 0, 0);
                const end = new Date(dateRange.currentPeriod.endDate);
                end.setHours(23, 59, 59, 999);
                if (itemDate < start || itemDate > end) {
                  matchDate = false;
                }
              }

              return matchSearch && matchDate;
            });

            const sortedHistory = [...filteredHistory].sort((a, b) => {
              const dateA = new Date(a.createdAt).getTime();
              const dateB = new Date(b.createdAt).getTime();
              return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
            });

            return sortedHistory.length > 0 ? (
              sortedHistory.map((item, index) => (
                <div key={item.id || index} className="relative flex gap-6">
                  <div className="flex flex-col items-center">
                    {/* Top Line */}
                    {index !== 0 && (
                      <div className="w-[1px] h-6 bg-[#329900]"></div>
                    )}


                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center z-10 shrink-0 
  ${item.status === "Error" ? "bg-red-100" : "bg-green-100"}`}
                    >
                      <FontAwesomeIcon
                        icon={faCheck}
                        className={`text-sm ${item.status === "Error" ? "text-red-600" : "text-green-600"
                          }`}
                      />
                    </div>

                    {/* Bottom Line */}
                    {index !== historyData.length - 1 && (
                      <div className="w-[1px] flex-1 bg-[#329900]"></div>
                    )}
                  </div>
                  {/* Card */}
                  <div
                    className={`flex-1 bg-gray-50 rounded-xl p-4 shadow-sm ${index !== historyData.length - 1 ? "mb-10" : ""
                      }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="text-start">
                        <h3 className="text-base font-medium text-[#000000D9]">
                          {formatDate(item.createdAt)}
                        </h3>
                        <p className="text-[#00000073] text-[14px] mt-1">
                          {item.items_triggered || 0} items triggered
                        </p>
                      </div>

                      <span
                        className={`text-sm px-3 py-1 rounded-md border ${item.status?.toLowerCase() === "success" || item.alert_status?.toLowerCase() === "success" || (item.items_triggered > 0)
                          ? "bg-[#F6FFED] text-[#52C41A] border-[#B7EB8F]"
                          : "bg-[#FAFAFA] text-[#000000D9] border-[#D9D9D9]"
                          }`}
                      >
                        {item.status || (item.items_triggered > 0 ? "Success" : "No Results")}
                      </span>
                    </div>

                    <p className="mt-4 text-[#000000A6] text-[16px] font-medium text-start">
                      {item.message || (item.items_triggered > 0 ? `Alert triggering for ${item.items_triggered} items meeting conditions` : "No items met the alert conditions during this schedule run")}
                    </p>

                    {item.items_triggered > 0 && (
                      <div className="mt-4 flex gap-4">
                        {/* <button className="px-2 py-[1px] h-[30px] text-[12px] rounded-md bg-[#F9F0FF] text-[#722ED1] border border-[#D3ADF7]" disabled>
                        View Report
                      </button> */}

                        {item.status === "Success" && (
                          <button
                            className={`px-2 py-1 text-[14px] rounded-md border ${downloading ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-[#000000D9] border-[#D9D9D9] hover:bg-gray-50'}`}
                            onClick={() => handleDownload(item.createdAt)}
                            disabled={downloading}
                          >
                            {downloading ? "Downloading..." : "Download CSV"}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="flex justify-center py-10 text-gray-500 font-medium">
                No alert history found.
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}

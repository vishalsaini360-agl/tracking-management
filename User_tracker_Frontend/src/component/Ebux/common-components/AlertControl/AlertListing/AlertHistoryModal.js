import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faCheck } from "@fortawesome/free-solid-svg-icons";
import { fetchPreviewData } from "../services/service";
import Excel from "exceljs";
import { ENTITY_TYPE, EVENTS, trackCustomEvent, TRACKING_COMPONENT } from "../../../../../tracker";
import { safeJsonParse } from "../../../../../utils/helpers";

export default function AlertHistoryModal({ setCloseHistory, setFullHistory, historyData, alertData, loading, trackerContext = {} }) {
  // console.log("historyData", historyData);
  const [downloading, setDownloading] = useState(false);

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
      ENTITY_TYPE.POPUP,
      {
        ...trackerContext,
        component_type: TRACKING_COMPONENT.BUTTON,
      }
    );
    setDownloading(true);
    try {
      const activeClientProject = safeJsonParse(localStorage.getItem("active_client_project"), {});
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
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">

      <div className="bg-white w-[900px] rounded-lg shadow-xl relative max-h-[90vh] flex flex-col">

        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 shrink-0">
          <h2 className="text-[20px] font-semibold text-gray-800">
            Alert History
          </h2>

          <FontAwesomeIcon
            icon={faXmark}
            className="text-gray-500 cursor-pointer text-lg"
            onClick={() => {
              trackCustomEvent(
                EVENTS.POPUP_CLOSE,
                { type: "alert_history_modal", alert_id: alertData?.id, name: alertData?.name },
                ENTITY_TYPE.POPUP,
                {
                  ...trackerContext,
                  component_type: TRACKING_COMPONENT.BUTTON,
                }
              );
              setCloseHistory();
            }}
          />
        </div>

        <div className="px-8 py-8 relative overflow-y-auto grow">
          {loading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" />
            </div>
          ) : historyData && historyData.length > 0 ? (
            historyData.slice(0, 2).map((item, index) => (
              <div key={item.id || index} className="relative flex gap-6">
                <div className="flex flex-col items-center">
                  {/* Top Line */}
                  {index !== 0 && (
                    <div className="w-[1px] h-6 bg-[#329900]"></div>
                  )}

                  {/* Icon */}
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
                  {index !== Math.min(historyData.length, 2) - 1 && (
                    <div className="w-[1px] flex-1 bg-[#329900]"></div>
                  )}
                </div>

                <div
                  className={`flex-1 bg-gray-50 rounded-xl p-4 shadow-sm ${index !== Math.min(historyData.length, 2) - 1 ? "mb-10" : ""
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
              No alert history available.
            </div>
          )}

          <div className="flex justify-end mt-6">
            {(
              historyData && historyData.length > 0 ? (
                <button
                  className="text-blue-600 text-[14px] font-medium"

                  onClick={() => {
                    trackCustomEvent(
                      EVENTS.BUTTON_CLICK,
                      { action: "view_full_history", alert_id: alertData?.id, name: alertData?.name },
                      ENTITY_TYPE.POPUP,
                      {
                        ...trackerContext,
                        component_type: TRACKING_COMPONENT.BUTTON,
                      }
                    );
                    setCloseHistory();
                    setFullHistory(true);
                  }}
                >
                  View More
                </button>
              ) : null)
            }

          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faSearch, faDownload } from "@fortawesome/free-solid-svg-icons";
import { calenderIcon } from "../../../../common-components/main-layout/HeaderDatePicker/utils/icons";
import Excel from "exceljs";
import { ENTITY_TYPE, EVENTS, trackCustomEvent, TRACKING_COMPONENT } from "../../../../../tracker";

export default function ScopeModal({ isOpen, onClose, alertData, trackerContext = {} }) {
  const [activeTab, setActiveTab] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (isOpen && alertData?.selected_filters) {
      const keys = Object.keys(alertData.selected_filters).filter(
        (key) => Array.isArray(alertData.selected_filters[key]) && alertData.selected_filters[key].length > 0
      );
      if (keys.length > 0) {
        setActiveTab(keys[0]);
      }
    }
    setSearchTerm("");
  }, [isOpen, alertData]);

  if (!isOpen || !alertData) return null;

  const filters = alertData.selected_filters || {};
  const filterKeys = Object.keys(filters).filter(
    (key) => Array.isArray(filters[key]) && filters[key].length > 0
  );

  const formatTabName = (key) => {

    let name = key.replace("selected", "");
    // Add spaces before capital letters
    name = name.replace(/([A-Z])/g, ' $1').trim();
    // console.log('keykeykeykeykey', name)
    // Special cases
    if (name.toLowerCase() === 'brand') return 'Brands';
    if (name.toLowerCase() === 'category') return 'Category';
    if (name.toLowerCase() === 'platform') return 'Platforms';
    if (name.toLowerCase() === 'product id') return 'Products';
    if (name.toLowerCase() === 'location') return 'Location';
    if (name.toLowerCase() === 'keyword') return 'Keyword';
    return name;
  };

  const getFilteredData = () => {
    if (!activeTab || !filters[activeTab]) return [];
    let data = filters[activeTab];
    if (searchTerm) {
      data = data.filter((item) => {
        const label = item.label || item.name || item.value || "";
        return String(label).toLowerCase().includes(searchTerm.toLowerCase());
      });
    }
    return data;
  };

  const activeData = getFilteredData();
  // console.log(activeData, "activeDatasssssssssssssssss");

  const handleDownload = async () => {
    if (!activeData || activeData.length === 0) return;

    trackCustomEvent(
      EVENTS.DOWNLOAD,
      { type: "scope_excel", tab: activeTab ? formatTabName(activeTab) : "", count: activeData.length },
      ENTITY_TYPE.POPUP,
      {
        ...trackerContext,
        component_type: TRACKING_COMPONENT.BUTTON,
      }
    );

    try {
      const workbook = new Excel.Workbook();
      const worksheet = workbook.addWorksheet(`${formatTabName(activeTab)} Data`);

      const idColumnHeader = activeTab ? `${formatTabName(activeTab)} ID` : 'ID';
      const nameColumnHeader = activeTab ? formatTabName(activeTab) : 'Item';

      worksheet.addRow(["S. No", idColumnHeader, nameColumnHeader]);

      activeData.forEach((item, index) => {
        const label = item.label || item.name || item.tag_name || "-";
        const value = item.value || item.id || "-";
        worksheet.addRow([index + 1, value, label]);
      });

      worksheet.getRow(1).font = { bold: true };

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${formatTabName(activeTab).toLowerCase()}_scope_${Date.now()}.xlsx`;
      link.click();
    } catch (error) {
      console.error("Error downloading excel:", error);
    }
  };

  const formatConditions = (orConditions) => {
    if (!orConditions || orConditions.length === 0) {
      return "";
    }
    const formatted = orConditions.map((andGroup) => {
      const andText = andGroup
        .map((condition) => {
          const { metric, operator, value } = condition;
          if (!metric || !operator || value === undefined) {
            return "";
          }
          return `${metric} ${operator} ${value}`;
        })
        .filter(Boolean)
        .join(" AND ");
      return andGroup.length > 1 ? `(${andText})` : andText;
    });
    return formatted.join(" OR ");
  };

  const conditionString = alertData.condition || formatConditions(alertData.or_conditions);

  const conditionParts = conditionString
    ? conditionString.replace(/[()]/g, "").split(/\s+OR\s+/)
    : [];

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white w-[900px] rounded-[16px] shadow-xl relative min-h-[80vh] max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-start px-6 py-4 shrink-0">
          <div>
            <h2 className="text-[20px] font-semibold text-[#000000D9]">
              Scope
            </h2>
            <h3 className="text-[18px] font-semibold text-[#000000D9] mt-1">
              {alertData.name}
            </h3>
            <p className="text-[#000000A6] text-[14px]">
              {alertData.description}
            </p>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <span className="text-[14px] text-[#000000A6]">Condition:</span>
              {conditionParts.length > 0 && conditionParts[0] !== "" ? (
                conditionParts.map((cond, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-[#FFF9E5] text-[#DFB022] rounded-[4px] font-medium text-xs"
                  >
                    {cond.trim()}
                  </span>
                ))
              ) : (
                <span className="px-2 py-1 bg-[#F0F0F0] text-[#000000A6] rounded-[4px] font-medium text-xs">
                  No Conditions
                </span>
              )}
            </div>
            {alertData.time_range && (
              <div className="flex items-center gap-1 font-medium text-[14px] text-[#000000A6]">
                {calenderIcon}
                Date Range :
                <span className="px-2 py-1 bg-[#E8F0FE] text-[#1A73E8] rounded-[4px] font-medium text-xs ml-1">
                  {alertData.time_range === "1" ? "yesterday" : `last ${alertData.time_range} days`}
                </span>
              </div>
            )}
          </div>
          <FontAwesomeIcon
            icon={faXmark}
            className="text-gray-500 cursor-pointer text-lg hover:text-gray-800"
            onClick={() => {
              trackCustomEvent(
                EVENTS.POPUP_CLOSE,
                { type: "scope_modal", alert_id: alertData?.id, name: alertData?.name },
                ENTITY_TYPE.POPUP,
                {
                  ...trackerContext,
                  component_type: TRACKING_COMPONENT.BUTTON,
                }
              );
              onClose();
            }}
          />
        </div>

        {/* Search */}
        <div className="px-6 py-2 shrink-0">
          <div className="relative w-[300px]">
            <FontAwesomeIcon
              icon={faSearch}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-[14px] h-[14px]"
            />
            <input
              type="text"
              placeholder={`Search ${activeTab ? formatTabName(activeTab).toLowerCase() : 'items'}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onBlur={(e) => {
                if (e.target.value?.trim()) {
                  trackCustomEvent(
                    EVENTS.SEARCH,
                    { search_term: e.target.value, tab: activeTab ? formatTabName(activeTab) : "" },
                    ENTITY_TYPE.POPUP,
                    {
                      ...trackerContext,
                      component_type: TRACKING_COMPONENT.INPUT,
                    }
                  );
                }
              }}
              // className="w-full pl-9 pr-4 py-2 border border-[#D9D9D9] rounded-[8px] text-[14px] focus:outline-none focus:border-blue-500"
              className="w-[307px] h-[30px] opacity-100 gap-4 rounded-[8px] border border-[#D9D9D9] border-[1px] pt-[6px] pr-[8px] pb-[6px] pl-[36px]"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="px-6 mt-4 shrink-0 border-b border-[#F0F0F0] flex gap-2 overflow-x-auto pb-1 custom-scrollbar">
          {filterKeys.map((key) => (
            <button
              key={key}
              onClick={() => {
                trackCustomEvent(
                  EVENTS.TAB_SWITCH,
                  { tab: formatTabName(key), count: filters[key]?.length },
                  ENTITY_TYPE.POPUP,
                  {
                    ...trackerContext,
                    component_type: TRACKING_COMPONENT.TAB,
                  }
                );
                setActiveTab(key);
              }}
              className={`px-4 py-2 rounded-t-[8px] flex items-center gap-2 whitespace-nowrap border-b-[2px] transition-colors ${activeTab === key
                ? "border-[#1890FF] text-[#1890FF] bg-[#E6F7FF]"
                : "border-transparent text-[#000000A6] hover:bg-gray-50"
                }`}
            >
              <span className="font-medium text-[14px]">{formatTabName(key)}</span>
              <span className={`px-2 py-[2px] rounded-[10px] text-[12px] font-medium ${activeTab === key ? "bg-[#1890FF] text-white" : "bg-[#F0F0F0] text-[#000000A6]"
                }`}>
                {filters[key].length}
              </span>
            </button>
          ))}
        </div>

        {/* Table Content */}
        <div className="px-6 py-4 flex-1 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-[16px] font-semibold text-[#000000D9]">Preview Results</h4>
            <button
              className="w-8 h-8 flex items-center justify-center rounded-[4px] border border-[#D9D9D9] hover:bg-gray-50"
              onClick={handleDownload}
              title="Download Data"
            >
              <FontAwesomeIcon icon={faDownload} className="text-[#000000D9] w-4 h-4" />
            </button>
          </div>

          <div className="border border-[#F0F0F0] rounded-[8px] overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#FAFAFA] border-b border-[#F0F0F0]">
                <tr>
                  <th className="px-4 py-3 text-[14px] font-medium text-[#000000D9] w-[10%]">S. No</th>
                  <th className="px-4 py-3 text-[14px] font-medium text-[#000000D9] w-[30%]">
                    {activeTab ? `${formatTabName(activeTab)} ID` : 'ID'}
                  </th>
                  <th className="px-4 py-3 text-[14px] font-medium text-[#000000D9]">
                    {activeTab ? formatTabName(activeTab) : 'Item'}
                  </th>
                </tr>
              </thead>
              <tbody>
                {activeData.length > 0 ? (
                  activeData.map((item, index) => {
                    const label = item.label || item.name || item.tag_name || "-";
                    const value = item.value || item.id || "-";
                    // Try to find image url from typical keys
                    const imgUrl = item.platform_description || item.brand_description || item.image_url || item.url || null;

                    return (
                      <tr key={index} className="border-b border-[#F0F0F0] hover:bg-[#FAFAFA] transition-colors">
                        <td className="px-4 py-3 text-[14px] text-[#000000A6]">
                          {String(index + 1).padStart(2, '0')}
                        </td>
                        <td className="px-4 py-3 text-[14px] text-[#000000A6]">
                          {value}
                        </td>
                        <td className="px-4 py-3 text-[14px] text-[#000000D9] flex items-center gap-3">
                          {imgUrl && typeof imgUrl === 'string' && imgUrl.startsWith('http') && (
                            <img src={imgUrl} alt={label} className="w-6 h-6 object-contain rounded-[4px]" />
                          )}
                          <span className="font-medium">{label}</span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="3" className="px-4 py-10 text-center text-[14px] text-[#000000A6]">
                      No results found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

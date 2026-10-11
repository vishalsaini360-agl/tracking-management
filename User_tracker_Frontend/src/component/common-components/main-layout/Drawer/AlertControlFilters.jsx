
import React, { useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { FiChevronDown, FiChevronRight } from "react-icons/fi";
import { fetchAlertList } from "../../../Ebux/common-components/AlertControl/services/service";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useEbuxContext } from "../../../Ebux/Context/EbuxProvider";
import { ENTITY_TYPE, EVENTS, getTrackerContext, trackCustomEvent, TRACKING_COMPONENT } from "../../../../tracker";

function AlertControlFilters({ onApply, handleCancel, alertFilters ,defaultAlertFilters}) {
  const { kpi } = useEbuxContext() || {};
  const [searchTerm, setSearchTerm] = useState("");

const [isInitialLoad, setIsInitialLoad] = useState(true); // Track initial load
  
const [selectedConditionCategory, setSelectedConditionCategory] = useState("");

const [alertFiltersState, setAlertFiltersState] = useState(
  alertFilters || defaultAlertFilters
);


  const [openSections, setOpenSections] = useState({
    status: true,
    entityType: true,
    conditions: true,
    lastTriggered: true,
    createdBy: true,
    scheduling: true,
    dateFilter: true
  });

  const productConditions = [
    "Out-of-Stock Days",
    "On-Shelf Availability Percentage",
    "Promotion Percentage",
    "Selling Price",
    "Maximum Retail Price",
    "Product Rating"
  ];

  const keywordConditions = [
    "Overall Share of Search",
    "Paid Share of Search",
    "Organic Share of Search",
    "Overall Ranking",
    "Paid Ranking",
    "Organic Ranking"
  ];

  const [createdByOptions, setCreatedByOptions] = useState([]);
const selectedEntity = alertFiltersState.entityType;
const isProductDisabled = selectedEntity === "Keywords";
const isKeywordDisabled = selectedEntity === "Products";


  const [dateErrors, setDateErrors] = useState({
    created: "",
    updated: "",
    triggered: ""
  });

  const hasDateError = Object.values(dateErrors).some(error => error !== "");



const handleEntityChange = (value) => {
  setAlertFiltersState(prev => ({
    ...prev,
    entityType: value,
    conditions: [],
    conditionCategory: ""
  }));
};

  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = String(d.getFullYear()).slice(-2);
    return `${day}/${month}/${year}`;
  };

  const validateDateRange = (from, to) => {
    if ((from && !to) || (!from && to)) {
      return "Both From and To dates are required";
    }

    if (from && to && new Date(from) > new Date(to)) {
      return "From date cannot be greater than To date";
    }

    return "";
  };

  useEffect(() => {
    const loadCreatedBy = async () => {
      const res = await fetchAlertList("", "", {}, 1);
      const alerts = res?.data?.alerts || [];
      const uniqueUsers = [...new Set(alerts.map(a => a.created_by))]
            .filter(user => user && user.trim() !== "");
      setCreatedByOptions(uniqueUsers);
    };

    loadCreatedBy();
  }, []);


  // useEffect(() => {
  //   if (alertFilters) {
  //     setAlertFiltersState(alertFilters);
  //     // Set the condition category based on existing filters
  //     if (alertFilters.conditionCategory) {
  //       setSelectedConditionCategory(alertFilters.conditionCategory);
  //     }
  //   }
  // }, [alertFilters]);

 useEffect(() => {
    if (alertFilters) {
      setAlertFiltersState(alertFilters);
      
      // Set the condition category based on existing filters
      if (alertFilters.conditionCategory) {
        setSelectedConditionCategory(alertFilters.conditionCategory);
      } else if (alertFilters.conditions && alertFilters.conditions.length > 0) {
        // Infer category from existing conditions
        const hasProductConditions = alertFilters.conditions.some(c => 
          productConditions.includes(c)
        );
        const hasKeywordConditions = alertFilters.conditions.some(c => 
          keywordConditions.includes(c)
        );
        
        if (hasProductConditions) {
          setSelectedConditionCategory("Product");
        } else if (hasKeywordConditions) {
          setSelectedConditionCategory("Keywords");
        }
      }
      
      setIsInitialLoad(false); // Mark initial load complete
    }
  }, [alertFilters]);


   // Auto-select all conditions when Product or Keywords entity is selected
//   useEffect(() => {
//   const entity = alertFiltersState.entityType || [];

//   if (entity.includes("Products")) {
//     setSelectedConditionCategory("Product");

//     setAlertFiltersState(prev => ({
//       ...prev,
//       conditionCategory: "Product",
//       conditions: [...productConditions]
//     }));
//   }

//   else if (entity.includes("Keywords")) {
//     setSelectedConditionCategory("Keywords");

//     setAlertFiltersState(prev => ({
//       ...prev,
//       conditionCategory: "Keywords",
//       conditions: [...keywordConditions]
//     }));
//   }

// }, [alertFiltersState.entityType]);


  useEffect(() => {
  if (isInitialLoad) return;

  const entity = alertFiltersState.entityType;

  if (alertFiltersState.conditions?.length > 0) return;

  if (entity === "Products") {
    setSelectedConditionCategory("Product");

    setAlertFiltersState(prev => ({
      ...prev,
      conditionCategory: "Product",
      conditions: [...productConditions] 
    }));
  }

  else if (entity === "Keywords") {
    setSelectedConditionCategory("Keywords");

    setAlertFiltersState(prev => ({
      ...prev,
      conditionCategory: "Keywords",
      conditions: [...keywordConditions] 
    }));
  }

  else {
    setSelectedConditionCategory("");
    setAlertFiltersState(prev => ({
      ...prev,
      conditionCategory: "",
      conditions: []
    }));
  }

}, [alertFiltersState.entityType]);

  const filterOptions = (options) => {
    if (!searchTerm) return options;

    return options.filter((item) => {
      if (!item) return false;
      return String(item)
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    });
  };

  // Auto-expand sections with search results
  useEffect(() => {
    if (searchTerm) {
      setOpenSections({
        status: true,
        entityType: true,
        conditions: true,
        lastTriggered: true,
        createdBy: true,
        scheduling: true,
        dateFilter: true
      });
    }
  }, [searchTerm]);

  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleCheckbox = (section, value, subKey = null) => {
    trackCustomEvent(
      EVENTS.CHECKBOX,
      {
        section: subKey ? `${section}_${subKey}` : section,
        value: value,
        label: value
      },
      ENTITY_TYPE.FILTER,
      getTrackerContext(kpi || "AlertControl", null, { component_type: TRACKING_COMPONENT.DRAWER })
    );

    setAlertFiltersState(prev => {
      if (subKey) {
        const current = prev[section][subKey] || [];
        const exists = current.includes(value);

        return {
          ...prev,
          [section]: {
            ...prev[section],
            [subKey]: exists
              ? current.filter(v => v !== value)
              : [...current, value]
          }
        };
      }

      const current = prev[section] || [];
      const exists = current.includes(value);

      return {
        ...prev,
        [section]: exists
          ? current.filter(v => v !== value)
          : [...current, value]
      };
    });
  };

  // Handle condition category radio selection
  const handleConditionCategoryChange = (category) => {
    setSelectedConditionCategory(category);
    
    // Clear existing conditions when changing category
    setAlertFiltersState(prev => ({
      ...prev,
      conditionCategory: category,
      conditions: []
    }));
  };

  // Handle individual condition checkbox
  const handleConditionCheckbox = (condition) => {
    setAlertFiltersState(prev => {
      const current = prev.conditions || [];
      const exists = current.includes(condition);

      return {
        ...prev,
        conditions: exists
          ? current.filter(c => c !== condition)
          : [...current, condition]
      };
    });
  };

  const handleDateChange = (key, value) => {
    setAlertFiltersState(prev => {
      const updated = {
        ...prev,
        dateFilter: {
          ...prev.dateFilter,
          [key]: value
        }
      };

      const createdError = validateDateRange(
        updated.dateFilter.createdFrom,
        updated.dateFilter.createdTo
      );

      const updatedError = validateDateRange(
        updated.dateFilter.updatedFrom,
        updated.dateFilter.updatedTo
      );

      const triggeredError = validateDateRange(
        updated.dateFilter.triggeredFrom,
        updated.dateFilter.triggeredTo
      );

      setDateErrors({
        created: createdError,
        updated: updatedError,
        triggered: triggeredError
      });

      return updated;
    });
  };

  const appliedCount = (() => {

  let count = 0;

  Object.entries(alertFiltersState || {}).forEach(([key, value]) => {

    if (Array.isArray(value)) {
      count += value.length;
    }

    else if (key === "entityType") {
      if (value) count += 1;
    }

    else if (key === "dateFilter" && value) {

      if (value.createdFrom || value.createdTo) count += 1;

      if (value.updatedFrom || value.updatedTo) count += 1;

      if (value.triggeredFrom || value.triggeredTo) count += 1;

    }

    else if (typeof value === "object" && value !== null) {

      Object.values(value).forEach(v => {
        if (Array.isArray(v)) count += v.length;
      });

    }

  });

  return count;

})();
  const NoResults = () => (
    <div className="px-8 p-4 text-sm text-gray-500">No results found</div>
  );

  const statusOptions = ["Active", "Inactive"];
  const entityTypeOptions = ["Products", "Keywords", "Brand", "Categories", "Platforms", "Locations"];
  const lastTriggeredOptions = ["Today", "Yesterday", "Last 7 days", "Last 30 days", "Never"];
  const nextRunOptions = ["Today", "Tomorrow", "This Week"];
  const frequencyOptions = ["Hourly", "Daily","Weekly"];

  
  return (
    <div className="w-[400px] h-screen bg-white shadow-lg flex flex-col">
      {/* HEADER */}
      <div className="flex-shrink-0">
        <div className="p-4 flex items-center justify-between border-b border-gray-200">
          <div className="flex gap-2 items-center">
            <RxCross2 size={20} className="cursor-pointer" onClick={handleCancel} />
            <p className="font-semibold text-gray-900 text-lg">All Filters</p>
          </div>

          <div className="text-blue-500 font-medium">
            Applied ({appliedCount})
          </div>
        </div>

        {/* SEARCH */}
         <div className="relative p-4">
          <FontAwesomeIcon
             icon={faMagnifyingGlass}
            className="absolute left-8 top-1/2 -translate-y-1/2 text-gray-400 text-sm"
          />

           <input
             type="text"
             placeholder="Search"
            value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
             onBlur={(e) => {
               if (e.target.value?.trim()) {
                 trackCustomEvent(
                   EVENTS.SEARCH,
                   {
                     section: "alert_filters",
                     search_term: e.target.value
                   },
                   ENTITY_TYPE.FILTER,
                   getTrackerContext(kpi || "AlertControl", null, { component_type: TRACKING_COMPONENT.DRAWER })
                 );
               }
             }}
             className="w-full pl-10 pr-10 py-2 border border-[#E5E7EB] rounded-[20px] shadow-sm focus:outline-none"
           />

           {searchTerm && (
             <RxCross2
               size={18}
               className="absolute right-7 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
               onClick={() => {
                 trackCustomEvent(
                   EVENTS.CLEAR,
                   {
                     section: "alert_filters",
                     action: "clear_search"
                   },
                   ENTITY_TYPE.FILTER,
                   getTrackerContext(kpi || "AlertControl", null, { component_type: TRACKING_COMPONENT.DRAWER })
                 );
                 setSearchTerm("");
               }}
             />
           )}
         </div>
       </div>

      {/* BODY */}
      <div className="flex-1 overflow-y-auto px-8 space-y-6">
        {/* STATUS */}
        <div>
          <div
            className="flex justify-between text-sm cursor-pointer text-[#000000D9] font-semibold mb-2"
            onClick={() => toggleSection("status")}
          >
            Status
            {openSections.status ? <FiChevronDown /> : <FiChevronRight />}
          </div>

          {openSections.status && (
            <>
              {filterOptions(statusOptions).length > 0 ? (
                filterOptions(statusOptions).map(item => (
                  <label key={item} className="flex gap-2 text-sm text-[#000000D9] font-normal">
                    <input
                      type="checkbox"
                      checked={alertFiltersState.status.includes(item)}
                      onChange={() => handleCheckbox("status", item)}
                    />
                    {item}
                  </label>
                ))
              ) : (
                <NoResults />
              )}
            </>
          )}
        </div>

        {/* ENTITY TYPE */}
        <div>
          <div
            className="flex justify-between text-sm cursor-pointer text-[#000000D9] font-semibold mb-2"
            onClick={() => toggleSection("entityType")}
          >
            Entity Type
            {openSections.entityType ? <FiChevronDown /> : <FiChevronRight />}
          </div>

          {openSections.entityType && (
            <>
              {filterOptions(entityTypeOptions).length > 0 ? (
                filterOptions(entityTypeOptions).map(item => (
                  <label key={item} className="flex gap-2 text-sm text-[#000000D9] font-normal">
                 
                    <input
  type="radio"
  name="entityType"
  checked={alertFiltersState.entityType === item}
  onChange={() => handleEntityChange(item)}
/>
                    {item}
                  </label>
                ))
              ) : (
                <NoResults />
              )}
            </>
          )}
        </div>

  <div>

  <div
    className="flex justify-between text-sm cursor-pointer text-[#000000D9] font-semibold mb-2"
    onClick={() => toggleSection("conditions")}
  >
    Conditions
    {openSections.conditions ? <FiChevronDown /> : <FiChevronRight />}
  </div>

  {openSections.conditions && (
    <>
      
      {/* PRODUCT CONDITIONS */}
      <div className="mb-3">

        <label className={`flex gap-2 text-sm font-medium ${isProductDisabled ? "opacity-50" : ""}`}>
          <input
            type="radio"
            name="conditionCategory"
            checked={selectedConditionCategory === "Product"}
            disabled={isProductDisabled}
            onChange={() => handleConditionCategoryChange("Product")}
          />
          Product
        </label>

        {selectedConditionCategory === "Product" && (
          <div className="ml-6 space-y-1">
            {productConditions.map(item => (
              <label key={item} className="flex gap-2 text-sm">
                <input
                  type="checkbox"
                  disabled={isProductDisabled}
                  checked={alertFiltersState.conditions.includes(item)}
                  onChange={() => handleConditionCheckbox(item)}
                />
                {item}
              </label>
            ))}
          </div>
        )}

      </div>


      {/* KEYWORD CONDITIONS */}
      <div>

        <label className={`flex gap-2 text-sm font-medium ${isKeywordDisabled ? "opacity-50" : ""}`}>
          <input
            type="radio"
            name="conditionCategory"
            checked={selectedConditionCategory === "Keywords"}
            disabled={isKeywordDisabled}
            onChange={() => handleConditionCategoryChange("Keywords")}
          />
          Keywords
        </label>

        {selectedConditionCategory === "Keywords" && (
          <div className="ml-6 space-y-1">
            {keywordConditions.map(item => (
              <label key={item} className="flex gap-2 text-sm">
                <input
                  type="checkbox"
                  disabled={isKeywordDisabled}
                  checked={alertFiltersState.conditions.includes(item)}
                  onChange={() => handleConditionCheckbox(item)}
                />
                {item}
              </label>
            ))}
          </div>
        )}

      </div>

    </>
  )}

</div>

        {/* LAST TRIGGERED */}
        <div>
          <div
            className="flex justify-between text-sm cursor-pointer text-[#000000D9] font-semibold mb-2"
            onClick={() => toggleSection("lastTriggered")}
          >
            Last Triggered
            {openSections.lastTriggered ? <FiChevronDown /> : <FiChevronRight />}
          </div>

          {openSections.lastTriggered && (
            <>
              {filterOptions(lastTriggeredOptions).length > 0 ? (
                filterOptions(lastTriggeredOptions).map(item => (
                  <label key={item} className="flex gap-2 text-sm text-[#000000D9] font-normal">
                    <input
                      type="checkbox"
                      checked={alertFiltersState.lastTriggered.includes(item)}
                      onChange={() => handleCheckbox("lastTriggered", item)}
                    />
                    {item}
                  </label>
                ))
              ) : (
                <NoResults />
              )}
            </>
          )}
        </div>

        {/* CREATED BY */}
        <div>
          <div
            className="flex justify-between text-sm cursor-pointer text-[#000000D9] font-semibold mb-2"
            onClick={() => toggleSection("createdBy")}
          >
            Created By
            {openSections.createdBy ? <FiChevronDown /> : <FiChevronRight />}
          </div>

          {openSections.createdBy && (
            <>
              {filterOptions(createdByOptions).length > 0 ? (
                filterOptions(createdByOptions).map(item => (
                  <label key={item} className="flex gap-2 text-sm text-[#000000D9] font-normal">
                    <input
                      type="checkbox"
                      checked={alertFiltersState.createdBy.includes(item)}
                      onChange={() => handleCheckbox("createdBy", item)}
                    />
                    {item}
                  </label>
                ))
              ) : (
                <NoResults />
              )}
            </>
          )}
        </div>

        {/* SCHEDULING */}
        <div>
          <div
            className="flex justify-between text-sm cursor-pointer text-[#000000D9] font-semibold mb-2"
            onClick={() => toggleSection("scheduling")}
          >
            Scheduling
            {openSections.scheduling ? <FiChevronDown /> : <FiChevronRight />}
          </div>

          {openSections.scheduling && (
            <>
              <p className="text-sm mt-2 mb-1 font-medium">Next Run</p>
              {filterOptions(nextRunOptions).length > 0 ? (
                filterOptions(nextRunOptions).map(item => (
                  <label key={item} className="flex gap-2 text-sm text-[#000000D9] font-normal">
                    <input
                      type="checkbox"
                      checked={(alertFiltersState.scheduling?.nextRun || []).includes(item)}
                      onChange={() => handleCheckbox("scheduling", item, "nextRun")}
                    />
                    {item}
                  </label>
                ))
              ) : (
                <NoResults />
              )}

              <p className="text-sm mt-2 mb-1 font-medium">Frequency</p>
              {filterOptions(frequencyOptions).length > 0 ? (
                filterOptions(frequencyOptions).map(item => (
                  <label key={item} className="flex gap-2 text-sm text-[#000000D9] font-normal">
                    <input
                      type="checkbox"
                      checked={(alertFiltersState.scheduling?.frequency || []).includes(item)}
                      onChange={() => handleCheckbox("scheduling", item, "frequency")}
                    />
                    {item}
                  </label>
                ))
              ) : (
                <NoResults />
              )}
            </>
          )}
        </div>

        {/* DATE FILTER */}
        {!searchTerm && (
          <div>
            <div
              className="flex justify-between text-sm cursor-pointer text-[#000000D9] font-semibold mb-2"
              onClick={() => toggleSection("dateFilter")}
            >
              Date Filter
              {openSections.dateFilter ? <FiChevronDown /> : <FiChevronRight />}
            </div>

            {openSections.dateFilter && (
              <>
                <p className="flex gap-2 text-sm text-[#000000D9] font-normal mt-2 mb-1">Created Date</p>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <input
                      type="date"
                      value={alertFiltersState.dateFilter.createdFrom}
                      onChange={(e) => handleDateChange("createdFrom", e.target.value)}
                      className="absolute opacity-0 pointer-events-none"
                      id="createdFrom"
                    />
                    <input
                      type="text"
                      readOnly
                      value={formatDate(alertFiltersState.dateFilter.createdFrom)}
                      placeholder="DD/MM/YY"
                      onClick={() => document.getElementById("createdFrom").showPicker()}
                      className="rounded-lg px-3 py-2 text-sm w-[100px] border border-[#D9D9D9] text-[#000000] cursor-pointer"
                    />
                  </div>

                  <span className="text-sm">To</span>

                  <div className="relative">
                    <input
                      type="date"
                      value={alertFiltersState.dateFilter.createdTo}
                      onChange={(e) => handleDateChange("createdTo", e.target.value)}
                      className="absolute opacity-0 pointer-events-none"
                      id="createdTo"
                    />
                    <input
                      type="text"
                      readOnly
                      value={formatDate(alertFiltersState.dateFilter.createdTo)}
                      placeholder="DD/MM/YY"
                      onClick={() => document.getElementById("createdTo").showPicker()}
                      className="rounded-lg px-3 py-2 text-sm w-[100px] border border-[#D9D9D9] text-[#000000] cursor-pointer"
                    />
                  </div>
                </div>
                {dateErrors.created && (
                  <p className="text-red-500 text-xs mt-1">{dateErrors.created}</p>
                )}

                <p className="flex gap-2 text-sm text-[#000000D9] font-normal mt-2 mb-1">Updated Date</p>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <input
                      type="date"
                      value={alertFiltersState.dateFilter.updatedFrom}
                      onChange={(e) => handleDateChange("updatedFrom", e.target.value)}
                      className="absolute opacity-0 pointer-events-none"
                      id="updatedFrom"
                    />
                    <input
                      type="text"
                      readOnly
                      value={formatDate(alertFiltersState.dateFilter.updatedFrom)}
                      placeholder="DD/MM/YY"
                      onClick={() => document.getElementById("updatedFrom").showPicker()}
                      className="rounded-lg px-3 py-2 text-sm w-[100px] border border-[#D9D9D9] text-[#000000] cursor-pointer"
                    />
                  </div>

                  <span className="text-sm">To</span>

                  <div className="relative">
                    <input
                      type="date"
                      value={alertFiltersState.dateFilter.updatedTo}
                      onChange={(e) => handleDateChange("updatedTo", e.target.value)}
                      className="absolute opacity-0 pointer-events-none"
                      id="updatedTo"
                    />
                    <input
                      type="text"
                      readOnly
                      value={formatDate(alertFiltersState.dateFilter.updatedTo)}
                      placeholder="DD/MM/YY"
                      onClick={() => document.getElementById("updatedTo").showPicker()}
                      className="rounded-lg px-3 py-2 text-sm w-[100px] border border-[#D9D9D9] text-[#000000] cursor-pointer"
                    />
                  </div>
                </div>
                {dateErrors.updated && (
                  <p className="text-red-500 text-xs mt-1">{dateErrors.updated}</p>
                )}

                <p className="flex gap-2 text-sm text-[#000000D9] font-normal mt-2 mb-1">Triggered Date</p>
                <div className="flex items-center gap-2 mb-1">
                  <div className="relative">
                    <input
                      type="date"
                      value={alertFiltersState.dateFilter.triggeredFrom}
                      onChange={(e) => handleDateChange("triggeredFrom", e.target.value)}
                      className="absolute opacity-0 pointer-events-none"
                      id="triggeredFrom"
                    />
                    <input
                      type="text"
                      readOnly
                      value={formatDate(alertFiltersState.dateFilter.triggeredFrom)}
                      placeholder="DD/MM/YY"
                      onClick={() => document.getElementById("triggeredFrom").showPicker()}
                      className="rounded-lg px-3 py-2 text-sm w-[100px] border border-[#D9D9D9] text-[#000000] cursor-pointer"
                    />
                  </div>

                  <span className="text-sm">To</span>

                  <div className="relative">
                    <input
                      type="date"
                      value={alertFiltersState.dateFilter.triggeredTo}
                      onChange={(e) => handleDateChange("triggeredTo", e.target.value)}
                      className="absolute opacity-0 pointer-events-none"
                      id="triggeredTo"
                    />
                    <input
                      type="text"
                      readOnly
                      value={formatDate(alertFiltersState.dateFilter.triggeredTo)}
                      placeholder="DD/MM/YY"
                      onClick={() => document.getElementById("triggeredTo").showPicker()}
                      className="rounded-lg px-3 py-2 text-sm w-[100px] border border-[#D9D9D9] text-[#000000] cursor-pointer"
                    />
                  </div>
                </div>
                {dateErrors.triggered && (
                  <p className="text-red-500 text-xs my-2">{dateErrors.triggered}</p>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* FOOTER */}
      <div className="p-4 border-t flex justify-end gap-3">
        <button
          className="px-4 py-2 bg-gray-100 border rounded"
          onClick={() => {
            trackCustomEvent(
              EVENTS.CLEAR_ALL,
              { section: "alert_filters" },
              ENTITY_TYPE.FILTER,
              getTrackerContext(kpi || "AlertControl", null, { component_type: TRACKING_COMPONENT.DRAWER })
            );
            handleCancel();
          }}
        >
          Clear
        </button>

        <button
          className={`px-4 py-2 rounded-lg text-white ${
            hasDateError ? "bg-gray-300 cursor-not-allowed" : "bg-blue-600"
          }`}
          onClick={() => {
            trackCustomEvent(
              EVENTS.APPLY,
              {
                section: "alert_filters",
                applied_count: appliedCount
              },
              ENTITY_TYPE.FILTER,
              getTrackerContext(kpi || "AlertControl", null, { component_type: TRACKING_COMPONENT.DRAWER })
            );
            onApply(alertFiltersState);
          }}
          disabled={hasDateError}
        >
          Apply
        </button>
      </div>
    </div>
  );
}

export default AlertControlFilters;


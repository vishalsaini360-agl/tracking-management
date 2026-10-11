import React, { useEffect, useMemo, useState } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";

import { ENTITY_TYPE, EVENTS, getTrackerContext, trackCustomEvent, TRACKING_COMPONENT } from "../../../../tracker";
import { useEbuxContext } from "../../../Ebux/Context/EbuxProvider";
import { escapeRegExp } from "./DrawerHelper";

function SponsFlagFilterComponent({
  expanded,
  handleToggle,
  handleSelectAll,
  handleCheck,
  searchTerm,
}) {
  const {
    kpi,
    filters,
    selectedFiltersWidget,
    setSelectedFiltersWidget,
    // updateSelectedSOSType
  } = useEbuxContext();

  const [search, setSearch] = useState("");
  const [appliedCount, setAppliedCount] = useState(0);

  // UI can have multiple selected values
  // Context still stores a single string:
  // "", "paid", "organic", or "overall"
  const [localSelected, setLocalSelected] = useState([]);
  // Convert context value back to UI selections
  useEffect(() => {
    const selectedValue =
      selectedFiltersWidget?.selected_sos_type || "";

    if (selectedValue === "overall") {
      setLocalSelected(["paid", "organic"]);
    } else if (selectedValue) {
      setLocalSelected([selectedValue]);
    } else {
      setLocalSelected([]);
    }
  }, [selectedFiltersWidget?.selected_sos_type]);

  // Handle checkbox selection
  const handleUpdate = (option) => {
    setLocalSelected((prev) => {
      if (prev.includes(option.value)) {
        return prev.filter(
          (value) => value !== option.value
        );
      }

      return [...prev, option.value];
    });
  };

  // Clear all
  const handleClearAll = () => {
    trackCustomEvent(
      EVENTS.CLEAR_ALL,
      { section: "spons_flag" },
      ENTITY_TYPE.FILTER,
      getTrackerContext(kpi, null, { component_type: TRACKING_COMPONENT.DRAWER })
    );
    setLocalSelected([]);
    setAppliedCount(0);

    if (typeof handleSelectAll === "function") {
      handleSelectAll("spons_flag", []);
    }

    if (typeof handleCheck === "function") {
      handleCheck(
        "selected_sos_type",
        "paid",
        false,
        "Paid",
        true
      );

      handleCheck(
        "selected_sos_type",
        "organic",
        false,
        "Organic",
        true
      );
    }

    setSelectedFiltersWidget((prevFilters) => ({
      ...prevFilters,
      selected_sos_type: "overall",
    }));
  };

  // Apply selection
  const handleApplyClick = () => {
    let selectedValue = "";

    if (localSelected.length === 2) {
      // Both selected
      selectedValue = "overall";
    } else if (localSelected.length === 1) {
      // Only one selected
      selectedValue = localSelected[0];
    }
    setAppliedCount(localSelected.length); 

    trackCustomEvent(
      EVENTS.APPLY,
      { section: "spons_flag", selected_count: localSelected.length, selected: localSelected },
      ENTITY_TYPE.FILTER,
      getTrackerContext(kpi, null, { component_type: TRACKING_COMPONENT.DRAWER })
    );

    const previousValue =
      selectedFiltersWidget?.selected_sos_type || "";

    if (selectedValue === previousValue) {
      return;
    }

    // Context stores only one string
    setSelectedFiltersWidget((prevFilters) => ({
      ...prevFilters,
      selected_sos_type: selectedValue,
    }));
    // updateSelectedSOSType(selectedValue);
    if (typeof handleCheck === "function") {
      const allOptions = Array.isArray(
        filters?.spons_flag
      )
        ? filters.spons_flag
        : [];

      allOptions.forEach((option) => {
        const isSelected = localSelected.includes(
          option.value
        );

        handleCheck(
          "selected_sos_type",
          option.value,
          !isSelected,
          option.label,
          true
        );
      });
    }
  };

  // Search options
  const sortedOptions = useMemo(() => {
    const list = Array.isArray(filters?.spons_flag)
      ? filters.spons_flag
      : [];

    const searchInput = (
      search ||
      searchTerm ||
      ""
    ).trim();

    if (!searchInput) {
      return list;
    }

    const terms = searchInput
      .split(";")
      .map((term) => term.trim())
      .filter(Boolean);

    if (terms.length === 0) {
      return list;
    }

    const regexes = terms.map(
      (term) =>
        new RegExp(
          escapeRegExp(term),
          "i"
        )
    );

    return list.filter((item) =>
      regexes.some((regex) =>
        regex.test(
          String(
            item.label ?? item.value ?? ""
          )
        )
      )
    );
  }, [
    filters?.spons_flag,
    search,
    searchTerm,
  ]);

  const showNoResults =
    sortedOptions.length === 0 &&
    (search?.trim() || searchTerm?.trim());

  const allVisibleSelected =
    sortedOptions.length > 0 &&
    sortedOptions.every((option) => localSelected.includes(option.value));

  const someVisibleSelected = sortedOptions.some((option) =>
    localSelected.includes(option.value),
  );

  const selectAllLabel = allVisibleSelected ? "Clear All" : "Select All";

  return (
    <div className="flex flex-col px-8 p-4 space-y-8">
      <div className="border-b border-gray-100 pb-6 last:border-0">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <h3 className="flex font-semibold text-gray-900 text-base">
            SOS Type
            {/* {localSelected.length > 0 && (
              <span className="ml-1 flex items-center justify-center w-5 h-5 text-[10px] rounded-full bg-[#F0F0F0]">
                {localSelected.length}
              </span>
            )} */}
            {appliedCount > 0 && (
              <span className="ml-1 flex items-center justify-center w-5 h-5 text-[10px] rounded-full bg-[#F0F0F0]">
                {appliedCount}
              </span>
            )}
          </h3>

          {sortedOptions.length > 3 && (
            <button
              type="button"
              className="text-gray-500 hover:text-gray-700"
              onClick={() => handleToggle("spons_flag")}
            >
              {expanded["spons_flag"] ? (
                <IoIosArrowUp size={20} />
              ) : (
                <IoIosArrowDown size={20} />
              )}
            </button>
          )}
        </div>

        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search spons flag..."
            className="w-[70%] px-[9px] py-[2px] pr-[24px] mb-[6px] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onBlur={(e) => {
              if (e.target.value?.trim()) {
                trackCustomEvent(
                  EVENTS.SEARCH,
                  { section: "spons_flag", search_term: e.target.value },
                  ENTITY_TYPE.FILTER,
                  getTrackerContext(kpi, null, { component_type: TRACKING_COMPONENT.DRAWER })
                );
              }
            }}
          />

          {search && (
            <RxCross2
              size={18}
              className="absolute right-[6.4rem] top-[45%] -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer z-10"
              onClick={() => {
                trackCustomEvent(
                  EVENTS.CLEAR,
                  { section: "spons_flag", action: "clear_search" },
                  ENTITY_TYPE.FILTER,
                  getTrackerContext(kpi, null, { component_type: TRACKING_COMPONENT.DRAWER })
                );
                setSearch("");
              }}
            />
          )}
        </div>

        {/* Options */}
        {sortedOptions.length > 0 && (
          <div
            className={`space-y-2 transition-all duration-300 ${
              expanded["spons_flag"]
                ? "max-h-60 overflow-y-auto pr-2"
                : "max-h-[102px] overflow-hidden"
            }`}
          >
            {/* Select All */}
            <label className="flex items-center font-bold gap-2 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 text-blue-600 rounded"
                checked={allVisibleSelected}
                ref={(input) => {
                  if (input) {
                    input.indeterminate =
                      !allVisibleSelected && someVisibleSelected;
                  }
                }}
                onChange={() => {
                  trackCustomEvent(
                    allVisibleSelected ? EVENTS.UNSELECT_ALL : EVENTS.SELECT_ALL,
                    { section: "spons_flag", action: allVisibleSelected ? "unselect_all" : "select_all", count: sortedOptions?.length },
                    ENTITY_TYPE.FILTER,
                    getTrackerContext(kpi, null, { component_type: TRACKING_COMPONENT.CHECKBOX })
                  );
                  if (allVisibleSelected) {
                    setLocalSelected([]);
                  } else {
                    setLocalSelected(
                      sortedOptions.map((option) => option.value),
                    );
                  }
                }}
              />

              {selectAllLabel}
            </label>
            {sortedOptions.map((option, index) => {
              const isSelected = localSelected.includes(option.value);

              return (
                <div key={option.value || index} className="ml-0">
                  <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 rounded"
                      value={option.value}
                      checked={isSelected}
                      onChange={() => {
                        handleUpdate(option);
                        handleCheck("spons_flag", option.value, isSelected, option.label);
                      }}
                    />

                    {option.label}
                  </label>
                </div>
              );
            })}
          </div>
        )}

        {/* No Results */}
        {showNoResults && (
          <div className="px-8 p-4 text-sm text-gray-500">
            No spons flag found...
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-between relative top-[8px]">
          <button
            type="button"
            className="text-blue-500 text-sm font-medium mt-3 flex items-center"
            onClick={() => handleToggle("spons_flag")}
          >
            {expanded["spons_flag"] ? "View Less" : "View More"}

            <span className="ml-1">
              {expanded["spons_flag"] ? (
                <IoIosArrowUp size={16} />
              ) : (
                <IoIosArrowDown size={16} />
              )}
            </span>
          </button>

          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              className="px-2 py-1 text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
              onClick={handleClearAll}
            >
              Clear All
            </button>

            <button
              type="button"
              className="px-2 py-1 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={handleApplyClick}
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SponsFlagFilterComponent;

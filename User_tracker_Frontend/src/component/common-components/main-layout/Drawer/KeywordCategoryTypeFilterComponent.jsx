import React, { useEffect, useMemo, useState } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import { isEqual } from "lodash";
import { ENTITY_TYPE, EVENTS, getTrackerContext, trackCustomEvent, TRACKING_COMPONENT } from "../../../../tracker";

import { useEbuxContext } from "../../../Ebux/Context/EbuxProvider";
import { escapeRegExp } from "./DrawerHelper";

function KeywordCategoryTypeFilterComponent({
  expanded,
  handleToggle,
  handleSelectAll,
  handleCheck,
  searchTerm,
}) {
  const { kpi, filters, selectedFiltersWidget, setSelectedFiltersWidget } =
    useEbuxContext();


  const [search, setSearch] = useState("");

  const [localSelected, setLocalSelected] = useState(
    selectedFiltersWidget?.selected_keyword_type
      ? [...selectedFiltersWidget.selected_keyword_type]
      : [],
  );

  useEffect(() => {
    setLocalSelected(
      selectedFiltersWidget?.selected_keyword_type
        ? [...selectedFiltersWidget.selected_keyword_type]
        : [],
    );
  }, [selectedFiltersWidget?.selected_keyword_type]);

  const handleUpdate = (option, isChecked) => {
    let newItems;

    if (isChecked) {
      newItems = (localSelected || []).filter(
        (item) => item.value !== option.value,
      );
    } else {
      newItems = [...(localSelected || []), option];
    }

    setLocalSelected(newItems);
  };

  const handleSelectAllUpdate = (options, allSelected) => {
    trackCustomEvent(
      allSelected ? EVENTS.UNSELECT_ALL : EVENTS.SELECT_ALL,
      { section: "keyword_category_type", action: allSelected ? "unselect_all" : "select_all", count: options?.length },
      ENTITY_TYPE.FILTER,
      getTrackerContext(kpi, null, { component_type: TRACKING_COMPONENT.CHECKBOX })
    );
    let newItems = [];

    if (allSelected) {
      newItems = (localSelected || []).filter(
        (item) => !options.some((option) => option.value === item.value),
      );
    } else {
      newItems = [
        ...(localSelected || []),
        ...options.filter(
          (option) =>
            !(localSelected || []).some(
              (selected) => selected.value === option.value,
            ),
        ),
      ];
    }

    setLocalSelected(newItems);
  };

  const handleClearAll = () => {
    trackCustomEvent(
      EVENTS.CLEAR_ALL,
      { section: "keyword_category_type" },
      ENTITY_TYPE.FILTER,
      getTrackerContext(kpi, null, { component_type: TRACKING_COMPONENT.DRAWER })
    );
    setLocalSelected([]);

    if (typeof handleSelectAll === "function") {
      handleSelectAll("keyword_category_type", []);
    }
    setSelectedFiltersWidget((prevFilters) => ({
      ...prevFilters,
      selected_keyword_type: [],
    }));
  };

  const handleApplyClick = () => {
    const current = localSelected || [];
    trackCustomEvent(
      EVENTS.APPLY,
      { section: "keyword_category_type", selected_count: current.length, selected: current.map((c) => c.label || c.value) },
      ENTITY_TYPE.FILTER,
      getTrackerContext(kpi, null, { component_type: TRACKING_COMPONENT.DRAWER })
    );

    if (
      isEqual(
        JSON.stringify(selectedFiltersWidget?.selected_keyword_type),
        JSON.stringify(current),
      )
    ) {
      return;
    }

    setSelectedFiltersWidget((prevFilters) => ({
      ...prevFilters,
      selected_keyword_type: [...current],
    }));

    if (typeof handleCheck === "function") {
      const allOptions = Array.isArray(filters?.keyword_category_type)
        ? filters.keyword_category_type
        : [];

      allOptions.forEach((option) => {
        const isChecked = current.some(
          (selected) => selected.value === option.value,
        );

        handleCheck("keyword_category_type", option.value, !isChecked, option.label, true);
      });
    }
  };
  const sortedOptions = useMemo(() => {
    const list = Array.isArray(filters?.keyword_category_type)
      ? filters.keyword_category_type
      : [];

    const searchInput = (search || searchTerm || "").trim();

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

    const regexes = terms.map((term) => new RegExp(escapeRegExp(term), "i"));

    const filteredList = list.filter((item) =>
      regexes.some((regex) => regex.test(item.label || "")),
    );

    const selectedValues = (localSelected || []).map((item) => item.value);

    return [...filteredList].sort((a, b) => {
      const aSelected = selectedValues.includes(a.value);
      const bSelected = selectedValues.includes(b.value);

      if (aSelected === bSelected) {
        return 0;
      }

      return aSelected ? -1 : 1;
    });
  }, [filters?.keyword_category_type, search, searchTerm, localSelected]);

  const allVisibleSelected =
    sortedOptions.length > 0 &&
    sortedOptions.every((option) =>
      (localSelected || []).some((selected) => selected.value === option.value),
    );

  const someVisibleSelected = sortedOptions.some((option) =>
    (localSelected || []).some((selected) => selected.value === option.value),
  );

  const selectAllLabel = allVisibleSelected ? "Clear All" : "Select All";

  const showNoResults =
    sortedOptions.length === 0 && (search?.trim() || searchTerm?.trim());

  return (
    <div className="flex flex-col px-8 p-4 space-y-8">
      <div className="border-b border-gray-100 pb-6 last:border-0">
        <div className="flex items-center justify-between mb-2">
          <h3 className="flex font-semibold text-gray-900 text-base">
            Keyword Type
            {selectedFiltersWidget?.selected_keyword_type?.length > 0 && (
              <span className="ml-1 flex items-center justify-center w-5 h-5 text-[10px] rounded-full bg-[#F0F0F0]">
                {selectedFiltersWidget.selected_keyword_type.length}
              </span>
            )}
          </h3>

          {sortedOptions?.length > 3 && (
            <button
              type="button"
              className="text-gray-500 hover:text-gray-700"
              onClick={() => handleToggle("keyword_category_type")}
            >
              {expanded["keyword_category_type"] ? (
                <IoIosArrowUp size={20} />
              ) : (
                <IoIosArrowDown size={20} />
              )}
            </button>
          )}
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Search keyword category type..."
            className="w-[70%] px-[9px] py-[2px] pr-[24px] mb-[6px] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onBlur={(e) => {
              if (e.target.value?.trim()) {
                trackCustomEvent(
                  EVENTS.SEARCH,
                  { section: "keyword_category_type", search_term: e.target.value },
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
                  { section: "keyword_category_type", action: "clear_search" },
                  ENTITY_TYPE.FILTER,
                  getTrackerContext(kpi, null, { component_type: TRACKING_COMPONENT.DRAWER })
                );
                setSearch("");
              }}
            />
          )}
        </div>

        {sortedOptions?.length > 0 && (
          <div className="space-y-2">
            <div
              className={`space-y-2 transition-all duration-300 ${
                expanded["keyword_category_type"]
                  ? "max-h-60 overflow-y-auto pr-2"
                  : "max-h-[102px] overflow-hidden"
              }`}
            >
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
                  onChange={() =>
                    handleSelectAllUpdate(sortedOptions, allVisibleSelected)
                  }
                />

                {selectAllLabel}
              </label>

              {sortedOptions.map((option, index) => {
                const isChecked = (localSelected || []).some(
                  (selected) => selected.value === option.value,
                );

                return (
                  <div key={index} className="ml-0">
                    <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-blue-600 rounded"
                        checked={isChecked}
                        onChange={() => {
                          handleUpdate(option, isChecked);
                          handleCheck("keyword_category_type", option.value, isChecked, option.label);
                        }}
                      />

                      {option.label}
                    </label>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {showNoResults && (
          <div className="px-8 p-4 text-sm text-gray-500">
            No keyword category type found...
          </div>
        )}

        <div className="flex justify-between relative top-[8px]">
          <button
            type="button"
            className="text-blue-500 text-sm font-medium mt-3 flex items-center"
            onClick={() => handleToggle("keyword_category_type")}
          >
            {expanded["keyword_category_type"] ? "View Less" : "View More"}

            <span className="ml-1">
              {expanded["keyword_category_type"] ? (
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

export default KeywordCategoryTypeFilterComponent;

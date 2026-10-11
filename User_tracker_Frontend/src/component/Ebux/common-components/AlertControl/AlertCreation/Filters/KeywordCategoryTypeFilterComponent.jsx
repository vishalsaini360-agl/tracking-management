import React, { useState, useEffect, useMemo, useRef } from "react";
import { useEbuxContext } from "../../../../Context/EbuxProvider";
import { useAlertContext } from "../../Context/AlertProvider";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { trackFilterCheck, trackFilterSelectAll } from "./filterTracker";

const escapeRegExp = (string) => {
  return string ? string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") : "";
};

const KeywordCategoryTypeFilterComponent = ({
  expanded,
  onToggle,
  globalSearch = "",
}) => {
  const {
    selectedFiltersWidget,
    updateSelectedFilters,
  } = useEbuxContext();

  const { filters } = useAlertContext();

  const [categoryTypeSearch] = useState("");
  const [localSelectedCategories, setLocalSelectedCategories] = useState([]);
  const scrollRef = useRef(null);

  const widgetKey = "selected_keyword_type";

  // Sync with context
  useEffect(() => {
    setLocalSelectedCategories(
      selectedFiltersWidget?.[widgetKey]
        ? [...selectedFiltersWidget[widgetKey]]
        : []
    );
  }, [selectedFiltersWidget?.[widgetKey]]);

  // Filter + Sort
  const sortedCategories = useMemo(() => {
    const list = Array.isArray(filters?.keyword_category_type)
      ? filters.keyword_category_type
      : [];

    const searchInput = (
      categoryTypeSearch ||
      globalSearch ||
      ""
    ).trim();

    if (!searchInput) return list;

    const terms = searchInput
      .split(";")
      .map((t) => t.trim())
      .filter(Boolean);

    if (terms.length === 0) return list;

    const regexes = terms.map(
      (t) => new RegExp(escapeRegExp(t), "i")
    );

    const filteredList = list.filter((item) =>
      regexes.some((regex) =>
        regex.test(item.label || item.name || "")
      )
    );

    const selectedValues = localSelectedCategories.map((item) =>
      String(item.value)
    );

    return [...filteredList].sort((a, b) => {
      const aSelected = selectedValues.includes(String(a.value));
      const bSelected = selectedValues.includes(String(b.value));

      if (aSelected === bSelected) return 0;

      return aSelected ? -1 : 1;
    });
  }, [
    filters?.keyword_category_type,
    globalSearch,
    categoryTypeSearch,
    localSelectedCategories,
  ]);

  // Scroll Reset
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [sortedCategories, expanded]);

  // Single select
  const handleUpdate = (option, isChecked) => {
    trackFilterCheck("Keyword Category Type", option, isChecked);
    let newCategories;

    if (isChecked) {
      newCategories = localSelectedCategories.filter(
        (item) =>
          String(item.value) !== String(option.value)
      );
    } else {
      newCategories = [
        ...localSelectedCategories,
        option,
      ];
    }

    setLocalSelectedCategories(newCategories);

    updateSelectedFilters(
      widgetKey,
      newCategories
    );
  };

  // Select All
  const handleSelectAllUpdate = (options, allSelected) => {
    trackFilterSelectAll("Keyword Category Type", allSelected, options?.length);
    let newItems = [];

    if (allSelected) {
      newItems = localSelectedCategories.filter(
        (item) =>
          !options.some(
            (option) =>
              String(option.value) ===
              String(item.value)
          )
      );
    } else {
      const toAdd = options.filter(
        (option) =>
          !localSelectedCategories.some(
            (selected) =>
              String(selected.value) ===
              String(option.value)
          )
      );

      newItems = [
        ...localSelectedCategories,
        ...toAdd,
      ];
    }

    setLocalSelectedCategories(newItems);

    updateSelectedFilters(
      widgetKey,
      newItems
    );
  };

  // Select states
  const allVisibleSelected =
    sortedCategories.length > 0 &&
    sortedCategories.every((option) =>
      localSelectedCategories.some(
        (selected) =>
          String(selected.value) ===
          String(option.value)
      )
    );

  const someVisibleSelected =
    !allVisibleSelected &&
    sortedCategories.some((option) =>
      localSelectedCategories.some(
        (selected) =>
          String(selected.value) ===
          String(option.value)
      )
    );

  const showNoResults =
    sortedCategories.length === 0 &&
    (categoryTypeSearch?.trim() ||
      globalSearch?.trim());

  return (
    <div className="pb-4 mb-4 border-b border-gray-100 last:border-0 last:pb-0 last:mb-0">

      <div
        className="flex items-center justify-between cursor-pointer group"
        onClick={() => onToggle("selected_keyword_type")}
      >
        <div className="flex items-center gap-4">
          <h3 className="font-semibold text-[#000000D9] text-base">
            Keyword Type
          </h3>

          {selectedFiltersWidget?.[widgetKey]?.length > 0 && (
            <span className="flex items-center justify-center w-5 h-5 text-[10px] rounded-full bg-[#F0F0F0]">
              {selectedFiltersWidget[widgetKey].length}
            </span>
          )}
        </div>

        <div className="text-gray-400 group-hover:text-gray-600 transition-colors">
          {expanded ? (
            <IoIosArrowUp size={16} />
          ) : (
            <IoIosArrowDown size={16} />
          )}
        </div>
      </div>

      <div
        className={`transition-all duration-300 ${
          expanded
            ? "max-h-[500px] mt-4 opacity-100"
            : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        {sortedCategories.length > 0 ? (
          <>
            {/* Select All */}
            <label className="flex items-center gap-3 group cursor-pointer mb-3">
              <div className="relative flex items-center justify-center">
                <input
                  type="checkbox"
                  checked={allVisibleSelected}
                  ref={(el) =>
                    el &&
                    (el.indeterminate = someVisibleSelected)
                  }
                  onChange={() =>
                    handleSelectAllUpdate(
                      sortedCategories,
                      allVisibleSelected
                    )
                  }
                  className="peer appearance-none w-4 h-4 border border-gray-300 rounded focus:ring-0 checked:bg-blue-600 checked:border-blue-600 transition-all cursor-pointer"
                />

                <svg
                  className="absolute w-2.5 h-2.5 text-white hidden peer-checked:block pointer-events-none"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>

              <span className="text-sm text-gray-700 font-medium">
                Select All
              </span>
            </label>

            {/* List */}
            <div
              ref={scrollRef}
              className="max-h-[300px] overflow-y-auto pr-1 custom-scrollbar space-y-1"
            >
              {sortedCategories.map((option, i) => {
                const isChecked =
                  localSelectedCategories.some(
                    (selected) =>
                      String(selected.value) ===
                      String(option.value)
                  );

                return (
                  <label
                    key={i}
                    className="flex items-center gap-3 group cursor-pointer py-1.5"
                  >
                    <div className="relative flex items-center justify-center">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() =>
                          handleUpdate(
                            option,
                            isChecked
                          )
                        }
                        className="peer appearance-none w-4 h-4 border border-gray-300 rounded focus:ring-0 checked:bg-blue-600 checked:border-blue-600 transition-all cursor-pointer"
                      />

                      <svg
                        className="absolute w-2.5 h-2.5 text-white hidden peer-checked:block pointer-events-none"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>

                    <span
                      className={`text-sm ${
                        isChecked
                          ? "text-[#000000D9] font-medium"
                          : "text-[#000000D9] group-hover:text-gray-900"
                      }`}
                    >
                      {option.label || option.name}
                    </span>
                  </label>
                );
              })}
            </div>
          </>
        ) : (
          !showNoResults &&
          expanded && (
            <div className="text-xs text-gray-500 py-4 text-center bg-gray-50 rounded-lg border border-dashed border-gray-200">
              No keyword category types available
            </div>
          )
        )}

        {showNoResults && (
          <div className="text-sm text-gray-500 py-4 text-center bg-gray-50 rounded-lg">
            No keyword category types found for
            <span className="font-semibold ml-1">
              {categoryTypeSearch || globalSearch}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default KeywordCategoryTypeFilterComponent;

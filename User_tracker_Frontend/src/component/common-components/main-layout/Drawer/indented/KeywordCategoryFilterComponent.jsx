import React, { useState, useEffect, useMemo } from "react";
import { useEbuxContext } from "../../../../Ebux/Context/EbuxProvider";
import { escapeRegExp } from "../DrawerHelper";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import { isEqual } from "lodash";
import { getCombineFilterWidgetKW } from "../../../../Ebux/services/ebux.service";
import { ENTITY_TYPE, EVENTS, getTrackerContext, trackCustomEvent, TRACKING_COMPONENT } from "../../../../../tracker";


function KeywordCategoryFilterComponent({ expanded, handleToggle, handleSelectAll,
    handleCheck, searchTerm
}) {
    // console.log('sectionsection222', section)
    const {
        kpi,
        filters,
        activeClientProject,
        selectedFilters,
        selectedFiltersWidget,
        updateSelectedKeywordCategoryV2,
        updateSelectedKeywordCategory,

        setSelectedFiltersWidget,
        setFilters,
    } = useEbuxContext();

    const [categorySearch, setCategorySearch] = useState("");
    const [localSelectedKeywordCategory, setLocalSelectedKeywordCategory] = useState(
        selectedFiltersWidget?.selectedKeywordCategory ? [...selectedFiltersWidget.selectedKeywordCategory] : []
    );

    useEffect(() => {
        setLocalSelectedKeywordCategory(
            selectedFiltersWidget?.selectedKeywordCategory ? [...selectedFiltersWidget.selectedKeywordCategory] : []
        );
    }, [selectedFiltersWidget?.selectedKeywordCategory]);

    const handleUpdate = (option, isChecked) => {

        let newKeywordCategories;
        if (isChecked) {
            newKeywordCategories = (localSelectedKeywordCategory || []).filter(
                (c) => c.value !== option.value
            );
        } else {
            newKeywordCategories = [
                ...((localSelectedKeywordCategory || []) || []),
                option,
            ];
        }
        setLocalSelectedKeywordCategory(newKeywordCategories);
    };


    const handleSelectAllUpdate = (options, allSelected) => {
        trackCustomEvent(
            allSelected ? EVENTS.UNSELECT_ALL : EVENTS.SELECT_ALL,
            {
                section: "keyword_category_indented",
                action: allSelected ? "unselect_all" : "select_all",
                count: options?.length
            },
            ENTITY_TYPE.FILTER,
            getTrackerContext(kpi, null, { component_type: TRACKING_COMPONENT.CHECKBOX })
        );

        let newItems = [];
        if (allSelected) {
            newItems = (localSelectedKeywordCategory || []).filter(
                (b) => !options.some((opt) => opt.value === b.value)
            );
        } else {
            const uniqueItems = [
                ...(localSelectedKeywordCategory || []),
                ...options.filter(
                    (opt) =>
                        !(localSelectedKeywordCategory || []).some(
                            (sel) => sel.value === opt.value
                        )
                ),
            ];
            newItems = uniqueItems;
        }
        setLocalSelectedKeywordCategory(newItems);
    };


    const handleClearAll = () => {
        trackCustomEvent(
            EVENTS.CLEAR_ALL,
            { section: "keyword_category_indented" },
            ENTITY_TYPE.FILTER,
            getTrackerContext(kpi, null, { component_type: TRACKING_COMPONENT.DRAWER })
        );

        setLocalSelectedKeywordCategory([]);
        if (typeof handleSelectAll === "function") {
            handleSelectAll("keywordCategory", []);
        }
    };

    const handleApplyClick = async () => {
        const current = localSelectedKeywordCategory || [];
        trackCustomEvent(
            EVENTS.APPLY,
            {
                section: "keyword_category_indented",
                selected_count: current.length,
                selected: current.map(c => c.label || c.value)
            },
            ENTITY_TYPE.FILTER,
            getTrackerContext(kpi, null, { component_type: TRACKING_COMPONENT.DRAWER })
        );

        if (isEqual(JSON.stringify(selectedFiltersWidget?.selectedKeywordCategory), JSON.stringify(current))) {
            return;
        }


        if ([2, 101].indexOf(activeClientProject?.client_project_id) > -1 || activeClientProject?.useCombineFilter) {
            const cat_id = [...new Set(current?.map(i => i.value) ?? [])];
            const tagKeywordList = selectedFiltersWidget.selectedTagsKW?.flatMap(tag => tag?.tag_details?.map(d => d?.sku_or_keyword) ?? []) ?? [];
            let combineFilterWidgetKW;
            if (activeClientProject?.isFilterDateWise) {
                const dateRangeData = { calendarType: selectedFilters?.calendarType, selectedDateRange: selectedFilters?.selectedDateRange, selectedWeeks: selectedFilters?.selectedWeeks };
                combineFilterWidgetKW = await getCombineFilterWidgetKW("SOS", (selectedFiltersWidget.selectedPlatform?.map(i => i.value) ?? []), (selectedFiltersWidget.selectedBrand?.flatMap(i => i.id_in_db) ?? []), (cat_id ?? []), (selectedFiltersWidget.selectedKeyword?.map(i => i.value) ?? []), (tagKeywordList ?? []), dateRangeData);
            } else {
                combineFilterWidgetKW = await getCombineFilterWidgetKW("SOS", (selectedFiltersWidget.selectedPlatform?.map(i => i.value) ?? []), (selectedFiltersWidget.selectedBrand?.flatMap(i => i.id_in_db) ?? []), (cat_id ?? []), (selectedFiltersWidget.selectedKeyword?.map(i => i.value) ?? []), (tagKeywordList ?? []));
            }
            // let combineFilterWidgetKW = await getCombineFilterWidgetKW("SOS", [], (selectedFiltersWidget.selectedBrand?.map(i => i.value) ?? []), (cat_id ?? []),(selectedFiltersWidget.selectedKeyword?.map(i => i.value) ?? []));
            setFilters(prevFilters => ({
                ...prevFilters,
                platform: combineFilterWidgetKW?.platforms ?? [],
                brand: combineFilterWidgetKW?.brands ?? [],
                ...(current?.length === 0 && {
                    category: combineFilterWidgetKW?.keyword_categories ?? [],
                }),
                keyword: combineFilterWidgetKW?.keywords ?? [],
            }));
            setSelectedFiltersWidget(prevFilters => ({
                ...prevFilters,
                selectedKeywordCategory: current ?? [],
            }));

        } else {
            if (activeClientProject?.brandTreeSelect) {
                updateSelectedKeywordCategoryV2(current);
            } else {
                updateSelectedKeywordCategory(current);
            }
        }



        if (typeof handleCheck === "function") {
            const allCategories = Array.isArray(filters?.keywordCategory) ? filters.keywordCategory : [];
            allCategories.forEach((cat) => {
                const isChecked = current.some((c) => c.value === cat.value);
                handleCheck("keywordCategory", cat.value, isChecked, cat.label, true);
            });
        }

    };

    const sortedCategories = useMemo(() => {
        const list = Array.isArray(filters?.keywordCategory) ? filters.keywordCategory : [];
        const searchInput = (categorySearch || searchTerm || "").trim();
        if (!searchInput) return list;

        const terms = searchInput.split(";").map((t) => t.trim()).filter(Boolean);
        if (terms.length === 0) return list;

        const regexes = terms.map((t) => new RegExp(escapeRegExp(t), "i"));
        const filteredList = list.filter((item) => regexes.some((regex) => regex.test(item.label || "")));

        const selectedValues = (localSelectedKeywordCategory || []).map((c) => c.value);
        const sortedList = [...filteredList].sort((a, b) => {
            const aSelected = selectedValues.includes(a.value);
            const bSelected = selectedValues.includes(b.value);
            if (aSelected === bSelected) return 0;
            return aSelected ? -1 : 1;
        });

        return sortedList;
    }, [filters?.keywordCategory, categorySearch, searchTerm, localSelectedKeywordCategory]);


    const allVisibleSelected =
        sortedCategories.length > 0 &&
        sortedCategories.every((opt) =>
            (localSelectedKeywordCategory || []).some((sel) => sel.value === opt.value)
        );

    const someVisibleSelected =
        sortedCategories.some((opt) =>
            (localSelectedKeywordCategory || []).some((sel) => sel.value === opt.value)
        );

    const selectAllLabel = allVisibleSelected ? "Clear All" : "Select All";
    const showNoResults = sortedCategories.length === 0 && (categorySearch?.trim() || searchTerm?.trim());


    return (
        <>
            <div className="flex flex-col px-8 p-4 space-y-8">
                <div className="border-b border-gray-100 pb-6 last:border-0">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="flex font-semibold text-gray-900 text-base">Category indented
                            {
                                selectedFiltersWidget?.selectedKeywordCategory?.length > 0 ?
                                    <span className="ml-1 flex items-center justify-center w-5 h-5 text-[10px] rounded-full bg-[#F0F0F0]">{selectedFiltersWidget?.selectedKeywordCategory.length}</span>
                                    : <></>
                            }
                        </h3>
                        {sortedCategories?.length > 3 && (
                            <button
                                type="button"
                                className="text-gray-500 hover:text-gray-700"
                                onClick={() => handleToggle("category")}
                            >
                                {expanded["category"] ? <IoIosArrowUp size={20} /> : <IoIosArrowDown size={20} />}
                            </button>
                        )}
                    </div>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search categories..."
                            className="w-[70%] px-[9px] py-[2px] pr-[24px] mb-[6px] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={categorySearch}
                            onChange={(e) => setCategorySearch(e.target.value)}
                            onBlur={(e) => {
                                if (e.target.value?.trim()) {
                                    trackCustomEvent(
                                        EVENTS.SEARCH,
                                        {
                                            section: "keyword_category_indented",
                                            search_term: e.target.value
                                        },
                                        ENTITY_TYPE.FILTER,
                                        getTrackerContext(kpi, null, { component_type: TRACKING_COMPONENT.DRAWER })
                                    );
                                }
                            }}
                        />
                        {categorySearch && (
                            <RxCross2
                                size={18}
                                className="absolute right-[6.4rem] top-[45%] -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer z-10"
                                onClick={() => {
                                    trackCustomEvent(
                                        EVENTS.CLEAR,
                                        {
                                            section: "keyword_category_indented",
                                            action: "clear_search"
                                        },
                                        ENTITY_TYPE.FILTER,
                                        getTrackerContext(kpi, null, { component_type: TRACKING_COMPONENT.DRAWER })
                                    );
                                    setCategorySearch("");
                                }}
                            />
                        )}
                    </div>
                    {sortedCategories?.length > 0 && (
                        <div className="space-y-2">
                            <div className={`space-y-2 transition-all duration-300 ${expanded["category"] ? "max-h-60 overflow-y-auto pr-2" : "max-h-[102px] overflow-hidden"}`} >

                                <label className="flex items-center font-bold gap-2 text-sm text-gray-700 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 text-blue-600 rounded"
                                        checked={allVisibleSelected}
                                        ref={(input) => {
                                            if (input) input.indeterminate = !allVisibleSelected && someVisibleSelected;
                                        }}
                                        onChange={() => {
                                            handleSelectAllUpdate(sortedCategories, allVisibleSelected)
                                        }}
                                    />
                                    {selectAllLabel}
                                </label>

                                {sortedCategories?.map((option, i) => {
                                    const isChecked = (localSelectedKeywordCategory || []).some((sel) => sel.value === option.value);
                                    return (
                                        <div key={i} className="ml-0">
                                            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                                                <span>
                                                    <input
                                                        type="checkbox"
                                                        className="w-4 h-4 text-blue-600 rounded"
                                                        checked={isChecked}
                                                        onChange={() => {
                                                            handleUpdate(option, isChecked); // 🔹 dynamic updater
                                                            handleCheck((kpi === "SOS" || kpi === "OR" || kpi === "Wt_SOS" ? "keywordCategory" : "category"), option.value, isChecked, option.label); // keep drawer state in sync
                                                        }}
                                                    />
                                                </span>
                                                {option.label}
                                            </label>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                    {showNoResults && (
                        <div className="px-8 p-4 text-sm text-gray-500">No categories found</div>
                    )}

                    <div className="flex justify-between relative top-[8px]">
                        <button
                            type="button"
                            className="text-blue-500 text-sm font-medium mt-3 flex items-center"
                            onClick={() => {
                                trackCustomEvent(
                                    expanded["category"] ? EVENTS.VIEW_LESS : EVENTS.VIEW_MORE,
                                    { section: "keyword_category_indented" },
                                    ENTITY_TYPE.FILTER,
                                    getTrackerContext(kpi, null, { component_type: TRACKING_COMPONENT.DRAWER })
                                );
                                handleToggle("category");
                            }}
                        >
                            {expanded["category"] ? "View Less" : "View More"}
                            <span className="ml-1">
                                {expanded["category"] ? <IoIosArrowUp size={16} /> : <IoIosArrowDown size={16} />}
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

        </>
    );
}

export default KeywordCategoryFilterComponent;
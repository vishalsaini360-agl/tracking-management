import React, { useState, useEffect, useMemo } from "react";
import { useEbuxContext } from "../../../Ebux/Context/EbuxProvider";
import { escapeRegExp } from "./DrawerHelper";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import { isEqual } from "lodash";
import { ENTITY_TYPE, EVENTS, getTrackerContext, trackCustomEvent, TRACKING_COMPONENT } from "../../../../tracker";

import { getCombineFilterWidgetKW } from "../../../Ebux/services/ebux.service";


function KeywordFilterComponent({ expanded, handleToggle, handleSelectAll,
    handleCheck, searchTerm
}) {
    const {
        kpi,
        filters,
        activeClientProject,
        selectedFilters,
        selectedFiltersWidget,
        updateSelectedKeyword,
        updateSelectedKeywordV2,

        setSelectedFiltersWidget,
        setFilters
    } = useEbuxContext();
    const [keywordSearch, setKeywordSearch] = useState("");
    const [localSelectedBrands, setLocalSelectedBrands] = useState(
        selectedFiltersWidget?.selectedKeyword ? [...selectedFiltersWidget.selectedKeyword] : []
    );

    useEffect(() => {
        setLocalSelectedBrands(
            selectedFiltersWidget?.selectedKeyword ? [...selectedFiltersWidget.selectedKeyword] : []
        );
    }, [selectedFiltersWidget?.selectedKeyword]);


    const handleUpdate = (option, isChecked) => {
        let newProducts;
        if (isChecked) {
            newProducts = (localSelectedBrands || []).filter(
                (p) => p.value !== option.value
            );
        } else {
            newProducts = [...((localSelectedBrands || []) || []), option];
        }
        setLocalSelectedBrands(newProducts);
    };


    const handleSelectAllUpdate = (options, allSelected) => {
        trackCustomEvent(
            allSelected ? EVENTS.UNSELECT_ALL : EVENTS.SELECT_ALL,
            { section: "keyword", action: allSelected ? "unselect_all" : "select_all", count: options?.length },
            ENTITY_TYPE.FILTER,
            getTrackerContext(kpi, null, { component_type: TRACKING_COMPONENT.CHECKBOX })
        );
        let newItems = [];
        if (allSelected) {
            newItems = (localSelectedBrands || []).filter(
                (b) => !options.some((opt) => opt.value === b.value)
            );
        } else {
            const uniqueItems = [
                ...(localSelectedBrands || []),
                ...options.filter(
                    (opt) =>
                        !(localSelectedBrands || []).some(
                            (sel) => sel.value === opt.value
                        )
                ),
            ];
            newItems = uniqueItems;
        }
        setLocalSelectedBrands(newItems);
    };

    const handleClearAll = () => {
        trackCustomEvent(
            EVENTS.CLEAR_ALL,
            { section: "keyword" },
            ENTITY_TYPE.FILTER,
            getTrackerContext(kpi, null, { component_type: TRACKING_COMPONENT.DRAWER })
        );
        setLocalSelectedBrands([]);
        if (typeof handleSelectAll === "function") {
            handleSelectAll("keyword", []);
        }

    };

    const handleApplyClick = async () => {
        const current = localSelectedBrands || [];
        trackCustomEvent(
            EVENTS.APPLY,
            { section: "keyword", selected_count: current.length, selected: current.map((c) => c.label || c.value) },
            ENTITY_TYPE.FILTER,
            getTrackerContext(kpi, null, { component_type: TRACKING_COMPONENT.DRAWER })
        );
        if (isEqual(JSON.stringify(selectedFiltersWidget?.selectedKeyword), JSON.stringify(current))) {
            return;
        }

        if ([2, 101].indexOf(activeClientProject?.client_project_id) > -1||activeClientProject?.useCombineFilter) {


            const keyword_id = [...new Set(current?.map(i => i.value) ?? [])];
            const tagKeywordList = selectedFiltersWidget.selectedTagsKW?.flatMap(tag => tag?.tag_details?.map(d => d?.sku_or_keyword) ?? [] ) ?? [];   
            // let combineFilterWidgetKW = await getCombineFilterWidgetKW("SOS", [], [], [], (keyword_id ?? []));
            let combineFilterWidgetKW;
            if (activeClientProject?.isFilterDateWise) {
                const dateRangeData = { calendarType: selectedFilters?.calendarType, selectedDateRange: selectedFilters?.selectedDateRange, selectedWeeks: selectedFilters?.selectedWeeks };
                combineFilterWidgetKW = await getCombineFilterWidgetKW("SOS", (selectedFiltersWidget.selectedPlatform?.map(i => i.value) ?? []), (selectedFiltersWidget.selectedBrand?.flatMap(i => i.id_in_db) ?? []), (selectedFiltersWidget.selectedKeywordCategory?.map(i => i.value) ?? []), (keyword_id ?? []), (tagKeywordList ?? []), dateRangeData);
            } else {
                combineFilterWidgetKW = await getCombineFilterWidgetKW("SOS", (selectedFiltersWidget.selectedPlatform?.map(i => i.value) ?? []), (selectedFiltersWidget.selectedBrand?.flatMap(i => i.id_in_db) ?? []), (selectedFiltersWidget.selectedKeywordCategory?.map(i => i.value) ?? []), (keyword_id ?? []), (tagKeywordList ?? []));
            }
            // let combineFilterWidgetKW = await getCombineFilterWidgetKW("SOS", [],(bid ?? []),(selectedFiltersWidget.selectedKeywordCategory?.map(i => i.value) ?? []),(keyword_id ?? []));
            setFilters(prevFilters => ({
                ...prevFilters,
                platform: combineFilterWidgetKW?.platforms ?? [],
                brand: combineFilterWidgetKW?.brands ?? [],
                keywordCategory: combineFilterWidgetKW?.keyword_categories ?? [],
                ...(current?.length === 0 && {
                    keyword: combineFilterWidgetKW?.keywords ?? [],
                }),
            }));

            setSelectedFiltersWidget(prevFilters => ({
                ...prevFilters,
                selectedKeyword: current ?? [],
            }));


        } else {
            if (activeClientProject?.brandTreeSelect) {
                updateSelectedKeywordV2(current);
            } else {
                updateSelectedKeyword(current);
            }
        }


        if (typeof handleCheck === "function") {
            const allKeywords = Array.isArray(filters?.keyword) ? filters.keyword : [];
            allKeywords.forEach((kw) => {
                const isChecked = current.some((c) => c.value === kw.value);
                handleCheck("keyword", kw.value, !isChecked, kw.label, true);
            });
        }
    };

    const sortedProducts = useMemo(() => {
        const list = Array.isArray(filters?.keyword) ? filters.keyword : [];
        const searchInput = (keywordSearch || searchTerm || "").trim();
        if (!searchInput) return list;

        const terms = searchInput.split(";").map((t) => t.trim()).filter(Boolean);
        if (terms.length === 0) return list;

        const regexes = terms.map((t) => new RegExp(escapeRegExp(t), "i"));
        const filteredList = list.filter((item) => regexes.some((regex) => regex.test(item.label || "")));

        const selectedValues = (localSelectedBrands || []).map((p) => p.value);
        const sortedList = [...filteredList].sort((a, b) => {
            const aSelected = selectedValues.includes(a.value);
            const bSelected = selectedValues.includes(b.value);
            if (aSelected === bSelected) return 0;
            return aSelected ? -1 : 1;
        });

        return sortedList;
    }, [filters?.keyword, keywordSearch, searchTerm, localSelectedBrands]);

    const allVisibleSelected =
        sortedProducts.length > 0 &&
        sortedProducts.every((opt) =>
            (localSelectedBrands || []).some((sel) => sel.value === opt.value)
        );

    const someVisibleSelected =
        sortedProducts.some((opt) =>
            (localSelectedBrands || []).some((sel) => sel.value === opt.value)
        );

    const selectAllLabel = allVisibleSelected ? "Clear All" : "Select All";
    const showNoResults = sortedProducts.length === 0 && (keywordSearch?.trim() || searchTerm?.trim());
    return (
        <>
            <div className="flex flex-col px-8 p-4 space-y-8">
                <div className="border-b border-gray-100 pb-6 last:border-0">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="flex font-semibold text-gray-900 text-base">Keyword
                            {
                                selectedFiltersWidget?.selectedKeyword?.length > 0 ?
                                    <span className="ml-1 flex items-center justify-center w-5 h-5 text-[10px] rounded-full bg-[#F0F0F0]">{selectedFiltersWidget?.selectedKeyword.length}</span>
                                    : <></>
                            }
                        </h3>
                        {sortedProducts?.length > 3 && (
                            <button
                                type="button"
                                className="text-gray-500 hover:text-gray-700"
                                onClick={() => handleToggle("keyword")}
                            >
                                {expanded["keyword"] ? <IoIosArrowUp size={20} /> : <IoIosArrowDown size={20} />}
                            </button>
                        )}
                    </div>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search keywords..."
                            className="w-[70%] px-[9px] py-[2px] pr-[24px] mb-[6px] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={keywordSearch}
                            onChange={(e) => setKeywordSearch(e.target.value)}
                            onBlur={(e) => {
                                if (e.target.value?.trim()) {
                                    trackCustomEvent(
                                        EVENTS.SEARCH,
                                        { section: "keyword", search_term: e.target.value },
                                        ENTITY_TYPE.FILTER,
                                        getTrackerContext(kpi, null, { component_type: TRACKING_COMPONENT.DRAWER })
                                    );
                                }
                            }}
                        />
                        {keywordSearch && (
                            <RxCross2
                                size={18}
                                className="absolute right-[6.4rem] top-[45%] -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer z-10"
                                onClick={() => {
                                    trackCustomEvent(
                                        EVENTS.CLEAR,
                                        { section: "keyword", action: "clear_search" },
                                        ENTITY_TYPE.FILTER,
                                        getTrackerContext(kpi, null, { component_type: TRACKING_COMPONENT.DRAWER })
                                    );
                                    setKeywordSearch("");
                                }}
                            />
                        )}
                    </div>
                    {sortedProducts?.length > 0 && (
                        <div className="space-y-2">
                            <div className={`space-y-2 transition-all duration-300 ${expanded["keyword"] ? "max-h-60 overflow-y-auto pr-2" : "max-h-[102px] overflow-hidden"}`} >

                                <label className="flex items-center font-bold gap-2 text-sm text-gray-700 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 text-blue-600 rounded"
                                        checked={allVisibleSelected}
                                        ref={(input) => {
                                            if (input) input.indeterminate = !allVisibleSelected && someVisibleSelected;
                                        }}
                                        onChange={() => {
                                            handleSelectAllUpdate(sortedProducts, allVisibleSelected)
                                        }}
                                    />
                                    {selectAllLabel}
                                </label>

                                {sortedProducts?.map((option, i) => {
                                    const isChecked = (localSelectedBrands || []).some(
                                        (sel) => sel.value === option.value
                                    );
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
                                                            handleCheck("keyword", option.value, isChecked, option.label); // keep drawer state in sync
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
                        <div className="px-8 p-4 text-sm text-gray-500">
                            No keyword found...
                        </div>
                    )}
                    <div className="flex justify-between relative top-[8px]">
                        <button
                            type="button"
                            className="text-blue-500 text-sm font-medium mt-3 flex items-center"
                            onClick={() => handleToggle("keyword")}
                        >
                            {expanded["keyword"] ? "View Less" : "View More"}
                            <span className="ml-1">
                                {expanded["keyword"] ? <IoIosArrowUp size={16} /> : <IoIosArrowDown size={16} />}
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

export default KeywordFilterComponent;
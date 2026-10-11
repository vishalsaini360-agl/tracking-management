import React, { useState, useEffect, useMemo } from "react";
import { useEbuxContext } from "../../../Ebux/Context/EbuxProvider";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import { isEqual } from "lodash";
import { ENTITY_TYPE, EVENTS, getTrackerContext, trackCustomEvent, TRACKING_COMPONENT } from "../../../../tracker";
import { getCombineFilterWidget } from "../../../Ebux/services/ebux.service";
import { escapeRegExp } from "./DrawerHelper";



function RangeFilterComponent({ expanded, handleToggle, handleSelectAll, handleCheck, searchTerm }) {
    const {
        // kpi,
        filters, selectedFilters,
        activeClientProject,
        selectedFiltersWidget,
        // updateSelectedMotherPack

        setSelectedFiltersWidget,
        setFilters,
        selectedMsl
    } = useEbuxContext();
    const [rangeSearch, setRangeSearch] = useState("");

    const [localSelectedRange, setLocalSelectedRange] = useState(
        selectedFiltersWidget?.selectedRange ? [...selectedFiltersWidget.selectedRange] : []
    );

    useEffect(() => {
        setLocalSelectedRange(
            selectedFiltersWidget?.selectedRange ? [...selectedFiltersWidget.selectedRange] : []
        );
    }, [selectedFiltersWidget?.selectedRange]);

    const handleUpdate = (option, isChecked) => {
        let newProducts;
        if (isChecked) {
            newProducts = (localSelectedRange || []).filter(
                (p) => p.value !== option.value
            );
        } else {
            newProducts = [...((localSelectedRange || []) || []), option];
        }

        setLocalSelectedRange(newProducts);

    };

    const handleSelectAllUpdate = (options, allSelected) => {
        trackCustomEvent(
            allSelected ? EVENTS.UNSELECT_ALL : EVENTS.SELECT_ALL,
            { section: "range", action: allSelected ? "unselect_all" : "select_all", count: options?.length },
            ENTITY_TYPE.FILTER,
            getTrackerContext(null, null, { component_type: TRACKING_COMPONENT.CHECKBOX })
        );
        let newItems = [];

        if (allSelected) {
            newItems = (localSelectedRange || []).filter(
                (b) => !options.some((opt) => opt.value === b.value)
            );
        } else {
            const uniqueItems = [
                ...(localSelectedRange || []),
                ...options.filter(
                    (opt) =>
                        !(localSelectedRange || []).some(
                            (sel) => sel.value === opt.value
                        )
                ),
            ];
            newItems = uniqueItems;
        }
        setLocalSelectedRange(newItems);
    };


    const handleClearAll = () => {
        trackCustomEvent(
            EVENTS.CLEAR_ALL,
            { section: "range" },
            ENTITY_TYPE.FILTER,
            getTrackerContext(null, null, { component_type: TRACKING_COMPONENT.DRAWER })
        );
        setLocalSelectedRange([]);
        if (typeof handleSelectAll === "function") {
            handleSelectAll("range", []);
        }
    };

    const handleApplyClick = async () => {
        const current = localSelectedRange || [];
        trackCustomEvent(
            EVENTS.APPLY,
            { section: "range", selected_count: current.length, selected: current.map(c => c.label || c.value) },
            ENTITY_TYPE.FILTER,
            getTrackerContext(null, null, { component_type: TRACKING_COMPONENT.DRAWER })
        );
        if (isEqual(JSON.stringify(selectedFiltersWidget?.selectedRange), JSON.stringify(current))) {
            return;
        }


        const tagSkuList = selectedFiltersWidget.selectedTags?.flatMap(tag => tag?.tag_details?.map(d => d?.sku_or_keyword) ?? []) ?? [];
        let combineFilterWidget;
        const range_id = [...new Set(current?.flatMap(i => i?.id_in_db ?? i?.value) ?? [])];
        if (activeClientProject?.isFilterDateWise) {
            const dateRangeData = { calendarType: selectedFilters?.calendarType, selectedDateRange: selectedFilters?.selectedDateRange, selectedWeeks: selectedFilters?.selectedWeeks };
            combineFilterWidget = await getCombineFilterWidget("OSA", (selectedFiltersWidget.selectedPlatform?.flatMap(i => i?.id_in_db ?? i?.value) ?? []), (selectedFiltersWidget.selectedBrand?.flatMap(i => i?.id_in_db ?? i?.value) ?? []), (selectedFiltersWidget.selectedCategory?.flatMap(i => i?.id_in_db ?? i?.value) ?? []), (selectedFiltersWidget.selectedMotherPack?.flatMap(i => i?.id_in_db ?? i?.value) ?? []), (selectedFiltersWidget.selectedProductId?.flatMap(i => i?.id_in_db ?? i?.value) ?? []), range_id, selectedMsl, (tagSkuList ?? []), dateRangeData);
        } else {
            combineFilterWidget = await getCombineFilterWidget("OSA", (selectedFiltersWidget.selectedPlatform?.flatMap(i => i?.id_in_db ?? i?.value) ?? []), (selectedFiltersWidget.selectedBrand?.flatMap(i => i?.id_in_db ?? i?.value) ?? []), (selectedFiltersWidget.selectedCategory?.flatMap(i => i?.id_in_db ?? i?.value) ?? []), (selectedFiltersWidget.selectedMotherPack?.flatMap(i => i?.id_in_db ?? i?.value) ?? []), (selectedFiltersWidget.selectedProductId?.flatMap(i => i?.id_in_db ?? i?.value) ?? []), range_id, selectedMsl, (tagSkuList ?? []));
        }

        setFilters(prevFilters => ({
            ...prevFilters,
            platform: combineFilterWidget?.platforms ?? [],
            brand: combineFilterWidget?.brands ?? [],
            category: combineFilterWidget?.categories ?? [],
            products: combineFilterWidget?.products ?? [],
            ...((combineFilterWidget?.mother_packs) ? { mother_pack: combineFilterWidget?.mother_packs ?? [] } : {}),
        }));

        setSelectedFiltersWidget(prevFilters => ({
            ...prevFilters,
            selectedRange: current ?? []
        }));


        if (typeof handleCheck === "function") {
            const allRanges = Array.isArray(filters?.range) ? filters.range : [];
            allRanges.forEach((mp) => {
                const isChecked = current.some((c) => c.value === mp.value);
                handleCheck("range", mp.value, !isChecked, mp.label, true);
            });
        }

    };

    const sortedRange = useMemo(() => {
        const list = Array.isArray(filters?.range) ? filters.range : [];
        const searchInput = (rangeSearch || searchTerm || "").trim();

        if (!searchInput) {
            return list;
        }

        const terms = searchInput.split(";").map((t) => t.trim()).filter(Boolean);
        if (terms.length === 0) return list;

        const regexes = terms.map((t) => new RegExp(escapeRegExp(t), "i"));
        const filteredList = list.filter((item) => regexes.some((regex) => regex.test(item.label || "")));
        const selectedValues = (localSelectedRange || []).map((p) => p.value);
        const sortedList = [...filteredList].sort((a, b) => {
            const aSelected = selectedValues.includes(a.value);
            const bSelected = selectedValues.includes(b.value);
            if (aSelected === bSelected) return 0;
            return aSelected ? -1 : 1;
        });
        return sortedList;
    }, [filters?.range, searchTerm, rangeSearch, localSelectedRange]);


    const allVisibleSelected = sortedRange.length > 0 && sortedRange.every((opt) =>
        (localSelectedRange || []).some((sel) => sel.value === opt.value)
    );

    const someVisibleSelected = sortedRange.some((opt) =>
        (localSelectedRange || []).some((sel) => sel.value === opt.value)
    );

    const selectAllLabel = allVisibleSelected ? "Clear All" : "Select All";
    const showNoResults = sortedRange.length === 0 && (rangeSearch?.trim() || searchTerm?.trim());
    return (
        <>
            <div className="flex flex-col px-8 p-4 space-y-8">
                <div className="border-b border-gray-100 pb-6 last:border-0">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="flex font-semibold text-gray-900 text-base">Range
                            {
                                selectedFiltersWidget?.selectedRange?.length > 0 ?
                                    <span className="ml-1 flex items-center justify-center w-5 h-5 text-[10px] rounded-full bg-[#F0F0F0]">{selectedFiltersWidget?.selectedRange.length}</span>
                                    : <></>
                            }
                        </h3>
                        {sortedRange?.length > 3 && (
                            <button
                                type="button"
                                className="text-gray-500 hover:text-gray-700"
                                onClick={() => handleToggle("range")}
                            >
                                {expanded["range"] ? <IoIosArrowUp size={20} /> : <IoIosArrowDown size={20} />}
                            </button>
                        )}
                    </div>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search range..."
                            className="w-[70%] px-[9px] py-[2px] pr-[24px] mb-[6px] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={rangeSearch}
                            onChange={(e) => setRangeSearch(e.target.value)}
                            onBlur={(e) => {
                                if (e.target.value?.trim()) {
                                    trackCustomEvent(
                                        EVENTS.SEARCH,
                                        { section: "range", search_term: e.target.value },
                                        ENTITY_TYPE.FILTER,
                                        getTrackerContext(null, null, { component_type: TRACKING_COMPONENT.DRAWER })
                                    );
                                }
                            }}
                        />
                        {rangeSearch && (
                            <RxCross2
                                size={18}
                                className="absolute right-[6.4rem] top-[45%] -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer z-10"
                                onClick={() => {
                                    trackCustomEvent(
                                        EVENTS.CLEAR,
                                        { section: "range", action: "clear_search" },
                                        ENTITY_TYPE.FILTER,
                                        getTrackerContext(null, null, { component_type: TRACKING_COMPONENT.DRAWER })
                                    );
                                    setRangeSearch("");
                                }}
                            />
                        )}
                    </div>
                    {sortedRange?.length > 0 && (
                        <div className="space-y-2">
                            <div className={`space-y-2 transition-all duration-300 ${expanded["range"] ? "max-h-60 overflow-y-auto pr-2" : "max-h-[102px] overflow-hidden"}`} >

                                <label className="flex items-center font-bold gap-2 text-sm text-gray-700 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 text-blue-600 rounded"
                                        checked={allVisibleSelected}
                                        ref={(input) => {
                                            if (input) input.indeterminate = !allVisibleSelected && someVisibleSelected;
                                        }}
                                        onChange={() => {
                                            handleSelectAllUpdate(sortedRange, allVisibleSelected)
                                        }}
                                    />
                                    {selectAllLabel}
                                </label>


                                {sortedRange?.map((option, i) => {
                                    const isChecked = (localSelectedRange || []).some(
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
                                                            handleCheck("range", option.value, isChecked, option.label); // keep drawer state in sync
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
                            No range found...
                        </div>
                    )}
                    <div className="flex justify-between relative top-[8px]">
                        <button
                            type="button"
                            className="text-blue-500 text-sm font-medium mt-3 flex items-center"
                            onClick={() => handleToggle("range")}
                        >
                            {expanded["range"] ? "View Less" : "View More"}
                            <span className="ml-1">
                                {expanded["range"] ? <IoIosArrowUp size={16} /> : <IoIosArrowDown size={16} />}
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

export default RangeFilterComponent;
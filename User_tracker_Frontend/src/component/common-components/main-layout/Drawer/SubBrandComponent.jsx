import React, { useState, useEffect, useMemo } from "react";
import { useEbuxContext } from "../../../Ebux/Context/EbuxProvider";
import { escapeRegExp } from "./DrawerHelper";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import { isEqual } from "lodash";
import { ENTITY_TYPE, EVENTS, getTrackerContext, trackCustomEvent, TRACKING_COMPONENT } from "../../../../tracker";

function SubBrandFilterComponent({ expanded, handleToggle, handleSelectAll, handleCheck, searchTerm }) {
    const {
        kpi,
        filters,
        selectedFiltersWidget,
        setSelectedFiltersWidget,
    } = useEbuxContext();
    const [subBrandSearch, setSubBrandSearch] = useState("");

    const [localSelectedSubBrand, setLocalSelectedSubBrand] = useState(
        selectedFiltersWidget?.selectedSubBrandData ? [...selectedFiltersWidget.selectedSubBrandData] : []
    );

    useEffect(() => {
        setLocalSelectedSubBrand(
            selectedFiltersWidget?.selectedSubBrandData ? [...selectedFiltersWidget.selectedSubBrandData] : []
        );
    }, [selectedFiltersWidget?.selectedSubBrandData]);

    const handleUpdate = (option, isChecked) => {
        let newSubBrand;
        if (isChecked) {
            newSubBrand = (localSelectedSubBrand || []).filter(
                (s) => s.value !== option.value
            );
        } else {
            newSubBrand = [...((localSelectedSubBrand || []) || []), option];
        }
        setLocalSelectedSubBrand(newSubBrand);
    };

    const handleSelectAllUpdate = (options, allSelected) => {
        trackCustomEvent(
            allSelected ? EVENTS.UNSELECT_ALL : EVENTS.SELECT_ALL,
            { section: "sub_brand", action: allSelected ? "unselect_all" : "select_all", count: options?.length },
            ENTITY_TYPE.FILTER,
            getTrackerContext(kpi, null, { component_type: TRACKING_COMPONENT.CHECKBOX })
        );
        let newItems = [];

        if (allSelected) {
            newItems = (localSelectedSubBrand || []).filter(
                (s) => !options.some((opt) => opt.value === s.value)
            );
        } else {
            const uniqueItems = [
                ...(localSelectedSubBrand || []),
                ...options.filter(
                    (opt) =>
                        !(localSelectedSubBrand || []).some(
                            (sel) => sel.value === opt.value
                        )
                ),
            ];
            newItems = uniqueItems;
        }
        setLocalSelectedSubBrand(newItems);
    };

    const handleClearAll = () => {
        trackCustomEvent(
            EVENTS.CLEAR_ALL,
            { section: "sub_brand" },
            ENTITY_TYPE.FILTER,
            getTrackerContext(kpi, null, { component_type: TRACKING_COMPONENT.DRAWER })
        );
        setLocalSelectedSubBrand([]);
        if (typeof handleSelectAll === "function") {
            handleSelectAll("sub_brand", []);
        }
    };

    const handleApplyClick = async () => {
        const current = localSelectedSubBrand || [];
        trackCustomEvent(
            EVENTS.APPLY,
            { section: "sub_brand", selected_count: current.length, selected: current.map((c) => c.label || c.value) },
            ENTITY_TYPE.FILTER,
            getTrackerContext(kpi, null, { component_type: TRACKING_COMPONENT.DRAWER })
        );
        if (isEqual(JSON.stringify(selectedFiltersWidget?.selectedSubBrandData), JSON.stringify(current))) {
            return;
        }
        setSelectedFiltersWidget(prevFilters => ({
            ...prevFilters,
            selectedSubBrandData: current ?? [],
        }));
        if (typeof handleCheck === "function") {
            const allSubBrand = Array.isArray(filters?.subBrandData) ? filters.subBrandData : [];
            allSubBrand.forEach((subBrand) => {
                const isChecked = current.some((s) => s.value === subBrand.value);
                handleCheck("subBrandData", subBrand.value, !isChecked, subBrand.label, true);
            });
        }
    };

    const sortedSubBrand = useMemo(() => {
        const list = Array.isArray(filters?.subBrandData) ? filters.subBrandData : [];
        const searchInput = (subBrandSearch || searchTerm || "").trim();
        if (!searchInput) { return list; }
        const safe = escapeRegExp(searchInput);
        const regex = new RegExp(safe, "i");

        const filteredList = list.filter((item) => regex.test(item.label));

        const selectedValues = (localSelectedSubBrand || []).map((s) => s.value);
        const sortedList = [...filteredList].sort((a, b) => {
            const aSelected = selectedValues.includes(a.value);
            const bSelected = selectedValues.includes(b.value);
            if (aSelected === bSelected) return 0;
            return aSelected ? -1 : 1;
        });
        return sortedList;
    }, [filters?.subBrandData, searchTerm, subBrandSearch, localSelectedSubBrand]);

    const allVisibleSelected =
        sortedSubBrand.length > 0 &&
        sortedSubBrand.every((opt) =>
            (localSelectedSubBrand || []).some((sel) => sel.value === opt.value)
        );

    const someVisibleSelected =
        sortedSubBrand.some((opt) =>
            (localSelectedSubBrand || []).some((sel) => sel.value === opt.value)
        );

    const selectAllLabel = allVisibleSelected ? "Clear All" : "Select All";
    const showNoResults = sortedSubBrand.length === 0 && (subBrandSearch?.trim() || searchTerm?.trim());

    return (
        <>
            <div className="flex flex-col px-8 p-4 space-y-8">
                <div className="border-b border-gray-100 pb-6 last:border-0">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="flex font-semibold text-gray-900 text-base">Sub Brand
                            {
                                selectedFiltersWidget?.selectedSubBrandData?.length > 0 ?
                                    <span className="ml-1 flex items-center justify-center w-5 h-5 text-[10px] rounded-full bg-[#F0F0F0]">
                                        {selectedFiltersWidget?.selectedSubBrandData.length}
                                    </span>
                                    : <></>
                            }
                        </h3>
                        {sortedSubBrand?.length > 3 && (
                            <button
                                type="button"
                                className="text-gray-500 hover:text-gray-700"
                                onClick={() => handleToggle("sub_brand")}
                            >
                                {expanded["sub_brand"] ? <IoIosArrowUp size={20} /> : <IoIosArrowDown size={20} />}
                            </button>
                        )}
                    </div>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search sub brand..."
                            className="w-[75%] px-[9px] py-[2px] pr-[24px] mb-[6px] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={subBrandSearch}
                            onChange={(e) => setSubBrandSearch(e.target.value)}
                            onBlur={(e) => {
                                if (e.target.value?.trim()) {
                                    trackCustomEvent(
                                        EVENTS.SEARCH,
                                        { section: "sub_brand", search_term: e.target.value },
                                        ENTITY_TYPE.FILTER,
                                        getTrackerContext(kpi, null, { component_type: TRACKING_COMPONENT.DRAWER })
                                    );
                                }
                            }}
                        />
                        {subBrandSearch && (
                            <RxCross2
                                size={18}
                                className="absolute right-[5.4rem] top-[45%] -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer z-10"
                                onClick={() => {
                                    trackCustomEvent(
                                        EVENTS.CLEAR,
                                        { section: "sub_brand", action: "clear_search" },
                                        ENTITY_TYPE.FILTER,
                                        getTrackerContext(kpi, null, { component_type: TRACKING_COMPONENT.DRAWER })
                                    );
                                    setSubBrandSearch("");
                                }}
                            />
                        )}
                    </div>
                    {sortedSubBrand?.length > 0 && (
                        <div className="space-y-2">
                            <div className={`space-y-2 transition-all duration-300 ${expanded["sub_brand"] ? "max-h-60 overflow-y-auto pr-2" : "max-h-[102px] overflow-hidden"}`} >
                                <label className="flex items-center font-bold gap-2 text-sm text-gray-700 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 text-blue-600 rounded"
                                        checked={allVisibleSelected}
                                        ref={(input) => {
                                            if (input) input.indeterminate = !allVisibleSelected && someVisibleSelected;
                                        }}
                                        onChange={() => {
                                            handleSelectAllUpdate(sortedSubBrand, allVisibleSelected)
                                        }}
                                    />
                                    {selectAllLabel}
                                </label>

                                {sortedSubBrand?.map((option, i) => {
                                    const isChecked = (localSelectedSubBrand || []).some(
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
                                                            handleUpdate(option, isChecked);
                                                            handleCheck("subBrandData", option.value, isChecked, option.label);
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
                            No sub brands found...
                        </div>
                    )}
                    <div className="flex justify-between relative top-[8px]">
                        <button
                            type="button"
                            className="text-blue-500 text-sm font-medium mt-3 flex items-center"
                            onClick={() => handleToggle("sub_brand")}
                        >
                            {expanded["sub_brand"] ? "View Less" : "View More"}
                            <span className="ml-1">
                                {expanded["sub_brand"] ? <IoIosArrowUp size={16} /> : <IoIosArrowDown size={16} />}
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

export default SubBrandFilterComponent;
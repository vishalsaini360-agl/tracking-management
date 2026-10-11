import React, { useState, useEffect, useMemo } from "react";
import { useEbuxContext } from "../../../Ebux/Context/EbuxProvider";
import { escapeRegExp } from "./DrawerHelper";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import { isEqual } from "lodash";
import { ENTITY_TYPE, EVENTS, getTrackerContext, trackCustomEvent, TRACKING_COMPONENT } from "../../../../tracker";
import { getCombineFilterCompetitionWidget } from "../../../Ebux/services/ebux.service";

function BrandCompetitionFilterComponent({ expanded, handleToggle, handleSelectAll, handleCheck, searchTerm }) {
    const {
        kpi,
        filters,
        setFilters,
        selectedFilters,
        selectedFiltersWidget,
        setSelectedFiltersWidget,
    } = useEbuxContext();
    const [brandSearch, setBrandSearch] = useState("");

    const [localSelectedBrands, setLocalSelectedBrands] = useState(
        selectedFiltersWidget?.selectedBrandCompetition ? [...selectedFiltersWidget.selectedBrandCompetition] : []
    );

    useEffect(() => {
        setLocalSelectedBrands(
            selectedFiltersWidget?.selectedBrandCompetition ? [...selectedFiltersWidget.selectedBrandCompetition] : []
        );
    }, [selectedFiltersWidget?.selectedBrandCompetition]);

    const handleUpdate = (option, isChecked) => {
        let newBrands;
        if (isChecked) {
            newBrands = (localSelectedBrands || []).filter(
                (b) => b.value !== option.value
            );
        } else {
            newBrands = [...((localSelectedBrands || []) || []), option];
        }
        setLocalSelectedBrands(newBrands);
    };

    const handleSelectAllUpdate = (options, allSelected) => {
        trackCustomEvent(
            allSelected ? EVENTS.UNSELECT_ALL : EVENTS.SELECT_ALL,
            { section: "brand_competition", action: allSelected ? "unselect_all" : "select_all", count: options?.length },
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
            { section: "brand_competition" },
            ENTITY_TYPE.FILTER,
            getTrackerContext(kpi, null, { component_type: TRACKING_COMPONENT.DRAWER })
        );
        setLocalSelectedBrands([]);
        if (typeof handleSelectAll === "function") {
            handleSelectAll("BrandCompetitionFilterComponent", []);
        }

    };

    const handleApplyClick = async () => {
        const current = localSelectedBrands || [];
        trackCustomEvent(
            EVENTS.APPLY,
            { section: "brand_competition", selected_count: current.length, selected: current.map((c) => c.label || c.value) },
            ENTITY_TYPE.FILTER,
            getTrackerContext(kpi, null, { component_type: TRACKING_COMPONENT.DRAWER })
        );
        if (isEqual(JSON.stringify(selectedFiltersWidget?.selectedBrandCompetition), JSON.stringify(current))) {
            return;
        }

        const bid = [...new Set(current?.flatMap(i => i.value) ?? [])];
        // const bid = [...new Set(selectedFiltersWidget?.selectedBrand?.flatMap(i => i.value) ?? [])];
        const dateRangeData = { calendarType: selectedFilters?.calendarType, selectedDateRange: selectedFilters?.selectedDateRange, selectedWeeks: selectedFilters?.selectedWeeks };
        let combineFilterCompetitionWidget = await getCombineFilterCompetitionWidget("OSA", [], (bid ?? []), [], [], [], "", [], dateRangeData, filters, selectedFilters);

        setSelectedFiltersWidget(prevFilters => ({
            ...prevFilters,
            selectedBrandCompetition: current ?? [],
            selectedCategoryCompetition: combineFilterCompetitionWidget?.categories ?? [],
            selectedPlatformCompetition: combineFilterCompetitionWidget?.platforms ?? [],
        }));

        setFilters(prevFilters => ({
            ...prevFilters,
            ...(current?.length === 0 && {
                res_brand_competition:  combineFilterCompetitionWidget?.brands ?? [],
            }),
            res_products_competition: combineFilterCompetitionWidget?.products ?? [],
        }));

        if (typeof handleCheck === "function") {
            const allBrands = Array.isArray(filters?.res_brand_competition) ? filters.res_brand_competition : [];
            allBrands.forEach((brand) => {
                const isChecked = current.some((b) => b.value === brand.value);
                handleCheck("res_brand_competition", brand.value, !isChecked, brand.label, true);
            });
        }
    };

    const sortedBrands = useMemo(() => {
        const list = Array.isArray(filters?.res_brand_competition) ? filters.res_brand_competition : [];
        const searchInput = (brandSearch || searchTerm || "").trim();
        if (!searchInput) { return list; }

        const terms = searchInput.split(";").map((t) => t.trim()).filter(Boolean);
        if (terms.length === 0) { return list; }

        const regexes = terms.map((t) => new RegExp(escapeRegExp(t), "i"));
        const filteredList = list.filter((item) => regexes.some((regex) => regex.test(item.label || "")));

        const selectedValues = (localSelectedBrands || []).map((b) => b.value);
        const sortedList = [...filteredList].sort((a, b) => {
            const aSelected = selectedValues.includes(a.value);
            const bSelected = selectedValues.includes(b.value);
            if (aSelected === bSelected) return 0;
            return aSelected ? -1 : 1;
        });
        return sortedList;
    }, [filters?.res_brand_competition, searchTerm, brandSearch, localSelectedBrands]);

    const allVisibleSelected =
        sortedBrands.length > 0 &&
        sortedBrands.every((opt) =>
            (localSelectedBrands || []).some((sel) => sel.value === opt.value)
        );

    const someVisibleSelected =
        sortedBrands.some((opt) =>
            (localSelectedBrands || []).some((sel) => sel.value === opt.value)
        );

    const selectAllLabel = allVisibleSelected ? "Clear All" : "Select All";
    const showNoResults = sortedBrands.length === 0 && (brandSearch?.trim() || searchTerm?.trim());
    return (
        <>
            <div className="flex flex-col px-8 p-4 space-y-8">
                <div className="border-b border-gray-100 pb-6 last:border-0">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="flex font-semibold text-gray-900 text-base">Competition Brand
                            {
                                selectedFiltersWidget?.selectedBrandCompetition?.length > 0 ?
                                    <span className="ml-1 flex items-center justify-center w-5 h-5 text-[10px] rounded-full bg-[#F0F0F0]">{selectedFiltersWidget?.selectedBrandCompetition.length}</span>
                                    : <></>
                            }
                        </h3>
                        {sortedBrands?.length > 3 && (
                            <button
                                type="button"
                                className="text-gray-500 hover:text-gray-700"
                                onClick={() => handleToggle("brand")}
                            >
                                {expanded["brand"] ? <IoIosArrowUp size={20} /> : <IoIosArrowDown size={20} />}
                            </button>
                        )}
                    </div>
                    <div className="relative">
                        <input type="text" placeholder="Search Competition Brand..." className="w-[75%] px-[9px] py-[2px] pr-[24px] mb-[6px] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={brandSearch} onChange={(e) => setBrandSearch(e.target.value)}
                            onBlur={(e) => {
                                if (e.target.value?.trim()) {
                                    trackCustomEvent(
                                        EVENTS.SEARCH,
                                        { section: "brand_competition", search_term: e.target.value },
                                        ENTITY_TYPE.FILTER,
                                        getTrackerContext(kpi, null, { component_type: TRACKING_COMPONENT.DRAWER })
                                    );
                                }
                            }}
                        />
                        {brandSearch && (
                            <RxCross2
                                size={18}
                                className="absolute right-[5.4rem] top-[45%] -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer z-10"
                                onClick={() => {
                                    trackCustomEvent(
                                        EVENTS.CLEAR,
                                        { section: "brand_competition", action: "clear_search" },
                                        ENTITY_TYPE.FILTER,
                                        getTrackerContext(kpi, null, { component_type: TRACKING_COMPONENT.DRAWER })
                                    );
                                    setBrandSearch("");
                                }}
                            />
                        )}
                    </div>
                    {sortedBrands?.length > 0 && (
                        <div className="space-y-2">
                            <div className={`space-y-2 transition-all duration-300 ${expanded["brand"] ? "max-h-60 overflow-y-auto pr-2" : "max-h-[102px] overflow-hidden"}`} >
                                <label className="flex items-center font-bold gap-2 text-sm text-gray-700 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 text-blue-600 rounded"
                                        checked={allVisibleSelected}
                                        ref={(input) => {
                                            if (input) input.indeterminate = !allVisibleSelected && someVisibleSelected;
                                        }}
                                        onChange={() => {
                                            handleSelectAllUpdate(sortedBrands, allVisibleSelected)
                                        }}
                                    />

                                    {selectAllLabel}
                                </label>

                                {sortedBrands?.map((option, i) => {
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
                                                            handleCheck("BrandCompetitionFilterComponent", option.value, isChecked, option.label); // keep drawer state in sync // true - false, false->
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
                            No brands found...
                        </div>
                    )}
                    <div className="flex justify-between relative top-[8px]">
                        <button
                            type="button"
                            className="text-blue-500 text-sm font-medium mt-3 flex items-center"
                            onClick={() => handleToggle("brand")}
                        >
                            {expanded["brand"] ? "View Less" : "View More"}
                            <span className="ml-1">
                                {expanded["brand"] ? <IoIosArrowUp size={16} /> : <IoIosArrowDown size={16} />}
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

export default BrandCompetitionFilterComponent;
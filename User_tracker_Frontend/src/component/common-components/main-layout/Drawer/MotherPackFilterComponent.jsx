import React, { useState, useEffect, useMemo } from "react";
import { useEbuxContext } from "../../../Ebux/Context/EbuxProvider";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import { isEqual } from "lodash";
import { ENTITY_TYPE, EVENTS, getTrackerContext, trackCustomEvent, TRACKING_COMPONENT } from "../../../../tracker";
import { getCombineFilterWidget } from "../../../Ebux/services/ebux.service";
import { escapeRegExp } from "./DrawerHelper";



function MotherPackFilterComponent({ expanded, handleToggle, handleSelectAll, handleCheck, searchTerm }) {
    const {
        kpi,
        filters, selectedFilters,
        activeClientProject,
        selectedFiltersWidget,
        // updateSelectedMotherPack

        setSelectedFiltersWidget,
        setFilters,
        selectedMsl
    } = useEbuxContext();
    const [motherPackSearch, setMotherPackSearch] = useState("");

    const [localSelectedMotherPack, setLocalSelectedMotherPack] = useState(
        selectedFiltersWidget?.selectedMotherPack ? [...selectedFiltersWidget.selectedMotherPack] : []
    );

    useEffect(() => {
        setLocalSelectedMotherPack(
            selectedFiltersWidget?.selectedMotherPack ? [...selectedFiltersWidget.selectedMotherPack] : []
        );
    }, [selectedFiltersWidget?.selectedMotherPack]);

    const handleUpdate = (option, isChecked) => {
        let newProducts;
        if (isChecked) {
            newProducts = (localSelectedMotherPack || []).filter(
                (p) => p.value !== option.value
            );
        } else {
            newProducts = [...((localSelectedMotherPack || []) || []), option];
        }

        if (activeClientProject?.client_project_id == 2 && (kpi == "OSA" || kpi == "PRO" || kpi == "RR")) {
            setLocalSelectedMotherPack(newProducts);
        }
    };

    const handleSelectAllUpdate = (options, allSelected) => {
        trackCustomEvent(
            allSelected ? EVENTS.UNSELECT_ALL : EVENTS.SELECT_ALL,
            { section: "mother_pack", action: allSelected ? "unselect_all" : "select_all", count: options?.length },
            ENTITY_TYPE.FILTER,
            getTrackerContext(kpi, null, { component_type: TRACKING_COMPONENT.CHECKBOX })
        );
        let newItems = [];

        if (allSelected) {
            newItems = (localSelectedMotherPack || []).filter(
                (b) => !options.some((opt) => opt.value === b.value)
            );
        } else {
            const uniqueItems = [
                ...(localSelectedMotherPack || []),
                ...options.filter(
                    (opt) =>
                        !(localSelectedMotherPack || []).some(
                            (sel) => sel.value === opt.value
                        )
                ),
            ];
            newItems = uniqueItems;
        }
        if (activeClientProject?.client_project_id == 2 && (kpi == "OSA" || kpi == "PRO" || kpi == "RR")) {
            setLocalSelectedMotherPack(newItems);
        }
    };


    const handleClearAll = () => {
        trackCustomEvent(
            EVENTS.CLEAR_ALL,
            { section: "mother_pack" },
            ENTITY_TYPE.FILTER,
            getTrackerContext(kpi, null, { component_type: TRACKING_COMPONENT.DRAWER })
        );
        setLocalSelectedMotherPack([]);
        if (typeof handleSelectAll === "function") {
            handleSelectAll("mother_pack", []);
        }
    };

    const handleApplyClick = async () => {
        const current = localSelectedMotherPack || [];
        trackCustomEvent(
            EVENTS.APPLY,
            { section: "mother_pack", selected_count: current.length, selected: current.map(c => c.label || c.value) },
            ENTITY_TYPE.FILTER,
            getTrackerContext(kpi, null, { component_type: TRACKING_COMPONENT.DRAWER })
        );
        if (isEqual(JSON.stringify(selectedFiltersWidget?.selectedMotherPack), JSON.stringify(current))) {
            return;
        }

        if (activeClientProject?.client_project_id == 2 && (kpi == "OSA" || kpi == "PRO" || kpi == "RR")) {
            const tagSkuList = selectedFiltersWidget.selectedTags?.flatMap(tag => tag?.tag_details?.map(d => d?.sku_or_keyword) ?? []) ?? [];
            let combineFilterWidget;
            if (activeClientProject?.isFilterDateWise) {
                const dateRangeData = { calendarType: selectedFilters?.calendarType, selectedDateRange: selectedFilters?.selectedDateRange, selectedWeeks: selectedFilters?.selectedWeeks };
                combineFilterWidget = await getCombineFilterWidget("OSA", (selectedFiltersWidget.selectedPlatform?.flatMap(i => i?.id_in_db ?? i?.value) ?? []), (selectedFiltersWidget.selectedBrand?.flatMap(i => i?.id_in_db ?? i?.value) ?? []), (selectedFiltersWidget.selectedCategory?.flatMap(i => i?.id_in_db ?? i?.value) ?? []), (current?.flatMap(i => i?.id_in_db ?? i?.value) ?? []), (selectedFiltersWidget.selectedProductId?.flatMap(i => i?.id_in_db ?? i?.value) ?? []), (selectedFiltersWidget.selectedRange?.flatMap(i => i?.id_in_db ?? i?.value) ?? []), selectedMsl, (tagSkuList ?? []), dateRangeData);
            } else {
                combineFilterWidget = await getCombineFilterWidget("OSA", (selectedFiltersWidget.selectedPlatform?.flatMap(i => i?.id_in_db ?? i?.value) ?? []), (selectedFiltersWidget.selectedBrand?.flatMap(i => i?.id_in_db ?? i?.value) ?? []), (selectedFiltersWidget.selectedCategory?.flatMap(i => i?.id_in_db ?? i?.value) ?? []), (current?.flatMap(i => i?.id_in_db ?? i?.value) ?? []), (selectedFiltersWidget.selectedProductId?.flatMap(i => i?.id_in_db ?? i?.value) ?? []), (selectedFiltersWidget.selectedRange?.flatMap(i => i?.id_in_db ?? i?.value) ?? []), selectedMsl, (tagSkuList ?? []));
            }

            setFilters(prevFilters => ({
                ...prevFilters,
                platform: combineFilterWidget?.platforms ?? [],
                brand: combineFilterWidget?.brands ?? [],
                category: combineFilterWidget?.categories ?? [],
                products: combineFilterWidget?.products ?? [],
                ...((combineFilterWidget?.range) ? { range: combineFilterWidget?.range ?? [] } : {})
            }));

            setSelectedFiltersWidget(prevFilters => ({
                ...prevFilters,
                selectedMotherPack: current ?? []
            }));
        }
        // 
        if (typeof handleCheck === "function") {
            const allMotherPacks = Array.isArray(filters?.mother_pack) ? filters.mother_pack : [];
            allMotherPacks.forEach((mp) => {
                const isChecked = current.some((c) => c.value === mp.value);
                handleCheck("mother_pack", mp.value, !isChecked, mp.label, true);
            });
        }

    };

    const sortedMotherPack = useMemo(() => {
        const list = Array.isArray(filters?.mother_pack) ? filters.mother_pack : [];
        const searchInput = (motherPackSearch || searchTerm || "").trim();

        if (!searchInput) {
            return list;
        }

        const terms = searchInput.split(";").map((t) => t.trim()).filter(Boolean);
        if (terms.length === 0) return list;

        const regexes = terms.map((t) => new RegExp(escapeRegExp(t), "i"));
        const filteredList = list.filter((item) => regexes.some((regex) => regex.test(item.label || "")));
        const selectedValues = (localSelectedMotherPack || []).map((p) => p.value);
        const sortedList = [...filteredList].sort((a, b) => {
            const aSelected = selectedValues.includes(a.value);
            const bSelected = selectedValues.includes(b.value);
            if (aSelected === bSelected) return 0;
            return aSelected ? -1 : 1;
        });
        return sortedList;
    }, [filters?.mother_pack, searchTerm, motherPackSearch, localSelectedMotherPack]);


    const allVisibleSelected = sortedMotherPack.length > 0 && sortedMotherPack.every((opt) =>
        (localSelectedMotherPack || []).some((sel) => sel.value === opt.value)
    );

    const someVisibleSelected = sortedMotherPack.some((opt) =>
        (localSelectedMotherPack || []).some((sel) => sel.value === opt.value)
    );

    const selectAllLabel = allVisibleSelected ? "Clear All" : "Select All";
    const showNoResults = sortedMotherPack.length === 0 && (motherPackSearch?.trim() || searchTerm?.trim());
    return (
        <>
            <div className="flex flex-col px-8 p-4 space-y-8">
                <div className="border-b border-gray-100 pb-6 last:border-0">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="flex font-semibold text-gray-900 text-base">Mother Pack
                            {
                                selectedFiltersWidget?.selectedMotherPack?.length > 0 ?
                                    <span className="ml-1 flex items-center justify-center w-5 h-5 text-[10px] rounded-full bg-[#F0F0F0]">{selectedFiltersWidget?.selectedMotherPack.length}</span>
                                    : <></>
                            }
                        </h3>
                        {sortedMotherPack?.length > 3 && (
                            <button
                                type="button"
                                className="text-gray-500 hover:text-gray-700"
                                onClick={() => handleToggle("mother_pack")}
                            >
                                {expanded["mother_pack"] ? <IoIosArrowUp size={20} /> : <IoIosArrowDown size={20} />}
                            </button>
                        )}
                    </div>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search mother packs..."
                            className="w-[70%] px-[9px] py-[2px] pr-[24px] mb-[6px] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={motherPackSearch}
                            onChange={(e) => setMotherPackSearch(e.target.value)}
                            onBlur={(e) => {
                                if (e.target.value?.trim()) {
                                    trackCustomEvent(
                                        EVENTS.SEARCH,
                                        { section: "mother_pack", search_term: e.target.value },
                                        ENTITY_TYPE.FILTER,
                                        getTrackerContext(kpi, null, { component_type: TRACKING_COMPONENT.DRAWER })
                                    );
                                }
                            }}
                        />
                        {motherPackSearch && (
                            <RxCross2
                                size={18}
                                className="absolute right-[6.4rem] top-[45%] -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer z-10"
                                onClick={() => {
                                    trackCustomEvent(
                                        EVENTS.CLEAR,
                                        { section: "mother_pack", action: "clear_search" },
                                        ENTITY_TYPE.FILTER,
                                        getTrackerContext(kpi, null, { component_type: TRACKING_COMPONENT.DRAWER })
                                    );
                                    setMotherPackSearch("");
                                }}
                            />
                        )}
                    </div>
                    {sortedMotherPack?.length > 0 && (
                        <div className="space-y-2">
                            <div className={`space-y-2 transition-all duration-300 ${expanded["mother_pack"] ? "max-h-60 overflow-y-auto pr-2" : "max-h-[102px] overflow-hidden"}`} >

                                <label className="flex items-center font-bold gap-2 text-sm text-gray-700 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 text-blue-600 rounded"
                                        checked={allVisibleSelected}
                                        ref={(input) => {
                                            if (input) input.indeterminate = !allVisibleSelected && someVisibleSelected;
                                        }}
                                        onChange={() => {
                                            handleSelectAllUpdate(sortedMotherPack, allVisibleSelected)
                                        }}
                                    />
                                    {selectAllLabel}
                                </label>


                                {sortedMotherPack?.map((option, i) => {
                                    const isChecked = (localSelectedMotherPack || []).some(
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
                                                            handleCheck("mother_pack", option.value, isChecked, option.label); // keep drawer state in sync
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
                            No mother packs found...
                        </div>
                    )}
                    <div className="flex justify-between relative top-[8px]">
                        <button
                            type="button"
                            className="text-blue-500 text-sm font-medium mt-3 flex items-center"
                            onClick={() => handleToggle("mother_pack")}
                        >
                            {expanded["mother_pack"] ? "View Less" : "View More"}
                            <span className="ml-1">
                                {expanded["mother_pack"] ? <IoIosArrowUp size={16} /> : <IoIosArrowDown size={16} />}
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

export default MotherPackFilterComponent;
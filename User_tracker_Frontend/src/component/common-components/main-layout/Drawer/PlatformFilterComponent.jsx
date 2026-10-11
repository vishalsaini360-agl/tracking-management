import React, { useState, useEffect, useMemo } from "react";
import { useEbuxContext } from "../../../Ebux/Context/EbuxProvider";
import { escapeRegExp } from "./DrawerHelper";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import { isEqual } from "lodash";
import { ENTITY_TYPE, EVENTS, getTrackerContext, trackCustomEvent, TRACKING_COMPONENT } from "../../../../tracker";
import { getEbuxLocationsNew } from "../../../Ebux/services/ebux.service";
import { fetchGlobalViewCombineFiltersPdpKw, getEbuxLocationsGlobalView } from "../../../Ebux/ds2.0/global-view/services/service";


function PlatformFilterComponent({ expanded, handleToggle, handleSelectAll,
    searchTerm
}) {
    const {
        kpi,
        filters,
        selectedFilters,
        activeClientProject,
        selectedFiltersWidget,
        // updateSelectedProductAndLocationofPlatform
        updateSelectedProductAndLocationofPlatformWidget,
        getDistinctFiltersSomFn,

        setIsDarkstoreFilter,
        getPincodesfromLocation,
        setFilters,

        setSelectedFiltersWidget
    } = useEbuxContext();
    const [platformSearch, setPlatformSearch] = useState("");
    const [localSelectedPlatforms, setLocalSelectedPlatforms] = useState(
        selectedFiltersWidget?.selectedPlatform ? [...selectedFiltersWidget.selectedPlatform] : []
    );

    useEffect(() => {
        setLocalSelectedPlatforms(
            selectedFiltersWidget?.selectedPlatform?.length ? [...selectedFiltersWidget.selectedPlatform] : []
        );
    }, [selectedFiltersWidget?.selectedPlatform, JSON.stringify(filters?.platform)]);

    useEffect(() => {
        if (!selectedFiltersWidget?.selectedPlatform?.length) {
            return;
        }
        async function fetchData() {
            let locationPlatform;
            if (kpi == "GLOBALVIEW") {
                locationPlatform = await getEbuxLocationsGlobalView(kpi, (selectedFiltersWidget.selectedPlatform?.map(i => i.pf_id_in_db) ?? []));
            } else {
                if (activeClientProject?.isFilterDateWise) {
                    const dateRangeData = { calendarType: selectedFilters?.calendarType, selectedDateRange: selectedFilters?.selectedDateRange, selectedWeeks: selectedFilters?.selectedWeeks };
                    locationPlatform = await getEbuxLocationsNew(kpi, (selectedFiltersWidget.selectedPlatform?.map(i => i.value) ?? []), (selectedFilters?.active_location_status), dateRangeData);
                } else {
                    locationPlatform = await getEbuxLocationsNew(kpi, (selectedFiltersWidget.selectedPlatform?.map(i => i.value) ?? []), (selectedFilters?.active_location_status));
                }
            }

            let pincodePlatform = getPincodesfromLocation(locationPlatform);
            setFilters((prevFilters) => {
                const updatedFilters = {
                    ...prevFilters,
                    location: locationPlatform ?? [],
                    locationPincode: pincodePlatform ?? [],
                };
                return updatedFilters;
            });
        }
        fetchData();
    }, [
        selectedFiltersWidget?.selectedPlatform,
        JSON.stringify(filters?.platform)
    ]);


    useEffect(() => {
        // console.log('platform call local', localSelectedPlatforms)
    }, [localSelectedPlatforms]);

    const handleUpdate = (option, isChecked) => {
        trackCustomEvent(
            EVENTS.CHECKBOX,
            { section: "platform", value: option.value, item: option.label, label: option.label, checked: !isChecked },
            ENTITY_TYPE.FILTER,
            getTrackerContext(kpi, null, { component_type: TRACKING_COMPONENT.CHECKBOX })
        );
        let newProducts;
        if (isChecked) {
            newProducts = (localSelectedPlatforms || []).filter(
                (p) => p.value !== option.value
            );
        } else {
            newProducts = [...((localSelectedPlatforms || []) || []), option];
        }
        setLocalSelectedPlatforms(newProducts);
    };


    const handleSelectAllUpdate = (options, allSelected) => {
        trackCustomEvent(
            allSelected ? EVENTS.UNSELECT_ALL : EVENTS.SELECT_ALL,
            { section: "platform", action: allSelected ? "unselect_all" : "select_all", count: options?.length },
            ENTITY_TYPE.FILTER,
            getTrackerContext(kpi, null, { component_type: TRACKING_COMPONENT.CHECKBOX })
        );
        let newItems = [];
        if (allSelected) {
            newItems = (localSelectedPlatforms || []).filter(
                (b) => !options.some((opt) => opt.value === b.value)
            );
        } else {
            const uniqueItems = [
                ...(localSelectedPlatforms || []),
                ...options.filter(
                    (opt) =>
                        !(localSelectedPlatforms || []).some(
                            (sel) => sel.value === opt.value
                        )
                ),
            ];
            newItems = uniqueItems;
        }
        setLocalSelectedPlatforms(newItems);
    };

    const handleClearAll = () => {
        trackCustomEvent(
            EVENTS.CLEAR_ALL,
            { section: "platform" },
            ENTITY_TYPE.FILTER,
            getTrackerContext(kpi, null, { component_type: TRACKING_COMPONENT.DRAWER })
        );
        setIsDarkstoreFilter(null)
        setLocalSelectedPlatforms([]);
        if (typeof handleSelectAll === "function") {
            handleSelectAll("platform", []);
        }

    };

    const handleApplyClick = async () => {
        // console.log('kpiiiiiiiii', kpi)
        setIsDarkstoreFilter("pdp")
        const current = localSelectedPlatforms || [];
        trackCustomEvent(
            EVENTS.APPLY,
            { section: "platform", selected_count: current.length, selected: current.map(c => c.label || c.value) },
            ENTITY_TYPE.FILTER,
            getTrackerContext(kpi, null, { component_type: TRACKING_COMPONENT.DRAWER })
        );
        if (isEqual(JSON.stringify(selectedFiltersWidget?.selectedPlatform), JSON.stringify(current))) {
            return;
        }
        if (kpi == "GLOBALVIEW") {
            const bid = [...new Set(current?.flatMap(i => i.value) ?? [])];
            // console.log('currentcurrentcurrent', bid)
            let combineFilterWidget = {}
            if (activeClientProject?.isFilterDateWise) {
                const dateRangeData = { calendarType: selectedFilters?.calendarType, selectedDateRange: selectedFilters?.selectedDateRange, selectedWeeks: selectedFilters?.selectedWeeks };
                combineFilterWidget = await fetchGlobalViewCombineFiltersPdpKw("GLOBALVIEW", (bid ?? []), (selectedFiltersWidget.selectedBrand?.flatMap(i => i.id_in_db) ?? []), (selectedFiltersWidget.selectedCategory?.flatMap(i => i.id_in_db) ?? []), dateRangeData);
            } else {
                combineFilterWidget = await fetchGlobalViewCombineFiltersPdpKw("GLOBALVIEW", (bid ?? []), (selectedFiltersWidget.selectedBrand?.flatMap(i => i.id_in_db) ?? []), (selectedFiltersWidget.selectedCategory?.flatMap(i => i.id_in_db) ?? []));
            }
            setSelectedFiltersWidget(prevFilters => ({
                ...prevFilters,
                selectedPlatform: combineFilterWidget?.platforms ?? [],
            }));

            setFilters(prevFilters => ({
                ...prevFilters,
                ...(current?.length === 0 && {
                    platform: combineFilterWidget?.brands ?? [],
                }),
                brand: combineFilterWidget?.brands ?? [],
                category: combineFilterWidget?.categories ?? [],
            }));
        } else {
            // console.log('checkinggggggg')
            if (kpi === "SOM") {
                getDistinctFiltersSomFn("platform", current);
            } else {
                updateSelectedProductAndLocationofPlatformWidget(current);
            }
        }
    };


    const sortedPlatform = useMemo(() => {
        const list = Array.isArray(filters?.platform) ? filters.platform : [];
        const searchInput = (platformSearch || searchTerm || "").trim();
        if (!searchInput) { return list; }

        const safe = escapeRegExp(searchInput);
        const regex = new RegExp(safe, "i");
        const filteredList = list.filter((item) => regex.test(item.label));

        const selectedValues = (localSelectedPlatforms || []).map((p) => p.value);
        const sortedList = [...filteredList].sort((a, b) => {
            const aSelected = selectedValues.includes(a.value);
            const bSelected = selectedValues.includes(b.value);
            if (aSelected === bSelected) return 0;
            return aSelected ? -1 : 1;
        });
        return sortedList;
    }, [filters?.platform, platformSearch, searchTerm, localSelectedPlatforms]);

    const allVisibleSelected =
        sortedPlatform.length > 0 &&
        sortedPlatform.every((opt) =>
            (localSelectedPlatforms || []).some((sel) => sel.value === opt.value)
        );

    const someVisibleSelected =
        sortedPlatform.some((opt) =>
            (localSelectedPlatforms || []).some((sel) => sel.value === opt.value)
        );

    const selectAllLabel = allVisibleSelected ? "Clear All" : "Select All";
    const showNoResults = sortedPlatform.length === 0 && (platformSearch?.trim() || searchTerm?.trim());
    return (
        <>

            <div className="flex flex-col px-8 p-4 space-y-8">
                {/* <div className=" overflow-y-auto px-8 p-4 space-y-8"> */}
                <div className="border-b border-gray-100 pb-6 last:border-0">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="flex font-semibold text-gray-900 text-base">Platform
                            {
                                localSelectedPlatforms?.length > 0 ?
                                    <span className="ml-1 flex items-center justify-center w-5 h-5 text-[10px] rounded-full bg-[#F0F0F0]">{localSelectedPlatforms.length}</span>
                                    : <></>
                            }
                        </h3>

                        {sortedPlatform?.length > 3 && (
                            <button
                                type="button"
                                className="text-gray-500 hover:text-gray-700"
                                onClick={() => handleToggle("platform")}
                            >
                                {expanded["platform"] ? <IoIosArrowUp size={20} /> : <IoIosArrowDown size={20} />}
                            </button>
                        )}
                    </div>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search platforms..."
                            className="w-[70%] px-[9px] py-[2px] pr-[24px] mb-[6px] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={platformSearch}
                            onChange={(e) => setPlatformSearch(e.target.value)}
                            onBlur={(e) => {
                                if (e.target.value?.trim()) {
                                    trackCustomEvent(
                                        EVENTS.SEARCH,
                                        { section: "platform", search_term: e.target.value },
                                        ENTITY_TYPE.FILTER,
                                        getTrackerContext(kpi, null, { component_type: TRACKING_COMPONENT.DRAWER })
                                    );
                                }
                            }}
                        />
                        {platformSearch && (
                            <RxCross2
                                size={18}
                                className="absolute right-[6.4rem] top-[45%] -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer z-10"
                                onClick={() => {
                                    trackCustomEvent(
                                        EVENTS.CLEAR,
                                        { section: "platform", action: "clear_search" },
                                        ENTITY_TYPE.FILTER,
                                        getTrackerContext(kpi, null, { component_type: TRACKING_COMPONENT.DRAWER })
                                    );
                                    setPlatformSearch("");
                                }}
                            />
                        )}
                    </div>
                    {sortedPlatform?.length > 0 && (
                        <div className="space-y-2">
                            <div className={`space-y-2 transition-all duration-300 ${expanded["platform"] ? "max-h-60 overflow-y-auto pr-2" : "max-h-[102px] overflow-hidden"}`} >

                                <label className="flex items-center font-bold gap-2 text-sm text-gray-700 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 text-blue-600 rounded"
                                        checked={allVisibleSelected}
                                        ref={(input) => {
                                            if (input) input.indeterminate = !allVisibleSelected && someVisibleSelected;
                                        }}
                                        onChange={() => {
                                            handleSelectAllUpdate(sortedPlatform, allVisibleSelected)
                                        }}
                                    />
                                    {selectAllLabel}
                                </label>

                                {sortedPlatform?.map((option, i) => {

                                    const isChecked = (localSelectedPlatforms || []).some(
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
                                                        }}
                                                    />
                                                </span>
                                                {option?.platform_description && <img src={option?.platform_description} className="oos-plat-img max-w-6 max-h-6 object-contain" />}

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
                            No platforms found...
                        </div>
                    )}

                    <div className="flex justify-between relative top-[8px]">
                        <button
                            type="button"
                            className="text-blue-500 text-sm font-medium mt-3 flex items-center"
                            onClick={() => handleToggle("platform")}
                        >
                            {expanded["platform"] ? "View Less" : "View More"}
                            <span className="ml-1">
                                {expanded["platform"] ? <IoIosArrowUp size={16} /> : <IoIosArrowDown size={16} />}
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

export default PlatformFilterComponent;
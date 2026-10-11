import React, { useMemo } from "react";
import { useEbuxContext } from "../../../Ebux/Context/EbuxProvider";
import { isOptionChecked } from "./DrawerHelper";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { useLayoutEffect } from "react";
import { getEbuxLocationsNew, getEbuxLocationsNewDarkStore } from "../../../Ebux/services/ebux.service";
import { ENTITY_TYPE, EVENTS, getTrackerContext, trackCustomEvent, TRACKING_COMPONENT } from "../../../../tracker";

let list = [
    { value: 1, label: "Active" }
    ,
    { value: 0, label: "In Active" }
];
function DarkstoreStatusFilter({ expanded, handleToggle, handleSelectAll,
    handleCheck, searchTerm
}) {
    const {
        kpi,
        selectedFilters,
        activeClientProject,
        selectedFiltersWidget,
        updateSelectedFilters,
        setFiltersDarkStore,
        getPincodesfromLocation,
        setFilters

    } = useEbuxContext();

    useLayoutEffect(() => {
        if ((!(kpi === "SOS" || kpi === "OR" || kpi === "Wt_SOS")) && (activeClientProject?.isUseInActiveDarkstore)) {
            let d = selectedFiltersWidget?.active_location_status;
            if (d == undefined || !Array.isArray(d)) {
                updateSelectedFilters("active_location_status", [list[0]]);
            }
        }
    }, [])

    const fetchDataDarkStore = async (d = []) => {
        let locationPlatform;
        if (activeClientProject?.isFilterDateWise) {
            const dateRangeData = { d, calendarType: selectedFilters?.calendarType, selectedDateRange: selectedFilters?.selectedDateRange, selectedWeeks: selectedFilters?.selectedWeeks };
            locationPlatform = await getEbuxLocationsNewDarkStore("OSA", (selectedFiltersWidget.selectedPlatform?.map(i => i.value) ?? []), (selectedFilters?.active_location_status), dateRangeData);
        } else {
            locationPlatform = await getEbuxLocationsNewDarkStore("OSA", (selectedFiltersWidget.selectedPlatform?.map(i => i.value) ?? []), (selectedFilters?.active_location_status));
        }


        let pincodePlatform = getPincodesfromLocation(locationPlatform);
        setFiltersDarkStore((prevFilters) => {
            const updatedFilters = {
                ...prevFilters,
                location: locationPlatform ?? [],
                locationPincode: pincodePlatform ?? [],
            };
            return updatedFilters;
        });
    }
    const fetchData6P = async (d = []) => {
        let locationPlatform;
        if (activeClientProject?.isFilterDateWise) {
            const dateRangeData = { d, calendarType: selectedFilters?.calendarType, selectedDateRange: selectedFilters?.selectedDateRange, selectedWeeks: selectedFilters?.selectedWeeks };
            locationPlatform = await getEbuxLocationsNew(kpi, (selectedFiltersWidget.selectedPlatform?.map(i => i.value) ?? []), selectedFilters?.active_location_status, dateRangeData);
        } else {
            locationPlatform = await getEbuxLocationsNew(kpi, (selectedFiltersWidget.selectedPlatform?.map(i => i.value) ?? []), selectedFilters?.active_location_status);
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

    const handleUpdate = (option, isChecked) => {
        let newProducts;
        if (isChecked) {
            newProducts = selectedFiltersWidget?.active_location_status.filter(
                (p) => p.value != option.value
            );
        } else {
            newProducts = [...(selectedFiltersWidget?.active_location_status || []), option];
        }
        if ((!(kpi === "SOS" || kpi === "OR" || kpi === "Wt_SOS")) && (activeClientProject?.isUseInActiveDarkstore)) {
            let d = newProducts;
            if (d == undefined || !Array.isArray(d)) {
                return;
            } else if (Array.isArray(d) && !d?.length) {
                d = list;
            }
            fetchData6P(d);
            if ((activeClientProject?.isUseWidgetDarkstore)) {
                fetchDataDarkStore(d);
            }
        }
        updateSelectedFilters("active_location_status", newProducts);
    };


    const handleSelectAllUpdate = (options, allSelected) => {
        let newItems = [];

        if (allSelected) {
            newItems = selectedFiltersWidget.active_location_status.filter(
                (b) => !options.some((opt) => opt.value === b.value)
            );
        } else {
            const uniqueItems = [
                ...selectedFiltersWidget.active_location_status,
                ...options.filter(
                    (opt) =>
                        !selectedFiltersWidget.active_location_status.some(
                            (sel) => sel.value === opt.value
                        )
                ),
            ];
            newItems = uniqueItems;
        }
        if ((!(kpi === "SOS" || kpi === "OR" || kpi === "Wt_SOS")) && (activeClientProject?.isUseInActiveDarkstore)) {
            fetchData6P(list);
            if ((activeClientProject?.isUseWidgetDarkstore)) {
                fetchDataDarkStore(list);
            }
        }
        updateSelectedFilters("active_location_status", newItems);
    };

    const sortedMotherPack = useMemo(() => {
        const filteredList = searchTerm
            ? list.filter((b) =>
                b.label.toLowerCase().includes(searchTerm.toLowerCase())
            )
            : list;
        return [...filteredList].sort((a, b) => {
            const aChecked = selectedFiltersWidget?.active_location_status?.some((sel) => sel.value === a.value);
            const bChecked = selectedFiltersWidget?.active_location_status?.some((sel) => sel.value === b.value);
            if (aChecked === bChecked) return 0;
            return aChecked ? -1 : 1;
        });
    }, [searchTerm]);
    const allVisibleSelected =
        sortedMotherPack.length > 0 &&
        sortedMotherPack.every((opt) =>
            isOptionChecked("active_darkstore_location_status", opt, selectedFiltersWidget)
        );

    const someVisibleSelected =
        sortedMotherPack.some((opt) =>
            isOptionChecked("active_darkstore_location_status", opt, selectedFiltersWidget)
        );
    return (
        <>
            {sortedMotherPack?.length > 0 && (
                <div className="flex flex-col px-8 p-4 space-y-8">
                    <div className="border-b border-gray-100 pb-6 last:border-0">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-gray-900 text-base">Dark Store Status</h3>
                            {sortedMotherPack?.length > 3 && (
                                <button
                                    type="button"
                                    className="text-gray-500 hover:text-gray-700"
                                    onClick={() => handleToggle("active_darkstore_location_status")}
                                >
                                    {expanded["active_darkstore_location_status"] ? <IoIosArrowUp size={20} /> : <IoIosArrowDown size={20} />}
                                </button>
                            )}
                        </div>

                        <div className="space-y-2">
                            <div className={`space-y-2 transition-all duration-300 ${expanded["active_darkstore_location_status"] ? "max-h-60 overflow-y-auto pr-2" : "max-h-[102px] overflow-hidden"}`} >

                                <label className="flex items-center font-bold gap-2 text-sm text-gray-700 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 text-blue-600 rounded"

                                        checked={allVisibleSelected}
                                        ref={(input) => {
                                            if (input) input.indeterminate = !allVisibleSelected && someVisibleSelected;
                                        }}
                                        onChange={() => {
                                            trackCustomEvent(
                                                allVisibleSelected ? EVENTS.UNSELECT_ALL : EVENTS.SELECT_ALL,
                                                {
                                                    section: "darkstore_status",
                                                    action: allVisibleSelected ? "unselect_all" : "select_all",
                                                    count: sortedMotherPack?.length
                                                },
                                                ENTITY_TYPE.FILTER,
                                                getTrackerContext(kpi, null, { component_type: TRACKING_COMPONENT.CHECKBOX })
                                            );
                                            handleSelectAllUpdate(sortedMotherPack, allVisibleSelected)
                                            handleSelectAll("active_darkstore_location_status", sortedMotherPack);
                                        }}
                                    />
                                    Select All
                                </label>


                                {sortedMotherPack?.map((option, i) => {

                                    const isChecked = isOptionChecked("active_darkstore_location_status", option, selectedFiltersWidget);
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
                                                            handleCheck("active_darkstore_location_status", option.value, isChecked, option.label); // keep drawer state in sync
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

                        {sortedMotherPack?.length > 3 && (
                            <button
                                type="button"
                                className="text-blue-500 text-sm font-medium mt-3 flex items-center"
                                onClick={() => {
                                    trackCustomEvent(
                                        expanded["active_darkstore_location_status"] ? EVENTS.VIEW_LESS : EVENTS.VIEW_MORE,
                                        { section: "darkstore_status" },
                                        ENTITY_TYPE.FILTER,
                                        getTrackerContext(kpi, null, { component_type: TRACKING_COMPONENT.DRAWER })
                                    );
                                    handleToggle("active_darkstore_location_status");
                                }}
                            >
                                {expanded["active_darkstore_location_status"] ? "View Less" : "View More"}
                                <span className="ml-1">
                                    {expanded["active_darkstore_location_status"] ? <IoIosArrowUp size={16} /> : <IoIosArrowDown size={16} />}
                                </span>
                            </button>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}

export default DarkstoreStatusFilter;
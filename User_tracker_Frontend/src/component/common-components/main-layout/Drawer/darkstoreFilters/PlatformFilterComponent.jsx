import React, { useState, useEffect, useMemo } from "react";
import { useEbuxContext } from "../../../../Ebux/Context/EbuxProvider";
import { escapeRegExp } from "../DrawerHelper";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
// import { isEqual } from "lodash";
import { getEbuxLocationsNewDarkStore } from "../../../../Ebux/services/ebux.service";


function PlatformFilterComponent({ expanded, handleToggle, handleSelectAll,
    handleCheck, searchTerm
}) {
    // console.log('sectionsection222', section)
    const {
        // kpi,
        filtersDarkStore,
        selectedFilters,
        activeClientProject,
        selectedFiltersWidget,
        // updateSelectedProductAndLocationofPlatform
        getDistinctFiltersDarkStoreFn,
        setIsDarkstoreFilter,
        setFiltersDarkStore,
        getPincodesfromLocation

    } = useEbuxContext();
    // console.log('filtersfiltersfilters11', filtersDarkStore?.platform)
    const [platformSearch, setPlatformSearch] = useState("");


    const [localSelectedBrands, setLocalSelectedBrands] = useState(() => {
        const init = selectedFiltersWidget?.selectedPlatform ?? [];
        return init.map(item => (typeof item === 'object' ? item : { value: item, label: String(item) }));
    });

    useEffect(() => {
        const platforms = filtersDarkStore?.platform ?? [];
        const selectedFromWidget = (selectedFiltersWidget?.selectedPlatform ?? []).map(item =>
            typeof item === 'object' ? item : { value: item, label: String(item) }
        );

        const selectedValuesSet = new Set(selectedFromWidget.map(s => s.value));

        const filtered = platforms
            .map(item => (typeof item === 'object' ? item : { value: item, label: String(item) }))
            .filter(p => selectedValuesSet.has(p.value));

        const newLocal = filtered.length > 0 ? filtered : selectedFromWidget;

        const isSame =
            newLocal.length === localSelectedBrands.length &&
            newLocal.every((x, i) => x.value === localSelectedBrands[i].value);

        if (!isSame) {
            setLocalSelectedBrands(newLocal);
        }
    }, [selectedFiltersWidget?.selectedPlatform, filtersDarkStore?.platform]);


    useEffect(() => {
        if (!selectedFiltersWidget?.selectedPlatform?.length) {
            return;
        }
        async function fetchData() {

            let locationPlatform;
            if (activeClientProject?.isFilterDateWise) {
                const dateRangeData = { calendarType: selectedFilters?.calendarType, selectedDateRange: selectedFilters?.selectedDateRange, selectedWeeks: selectedFilters?.selectedWeeks };
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
        fetchData();
    }, [
        selectedFiltersWidget?.selectedPlatform,
        JSON.stringify(filtersDarkStore?.platform)
    ]);


    const handleUpdate = (option, isChecked) => {
        let newProducts;
        // console.log('option.value',option.value)
        if (isChecked) {
            newProducts = (localSelectedBrands || []).filter(
                (p) => p.value !== option.value
            );
        } else {
            newProducts = [...((localSelectedBrands || []) || []), option];
        }

        // console.log('platformplatformplatformplatform', newProducts)

        // getDistinctFiltersDarkStoreFn('platform', newProducts)
        setLocalSelectedBrands(newProducts);
    };


    const handleSelectAllUpdate = (options, allSelected) => {
        let newItems = [];

        if (allSelected) {
            // Unselect visible items only
            newItems = (localSelectedBrands || []).filter(
                (b) => !options.some((opt) => opt.value === b.value)
            );
        } else {
            // Add all visible items, avoiding duplicates
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

        // getDistinctFiltersDarkStoreFn('platform', newItems);
        setLocalSelectedBrands(newItems);
    };

    const handleClearAll = () => {
        setIsDarkstoreFilter(null)
        setLocalSelectedBrands([]);
        if (typeof handleSelectAll === "function") {
            handleSelectAll("platform", []);
        }

        // if (typeof handleCancel === "function") {
        //     handleCancel();
        // }
    };

    // Commit local selection to darkstore context
    const handleApplyClick = () => {
        // console.log('called...')
        setIsDarkstoreFilter("darkstore")
        const current = localSelectedBrands || [];
        // if(isEqual(JSON.stringify(selectedFiltersWidget?.selectedPlatform),JSON.stringify(current))){
        //     return; 
        // }

        // commit to darkstore distinct filter fn
        if (typeof getDistinctFiltersDarkStoreFn === "function") {
            getDistinctFiltersDarkStoreFn("platform", current);
        }

        // keep drawer checked state in sync for all options (set checked = true for selected)
        if (typeof handleCheck === "function") {
            const allOptions = Array.isArray(filtersDarkStore?.platform) ? filtersDarkStore.platform : [];
            allOptions.forEach((opt) => {
                const isChecked = current.some((c) => c.value === opt.value);
                // pass the current checked state (true if selected)
                handleCheck("platform", opt.value, isChecked);
            });
        }

    };


    const sortedMotherPack = useMemo(() => {
        const list = Array.isArray(filtersDarkStore?.platform) ? filtersDarkStore.platform : [];
        const searchInput = (platformSearch || searchTerm || "").trim();
        if (!searchInput) return list;

        const safe = escapeRegExp(searchInput);
        const regex = new RegExp(safe, "i");
        const filteredList = list.filter((item) => regex.test(item.label));

        const selectedValues = (localSelectedBrands || []).map((p) => p.value);
        const sortedList = [...filteredList].sort((a, b) => {
            const aSelected = selectedValues.includes(a.value);
            const bSelected = selectedValues.includes(b.value);
            if (aSelected === bSelected) return 0;
            return aSelected ? -1 : 1;
        });

        return sortedList;
    }, [filtersDarkStore?.platform, platformSearch, searchTerm, localSelectedBrands]);


    const allVisibleSelected =
        sortedMotherPack.length > 0 &&
        sortedMotherPack.every((opt) =>
            // isOptionChecked("platform", opt, selectedFiltersWidget)
            (localSelectedBrands || []).some((sel) => sel.value === opt.value)
        );

    const someVisibleSelected =
        sortedMotherPack.some((opt) =>
            // isOptionChecked("platform", opt, selectedFiltersWidget)
            (localSelectedBrands || []).some((sel) => sel.value === opt.value)
        );

    const selectAllLabel = allVisibleSelected ? "Clear All" : "Select All";
    const showNoResults = sortedMotherPack.length === 0 && (platformSearch?.trim() || searchTerm?.trim());
    return (
        <>

            <div className="flex flex-col px-8 p-4 space-y-8">
                {/* <div className=" overflow-y-auto px-8 p-4 space-y-8"> */}
                <div className="border-b border-gray-100 pb-6 last:border-0">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="flex font-semibold text-gray-900 text-base">Platform
                            {
                                localSelectedBrands?.length > 0 ?
                                    <span className="ml-1 flex items-center justify-center w-5 h-5 text-[10px] rounded-full bg-[#F0F0F0]">{localSelectedBrands?.length}</span>
                                    : <></>
                            }
                        </h3>
                        {sortedMotherPack?.length > 3 && (
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
                        />
                        {platformSearch && (
                            <RxCross2
                                size={18}
                                className="absolute right-[6.4rem] top-[45%] -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer z-10"
                                onClick={() => setPlatformSearch("")}
                            />
                        )}
                    </div>
                    {sortedMotherPack?.length > 0 && (
                        <div className="space-y-2">
                            <div className={`space-y-2 transition-all duration-300 ${expanded["platform"] ? "max-h-60 overflow-y-auto pr-2" : "max-h-[102px] overflow-hidden"}`} >

                                <label className="flex items-center font-bold gap-2 text-sm text-gray-700 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 text-blue-600 rounded"
                                        // checked={isOptionChecked("platform", filters?.platform, selectedFiltersWidget?.selectedCategory)}
                                        // onChange={() => {
                                        //     const allSelected = filters?.platform.every((opt) =>
                                        //         isOptionChecked("platform", opt, selectedFiltersWidget)
                                        //     );
                                        //     handleSelectAllUpdate(filters?.platform, allSelected);
                                        //     handleSelectAll("platform", filters?.platform);
                                        // }}

                                        // checked={sortedMotherPack.every((opt) =>
                                        //     isOptionChecked("platform", opt, selectedFiltersWidget)
                                        // )}
                                        checked={allVisibleSelected}
                                        ref={(input) => {
                                            if (input) input.indeterminate = !allVisibleSelected && someVisibleSelected;
                                        }}
                                        onChange={() => {
                                            handleSelectAllUpdate(sortedMotherPack, allVisibleSelected)
                                            // handleSelectAll("platform", sortedMotherPack);
                                        }}
                                    />
                                    {selectAllLabel}
                                </label>

                                {sortedMotherPack?.map((option, i) => {
                                    const isChecked = (localSelectedBrands || []).some(
                                        (sel) => sel.value === option.value
                                    );
                                    // const isChecked = isOptionChecked("platform", option, selectedFiltersWidget);
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
                                                            handleCheck("platform", option.value, isChecked); // keep drawer state in sync
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
                            No platforms found...
                        </div>
                    )}
                    {/* {sortedMotherPack?.length > 2 && ( */}
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
                    {/* )} */}
                </div>
            </div>

        </>
    );
}

export default PlatformFilterComponent;
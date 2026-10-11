import React, { useState, useEffect, useMemo } from "react";
import { useEbuxContext } from "../../../../Ebux/Context/EbuxProvider";
import { escapeRegExp } from "../DrawerHelper";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import { isEqual } from "lodash";

function MotherPackFilterComponent({ expanded, handleToggle, handleSelectAll,
    handleCheck, searchTerm
}) {
    // console.log('sectionsection222', section)
    const {
        kpi,
        filtersDarkStore,
        activeClientProject,
        selectedFiltersWidget,
        // updateSelectedMotherPackDarkStore
        getDistinctFiltersDarkStoreFn

    } = useEbuxContext();
    // console.log('filtersfiltersfilters11', filters)
    const [motherPackSearch, setMotherPackSearch] = useState("");


    const [localSelectedBrands, setLocalSelectedBrands] = useState(
        selectedFiltersWidget?.selectedMotherPack ? [...selectedFiltersWidget.selectedMotherPack] : []
    );

    useEffect(() => {
        setLocalSelectedBrands(
            selectedFiltersWidget?.selectedMotherPack ? [...selectedFiltersWidget.selectedMotherPack] : []
        );
    }, [selectedFiltersWidget?.selectedMotherPack]);


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
        // console.log('platformplatformplatformplatformnewProducts', newProducts)

        if (activeClientProject?.client_project_id == 2 && (kpi == "OSA" || kpi == "PRO" || kpi == "RR")) {
            // getDistinctFiltersDarkStoreFn('mother_pack', newProducts)
            setLocalSelectedBrands(newProducts);
        }

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
        if (activeClientProject?.client_project_id == 2 && (kpi == "OSA" || kpi == "PRO" || kpi == "RR")) {
            // getDistinctFiltersDarkStoreFn('mother_pack', newItems);
            setLocalSelectedBrands(newItems);
        }
    };

    const handleClearAll = () => {
        setLocalSelectedBrands([]);
        if (typeof handleSelectAll === "function") {
            handleSelectAll("mother_pack", []);
        }

    };

    // Commit local selection to darkstore distinct filters API
    const handleApplyClick = () => {
        const current = localSelectedBrands || [];
        if (isEqual(JSON.stringify(selectedFiltersWidget?.selectedMotherPack), JSON.stringify(current))) {
            return;
        }

        if (
            activeClientProject?.client_project_id == 2 &&
            (kpi == "OSA" || kpi == "PRO" || kpi == "RR")
        ) {
            if (typeof getDistinctFiltersDarkStoreFn === "function") {
                getDistinctFiltersDarkStoreFn("mother_pack", current);
            }
        } else {
            // If you have other behaviour for non-client 2, keep or change as needed
            if (typeof getDistinctFiltersDarkStoreFn === "function") {
                getDistinctFiltersDarkStoreFn("mother_pack", current);
            }
        }

        // sync drawer checked state for all options (true if selected)
        if (typeof handleCheck === "function") {
            const allOptions = Array.isArray(filtersDarkStore?.mother_pack) ? filtersDarkStore.mother_pack : [];
            allOptions.forEach((opt) => {
                const isChecked = current.some((c) => c.value === opt.value);
                handleCheck("mother_pack", opt.value, isChecked);
            });
        }

        // if (typeof onApply === "function") onApply(current);
    };

    // const sortedMotherPack = useMemo(() => {
    //     const list = Array.isArray(filtersDarkStore?.mother_pack) ? filtersDarkStore.mother_pack : [];
    //     // 1️⃣ Apply search filter first
    //     const filteredList = searchTerm
    //         ? list.filter((b) =>
    //             b.label.toLowerCase().includes(searchTerm.toLowerCase())
    //         )
    //         : list;
    //     return [...filteredList].sort((a, b) => {
    //         const aChecked = selectedFiltersWidget?.selectedMotherPack?.some((sel) => sel.value === a.value);
    //         const bChecked = selectedFiltersWidget?.selectedMotherPack?.some((sel) => sel.value === b.value);
    //         if (aChecked === bChecked) return 0;
    //         return aChecked ? -1 : 1;
    //     });
    // }, [searchTerm]);

    const sortedMotherPack = useMemo(() => {
        const list = Array.isArray(filtersDarkStore?.mother_pack)
            ? filtersDarkStore.mother_pack
            : [];

        const searchInput = (motherPackSearch || searchTerm || "").trim();

        // If there’s no search term, return the full list
        if (!searchInput) return list;

        const terms = searchInput.split(";").map((t) => t.trim()).filter(Boolean);
        if (terms.length === 0) return list;

        const regexes = terms.map((t) => new RegExp(escapeRegExp(t), "i"));
        const filteredList = list.filter((item) => regexes.some((regex) => regex.test(item.label || "")));

        // Keep selected items on top
        const selectedValues = (localSelectedBrands || []).map((p) => p.value);
        const sortedList = [...filteredList].sort((a, b) => {
            const aSelected = selectedValues.includes(a.value);
            const bSelected = selectedValues.includes(b.value);
            if (aSelected === bSelected) return 0;
            return aSelected ? -1 : 1;
        });
        return sortedList;
    }, [filtersDarkStore?.mother_pack, motherPackSearch, searchTerm, localSelectedBrands]);

    // }, [filters?.mother_pack, selectedFiltersWidget?.selectedMotherPack, searchTerm]);

    const allVisibleSelected =
        sortedMotherPack.length > 0 &&
        sortedMotherPack.every((opt) =>
            // isOptionChecked("mother_pack", opt, selectedFiltersWidget)
            (localSelectedBrands || []).some((sel) => sel.value === opt.value)
        );

    const someVisibleSelected =
        sortedMotherPack.some((opt) =>
            // isOptionChecked("mother_pack", opt, selectedFiltersWidget)
            (localSelectedBrands || []).some((sel) => sel.value === opt.value)
        );

    const selectAllLabel = allVisibleSelected ? "Clear All" : "Select All";
    const showNoResults = sortedMotherPack.length === 0 && (motherPackSearch?.trim() || searchTerm?.trim());
    return (
        <>

            <div className="flex flex-col px-8 p-4 space-y-8">
                {/* <div className=" overflow-y-auto px-8 p-4 space-y-8"> */}
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
                        />
                        {motherPackSearch && (
                            <RxCross2
                                size={18}
                                className="absolute right-[6.4rem] top-[45%] -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer z-10"
                                onClick={() => setMotherPackSearch("")}
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
                                        // checked={isOptionChecked("mother_pack", filters?.mother_pack, selectedFiltersWidget?.selectedCategory)}
                                        // onChange={() => {
                                        //     const allSelected = filters?.mother_pack.every((opt) =>
                                        //         isOptionChecked("mother_pack", opt, selectedFiltersWidget)
                                        //     );
                                        //     handleSelectAllUpdate(filters?.mother_pack, allSelected);
                                        //     handleSelectAll("mother_pack", filters?.mother_pack);
                                        // }}

                                        // checked={sortedMotherPack.every((opt) =>
                                        //     isOptionChecked("mother_pack", opt, selectedFiltersWidget)
                                        // )}
                                        checked={allVisibleSelected}
                                        ref={(input) => {
                                            if (input) input.indeterminate = !allVisibleSelected && someVisibleSelected;
                                        }}
                                        onChange={() => {
                                            handleSelectAllUpdate(sortedMotherPack, allVisibleSelected)
                                            // handleSelectAll("mother_pack", sortedMotherPack);
                                        }}
                                    />
                                    {selectAllLabel}
                                </label>


                                {sortedMotherPack?.map((option, i) => {
                                    const isChecked = (localSelectedBrands || []).some(
                                        (sel) => sel.value === option.value
                                    );
                                    // const isChecked = isOptionChecked("mother_pack", option, selectedFiltersWidget);
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
                                                            handleCheck("mother_pack", option.value, isChecked); // keep drawer state in sync
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
                    {/* {sortedMotherPack?.length > 3 && ( */}
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
                    {/* )} */}
                </div>
            </div>

        </>
    );
}

export default MotherPackFilterComponent;
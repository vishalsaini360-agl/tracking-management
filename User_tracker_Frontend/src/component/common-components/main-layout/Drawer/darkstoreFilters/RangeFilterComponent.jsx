import React, { useState, useEffect, useMemo } from "react";
import { useEbuxContext } from "../../../../Ebux/Context/EbuxProvider";
import { escapeRegExp } from "../DrawerHelper";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import { isEqual } from "lodash";

function RangeFilterComponent({ expanded, handleToggle, handleSelectAll,
    handleCheck, searchTerm
}) {
    // console.log('sectionsection222', section)
    const {
        kpi,
        filtersDarkStore,
        activeClientProject,
        selectedFiltersWidget,
        getDistinctFiltersDarkStoreFn

    } = useEbuxContext();
    // console.log('filtersfiltersfilters11', filters)
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
        // console.log('option.value',option.value)
        if (isChecked) {
            newProducts = (localSelectedRange || []).filter(
                (p) => p.value !== option.value
            );
        } else {
            newProducts = [...((localSelectedRange || []) || []), option];
        }
        // console.log('platformplatformplatformplatformnewProducts', newProducts)

        setLocalSelectedRange(newProducts);

    };


    const handleSelectAllUpdate = (options, allSelected) => {
        let newItems = [];

        if (allSelected) {
            // Unselect visible items only
            newItems = (localSelectedRange || []).filter(
                (b) => !options.some((opt) => opt.value === b.value)
            );
        } else {
            // Add all visible items, avoiding duplicates
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
        setLocalSelectedRange([]);
        if (typeof handleSelectAll === "function") {
            handleSelectAll("range", []);
        }

    };

    // Commit local selection to darkstore distinct filters API
    const handleApplyClick = () => {
        const current = localSelectedRange || [];
        if (isEqual(JSON.stringify(selectedFiltersWidget?.selectedRange), JSON.stringify(current))) {
            return;
        }

        if (
            activeClientProject?.client_project_id == 2 &&
            (kpi == "OSA" || kpi == "PRO" || kpi == "RR")
        ) {
            if (typeof getDistinctFiltersDarkStoreFn === "function") {
                getDistinctFiltersDarkStoreFn("range", current);
            }
        } else {
            // If you have other behaviour for non-client 2, keep or change as needed
            if (typeof getDistinctFiltersDarkStoreFn === "function") {
                getDistinctFiltersDarkStoreFn("range", current);
            }
        }

        if (typeof handleCheck === "function") {
            const allOptions = Array.isArray(filtersDarkStore?.range) ? filtersDarkStore.range : [];
            allOptions.forEach((opt) => {
                const isChecked = current.some((c) => c.value === opt.value);
                handleCheck("range", opt.value, isChecked);
            });
        }
    };

    const sortedRange = useMemo(() => {
        const list = Array.isArray(filtersDarkStore?.range)
            ? filtersDarkStore.range
            : [];

        const searchInput = (rangeSearch || searchTerm || "").trim();

        // If there’s no search term, return the full list
        if (!searchInput) return list;

        const terms = searchInput.split(";").map((t) => t.trim()).filter(Boolean);
        if (terms.length === 0) return list;

        const regexes = terms.map((t) => new RegExp(escapeRegExp(t), "i"));
        const filteredList = list.filter((item) => regexes.some((regex) => regex.test(item.label || "")));

        // Keep selected items on top
        const selectedValues = (localSelectedRange || []).map((p) => p.value);
        const sortedList = [...filteredList].sort((a, b) => {
            const aSelected = selectedValues.includes(a.value);
            const bSelected = selectedValues.includes(b.value);
            if (aSelected === bSelected) return 0;
            return aSelected ? -1 : 1;
        });
        return sortedList;
    }, [filtersDarkStore?.range, rangeSearch, searchTerm, localSelectedRange]);

    // }, [filters?.range, selectedFiltersWidget?.selectedRange, searchTerm]);

    const allVisibleSelected =
        sortedRange.length > 0 &&
        sortedRange.every((opt) =>
            // isOptionChecked("range", opt, selectedFiltersWidget)
            (localSelectedRange || []).some((sel) => sel.value === opt.value)
        );

    const someVisibleSelected =
        sortedRange.some((opt) =>
            // isOptionChecked("range", opt, selectedFiltersWidget)
            (localSelectedRange || []).some((sel) => sel.value === opt.value)
        );

    const selectAllLabel = allVisibleSelected ? "Clear All" : "Select All";
    const showNoResults = sortedRange.length === 0 && (rangeSearch?.trim() || searchTerm?.trim());
    return (
        <>

            <div className="flex flex-col px-8 p-4 space-y-8">
                {/* <div className=" overflow-y-auto px-8 p-4 space-y-8"> */}
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
                        />
                        {rangeSearch && (
                            <RxCross2
                                size={18}
                                className="absolute right-[6.4rem] top-[45%] -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer z-10"
                                onClick={() => setRangeSearch("")}
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
                                        // checked={isOptionChecked("range", filters?.range, selectedFiltersWidget?.selectedCategory)}
                                        // onChange={() => {
                                        //     const allSelected = filters?.range.every((opt) =>
                                        //         isOptionChecked("range", opt, selectedFiltersWidget)
                                        //     );
                                        //     handleSelectAllUpdate(filters?.range, allSelected);
                                        //     handleSelectAll("range", filters?.range);
                                        // }}

                                        // checked={sortedRange.every((opt) =>
                                        //     isOptionChecked("range", opt, selectedFiltersWidget)
                                        // )}
                                        checked={allVisibleSelected}
                                        ref={(input) => {
                                            if (input) input.indeterminate = !allVisibleSelected && someVisibleSelected;
                                        }}
                                        onChange={() => {
                                            handleSelectAllUpdate(sortedRange, allVisibleSelected)
                                            // handleSelectAll("range", sortedRange);
                                        }}
                                    />
                                    {selectAllLabel}
                                </label>


                                {sortedRange?.map((option, i) => {
                                    const isChecked = (localSelectedRange || []).some(
                                        (sel) => sel.value === option.value
                                    );
                                    // const isChecked = isOptionChecked("range", option, selectedFiltersWidget);
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
                                                            handleCheck("range", option.value, isChecked); // keep drawer state in sync
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
                    {/* {sortedRange?.length > 3 && ( */}
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
                    {/* )} */}
                </div>
            </div>

        </>
    );
}

export default RangeFilterComponent;
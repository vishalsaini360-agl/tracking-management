import React, { useState, useEffect, useMemo } from "react";
import { useEbuxContext } from "../../../../Ebux/Context/EbuxProvider";
import { escapeRegExp } from "../DrawerHelper";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import { isEqual } from "lodash";

function DynamicPFilterComponentDarkStore({ expanded, handleToggle, handleSelectAll, handleCheck, searchTerm }) {
    const {
        filtersDarkStore,
        selectedFiltersWidget,
        setSelectedFiltersWidget,
    } = useEbuxContext();
    const [dynamicPSearch, setDynamicPSearch] = useState(""); // Changed from segmentSearch

    const [localSelectedDynamicP, setLocalSelectedDynamicP] = useState( // Changed from localSelectedSegments
        selectedFiltersWidget?.selectedDynamicPData ? [...selectedFiltersWidget.selectedDynamicPData] : []
    );

    useEffect(() => {
        setLocalSelectedDynamicP(
            selectedFiltersWidget?.selectedDynamicPData ? [...selectedFiltersWidget.selectedDynamicPData] : []
        );
    }, [selectedFiltersWidget?.selectedDynamicPData]);

    const handleUpdate = (option, isChecked) => {
        let newDynamicP;
        if (isChecked) {
            newDynamicP = (localSelectedDynamicP || []).filter(
                (s) => s.value !== option.value
            );
        } else {
            newDynamicP = [...((localSelectedDynamicP || []) || []), option];
        }

        setLocalSelectedDynamicP(newDynamicP);
    };

    const handleSelectAllUpdate = (options, allSelected) => {
        let newItems = [];

        if (allSelected) {
            newItems = (localSelectedDynamicP || []).filter(
                (s) => !options.some((opt) => opt.value === s.value)
            );
        } else {
            const uniqueItems = [
                ...(localSelectedDynamicP || []),
                ...options.filter(
                    (opt) =>
                        !(localSelectedDynamicP || []).some(
                            (sel) => sel.value === opt.value
                        )
                ),
            ];
            newItems = uniqueItems;
        }
        setLocalSelectedDynamicP(newItems);
    };

    const handleClearAll = () => {
        setLocalSelectedDynamicP([]);
        if (typeof handleSelectAll === "function") {
            handleSelectAll("dynamic_p", []); // Changed from "segment"
        }
    };

    const handleApplyClick = async () => {
        const current = localSelectedDynamicP || [];
        if (isEqual(JSON.stringify(selectedFiltersWidget?.selectedDynamicPData), JSON.stringify(current))) {
            return;
        }

        setSelectedFiltersWidget(prevFilters => ({
            ...prevFilters,
            selectedDynamicPData: current ?? [],
        }));



        if (typeof handleCheck === "function") {
            const allDynamicP = Array.isArray(filtersDarkStore?.dynamicPData) ? filtersDarkStore.dynamicPData : [];
            allDynamicP.forEach((dynamicP) => {
                const isChecked = current.some((s) => s.value === dynamicP.value);
                handleCheck("dynamicPData", dynamicP.value, !isChecked); // Changed from "segment"
            });
        }
    };

    const sortedDynamicP = useMemo(() => {
        const list = Array.isArray(filtersDarkStore?.dynamicPData) ? filtersDarkStore.dynamicPData : [];
        const searchInput = (dynamicPSearch || searchTerm || "").trim();
        if (!searchInput) { return list; }
        const safe = escapeRegExp(searchInput);
        const regex = new RegExp(safe, "i");

        const filteredList = list.filter((item) => regex.test(item.label));

        const selectedValues = (localSelectedDynamicP || []).map((s) => s.value);
        const sortedList = [...filteredList].sort((a, b) => {
            const aSelected = selectedValues.includes(a.value);
            const bSelected = selectedValues.includes(b.value);
            if (aSelected === bSelected) return 0;
            return aSelected ? -1 : 1;
        });
        return sortedList;
    }, [filtersDarkStore?.dynamicPData, searchTerm, dynamicPSearch, localSelectedDynamicP]);

    const allVisibleSelected =
        sortedDynamicP.length > 0 &&
        sortedDynamicP.every((opt) =>
            (localSelectedDynamicP || []).some((sel) => sel.value === opt.value)
        );

    const someVisibleSelected =
        sortedDynamicP.some((opt) =>
            (localSelectedDynamicP || []).some((sel) => sel.value === opt.value)
        );

    const selectAllLabel = allVisibleSelected ? "Clear All" : "Select All";
    const showNoResults = sortedDynamicP.length === 0 && (dynamicPSearch?.trim() || searchTerm?.trim());
    // console.log(sortedDynamicP,"sortedDynamicPyyyyy");

    return (
        <>
            <div className="flex flex-col px-8 p-4 space-y-8">
                <div className="border-b border-gray-100 pb-6 last:border-0">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="flex font-semibold text-gray-900 text-base">Dynamic P
                            {
                                selectedFiltersWidget?.selectedDynamicPData?.length > 0 ?
                                    <span className="ml-1 flex items-center justify-center w-5 h-5 text-[10px] rounded-full bg-[#F0F0F0]">
                                        {selectedFiltersWidget?.selectedDynamicPData.length}
                                    </span>
                                    : <></>
                            }
                        </h3>
                        {sortedDynamicP?.length > 3 && (
                            <button
                                type="button"
                                className="text-gray-500 hover:text-gray-700"
                                onClick={() => handleToggle("dynamic_p")} // Changed from "segment"
                            >
                                {expanded["dynamic_p"] ? <IoIosArrowUp size={20} /> : <IoIosArrowDown size={20} />}
                            </button>
                        )}
                    </div>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search dynamic P..."
                            className="w-[75%] px-[9px] py-[2px] pr-[24px] mb-[6px] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={dynamicPSearch}
                            onChange={(e) => setDynamicPSearch(e.target.value)}
                        />
                        {dynamicPSearch && (
                            <RxCross2
                                size={18}
                                className="absolute right-[5.4rem] top-[45%] -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer z-10"
                                onClick={() => setDynamicPSearch("")}
                            />
                        )}
                    </div>
                    {sortedDynamicP?.length > 0 && (
                        <div className="space-y-2">
                            <div className={`space-y-2 transition-all duration-300 ${expanded["dynamic_p"] ? "max-h-60 overflow-y-auto pr-2" : "max-h-[102px] overflow-hidden"}`} >
                                <label className="flex items-center font-bold gap-2 text-sm text-gray-700 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 text-blue-600 rounded"
                                        checked={allVisibleSelected}
                                        ref={(input) => {
                                            if (input) input.indeterminate = !allVisibleSelected && someVisibleSelected;
                                        }}
                                        onChange={() => {
                                            handleSelectAllUpdate(sortedDynamicP, allVisibleSelected)
                                        }}
                                    />
                                    {selectAllLabel}
                                </label>

                                {sortedDynamicP?.map((option, i) => {
                                    const isChecked = (localSelectedDynamicP || []).some(
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
                                                            handleCheck("dynamicPData", option.value, isChecked);
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
                            No dynamic P found...
                        </div>
                    )}
                    <div className="flex justify-between relative top-[8px]">
                        <button
                            type="button"
                            className="text-blue-500 text-sm font-medium mt-3 flex items-center"
                            onClick={() => handleToggle("dynamic_p")}
                        >
                            {expanded["dynamic_p"] ? "View Less" : "View More"}
                            <span className="ml-1">
                                {expanded["dynamic_p"] ? <IoIosArrowUp size={16} /> : <IoIosArrowDown size={16} />}
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

export default DynamicPFilterComponentDarkStore;
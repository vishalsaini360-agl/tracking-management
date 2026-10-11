import React, { useState, useEffect, useMemo } from "react";
import { useEbuxContext } from "../../../../Ebux/Context/EbuxProvider";
import { escapeRegExp } from "../DrawerHelper";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import { isEqual } from "lodash";

function SegmentFilterComponentDarkStore({ expanded, handleToggle, handleSelectAll, handleCheck, searchTerm }) {
    const {
        filtersDarkStore,
        selectedFiltersWidget,
        setSelectedFiltersWidget,
    } = useEbuxContext();
    
    const [segmentSearch, setSegmentSearch] = useState("");

    const [localSelectedSegments, setLocalSelectedSegments] = useState(
        selectedFiltersWidget?.selectedSegmentData ? [...selectedFiltersWidget.selectedSegmentData] : []
    );

    useEffect(() => {
        setLocalSelectedSegments(
            selectedFiltersWidget?.selectedSegmentData ? [...selectedFiltersWidget.selectedSegmentData] : []
        );
    }, [selectedFiltersWidget?.selectedSegmentData]);

    const handleUpdate = (option, isChecked) => {
        let newSegments;
        if (isChecked) {
            newSegments = (localSelectedSegments || []).filter(
                (s) => s.value !== option.value
            );
        } else {
            newSegments = [...((localSelectedSegments || []) || []), option];
        }
       setLocalSelectedSegments(newSegments);
    };

    const handleSelectAllUpdate = (options, allSelected) => {
        let newItems = [];

        if (allSelected) {
            newItems = (localSelectedSegments || []).filter(
                (s) => !options.some((opt) => opt.value === s.value)
            );
        } else {
            const uniqueItems = [
                ...(localSelectedSegments || []),
                ...options.filter(
                    (opt) =>
                        !(localSelectedSegments || []).some(
                            (sel) => sel.value === opt.value
                        )
                ),
            ];
            newItems = uniqueItems;
        }
        setLocalSelectedSegments(newItems);
    };

    const handleClearAll = () => {
        setLocalSelectedSegments([]);
        if (typeof handleSelectAll === "function") {
            handleSelectAll("segment", []);
        }
    };

    const handleApplyClick = async () => {
        const current = localSelectedSegments || [];
        if (isEqual(JSON.stringify(selectedFiltersWidget?.selectedSegmentData), JSON.stringify(current))) {
            return;
        }
        
        setSelectedFiltersWidget(prevFilters => ({
            ...prevFilters,
            selectedSegmentData: current ?? [],
        }));

        if (typeof handleCheck === "function") {
            const allSegments = Array.isArray(filtersDarkStore?.segmentData) ? filtersDarkStore.segmentData : [];
            allSegments.forEach((segment) => {
                const isChecked = current.some((s) => s.value === segment.value);
                handleCheck("segmentData", segment.value, !isChecked);
            });
        }
    };

    const sortedSegments = useMemo(() => {
        const list = Array.isArray(filtersDarkStore?.segmentData) ? filtersDarkStore.segmentData : [];
        const searchInput = (segmentSearch || searchTerm || "").trim();
        if (!searchInput) { return list; }
        const safe = escapeRegExp(searchInput);
        const regex = new RegExp(safe, "i");

        const filteredList = list.filter((item) => regex.test(item.label));

        const selectedValues = (localSelectedSegments || []).map((s) => s.value);
        const sortedList = [...filteredList].sort((a, b) => {
            const aSelected = selectedValues.includes(a.value);
            const bSelected = selectedValues.includes(b.value);
            if (aSelected === bSelected) return 0;
            return aSelected ? -1 : 1;
        });
        return sortedList;
    }, [filtersDarkStore?.segmentData, searchTerm, segmentSearch, localSelectedSegments]);

    const allVisibleSelected =
        sortedSegments.length > 0 &&
        sortedSegments.every((opt) =>
            (localSelectedSegments || []).some((sel) => sel.value === opt.value)
        );

    const someVisibleSelected =
        sortedSegments.some((opt) =>
            (localSelectedSegments || []).some((sel) => sel.value === opt.value)
        );

    const selectAllLabel = allVisibleSelected ? "Clear All" : "Select All";
    const showNoResults = sortedSegments.length === 0 && (segmentSearch?.trim() || searchTerm?.trim());

    return (
        <>
            <div className="flex flex-col px-8 p-4 space-y-8">
                <div className="border-b border-gray-100 pb-6 last:border-0">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="flex font-semibold text-gray-900 text-base">Segment
                            {
                                selectedFiltersWidget?.selectedSegmentData?.length > 0 ?
                                    <span className="ml-1 flex items-center justify-center w-5 h-5 text-[10px] rounded-full bg-[#F0F0F0]">
                                        {selectedFiltersWidget?.selectedSegmentData.length}
                                    </span>
                                    : <></>
                            }
                        </h3>
                        {sortedSegments?.length > 3 && (
                            <button
                                type="button"
                                className="text-gray-500 hover:text-gray-700"
                                onClick={() => handleToggle("segment")}
                            >
                                {expanded["segment"] ? <IoIosArrowUp size={20} /> : <IoIosArrowDown size={20} />}
                            </button>
                        )}
                    </div>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search segment..."
                            className="w-[75%] px-[9px] py-[2px] pr-[24px] mb-[6px] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={segmentSearch}
                            onChange={(e) => setSegmentSearch(e.target.value)}
                        />
                        {segmentSearch && (
                            <RxCross2
                                size={18}
                                className="absolute right-[5.4rem] top-[45%] -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer z-10"
                                onClick={() => setSegmentSearch("")}
                            />
                        )}
                    </div>
                    {sortedSegments?.length > 0 && (
                        <div className="space-y-2">
                            <div className={`space-y-2 transition-all duration-300 ${expanded["segment"] ? "max-h-60 overflow-y-auto pr-2" : "max-h-[102px] overflow-hidden"}`} >
                                <label className="flex items-center font-bold gap-2 text-sm text-gray-700 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 text-blue-600 rounded"
                                        checked={allVisibleSelected}
                                        ref={(input) => {
                                            if (input) input.indeterminate = !allVisibleSelected && someVisibleSelected;
                                        }}
                                        onChange={() => {
                                            handleSelectAllUpdate(sortedSegments, allVisibleSelected)
                                        }}
                                    />
                                    {selectAllLabel}
                                </label>

                                {sortedSegments?.filter((option) => option.label != 0) ?.map((option, i) => {
                                    const isChecked = (localSelectedSegments || []).some(
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
                                                            handleCheck("segmentData", option.value, isChecked);
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
                            No segments found...
                        </div>
                    )}
                    <div className="flex justify-between relative top-[8px]">
                        <button
                            type="button"
                            className="text-blue-500 text-sm font-medium mt-3 flex items-center"
                            onClick={() => handleToggle("segment")}
                        >
                            {expanded["segment"] ? "View Less" : "View More"}
                            <span className="ml-1">
                                {expanded["segment"] ? <IoIosArrowUp size={16} /> : <IoIosArrowDown size={16} />}
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

export default SegmentFilterComponentDarkStore;
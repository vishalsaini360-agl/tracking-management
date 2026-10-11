import React, { useState, useEffect, useMemo, useRef } from "react";
import { useEbuxContext } from "../../../../Context/EbuxProvider";
import { useAlertContext } from "../../Context/AlertProvider";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { trackFilterCheck, trackFilterSelectAll } from "./filterTracker";


const escapeRegExp = (string) => {
    return string ? string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") : "";
};

const RangeFilter = ({ expanded, onToggle, globalSearch = "" }) => {
    const {
        // kpi,
        selectedFiltersWidget,
        setSelectedFiltersWidget,
    } = useEbuxContext();
    const { filters } = useAlertContext();

    const [rangeSearch] = useState("");
    const [localSelectedRange, setLocalSelectedRange] = useState([]);
    const scrollRef = useRef(null);

    useEffect(() => {
        setLocalSelectedRange(
            selectedFiltersWidget?.selectedRange ? [...selectedFiltersWidget.selectedRange] : []
        );
    }, [selectedFiltersWidget?.selectedRange]);

    const heading = "Range";

    const handleUpdate = (option, isChecked) => {
        trackFilterCheck(heading, option, isChecked);
        let newRanges;
        if (isChecked) {
            newRanges = (localSelectedRange || []).filter(
                (b) => String(b.value) !== String(option.value)
            );
        } else {
            newRanges = [...(localSelectedRange || []), option];
        }

        setSelectedFiltersWidget(prevFilters => ({
            ...prevFilters,
            selectedRange: newRanges,
        }));

    };

    const handleSelectAllUpdate = (options, allSelected) => {
        trackFilterSelectAll(heading, allSelected, options?.length);
        let newItems = [];
        if (allSelected) {
            newItems = (localSelectedRange || []).filter(
                (b) => !options.some((opt) => String(opt.value) === String(b.value))
            );
        } else {
            const toAdd = options.filter(opt => !localSelectedRange.some(sel => String(sel.value) === String(opt.value)));
            newItems = [...localSelectedRange, ...toAdd];
        }
        setSelectedFiltersWidget(prevFilters => ({
            ...prevFilters,
            selectedRange: newItems ?? [],
        }));
    };

    const sortedRanges = useMemo(() => {
        const sourceList = filters?.range;
        const list = Array.isArray(sourceList) ? sourceList : [];
        const searchInput = (rangeSearch || globalSearch || "").trim();
        if (!searchInput) { return list; }

        const terms = searchInput.split(";").map((t) => t.trim()).filter(Boolean);
        if (terms.length === 0) return list;

        const regexes = terms.map((t) => new RegExp(escapeRegExp(t), "i"));
        const filteredList = list.filter((item) => regexes.some((regex) => regex.test(item.label || item.name || "")));
        const selectedValues = (localSelectedRange || []).map((b) => String(b.value));

        return [...filteredList].sort((a, b) => {
            const aSelected = selectedValues.includes(String(a.value));
            const bSelected = selectedValues.includes(String(b.value));
            if (aSelected === bSelected) return 0;
            return aSelected ? -1 : 1;
        });
    }, [filters?.range, globalSearch, rangeSearch, localSelectedRange]);

    useEffect(() => {
        // setStartIndex(0);
        if (scrollRef.current) {
            scrollRef.current.scrollTop = 0;
        }
    }, [sortedRanges, expanded]);

    const allVisibleSelected = sortedRanges.length > 0 &&
        sortedRanges.every(opt => localSelectedRange.some(sel => String(sel.value) === String(opt.value)));
    const someVisibleSelected = !allVisibleSelected &&
        sortedRanges.some(opt => localSelectedRange.some(sel => String(sel.value) === String(opt.value)));

    const showNoResults = sortedRanges.length === 0 && (rangeSearch?.trim() || globalSearch?.trim());

    return (
        <div className="pb-4 mb-4 border-b border-gray-100 last:border-0 last:pb-0 last:mb-0">
            <div className="flex items-center justify-between cursor-pointer group" onClick={() => onToggle("range")}>
                <h3 className="font-semibold text-[##000000D9] text-base">
                    {heading}
                </h3>
                <div className="text-gray-400 group-hover:text-gray-600 transition-colors">
                    {expanded ? <IoIosArrowUp size={16} /> : <IoIosArrowDown size={16} />}
                </div>
            </div>

            <div className={`transition-all duration-300 ${expanded ? "max-h-[500px] mt-4 opacity-100" : "max-h-0 opacity-0 overflow-hidden"}`}>
                {sortedRanges.length > 0 ? (
                    <>
                        <label className="flex items-center gap-3 group cursor-pointer mb-3">
                            <div className="relative flex items-center justify-center">
                                <input
                                    type="checkbox"
                                    checked={allVisibleSelected}
                                    ref={el => el && (el.indeterminate = someVisibleSelected)}
                                    onChange={() => handleSelectAllUpdate(sortedRanges, allVisibleSelected)}
                                    className="peer appearance-none w-4 h-4 border border-gray-300 rounded focus:ring-0 checked:bg-blue-600 checked:border-blue-600 transition-all cursor-pointer"
                                />
                                <svg className="absolute w-2.5 h-2.5 text-white hidden peer-checked:block pointer-events-none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                            </div>
                            <span className="text-sm text-gray-700 font-medium">
                                Select All
                            </span>
                        </label>

                        <div
                            ref={scrollRef}
                            className="max-h-[300px] overflow-y-auto pr-1 custom-scrollbar space-y-1"
                        >
                            {sortedRanges.map((option, i) => {
                                const isChecked = localSelectedRange.some(sel => String(sel.value) === String(option.value));
                                return (
                                    <label key={i} className="flex items-center gap-3 group cursor-pointer py-1.5">
                                        <div className="relative flex items-center justify-center">
                                            <input
                                                type="checkbox"
                                                checked={isChecked}
                                                onChange={() => handleUpdate(option, isChecked)}
                                                className="peer appearance-none w-4 h-4 border border-gray-300 rounded focus:ring-0 checked:bg-blue-600 checked:border-blue-600 transition-all cursor-pointer"
                                            />
                                            <svg className="absolute w-2.5 h-2.5 text-white hidden peer-checked:block pointer-events-none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                        </div>
                                        <span className={`text-sm transition-colors ${isChecked ? "text-[#000000D9] font-medium" : "text-[#000000D9] group-hover:text-gray-900"}`}>
                                            {option.label || option.name}
                                        </span>
                                    </label>
                                );
                            })}
                        </div>

                    </>
                ) : (
                    !showNoResults && expanded && (
                        <div className="text-xs text-gray-500 py-4 text-center bg-gray-50 rounded-lg border border-dashed border-gray-200">
                            No {heading.toLowerCase()}s available
                        </div>
                    )
                )}

                {showNoResults && (
                    <div className="text-sm text-gray-500 py-4 text-center bg-gray-50 rounded-lg">
                        No {heading.toLowerCase()}s found for <span className="font-semibold">{rangeSearch || globalSearch}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RangeFilter;
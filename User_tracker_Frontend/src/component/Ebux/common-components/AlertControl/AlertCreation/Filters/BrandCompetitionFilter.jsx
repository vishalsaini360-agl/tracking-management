import React, { useState, useEffect, useMemo, useRef } from "react";
import { useEbuxContext } from "../../../../Context/EbuxProvider";
import { useAlertContext } from "../../Context/AlertProvider";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { trackFilterCheck, trackFilterSelectAll } from "./filterTracker";


const escapeRegExp = (string) => {
    return string ? string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") : "";
};

const BrandCompetitionFilter = ({ expanded, onToggle, globalSearch = "" }) => {
    // console.log('sssssssssssssss', expanded)
    const {
        selectedFiltersWidget,
        setSelectedFiltersWidget,
    } = useEbuxContext();
    const { filters } = useAlertContext();

    const [localSelectedBrands, setLocalSelectedBrands] = useState([]);
    const scrollRef = useRef(null);

    useEffect(() => {
        setLocalSelectedBrands(
            selectedFiltersWidget?.selectedBrandCompetition ? [...selectedFiltersWidget.selectedBrandCompetition] : []
        );
    }, [selectedFiltersWidget?.selectedBrandCompetition]);

    const heading = "Brand Competition";

    const handleUpdate = (option, isChecked) => {
        trackFilterCheck(heading, option, isChecked);
        let newBrands;
        if (isChecked) {
            newBrands = (localSelectedBrands || []).filter(
                (b) => String(b.value || b.id) !== String(option.value || option.id)
            );
        } else {
            newBrands = [...(localSelectedBrands || []), option];
        }

        setSelectedFiltersWidget(prevFilters => ({
            ...prevFilters,
            selectedBrandCompetition: newBrands,
        }));

    };

    const handleSelectAllUpdate = (options, allSelected) => {
        trackFilterSelectAll(heading, allSelected, options?.length);
        let newItems = [];
        if (allSelected) {
            newItems = (localSelectedBrands || []).filter(
                (b) => !options.some((opt) => String(opt.value || opt.id) === String(b.value || b.id))
            );
        } else {
            const toAdd = options.filter(opt => !localSelectedBrands.some(sel => String(sel.value || sel.id) === String(opt.value || opt.id)));
            newItems = [...localSelectedBrands, ...toAdd];
        }
        setSelectedFiltersWidget(prevFilters => ({
            ...prevFilters,
            selectedBrandCompetition: newItems ?? [],
        }));
    };

    const sortedBrands = useMemo(() => {
        const list = Array.isArray(filters?.res_brand_competition) ? filters.res_brand_competition : [];
        const searchInput = (globalSearch || "").trim();
        if (!searchInput) { return list; }

        const terms = searchInput.split(";").map(t => t.trim()).filter(Boolean);
        if (terms.length === 0) return list;

        const regexes = terms.map(t => new RegExp(escapeRegExp(t), "i"));
        const filteredList = list.filter((item) => regexes.some(regex => regex.test(item.label || item.name || "")));
        const selectedValues = (localSelectedBrands || []).map((b) => String(b.value || b.id));

        return [...filteredList].sort((a, b) => {
            const aSelected = selectedValues.includes(String(a.value || a.id));
            const bSelected = selectedValues.includes(String(b.value || b.id));
            if (aSelected === bSelected) return 0;
            return aSelected ? -1 : 1;
        });
    }, [filters?.res_brand_competition, globalSearch, localSelectedBrands]);

    useEffect(() => {
        // setStartIndex(0);
        if (scrollRef.current) {
            scrollRef.current.scrollTop = 0;
        }
    }, [sortedBrands, expanded]);

    const allVisibleSelected = sortedBrands.length > 0 &&
        sortedBrands.every(opt => localSelectedBrands.some(sel => String(sel.value || sel.id) === String(opt.value || opt.id)));
    const someVisibleSelected = !allVisibleSelected &&
        sortedBrands.some(opt => localSelectedBrands.some(sel => String(sel.value || sel.id) === String(opt.value || opt.id)));

    const showNoResults = sortedBrands.length === 0 && globalSearch?.trim();

    return (
        <div className="pb-4 mb-4 border-b border-gray-100 last:border-0 last:pb-0 last:mb-0">
            <div className="flex items-center justify-between cursor-pointer group" onClick={() => onToggle("brand_competition")}>
                <h3 className="font-semibold text-[##000000D9] text-base">
                    {heading}
                </h3>
                <div className="text-gray-400 group-hover:text-gray-600 transition-colors">
                    {expanded ? <IoIosArrowUp size={16} /> : <IoIosArrowDown size={16} />}
                </div>
            </div>

            <div className={`transition-all duration-300 ${expanded ? "max-h-[500px] mt-4 opacity-100" : "max-h-0 opacity-0 overflow-hidden"}`}>
                {sortedBrands.length > 0 ? (
                    <>
                        <label className="flex items-center gap-3 group cursor-pointer mb-3">
                            <div className="relative flex items-center justify-center">
                                <input
                                    type="checkbox"
                                    checked={allVisibleSelected}
                                    ref={el => el && (el.indeterminate = someVisibleSelected)}
                                    onChange={() => handleSelectAllUpdate(sortedBrands, allVisibleSelected)}
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
                            {sortedBrands.map((option, i) => {
                                const isChecked = localSelectedBrands.some(sel => String(sel.value) === String(option.value));
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
                        No {heading.toLowerCase()}s found for <span className="font-semibold">{globalSearch}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BrandCompetitionFilter;
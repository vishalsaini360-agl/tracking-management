import React, { useState, useEffect, useMemo, useRef } from "react";
import { useEbuxContext } from "../../../../Context/EbuxProvider";
import { useAlertContext } from "../../Context/AlertProvider";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { trackFilterCheck, trackFilterSelectAll } from "./filterTracker";

const escapeRegExp = (string) => {
    return string ? string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") : "";
};

const KeywordTagFilter = ({ expanded, onToggle, globalSearch = "" }) => {

    const {
        selectedFiltersWidget,
        updateSelectedFilters,
    } = useEbuxContext();
    const { filters, tagList } = useAlertContext();

    const [productSearch] = useState("");
    const [localSelectedProducts, setLocalSelectedProducts] = useState([]);

    const scrollRef = useRef(null);

    // Sync with context
    useEffect(() => {
        setLocalSelectedProducts(
            selectedFiltersWidget?.selectedTagsKW
                ? [...selectedFiltersWidget.selectedTagsKW]
                : []
        );
    }, [selectedFiltersWidget?.selectedTagsKW]);

    // Filter + Sort
    const sortedProducts = useMemo(() => {
        let rawList = Array.isArray(tagList) ? tagList : [];
        rawList = rawList.filter(item => item?.tag_type === "Keyword");

        const searchInput = (productSearch || globalSearch || "").trim();

        if (!searchInput) return rawList;

        const terms = searchInput.split(";").map(t => t.trim()).filter(Boolean);
        if (terms.length === 0) return rawList;

        const regexes = terms.map(t => new RegExp(escapeRegExp(t), "i"));
        const filteredList = rawList.filter(item =>
            regexes.some(regex => regex.test(item.tag_name || ""))
        );

        const selectedValues = localSelectedProducts.map(b => String(b.id));

        return [...filteredList].sort((a, b) => {
            const aSelected = selectedValues.includes(String(a.id));
            const bSelected = selectedValues.includes(String(b.id));

            if (aSelected === bSelected) return 0;
            return aSelected ? -1 : 1;
        });
    }, [tagList, globalSearch, productSearch, localSelectedProducts]);

    // Scroll Reset
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = 0;
        }
    }, [sortedProducts, expanded]);

    // Single select
    const handleUpdate = (option, isChecked) => {
        trackFilterCheck("Keyword Tags", option, isChecked);
        let newTags;
        const currentKeywords = selectedFiltersWidget?.selectedKeyword || [];

        if (isChecked) {
            newTags = localSelectedProducts.filter(b => String(b.id) !== String(option.id));
            
            const remainingKws = newTags.flatMap(t => t.tag_details?.map(d => String(d.sku_or_keyword)) || []);
            const removedKws = (option.tag_details || []).map(d => String(d.sku_or_keyword));
            
            const newKeywords = currentKeywords.filter(k => {
                const kwStr = String(k.keyword_name || k.value || k.label);
                return !removedKws.includes(kwStr) || remainingKws.includes(kwStr);
            });
            updateSelectedFilters("selectedKeyword", newKeywords);

        } else {
            newTags = [...localSelectedProducts, option];
            
            const addedKws = (option.tag_details || []).map(d => String(d.sku_or_keyword));
            const matchingKeywords = (filters?.keyword || []).filter(k => addedKws.includes(String(k.keyword_name || k.value || k.label)));
            
            const existingIds = new Set(currentKeywords.map(k => String(k.value)));
            const uniqueMatchingKeywords = matchingKeywords.filter(k => !existingIds.has(String(k.value)));
            
            updateSelectedFilters("selectedKeyword", [...currentKeywords, ...uniqueMatchingKeywords]);
        }

        updateSelectedFilters("selectedTagsKW", newTags);
    };

    // Select All
    const handleSelectAllUpdate = (options, allSelected) => {
        trackFilterSelectAll("Keyword Tags", allSelected, options?.length);
        let newTags = [];
        const currentKeywords = selectedFiltersWidget?.selectedKeyword || [];

        if (allSelected) {
            newTags = localSelectedProducts.filter(b => !options.some(opt => String(opt.id) === String(b.id)));
            
            const remainingKws = newTags.flatMap(t => t.tag_details?.map(d => String(d.sku_or_keyword)) || []);
            const removedKws = options.flatMap(opt => (opt.tag_details || []).map(d => String(d.sku_or_keyword)));
            
            const newKeywords = currentKeywords.filter(k => {
                const kwStr = String(k.keyword_name || k.value || k.label);
                return !removedKws.includes(kwStr) || remainingKws.includes(kwStr);
            });
            updateSelectedFilters("selectedKeyword", newKeywords);
        } else {
            const toAdd = options.filter(opt => !localSelectedProducts.some(sel => String(sel.id) === String(opt.id)));
            newTags = [...localSelectedProducts, ...toAdd];
            
            const addedKws = toAdd.flatMap(opt => (opt.tag_details || []).map(d => String(d.sku_or_keyword)));
            const matchingKeywords = (filters?.keyword || []).filter(k => addedKws.includes(String(k.keyword_name || k.value || k.label)));
            
            const existingIds = new Set(currentKeywords.map(k => String(k.value)));
            const uniqueMatchingKeywords = matchingKeywords.filter(k => !existingIds.has(String(k.value)));
            
            updateSelectedFilters("selectedKeyword", [...currentKeywords, ...uniqueMatchingKeywords]);
        }

        updateSelectedFilters("selectedTagsKW", newTags);
    };

    // Select states
    const allVisibleSelected =
        sortedProducts.length > 0 &&
        sortedProducts.every(opt =>
            localSelectedProducts.some(sel => String(sel.id) === String(opt.id))
        );

    const someVisibleSelected =
        !allVisibleSelected &&
        sortedProducts.some(opt =>
            localSelectedProducts.some(sel => String(sel.id) === String(opt.id))
        );

    const showNoResults =
        sortedProducts.length === 0 &&
        (productSearch?.trim() || globalSearch?.trim());

    return (
        <div className="pb-4 mb-4 border-b border-gray-100 last:border-0 last:pb-0 last:mb-0">
            <div
                className="flex items-center justify-between cursor-pointer group"
                onClick={() => onToggle("keyword_tags")}
            >
                <div className="flex items-center gap-4">
                    <h3 className="font-semibold text-[##000000D9] text-base">
                        Keyword Tags
                    </h3>
                </div>

                <div className="text-gray-400 group-hover:text-gray-600 transition-colors">
                    {expanded ? <IoIosArrowUp size={16} /> : <IoIosArrowDown size={16} />}
                </div>
            </div>

            <div className={`transition-all duration-300 ${expanded ? "max-h-[500px] mt-4 opacity-100" : "max-h-0 opacity-0 overflow-hidden"}`}>
                {sortedProducts.length > 0 ? (
                    <>
                        {/* Select All */}
                        <label className="flex items-center gap-3 group cursor-pointer mb-3">
                            <div className="relative flex items-center justify-center">
                                <input
                                    type="checkbox"
                                    checked={allVisibleSelected}
                                    ref={el => el && (el.indeterminate = someVisibleSelected)}
                                    onChange={() => handleSelectAllUpdate(sortedProducts, allVisibleSelected)}
                                    className="peer appearance-none w-4 h-4 border border-gray-300 rounded focus:ring-0 checked:bg-blue-600 checked:border-blue-600 transition-all cursor-pointer"
                                />
                                <svg className="absolute w-2.5 h-2.5 text-white hidden peer-checked:block pointer-events-none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                            </div>
                            <span className="text-sm text-gray-700 font-medium">Select All</span>
                        </label>

                        {/* List */}
                        <div ref={scrollRef} className="max-h-[300px] overflow-y-auto pr-1 custom-scrollbar space-y-1">
                            {sortedProducts.map((option, i) => {
                                const isChecked = localSelectedProducts.some(sel => String(sel.id) === String(option.id));
                                return (
                                    <label key={i} className="flex items-center gap-3 group cursor-pointer py-1.5">
                                        <div className="relative flex items-center justify-center">
                                            <input
                                                type="checkbox"
                                                checked={isChecked}
                                                onChange={() => handleUpdate(option, isChecked)}
                                                className="peer appearance-none w-4 h-4 border border-gray-300 rounded focus:ring-0 checked:bg-blue-600 checked:border-blue-600 transition-all cursor-pointer"
                                            />
                                            <svg className="absolute w-2.5 h-2.5 text-white hidden peer-checked:block pointer-events-none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="20 6 9 17 4 12" />
                                            </svg>
                                        </div>
                                        <span className={`text-sm ${isChecked ? "text-[#000000D9] font-medium" : "text-[#000000D9] group-hover:text-gray-900"}`}>
                                            {option.tag_name}
                                        </span>
                                    </label>
                                );
                            })}
                        </div>
                    </>
                ) : (
                    !showNoResults && expanded && (
                        <div className="text-xs text-gray-500 py-4 text-center bg-gray-50 rounded-lg border border-dashed border-gray-200">
                            No keyword tags available
                        </div>
                    )
                )}

                {showNoResults && (
                    <div className="text-sm text-gray-500 py-4 text-center bg-gray-50 rounded-lg">
                        No tags found for <span className="font-semibold ml-1">{productSearch || globalSearch}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default KeywordTagFilter;

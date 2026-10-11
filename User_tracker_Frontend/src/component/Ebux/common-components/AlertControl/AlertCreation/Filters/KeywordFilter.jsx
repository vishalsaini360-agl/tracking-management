import React, { useState, useEffect, useMemo, useRef } from "react";
import { useEbuxContext } from "../../../../Context/EbuxProvider";
import { useAlertContext } from "../../Context/AlertProvider";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { trackFilterCheck, trackFilterSelectAll } from "./filterTracker";

const escapeRegExp = (string) => {
    return string ? string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") : "";
};

const KeywordFilter = ({ expanded, onToggle, globalSearch = "" }) => {

    const {
        selectedFiltersWidget,
        setSelectedFiltersWidget
    } = useEbuxContext();
    const { filters } = useAlertContext();

    const [productSearch] = useState("");
    const [localSelectedProducts, setLocalSelectedProducts] = useState([]);

    const scrollRef = useRef(null);


    // Sync with context
    useEffect(() => {

        setLocalSelectedProducts(
            selectedFiltersWidget?.selectedKeyword
                ? [...selectedFiltersWidget.selectedKeyword]
                : []
        );

    }, [selectedFiltersWidget?.selectedKeyword]);


    // Filter + Sort
    const sortedProducts = useMemo(() => {

        const list =
            Array.isArray(filters?.keyword)
                ? filters.keyword
                : [];

        const searchInput =
            (productSearch || globalSearch || "").trim();

        if (!searchInput) return list;

        const terms = searchInput.split(";").map(t => t.trim()).filter(Boolean);
        if (terms.length === 0) return list;

        const regexes = terms.map(t => new RegExp(escapeRegExp(t), "i"));
        const filteredList =
            list.filter(item =>
                regexes.some(regex => regex.test(item.label || item.name || ""))
            );


        const selectedValues =
            localSelectedProducts.map(
                b => String(b.value)
            );


        return [...filteredList].sort((a, b) => {

            const aSelected =
                selectedValues.includes(String(a.value));

            const bSelected =
                selectedValues.includes(String(b.value));

            if (aSelected === bSelected) return 0;

            return aSelected ? -1 : 1;

        });

    }, [
        filters?.keyword,
        globalSearch,
        productSearch,
        localSelectedProducts
    ]);


    // Scroll Reset
    useEffect(() => {

        if (scrollRef.current) {
            scrollRef.current.scrollTop = 0;
        }

    }, [sortedProducts, expanded]);


    // Single select
    const handleUpdate = (option, isChecked) => {
        trackFilterCheck("Keywords", option, isChecked);
        let newProducts;
        let newTags = [...(selectedFiltersWidget?.selectedTagsKW || [])];

        if (isChecked) {
            newProducts = localSelectedProducts.filter(b => String(b.value) !== String(option.value));
            
            const removedPid = String(option.keyword_name || option.value || option.label);
            newTags = newTags.filter(tag => {
                const tagPids = (tag.tag_details || []).map(d => String(d.sku_or_keyword));
                return !tagPids.includes(removedPid);
            });
        } else {
            newProducts = [...localSelectedProducts, option];
        }

        setSelectedFiltersWidget(prev => ({
            ...prev,
            selectedKeyword: newProducts,
            selectedTagsKW: newTags
        }));
    };


    // Select All
    const handleSelectAllUpdate = (options, allSelected) => {
        trackFilterSelectAll("Keywords", allSelected, options?.length);
        let newItems = [];
        let newTags = [...(selectedFiltersWidget?.selectedTagsKW || [])];

        if (allSelected) {
            newItems = localSelectedProducts.filter(b => !options.some(opt => String(opt.value) === String(b.value)));
            
            const removedPids = options.map(opt => String(opt.keyword_name || opt.value || opt.label));
            newTags = newTags.filter(tag => {
                const tagPids = (tag.tag_details || []).map(d => String(d.sku_or_keyword));
                return !tagPids.some(pid => removedPids.includes(pid));
            });
        } else {
            const toAdd = options.filter(opt => !localSelectedProducts.some(sel => String(sel.value) === String(opt.value)));
            newItems = [...localSelectedProducts, ...toAdd];
        }

        setSelectedFiltersWidget(prev => ({
            ...prev,
            selectedKeyword: newItems,
            selectedTagsKW: newTags
        }));
    };


    // Select states

    const allVisibleSelected =
        sortedProducts.length > 0 &&
        sortedProducts.every(opt =>
            localSelectedProducts.some(
                sel =>
                    String(sel.value) ===
                    String(opt.value)
            )
        );


    const someVisibleSelected =
        !allVisibleSelected &&
        sortedProducts.some(opt =>
            localSelectedProducts.some(
                sel =>
                    String(sel.value) ===
                    String(opt.value)
            )
        );


    const showNoResults =
        sortedProducts.length === 0 &&
        (productSearch?.trim() ||
            globalSearch?.trim());


    return (

        <div className="pb-4 mb-4 border-b border-gray-100 last:border-0 last:pb-0 last:mb-0">

            <div
                className="flex items-center justify-between cursor-pointer group"
                onClick={() => onToggle("products")}
            >

                <h3 className="font-semibold text-[#1F2937] text-sm">
                    Keywords
                </h3>

                <div className="text-gray-400 group-hover:text-gray-600 transition-colors">

                    {expanded
                        ? <IoIosArrowUp size={16} />
                        : <IoIosArrowDown size={16} />
                    }

                </div>

            </div>



            <div className={`transition-all duration-300 ${expanded
                ? "max-h-[500px] mt-4 opacity-100"
                : "max-h-0 opacity-0 overflow-hidden"
                }`}>


                {sortedProducts.length > 0 ? (

                    <>

                        {/* Select All */}

                        <label className="flex items-center gap-3 group cursor-pointer mb-3">

                            <div className="relative flex items-center justify-center">

                                <input
                                    type="checkbox"
                                    checked={allVisibleSelected}

                                    ref={el =>
                                        el &&
                                        (el.indeterminate =
                                            someVisibleSelected)
                                    }

                                    onChange={() =>
                                        handleSelectAllUpdate(
                                            sortedProducts,
                                            allVisibleSelected
                                        )
                                    }

                                    className="peer appearance-none w-4 h-4 border border-gray-300 rounded focus:ring-0 checked:bg-blue-600 checked:border-blue-600 transition-all cursor-pointer"
                                />

                                <svg className="absolute w-2.5 h-2.5 text-white hidden peer-checked:block pointer-events-none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                    strokeLinecap="round"
                                    strokeLinejoin="round">

                                    <polyline points="20 6 9 17 4 12" />

                                </svg>

                            </div>

                            <span className="text-sm text-gray-700 font-medium">
                                Select All
                            </span>

                        </label>


                        {/* List */}

                        <div
                            ref={scrollRef}
                            className="max-h-[300px] overflow-y-auto pr-1 custom-scrollbar space-y-1"
                        >

                            {sortedProducts.map((option, i) => {

                                const isChecked =
                                    localSelectedProducts.some(
                                        sel =>
                                            String(sel.value) ===
                                            String(option.value)
                                    );

                                return (

                                    <label
                                        key={i}
                                        className="flex items-center gap-3 group cursor-pointer py-1.5"
                                    >

                                        <div className="relative flex items-center justify-center">

                                            <input
                                                type="checkbox"
                                                checked={isChecked}

                                                onChange={() =>
                                                    handleUpdate(
                                                        option,
                                                        isChecked
                                                    )
                                                }

                                                className="peer appearance-none w-4 h-4 border border-gray-300 rounded focus:ring-0 checked:bg-blue-600 checked:border-blue-600 transition-all cursor-pointer"
                                            />

                                            <svg className="absolute w-2.5 h-2.5 text-white hidden peer-checked:block pointer-events-none"
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                                strokeLinecap="round"
                                                strokeLinejoin="round">

                                                <polyline points="20 6 9 17 4 12" />

                                            </svg>

                                        </div>


                                        <span className={`text-sm ${isChecked
                                            ? "text-[#000000D9] font-medium"
                                            : "text-[#000000D9] group-hover:text-gray-900"
                                            }`}>

                                            {option.label || option.keyword}

                                        </span>

                                    </label>

                                );

                            })}

                        </div>

                    </>

                ) : (

                    !showNoResults &&
                    expanded && (

                        <div className="text-xs text-gray-500 py-4 text-center bg-gray-50 rounded-lg border border-dashed border-gray-200">
                            No keywords available
                        </div>

                    )

                )}


                {showNoResults && (

                    <div className="text-sm text-gray-500 py-4 text-center bg-gray-50 rounded-lg">

                        No keywords found for

                        <span className="font-semibold ml-1">

                            {productSearch || globalSearch}

                        </span>

                    </div>

                )}

            </div>

        </div>

    );

};

export default KeywordFilter;
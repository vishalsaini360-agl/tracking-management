import React, { useState, useEffect, useMemo } from "react";
import { useEbuxContext } from "../../../../Ebux/Context/EbuxProvider";
import { escapeRegExp } from "../DrawerHelper";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import { isEqual } from "lodash";

function CategoryFilterComponent({ expanded, handleToggle, handleSelectAll,
    handleCheck, searchTerm
}) {
    const {
        // kpi,
        filtersDarkStore,
        selectedFiltersWidget,
        // updateSelectedCategoryDarkStore,
        getDistinctFiltersDarkStoreFn
    } = useEbuxContext();
    const [categorySearch, setCategorySearch] = useState("");
    const [localSelectedBrands, setLocalSelectedBrands] = useState(
        selectedFiltersWidget?.selectedCategory ? [...selectedFiltersWidget.selectedCategory] : []
    );

    useEffect(() => {
        setLocalSelectedBrands(
            selectedFiltersWidget?.selectedCategory ? [...selectedFiltersWidget.selectedCategory] : []
        );
    }, [selectedFiltersWidget?.selectedCategory]);


    const handleUpdate = (option, isChecked) => {
        let newCategories;
        if (isChecked) {
            newCategories = (localSelectedBrands || []).filter(
                (c) => c.value !== option.value
            );
        } else {
            newCategories = [...((localSelectedBrands || []) || []), option];
        }
        setLocalSelectedBrands(newCategories);
    };


    const handleSelectAllUpdate = (options, allSelected) => {
        let newItems = [];
        if (allSelected) {
            newItems = (localSelectedBrands || []).filter(
                (b) => !options.some((opt) => opt.value === b.value)
            );
        } else {
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
        setLocalSelectedBrands(newItems);

    };

    const handleClearAll = () => {
        setLocalSelectedBrands([]);
        if (typeof handleSelectAll === "function") {
            handleSelectAll("category", []);
        }

    };

    const handleApplyClick = () => {
        const current = localSelectedBrands || [];
        if(isEqual(JSON.stringify(selectedFiltersWidget?.selectedCategory),JSON.stringify(current))){
            return; 
        }

        if (typeof getDistinctFiltersDarkStoreFn === "function") {
            getDistinctFiltersDarkStoreFn("category", current);
        }

        if (typeof handleCheck === "function") {
            const allOptions = Array.isArray(filtersDarkStore?.category) ? filtersDarkStore.category : [];
            allOptions.forEach((opt) => {
                const isChecked = current.some((c) => c.value === opt.value);
                handleCheck("category", opt.value, isChecked);
            });
        }
    };

    const sortedCategories = useMemo(() => {
        const list = Array.isArray(filtersDarkStore?.category) ? filtersDarkStore.category : [];
        const searchInput = (categorySearch || searchTerm || "").trim();
        if (!searchInput) return list;

        const terms = searchInput.split(";").map((t) => t.trim()).filter(Boolean);
        if (terms.length === 0) return list;

        const regexes = terms.map((t) => new RegExp(escapeRegExp(t), "i"));
        const filteredList = list.filter((item) => regexes.some((regex) => regex.test(item.label || "")));

        const selectedValues = (localSelectedBrands || []).map((c) => c.value);
        const sortedList = [...filteredList].sort((a, b) => {
            const aSelected = selectedValues.includes(a.value);
            const bSelected = selectedValues.includes(b.value);
            if (aSelected === bSelected) return 0;
            return aSelected ? -1 : 1;
        });

        return sortedList;
    }, [filtersDarkStore?.category, categorySearch, searchTerm, localSelectedBrands]);

    const allVisibleSelected =
        sortedCategories.length > 0 &&
        sortedCategories.every((opt) =>
            (localSelectedBrands || []).some((sel) => sel.value === opt.value)
        );

    const someVisibleSelected =
        sortedCategories.some((opt) =>
            (localSelectedBrands || []).some((sel) => sel.value === opt.value)
        );

    const selectAllLabel = allVisibleSelected ? "Clear All" : "Select All";
    const showNoResults = sortedCategories.length === 0 && (categorySearch?.trim() || searchTerm?.trim());
    return (
        <>
            <div className="flex flex-col px-8 p-4 space-y-8">
                <div className="border-b border-gray-100 pb-6 last:border-0">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="flex font-semibold text-gray-900 text-base">Category
                            {
                                selectedFiltersWidget?.selectedCategory?.length > 0 ?
                                    <span className="ml-1 flex items-center justify-center w-5 h-5 text-[10px] rounded-full bg-[#F0F0F0]">{selectedFiltersWidget?.selectedCategory.length}</span>
                                    : <></>
                            }
                        </h3>
                        {sortedCategories?.length > 3 && (
                            <button
                                type="button"
                                className="text-gray-500 hover:text-gray-700"
                                onClick={() => handleToggle("category")}
                            >
                                {expanded["category"] ? <IoIosArrowUp size={20} /> : <IoIosArrowDown size={20} />}
                            </button>
                        )}
                    </div>
                    <div className="relative">
                        <input type="text" placeholder="Search Category..." className="w-[70%] px-[9px] py-[2px] pr-[24px] mb-[6px] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={categorySearch} onChange={(e) => setCategorySearch(e.target.value)} />
                        {categorySearch && (
                            <RxCross2
                                size={18}
                                className="absolute right-[6.4rem] top-[45%] -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer z-10"
                                onClick={() => setCategorySearch("")}
                            />
                        )}
                    </div>
                    {sortedCategories?.length > 0 && (
                        <div className="space-y-2">
                            <div className={`space-y-2 transition-all duration-300 ${expanded["category"] ? "max-h-60 overflow-y-auto pr-2" : "max-h-[102px] overflow-hidden"}`} >

                                <label className="flex items-center font-bold gap-2 text-sm text-gray-700 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 text-blue-600 rounded"
                                        checked={allVisibleSelected}
                                        ref={(input) => {
                                            if (input) input.indeterminate = !allVisibleSelected && someVisibleSelected;
                                        }}
                                        onChange={() => {
                                            handleSelectAllUpdate(sortedCategories, allVisibleSelected)
                                        }}
                                    />
                                    {selectAllLabel}
                                </label>

                                {sortedCategories?.map((option, i) => {
                                    const isChecked = (localSelectedBrands || []).some(
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
                                                            handleCheck("category", option.value, isChecked);
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
                    )}{showNoResults && (
                        <div className="px-8 p-4 text-sm text-gray-500">
                            No category found...
                        </div>
                    )}
                    <div className="flex justify-between relative top-[8px]">
                        <button
                            type="button"
                            className="text-blue-500 text-sm font-medium mt-3 flex items-center"
                            onClick={() => handleToggle("category")}
                        >
                            {expanded["category"] ? "View Less" : "View More"}
                            <span className="ml-1">
                                {expanded["category"] ? <IoIosArrowUp size={16} /> : <IoIosArrowDown size={16} />}
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

export default CategoryFilterComponent;
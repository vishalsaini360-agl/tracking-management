import React, { useState, useEffect, useMemo } from "react";
import { useEbuxContext } from "../../../../Ebux/Context/EbuxProvider";
import { escapeRegExp } from "../DrawerHelper";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import { isEqual } from "lodash";

function ProductTypeFilterComponentDarkStore({ expanded, handleToggle, handleSelectAll, handleCheck, searchTerm }) {
    const {
        filtersDarkStore,
        selectedFiltersWidget,
        setSelectedFiltersWidget,
    } = useEbuxContext();
    
    const [productTypeSearch, setProductTypeSearch] = useState("");
    const [localSelectedProductTypes, setLocalSelectedProductTypes] = useState(
        selectedFiltersWidget?.selectedProductTypeData ? [...selectedFiltersWidget.selectedProductTypeData] : []
    );

    useEffect(() => {
        setLocalSelectedProductTypes(
            selectedFiltersWidget?.selectedProductTypeData ? [...selectedFiltersWidget.selectedProductTypeData] : []
        );
    }, [selectedFiltersWidget?.selectedProductTypeData]);

    const handleUpdate = (option, isChecked) => {
        let newProductTypes;
        if (isChecked) {
            newProductTypes = (localSelectedProductTypes || []).filter(
                (pt) => pt.value !== option.value
            );
        } else {
            newProductTypes = [...((localSelectedProductTypes || []) || []), option];
        }
        setLocalSelectedProductTypes(newProductTypes);
    };

    const handleSelectAllUpdate = (options, allSelected) => {
        let newItems = [];

        if (allSelected) {
            newItems = (localSelectedProductTypes || []).filter(
                (pt) => !options.some((opt) => opt.value === pt.value)
            );
        } else {
            const uniqueItems = [
                ...(localSelectedProductTypes || []),
                ...options.filter(
                    (opt) =>
                        !(localSelectedProductTypes || []).some(
                            (sel) => sel.value === opt.value
                        )
                ),
            ];
            newItems = uniqueItems;
        }
        setLocalSelectedProductTypes(newItems);
    };

    const handleClearAll = () => {
        setLocalSelectedProductTypes([]);
        if (typeof handleSelectAll === "function") {
            handleSelectAll("productType", []);
        }
    };

    const handleApplyClick = async () => {
        const current = localSelectedProductTypes || [];
        if (isEqual(JSON.stringify(selectedFiltersWidget?.selectedProductTypeData), JSON.stringify(current))) {
            return;
        }
        
        setSelectedFiltersWidget(prevFilters => ({
            ...prevFilters,
            selectedProductTypeData: current ?? [],
        }));

        if (typeof handleCheck === "function") {
            const allProductTypes = Array.isArray(filtersDarkStore?.productTypeData) ? filtersDarkStore.productTypeData : [];
            allProductTypes.forEach((productType) => {
                const isChecked = current.some((pt) => pt.value === productType.value);
                handleCheck("productTypeData", productType.value, !isChecked);
            });
        }
    };

    const sortedProductTypes = useMemo(() => {
        const list = Array.isArray(filtersDarkStore?.productTypeData) ? filtersDarkStore.productTypeData : [];
        const searchInput = (productTypeSearch || searchTerm || "").trim();
        if (!searchInput) { return list; }
        const safe = escapeRegExp(searchInput);
        const regex = new RegExp(safe, "i");

        const filteredList = list.filter((item) => regex.test(item.label));

        const selectedValues = (localSelectedProductTypes || []).map((pt) => pt.value);
        const sortedList = [...filteredList].sort((a, b) => {
            const aSelected = selectedValues.includes(a.value);
            const bSelected = selectedValues.includes(b.value);
            if (aSelected === bSelected) return 0;
            return aSelected ? -1 : 1;
        });
        return sortedList;
    }, [filtersDarkStore?.productTypeData, searchTerm, productTypeSearch, localSelectedProductTypes]);

    const allVisibleSelected =
        sortedProductTypes.length > 0 &&
        sortedProductTypes.every((opt) =>
            (localSelectedProductTypes || []).some((sel) => sel.value === opt.value)
        );

    const someVisibleSelected =
        sortedProductTypes.some((opt) =>
            (localSelectedProductTypes || []).some((sel) => sel.value === opt.value)
        );

    const selectAllLabel = allVisibleSelected ? "Clear All" : "Select All";
    const showNoResults = sortedProductTypes.length === 0 && (productTypeSearch?.trim() || searchTerm?.trim());

    return (
        <>
            <div className="flex flex-col px-8 p-4 space-y-8">
                <div className="border-b border-gray-100 pb-6 last:border-0">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="flex font-semibold text-gray-900 text-base">Product Type
                            {
                                selectedFiltersWidget?.selectedProductTypeData?.length > 0 ?
                                    <span className="ml-1 flex items-center justify-center w-5 h-5 text-[10px] rounded-full bg-[#F0F0F0]">
                                        {selectedFiltersWidget?.selectedProductTypeData.length}
                                    </span>
                                    : <></>
                            }
                        </h3>
                        {sortedProductTypes?.length > 3 && (
                            <button
                                type="button"
                                className="text-gray-500 hover:text-gray-700"
                                onClick={() => handleToggle("productType")}
                            >
                                {expanded["productType"] ? <IoIosArrowUp size={20} /> : <IoIosArrowDown size={20} />}
                            </button>
                        )}
                    </div>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search product type..."
                            className="w-[75%] px-[9px] py-[2px] pr-[24px] mb-[6px] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={productTypeSearch}
                            onChange={(e) => setProductTypeSearch(e.target.value)}
                        />
                        {productTypeSearch && (
                            <RxCross2
                                size={18}
                                className="absolute right-[5.4rem] top-[45%] -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer z-10"
                                onClick={() => setProductTypeSearch("")}
                            />
                        )}
                    </div>
                    {sortedProductTypes?.length > 0 && (
                        <div className="space-y-2">
                            <div className={`space-y-2 transition-all duration-300 ${expanded["productType"] ? "max-h-60 overflow-y-auto pr-2" : "max-h-[102px] overflow-hidden"}`} >
                                <label className="flex items-center font-bold gap-2 text-sm text-gray-700 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 text-blue-600 rounded"
                                        checked={allVisibleSelected}
                                        ref={(input) => {
                                            if (input) input.indeterminate = !allVisibleSelected && someVisibleSelected;
                                        }}
                                        onChange={() => {
                                            handleSelectAllUpdate(sortedProductTypes, allVisibleSelected)
                                        }}
                                    />
                                    {selectAllLabel}
                                </label>

                                {sortedProductTypes?.filter((option) => option.label != 0)?.map((option, i) => {
                                    const isChecked = (localSelectedProductTypes || []).some(
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
                                                            handleCheck("productTypeData", option.value, isChecked);
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
                            No product types found...
                        </div>
                    )}
                    <div className="flex justify-between relative top-[8px]">
                        <button
                            type="button"
                            className="text-blue-500 text-sm font-medium mt-3 flex items-center"
                            onClick={() => handleToggle("productType")}
                        >
                            {expanded["productType"] ? "View Less" : "View More"}
                            <span className="ml-1">
                                {expanded["productType"] ? <IoIosArrowUp size={16} /> : <IoIosArrowDown size={16} />}
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

export default ProductTypeFilterComponentDarkStore;
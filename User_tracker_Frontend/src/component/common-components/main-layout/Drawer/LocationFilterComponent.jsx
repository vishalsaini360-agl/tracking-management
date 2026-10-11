import React, { useMemo } from "react";
import { useEbuxContext } from "../../../Ebux/Context/EbuxProvider";
import { isOptionChecked } from "./DrawerHelper";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
// import { sortOptionsWithSelectedOnTop } from "./DrawerHelper";
// import { filter } from "lodash";
// import TreeCheckbox from "./nestedComponent/TreeCheckbox"

function LocationFilterComponent({ expanded, handleToggle, handleSelectAll,
    handleCheck
}) {
    // console.log('sectionsection222', section)
    const {
        kpi,
        filters,
        activeClientProject,
        selectedFilters,
        updateSelectedProductV2,
        updateSelectedProduct

    } = useEbuxContext();
    // console.log('filtersfiltersfilters11', filters)

    const handleUpdate = (option, isChecked) => {
        let newProducts;
        // console.log('option.value',option.value)
        if (isChecked) {
            newProducts = selectedFilters.selectedProductId.filter(
                (p) => p.value !== option.value
            );
        } else {
            newProducts = [...(selectedFilters.selectedProductId || []), option];
        }

        if (kpi === "SOS" || kpi === "OR" || kpi === "SOM" || kpi === "Wt_SOS") { return; }

        if (activeClientProject?.brandTreeSelect) {
            if (activeClientProject?.client_project_id == 4) {
                // Perfetti special case
                updateSelectedProductV2(newProducts);
            } else {
                updateSelectedProductV2(newProducts);
            }
        } else {
            updateSelectedProduct(newProducts);
        }

    };


    const handleSelectAllUpdate = (options, allSelected) => {
        const newItems = allSelected ? [] : options;
        if (kpi === "SOS" || kpi === "OR" || kpi === "SOM" || kpi === "Wt_SOS") {
            return; // skip product for these KPIs
        }

        if (activeClientProject?.brandTreeSelect) {
            if (activeClientProject?.client_project_id == 4) {
                updateSelectedProductV2(newItems);
            } else {
                updateSelectedProductV2(newItems);
            }
        } else {
            updateSelectedProduct(newItems);
        }
    };

    const sortedProducts = useMemo(() => {
        const list = Array.isArray(filters?.products) ? filters.products : [];
        return [...list].sort((a, b) => {
            const aChecked = selectedFilters?.selectedProductId?.some((sel) => sel.value === a.value);
            const bChecked = selectedFilters?.selectedProductId?.some((sel) => sel.value === b.value);
            if (aChecked === bChecked) return 0;
            return aChecked ? -1 : 1;
        });
    }, [filters?.products, selectedFilters?.selectedProductId]);

    return (
        // <div className="flex-1 overflow-y-auto px-8 p-4 space-y-8">
        <div className=" overflow-y-auto px-8 p-4 space-y-8">
            <div className="border-b border-gray-100 pb-6 last:border-0">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 text-base">Product</h3>
                    {sortedProducts?.length > 3 && (
                        <button
                            type="button"
                            className="text-gray-500 hover:text-gray-700"
                            onClick={() => handleToggle("products")}
                        >
                            {expanded["products"] ? <IoIosArrowUp size={20} /> : <IoIosArrowDown size={20} />}
                        </button>
                    )}
                </div>

                <div className="space-y-2">
                    <div className={`space-y-2 transition-all duration-300 ${expanded["products"] ? "max-h-60 overflow-y-auto pr-2" : "max-h-[102px] overflow-hidden"}`} >
                        {!searchTerm && (   // 🔹 HIGHLIGHTED
                            <label className="flex items-center font-bold gap-2 text-sm text-gray-700 cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 text-blue-600 rounded"
                                    // checked={isOptionChecked("products", filters?.products, selectedFilters?.selectedCategory)}
                                    // onChange={() => {
                                    //     const allSelected = filters?.products.every((opt) =>
                                    //         isOptionChecked("products", opt, selectedFilters)
                                    //     );
                                    //     handleSelectAllUpdate(filters?.products, allSelected);
                                    //     handleSelectAll("products", filters?.products);
                                    // }}

                                    checked={sortedProducts.every((opt) =>
                                        isOptionChecked("products", opt, selectedFilters)
                                    )}
                                    onChange={() => {
                                        const allSelected = sortedProducts.every((opt) =>
                                            isOptionChecked("products", opt, selectedFilters)
                                        );
                                        handleSelectAllUpdate(sortedProducts, allSelected);
                                        handleSelectAll("products", sortedProducts);
                                    }}
                                />
                                Select All
                            </label>
                        )} {/* 🔹 HIGHLIGHTED */}

                        {sortedProducts?.map((option, i) => {

                            const isChecked = isOptionChecked("products", option, selectedFilters);
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
                                                    handleCheck("products", option.value, isChecked); // keep drawer state in sync
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

                {sortedProducts?.length > 3 && (
                    <button
                        type="button"
                        className="text-blue-500 text-sm font-medium mt-3 flex items-center"
                        onClick={() => handleToggle("products")}
                    >
                        {expanded["products"] ? "View Less" : "View More"}
                        <span className="ml-1">
                            {expanded["products"] ? <IoIosArrowUp size={16} /> : <IoIosArrowDown size={16} />}
                        </span>
                    </button>
                )}
            </div>
        </div>
    );
}

export default LocationFilterComponent;
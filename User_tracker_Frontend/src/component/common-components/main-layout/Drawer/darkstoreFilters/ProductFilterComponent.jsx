import React, { useState, useEffect, useMemo } from "react";
import { useEbuxContext } from "../../../../Ebux/Context/EbuxProvider";
import { escapeRegExp } from "../DrawerHelper";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { Radio, RadioGroup, FormControlLabel } from "@mui/material";
import { RxCross2 } from "react-icons/rx";
import { isEqual } from "lodash";


function ProductFilterComponent({ expanded, handleToggle, handleSelectAll,
    handleCheck, searchTerm
}) {
    // console.log('sectionsection222', section)
    const {
        kpi,
        filtersDarkStore,
        activeClientProject,
        selectedFiltersWidget,
        // updateSelectedProductV2,
        // updateSelectedProductDarkStore,
        getDistinctFiltersDarkStoreFn,
        // selectedMsl,
        // updateSelectedMSLV2
        setSelectedMslFilter,
        selectedMslFilter
    } = useEbuxContext();
    // console.log('filtersfiltersfilters11', filters)
    const [productSearch, setProductSearch] = useState("");


    const [localSelectedBrands, setLocalSelectedBrands] = useState(
        selectedFiltersWidget?.selectedProductId ? [...selectedFiltersWidget.selectedProductId] : []
    );

    useEffect(() => {
        setLocalSelectedBrands(
            selectedFiltersWidget?.selectedProductId ? [...selectedFiltersWidget.selectedProductId] : []
        );
    }, [selectedFiltersWidget?.selectedProductId]);

    const getValueKey = (val) => {
        if (Array.isArray(val)) return val.join(",");
        if (val === null || val === undefined) return "";
        return String(val);
    };

    const handleUpdate = (option, isChecked) => {
        let newProducts;
        // console.log('option.value',option.value)
        if (isChecked) {
            // newProducts = (localSelectedBrands || []).filter(
            //     (p) => p.value !== option.value
            // );
            newProducts = (localSelectedBrands || []).filter(
                (p) => getValueKey(p.value) !== getValueKey(option.value)
            );
        } else {
            newProducts = [...((localSelectedBrands || []) || []), option];
        }

        if (kpi === "SOS" || kpi === "OR" || kpi === "SOM" || kpi === "Wt_SOS") { return; }


        // getDistinctFiltersDarkStoreFn('products', newProducts);
        setLocalSelectedBrands(newProducts);


    };


    const handleSelectAllUpdate = (options, allSelected) => {
        let newItems = [];

        if (allSelected) {
            // Unselect visible items only
            newItems = (localSelectedBrands || []).filter(
                (b) => !options.some((opt) => getValueKey(opt.value) === getValueKey(b.value))
            );
        } else {
            // Add all visible items, avoiding duplicates
            const uniqueItems = [
                ...(localSelectedBrands || []),
                ...options.filter(
                    (opt) =>
                        !(localSelectedBrands || []).some(
                            (sel) => getValueKey(sel.value) === getValueKey(opt.value)
                        )
                ),
            ];
            newItems = uniqueItems;
        }
        if (kpi === "SOS" || kpi === "OR" || kpi === "SOM" || kpi === "Wt_SOS") {
            return; // skip product for these KPIs
        }


        // getDistinctFiltersDarkStoreFn('products', newItems);
        setLocalSelectedBrands(newItems);

    };

    const handleClearAll = () => {
        setLocalSelectedBrands([]);
        if (typeof handleSelectAll === "function") {
            handleSelectAll("products", []);
        }

    };

    // Apply — commit local selection (call distinct filters API)
    const handleApplyClick = () => {
        const current = localSelectedBrands || [];
        if (isEqual(JSON.stringify(selectedFiltersWidget?.selectedProductId), JSON.stringify(current))) {
            return;
        }

        // call the distinct-filters API so dependent darkstore filters update
        if (typeof getDistinctFiltersDarkStoreFn === "function") {
            getDistinctFiltersDarkStoreFn("products", current);
        }

        // sync checked state for drawer UI
        if (typeof handleCheck === "function") {
            const allOptions = Array.isArray(filtersDarkStore?.products) ? filtersDarkStore.products : [];
            allOptions.forEach((opt) => {
                const isChecked = current.some((c) => getValueKey(c.value) === getValueKey(opt.value));
                handleCheck("products", opt.value, isChecked);
            });
        }
    };

    const sortedProducts = useMemo(() => {
        const rawList = Array.isArray(filtersDarkStore?.products) ? filtersDarkStore.products : [];
        const searchInput = (productSearch || searchTerm || "").trim();
        if (!searchInput) return rawList;

        const terms = searchInput.split(";").map((t) => t.trim()).filter(Boolean);
        if (terms.length === 0) return rawList;

        const regexes = terms.map((t) => new RegExp(escapeRegExp(t), "i"));
        const filteredList = rawList.filter((item) => {
            return regexes.some((regex) => {
                const labelMatch = regex.test(item.label || "");
                const pidMatch = regex.test(String(item.web_pid || ""));
                const platformIdMatch = regex.test(String(item.platform_id || item.web_pid || ""));
                const eanCodeMatch = regex.test(String(item.ean_code || ""));
                const cpCodeMatch = regex.test(String(item?.["cp code"] || ""));
                return labelMatch || pidMatch || platformIdMatch || eanCodeMatch || cpCodeMatch;
            });
        });

        const selectedValues = (localSelectedBrands || []).map((p) => getValueKey(p.value));
        const sortedList = [...filteredList].sort((a, b) => {
            const aSelected = selectedValues.includes(getValueKey(a.value));
            const bSelected = selectedValues.includes(getValueKey(b.value));
            if (aSelected === bSelected) return 0;
            return aSelected ? -1 : 1;
        });

        return sortedList;
    }, [filtersDarkStore?.products, productSearch, searchTerm, localSelectedBrands]);


    // const [selected, setSelected] = useState("all");

    // const handleChange = (event) => {
    //     const value = event.target.value;
    //     setSelected(value);
    // };


    const handleChange = (event) => {
        if ([110, 114].includes(Number(activeClientProject?.client_project_id))) {
            return;
        }
        const value = event.target.value;
        // updateSelectedMSLV2(value);  // 🔹 update globally
        //console.log('valuemsl', value)
        setSelectedMslFilter(value)
        getDistinctFiltersDarkStoreFn('msl_type', [], value);
    };

    const allVisibleSelected =
        sortedProducts.length > 0 &&
        // sortedProducts.every((opt) =>
        //     // isOptionChecked("products", opt, selectedFiltersWidget)
        //     (localSelectedBrands || []).some((sel) => sel.value === opt.value)
        // );
        sortedProducts.every((opt) =>
            (localSelectedBrands || []).some((sel) => getValueKey(sel.value) === getValueKey(opt.value))
        );

    const someVisibleSelected =
        sortedProducts.some((opt) =>
            // isOptionChecked("products", opt, selectedFiltersWidget)
            (localSelectedBrands || []).some((sel) => getValueKey(sel.value) === getValueKey(opt.value))
        );

    const selectAllLabel = allVisibleSelected ? "Clear All" : "Select All";
    const showNoResults = sortedProducts.length === 0 && (productSearch?.trim() || searchTerm?.trim());
    return (
        <>
            {/* {sortedProducts?.length > 0 && ( */}
            {(sortedProducts?.length > 0 || !searchTerm || !searchTerm?.length) && (
                <div className="flex flex-col px-8 p-4 space-y-8">
                    {/* <div className=" overflow-y-auto px-8 p-4 space-y-8"> */}
                    <div className="border-b border-gray-100 pb-6 last:border-0">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center justify-between w-[90%]">
                                <h3 className="flex font-semibold text-gray-900 text-base">Product
                                    {
                                        selectedFiltersWidget?.selectedProductId?.length > 0 ?
                                            <span className="ml-1 flex items-center justify-center w-5 h-5 text-[10px] rounded-full bg-[#F0F0F0]">{selectedFiltersWidget?.selectedProductId.length}</span>
                                            : <></>
                                    }
                                </h3>
                                {
                                    activeClientProject?.useMsl && (
                                        <div className="flex items-center space-x-4">
                                            <RadioGroup
                                                row
                                                value={selectedMslFilter ?? 'all'}   // 🔹 bind global state
                                                onChange={handleChange}
                                                className="flex items-center text-xs"
                                            >
                                                <FormControlLabel
                                                    value="all"
                                                    control={
                                                        <Radio
                                                            color="primary"
                                                            disabled={[110, 114].includes(Number(activeClientProject?.client_project_id))}
                                                            sx={{
                                                                transform: "scale(0.6)", // smaller radio
                                                                padding: "0px",
                                                            }}
                                                        />
                                                    }
                                                    disabled={[110, 114].includes(Number(activeClientProject?.client_project_id))}
                                                    label="All"
                                                    slotProps={{
                                                        typography: {
                                                            className: `!text-[14px] ${selectedFiltersWidget?.msl ?? 'all' === "all" ? "font-bold text-blue-600" : ""}`,
                                                        },
                                                    }}
                                                />
                                                <FormControlLabel
                                                    value="msl"
                                                    control={
                                                        <Radio
                                                            color="primary"
                                                            disabled={[110, 114].includes(Number(activeClientProject?.client_project_id))}
                                                            sx={{
                                                                transform: "scale(0.6)",
                                                                padding: "0px",
                                                            }}
                                                        />
                                                    }
                                                    disabled={[110, 114].includes(Number(activeClientProject?.client_project_id))}
                                                    label="MSL"
                                                    slotProps={{
                                                        typography: {
                                                            className: `!text-[14px] ${selectedFiltersWidget?.msl ?? 'all' === "msl" ? "font-bold text-blue-600 " : ""}`,
                                                        },
                                                    }}
                                                />
                                            </RadioGroup>
                                        </div>
                                    )
                                }

                            </div>
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
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search by web PID, Platform ID, EAN, Product Name..."
                                className="w-[70%] px-[9px] py-[2px] pr-[24px] mb-[6px] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={productSearch}
                                onChange={(e) => setProductSearch(e.target.value)}
                            />
                            {productSearch && (
                                <RxCross2
                                    size={18}
                                    className="absolute right-[6.4rem] top-[45%] -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer z-10"
                                    onClick={() => setProductSearch("")}
                                />
                            )}
                        </div>
                        {sortedProducts?.length > 0 && (
                            <div className="space-y-2">
                                <div className={`space-y-2 transition-all duration-300 ${expanded["products"] ? "max-h-60 overflow-y-auto pr-2" : "max-h-[102px] overflow-hidden"}`} >

                                    <label className="flex items-center font-bold gap-2 text-sm text-gray-700 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 text-blue-600 rounded"
                                            // checked={isOptionChecked("products", filters?.products, selectedFiltersWidget?.selectedCategory)}
                                            // onChange={() => {
                                            //     const allSelected = filters?.products.every((opt) =>
                                            //         isOptionChecked("products", opt, selectedFiltersWidget)
                                            //     );
                                            //     handleSelectAllUpdate(filters?.products, allSelected);
                                            //     handleSelectAll("products", filters?.products);
                                            // }}

                                            // checked={sortedProducts.every((opt) =>
                                            //     isOptionChecked("products", opt, selectedFiltersWidget)
                                            // )}
                                            checked={allVisibleSelected}
                                            ref={(input) => {
                                                if (input) input.indeterminate = !allVisibleSelected && someVisibleSelected;
                                            }}
                                            onChange={() => {
                                                handleSelectAllUpdate(sortedProducts, allVisibleSelected)
                                                // handleSelectAll("products", sortedProducts);
                                            }}
                                        />
                                        {selectAllLabel}
                                    </label>


                                    {sortedProducts?.map((option, i) => {

                                        const isChecked = (localSelectedBrands || []).some(
                                            (sel) => getValueKey(sel.value) === getValueKey(option.value)
                                        );
                                        // const isChecked = isOptionChecked("products", option, selectedFiltersWidget);
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
                                                                handleCheck("products", getValueKey(option.value), isChecked); // keep drawer state in sync
                                                            }}
                                                        />
                                                    </span>

                                                    {option.label} | {option?.web_pid}
                                                </label>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                        {showNoResults && (
                            <div className="px-8 p-4 text-sm text-gray-500">
                                No products found...
                            </div>
                        )}
                        {/* {sortedProducts?.length > 1 && ( */}
                        <div className="flex justify-between relative top-[8px]">
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
            )}
        </>
    );
}

export default ProductFilterComponent;
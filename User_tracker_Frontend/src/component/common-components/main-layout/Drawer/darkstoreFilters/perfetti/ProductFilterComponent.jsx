import React, { useState, useEffect, useMemo } from "react";
import { useEbuxContext } from "../../../../../Ebux/Context/EbuxProvider";
import { escapeRegExp } from "../../DrawerHelper";
import { IoIosArrowUp, IoIosArrowDown, IoIosInformationCircleOutline } from "react-icons/io";
import { Radio, RadioGroup, FormControlLabel } from "@mui/material";
import { RxCross2 } from "react-icons/rx";
import { isEqual } from "lodash";
import { getCombineFilterWidget } from "../../../../../Ebux/services/ebux.service";

function ProductFilterComponent({ expanded, handleToggle, handleSelectAll, handleCheck, searchTerm }) {
    const {
        kpi,
        filtersDarkStore: filters,
        activeClientProject,
        selectedFiltersWidget,
        updateSelectedProductV2,
        updateSelectedProduct,
        selectedMsl,

        setSelectedFiltersWidget,
        setFiltersDarkStore: setFilters,
        setSelectedMsl
    } = useEbuxContext();

    const [productSearch, setProductSearch] = useState("");
    const [hoveredProduct, setHoveredProduct] = useState(null);
    const [tooltipPos, setTooltipPos] = useState({ top: 0, right: 0 });
    const [localSelectedProducts, setLocalSelectedProducts] = useState(
        selectedFiltersWidget?.selectedProductId ? [...selectedFiltersWidget.selectedProductId] : []
    );

    useEffect(() => {
        setLocalSelectedProducts(
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
        // console.log('option.value', option.value)
        if (isChecked) {
            newProducts = (localSelectedProducts || []).filter(
                (p) => getValueKey(p.value) !== getValueKey(option.value)
            );
        } else {
            newProducts = [...((localSelectedProducts || []) || []), option];
        }

        if (kpi === "SOS" || kpi === "OR" || kpi === "SOM" || kpi === "Wt_SOS") { return; }

        setLocalSelectedProducts(newProducts);
    };

    const handleSelectAllUpdate = (options, allSelected) => {
        let newItems = [];
        if (allSelected) {
            newItems = (localSelectedProducts || []).filter(
                (b) => !options.some((opt) => getValueKey(opt.value) === getValueKey(b.value))
            );
        } else {
            const uniqueItems = [
                ...(localSelectedProducts || []),
                ...options.filter(
                    (opt) =>
                        !(localSelectedProducts || []).some(
                            (sel) => getValueKey(sel.value) === getValueKey(opt.value)
                        )
                ),
            ];
            newItems = uniqueItems;
        }
        if (kpi === "SOS" || kpi === "OR" || kpi === "SOM" || kpi === "Wt_SOS") {
            return;
        }
        setLocalSelectedProducts(newItems);
    };

    const handleClearAll = () => {
        setLocalSelectedProducts([]);
        if (typeof handleSelectAll === "function") {
            handleSelectAll("products", []);
        }
    };

    const handleApplyClick = async () => {
        const current = localSelectedProducts || [];
        if (isEqual(JSON.stringify(selectedFiltersWidget?.selectedProductId), JSON.stringify(current))) {
            return;
        }

        if (activeClientProject?.brandTreeSelect) {
            updateSelectedProductV2(current);
        } else {
            if ([2, 101, 102, 103].indexOf(activeClientProject?.client_project_id) > -1 || activeClientProject?.useCombineFilter) {
                const tagSkuList = selectedFiltersWidget.selectedTags?.flatMap(tag => tag?.tag_details?.map(d => d?.sku_or_keyword) ?? []) ?? [];
                let combineFilterWidget = await getCombineFilterWidget("OSA", (selectedFiltersWidget.selectedPlatform?.flatMap(i => i?.id_in_db ?? i?.value) ?? []), (selectedFiltersWidget.selectedBrand?.flatMap(i => i?.id_in_db ?? i?.value) ?? []), (selectedFiltersWidget.selectedCategory?.flatMap(i => i?.id_in_db ?? i?.value) ?? []), (selectedFiltersWidget.selectedMotherPack?.flatMap(i => i?.id_in_db ?? i?.value) ?? []), (current?.flatMap(i => i?.id_in_db ?? i?.value) ?? []), (selectedFiltersWidget.selectedRange?.flatMap(i => i?.id_in_db ?? i?.value) ?? []), selectedMsl, (tagSkuList ?? []));
                setFilters(prevFilters => ({
                    ...prevFilters,
                    platform: combineFilterWidget?.platforms ?? [],
                    brand: combineFilterWidget?.brands ?? [],
                    category: combineFilterWidget?.categories ?? [],
                    mother_pack: combineFilterWidget?.mother_packs ?? [],
                    ...(current?.length === 0 && {
                        products: combineFilterWidget?.products ?? [],
                    }),
                    ...((combineFilterWidget?.range) ? { range: combineFilterWidget?.range ?? [] } : {})
                }));

                setSelectedFiltersWidget(prevFilters => ({
                    ...prevFilters,
                    selectedProductId: current ?? [],
                }));
            } else {
                updateSelectedProduct(current);
            }
        }


        if (typeof handleCheck === "function") {
            const allProducts = Array.isArray(filters?.products) ? filters.products : [];
            allProducts.forEach((p) => {
                const isChecked = current.some((c) =>
                    getValueKey(c.value) === getValueKey(p.value)
                );
                handleCheck("products", getValueKey(p.value), !isChecked);
            });
        }
    };


    const sortedProducts = useMemo(() => {
        const rawList = Array.isArray(filters?.products) ? filters.products : [];
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

        const selectedValues = (localSelectedProducts || []).map((p) => getValueKey(p.value));
        const sortedList = [...filteredList].sort((a, b) => {
            const aSelected = selectedValues.includes(getValueKey(a.value));
            const bSelected = selectedValues.includes(getValueKey(b.value));
            if (aSelected === bSelected) return 0;
            return aSelected ? -1 : 1;
        });

        return sortedList;
    }, [filters?.products, productSearch, searchTerm, localSelectedProducts]);

    const handleChange = async (event) => {
        const value = event.target.value;
        if (activeClientProject?.brandTreeSelect) {
            const tagSkuList = selectedFiltersWidget.selectedTags?.flatMap(tag => tag?.tag_details?.map(d => d?.sku_or_keyword) ?? []) ?? [];
            let combineFilterWidget = await getCombineFilterWidget("OSA", (selectedFiltersWidget.selectedPlatform?.flatMap(i => i?.id_in_db ?? i?.value) ?? []), (selectedFiltersWidget.selectedBrand?.flatMap(i => i?.id_in_db ?? i?.value) ?? []), (selectedFiltersWidget.selectedCategory?.flatMap(i => i?.id_in_db ?? i?.value) ?? []), (selectedFiltersWidget.selectedMotherPack?.flatMap(i => i?.id_in_db ?? i?.value) ?? []), ([]), (selectedFiltersWidget.selectedRange?.flatMap(i => i?.id_in_db ?? i?.value) ?? []), value, (tagSkuList ?? []));
            setFilters(prevFilters => ({
                ...prevFilters,
                platform: combineFilterWidget?.platforms ?? [],
                brand: combineFilterWidget?.brands ?? [],
                category: combineFilterWidget?.categories ?? [],
                mother_pack: combineFilterWidget?.mother_packs ?? [],
                products: combineFilterWidget?.products ?? [],
                ...((combineFilterWidget?.range) ? { range: combineFilterWidget?.range ?? [] } : {})
            }));

            setSelectedFiltersWidget(prevFilters => ({
                ...prevFilters,
                selectedProductId: prevFilters?.selectedProductId?.length > 0 ? (combineFilterWidget?.products ?? []) : [],
            }));
            setSelectedMsl(value);
        }
    };

    const allVisibleSelected =
        sortedProducts.length > 0 &&
        sortedProducts.every((opt) =>
            (localSelectedProducts || []).some((sel) => getValueKey(sel.value) === getValueKey(opt.value))
        );

    const someVisibleSelected =
        sortedProducts.some((opt) =>
            (localSelectedProducts || []).some((sel) => getValueKey(sel.value) === getValueKey(opt.value))
        );

    const selectAllLabel = allVisibleSelected ? "Clear All" : "Select All";
    const showNoResults = sortedProducts.length === 0 && (productSearch?.trim() || searchTerm?.trim());
    return (
        <>

            <div className="flex flex-col px-8 p-4 space-y-8">
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
                                            value={selectedMsl}   // 🔹 bind global state
                                            onChange={handleChange}
                                            className="flex items-center text-xs"
                                        >
                                            <FormControlLabel
                                                value="all"
                                                control={
                                                    <Radio
                                                        color="primary"
                                                        sx={{
                                                            transform: "scale(0.6)", // smaller radio
                                                            padding: "0px",
                                                        }}
                                                    />
                                                }
                                                disabled={[101, 102].includes(activeClientProject?.client_project_id)}
                                                label="All"
                                                slotProps={{
                                                    typography: {
                                                        className: `!text-[12px] ${selectedMsl === "all" ? "font-bold text-blue-600" : ""}`,
                                                    },
                                                }}
                                            />
                                            <FormControlLabel
                                                value="msl"
                                                control={
                                                    <Radio
                                                        color="primary"
                                                        sx={{
                                                            transform: "scale(0.6)",
                                                            padding: "0px",
                                                        }}
                                                    />
                                                }
                                                disabled={[101, 102].includes(activeClientProject?.client_project_id)}
                                                label="MSL"
                                                slotProps={{
                                                    typography: {
                                                        className: `!text-[12px] ${selectedMsl === "msl" ? "font-bold text-blue-600 " : ""}`,
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
                    {(sortedProducts?.length > 0) && (
                        <div className="space-y-2">
                            <div className={`space-y-2 transition-all duration-300 ${expanded["products"] ? "max-h-60 overflow-y-auto pr-2" : "max-h-[102px] overflow-hidden"}`} >

                                <label className="flex items-center font-bold gap-2 text-sm text-gray-700 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 text-blue-600 rounded"
                                        checked={allVisibleSelected}
                                        ref={(input) => {
                                            if (input) input.indeterminate = !allVisibleSelected && someVisibleSelected;
                                        }}
                                        onChange={() => {
                                            handleSelectAllUpdate(sortedProducts, allVisibleSelected)
                                        }}
                                    />
                                    {selectAllLabel}
                                </label>


                                {sortedProducts?.map((option, i) => {
                                    const isChecked = (localSelectedProducts || []).some((sel) => getValueKey(sel.value) === getValueKey(option.value));
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
                                                            handleCheck("products", getValueKey(option.value), isChecked);
                                                        }}
                                                    />
                                                </span>

                                                <span className="flex-1 truncate" title={option.label}>
                                                    {option.label} | {option?.web_pid}
                                                    {
                                                        ([1].indexOf(activeClientProject?.client_project_id) > -1) ? `| ${option?.["cp code"]}` : ""
                                                    }
                                                </span>
                                                <div
                                                    className="ml-auto cursor-help p-1 group/icon"
                                                    onMouseEnter={(e) => {
                                                        const rect = e.currentTarget.getBoundingClientRect();
                                                        setHoveredProduct(option);
                                                        setTooltipPos({
                                                            top: rect.top + rect.height / 2,
                                                            right: window.innerWidth - rect.left + 8
                                                        });
                                                    }}
                                                    onMouseLeave={() => setHoveredProduct(null)}
                                                >
                                                    <IoIosInformationCircleOutline
                                                        size={16}
                                                        className="text-gray-400 group-hover/icon:text-blue-500"
                                                    />
                                                </div>


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
                </div>

                {hoveredProduct && (
                    <div
                        className="fixed z-[10000] p-2 bg-[#1e293b] text-white text-[11px] rounded-md shadow-2xl border border-slate-700 w-max max-w-[420px] pointer-events-none"
                        style={{
                            top: tooltipPos.top,
                            right: tooltipPos.right - 10,
                            transform: 'translateY(-50%)'
                        }}
                    >
                        <div className="flex flex-col gap-0.5 font-sans text-left">
                            <div className="flex gap-1"><span className="font-bold whitespace-nowrap">web pid:</span><span className="break-all">{hoveredProduct.web_pid || "N/A"}</span></div>
                            <div className="flex gap-1"><span className="font-bold whitespace-nowrap">Platform ID:</span><span className="break-all">{hoveredProduct.platform_id || hoveredProduct.web_pid || "N/A"}</span></div>
                            <div className="flex gap-1"><span className="font-bold whitespace-nowrap">EAN Code:</span><span>{hoveredProduct.ean_code || "N/A"}</span></div>
                            <div className="flex gap-1"><span className="font-bold whitespace-nowrap">Brand Pack SKU:</span><span className="break-all">{hoveredProduct["reseller_id"] || "N/A"}</span></div>
                            <div className="flex gap-1 flex-wrap"><span className="font-bold whitespace-nowrap">Product Name:</span><span className="whitespace-normal leading-tight">{hoveredProduct.label}</span></div>
                        </div>
                        {/* Arrow */}
                        <div className="absolute right-[-5px] top-[24%] -translate-y-1/2 border-l-[5px] border-l-[#1e293b] border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent" />
                    </div>
                )}
            </div>

        </>
    );
}

export default ProductFilterComponent;

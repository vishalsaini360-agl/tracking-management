import React, { useState, useEffect, useMemo } from "react";
import { useEbuxContext } from "../../../Ebux/Context/EbuxProvider";
import { escapeRegExp } from "./DrawerHelper";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { Radio, RadioGroup, FormControlLabel } from "@mui/material";
import { RxCross2 } from "react-icons/rx";
import { isEqual } from "lodash";
import { ENTITY_TYPE, EVENTS, getTrackerContext, trackCustomEvent, TRACKING_COMPONENT } from "../../../../tracker";
import { getCombineFilterWidget, getEbuxLocationsNew } from "../../../Ebux/services/ebux.service";

function ProductFilterComponent({ expanded, handleToggle, handleSelectAll, handleCheck, searchTerm }) {
    const {
        kpi,
        filters, selectedFilters,
        activeClientProject,
        selectedFiltersWidget,
        updateSelectedProductV2,
        updateSelectedProduct,
        selectedMsl,
        selectedMslFilter,
        updateSelectedMSLV2,

        setSelectedFiltersWidget,
        setFilters,
        // setSelectedMsl,
        setSelectedMslFilter,
        getPincodesfromLocation
    } = useEbuxContext();

    // const [localMsl, setLocalMsl] = useState(selectedMslFilter);
    const [productSearch, setProductSearch] = useState("");
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
        trackCustomEvent(
            allSelected ? EVENTS.UNSELECT_ALL : EVENTS.SELECT_ALL,
            { section: "products", action: allSelected ? "unselect_all" : "select_all", count: options?.length },
            ENTITY_TYPE.FILTER,
            getTrackerContext(kpi, null, { component_type: TRACKING_COMPONENT.CHECKBOX })
        );
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
        trackCustomEvent(
            EVENTS.CLEAR_ALL,
            { section: "products" },
            ENTITY_TYPE.FILTER,
            getTrackerContext(kpi, null, { component_type: TRACKING_COMPONENT.DRAWER })
        );
        setLocalSelectedProducts([]);
        if (typeof handleSelectAll === "function") {
            handleSelectAll("products", []);
        }
    };

    const handleApplyClick = async () => {
        const current = localSelectedProducts || [];
        trackCustomEvent(
            EVENTS.APPLY,
            { section: "products", selected_count: current.length, selected: current.map(c => c.label || c.value) },
            ENTITY_TYPE.FILTER,
            getTrackerContext(kpi, null, { component_type: TRACKING_COMPONENT.DRAWER })
        );
        if (isEqual(JSON.stringify(selectedFiltersWidget?.selectedProductId), JSON.stringify(current))) {
            return;
        }

        if (activeClientProject?.brandTreeSelect) {
            updateSelectedProductV2(current);
        } else {
            if ([2, 101, 102, 103].indexOf(activeClientProject?.client_project_id) > -1 || activeClientProject?.useCombineFilter) {
                const tagSkuList = selectedFiltersWidget.selectedTags?.flatMap(tag => tag?.tag_details?.map(d => d?.sku_or_keyword) ?? []) ?? [];
                let combineFilterWidget;
                let apiResponse = {};
                if (activeClientProject?.isFilterDateWise) {
                    const dateRangeData = { calendarType: selectedFilters?.calendarType, selectedDateRange: selectedFilters?.selectedDateRange, selectedWeeks: selectedFilters?.selectedWeeks };
                    combineFilterWidget = await getCombineFilterWidget((kpi == "BUYBOX" ? "BUYBOX" : "OSA"), (selectedFiltersWidget.selectedPlatform?.flatMap(i => i?.id_in_db ?? i?.value) ?? []), (selectedFiltersWidget.selectedBrand?.flatMap(i => i?.id_in_db ?? i?.value) ?? []), (selectedFiltersWidget.selectedCategory?.flatMap(i => i?.id_in_db ?? i?.value) ?? []), (selectedFiltersWidget.selectedMotherPack?.flatMap(i => i?.id_in_db ?? i?.value) ?? []), (current?.flatMap(i => i?.id_in_db ?? i?.value) ?? []), (selectedFiltersWidget.selectedRange?.flatMap(i => i?.id_in_db ?? i?.value) ?? []), selectedMsl, (tagSkuList ?? []), dateRangeData);
                    apiResponse.res_location_new_pdp = await getEbuxLocationsNew("OSA", (combineFilterWidget?.platforms?.map(i => i.value) ?? []), (selectedFilters?.active_location_status), dateRangeData);
                    apiResponse.location_pdp = getPincodesfromLocation(apiResponse.res_location_new_pdp);
                } else {
                    combineFilterWidget = await getCombineFilterWidget((kpi == "BUYBOX" ? "BUYBOX" : "OSA"), (selectedFiltersWidget.selectedPlatform?.flatMap(i => i?.id_in_db ?? i?.value) ?? []), (selectedFiltersWidget.selectedBrand?.flatMap(i => i?.id_in_db ?? i?.value) ?? []), (selectedFiltersWidget.selectedCategory?.flatMap(i => i?.id_in_db ?? i?.value) ?? []), (selectedFiltersWidget.selectedMotherPack?.flatMap(i => i?.id_in_db ?? i?.value) ?? []), (current?.flatMap(i => i?.id_in_db ?? i?.value) ?? []), (selectedFiltersWidget.selectedRange?.flatMap(i => i?.id_in_db ?? i?.value) ?? []), selectedMsl, (tagSkuList ?? []));
                }

                setFilters(prevFilters => ({
                    ...prevFilters,
                    platform: combineFilterWidget?.platforms ?? [],
                    brand: combineFilterWidget?.brands ?? [],
                    category: combineFilterWidget?.categories ?? [],
                    mother_pack: combineFilterWidget?.mother_packs ?? [],
                    ...((combineFilterWidget?.range) ? { range: combineFilterWidget?.range ?? [] } : {}),
                    ...(current?.length === 0 && {
                        products: combineFilterWidget?.products ?? [],
                    }),
                    location: apiResponse?.res_location_new_pdp ?? [],
                    locationPincode: apiResponse?.location_pdp ?? [],
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
                handleCheck("products", getValueKey(p.value), !isChecked, p.label, true);
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
                const cpCodeMatch = regex.test(String(item?.["cp code"] || ""));
                return labelMatch || pidMatch || cpCodeMatch;
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
        if ([110, 114].includes(Number(activeClientProject?.client_project_id))) {
            return;
        }
        const value = event.target.value;
        trackCustomEvent(
            EVENTS.RADIO,
            { item: value === "msl" ? "MSL" : "All", section: "product_filter", msl_type: value },
            ENTITY_TYPE.FILTER,
            getTrackerContext(kpi, null, { component_type: TRACKING_COMPONENT.DRAWER })
        );
        if ([2].indexOf(activeClientProject?.client_project_id) > -1) {
            const tagSkuList = selectedFiltersWidget.selectedTags?.flatMap(tag => tag?.tag_details?.map(d => d?.sku_or_keyword) ?? []) ?? [];
            let combineFilterWidget;
            if (activeClientProject?.isFilterDateWise) {
                const dateRangeData = { calendarType: selectedFilters?.calendarType, selectedDateRange: selectedFilters?.selectedDateRange, selectedWeeks: selectedFilters?.selectedWeeks };
                combineFilterWidget = await getCombineFilterWidget((kpi == "BUYBOX" ? "BUYBOX" : "OSA"), (selectedFiltersWidget.selectedPlatform?.flatMap(i => i?.id_in_db ?? i?.value) ?? []), (selectedFiltersWidget.selectedBrand?.flatMap(i => i?.id_in_db ?? i?.value) ?? []), (selectedFiltersWidget.selectedCategory?.flatMap(i => i?.id_in_db ?? i?.value) ?? []), (selectedFiltersWidget.selectedMotherPack?.flatMap(i => i?.id_in_db ?? i?.value) ?? []), (selectedFiltersWidget.selectedProductId?.flatMap(i => i?.id_in_db ?? i?.value) ?? []), (selectedFiltersWidget.selectedRange?.flatMap(i => i?.id_in_db ?? i?.value) ?? []), value, (tagSkuList ?? []), dateRangeData);
            } else {
                combineFilterWidget = await getCombineFilterWidget((kpi == "BUYBOX" ? "BUYBOX" : "OSA"), (selectedFiltersWidget.selectedPlatform?.flatMap(i => i?.id_in_db ?? i?.value) ?? []), (selectedFiltersWidget.selectedBrand?.flatMap(i => i?.id_in_db ?? i?.value) ?? []), (selectedFiltersWidget.selectedCategory?.flatMap(i => i?.id_in_db ?? i?.value) ?? []), (selectedFiltersWidget.selectedMotherPack?.flatMap(i => i?.id_in_db ?? i?.value) ?? []), (selectedFiltersWidget.selectedProductId?.flatMap(i => i?.id_in_db ?? i?.value) ?? []), (selectedFiltersWidget.selectedRange?.flatMap(i => i?.id_in_db ?? i?.value) ?? []), value, (tagSkuList ?? []));
            }
            setFilters(prevFilters => ({
                ...prevFilters,
                platform: combineFilterWidget?.platforms ?? [],
                brand: combineFilterWidget?.brands ?? [],
                category: combineFilterWidget?.categories ?? [],
                mother_pack: combineFilterWidget?.mother_packs ?? [],
                products: combineFilterWidget?.products ?? [],
                ...((combineFilterWidget?.range) ? { range: combineFilterWidget?.range ?? [] } : {})
            }));

            // setSelectedFiltersWidget(prevFilters => ({
            //     ...prevFilters,
            //     selectedProductId: prevFilters?.selectedProductId?.length > 0 ? (combineFilterWidget?.products ?? []) : [],
            // }));
            // setSelectedMsl(value);
            // setLocalMsl(value)
            setSelectedMslFilter(value)
        } else {
            updateSelectedMSLV2(value);
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
                                            value={selectedMslFilter}   // 🔹 bind global state
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
                                                        className: `!text-[12px] ${selectedMsl === "all" ? "font-bold text-blue-600" : ""}`,
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
                            placeholder="Search products or web PID..."
                            className="w-[70%] px-[9px] py-[2px] pr-[24px] mb-[6px] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={productSearch}
                            onChange={(e) => setProductSearch(e.target.value)}
                            onBlur={(e) => {
                                if (e.target.value?.trim()) {
                                    trackCustomEvent(
                                        EVENTS.SEARCH,
                                        { section: "products", search_term: e.target.value },
                                        ENTITY_TYPE.FILTER,
                                        getTrackerContext(kpi, null, { component_type: TRACKING_COMPONENT.DRAWER })
                                    );
                                }
                            }}
                        />
                        {productSearch && (
                            <RxCross2
                                size={18}
                                className="absolute right-[6.4rem] top-[45%] -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer z-10"
                                onClick={() => {
                                    trackCustomEvent(
                                        EVENTS.CLEAR,
                                        { section: "products", action: "clear_search" },
                                        ENTITY_TYPE.FILTER,
                                        getTrackerContext(kpi, null, { component_type: TRACKING_COMPONENT.DRAWER })
                                    );
                                    setProductSearch("");
                                }}
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
                                                            handleCheck("products", getValueKey(option.value), isChecked, option.label);
                                                        }}
                                                    />
                                                </span>

                                                {option.label} | {option?.web_pid}
                                                {
                                                    ([1].indexOf(activeClientProject?.client_project_id) > -1) ? `| ${option?.["cp code"]}` : ""
                                                }


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
            </div>

        </>
    );
}

export default ProductFilterComponent;
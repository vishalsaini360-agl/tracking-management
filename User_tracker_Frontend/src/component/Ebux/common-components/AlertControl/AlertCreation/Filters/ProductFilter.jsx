import React, { useState, useEffect, useMemo, useRef } from "react";
import { useEbuxContext } from "../../../../Context/EbuxProvider";
import { useAlertContext } from "../../Context/AlertProvider";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { trackFilterCheck, trackFilterSelectAll } from "./filterTracker";

const escapeRegExp = (string) => {
    return string ? string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") : "";
};

import { Radio, RadioGroup, FormControlLabel } from "@mui/material";
import { getCombineFilterWidget } from "../../../../services/ebux.service";

const ProductFilter = ({ expanded, onToggle, globalSearch = "" }) => {

    const {
        selectedFiltersWidget,
        setSelectedFiltersWidget,
        activeClientProject,
        selectedMsl,
        updateSelectedMSLV2,
        setSelectedMsl,
        selectedFilters
    } = useEbuxContext();
    const { filters, setFilters } = useAlertContext();

    const [productSearch] = useState("");
    const [localSelectedProducts, setLocalSelectedProducts] = useState([]);

    const scrollRef = useRef(null);

    const handleChange = async (event) => {
        const value = event.target.value;
        if ([2].indexOf(activeClientProject?.client_project_id) > -1) {
            const tagSkuList = selectedFiltersWidget.selectedTags?.flatMap(tag => tag?.tag_details?.map(d => d?.sku_or_keyword) ?? []) ?? [];
            let combineFilterWidget;
            if (activeClientProject?.isFilterDateWise) {
                const dateRangeData = { calendarType: selectedFilters?.calendarType, selectedDateRange: selectedFilters?.selectedDateRange, selectedWeeks: selectedFilters?.selectedWeeks };
                combineFilterWidget = await getCombineFilterWidget("OSA", (selectedFiltersWidget.selectedPlatform?.flatMap(i => i?.id_in_db ?? i?.value) ?? []), (selectedFiltersWidget.selectedBrand?.flatMap(i => i?.id_in_db ?? i?.value) ?? []), (selectedFiltersWidget.selectedCategory?.flatMap(i => i?.id_in_db ?? i?.value) ?? []), (selectedFiltersWidget.selectedMotherPack?.flatMap(i => i?.id_in_db ?? i?.value) ?? []), ([]), (selectedFilters.selectedRange?.flatMap(i => i?.id_in_db ?? i?.value) ?? []), value, (tagSkuList ?? []), dateRangeData);
            } else {
                combineFilterWidget = await getCombineFilterWidget("OSA", (selectedFiltersWidget.selectedPlatform?.flatMap(i => i?.id_in_db ?? i?.value) ?? []), (selectedFiltersWidget.selectedBrand?.flatMap(i => i?.id_in_db ?? i?.value) ?? []), (selectedFiltersWidget.selectedCategory?.flatMap(i => i?.id_in_db ?? i?.value) ?? []), (selectedFiltersWidget.selectedMotherPack?.flatMap(i => i?.id_in_db ?? i?.value) ?? []), ([]), (selectedFilters.selectedRange?.flatMap(i => i?.id_in_db ?? i?.value) ?? []), value, (tagSkuList ?? []));
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

            setSelectedFiltersWidget(prevFilters => ({
                ...prevFilters,
                selectedProductId: prevFilters?.selectedProductId?.length > 0 ? (combineFilterWidget?.products ?? []) : [],
            }));
            setSelectedMsl(value);
        } else {
            updateSelectedMSLV2(value);
        }
    };

    // Sync with context
    useEffect(() => {

        setLocalSelectedProducts(
            selectedFiltersWidget?.selectedProductId
                ? [...selectedFiltersWidget.selectedProductId]
                : []
        );

    }, [selectedFiltersWidget?.selectedProductId]);


    // Filter + Sort
    const sortedProducts = useMemo(() => {

        const list =
            Array.isArray(filters?.products)
                ? filters.products
                : [];

        const searchInput =
            (productSearch || globalSearch || "").trim();

        if (!searchInput) return list;

        const terms = searchInput.split(";").map(t => t.trim()).filter(Boolean);
        if (terms.length === 0) return list;

        const regexes = terms.map(t => new RegExp(escapeRegExp(t), "i"));
        const filteredList =
            list.filter(item =>
                regexes.some(regex => regex.test(item.label || item.name || "") || regex.test(item.web_pid || ""))
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
        filters?.products,
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
        trackFilterCheck("Products", option, isChecked);
        let newProducts;
        let newTags = [...(selectedFiltersWidget?.selectedTags || [])];

        if (isChecked) {
            newProducts = localSelectedProducts.filter(b => String(b.value) !== String(option.value));

            const removedPid = String(option.web_pid || option.value);
            newTags = newTags.filter(tag => {
                const tagPids = (tag.tag_details || []).map(d => String(d.sku_or_keyword));
                return !tagPids.includes(removedPid);
            });
        } else {
            newProducts = [...localSelectedProducts, option];
        }

        setSelectedFiltersWidget(prev => ({
            ...prev,
            selectedProductId: newProducts,
            selectedTags: newTags
        }));
    };


    // Select All
    const handleSelectAllUpdate = (options, allSelected) => {
        trackFilterSelectAll("Products", allSelected, options?.length);
        let newItems = [];
        let newTags = [...(selectedFiltersWidget?.selectedTags || [])];

        if (allSelected) {
            newItems = localSelectedProducts.filter(b => !options.some(opt => String(opt.value) === String(b.value)));

            const removedPids = options.map(opt => String(opt.web_pid || opt.value));
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
            selectedProductId: newItems,
            selectedTags: newTags
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

                <div className="flex items-center gap-4">
                    <h3 className="font-semibold text-[##000000D9] text-base">
                        Products
                    </h3>

                    {
                        activeClientProject?.useMsl && (
                            <div className="flex items-center space-x-4" onClick={(e) => e.stopPropagation()}>
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

                                            {option.label} {option?.web_pid ? `| ${option.web_pid}` : ""}
                                            {
                                                ([1].indexOf(activeClientProject?.client_project_id) > -1) ? `| ${option?.["cp code"]}` : ""
                                            }

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
                            No products available
                        </div>

                    )

                )}


                {showNoResults && (

                    <div className="text-sm text-gray-500 py-4 text-center bg-gray-50 rounded-lg">

                        No products found for

                        <span className="font-semibold ml-1">

                            {productSearch || globalSearch}

                        </span>

                    </div>

                )}

            </div>

        </div>

    );

};

export default ProductFilter;
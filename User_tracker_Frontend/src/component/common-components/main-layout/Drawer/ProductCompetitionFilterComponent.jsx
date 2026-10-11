import React, { useState, useEffect, useMemo } from "react";
import { useEbuxContext } from "../../../Ebux/Context/EbuxProvider";
import { escapeRegExp } from "./DrawerHelper";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import { isEqual } from "lodash";
import { ENTITY_TYPE, EVENTS, getTrackerContext, trackCustomEvent, TRACKING_COMPONENT } from "../../../../tracker";
import { getCombineFilterCompetitionWidget } from "../../../Ebux/services/ebux.service";

function ProductCompetitionFilterComponent({ expanded, handleToggle, handleSelectAll, handleCheck, searchTerm }) {
    const {
        kpi,
        filters,
        setFilters,
        selectedFilters,
        // selectedFiltersCompetition,
        selectedFiltersWidget,
        setSelectedFiltersWidget,
    } = useEbuxContext();
    const [productSearch, setProductSearch] = useState("");

    const [localSelectedProducts, setLocalSelectedProducts] = useState(
        selectedFiltersWidget?.selectedProductCompetition ? [...selectedFiltersWidget.selectedProductCompetition] : []
    );

    useEffect(() => {
        setLocalSelectedProducts(
            selectedFiltersWidget?.selectedProductCompetition ? [...selectedFiltersWidget.selectedProductCompetition] : []
        );
    }, [selectedFiltersWidget?.selectedProductCompetition]);

    const handleUpdate = (option, isChecked) => {
        let newProducts;
        if (isChecked) {
            newProducts = (localSelectedProducts || []).filter(
                (p) => p.value !== option.value
            );
        } else {
            newProducts = [...((localSelectedProducts || []) || []), option];
        }
        setLocalSelectedProducts(newProducts);
    };

    const handleSelectAllUpdate = (options, allSelected) => {
        trackCustomEvent(
            allSelected ? EVENTS.UNSELECT_ALL : EVENTS.SELECT_ALL,
            { section: "product_competition", action: allSelected ? "unselect_all" : "select_all", count: options?.length },
            ENTITY_TYPE.FILTER,
            getTrackerContext(kpi, null, { component_type: TRACKING_COMPONENT.CHECKBOX })
        );
        let newItems = [];

        if (allSelected) {
            newItems = (localSelectedProducts || []).filter(
                (p) => !options.some((opt) => opt.value === p.value)
            );
        } else {
            const uniqueItems = [
                ...(localSelectedProducts || []),
                ...options.filter(
                    (opt) =>
                        !(localSelectedProducts || []).some(
                            (sel) => sel.value === opt.value
                        )
                ),
            ];
            newItems = uniqueItems;
        }
        setLocalSelectedProducts(newItems);
    };

    const handleClearAll = () => {
        trackCustomEvent(
            EVENTS.CLEAR_ALL,
            { section: "product_competition" },
            ENTITY_TYPE.FILTER,
            getTrackerContext(kpi, null, { component_type: TRACKING_COMPONENT.DRAWER })
        );
        setLocalSelectedProducts([]);
        if (typeof handleSelectAll === "function") {
            handleSelectAll("ProductCompetitionFilterComponent", []);
        }

    };

    const handleApplyClick = async () => {
        const current = localSelectedProducts || [];
        trackCustomEvent(
            EVENTS.APPLY,
            { section: "product_competition", selected_count: current.length, selected: current.map((c) => c.label || c.value) },
            ENTITY_TYPE.FILTER,
            getTrackerContext(kpi, null, { component_type: TRACKING_COMPONENT.DRAWER })
        );
        if (isEqual(JSON.stringify(selectedFiltersWidget?.selectedProductCompetition), JSON.stringify(current))) {
            return;
        }

        const bid = [...new Set(current?.flatMap(i => i?.id_in_db ?? i.value) ?? [])];
        const dateRangeData = { calendarType: selectedFilters?.calendarType, selectedDateRange: selectedFilters?.selectedDateRange, selectedWeeks: selectedFilters?.selectedWeeks };
        let combineFilterCompetitionWidget = await getCombineFilterCompetitionWidget("OSA", [], selectedFiltersWidget?.selectedBrandCompetition?.flatMap(i => i?.id_in_db ?? i?.value) ?? [], [], [], (bid ?? []), "", [], dateRangeData, filters, selectedFilters);

        setSelectedFiltersWidget(prevFilters => ({
            ...prevFilters,
            selectedProductCompetition: current ?? [],
            // selectedBrandCompetition: combineFilterCompetitionWidget?.brands ?? [],
            selectedCategoryCompetition: combineFilterCompetitionWidget?.categories ?? [],
            selectedPlatformCompetition: combineFilterCompetitionWidget?.platforms ?? [],
        }));

        setFilters(prevFilters => ({
            ...prevFilters,
            res_brand_competition: combineFilterCompetitionWidget?.brands ?? [],
            res_category_competition: combineFilterCompetitionWidget?.categories ?? [],
            res_platform_competition: combineFilterCompetitionWidget?.platforms ?? [],
        }));

        if (typeof handleCheck === "function") {
            const allProducts = Array.isArray(filters?.res_products_competition) ? filters.res_products_competition : [];
            allProducts.forEach((product) => {
                const isChecked = current.some((p) => p.value === product.value);
                handleCheck("res_products_competition", product.value, !isChecked, product.label, true);

            });
        }
    };

    const sortedProducts = useMemo(() => {
        const list = Array.isArray(filters?.res_products_competition) ? filters.res_products_competition : [];
        const searchInput = (productSearch || searchTerm || "").trim();
        if (!searchInput) { return list; }

        const terms = searchInput.split(";").map((t) => t.trim()).filter(Boolean);
        if (terms.length === 0) { return list; }

        const regexes = terms.map((t) => new RegExp(escapeRegExp(t), "i"));
        const filteredList = list.filter((item) => regexes.some((regex) => regex.test(item.label || "")));

        const selectedValues = (localSelectedProducts || []).map((p) => p.value);
        const sortedList = [...filteredList].sort((a, b) => {
            const aSelected = selectedValues.includes(a.value);
            const bSelected = selectedValues.includes(b.value);
            if (aSelected === bSelected) return 0;
            return aSelected ? -1 : 1;
        });
        return sortedList;
    }, [filters?.res_products_competition, searchTerm, productSearch, localSelectedProducts]);

    const allVisibleSelected =
        sortedProducts.length > 0 &&
        sortedProducts.every((opt) =>
            (localSelectedProducts || []).some((sel) => sel.value === opt.value)
        );

    const someVisibleSelected =
        sortedProducts.some((opt) =>
            (localSelectedProducts || []).some((sel) => sel.value === opt.value)
        );

    const selectAllLabel = allVisibleSelected ? "Clear All" : "Select All";
    const showNoResults = sortedProducts.length === 0 && (productSearch?.trim() || searchTerm?.trim());
    return (
        <>
            <div className="flex flex-col px-8 p-4 space-y-8">
                <div className="border-b border-gray-100 pb-6 last:border-0">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="flex font-semibold text-gray-900 text-base">Competition Product
                            {
                                selectedFiltersWidget?.selectedProductCompetition?.length > 0 ?
                                    <span className="ml-1 flex items-center justify-center w-5 h-5 text-[10px] rounded-full bg-[#F0F0F0]">{selectedFiltersWidget?.selectedProductCompetition.length}</span>
                                    : <></>
                            }
                        </h3>
                        {sortedProducts?.length > 3 && (
                            <button
                                type="button"
                                className="text-gray-500 hover:text-gray-700"
                                onClick={() => handleToggle("product_competition")}
                            >
                                {expanded["product_competition"] ? <IoIosArrowUp size={20} /> : <IoIosArrowDown size={20} />}
                            </button>
                        )}
                    </div>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search Competition Product..."
                            className="w-[75%] px-[9px] py-[2px] pr-[24px] mb-[6px] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={productSearch}
                            onChange={(e) => setProductSearch(e.target.value)}
                            onBlur={(e) => {
                                if (e.target.value?.trim()) {
                                    trackCustomEvent(
                                        EVENTS.SEARCH,
                                        {
                                            section: "competition_product",
                                            search_term: e.target.value
                                        },
                                        ENTITY_TYPE.FILTER,
                                        getTrackerContext(kpi, null, { component_type: TRACKING_COMPONENT.DRAWER })
                                    );
                                }
                            }}
                        />
                        {productSearch && (
                            <RxCross2
                                size={18}
                                className="absolute right-[5.4rem] top-[45%] -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer z-10"
                                onClick={() => {
                                    trackCustomEvent(
                                        EVENTS.CLEAR,
                                        {
                                            section: "competition_product",
                                            action: "clear_search"
                                        },
                                        ENTITY_TYPE.FILTER,
                                        getTrackerContext(kpi, null, { component_type: TRACKING_COMPONENT.DRAWER })
                                    );
                                    setProductSearch("");
                                }}
                            />
                        )}
                    </div>
                    {sortedProducts?.length > 0 && (
                        <div className="space-y-2">
                            <div className={`space-y-2 transition-all duration-300 ${expanded["product_competition"] ? "max-h-60 overflow-y-auto pr-2" : "max-h-[102px] overflow-hidden"}`} >
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
                                    const isChecked = (localSelectedProducts || []).some(
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
                                                            handleCheck("ProductCompetitionFilterComponent", option.value, isChecked, option.label);
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
                            No products found...
                        </div>
                    )}
                    <div className="flex justify-between relative top-[8px]">
                        <button
                            type="button"
                            className="text-blue-500 text-sm font-medium mt-3 flex items-center"
                            onClick={() => {
                                trackCustomEvent(
                                    expanded["product_competition"] ? EVENTS.VIEW_LESS : EVENTS.VIEW_MORE,
                                    { section: "competition_product" },
                                    ENTITY_TYPE.FILTER,
                                    getTrackerContext(kpi, null, { component_type: TRACKING_COMPONENT.DRAWER })
                                );
                                handleToggle("product_competition");
                            }}
                        >
                            {expanded["product_competition"] ? "View Less" : "View More"}
                            <span className="ml-1">
                                {expanded["product_competition"] ? <IoIosArrowUp size={16} /> : <IoIosArrowDown size={16} />}
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

export default ProductCompetitionFilterComponent;

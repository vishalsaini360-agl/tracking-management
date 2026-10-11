import React, { useState, useEffect, useMemo } from "react";
import { useEbuxContext } from "../../../Ebux/Context/EbuxProvider";
import { escapeRegExp } from "./DrawerHelper";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import { isEqual } from "lodash";
import { ENTITY_TYPE, EVENTS, getTrackerContext, trackCustomEvent, TRACKING_COMPONENT } from "../../../../tracker";
import { getCombineFilterWidget, getCombineFilterWidgetKW, getCombineFilterCompetitionWidget } from "../../../Ebux/services/ebux.service";
import { fetchGlobalViewCombineFiltersPdpKw } from "../../../Ebux/ds2.0/global-view/services/service";

function BrandCommonFilterComponent({ expanded, handleToggle, handleSelectAll, handleCheck, searchTerm }) {
    const {
        kpi,
        filters, selectedFilters,
        activeClientProject,
        selectedFiltersWidget,
        updateSelectedBrand,
        updateSelectedBrandV2,
        updateSelectedKeywordBrandV2,

        setSelectedFiltersWidget,
        setFilters,
        selectedMsl
    } = useEbuxContext();
    const [brandSearch, setBrandSearch] = useState("");

    const [localSelectedBrands, setLocalSelectedBrands] = useState(
        selectedFiltersWidget?.selectedBrand ? [...selectedFiltersWidget.selectedBrand] : []
    );

    useEffect(() => {
        setLocalSelectedBrands(
            selectedFiltersWidget?.selectedBrand ? [...selectedFiltersWidget.selectedBrand] : []
        );
    }, [selectedFiltersWidget?.selectedBrand]);

    const handleUpdate = (option, isChecked) => {
        let newBrands;
        if (isChecked) {
            newBrands = (localSelectedBrands || []).filter(
                (b) => b.value !== option.value
            );
        } else {
            newBrands = [...((localSelectedBrands || []) || []), option];
        }
        if (activeClientProject?.brandTreeSelect) {
            if (kpi === "SOS" || kpi === "OR" || kpi === "Wt_SOS") {
                updateSelectedKeywordBrandV2(newBrands);
            } else {
                updateSelectedBrandV2(newBrands);
            }
        } else {
            setLocalSelectedBrands(newBrands);
        }
    };

    const handleSelectAllUpdate = (options, allSelected) => {
        trackCustomEvent(
            allSelected ? EVENTS.UNSELECT_ALL : EVENTS.SELECT_ALL,
            { section: "brand", action: allSelected ? "unselect_all" : "select_all", count: options?.length },
            ENTITY_TYPE.FILTER,
            getTrackerContext(kpi, null, { component_type: TRACKING_COMPONENT.CHECKBOX })
        );
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

        if (activeClientProject?.brandTreeSelect) {
            if (kpi === "SOS" || kpi === "OR" || kpi === "Wt_SOS") {
                updateSelectedKeywordBrandV2(newItems);
            } else {
                updateSelectedBrandV2(newItems);
            }
        } else {
            setLocalSelectedBrands(newItems);
        }
    };

    const handleClearAll = () => {
        trackCustomEvent(
            EVENTS.CLEAR_ALL,
            { section: "brand" },
            ENTITY_TYPE.FILTER,
            getTrackerContext(kpi, null, { component_type: TRACKING_COMPONENT.DRAWER })
        );
        setLocalSelectedBrands([]);
        if (typeof handleSelectAll === "function") {
            handleSelectAll("brand", []);
        }

    };

    const handleApplyClick = async () => {
        const current = localSelectedBrands || [];
        trackCustomEvent(
            EVENTS.APPLY,
            { section: "brand", selected_count: current.length, selected: current.map(c => c.label || c.value) },
            ENTITY_TYPE.FILTER,
            getTrackerContext(kpi, null, { component_type: TRACKING_COMPONENT.DRAWER })
        );
        if (isEqual(JSON.stringify(selectedFiltersWidget?.selectedBrand), JSON.stringify(current))) {
            return;
        }

        if (activeClientProject?.brandTreeSelect) {
            if (kpi === "SOS" || kpi === "OR" || kpi === "Wt_SOS") {
                updateSelectedKeywordBrandV2(current);
            } else {
                updateSelectedBrandV2(current);
            }
        } else {
            if (kpi == "GLOBALVIEW") {
                const bid = [...new Set(current?.flatMap(i => i.value) ?? [])];
                let combineFilterWidget = {};
                if (activeClientProject?.isFilterDateWise) {
                    const dateRangeData = { calendarType: selectedFilters?.calendarType, selectedDateRange: selectedFilters?.selectedDateRange, selectedWeeks: selectedFilters?.selectedWeeks };
                    combineFilterWidget = await fetchGlobalViewCombineFiltersPdpKw("GLOBALVIEW", (selectedFiltersWidget.selectedPlatform?.map(i => i.value) ?? []), (bid ?? []), (selectedFiltersWidget.selectedCategory?.flatMap(i => i.id_in_db) ?? []), dateRangeData);
                } else {
                    combineFilterWidget = await fetchGlobalViewCombineFiltersPdpKw("GLOBALVIEW", (selectedFiltersWidget.selectedPlatform?.map(i => i.value) ?? []), (bid ?? []), (selectedFiltersWidget.selectedCategory?.flatMap(i => i.id_in_db) ?? []));
                }
                setSelectedFiltersWidget(prevFilters => ({
                    ...prevFilters,
                    selectedBrand: current ?? [],
                }));

                setFilters(prevFilters => ({
                    ...prevFilters,
                    platform: combineFilterWidget?.platforms ?? [],
                    ...(current?.length === 0 && {
                        brand: combineFilterWidget?.brands ?? [],
                    }),
                    category: combineFilterWidget?.categories ?? [],
                }));
            } else {


                if ([2, 101, 102, 103].indexOf(activeClientProject?.client_project_id) > -1 || activeClientProject?.useCombineFilter) {
                    const tagSkuList = selectedFiltersWidget.selectedTags?.flatMap(tag => tag?.tag_details?.map(d => d?.sku_or_keyword) ?? []) ?? [];
                    const bid = [...new Set(current?.flatMap(i => i?.id_in_db ?? i?.value) ?? [])];
                    const compbid = [...new Set(selectedFiltersWidget?.selectedBrandCompetition?.flatMap(i => i.value) ?? [])];
                    let combineFilterWidget;
                    let combineFilterWidgetKW, combineFilterCompetitionWidget;
                    const tagKeywordList = selectedFiltersWidget.selectedTagsKW?.flatMap(tag => tag?.tag_details?.map(d => d?.sku_or_keyword) ?? []) ?? [];
                    if (activeClientProject?.isFilterDateWise) {
                        const dateRangeData = { calendarType: selectedFilters?.calendarType, selectedDateRange: selectedFilters?.selectedDateRange, selectedWeeks: selectedFilters?.selectedWeeks };
                        combineFilterWidget = await getCombineFilterWidget((kpi == "BUYBOX" ? "BUYBOX" : "OSA"), (selectedFiltersWidget.selectedPlatform?.flatMap(i => i?.id_in_db ?? i?.value) ?? []), (bid ?? []), (selectedFiltersWidget.selectedCategory?.flatMap(i => i?.id_in_db ?? i?.value) ?? []), (selectedFiltersWidget.selectedMotherPack?.flatMap(i => i?.id_in_db ?? i?.value) ?? []), (selectedFiltersWidget.selectedProductId?.flatMap(i => i?.id_in_db ?? i?.value) ?? []), (selectedFiltersWidget.selectedRange?.flatMap(i => i?.id_in_db ?? i?.value) ?? []), selectedMsl, (tagSkuList ?? []), dateRangeData);
                        combineFilterWidgetKW = await getCombineFilterWidgetKW("SOS", (selectedFiltersWidget.selectedPlatform?.map(i => i.value) ?? []), (bid ?? []), (selectedFiltersWidget.selectedKeywordCategory?.map(i => i.value) ?? []), (selectedFiltersWidget.selectedKeyword?.map(i => i.value) ?? []), (tagKeywordList ?? []), dateRangeData);
                        combineFilterCompetitionWidget = await getCombineFilterCompetitionWidget("OSA", (selectedFiltersWidget.selectedPlatform?.map(i => i.value) ?? []), (compbid ?? []), (selectedFiltersWidget.selectedCategory?.flatMap(i => i.id_in_db) ?? []), (selectedFiltersWidget.selectedMotherPack?.map(i => i.value) ?? []), (selectedFiltersWidget.selectedProductId?.map(i => i.value) ?? []), selectedMsl, (tagSkuList ?? []), dateRangeData, filters, selectedFilters);
                    } else {
                        combineFilterWidget = await getCombineFilterWidget((kpi == "BUYBOX" ? "BUYBOX" : "OSA"), (selectedFiltersWidget.selectedPlatform?.flatMap(i => i?.id_in_db ?? i?.value) ?? []), (bid ?? []), (selectedFiltersWidget.selectedCategory?.flatMap(i => i?.id_in_db ?? i?.value) ?? []), (selectedFiltersWidget.selectedMotherPack?.flatMap(i => i?.id_in_db ?? i?.value) ?? []), (selectedFiltersWidget.selectedProductId?.flatMap(i => i?.id_in_db ?? i?.value) ?? []), (selectedFiltersWidget.selectedRange?.flatMap(i => i?.id_in_db ?? i?.value) ?? []), selectedMsl, (tagSkuList ?? []));
                        combineFilterWidgetKW = await getCombineFilterWidgetKW("SOS", (selectedFiltersWidget.selectedPlatform?.map(i => i.value) ?? []), (bid ?? []), (selectedFiltersWidget.selectedKeywordCategory?.map(i => i.value) ?? []), (selectedFiltersWidget.selectedKeyword?.map(i => i.value) ?? []), (tagKeywordList ?? []));
                        combineFilterCompetitionWidget = await getCombineFilterCompetitionWidget("OSA", (selectedFiltersWidget.selectedPlatform?.map(i => i.value) ?? []), (compbid ?? []), (selectedFiltersWidget.selectedCategory?.flatMap(i => i.id_in_db) ?? []), (selectedFiltersWidget.selectedMotherPack?.map(i => i.value) ?? []), (selectedFiltersWidget.selectedProductId?.map(i => i.value) ?? []), selectedMsl, (tagSkuList ?? []), "", filters, selectedFilters);
                    }

                    setSelectedFiltersWidget(prevFilters => ({
                        ...prevFilters,
                        selectedBrand: current ?? [],
                    }));

                    setFilters(prevFilters => ({
                        ...prevFilters,
                        platform: (kpi == "SOS" || kpi == "OR" || kpi == "Wt_SOS") ? combineFilterWidgetKW?.platforms ?? [] : combineFilterWidget?.platforms ?? [],
                        ...(current?.length === 0 && {
                            brand: (kpi == "SOS" || kpi == "OR" || kpi == "Wt_SOS") ? combineFilterWidgetKW?.brands ?? [] : combineFilterWidget?.brands ?? [],
                        }),
                        category: combineFilterWidget?.categories ?? [],
                        mother_pack: combineFilterWidget?.mother_packs ?? [],
                        ...((combineFilterWidget?.range) ? { range: combineFilterWidget?.range ?? [] } : {}),
                        products: combineFilterWidget?.products ?? [],

                        keywordCategory: combineFilterWidgetKW?.keyword_categories ?? [],
                        keyword: combineFilterWidgetKW?.keywords ?? [],
                        combineFilterCompetitionWidget,

                        res_products_competition: combineFilterCompetitionWidget?.products ?? [],
                        res_brand_competition: combineFilterCompetitionWidget?.brands ?? []
                    }));
                } else {
                    updateSelectedBrand(current);
                }
            }
        }

        if (typeof handleCheck === "function") {
            const allBrands = Array.isArray(filters?.brand) ? filters.brand : [];
            allBrands.forEach((brand) => {
                const isChecked = current.some((b) => b.value === brand.value);
                handleCheck("brand", brand.value, !isChecked, brand.label, true);

            });
        }
    };

    const sortedBrands = useMemo(() => {
        const list = Array.isArray(filters?.brand) ? filters.brand : [];
        const searchInput = (brandSearch || searchTerm || "").trim();
        if (!searchInput) { return list; }

        const terms = searchInput.split(";").map((t) => t.trim()).filter(Boolean);
        if (terms.length === 0) { return list; }

        const regexes = terms.map((t) => new RegExp(escapeRegExp(t), "i"));

        const filteredList = list.filter((item) => regexes.some((r) => r.test(item.label)));

        const selectedValues = (localSelectedBrands || []).map((b) => b.value);
        const sortedList = [...filteredList].sort((a, b) => {
            const aSelected = selectedValues.includes(a.value);
            const bSelected = selectedValues.includes(b.value);
            if (aSelected === bSelected) return 0;
            return aSelected ? -1 : 1;
        });
        return sortedList;
    }, [filters?.brand, searchTerm, brandSearch, localSelectedBrands]);

    const allVisibleSelected =
        sortedBrands.length > 0 &&
        sortedBrands.every((opt) =>
            (localSelectedBrands || []).some((sel) => sel.value === opt.value)
        );

    const someVisibleSelected =
        sortedBrands.some((opt) =>
            (localSelectedBrands || []).some((sel) => sel.value === opt.value)
        );

    const selectAllLabel = allVisibleSelected ? "Clear All" : "Select All";
    const showNoResults = sortedBrands.length === 0 && (brandSearch?.trim() || searchTerm?.trim());
    return (
        <>
            <div className="flex flex-col px-8 p-4 space-y-8">
                <div className="border-b border-gray-100 pb-6 last:border-0">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="flex font-semibold text-gray-900 text-base">Brand
                            {
                                selectedFiltersWidget?.selectedBrand?.length > 0 ?
                                    <span className="ml-1 flex items-center justify-center w-5 h-5 text-[10px] rounded-full bg-[#F0F0F0]">{selectedFiltersWidget?.selectedBrand.length}</span>
                                    : <></>
                            }
                        </h3>
                        {sortedBrands?.length > 3 && (
                            <button
                                type="button"
                                className="text-gray-500 hover:text-gray-700"
                                onClick={() => handleToggle("brand")}
                            >
                                {expanded["brand"] ? <IoIosArrowUp size={20} /> : <IoIosArrowDown size={20} />}
                            </button>
                        )}
                    </div>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search brand..."
                            className="w-[75%] px-[9px] py-[2px] pr-[24px] mb-[6px] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={brandSearch}
                            onChange={(e) => setBrandSearch(e.target.value)}
                            onBlur={(e) => {
                                if (e.target.value?.trim()) {
                                    trackCustomEvent(
                                        EVENTS.SEARCH,
                                        { section: "brand", search_term: e.target.value },
                                        ENTITY_TYPE.FILTER,
                                        getTrackerContext(kpi, null, { component_type: TRACKING_COMPONENT.DRAWER })
                                    );
                                }
                            }}
                        />
                        {brandSearch && (
                            <RxCross2
                                size={18}
                                className="absolute right-[5.4rem] top-[45%] -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer z-10"
                                onClick={() => {
                                    trackCustomEvent(
                                        EVENTS.CLEAR,
                                        { section: "brand", action: "clear_search" },
                                        ENTITY_TYPE.FILTER,
                                        getTrackerContext(kpi, null, { component_type: TRACKING_COMPONENT.DRAWER })
                                    );
                                    setBrandSearch("");
                                }}
                            />
                        )}
                    </div>
                    {sortedBrands?.length > 0 && (
                        <div className="space-y-2">
                            <div className={`space-y-2 transition-all duration-300 ${expanded["brand"] ? "max-h-60 overflow-y-auto pr-2" : "max-h-[102px] overflow-hidden"}`} >
                                <label className="flex items-center font-bold gap-2 text-sm text-gray-700 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 text-blue-600 rounded"
                                        checked={allVisibleSelected}
                                        ref={(input) => {
                                            if (input) input.indeterminate = !allVisibleSelected && someVisibleSelected;
                                        }}
                                        onChange={() => {
                                            handleSelectAllUpdate(sortedBrands, allVisibleSelected)
                                        }}
                                    />

                                    {selectAllLabel}
                                </label>

                                {sortedBrands?.map((option, i) => {
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
                                                            handleUpdate(option, isChecked); // 🔹 dynamic updater
                                                            handleCheck("brand", option.value, isChecked, option.label); // keep drawer state in sync // true - false, false->
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
                            No brands found...
                        </div>
                    )}
                    <div className="flex justify-between relative top-[8px]">
                        <button
                            type="button"
                            className="text-blue-500 text-sm font-medium mt-3 flex items-center"
                            onClick={() => handleToggle("brand")}
                        >
                            {expanded["brand"] ? "View Less" : "View More"}
                            <span className="ml-1">
                                {expanded["brand"] ? <IoIosArrowUp size={16} /> : <IoIosArrowDown size={16} />}
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

export default BrandCommonFilterComponent;
import React, { useState, useEffect, useMemo } from "react";
import { useEbuxContext } from "../../../Ebux/Context/EbuxProvider";
import { escapeRegExp } from "./DrawerHelper";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import { isEqual } from "lodash";
import { ENTITY_TYPE, EVENTS, getTrackerContext, trackCustomEvent, TRACKING_COMPONENT } from "../../../../tracker";
import { getCombineFilterWidgetKW } from "../../../Ebux/services/ebux.service";

function TagManagerFilterComponent({ expanded, handleToggle, handleSelectAll, handleCheck, searchTerm }) {
    const {
        kpi,
        tagList,
        activeClientProject,
        selectedFilters,
        selectedFiltersWidget,
        updateSelectedFilters,
        // selectedMsl,
        // updateSelectedMSLV2,

        setSelectedFiltersWidget,
        setFilters,
        // setSelectedMsl
    } = useEbuxContext();

    const [productSearch, setProductSearch] = useState("");
    const [localSelectedProducts, setLocalSelectedProducts] = useState(
        selectedFiltersWidget?.selectedTagsKW ? [...selectedFiltersWidget.selectedTagsKW] : []
    );

    useEffect(() => {
        setLocalSelectedProducts(
            selectedFiltersWidget?.selectedTagsKW ? [...selectedFiltersWidget.selectedTagsKW] : []
        );
    }, [selectedFiltersWidget?.selectedTagsKW]);


    const handleUpdate = (option, isChecked) => {
        let newProducts;
        // console.log('option.value', option.value)
        if (isChecked) {
            newProducts = (localSelectedProducts || []).filter(
                // (p) => p.value !== option.value
                (p) => p.id !== option.id
            );
        } else {
            newProducts = [...((localSelectedProducts || []) || []), option];
        }

    
        setLocalSelectedProducts(newProducts);
    };

    const handleSelectAllUpdate = (options, allSelected) => {
        trackCustomEvent(
            allSelected ? EVENTS.UNSELECT_ALL : EVENTS.SELECT_ALL,
            { section: "tags_kw", action: allSelected ? "unselect_all" : "select_all", count: options?.length },
            ENTITY_TYPE.FILTER,
            getTrackerContext(kpi, null, { component_type: TRACKING_COMPONENT.CHECKBOX })
        );
        let newItems = [];
        if (allSelected) {
            newItems = (localSelectedProducts || []).filter(
                (b) => !options.some((opt) => opt.id === b.id)
            );
        } else {
            const uniqueItems = [
                ...(localSelectedProducts || []),
                ...options.filter(
                    (opt) =>
                        !(localSelectedProducts || []).some(
                            (sel) => sel.id === opt.id
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
            { section: "tags_kw" },
            ENTITY_TYPE.FILTER,
            getTrackerContext(kpi, null, { component_type: TRACKING_COMPONENT.DRAWER })
        );
        setLocalSelectedProducts([]);
        if (typeof handleSelectAll === "function") {
            handleSelectAll("tags_kw", []);
        }
    };

    const handleApplyClick = async () => {
        const current = localSelectedProducts || [];
        trackCustomEvent(
            EVENTS.APPLY,
            { section: "tags_kw", selected_count: current.length, selected: current.map((c) => c.tag_name || c.id) },
            ENTITY_TYPE.FILTER,
            getTrackerContext(kpi, null, { component_type: TRACKING_COMPONENT.DRAWER })
        );
        if (isEqual(JSON.stringify(selectedFiltersWidget?.selectedTagsKW), JSON.stringify(current))) {
            return;
        }
       

        if ([2, 101, 102, 103].indexOf(activeClientProject?.client_project_id) > -1 || activeClientProject?.useCombineFilter) {
            const tagSkuList = current?.flatMap(tag => tag?.tag_details?.map(d => d?.sku_or_keyword) ?? [] ) ?? [];
            
            

             let combineFilterWidgetKW;
            if (activeClientProject?.isFilterDateWise) {
                const dateRangeData = { calendarType: selectedFilters?.calendarType, selectedDateRange: selectedFilters?.selectedDateRange, selectedWeeks: selectedFilters?.selectedWeeks };
                combineFilterWidgetKW = await getCombineFilterWidgetKW("SOS", (selectedFiltersWidget.selectedPlatform?.map(i => i.value) ?? []), (selectedFiltersWidget.selectedBrand?.flatMap(i => i.id_in_db) ?? []), (selectedFiltersWidget.selectedKeywordCategory?.map(i => i.value) ?? []), (selectedFiltersWidget.selectedKeyword?.map(i => i.value) ?? []),tagSkuList, dateRangeData);
            } else {
                combineFilterWidgetKW = await getCombineFilterWidgetKW("SOS", (selectedFiltersWidget.selectedPlatform?.map(i => i.value) ?? []), (selectedFiltersWidget.selectedBrand?.flatMap(i => i.id_in_db) ?? []), (selectedFiltersWidget.selectedKeywordCategory?.map(i => i.value) ?? []), (selectedFiltersWidget.selectedKeyword?.map(i => i.value) ?? []),tagSkuList);
            }
                        // let combineFilterWidgetKW = await getCombineFilterWidgetKW("SOS", [],(bid ?? []),(selectedFiltersWidget.selectedKeywordCategory?.map(i => i.value) ?? []),(keyword_id ?? []));
                        setFilters(prevFilters => ({
                            ...prevFilters,
                            platform: combineFilterWidgetKW?.platforms ?? [],
                            brand: combineFilterWidgetKW?.brands ?? [],
                            keywordCategory: combineFilterWidgetKW?.keyword_categories ?? [],
                            keyword: combineFilterWidgetKW?.keywords ?? [],
                        }));
            
                        setSelectedFiltersWidget(prevFilters => ({
                            ...prevFilters,
                            selectedTagsKW: current ?? [],
                        }));


            // let combineFilterWidget = await getCombineFilterWidget("OSA", (selectedFiltersWidget.selectedPlatform?.map(i => i.value) ?? []), (selectedFiltersWidget.selectedBrand?.map(i => i.value) ?? []), (selectedFiltersWidget.selectedCategory?.map(i => i.value) ?? []), (selectedFiltersWidget.selectedMotherPack?.map(i => i.value) ?? []), (selectedFiltersWidget.selectedProductId?.map(i => i.value) ?? []), selectedMsl,tagSkuList);
            // setFilters(prevFilters => ({
            //     ...prevFilters,
            //     platform: combineFilterWidget?.platforms ?? [],
            //     brand: combineFilterWidget?.brands ?? [],
            //     category: combineFilterWidget?.categories ?? [],
            //     mother_pack: combineFilterWidget?.mother_packs ?? [],
            //     products: combineFilterWidget?.products ?? [],
            // }));

            // setSelectedFiltersWidget(prevFilters => ({
            //     ...prevFilters,
            //     selectedTagsKW: current ?? [],
            // }));
            updateSelectedFilters("selectedTagsKW", current);
        }


        if (typeof handleCheck === "function") {
            const allProducts = Array.isArray(tagList) ? tagList : [];
            allProducts.forEach((p) => {
                const isChecked = current.some((c) => c.id === p.id);
                handleCheck("tags_kw", p.id, !isChecked, p.tag_name, true);
            });
        }
    };


    const sortedProducts = useMemo(() => {
        let rawList = Array.isArray(tagList) ? tagList : [];
        rawList = rawList.filter(item => item?.tag_type === "Keyword");

        const searchInput = (productSearch || searchTerm || "").trim();
        if (!searchInput) return rawList;

        const terms = searchInput.split(";").map((t) => t.trim()).filter(Boolean);
        if (terms.length === 0) return rawList;

        const regexes = terms.map((t) => new RegExp(escapeRegExp(t), "i"));
        const filteredList = rawList.filter((item) => {
            return regexes.some((regex) => regex.test(item.tag_name || ""));
        });

        const selectedValues = (localSelectedProducts || []).map((p) => p.id);
        const sortedList = [...filteredList].sort((a, b) => {
            const aSelected = selectedValues.includes(a.id);
            const bSelected = selectedValues.includes(b.id);
            if (aSelected === bSelected) return 0;
            return aSelected ? -1 : 1;
        });

        return sortedList;
    }, [tagList, productSearch, searchTerm, localSelectedProducts]);



    const allVisibleSelected =
        sortedProducts.length > 0 &&
        sortedProducts.every((opt) =>
            (localSelectedProducts || []).some((sel) => sel.id === opt.id)
        );

    const someVisibleSelected =
        sortedProducts.some((opt) =>
            (localSelectedProducts || []).some((sel) => sel.id === opt.id)
        );

    const selectAllLabel = allVisibleSelected ? "Clear All" : "Select All";
    const showNoResults = sortedProducts.length === 0 && (productSearch?.trim() || searchTerm?.trim());
    return (
        <>

            <div className="flex flex-col px-8 p-4 space-y-8">
                <div className="border-b border-gray-100 pb-6 last:border-0">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center justify-between w-[90%]">
                            <h3 className="flex font-semibold text-gray-900 text-base">Keyword Tags
                                {
                                    selectedFiltersWidget?.selectedTagsKW?.length > 0 ?
                                        <span className="ml-1 flex items-center justify-center w-5 h-5 text-[10px] rounded-full bg-[#F0F0F0]">{selectedFiltersWidget?.selectedTagsKW.length}</span>
                                        : <></>
                                }
                            </h3>

                        </div>
                        {sortedProducts?.length > 3 && (
                            <button
                                type="button"
                                className="text-gray-500 hover:text-gray-700"
                                onClick={() => handleToggle("tags_kw")}
                            >
                                {expanded["tags_kw"] ? <IoIosArrowUp size={20} /> : <IoIosArrowDown size={20} />}
                            </button>
                        )}
                    </div>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search keyword tags..."
                            className="w-[70%] px-[9px] py-[2px] pr-[24px] mb-[6px] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={productSearch}
                            onChange={(e) => setProductSearch(e.target.value)}
                            onBlur={(e) => {
                                if (e.target.value?.trim()) {
                                    trackCustomEvent(
                                        EVENTS.SEARCH,
                                        { section: "tags_kw", search_term: e.target.value },
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
                                        { section: "tags_kw", action: "clear_search" },
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
                            <div className={`space-y-2 transition-all duration-300 ${expanded["tags_kw"] ? "max-h-60 overflow-y-auto pr-2" : "max-h-[102px] overflow-hidden"}`} >

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
                                    const isChecked = (localSelectedProducts || []).some((sel) => sel.id === option.id);
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
                                                            handleCheck("tags_kw", option.id, isChecked, option.tag_name);
                                                        }}
                                                    />
                                                </span>

                                                {option.tag_name}


                                            </label>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                    {showNoResults && (
                        <div className="px-8 p-4 text-sm text-gray-500">
                            No tags found...
                        </div>
                    )}
                    <div className="flex justify-between relative top-[8px]">
                        <button
                            type="button"
                            className="text-blue-500 text-sm font-medium mt-3 flex items-center"
                            onClick={() => handleToggle("tags_kw")}
                        >
                            {expanded["tags_kw"] ? "View Less" : "View More"}
                            <span className="ml-1">
                                {expanded["tags_kw"] ? <IoIosArrowUp size={16} /> : <IoIosArrowDown size={16} />}
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

export default TagManagerFilterComponent;
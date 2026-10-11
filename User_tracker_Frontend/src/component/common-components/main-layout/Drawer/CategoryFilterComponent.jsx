import React, { useState, useEffect, useMemo } from "react";
import { useEbuxContext } from "../../../Ebux/Context/EbuxProvider";
import { escapeRegExp } from "./DrawerHelper";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import { isEqual } from "lodash";
import { ENTITY_TYPE, EVENTS, getTrackerContext, trackCustomEvent, TRACKING_COMPONENT } from "../../../../tracker";
import { getCombineFilterWidget } from "../../../Ebux/services/ebux.service";
import { fetchGlobalViewCombineFiltersPdpKw } from "../../../Ebux/ds2.0/global-view/services/service";



function CategoryFilterComponent({ expanded, handleToggle, handleSelectAll,
    handleCheck, searchTerm
}) {

    const {
        kpi,
        filters, selectedFilters,
        activeClientProject,
        // selectedFilters,
        selectedFiltersWidget,
        updateSelectedCategory,

        setSelectedFiltersWidget,
        setFilters,
        selectedMsl
    } = useEbuxContext();

    const [categorySearch, setCategorySearch] = useState("");
    const [localSelectedCategory, setLocalSelectedCategory] = useState(
        selectedFiltersWidget?.selectedCategory ? [...selectedFiltersWidget.selectedCategory] : []
    );

    useEffect(() => {
        setLocalSelectedCategory(
            selectedFiltersWidget?.selectedCategory ? [...selectedFiltersWidget.selectedCategory] : []
        );
    }, [selectedFiltersWidget?.selectedCategory]);

    const handleUpdate = (option, isChecked) => {

        let newCategories;
        if (isChecked) {
            newCategories = localSelectedCategory.filter(
                (c) => c.value !== option.value
            );
        } else {
            newCategories = [...(localSelectedCategory || []), option];
        }
        setLocalSelectedCategory(newCategories);
    };


    const handleSelectAllUpdate = (options, allSelected) => {
        trackCustomEvent(
            allSelected ? EVENTS.UNSELECT_ALL : EVENTS.SELECT_ALL,
            { section: "category", action: allSelected ? "unselect_all" : "select_all", count: options?.length },
            ENTITY_TYPE.FILTER,
            getTrackerContext(kpi, null, { component_type: TRACKING_COMPONENT.CHECKBOX })
        );
        let newItems = [];

        if (allSelected) {
            newItems = (localSelectedCategory || []).filter(
                (b) => !options.some((opt) => opt.value === b.value)
            );
        } else {
            const uniqueItems = [
                ...(localSelectedCategory || []),
                ...options.filter(
                    (opt) =>
                        !(localSelectedCategory || []).some(
                            (sel) => sel.value === opt.value
                        )
                ),
            ];
            newItems = uniqueItems;
        }
        setLocalSelectedCategory(newItems);
    };

    const handleClearAll = () => {
        trackCustomEvent(
            EVENTS.CLEAR_ALL,
            { section: "category" },
            ENTITY_TYPE.FILTER,
            getTrackerContext(kpi, null, { component_type: TRACKING_COMPONENT.DRAWER })
        );
        setLocalSelectedCategory([]);
        if (typeof handleSelectAll === "function") {
            handleSelectAll("category", []);
        }

        // if (typeof handleCancel === "function") {
        //     handleCancel();
        // }
    };

    const handleApplyClick = async () => {
        const current = localSelectedCategory || [];
        trackCustomEvent(
            EVENTS.APPLY,
            { section: "category", selected_count: current.length, selected: current.map(c => c.label || c.value) },
            ENTITY_TYPE.FILTER,
            getTrackerContext(kpi, null, { component_type: TRACKING_COMPONENT.DRAWER })
        );
        if (isEqual(JSON.stringify(selectedFiltersWidget?.selectedCategory), JSON.stringify(current))) {
            return;
        }
        if (kpi == "GLOBALVIEW") {
            const cat_id = [...new Set(current?.flatMap(i => i.id_in_db) ?? [])];
            let combineFilterWidget = {};
            if (activeClientProject?.isFilterDateWise) {
                const dateRangeData = { calendarType: selectedFilters?.calendarType, selectedDateRange: selectedFilters?.selectedDateRange, selectedWeeks: selectedFilters?.selectedWeeks };
                combineFilterWidget = await fetchGlobalViewCombineFiltersPdpKw("GLOBALVIEW", (selectedFiltersWidget.selectedPlatform?.map(i => i.value) ?? []), (selectedFiltersWidget.selectedBrand?.flatMap(i => i.id_in_db) ?? []), (cat_id ?? []), dateRangeData);
            } else {
                combineFilterWidget = await fetchGlobalViewCombineFiltersPdpKw("GLOBALVIEW", (selectedFiltersWidget.selectedPlatform?.map(i => i.value) ?? []), (selectedFiltersWidget.selectedBrand?.flatMap(i => i.id_in_db) ?? []), (cat_id ?? []));
            }
            setFilters(prevFilters => ({
                ...prevFilters,
                platform: combineFilterWidget?.platforms ?? [],
                brand: combineFilterWidget?.brands ?? [],
                ...(current?.length === 0 && {
                    category: combineFilterWidget?.categories ?? [],
                }),
            }));

            setSelectedFiltersWidget(prevFilters => ({
                ...prevFilters,
                selectedCategory: current ?? [],
            }));
        } else {
            if ([2, 101, 102, 103].indexOf(activeClientProject?.client_project_id) > -1 || activeClientProject?.useCombineFilter) {
                const tagSkuList = selectedFiltersWidget.selectedTags?.flatMap(tag => tag?.tag_details?.map(d => d?.sku_or_keyword) ?? []) ?? [];
                const cat_id = [...new Set(current?.flatMap(i => i?.id_in_db ?? i?.value) ?? [])];
                let combineFilterWidget;
                if (activeClientProject?.isFilterDateWise) {
                    const dateRangeData = { calendarType: selectedFilters?.calendarType, selectedDateRange: selectedFilters?.selectedDateRange, selectedWeeks: selectedFilters?.selectedWeeks };
                    combineFilterWidget = await getCombineFilterWidget((kpi == "BUYBOX" ? "BUYBOX" : "OSA"), (selectedFiltersWidget.selectedPlatform?.flatMap(i => i?.id_in_db ?? i?.value) ?? []), (selectedFiltersWidget.selectedBrand?.flatMap(i => i?.id_in_db ?? i?.value) ?? []), (cat_id ?? []), (selectedFiltersWidget.selectedMotherPack?.flatMap(i => i?.id_in_db ?? i?.value) ?? []), (selectedFiltersWidget.selectedProductId?.flatMap(i => i?.id_in_db ?? i?.value) ?? []), (selectedFiltersWidget.selectedRange?.flatMap(i => i?.id_in_db ?? i?.value) ?? []), selectedMsl, (tagSkuList ?? []), dateRangeData);
                } else {
                    combineFilterWidget = await getCombineFilterWidget((kpi == "BUYBOX" ? "BUYBOX" : "OSA"), (selectedFiltersWidget.selectedPlatform?.flatMap(i => i?.id_in_db ?? i?.value) ?? []), (selectedFiltersWidget.selectedBrand?.flatMap(i => i?.id_in_db ?? i?.value) ?? []), (cat_id ?? []), (selectedFiltersWidget.selectedMotherPack?.flatMap(i => i?.id_in_db ?? i?.value) ?? []), (selectedFiltersWidget.selectedProductId?.flatMap(i => i?.id_in_db ?? i?.value) ?? []), (selectedFiltersWidget.selectedRange?.flatMap(i => i?.id_in_db ?? i?.value) ?? []), selectedMsl, (tagSkuList ?? []));
                }

                setFilters(prevFilters => ({
                    ...prevFilters,
                    platform: combineFilterWidget?.platforms ?? [],
                    brand: combineFilterWidget?.brands ?? [],
                    ...(current?.length === 0 && {
                        category: combineFilterWidget?.categories ?? [],
                    }),
                    mother_pack: combineFilterWidget?.mother_packs ?? [],
                    products: combineFilterWidget?.products ?? [],
                    ...((combineFilterWidget?.range) ? { range: combineFilterWidget?.range ?? [] } : {})
                }));

                setSelectedFiltersWidget(prevFilters => ({
                    ...prevFilters,
                    selectedCategory: current ?? [],
                }));
            } else {
                updateSelectedCategory(current);
            }
        }


        if (typeof handleCheck === "function") {
            const allCategories = Array.isArray(filters?.category) ? filters.category : [];
            allCategories.forEach((cat) => {
                const isChecked = current.some((b) => b.value === cat.value);
                console.log('isCheckedisChecked', isChecked)
                handleCheck("category", cat.value, !isChecked, cat.label, true);
            });
        }

    };

    const sortedCategories = useMemo(() => {
        const list = Array.isArray(filters?.category) ? filters.category : [];

        const searchInput = (categorySearch || searchTerm || "").trim();
        if (!searchInput) return list;

        const terms = searchInput.split(";").map((t) => t.trim()).filter(Boolean);
        if (terms.length === 0) return list;

        const regexes = terms.map((t) => new RegExp(escapeRegExp(t), "i"));
        const filteredList = list.filter((item) => regexes.some((regex) => regex.test(item.label || "")));

        const selectedValues = (localSelectedCategory || []).map((c) => c.value);
        const sortedList = [...filteredList].sort((a, b) => {
            const aSelected = selectedValues.includes(a.value);
            const bSelected = selectedValues.includes(b.value);
            if (aSelected === bSelected) return 0;
            return aSelected ? -1 : 1;
        });

        return sortedList;
    }, [filters?.category, categorySearch, searchTerm, localSelectedCategory]);

    const allVisibleSelected =
        sortedCategories.length > 0 &&
        sortedCategories.every((opt) =>
            (localSelectedCategory || []).some((sel) => sel.value === opt.value)
        );

    const someVisibleSelected =
        sortedCategories.some((opt) =>
            (localSelectedCategory || []).some((sel) => sel.value === opt.value)
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
                        <input
                            type="text"
                            placeholder="Search Category..."
                            className="w-[70%] px-[9px] pr-[24px] py-[2px] mb-[6px] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={categorySearch}
                            onChange={(e) => setCategorySearch(e.target.value)}
                            onBlur={(e) => {
                                if (e.target.value?.trim()) {
                                    trackCustomEvent(
                                        EVENTS.SEARCH,
                                        { section: "category", search_term: e.target.value },
                                        ENTITY_TYPE.FILTER,
                                        getTrackerContext(kpi, null, { component_type: TRACKING_COMPONENT.DRAWER })
                                    );
                                }
                            }}
                        />
                        {categorySearch && (
                            <RxCross2
                                size={18}
                                className="absolute right-[6.4rem] top-[45%] -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer z-10"
                                onClick={() => {
                                    trackCustomEvent(
                                        EVENTS.CLEAR,
                                        { section: "category", action: "clear_search" },
                                        ENTITY_TYPE.FILTER,
                                        getTrackerContext(kpi, null, { component_type: TRACKING_COMPONENT.DRAWER })
                                    );
                                    setCategorySearch("");
                                }}
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
                                    const isChecked = (localSelectedCategory || []).some(
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
                                                            handleCheck("category", option.value, isChecked, option.label); // keep drawer state in sync
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
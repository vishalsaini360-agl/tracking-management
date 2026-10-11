import React, { useState, useEffect, useMemo } from "react";
import { useEbuxContext } from "../../../../Ebux/Context/EbuxProvider";
import { IoIosArrowUp, IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import { getCombineFilterWidget, getCombineFilterWidgetKW } from "../../../../Ebux/services/ebux.service";
import { ENTITY_TYPE, EVENTS, getTrackerContext, trackCustomEvent, TRACKING_COMPONENT } from "../../../../../tracker";


const BrandFilterComponent = ({ expanded, handleToggle, searchTerm }) => {
    const {
        filters, selectedFilters, activeClientProject,
        selectedFiltersWidget,
        setSelectedFiltersWidget,
        setFilters,
        selectedMsl,
        kpi,
        updateSelectedBrandV2: updateBrandV2
    } = useEbuxContext();

    const [brandSearch, setBrandSearch] = useState("");
    const [expandedItems, setExpandedItems] = useState({});


    const brandTreeData = useMemo(() => {
        const brands = filters?.brand || [];
        const grouped = brands.reduce((acc, current) => {
            const mbId = current.mother_brand_id || "unknown";
            const mbName = current.mother_brand || "Unknown";

            if (!acc[mbId]) {
                acc[mbId] = {
                    label: mbName,
                    value: mbId,
                    uniqueKey: `L1_${mbId}`,
                    children: []
                };
            }

            acc[mbId].children.push({
                label: current.label || current.brand_name,
                value: current.value,
                uniqueKey: `L2_${mbId}_${current.value}`,
                parent_value: mbId,
                parentKey: `L1_${mbId}`,
                data: current
            });

            return acc;
        }, {});

        return Object.values(grouped);
    }, [filters?.brand]);

    const [localSelected, setLocalSelected] = useState({});


    const toggleExpand = (value) => {
        setExpandedItems(prev => ({ ...prev, [value]: !prev[value] }));
    };

    const handleCheck = (node, checked) => {
        trackCustomEvent(
            EVENTS.CHECKBOX,
            {
                section: "brand_perfetti",
                value: node.value,
                label: node.label,
                action: checked ? "select" : "unselect",
                level: node.parentKey ? "L2" : "L1"
            },
            ENTITY_TYPE.FILTER,
            getTrackerContext(kpi, null, { component_type: TRACKING_COMPONENT.DRAWER })
        );

        const updated = { ...localSelected };
        updated[node.uniqueKey] = checked;

        // If it's a parent, check/uncheck all children
        if (node.children && node.children.length > 0) {
            node.children.forEach(child => {
                updated[child.uniqueKey] = checked;
            });
        } else if (node.parentKey) {
            // If it's a child, update parent state if necessary
            const parent = brandTreeData.find(b => b.uniqueKey === node.parentKey);
            if (parent) {
                const allChildrenChecked = parent.children.every(c => updated[c.uniqueKey]);
                updated[parent.uniqueKey] = allChildrenChecked;
            }
        }

        setLocalSelected(updated);
    };

    const handleApply = async () => {
        const flatChildren = brandTreeData.flatMap(b => b.children || []);
        const selectedSubBrands = flatChildren
            .filter(node => localSelected[node.uniqueKey])
            .map(node => node.data);

        const current = selectedSubBrands;
        trackCustomEvent(
            EVENTS.APPLY,
            {
                section: "brand_perfetti",
                selected_count: current.length,
                selected: current.map(c => c.label || c.brand_name || c.value)
            },
            ENTITY_TYPE.FILTER,
            getTrackerContext(kpi, null, { component_type: TRACKING_COMPONENT.DRAWER })
        );

        const tagSkuList = selectedFiltersWidget.selectedTags?.flatMap(tag => tag?.tag_details?.map(d => d?.sku_or_keyword) ?? []) ?? [];
        const bid = [...new Set(current?.flatMap(i => i.brand_id || i.value) ?? [])];
        let combineFilterWidget;
        let combineFilterWidgetKW;
        const tagKeywordList = selectedFiltersWidget.selectedTagsKW?.flatMap(tag => tag?.tag_details?.map(d => d?.sku_or_keyword) ?? []) ?? [];
        if (activeClientProject?.isFilterDateWise) {
            const dateRangeData = { calendarType: selectedFilters?.calendarType, selectedDateRange: selectedFilters?.selectedDateRange, selectedWeeks: selectedFilters?.selectedWeeks };
            if (kpi === "SOS" || kpi === "OR" || kpi === "Wt_SOS") {
                combineFilterWidgetKW = await getCombineFilterWidgetKW("SOS", (selectedFiltersWidget.selectedPlatform?.map(i => i.value) ?? []), (bid ?? []), (selectedFiltersWidget.selectedKeywordCategory?.map(i => i.value) ?? []), (selectedFiltersWidget.selectedKeyword?.map(i => i.value) ?? []), (tagKeywordList ?? []), dateRangeData);
            } else {
                combineFilterWidget = await getCombineFilterWidget((kpi == "BUYBOX" ? "BUYBOX" : "OSA"), (selectedFiltersWidget.selectedPlatform?.flatMap(i => i?.id_in_db ?? i?.value) ?? []), (bid ?? []), (selectedFiltersWidget.selectedCategory?.flatMap(i => i?.id_in_db ?? i?.value) ?? []), (selectedFiltersWidget.selectedMotherPack?.flatMap(i => i?.id_in_db ?? i?.value) ?? []), (selectedFiltersWidget.selectedProductId?.flatMap(i => i?.id_in_db ?? i?.value) ?? []), (selectedFiltersWidget.selectedRange?.flatMap(i => i?.id_in_db ?? i?.value) ?? []), selectedMsl, (tagSkuList ?? []), dateRangeData);
            }
        } else {
            combineFilterWidget = await getCombineFilterWidget((kpi == "BUYBOX" ? "BUYBOX" : "OSA"), (selectedFiltersWidget.selectedPlatform?.flatMap(i => i?.id_in_db ?? i?.value) ?? []), (bid ?? []), (selectedFiltersWidget.selectedCategory?.flatMap(i => i?.id_in_db ?? i?.value) ?? []), (selectedFiltersWidget.selectedMotherPack?.flatMap(i => i?.id_in_db ?? i?.value) ?? []), (selectedFiltersWidget.selectedProductId?.flatMap(i => i?.id_in_db ?? i?.value) ?? []), (selectedFiltersWidget.selectedRange?.flatMap(i => i?.id_in_db ?? i?.value) ?? []), selectedMsl, (tagSkuList ?? []));
            combineFilterWidgetKW = await getCombineFilterWidgetKW("SOS", (selectedFiltersWidget.selectedPlatform?.map(i => i.value) ?? []), (bid ?? []), (selectedFiltersWidget.selectedKeywordCategory?.map(i => i.value) ?? []), (selectedFiltersWidget.selectedKeyword?.map(i => i.value) ?? []), (tagKeywordList ?? []));
        }

        setSelectedFiltersWidget(prevFilters => ({
            ...prevFilters,
            selectedBrand: current ?? [],
        }));

        setFilters(prevFilters => ({
            ...prevFilters,
            platform: (kpi === "SOS" || kpi === "OR" || kpi === "Wt_SOS") ? combineFilterWidgetKW?.platforms ?? [] : combineFilterWidget?.platforms ?? [],
            ...(current?.length === 0 && {
                brand: (kpi === "SOS" || kpi === "OR" || kpi === "Wt_SOS") ? combineFilterWidgetKW?.brands ?? [] : combineFilterWidget?.brands ?? [],
            }),
            category: combineFilterWidget?.categories ?? [],
            mother_pack: combineFilterWidget?.mother_packs ?? [],
            ...((combineFilterWidget?.range) ? { range: combineFilterWidget?.range ?? [] } : {}),
            products: combineFilterWidget?.products ?? [],
            keywordCategory: combineFilterWidgetKW?.keyword_categories ?? [],
            keyword: combineFilterWidgetKW?.keywords ?? [],
        }));
    };

    const handleClearAll = () => {
        trackCustomEvent(
            EVENTS.CLEAR_ALL,
            { section: "brand_perfetti" },
            ENTITY_TYPE.FILTER,
            getTrackerContext(kpi, null, { component_type: TRACKING_COMPONENT.DRAWER })
        );

        setLocalSelected({});
        if (typeof updateBrandV2 === "function") {
            updateBrandV2([]);
        }
    };

    const filteredData = useMemo(() => {
        const rawTerm = (brandSearch || searchTerm || "").trim();
        if (!rawTerm) return brandTreeData;

        const terms = rawTerm.split(";").map(t => t.trim().toLowerCase()).filter(Boolean);
        if (terms.length === 0) return brandTreeData;

        return brandTreeData.map(brand => {
            const brandLabelLower = brand.label.toLowerCase();
            const childrenMatches = brand.children.filter(child =>
                terms.some(t => child.label.toLowerCase().includes(t))
            );
            const brandMatches = terms.some(t => brandLabelLower.includes(t));

            if (brandMatches || childrenMatches.length > 0) {
                return {
                    ...brand,
                    children: childrenMatches
                };
            }
            return null;
        }).filter(Boolean);
    }, [brandTreeData, brandSearch, searchTerm]);

    const allVisibleSelected = useMemo(() => {
        if (filteredData.length === 0) return false;
        return filteredData.every(brand =>
            localSelected[brand.uniqueKey] && (brand.children.length === 0 || brand.children.every(child => localSelected[child.uniqueKey]))
        );
    }, [filteredData, localSelected]);

    const someVisibleSelected = useMemo(() => {
        if (filteredData.length === 0) return false;
        return filteredData.some(brand =>
            localSelected[brand.uniqueKey] || (brand.children && brand.children.some(child => localSelected[child.uniqueKey]))
        );
    }, [filteredData, localSelected]);

    const handleSelectAllVisible = (checked) => {
        trackCustomEvent(
            checked ? EVENTS.SELECT_ALL : EVENTS.UNSELECT_ALL,
            {
                section: "brand_perfetti",
                action: checked ? "select_all" : "unselect_all",
                count: filteredData?.length
            },
            ENTITY_TYPE.FILTER,
            getTrackerContext(kpi, null, { component_type: TRACKING_COMPONENT.CHECKBOX })
        );

        const updated = { ...localSelected };
        filteredData.forEach(brand => {
            updated[brand.uniqueKey] = checked;
            if (brand.children) {
                brand.children.forEach(child => {
                    updated[child.uniqueKey] = checked;
                });
            }
        });
        setLocalSelected(updated);
    };

    useEffect(() => {
        const selected = selectedFiltersWidget?.selectedBrand || [];
        const selectionMap = {};
        selected.forEach(item => {
            filteredData.forEach(parent => {
                parent.children.forEach(child => {
                    if (child.value === item.value) {
                        selectionMap[child.uniqueKey] = true;
                    }
                });
                if ((parent.children.length == 0 && parent.value == item.value) || (parent.children?.length > 0 && parent.children.every(c => selectionMap[c.uniqueKey]))) {
                    selectionMap[parent.uniqueKey] = true;
                }
            });
        });

        setLocalSelected(selectionMap);
    }, [selectedFiltersWidget?.selectedBrand, filteredData]);

    return (
        <div className="flex flex-col px-8 p-4 space-y-8">
            <div className="border-b border-gray-100 pb-6 last:border-0">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="flex font-semibold text-gray-900 text-base">Brand
                        {selectedFiltersWidget?.selectedBrand?.length > 0 && (
                            <span className="ml-1 flex items-center justify-center w-5 h-5 text-[10px] rounded-full bg-[#F0F0F0]">
                                {selectedFiltersWidget.selectedBrand.length}
                            </span>
                        )}
                    </h3>
                    <button
                        type="button"
                        className="text-gray-500 hover:text-gray-700"
                        onClick={() => handleToggle("brand")}
                    >
                        {expanded["brand"] ? <IoIosArrowUp size={20} /> : <IoIosArrowDown size={20} />}
                    </button>
                </div>

                <div className="relative mb-4">
                    <input
                        type="text"
                        placeholder="Search brand..."
                        className="w-full px-3 py-1 pr-8 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        value={brandSearch}
                        onChange={(e) => setBrandSearch(e.target.value)}
                        onBlur={(e) => {
                            if (e.target.value?.trim()) {
                                trackCustomEvent(
                                    EVENTS.SEARCH,
                                    {
                                        section: "brand_perfetti",
                                        search_term: e.target.value
                                    },
                                    ENTITY_TYPE.FILTER,
                                    getTrackerContext(kpi, null, { component_type: TRACKING_COMPONENT.DRAWER })
                                );
                            }
                        }}
                    />
                    {brandSearch && (
                        <RxCross2
                            size={16}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                            onClick={() => {
                                trackCustomEvent(
                                    EVENTS.CLEAR,
                                    {
                                        section: "brand_perfetti",
                                        action: "clear_search"
                                    },
                                    ENTITY_TYPE.FILTER,
                                    getTrackerContext(kpi, null, { component_type: TRACKING_COMPONENT.DRAWER })
                                );
                                setBrandSearch("");
                            }}
                        />
                    )}
                </div>

                <div className={`space-y-1 transition-all duration-300 ${expanded["brand"] ? "max-h-80 overflow-y-auto pr-2" : "max-h-[120px] overflow-hidden"}`}>
                    {!brandSearch && !searchTerm && filteredData.length > 0 && (
                        <label className="flex items-center font-bold gap-2 text-sm text-gray-700 cursor-pointer mb-2 border-b border-gray-50 pb-1">
                            <input
                                type="checkbox"
                                className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                                checked={allVisibleSelected}
                                ref={(input) => {
                                    if (input) input.indeterminate = !allVisibleSelected && someVisibleSelected;
                                }}
                                onChange={(e) => handleSelectAllVisible(e.target.checked)}
                            />
                            {allVisibleSelected ? "Clear Selection" : "Select All"}
                        </label>
                    )}
                    {filteredData.length > 0 ? filteredData.map(brand => (
                        <TreeNode
                            key={brand.value}
                            node={brand}
                            localSelected={localSelected}
                            handleCheck={handleCheck}
                            expandedItems={expandedItems}
                            toggleExpand={toggleExpand}
                            level={0}
                        />
                    )) : (
                        <div className="text-center py-4 text-gray-500 text-sm">
                            No brands available
                        </div>
                    )}
                </div>

                <div className="flex justify-between items-center mt-4">
                    <button
                        type="button"
                        className="text-blue-500 text-xs font-medium flex items-center"
                        onClick={() => {
                            trackCustomEvent(
                                expanded["brand"] ? EVENTS.VIEW_LESS : EVENTS.VIEW_MORE,
                                { section: "brand_perfetti" },
                                ENTITY_TYPE.FILTER,
                                getTrackerContext(kpi, null, { component_type: TRACKING_COMPONENT.DRAWER })
                            );
                            handleToggle("brand");
                        }}
                    >
                        {expanded["brand"] ? "View Less" : "View More"}
                        <span className="ml-1">
                            {expanded["brand"] ? <IoIosArrowUp size={14} /> : <IoIosArrowDown size={14} />}
                        </span>
                    </button>
                    <div className="flex gap-2">
                        <button
                            type="button"
                            className="px-2 py-1 text-xs text-gray-700 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200"
                            onClick={handleClearAll}
                        >
                            Clear All
                        </button>
                        <button
                            type="button"
                            className="px-2 py-1 text-xs text-white bg-blue-600 rounded hover:bg-blue-700"
                            onClick={handleApply}
                        >
                            Apply
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const TreeNode = ({ node, localSelected, handleCheck, expandedItems, toggleExpand, level }) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedItems[node.value];

    const allChildrenChecked = hasChildren && node.children.every(child => localSelected[child.uniqueKey]);
    const someChildrenChecked = hasChildren && node.children.some(child => localSelected[child.uniqueKey]);
    const isIndeterminate = hasChildren && someChildrenChecked && !allChildrenChecked;

    const isChecked = hasChildren ? allChildrenChecked : !!localSelected[node.uniqueKey];

    return (
        <div className="flex flex-col">
            <div className="flex items-center gap-2 py-1">
                {hasChildren ? (
                    <span className="cursor-pointer" onClick={() => toggleExpand(node.value)}>
                        {isExpanded ? <IoIosArrowDown size={14} /> : <IoIosArrowForward size={14} />}
                    </span>
                ) : (
                    <span className="w-3.5" />
                )}
                <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                    checked={isChecked}
                    ref={(input) => {
                        if (input) input.indeterminate = isIndeterminate;
                    }}
                    onChange={(e) => handleCheck(node, e.target.checked)}
                />
                <span
                    className={`text-sm cursor-pointer ${level === 0 ? "font-medium" : "text-gray-600"}`}
                    onClick={() => hasChildren ? toggleExpand(node.value) : handleCheck(node, !isChecked)}
                >
                    {node.label}
                </span>
            </div>
            {hasChildren && isExpanded && (
                <div className="ml-6 border-l border-gray-100">
                    {node.children.map(child => (
                        <TreeNode
                            key={child.value}
                            node={child}
                            localSelected={localSelected}
                            handleCheck={handleCheck}
                            expandedItems={expandedItems}
                            toggleExpand={toggleExpand}
                            level={level + 1}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default BrandFilterComponent;

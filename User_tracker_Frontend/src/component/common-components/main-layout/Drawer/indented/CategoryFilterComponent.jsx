import React, { useState, useEffect, useMemo } from "react";
import { useEbuxContext } from "../../../../Ebux/Context/EbuxProvider";
import { IoIosArrowUp, IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import { ENTITY_TYPE, EVENTS, getTrackerContext, trackCustomEvent, TRACKING_COMPONENT } from "../../../../../tracker";
import { getCombineFilterWidget } from "../../../../Ebux/services/ebux.service";


const CategoryFilterComponent = ({ expanded, handleToggle, searchTerm }) => {
    const {
        filters, selectedFilters, activeClientProject,
        selectedFiltersWidget,
        setSelectedFiltersWidget,
        setFilters,
        selectedMsl,
        kpi,
        updateSelectedCategory: updateCategory
    } = useEbuxContext();

    const [categorySearch, setCategorySearch] = useState("");
    const [expandedItems, setExpandedItems] = useState({});

    const categoryTreeData = useMemo(() => {
        const categories = filters?.category || [];
        const grouped = categories.reduce((acc, current) => {
            const pvmId = current.parent_category_id || "unknown";
            const pvmName = current.parent_category_name || "Unknown";

            if (!acc[pvmId]) {
                acc[pvmId] = {
                    label: pvmName,
                    value: pvmId,
                    uniqueKey: `L1_${pvmId}`,
                    children: []
                };
            }

            acc[pvmId].children.push({
                label: current.label || current.category_name,
                value: current.value,
                uniqueKey: `L2_${pvmId}_${current.value}`,
                parent_value: pvmId,
                parentKey: `L1_${pvmId}`,
                data: current
            });

            return acc;
        }, {});

        return Object.values(grouped);
    }, [filters?.category]);

    const [localSelected, setLocalSelected] = useState({});

    useEffect(() => {
        const selected = selectedFiltersWidget?.selectedCategory || [];
        const selectionMap = {};

        // Map initial selections (children)
        selected.forEach(item => {
            categoryTreeData.forEach(parent => {
                // console.log('oooooooooooo', parent, item)
                // if (parent.value === item.value) selectionMap[parent.uniqueKey] = true;
                parent.children.forEach(child => {
                    if (child.value === item.value) selectionMap[child.uniqueKey] = true;
                });
            });
        });

        // Recalculate parent selection states based on children
        categoryTreeData.forEach(parent => {
            if (parent.children.length > 0) {
                const allChildrenChecked = parent.children.every(child => selectionMap[child.uniqueKey]);
                if (allChildrenChecked) {
                    selectionMap[parent.uniqueKey] = true;
                }
            }
        });

        setLocalSelected(selectionMap);
    }, [selectedFiltersWidget?.selectedCategory, categoryTreeData]);

    const toggleExpand = (value) => {
        setExpandedItems(prev => ({ ...prev, [value]: !prev[value] }));
    };

    const handleCheck = (node, checked) => {
        trackCustomEvent(
            EVENTS.CHECKBOX,
            { section: "category", value: node.value, item: node.label, label: node.label, checked },
            ENTITY_TYPE.FILTER,
            getTrackerContext(kpi, null, { component_type: TRACKING_COMPONENT.CHECKBOX })
        );
        const updated = { ...localSelected };
        updated[node.uniqueKey] = checked;

        if (node.children && node.children.length > 0) {
            node.children.forEach(child => {
                updated[child.uniqueKey] = checked;
            });
        } else if (node.parentKey) {
            const parent = categoryTreeData.find(c => c.uniqueKey === node.parentKey);
            if (parent) {
                const allChildrenChecked = parent.children.every(c => updated[c.uniqueKey]);
                updated[parent.uniqueKey] = allChildrenChecked;
            }
        }

        setLocalSelected(updated);
    };

    const handleApply = async () => {
        const flatChildren = categoryTreeData.flatMap(c => c.children || []);
        const selectedSubCategories = flatChildren
            .filter(node => localSelected[node.uniqueKey])
            .map(node => node.data);

        const current = selectedSubCategories;
        trackCustomEvent(
            EVENTS.APPLY,
            { section: "category", selected_count: current.length, selected: current.map(c => c?.label || c?.value) },
            ENTITY_TYPE.FILTER,
            getTrackerContext(kpi, null, { component_type: TRACKING_COMPONENT.DRAWER })
        );
        const tagSkuList = selectedFiltersWidget.selectedTags?.flatMap(tag => tag?.tag_details?.map(d => d?.sku_or_keyword) ?? []) ?? [];
        const cid = [...new Set(current?.flatMap(i => i?.id_in_db ?? i?.value) ?? [])];
        const bid = [...new Set(selectedFiltersWidget.selectedBrand?.flatMap(i => i?.id_in_db || i.brand_id || i.value) ?? [])];

        let combineFilterWidget;
        if (activeClientProject?.isFilterDateWise) {
            const dateRangeData = { calendarType: selectedFilters?.calendarType, selectedDateRange: selectedFilters?.selectedDateRange, selectedWeeks: selectedFilters?.selectedWeeks };
            combineFilterWidget = await getCombineFilterWidget((kpi == "BUYBOX" ? "BUYBOX" : "OSA"), (selectedFiltersWidget.selectedPlatform?.flatMap(i => i?.id_in_db ?? i?.value) ?? []), (bid ?? []), (cid ?? []), (selectedFiltersWidget.selectedMotherPack?.flatMap(i => i?.id_in_db ?? i?.value) ?? []), (selectedFiltersWidget.selectedProductId?.flatMap(i => i?.id_in_db ?? i?.value) ?? []), (selectedFiltersWidget.selectedRange?.flatMap(i => i?.id_in_db ?? i?.value) ?? []), selectedMsl, (tagSkuList ?? []), dateRangeData);
        } else {
            combineFilterWidget = await getCombineFilterWidget((kpi == "BUYBOX" ? "BUYBOX" : "OSA"), (selectedFiltersWidget.selectedPlatform?.flatMap(i => i?.id_in_db ?? i?.value) ?? []), (bid ?? []), (cid ?? []), (selectedFiltersWidget.selectedMotherPack?.flatMap(i => i?.id_in_db ?? i?.value) ?? []), (selectedFiltersWidget.selectedProductId?.flatMap(i => i?.id_in_db ?? i?.value) ?? []), (selectedFiltersWidget.selectedRange?.flatMap(i => i?.id_in_db ?? i?.value) ?? []), selectedMsl, (tagSkuList ?? []));
        }



        setSelectedFiltersWidget(prevFilters => ({
            ...prevFilters,
            selectedCategory: current ?? [],
        }));

        setFilters(prevFilters => ({
            ...prevFilters,
            platform: combineFilterWidget?.platforms ?? [],
            brand: combineFilterWidget?.brands ?? [],
            // category: combineFilterWidget?.categories ?? [],
            mother_pack: combineFilterWidget?.mother_packs ?? [],
            products: combineFilterWidget?.products ?? [],
            ...((combineFilterWidget?.range) ? { range: combineFilterWidget?.range ?? [] } : {})
        }));
    };

    const handleClearAll = () => {
        trackCustomEvent(
            EVENTS.CLEAR_ALL,
            { section: "category" },
            ENTITY_TYPE.FILTER,
            getTrackerContext(kpi, null, { component_type: TRACKING_COMPONENT.DRAWER })
        );
        setLocalSelected({});
        if (typeof updateCategory === "function") {
            updateCategory([]);
        }
    };

    const filteredData = useMemo(() => {
        const rawTerm = (categorySearch || searchTerm || "").trim();
        if (!rawTerm) return categoryTreeData;

        const terms = rawTerm.split(";").map(t => t.trim().toLowerCase()).filter(Boolean);
        if (terms.length === 0) return categoryTreeData;

        return categoryTreeData.map(cat => {
            const catLabelLower = cat.label.toLowerCase();
            const childrenMatches = cat.children.filter(child =>
                terms.some(t => child.label.toLowerCase().includes(t))
            );
            const catMatches = terms.some(t => catLabelLower.includes(t));

            if (catMatches || childrenMatches.length > 0) {
                return {
                    ...cat,
                    children: childrenMatches
                };
            }
            return null;
        }).filter(Boolean);
    }, [categoryTreeData, categorySearch, searchTerm]);

    const allVisibleSelected = useMemo(() => {
        if (filteredData.length === 0) return false;
        return filteredData.every(cat =>
            localSelected[cat.uniqueKey] && (cat.children.length === 0 || cat.children.every(child => localSelected[child.uniqueKey]))
        );
    }, [filteredData, localSelected]);

    const someVisibleSelected = useMemo(() => {
        if (filteredData.length === 0) return false;
        return filteredData.some(cat =>
            localSelected[cat.uniqueKey] || (cat.children && cat.children.some(child => localSelected[child.uniqueKey]))
        );
    }, [filteredData, localSelected]);

    const handleSelectAllVisible = (checked) => {
        trackCustomEvent(
            checked ? EVENTS.SELECT_ALL : EVENTS.UNSELECT_ALL,
            { section: "category", action: checked ? "select_all" : "unselect_all" },
            ENTITY_TYPE.FILTER,
            getTrackerContext(kpi, null, { component_type: TRACKING_COMPONENT.CHECKBOX })
        );
        const updated = { ...localSelected };
        filteredData.forEach(cat => {
            updated[cat.uniqueKey] = checked;
            if (cat.children) {
                cat.children.forEach(child => {
                    updated[child.uniqueKey] = checked;
                });
            }
        });
        setLocalSelected(updated);
    };

    return (
        <div className="flex flex-col px-8 p-4 space-y-8">
            <div className="border-b border-gray-100 pb-6 last:border-0">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="flex font-semibold text-gray-900 text-base">Category Indented
                        {selectedFiltersWidget?.selectedCategory?.length > 0 && (
                            <span className="ml-1 flex items-center justify-center w-5 h-5 text-[10px] rounded-full bg-[#F0F0F0]">
                                {selectedFiltersWidget.selectedCategory.length}
                            </span>
                        )}
                    </h3>
                    <button
                        type="button"
                        className="text-gray-500 hover:text-gray-700"
                        onClick={() => handleToggle("category")}
                    >
                        {expanded["category"] ? <IoIosArrowUp size={20} /> : <IoIosArrowDown size={20} />}
                    </button>
                </div>

                <div className="relative mb-4">
                    <input
                        type="text"
                        placeholder="Search category..."
                        className="w-full px-3 py-1 pr-8 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
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
                            size={16}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
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

                <div className={`space-y-1 transition-all duration-300 ${expanded["category"] ? "max-h-80 overflow-y-auto pr-2 hide-scrollbar" : "max-h-[120px] overflow-hidden"}`}>
                    {!categorySearch && !searchTerm && filteredData.length > 0 && (
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
                    {filteredData.length > 0 ? filteredData.map(cat => (
                        <TreeNode
                            key={cat.value}
                            node={cat}
                            localSelected={localSelected}
                            handleCheck={handleCheck}
                            expandedItems={expandedItems}
                            toggleExpand={toggleExpand}
                            level={0}
                        />
                    )) : (
                        <div className="text-center py-4 text-gray-500 text-sm">
                            No categories available
                        </div>
                    )}
                </div>

                <div className="flex justify-between relative top-[8px]">
                    <button
                        type="button"
                        className="text-blue-500 text-sm font-medium mt-3 flex items-center"
                        onClick={() => handleToggle("category")}
                    >
                        {expanded["category"] ? "View Less" : "View More"}
                        <span className="ml-1">
                            {expanded["category"] ? <IoIosArrowUp size={14} /> : <IoIosArrowDown size={14} />}
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
                    checked={!!localSelected[node.uniqueKey]}
                    ref={(input) => {
                        if (input) input.indeterminate = isIndeterminate;
                    }}
                    onChange={(e) => handleCheck(node, e.target.checked)}
                />
                <span
                    className={`text-sm cursor-pointer ${level === 0 ? "font-medium" : "text-gray-600"}`}
                    onClick={() => hasChildren ? toggleExpand(node.value) : handleCheck(node, !localSelected[node.uniqueKey])}
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

export default CategoryFilterComponent;

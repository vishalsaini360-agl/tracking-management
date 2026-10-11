import React, { useState, useEffect, useMemo } from "react";

import { useEbuxContext } from "../../../../Ebux/Context/EbuxProvider";
import { IoIosArrowUp, IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import { getCombineFilterWidgetKW } from "../../../../Ebux/services/ebux.service";


function PerfettiKeywordCategoryFilterComponent({ expanded, handleToggle, searchTerm
}) {
    // console.log('sectionsection222', section)
    const {
        // kpi,
        filters,
        activeClientProject,
        selectedFilters,
        selectedFiltersWidget,
        // updateSelectedKeywordCategoryV2,
        // updateSelectedKeywordCategory,

        setSelectedFiltersWidget,
        setFilters,
    } = useEbuxContext();

    const [categorySearch, setCategorySearch] = useState("");
    const [expandedItems, setExpandedItems] = useState({});

    const categoryTreeData = useMemo(() => {
        const categories = filters?.keywordCategory || [];
        const grouped = categories.reduce((acc, current) => {
            const pvmId = current.PVM_Category_id || "unknown";
            const pvmName = current.PVM_Category || "Unknown";

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
    }, [filters?.keywordCategory]);

    const [localSelected, setLocalSelected] = useState({});


    const toggleExpand = (value) => {
        setExpandedItems(prev => ({ ...prev, [value]: !prev[value] }));
    };


    const handleCheck = (node, checked) => {
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
        const cid = [...new Set(current?.flatMap(i => i.id_in_db || i.value) ?? [])];
        const bid = [...new Set(selectedFiltersWidget.selectedBrand?.flatMap(i => i.brand_id || i.value) ?? [])];



        const tagKeywordList = selectedFiltersWidget.selectedTagsKW?.flatMap(tag => tag?.tag_details?.map(d => d?.sku_or_keyword) ?? []) ?? [];
        let combineFilterWidgetKW;
        if (activeClientProject?.isFilterDateWise) {
            const dateRangeData = { calendarType: selectedFilters?.calendarType, selectedDateRange: selectedFilters?.selectedDateRange, selectedWeeks: selectedFilters?.selectedWeeks };
            combineFilterWidgetKW = await getCombineFilterWidgetKW("SOS", (selectedFiltersWidget.selectedPlatform?.map(i => i.value) ?? []), (bid ?? []), (cid ?? []), (selectedFiltersWidget.selectedKeyword?.map(i => i.value) ?? []), (tagKeywordList ?? []), dateRangeData);
        } else {
            combineFilterWidgetKW = await getCombineFilterWidgetKW("SOS", (selectedFiltersWidget.selectedPlatform?.map(i => i.value) ?? []), (bid ?? []), (cid ?? []), (selectedFiltersWidget.selectedKeyword?.map(i => i.value) ?? []), (tagKeywordList ?? []));
        }

        setSelectedFiltersWidget(prevFilters => ({
            ...prevFilters,
            selectedKeywordCategory: current ?? [],
        }));

        setFilters(prevFilters => ({
            ...prevFilters,
            platform: combineFilterWidgetKW?.platforms ?? [],
            brand: combineFilterWidgetKW?.brands ?? [],
            keywordCategory: combineFilterWidgetKW?.keyword_categories ?? [],
            keyword: combineFilterWidgetKW?.keywords ?? [],
        }));
    };

    const handleClearAll = () => {
        setLocalSelected({});
    };


    const filteredData = useMemo(() => {
        const rawTerm = (categorySearch || searchTerm || "").trim();
        if (!rawTerm) { setExpandedItems({}); return categoryTreeData; }

        const terms = rawTerm.split(";").map(t => t.trim().toLowerCase()).filter(Boolean);
        if (terms.length === 0) { setExpandedItems({}); return categoryTreeData; }

        let filteredData = categoryTreeData.map(cat => {
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
        setExpandedItems(() => { return filteredData.reduce((acc, cat) => { acc[cat.value] = true; return acc; }, {}); });
        return filteredData;
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


    useEffect(() => {
        const selected = selectedFiltersWidget?.selectedKeywordCategory || [];
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
    }, [selectedFiltersWidget?.selectedKeywordCategory, filteredData]);

    return (
        <div className="flex flex-col px-8 p-4 space-y-8">
            <div className="border-b border-gray-100 pb-6 last:border-0">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="flex font-semibold text-gray-900 text-base">Category
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
                    />
                    {categorySearch && (
                        <RxCross2
                            size={16}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                            onClick={() => setCategorySearch("")}
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

                <div className="flex justify-between items-center mt-4">
                    <button
                        type="button"
                        className="text-blue-500 text-xs font-medium flex items-center"
                        onClick={() => handleToggle("category")}
                    >
                        {expanded["category"] ? "View Less" : "View More"}
                        <span className="ml-1">
                            {expanded["category"] ? <IoIosArrowUp size={14} /> : <IoIosArrowDown size={14} />}
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
}

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
export default PerfettiKeywordCategoryFilterComponent;
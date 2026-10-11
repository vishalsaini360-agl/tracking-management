import React, { useState, useEffect, useMemo, useRef } from "react";
import { useEbuxContext } from "../../../../../Context/EbuxProvider";
import { useAlertContext } from "../../../Context/AlertProvider";
import { IoIosArrowUp, IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import { trackFilterCheck, trackFilterSelectAll } from "../filterTracker";

const TreeNode = ({ node, localSelected, handleCheck, expandedItems, toggleExpand, level }) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedItems[node.value];

    const allChildrenChecked = hasChildren && node.children.every(child => localSelected[child.uniqueKey]);
    const someChildrenChecked = hasChildren && node.children.some(child => localSelected[child.uniqueKey]);
    const isIndeterminate = hasChildren && someChildrenChecked && !allChildrenChecked;

    const isChecked = hasChildren ? allChildrenChecked : !!localSelected[node.uniqueKey];

    return (
        <div className="flex flex-col">
            <div className="flex items-center gap-2 py-1.5 group cursor-pointer">
                {hasChildren ? (
                    <span className="cursor-pointer text-gray-400 hover:text-gray-600" onClick={(e) => { e.stopPropagation(); toggleExpand(node.value); }}>
                        {isExpanded ? <IoIosArrowDown size={14} /> : <IoIosArrowForward size={14} />}
                    </span>
                ) : (
                    <span className="w-3.5" />
                )}

                <div className="relative flex items-center justify-center" onClick={(e) => { e.stopPropagation(); handleCheck(node, !isChecked); }}>
                    <input
                        type="checkbox"
                        className="peer appearance-none w-4 h-4 border border-gray-300 rounded focus:ring-0 checked:bg-blue-600 checked:border-blue-600 transition-all cursor-pointer"
                        checked={isChecked}
                        ref={(input) => {
                            if (input) input.indeterminate = isIndeterminate;
                        }}
                        readOnly
                    />
                    <svg className="absolute w-2.5 h-2.5 text-white hidden peer-checked:block pointer-events-none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>

                <span
                    className={`text-sm transition-colors ${isChecked ? "text-[#000000D9] font-medium" : "text-[#000000D9] group-hover:text-gray-900"} ${level === 0 ? "font-medium" : ""}`}
                    onClick={(e) => { e.stopPropagation(); hasChildren ? toggleExpand(node.value) : handleCheck(node, !isChecked); }}
                >
                    {node.label}
                </span>
            </div>
            {hasChildren && isExpanded && (
                <div className="ml-6 border-l border-gray-100 pl-2">
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

const KeywordFilterComponent = ({ expanded, onToggle, globalSearch = "" }) => {
    const {
        selectedFiltersWidget,
        setSelectedFiltersWidget,
    } = useEbuxContext();
    const { filters } = useAlertContext();

    const [productSearch] = useState("");
    const [expandedItems, setExpandedItems] = useState({});
    const scrollRef = useRef(null);

    const heading = "Keywords";
    const widgetKey = "selectedKeyword";

    const treeData = useMemo(() => {
        // console.log('filters?.keywordCategoryfilters?.keywordCategory', filters?.keyword)
        const items = Array.isArray(filters?.keyword) ? filters.keyword : [];
        const grouped = items.reduce((acc, current) => {
            const parentId = current.keyword_type || "unknown";
            const parentName = current.keyword_type || "Unknown";

            if (!acc[parentId]) {
                acc[parentId] = {
                    label: parentName,
                    value: parentId,
                    uniqueKey: `L1_${parentId}`,
                    children: []
                };
            }

            acc[parentId].children.push({
                label: current.label || current.keyword || current.name,
                value: current.value,
                uniqueKey: `L2_${parentId}_${current.value}`,
                parent_value: parentId,
                parentKey: `L1_${parentId}`,
                data: current
            });

            return acc;
        }, {});

        return Object.values(grouped);
    }, [filters?.keyword]);

    const localSelected = useMemo(() => {
        const selected = selectedFiltersWidget?.[widgetKey] || [];
        const selectionMap = {};
        selected.forEach(item => {
            treeData.forEach(parent => {
                if (String(parent.value) === String(item.value)) {
                    selectionMap[parent.uniqueKey] = true;
                }
                parent.children.forEach(child => {
                    if (String(child.value) === String(item.value)) {
                        selectionMap[child.uniqueKey] = true;
                    }
                });
            });
        });

        treeData.forEach(parent => {
            if (parent.children?.length > 0 && parent.children.every(c => selectionMap[c.uniqueKey])) {
                selectionMap[parent.uniqueKey] = true;
            }
        });

        return selectionMap;
    }, [selectedFiltersWidget?.[widgetKey], treeData]);

    const toggleExpand = (value) => {
        setExpandedItems(prev => ({ ...prev, [value]: !prev[value] }));
    };

    const handleCheckNode = (node, checked) => {
        trackFilterCheck("Keywords", node, !checked);
        const updatedSelectionMap = { ...localSelected };
        updatedSelectionMap[node.uniqueKey] = checked;

        if (node.children && node.children.length > 0) {
            node.children.forEach(child => {
                updatedSelectionMap[child.uniqueKey] = checked;
            });
        } else if (node.parentKey) {
            const parent = treeData.find(b => b.uniqueKey === node.parentKey);
            if (parent) {
                const allChildrenChecked = parent.children.every(c => updatedSelectionMap[c.uniqueKey]);
                updatedSelectionMap[parent.uniqueKey] = allChildrenChecked;
            }
        }

        const flatChildren = treeData.flatMap(b => b.children || []);
        const selectedNodes = flatChildren
            .filter(n => updatedSelectionMap[n.uniqueKey])
            .map(n => n.data);

        let newTags = [...(selectedFiltersWidget?.selectedTagsKW || [])];
        if (!checked && !node.children) {
            const removedPid = String(node.data.keyword_name || node.data.value || node.data.label);
            newTags = newTags.filter(tag => {
                const tagPids = (tag.tag_details || []).map(d => String(d.sku_or_keyword));
                return !tagPids.includes(removedPid);
            });
        }

        setSelectedFiltersWidget(prevFilters => ({
            ...prevFilters,
            [widgetKey]: selectedNodes,
            selectedTagsKW: newTags
        }));
    };

    const filteredData = useMemo(() => {
        const term = (productSearch || globalSearch || "").trim().toLowerCase();
        if (!term) return treeData;

        return treeData.map(node => {
            const childrenMatches = node.children.filter(child =>
                child.label.toLowerCase().includes(term)
            );
            const parentMatches = node.label.toLowerCase().includes(term);

            if (parentMatches || childrenMatches.length > 0) {
                return {
                    ...node,
                    children: childrenMatches
                };
            }
            return null;
        }).filter(Boolean);
    }, [treeData, productSearch, globalSearch]);

    useEffect(() => {
        const term = (productSearch || globalSearch || "").trim().toLowerCase();
        if (term && filteredData.length > 0) {
            const newExpanded = { ...expandedItems };
            filteredData.forEach(node => {
                newExpanded[node.value] = true;
            });
            setExpandedItems(newExpanded);
        }
    }, [productSearch, globalSearch, filteredData]);

    const allVisibleSelected = useMemo(() => {
        if (filteredData.length === 0) return false;
        return filteredData.every(node =>
            localSelected[node.uniqueKey] && (node.children.length === 0 || node.children.every(child => localSelected[child.uniqueKey]))
        );
    }, [filteredData, localSelected]);

    const someVisibleSelected = useMemo(() => {
        if (filteredData.length === 0) return false;
        return filteredData.some(node =>
            localSelected[node.uniqueKey] || (node.children && node.children.some(child => localSelected[child.uniqueKey]))
        );
    }, [filteredData, localSelected]);

    const handleSelectAllVisible = (checked) => {
        trackFilterSelectAll("Keywords", !checked, filteredData.length);
        const updatedSelectionMap = { ...localSelected };
        filteredData.forEach(node => {
            updatedSelectionMap[node.uniqueKey] = checked;
            if (node.children) {
                node.children.forEach(child => {
                    updatedSelectionMap[child.uniqueKey] = checked;
                });
            }
        });

        const flatChildren = treeData.flatMap(b => b.children || []);
        const selectedNodes = flatChildren
            .filter(n => updatedSelectionMap[n.uniqueKey])
            .map(n => n.data);

        let newTags = [...(selectedFiltersWidget?.selectedTagsKW || [])];
        if (!checked) {
            const removedPids = flatChildren.filter(n => !updatedSelectionMap[n.uniqueKey]).map(opt => String(opt.data.keyword_name || opt.data.value || opt.data.label));
            newTags = newTags.filter(tag => {
                const tagPids = (tag.tag_details || []).map(d => String(d.sku_or_keyword));
                return !tagPids.some(pid => removedPids.includes(pid));
            });
        }

        setSelectedFiltersWidget(prevFilters => ({
            ...prevFilters,
            [widgetKey]: selectedNodes,
            selectedTagsKW: newTags
        }));
    };

    const showNoResults = filteredData.length === 0 && (productSearch?.trim() || globalSearch?.trim());

    return (
        <div className="pb-4 mb-4 border-b border-gray-100 last:border-0 last:pb-0 last:mb-0">
            <div className="flex items-center justify-between cursor-pointer group" onClick={() => onToggle("products")}>
                <h3 className="font-semibold text-[#1F2937] text-sm">
                    {heading}
                </h3>
                <div className="text-gray-400 group-hover:text-gray-600 transition-colors">
                    {expanded ? <IoIosArrowUp size={16} /> : <IoIosArrowDown size={16} />}
                </div>
            </div>

            <div className={`transition-all duration-300 ${expanded ? "max-h-[500px] mt-4 opacity-100" : "max-h-0 opacity-0 overflow-hidden"}`}>
                {filteredData.length > 0 ? (
                    <>
                        <label className="flex items-center gap-3 group cursor-pointer mb-3">
                            <div className="relative flex items-center justify-center">
                                <input
                                    type="checkbox"
                                    checked={allVisibleSelected}
                                    ref={el => el && (el.indeterminate = !allVisibleSelected && someVisibleSelected)}
                                    onChange={(e) => handleSelectAllVisible(e.target.checked)}
                                    className="peer appearance-none w-4 h-4 border border-gray-300 rounded focus:ring-0 checked:bg-blue-600 checked:border-blue-600 transition-all cursor-pointer"
                                />
                                <svg className="absolute w-2.5 h-2.5 text-white hidden peer-checked:block pointer-events-none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                            </div>
                            <span className="text-sm text-gray-700 font-medium">
                                Select All
                            </span>
                        </label>

                        <div
                            ref={scrollRef}
                            className="max-h-[300px] overflow-y-auto pr-1 custom-scrollbar space-y-1"
                        >
                            {filteredData.map(node => (
                                <TreeNode
                                    key={node.value}
                                    node={node}
                                    localSelected={localSelected}
                                    handleCheck={handleCheckNode}
                                    expandedItems={expandedItems}
                                    toggleExpand={toggleExpand}
                                    level={0}
                                />
                            ))}
                        </div>
                    </>
                ) : (
                    !showNoResults && expanded && (
                        <div className="text-xs text-gray-500 py-4 text-center bg-gray-50 rounded-lg border border-dashed border-gray-200">
                            No keywords available
                        </div>
                    )
                )}

                {showNoResults && (
                    <div className="text-sm text-gray-500 py-4 text-center bg-gray-50 rounded-lg">
                        No keywords found for <span className="font-semibold">{productSearch || globalSearch}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default KeywordFilterComponent;
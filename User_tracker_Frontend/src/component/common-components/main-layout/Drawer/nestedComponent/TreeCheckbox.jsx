import React, { useEffect, useMemo, useRef, useState } from "react";
import { IoIosArrowDown, IoIosArrowForward, IoIosArrowUp } from "react-icons/io";
import { useEbuxContext } from "../../../../Ebux/Context/EbuxProvider";
import { ENTITY_TYPE, EVENTS, getTrackerContext, trackCustomEvent, TRACKING_COMPONENT } from "../../../../../tracker";

const getNodeKey = (node) => {
    const rawKey = (node?.location_key !== undefined && node?.location_key !== null)
        ? node.location_key
        : node?.value;
    return Array.isArray(rawKey) ? rawKey.join('-') : rawKey;
};

const TreeCheckbox = ({
    data,
    expanded,
    onToggle,
    onSelectionChange,
    defaultChecked = {},
    expandedItems,
    setExpandedItems,
    searchTerm,
}) => {
    console.log('defaultChecked', data)
    const { updateSelectedFilters } = useEbuxContext();
    const [checkedItems, setCheckedItems] = useState(defaultChecked);

    function normalizeCheckedWithParents(nodes, checkedItems, parentKey = "") {
        let allChecked = true;

        for (const node of nodes) {
            const key = parentKey ? `${parentKey}_${getNodeKey(node)}` : getNodeKey(node);
            if (node.children && node.children.length > 0) {
                const childAllChecked = normalizeCheckedWithParents(node.children, checkedItems, key);

                const someChildChecked = node.children.some(
                    (child) => checkedItems[`${key}_${getNodeKey(child)}`]
                );

                // ✅ if all children checked → mark parent checked
                if (childAllChecked) {
                    checkedItems[key] = true;
                }
                // ✅ if some checked → parent unchecked (indeterminate handled by ref)
                else if (someChildChecked) {
                    checkedItems[key] = false;
                    allChecked = false;
                }
                // ✅ if none checked → parent unchecked
                else {
                    checkedItems[key] = false;
                    allChecked = false;
                }
            } else {
                if (!checkedItems[key]) {
                    allChecked = false;
                }
            }
        }

        return allChecked;
    }


    // 🔄 Sync when modal opens again
    useEffect(() => {
        let updated = { ...defaultChecked };
        normalizeCheckedWithParents(data, updated);
        setCheckedItems(updated);
    }, [defaultChecked, data]);


    const getAllKeys = (nodes, parentKey = "") => {
        let keys = [];
        for (const node of nodes) {
            const key = parentKey ? `${parentKey}_${getNodeKey(node)}` : getNodeKey(node);
            keys.push(key);
            if (node.children) {
                keys = keys.concat(getAllKeys(node.children, key));
            }
        }
        return keys;
    };

    // const isFullyChecked = (nodes) => {
    //     const all = getAllValues(nodes);
    //     return all.every((v) => checkedItems[v]);
    // };

    // const toggleAll = (checked) => {
    //     const all = getAllValues(data);
    //     const updated = {};
    //     for (const val of all) updated[val] = checked;
    //     setCheckedItems(updated);
    // };

    const handleChange = (node, checked, children = [], nodeKey) => {
        trackCustomEvent(
            EVENTS.CHECKBOX,
            { section: "location", value: node?.value, item: node?.label, label: node?.label, checked },
            ENTITY_TYPE.FILTER,
            getTrackerContext(null, null, { component_type: TRACKING_COMPONENT.CHECKBOX })
        );
        const updated = { ...checkedItems, [nodeKey]: checked };

        if (children.length > 0) {
            const childKeys = getAllKeys(children, nodeKey);
            for (const val of childKeys) updated[val] = checked;
        }
        normalizeCheckedWithParents(data, updated);
        setTimeout(() => {
            const rechecked = { ...updated };
            normalizeCheckedWithParents(data, rechecked);
            setCheckedItems(rechecked);
        }, 0);

    };

    const toggleExpand = (node, nodeKey) => {
        setExpandedItems((prev) => ({
            ...prev,
            [nodeKey]: !prev[nodeKey],
        }));
    };

    // ✅ Collect full selected pincodes
    useEffect(() => {
        const collectLeafNodes = (nodes, region = "", state = "", city = "", parentKey = "") => {
            let leaves = [];
            (nodes || []).forEach((n) => {
                const key = parentKey ? `${parentKey}_${getNodeKey(n)}` : getNodeKey(n);
                if (n.children && n.children.length > 0) {
                    const nextRegion = !region ? n.label : region;
                    const nextState = region && !state && n.children.some(c => c.children && c.children.length > 0) ? n.label : state;
                    const nextCity = region ? (state || !n.children.some(c => c.children && c.children.length > 0) ? n.label : city) : city;

                    leaves = leaves.concat(
                        collectLeafNodes(
                            n.children,
                            nextRegion,
                            nextState,
                            nextCity,
                            key
                        )
                    );
                } else if (checkedItems[key]) {
                    leaves.push({
                        city: city || "",
                        state: state || "",
                        region: region || "",
                        label: n.label,
                        value: n.value,
                        location_key: n.location_key || n.value,
                        pf_id: n.pf_id || n.value,
                        latitude: n.latitude || null,
                        longitude: n.longitude || null,
                    });
                }
            });
            return leaves;
        };

        const selectedNodes = collectLeafNodes(data);
        updateSelectedFilters("selectedLocation", selectedNodes);
        onSelectionChange?.(selectedNodes);
    }, [checkedItems, data]);

    const filteredData = useMemo(() => {
        if (!searchTerm) {
            return data;
        }

        const filterTree = (nodes) => {
            return nodes
                .map(node => {
                    const nodeMatches = node.label.toLowerCase().includes(searchTerm.toLowerCase());
                    const filteredChildren = node.children ? filterTree(node.children) : [];
                    const childrenMatch = filteredChildren.length > 0;

                    if (nodeMatches || childrenMatch) {
                        return {
                            ...node,
                            children: filteredChildren.length > 0 ? filteredChildren : (node.children || [])
                        };
                    }
                    return null;
                })
                .filter(Boolean);
        };

        // Automatically expand the parents of any matching nodes
        const newExpandedItems = {};
        const expandParents = (nodes, parentKey = "") => {
            return nodes
                .map(node => {
                    const nodeKey = parentKey ? `${parentKey}_${getNodeKey(node)}` : getNodeKey(node);
                    const nodeMatches = node.label.toLowerCase().includes(searchTerm.toLowerCase());
                    const childrenMatch = node.children && expandParents(node.children, nodeKey).length > 0;

                    if (nodeMatches || childrenMatch) {
                        newExpandedItems[nodeKey] = true;
                        return node;
                    }
                    return null;
                })
                .filter(Boolean);
        };

        // Run expansion logic
        expandParents(data);
        setExpandedItems(prev => ({ ...prev, ...newExpandedItems }));

        // Return the filtered data for rendering
        return filterTree(data);
    }, [data, searchTerm, setExpandedItems]);


    const getVisibleLeafValues = useMemo(() => {
        const gatherLeaves = (nodes, parentKey = "") => {
            let vals = [];
            nodes.forEach((n) => {
                const key = parentKey ? `${parentKey}_${getNodeKey(n)}` : getNodeKey(n);
                if (n.children && n.children.length > 0) {
                    vals = vals.concat(gatherLeaves(n.children, key));
                } else {
                    vals.push(key);
                }
            });
            return vals;
        };
        return gatherLeaves(filteredData);
    }, [filteredData]);

    const allVisibleSelected = useMemo(
        () => getVisibleLeafValues.length > 0 && getVisibleLeafValues.every((v) => checkedItems[v]),
        [getVisibleLeafValues, checkedItems]
    );

    const someVisibleSelected = useMemo(
        () => getVisibleLeafValues.some((v) => checkedItems[v]) && !allVisibleSelected,
        [getVisibleLeafValues, checkedItems, allVisibleSelected]
    );

    const toggleVisible = (checked) => {
        trackCustomEvent(
            checked ? EVENTS.SELECT_ALL : EVENTS.UNSELECT_ALL,
            { section: "location", action: checked ? "select_all" : "unselect_all", count: getVisibleLeafValues.length },
            ENTITY_TYPE.FILTER,
            getTrackerContext(null, null, { component_type: TRACKING_COMPONENT.CHECKBOX })
        );
        const updated = { ...checkedItems };
        getVisibleLeafValues.forEach((val) => {
            updated[val] = checked;
        });
        normalizeCheckedWithParents(data, updated);
        setCheckedItems(updated);
    };

    return (
        <>{
            (filteredData.length > 0) ? <div>
                <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 text-base">Location</h3>
                    {(filteredData?.length > 0 || searchTerm.length > 0) && (
                        <button
                            type="button"
                            className="text-gray-500 hover:text-gray-700"
                            onClick={() => onToggle("location")}
                        >
                            {expanded["location"] ? <IoIosArrowUp size={20} /> : <IoIosArrowDown size={20} />}
                        </button>
                    )}
                </div>
                <div
                    className={`space-y-2 transition-all duration-300 ${expanded["location"]
                        ? "max-h-60 overflow-y-auto pr-2"
                        : "max-h-[102px] overflow-hidden"
                        }`}
                >

                    <label className="flex items-center font-bold gap-2 text-sm text-gray-700 cursor-pointer">
                        {/* <input
                                type="checkbox"
                                className="w-4 h-4 text-blue-600 rounded"
                                checked={isFullyChecked(data)}
                                onChange={(e) => toggleAll(e.target.checked)}
                            /> */}

                        <input
                            type="checkbox"
                            className="w-4 h-4 text-blue-600 rounded"
                            checked={allVisibleSelected} // 🔹 HIGHLIGHTED
                            ref={(el) => {
                                if (el) el.indeterminate = someVisibleSelected; // 🔹 HIGHLIGHTED
                            }}
                            onChange={(e) => toggleVisible(e.target.checked)} // 🔹 HIGHLIGHTED
                        />
                        Select All
                    </label>

                    <div
                        className={`space-y-2 mt-2 transition-all duration-300 ${expanded["location"]
                            ? "max-h-60 overflow-y-auto pr-2 hide-scrollbar"
                            : "max-h-[102px] overflow-hidden"
                            }`}
                    >
                        {filteredData.map((item, idx) => {
                            const key = getNodeKey(item);
                            return (
                                <TreeNode
                                    key={Array.isArray(key) ? key.join('-') : (key ?? idx)}
                                    node={item}
                                    level={1}
                                    checkedItems={checkedItems}
                                    handleChange={handleChange}
                                    expandedItems={expandedItems}
                                    toggleExpand={toggleExpand}
                                    getAllKeys={getAllKeys}
                                />
                            );
                        })}
                    </div>
                </div>
                {data.length > 0 && filteredData.length > 0 && (
                    <button
                        type="button"
                        className="text-blue-500 text-sm font-medium mt-3 flex items-center"
                        onClick={onToggle}
                    >
                        {expanded["location"] ? "View Less" : "View More"}
                        <span className="ml-1">
                            {expanded["location"] ? (
                                <IoIosArrowUp size={16} />
                            ) : (
                                <IoIosArrowDown size={16} />
                            )}
                        </span>
                    </button>
                )}
            </div> : null
        }
        </>
    );
};

const TreeNode = ({
    node,
    level,
    checkedItems,
    handleChange,
    expandedItems,
    toggleExpand,
    getAllKeys,
    parentKey = "",
}) => {
    const nodeKey = parentKey ? `${parentKey}_${getNodeKey(node)}` : getNodeKey(node);
    const hasChildren = node.children && node.children.length > 0;
    const descendantValues = hasChildren ? getAllKeys(node.children, nodeKey) : [];

    const ref = useRef();

    useEffect(() => {
        if (ref.current) {
            const allChecked =
                descendantValues.length > 0 &&
                descendantValues.every((v) => checkedItems[v]);
            const someChecked =
                descendantValues.length > 0 &&
                descendantValues.some((v) => checkedItems[v]);

            // ✅ indeterminate for partial
            ref.current.indeterminate = hasChildren && someChecked && !allChecked;

            // ✅ ensure parent checked when all children are checked
            if (hasChildren && allChecked && !checkedItems[nodeKey]) {
                checkedItems[nodeKey] = true;
            }
        }
    }, [checkedItems]);


    return (
        <div style={{ paddingLeft: level * 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                {hasChildren && (
                    <span
                        style={{ cursor: "pointer", userSelect: "none" }}
                        onClick={() => toggleExpand(node, nodeKey)}
                    >
                        {expandedItems[nodeKey] ? <IoIosArrowDown /> : <IoIosArrowForward />}
                    </span>
                )}
                {!hasChildren && <span style={{ width: 12 }} />}
                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                    <input
                        type="checkbox"
                        ref={ref}
                        checked={
                            hasChildren
                                ? descendantValues.length > 0 &&
                                descendantValues.every((v) => checkedItems[v])
                                : checkedItems[nodeKey] || false
                        }
                        className="w-4 h-4 text-blue-600 rounded"
                        onChange={(e) =>
                            handleChange(node, e.target.checked, node.children || [], nodeKey)
                        }
                    />
                </label>
                <span
                    onClick={() => hasChildren && toggleExpand(node, nodeKey)}
                    style={{ cursor: hasChildren ? "pointer" : "default" }}
                >
                    {node.label}
                </span>
            </div>

            {hasChildren && expandedItems[nodeKey] && (
                <div>
                    {node.children.map((child, idx) => {
                        const childKey = getNodeKey(child);
                        return (
                            <TreeNode
                                key={Array.isArray(childKey) ? childKey.join('-') : (childKey ?? idx)}
                                node={child}
                                level={level + 1}
                                checkedItems={checkedItems}
                                handleChange={handleChange}
                                expandedItems={expandedItems}
                                toggleExpand={toggleExpand}
                                getAllKeys={getAllKeys}
                                parentKey={nodeKey}
                            />
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default TreeCheckbox;

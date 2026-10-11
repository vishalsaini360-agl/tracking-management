import React, { useState, useEffect } from "react";
import { IoIosArrowUp, IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import { useEbuxContext } from "../../../../Context/EbuxProvider";
import { trackFilterCheck } from "./filterTracker";
// import { isEqual } from "lodash";

const LocationFilter = ({ expanded, onToggle, data = [] }) => {

    const { selectedFiltersWidget, updateSelectedFilters } =
        useEbuxContext();

    const [localSelectedLocations, setLocalSelectedLocations] =
        useState([]);

    const [expandedNodes, setExpandedNodes] = useState({});

    const toggleNode = (nodeValue, depth) => {
        setExpandedNodes(prev => {
            const isOpen = !!prev[nodeValue];
            if (!isOpen && depth === 0) {
                // Accordion behavior for Regions (depth 0): collapse others
                return { [nodeValue]: true };
            }
            const next = { ...prev };
            if (isOpen) {
                delete next[nodeValue];
            } else {
                next[nodeValue] = true;
            }
            return next;
        });
    };


    // Sync with context
    useEffect(() => {

        setLocalSelectedLocations(
            selectedFiltersWidget?.selectedLocation
                ? [...selectedFiltersWidget.selectedLocation]
                : []
        );

    }, [selectedFiltersWidget?.selectedLocation]);


    // Get leaf nodes only (pincodes)
    const getLeafNodes = (node) => {

        let leaves = [];

        if (node.children?.length) {

            node.children.forEach(child => {

                if (child.children?.length) {

                    leaves =
                        leaves.concat(
                            getLeafNodes(child)
                        );

                } else {

                    leaves.push(child);

                }

            });

        } else {

            leaves.push(node);

        }

        return leaves;

    };


    // Checkbox update
    const handleUpdate = (node, isChecked) => {
        trackFilterCheck("Location", node, isChecked);

        let next = [...localSelectedLocations];

        const leaves =
            getLeafNodes(node);

        if (isChecked) {

            next =
                next.filter(
                    item =>
                        !leaves.some(
                            l =>
                                l.value ===
                                item.value
                        )
                );

        } else {

            leaves.forEach(item => {

                if (
                    !next.some(
                        s =>
                            s.value ===
                            item.value
                    )
                ) {

                    next.push(item);

                }

            });

        }

        // setLocalSelectedLocations(next);
        updateSelectedFilters(
            "selectedLocation",
            next
        );

    };


    // Apply Button
    // const handleApplyClick = () => {

    //     if (
    //         isEqual(
    //             selectedFiltersWidget?.selectedLocation,
    //             localSelectedLocations
    //         )
    //     ) return;


    //     updateSelectedFilters(
    //         "selectedLocation",
    //         localSelectedLocations
    //     );

    // };


    // Clear Button
    // const handleClearAll = () =>
    //     setLocalSelectedLocations([]);



    // Tree UI Render
    const renderTree = (
        items,
        depth = 0
    ) => {

        return items.map((node, idx) => {

            const leaves =
                getLeafNodes(node);

            const isChecked =
                leaves.length > 0 &&
                leaves.every(l =>
                    localSelectedLocations.some(
                        sel =>
                            sel.value === l.value
                    )
                );

            const hasChildren = node.children && node.children.length > 0;
            const isExpanded = !!expandedNodes[node.value];

            return (

                <div
                    key={node.value || idx}
                    style={{
                        marginLeft:
                            depth
                                ? "16px"
                                : "0"
                    }}
                >

                    <div className="flex items-center gap-2 group cursor-pointer py-0.5">
                        {hasChildren && (
                            <div
                                onClick={(e) => {
                                    e.stopPropagation();
                                    toggleNode(node.value, depth);
                                }}
                                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                            >
                                {isExpanded ? <IoIosArrowDown size={14} /> : <IoIosArrowForward size={14} />}
                            </div>
                        )}
                        {!hasChildren && <div className="w-6" />}

                        <label className="flex items-center gap-2 flex-grow cursor-pointer py-1">

                            <div className="relative flex items-center justify-center">

                                <input
                                    type="checkbox"

                                    checked={isChecked}

                                    onChange={() =>
                                        handleUpdate(
                                            node,
                                            isChecked
                                        )
                                    }

                                    className="peer appearance-none w-4 h-4 border border-gray-300 rounded focus:ring-0 checked:bg-blue-600 checked:border-blue-600 transition-all cursor-pointer"
                                />

                                <svg
                                    className="absolute w-2.5 h-2.5 text-white hidden peer-checked:block pointer-events-none"
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


                            <span
                                className={`text-sm ${isChecked
                                    ? "text-gray-900 font-semibold"
                                    : "text-gray-600 group-hover:text-gray-900"
                                    }`}
                                onClick={() => hasChildren && toggleNode(node.value, depth)}
                            >

                                {node.label}

                            </span>

                        </label>
                    </div>


                    {hasChildren && isExpanded && (
                        <div className="transition-all duration-300">
                            {renderTree(
                                node.children,
                                depth + 1
                            )}
                        </div>
                    )}

                </div>

            );

        });

    };


    return (

        <div className="pb-4 mb-4 border-b border-gray-100 last:border-0 last:pb-0 last:mb-0">

            <div
                className="flex items-center justify-between cursor-pointer group"
                onClick={() =>
                    onToggle("location")
                }
            >

                <h3 className="font-semibold text-[##000000D9] text-base">
                    Location
                </h3>

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



                <div className="max-h-[300px] overflow-y-auto pr-1 custom-scrollbar space-y-1">

                    {renderTree(data)}

                </div>



                {/* <div className="flex justify-between items-center mt-3 border-t border-gray-50 pt-3">

                    <button
                        onClick={() =>
                            onToggle("location")
                        }

                        className="text-blue-600 text-sm font-semibold hover:text-blue-700 transition-colors"
                    >
                        View More
                    </button>



                    <div className="flex gap-2">

                        <button
                            onClick={handleClearAll}

                            className="px-3 py-1 text-gray-400 text-xs font-semibold hover:text-gray-600 transition-colors"
                        >
                            Clear All
                        </button>



                        <button
                            onClick={handleApplyClick}

                            className="px-4 py-1.5 text-white bg-blue-600 rounded-lg text-xs font-semibold hover:bg-blue-700 shadow-sm transition-all active:scale-95"
                        >
                            Apply
                        </button>

                    </div>

                </div> */}

            </div>

        </div>

    );

};

export default LocationFilter;
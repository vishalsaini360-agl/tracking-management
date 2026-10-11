import React, { useState, useEffect, useMemo, useRef } from "react";
import { useEbuxContext } from "../../../../Context/EbuxProvider";
import { useAlertContext } from "../../Context/AlertProvider";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { trackFilterCheck, trackFilterSelectAll } from "./filterTracker";

const escapeRegExp = (string) => {
    return string ? string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") : "";
};

const PlatformFilter = ({ expanded, onToggle, globalSearch = "", alertControlObj }) => {

    const {
        selectedFiltersWidget,
        setSelectedFiltersWidget
    } = useEbuxContext();

    const { filters } = useAlertContext();

    const [platformSearch] = useState("");
    const [localSelectedPlatforms, setLocalSelectedPlatforms] = useState([]);

    const scrollRef = useRef(null);


    // Sync with context
    useEffect(() => {
        setLocalSelectedPlatforms(
            selectedFiltersWidget?.selectedPlatform
                ? [...selectedFiltersWidget.selectedPlatform]
                : []
        );
    }, [selectedFiltersWidget?.selectedPlatform]);

    const heading = alertControlObj?.kpi === "SOS" ? "Keyword Platform" : "Platform";


    // Filter + Sort
    const sortedPlatforms = useMemo(() => {
        // console.log('alertControlObjalertControlObjalertControlObj', alertControlObj?.kpi, filters)

        const sourceList = alertControlObj?.kpi === "SOS" ? filters?.platformKW : filters?.platform;

        const list =
            Array.isArray(sourceList)
                ? sourceList
                : [];

        const searchInput =
            (platformSearch || globalSearch || "").trim();

        if (!searchInput) return list;

        const safe = escapeRegExp(searchInput);
        const regex = new RegExp(safe, "i");


        const filteredList =
            list.filter(item =>
                regex.test(item.label || item.name || "")
            );


        const selectedValues =
            localSelectedPlatforms.map(
                b => String(b.value)
            );


        return [...filteredList].sort((a, b) => {

            const aSelected =
                selectedValues.includes(String(a.value));

            const bSelected =
                selectedValues.includes(String(b.value));

            if (aSelected === bSelected) return 0;

            return aSelected ? -1 : 1;

        });

    }, [
        filters?.platform,
        filters?.platformKW,
        globalSearch,
        platformSearch,
        localSelectedPlatforms
    ]);



    // Scroll reset
    useEffect(() => {

        if (scrollRef.current) {
            scrollRef.current.scrollTop = 0;
        }

    }, [sortedPlatforms, expanded]);


    // Single select
    const handleUpdate = (option, isChecked) => {
        trackFilterCheck("Platform", option, isChecked);

        let newPlatforms;

        if (isChecked) {

            newPlatforms =
                localSelectedPlatforms.filter(
                    b =>
                        String(b.value) !==
                        String(option.value)
                );

        } else {

            newPlatforms =
                [...localSelectedPlatforms, option];

        }


        setSelectedFiltersWidget(prev => ({

            ...prev,
            selectedPlatform: newPlatforms

        }));

    };



    // Select All
    const handleSelectAllUpdate = (
        options,
        allSelected
    ) => {
        trackFilterSelectAll("Platform", allSelected, options?.length);

        let newItems = [];

        if (allSelected) {

            newItems =
                localSelectedPlatforms.filter(
                    b =>
                        !options.some(
                            opt =>
                                String(opt.value) ===
                                String(b.value)
                        )
                );

        } else {

            const toAdd =
                options.filter(
                    opt =>
                        !localSelectedPlatforms.some(
                            sel =>
                                String(sel.value) ===
                                String(opt.value)
                        )
                );


            newItems =
                [...localSelectedPlatforms, ...toAdd];

        }


        setSelectedFiltersWidget(prev => ({

            ...prev,
            selectedPlatform: newItems

        }));

    };



    // Select All State

    const allVisibleSelected =
        sortedPlatforms.length > 0 &&
        sortedPlatforms.every(opt =>
            localSelectedPlatforms.some(
                sel =>
                    String(sel.value) ===
                    String(opt.value)
            )
        );


    const someVisibleSelected =
        !allVisibleSelected &&
        sortedPlatforms.some(opt =>
            localSelectedPlatforms.some(
                sel =>
                    String(sel.value) ===
                    String(opt.value)
            )
        );


    const showNoResults =
        sortedPlatforms.length === 0 &&
        (platformSearch?.trim() ||
            globalSearch?.trim());


    // console.log('sortedPlatformssortedPlatformssortedPlatformssortedPlatforms', sortedPlatforms)
    return (

        <div className="pb-4 mb-4 border-b border-gray-100 last:border-0 last:pb-0 last:mb-0">

            <div
                className="flex items-center justify-between cursor-pointer group"
                onClick={() => onToggle("platform")}
            >

                <h3 className="font-semibold text-[##000000D9] text-base">
                    {heading}
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



                {sortedPlatforms.length > 0 ? (

                    <>


                        {/* Select All */}

                        <label className="flex items-center gap-3 group cursor-pointer mb-3">

                            <div className="relative flex items-center justify-center">

                                <input
                                    type="checkbox"
                                    checked={allVisibleSelected}

                                    ref={el =>
                                        el &&
                                        (el.indeterminate =
                                            someVisibleSelected)
                                    }

                                    onChange={() =>
                                        handleSelectAllUpdate(
                                            sortedPlatforms,
                                            allVisibleSelected
                                        )
                                    }

                                    className="peer appearance-none w-4 h-4 border border-gray-300 rounded focus:ring-0 checked:bg-blue-600 checked:border-blue-600 transition-all cursor-pointer"
                                />

                                <svg className="absolute w-2.5 h-2.5 text-white hidden peer-checked:block pointer-events-none"
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


                            <span className="text-sm text-gray-700 font-medium">
                                Select All
                            </span>

                        </label>



                        {/* LIST */}

                        <div
                            ref={scrollRef}
                            className="max-h-[300px] overflow-y-auto pr-1 custom-scrollbar space-y-1"
                        >


                            {sortedPlatforms.map((option, i) => {

                                const isChecked =
                                    localSelectedPlatforms.some(
                                        sel =>
                                            String(sel.value) ===
                                            String(option.value)
                                    );


                                return (

                                    <label
                                        key={i}
                                        className="flex items-center gap-3 group cursor-pointer py-1.5"
                                    >

                                        <div className="relative flex items-center justify-center">

                                            <input
                                                type="checkbox"
                                                checked={isChecked}

                                                onChange={() =>
                                                    handleUpdate(
                                                        option,
                                                        isChecked
                                                    )
                                                }

                                                className="peer appearance-none w-4 h-4 border border-gray-300 rounded focus:ring-0 checked:bg-blue-600 checked:border-blue-600 transition-all cursor-pointer"
                                            />

                                            <svg className="absolute w-2.5 h-2.5 text-white hidden peer-checked:block pointer-events-none"
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


                                        <span className={`flex items-center gap-2 text-sm ${isChecked
                                            ? "text-[#000000D9] font-medium"
                                            : "text-[#000000D9] group-hover:text-gray-900"
                                            }`}>

                                            <img className="w-[16px] h-[16px]" src={`${option.platform_description}`} alt={option.label} />
                                            {option.label}

                                        </span>

                                    </label>

                                );

                            })}

                        </div>

                    </>

                ) : (

                    !showNoResults &&
                    expanded && (

                        <div className="text-xs text-gray-500 py-4 text-center bg-gray-50 rounded-lg border border-dashed border-gray-200">
                            No {heading.toLowerCase()}s available
                        </div>

                    )

                )}



                {showNoResults && (

                    <div className="text-sm text-gray-500 py-4 text-center bg-gray-50 rounded-lg">

                        No {heading.toLowerCase()}s found for

                        <span className="font-semibold ml-1">

                            {platformSearch || globalSearch}

                        </span>

                    </div>

                )}


            </div>

        </div>

    );

};

export default PlatformFilter;
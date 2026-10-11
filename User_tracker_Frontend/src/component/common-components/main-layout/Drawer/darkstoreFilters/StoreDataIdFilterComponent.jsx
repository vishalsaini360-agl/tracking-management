import React, { useState, useCallback, useMemo } from "react";
import { useEbuxContext } from "../../../../Ebux/Context/EbuxProvider";
import { isOptionChecked, searchAndRank } from "../DrawerHelper";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";

function StoreDataIdFilterComponent({ expanded, handleToggle, handleSelectAll,
    handleCheck, searchTerm
}) {
    const {
        filtersDarkStore,
        selectedFiltersWidget,
        updateSelectedFilters
    } = useEbuxContext();
    const [localSearch, setLocalSearch] = useState("");
    const handleUpdate = useCallback((option, isChecked) => {
        const newBrands = isChecked
            ? selectedFiltersWidget.selectedDarkstore.filter(b => b.value !== option.value)
            : [...(selectedFiltersWidget.selectedDarkstore || []), option];
        updateSelectedFilters('selectedDarkstore', newBrands);
    }, [selectedFiltersWidget.selectedDarkstore, updateSelectedFilters]);

    const handleSelectAllUpdate = (options, allSelected) => {
        let newItems = [];

        if (allSelected) {
            // Unselect visible items only
            newItems = selectedFiltersWidget.selectedMotherPack.filter(
                (b) => !options.some((opt) => opt.value === b.value)
            );
        } else {
            // Add all visible items, avoiding duplicates
            const uniqueItems = [
                ...selectedFiltersWidget.selectedMotherPack,
                ...options.filter(
                    (opt) =>
                        !selectedFiltersWidget.selectedMotherPack.some(
                            (sel) => sel.value === opt.value
                        )
                ),
            ];
            newItems = uniqueItems;
        }
        updateSelectedFilters('selectedDarkstore', newItems);
    };

    // const sortedBrands = useMemo(() => {
    //     const list = Array.isArray(filtersDarkStore?.darkstore) ? filtersDarkStore.darkstore : [];

    //     // 1️⃣ Filter by search term
    //     const filteredList = searchTerm
    //         ? list.filter((b) => b.label.toLowerCase().includes(searchTerm.toLowerCase()))
    //         : list;

    //     // 2️⃣ Sort with selected first
    //     const selectedSet = new Set(selectedFiltersWidget.selectedDarkstore?.map(s => s.value));
    //     return filteredList.sort((a, b) => selectedSet.has(b.value) - selectedSet.has(a.value));
    // }, [filtersDarkStore?.darkstore, selectedFiltersWidget.selectedDarkstore, searchTerm]);



    const sortedBrands = useMemo(() => {
        const listForSearch = Array.isArray(filtersDarkStore?.darkstore) ? filtersDarkStore.darkstore : [];

        // call searchAndRank
        const result = searchAndRank(listForSearch, {
            globalSearch: searchTerm || "",
            localSearch: localSearch || "",
            // localSeparator: "\\s+" -> split by whitespace; change to ',' if you want comma-separated tokens
            localSeparator: "\\s+",
            localMode: "OR",
            globalMode: "OR",
            fuzzyFactor: 0.33,
            minMatchCount: 1,
            selectedValues:
                selectedFiltersWidget?.selectedDarkstore?.map((p) => p.value) || [],
            labelKey: "label",
        });

        // result contains the original objects (with label modified). If you need original label only,
        // it's fine because label was only extended with web_pid for searching/display is still ok.
        return result;
    }, [searchTerm, localSearch, filtersDarkStore?.darkstore])

    // 🔹 Show only a subset if collapsed to speed up rendering
    const visibleBrands = useMemo(() => {
        if (expanded["darkstore"] || searchTerm) return sortedBrands;
        return sortedBrands.slice(0, 5); // first 5 only when collapsed
    }, [expanded, searchTerm, sortedBrands]);


    const allVisibleSelected =
        sortedBrands.length > 0 &&
        sortedBrands.every((opt) =>
            isOptionChecked("darkstore", opt, selectedFiltersWidget)
        );

    const someVisibleSelected =
        sortedBrands.some((opt) =>
            isOptionChecked("darkstore", opt, selectedFiltersWidget)
        );

    const selectAllLabel = allVisibleSelected ? "Clear All" : "Select All";
    const showNoResults = sortedBrands.length === 0 && (localSearch?.trim() || searchTerm?.trim());
    return (
        <>

            <div className="flex flex-col px-8 p-4 space-y-8">
                <div className="border-b border-gray-100 pb-6 last:border-0">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900 text-base">Dark Store</h3>
                        {sortedBrands?.length > 3 && (
                            <button
                                type="button"
                                className="text-gray-500 hover:text-gray-700"
                                onClick={() => handleToggle("darkstore")}
                            >
                                {expanded["darkstore"] ? <IoIosArrowUp size={20} /> : <IoIosArrowDown size={20} />}
                            </button>
                        )}
                    </div>

                    <input
                        type="text"
                        placeholder="Search mother packs..."
                        className="w-[70%] px-[9px] py-[2px] mb-[6px] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={localSearch}
                        onChange={(e) => setLocalSearch(e.target.value)}
                    />
                    <label className="flex items-center font-bold gap-2 text-sm text-gray-700 cursor-pointer">
                        <input
                            type="checkbox"
                            className="w-4 h-4 text-blue-600 rounded"
                            // checked={sortedBrands.every(opt =>
                            //     isOptionChecked("darkstore", opt, selectedFiltersWidget)
                            // )}
                            checked={allVisibleSelected}
                            ref={(input) => {
                                if (input) input.indeterminate = !allVisibleSelected && someVisibleSelected;
                            }}
                            onChange={() => {
                                handleSelectAllUpdate(sortedBrands, allVisibleSelected);
                                handleSelectAll("darkstore", sortedBrands);
                            }}
                        />
                        {selectAllLabel}
                    </label>


                    {sortedBrands?.length > 0 && (
                        <div className={`space-y-2 transition-all duration-300 mt-2 ${expanded["darkstore"] ? "max-h-60 overflow-y-auto pr-2" : "max-h-[102px] overflow-hidden"}`}>
                            {visibleBrands.map((option) => {
                                const isChecked = isOptionChecked("darkstore", option, selectedFiltersWidget);
                                return (
                                    <DarkstoreOption
                                        key={option.value}
                                        option={option}
                                        isChecked={isChecked}
                                        onChange={() => {
                                            handleUpdate(option, isChecked);
                                            handleCheck("darkstore", option.value, isChecked);
                                        }}
                                    />
                                );
                            })}
                        </div>
                    )}

                    {showNoResults && (
                        <div className="px-8 p-4 text-sm text-gray-500">
                            No dark store found...
                        </div>
                    )}
                    {sortedBrands?.length > 2 && (
                        <button
                            type="button"
                            className="text-blue-500 text-sm font-medium mt-3 flex items-center"
                            onClick={() => handleToggle("darkstore")}
                        >
                            {expanded["darkstore"] ? "View Less" : "View More"}
                            <span className="ml-1">
                                {expanded["darkstore"] ? <IoIosArrowUp size={16} /> : <IoIosArrowDown size={16} />}
                            </span>
                        </button>
                    )}
                </div>
            </div>

        </>
    );
}

const DarkstoreOption = React.memo(({ option, isChecked, onChange }) => (
    <label className="flex items-start gap-2 text-sm text-gray-700 cursor-pointer ml-0">
        <span>
            <input
                type="checkbox"
                className="w-4 h-4 text-blue-600 rounded"
                checked={isChecked}
                onChange={onChange}
            />
            {option.label}
        </span>
    </label>
));
DarkstoreOption.displayName = "DarkstoreOption";

export default StoreDataIdFilterComponent;

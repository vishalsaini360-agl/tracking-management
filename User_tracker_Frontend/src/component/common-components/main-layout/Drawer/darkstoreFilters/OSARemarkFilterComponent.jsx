import React, { useMemo } from "react";
import { useEbuxContext } from "../../../../Ebux/Context/EbuxProvider";
import { isOptionChecked } from "../DrawerHelper";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
// import { sortOptionsWithSelectedOnTop } from "./DrawerHelper";
// import { filter } from "lodash";
// import TreeCheckbox from "./nestedComponent/TreeCheckbox"

function OSARemarkFilterComponent({ expanded, handleToggle, handleSelectAll,
    handleCheck, searchTerm
}) {
    // console.log('sectionsection222', section)
    const {
        kpi,
        filtersDarkStore,
        activeClientProject,
        selectedFiltersWidget,
        updateSelectedFilters

    } = useEbuxContext();
    // console.log('filtersfiltersfilters11', filters)

    const handleUpdate = (option, isChecked) => {
        let newProducts;
        // console.log('option.value',option.value)
        if (isChecked) {
            newProducts = selectedFiltersWidget?.selectedOSARemarks.filter(
                (p) => p.value !== option.value
            );
        } else {
            newProducts = [...(selectedFiltersWidget?.selectedOSARemarks || []), option];
        }
        // console.log('test data', activeClientProject?.client_project_id,kpi)
        updateSelectedFilters("selectedOSARemarks", newProducts);
        

    };


    const handleSelectAllUpdate = (options, allSelected) => {
        let newItems = [];

        if (allSelected) {
            // Unselect visible items only
            newItems = selectedFiltersWidget.selectedOSARemarks.filter(
                (b) => !options.some((opt) => opt.value === b.value)
            );
        } else {
            // Add all visible items, avoiding duplicates
            const uniqueItems = [
                ...selectedFiltersWidget.selectedOSARemarks,
                ...options.filter(
                    (opt) =>
                        !selectedFiltersWidget.selectedOSARemarks.some(
                            (sel) => sel.value === opt.value
                        )
                ),
            ];
            newItems = uniqueItems;
        }
        if (([2,11].indexOf(activeClientProject?.client_project_id) > -1) && (kpi == "OSA" || kpi == "PRO" || kpi == "RR")) {
            updateSelectedFilters("selectedOSARemarks", newItems);
        }
    };

    const sortedMotherPack = useMemo(() => {
        const list = Array.isArray(filtersDarkStore?.osa_remarks) ? filtersDarkStore?.osa_remarks : [];
        // 1️⃣ Apply search filter first
        const filteredList = searchTerm
            ? list.filter((b) =>
                b.label.toLowerCase().includes(searchTerm.toLowerCase())
            )
            : list;
        return [...filteredList].sort((a, b) => {
            const aChecked = selectedFiltersWidget?.selectedOSARemarks?.some((sel) => sel.value === a.value);
            const bChecked = selectedFiltersWidget?.selectedOSARemarks?.some((sel) => sel.value === b.value);
            if (aChecked === bChecked) return 0;
            return aChecked ? -1 : 1;
        });
    }, [searchTerm]);
    // }, [filters?.osa_remarks, selectedFiltersWidget?.selectedOSARemarks, searchTerm]);

     const allVisibleSelected =
        sortedMotherPack.length > 0 &&
        sortedMotherPack.every((opt) =>
            isOptionChecked("osa_remarks", opt, selectedFiltersWidget)
        );

    const someVisibleSelected =
        sortedMotherPack.some((opt) =>
            isOptionChecked("osa_remarks", opt, selectedFiltersWidget)
        );
    return (
        <>
            {sortedMotherPack?.length > 0 && (
                <div className="flex flex-col px-8 p-4 space-y-8">
                    {/* <div className=" overflow-y-auto px-8 p-4 space-y-8"> */}
                    <div className="border-b border-gray-100 pb-6 last:border-0">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-gray-900 text-base">OSA Status</h3>
                            {sortedMotherPack?.length > 3 && (
                                <button
                                    type="button"
                                    className="text-gray-500 hover:text-gray-700"
                                    onClick={() => handleToggle("osa_remarks")}
                                >
                                    {expanded["osa_remarks"] ? <IoIosArrowUp size={20} /> : <IoIosArrowDown size={20} />}
                                </button>
                            )}
                        </div>

                        <div className="space-y-2">
                            <div className={`space-y-2 transition-all duration-300 ${expanded["osa_remarks"] ? "max-h-60 overflow-y-auto pr-2" : "max-h-[102px] overflow-hidden"}`} >
                               
                                    <label className="flex items-center font-bold gap-2 text-sm text-gray-700 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 text-blue-600 rounded"
                                            // checked={isOptionChecked("osa_remarks", filters?.osa_remarks, selectedFiltersWidget?.selectedCategory)}
                                            // onChange={() => {
                                            //     const allSelected = filters?.osa_remarks.every((opt) =>
                                            //         isOptionChecked("osa_remarks", opt, selectedFilters)
                                            //     );
                                            //     handleSelectAllUpdate(filters?.osa_remarks, allSelected);
                                            //     handleSelectAll("osa_remarks", filters?.osa_remarks);
                                            // }}

                                            // checked={sortedMotherPack.every((opt) =>
                                            //     isOptionChecked("osa_remarks", opt, selectedFiltersWidget)
                                            // )}
                                            checked={allVisibleSelected}
                                            ref={(input) => {
                                                if (input) input.indeterminate = !allVisibleSelected && someVisibleSelected;
                                            }}
                                            onChange={() => {
                                                handleSelectAllUpdate(sortedMotherPack, allVisibleSelected)
                                                handleSelectAll("osa_remarks", sortedMotherPack);
                                            }}
                                        />
                                        Select All
                                    </label>
                                

                                {sortedMotherPack?.map((option, i) => {

                                    const isChecked = isOptionChecked("osa_remarks", option, selectedFiltersWidget);
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
                                                            handleCheck("osa_remarks", option.value, isChecked); // keep drawer state in sync
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

                        {sortedMotherPack?.length > 3 && (
                            <button
                                type="button"
                                className="text-blue-500 text-sm font-medium mt-3 flex items-center"
                                onClick={() => handleToggle("osa_remarks")}
                            >
                                {expanded["osa_remarks"] ? "View Less" : "View More"}
                                <span className="ml-1">
                                    {expanded["osa_remarks"] ? <IoIosArrowUp size={16} /> : <IoIosArrowDown size={16} />}
                                </span>
                            </button>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}

export default OSARemarkFilterComponent;
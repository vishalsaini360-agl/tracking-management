import React, { useMemo } from "react";
import { useEbuxContext } from "../../../Ebux/Context/EbuxProvider";
import { isOptionChecked, searchAndRank } from "./DrawerHelper";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
// import { sortOptionsWithSelectedOnTop } from "./DrawerHelper";
// import { filter } from "lodash";
// import TreeCheckbox from "./nestedComponent/TreeCheckbox"

function SomCategoryFilterComponent({ expanded, handleToggle,
    // handleSelectAll,
    handleCheck, searchTerm
}) {
    // console.log('sectionsection222', section)
    const {
        kpi,
        filters,
        selectedFiltersWidget,
        getDistinctFiltersSomFn,
    } = useEbuxContext();

    // const [categorySearch, setCategorySearch] = useState("");

    const handleUpdate = (option, isChecked) => {

        // special SOM category case
        let newSomCategories;
        if (isChecked) {
            newSomCategories = selectedFiltersWidget.selectCategory_som.filter(
                (c) => c.value !== option.value
            );
        } else {
            newSomCategories = [
                ...(selectedFiltersWidget.selectCategory_som || []),
                option,
            ];
        }
        getDistinctFiltersSomFn('category', newSomCategories);
    };


    // const handleSelectAllUpdate = (options, allSelected) => {
    //     let newItems = [];

    //     if (allSelected) {
    //         // Unselect visible items only
    //         newItems = selectedFiltersWidget.selectCategory_som.filter(
    //             (b) => !options.some((opt) => opt.value === b.value)
    //         );
    //     } else {
    //         // Add all visible items, avoiding duplicates
    //         const uniqueItems = [
    //             ...selectedFiltersWidget.selectCategory_som,
    //             ...options.filter(
    //                 (opt) =>
    //                     !selectedFiltersWidget.selectCategory_som.some(
    //                         (sel) => sel.value === opt.value
    //                     )
    //             ),
    //         ];
    //         newItems = uniqueItems;
    //     }
    //     updatecategory_som(newItems);
    // };


    const sortedCategories = useMemo(() => {
        const list = Array.isArray(filters?.category_som) ? filters.category_som : [];
        return searchAndRank(list, {
            globalSearch: searchTerm,
            // localSearch: categorySearch, // your local state
            localSeparator: "\\s+",
            localMode: "OR",
            globalMode: "OR",
            selectedValues: selectedFiltersWidget.selectCategory_som?.map(c => c.value) || [],
            labelKey: "label",
        });
    }, [searchTerm, filters?.category]);

    // ✅ Determine "Select All" checked state based on visible filtered items
    // const allVisibleSelected =
    //     sortedCategories.length > 0 &&
    //     sortedCategories.every((opt) =>
    //         isOptionChecked("category", opt, selectedFiltersWidget)
    //     );

    // const someVisibleSelected =
    //     sortedCategories.some((opt) =>
    //         isOptionChecked("category", opt, selectedFiltersWidget)
    //     );

    // const selectAllLabel = allVisibleSelected ? "Clear All" : "Select All";
    // const showNoResults = sortedCategories.length === 0 && (categorySearch?.trim() || searchTerm?.trim());
    return (
        <>

            <div className="flex flex-col px-8 p-4 space-y-8">
                {/* <div className=" overflow-y-auto px-8 p-4 space-y-8"> */}
                <div className="border-b border-gray-100 pb-6 last:border-0">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900 text-base">Category</h3>
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
                    {/* <input type="text" placeholder="Search Category..." className="w-[70%] px-[9px] py-[2px] mb-[6px] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={categorySearch} onChange={(e) => setCategorySearch(e.target.value)} /> */}
                    {sortedCategories?.length > 0 && (
                        <div className="space-y-2">
                            <div className={`space-y-2 transition-all duration-300 ${expanded["category"] ? "max-h-60 overflow-y-auto pr-2" : "max-h-[102px] overflow-hidden"}`} >

                                {/* <label className="flex items-center font-bold gap-2 text-sm text-gray-700 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 text-blue-600 rounded"
                                        checked={allVisibleSelected}
                                        ref={(input) => {
                                            if (input) input.indeterminate = !allVisibleSelected && someVisibleSelected;
                                        }}
                                        onChange={() => {
                                            handleSelectAllUpdate(sortedCategories, allVisibleSelected)
                                            handleSelectAll("category", sortedCategories);
                                        }}
                                    />
                                    {selectAllLabel}
                                </label> */}

                                {sortedCategories?.map((option, i) => {

                                    const isChecked = isOptionChecked("category", option, selectedFiltersWidget, kpi);
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
                                                            handleCheck((kpi === "SOS" || kpi === "OR" || kpi === "Wt_SOS" ? "keywordCategory" : "category"), option.value, isChecked, option.label); // keep drawer state in sync
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
                    {/* {showNoResults && (
                        <div className="px-8 p-4 text-sm text-gray-500">
                            No category found...
                        </div>
                    )} */}
                    {sortedCategories?.length > 2 && (
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
                    )}
                </div>
            </div>

        </>
    );
}

export default SomCategoryFilterComponent;
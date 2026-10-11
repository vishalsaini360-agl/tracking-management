import React, { useMemo } from "react";
import { useEbuxContext } from "../../../Ebux/Context/EbuxProvider";
import { isOptionChecked } from "./DrawerHelper";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { escapeRegExp } from "./DrawerHelper";
// import { sortOptionsWithSelectedOnTop } from "./DrawerHelper";
// import { filter } from "lodash";
// import TreeCheckbox from "./nestedComponent/TreeCheckbox"

function TagManagerFilterComponentKW({ expanded, handleToggle, handleSelectAll,
    handleCheck, searchTerm
}) {
    // console.log('sectionsection222', section)
    const {
        // kpi,
        // filters,
        tagList,
        // activeClientProject,
        selectedFiltersWidget,
        updateSelectedFilters

    } = useEbuxContext();
    // console.log('filtersfiltersfilters11tagList', tagList)

    const handleUpdate = (option, isChecked) => {
        let newProducts;
        // console.log('option.value',option.value)
        if (isChecked) {
            newProducts = selectedFiltersWidget?.selectedTagsKW.filter(
                (p) => p.id !== option.id
            );
        } else {
            newProducts = [...(selectedFiltersWidget?.selectedTagsKW || []), option];
        }

        // console.log('newProductsnewProductsnewProducts', newProducts)
        updateSelectedFilters("selectedTagsKW", newProducts);
    };


    const handleSelectAllUpdate = (options, allSelected) => {
        let newItems = [];

        if (allSelected) {
            // Unselect visible items only
            newItems = selectedFiltersWidget.selectedTagsKW.filter(
                (b) => !options.some((opt) => opt.id === b.id)
            );
        } else {
            // Add all visible items, avoiding duplicates
            const uniqueItems = [
                ...selectedFiltersWidget.selectedTagsKW,
                ...options.filter(
                    (opt) =>
                        !selectedFiltersWidget.selectedTagsKW.some(
                            (sel) => sel.id === opt.id
                        )
                ),
            ];
            newItems = uniqueItems;
        }
        updateSelectedFilters("selectedTagsKW", newItems);
    };

    const sortedMotherPack = useMemo(() => {
        let list = Array.isArray(tagList) ? tagList : [];
        list = list.filter(item => item?.tag_type === "Keyword");

        const searchInput = (searchTerm || "").trim();
        if (!searchInput) { return list; }

        const safe = escapeRegExp(searchInput);
        const regex = new RegExp(safe, "i");

        const filteredList = list.filter((item) => regex.test(item.tag_name));
        // return filteredList;
        return [...filteredList].sort((a, b) => {
            const aChecked = selectedFiltersWidget?.selectedTagsKW?.some((sel) => sel.tag_name === a.tag_name);
            const bChecked = selectedFiltersWidget?.selectedTagsKW?.some((sel) => sel.tag_name === b.tag_name);
            if (aChecked === bChecked) return 0;
            return aChecked ? -1 : 1;
        });
    }, [searchTerm]);

    const allVisibleSelected =
        sortedMotherPack.length > 0 &&
        sortedMotherPack.every((opt) =>
            isOptionChecked("tags_kw", opt, selectedFiltersWidget)
        );

    const someVisibleSelected =
        sortedMotherPack.some((opt) =>
            isOptionChecked("tags_kw", opt, selectedFiltersWidget)
        );
    return (
        <>
            {sortedMotherPack?.length > 0 && (
                <div className="flex flex-col px-8 p-4 space-y-8">
                    {/* <div className=" overflow-y-auto px-8 p-4 space-y-8"> */}
                    <div className="border-b border-gray-100 pb-6 last:border-0">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-gray-900 text-base">Tags</h3>
                            {sortedMotherPack?.length > 3 && (
                                <button
                                    type="button"
                                    className="text-gray-500 hover:text-gray-700"
                                    onClick={() => handleToggle("tags_kw")}
                                >
                                    {expanded["tags_kw"] ? <IoIosArrowUp size={20} /> : <IoIosArrowDown size={20} />}
                                </button>
                            )}
                        </div>

                        <div className="space-y-2">
                            <div className={`space-y-2 transition-all duration-300 ${expanded["tags_kw"] ? "max-h-60 overflow-y-auto pr-2" : "max-h-[102px] overflow-hidden"}`} >

                                <label className="flex items-center font-bold gap-2 text-sm text-gray-700 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 text-blue-600 rounded"

                                        checked={allVisibleSelected}
                                        ref={(input) => {
                                            if (input) input.indeterminate = !allVisibleSelected && someVisibleSelected;
                                        }}
                                        onChange={() => {
                                            handleSelectAllUpdate(sortedMotherPack, allVisibleSelected)
                                            handleSelectAll("tags_kw", sortedMotherPack);
                                        }}
                                    />
                                    Select All
                                </label>


                                {sortedMotherPack?.map((option, i) => {

                                    const isChecked = isOptionChecked("tags_kw", option, selectedFiltersWidget);
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
                                                            handleCheck("tags_kw", option.id, isChecked); // keep drawer state in sync
                                                        }}
                                                    />
                                                </span>

                                                {option.tag_name}
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
                                onClick={() => handleToggle("tags_kw")}
                            >
                                {expanded["tags_kw"] ? "View Less" : "View More"}
                                <span className="ml-1">
                                    {expanded["tags_kw"] ? <IoIosArrowUp size={16} /> : <IoIosArrowDown size={16} />}
                                </span>
                            </button>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}

export default TagManagerFilterComponentKW;
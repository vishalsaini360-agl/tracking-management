import React, { useMemo } from "react";
import { useEbuxContext } from "../../../../Ebux/Context/EbuxProvider";
import { isOptionChecked } from "../DrawerHelper";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { ENTITY_TYPE, EVENTS, getTrackerContext, trackCustomEvent, TRACKING_COMPONENT } from "../../../../../tracker";

function SellerType({ expanded, handleToggle, handleSelectAll,
    handleCheck, searchTerm
}) {
    const {
        kpi,
        filters,
        // activeClientProject,
        selectedFiltersWidget,
        updateSelectedFilters

    } = useEbuxContext();

    const handleUpdate = (option, isChecked) => {
        let newProducts;
        if (isChecked) {
            newProducts = selectedFiltersWidget?.selectedSellerType.filter(
                (p) => p.value !== option.value
            );
        } else {
            newProducts = [...(selectedFiltersWidget?.selectedSellerType || []), option];
        }
        // console.log('newProducts',newProducts)
        updateSelectedFilters("selectedSellerType", newProducts);
    };


    const handleSelectAllUpdate = (options, allSelected) => {
        let newItems = [];

        if (allSelected) {
            // Unselect visible items only
            newItems = selectedFiltersWidget.selectedSellerType.filter(
                (b) => !options.some((opt) => opt.value === b.value)
            );
        } else {
            // Add all visible items, avoiding duplicates
            const uniqueItems = [
                ...selectedFiltersWidget.selectedSellerType,
                ...options.filter(
                    (opt) =>
                        !selectedFiltersWidget.selectedSellerType.some(
                            (sel) => sel.value === opt.value
                        )
                ),
            ];
            newItems = uniqueItems;
        }
        updateSelectedFilters("selectedSellerType", newItems);
    };

    const sortedMotherPack = useMemo(() => {
        const list = Array.isArray(filters?.sellerType) ? filters?.sellerType : [];
        // 1️⃣ Apply search filter first
        const filteredList = searchTerm
            ? list.filter((b) =>
                b.label.toLowerCase().includes(searchTerm.toLowerCase())
            )
            : list;
        return [...filteredList].sort((a, b) => {
            const aChecked = selectedFiltersWidget?.selectedSellerType?.some((sel) => sel.value === a.value);
            const bChecked = selectedFiltersWidget?.selectedSellerType?.some((sel) => sel.value === b.value);
            if (aChecked === bChecked) return 0;
            return aChecked ? -1 : 1;
        });
    }, [searchTerm]);

    const allVisibleSelected =
        sortedMotherPack.length > 0 &&
        sortedMotherPack.every((opt) =>
            isOptionChecked("seller_type", opt, selectedFiltersWidget)
        );

    const someVisibleSelected =
        sortedMotherPack.some((opt) =>
            isOptionChecked("seller_type", opt, selectedFiltersWidget)
        );
    return (
        <>
            {sortedMotherPack?.length > 0 && (
                <div className="flex flex-col px-8 p-4 space-y-8">
                    {/* <div className=" overflow-y-auto px-8 p-4 space-y-8"> */}
                    <div className="border-b border-gray-100 pb-6 last:border-0">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-gray-900 text-base">Seller Type</h3>
                            {sortedMotherPack?.length > 3 && (
                                <button
                                    type="button"
                                    className="text-gray-500 hover:text-gray-700"
                                    onClick={() => handleToggle("seller_type")}
                                >
                                    {expanded["seller_type"] ? <IoIosArrowUp size={20} /> : <IoIosArrowDown size={20} />}
                                </button>
                            )}
                        </div>

                        <div className="space-y-2">
                            <div className={`space-y-2 transition-all duration-300 ${expanded["seller_type"] ? "max-h-60 overflow-y-auto pr-2" : "max-h-[102px] overflow-hidden"}`} >

                                <label className="flex items-center font-bold gap-2 text-sm text-gray-700 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 text-blue-600 rounded"

                                        checked={allVisibleSelected}
                                        ref={(input) => {
                                            if (input) input.indeterminate = !allVisibleSelected && someVisibleSelected;
                                        }}
                                        onChange={() => {
                                            trackCustomEvent(
                                                allVisibleSelected ? EVENTS.UNSELECT_ALL : EVENTS.SELECT_ALL,
                                                {
                                                    section: "seller_type",
                                                    action: allVisibleSelected ? "unselect_all" : "select_all",
                                                    count: sortedMotherPack?.length
                                                },
                                                ENTITY_TYPE.FILTER,
                                                getTrackerContext(kpi, null, { component_type: TRACKING_COMPONENT.CHECKBOX })
                                            );
                                            handleSelectAllUpdate(sortedMotherPack, allVisibleSelected)
                                            handleSelectAll("seller_type", sortedMotherPack);
                                        }}
                                    />
                                    Select All
                                </label>


                                {sortedMotherPack?.map((option, i) => {

                                    const isChecked = isOptionChecked("seller_type", option, selectedFiltersWidget);
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
                                                            handleCheck("seller_type", option.value, isChecked, option.label); // keep drawer state in sync
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
                                onClick={() => {
                                    trackCustomEvent(
                                        expanded["seller_type"] ? EVENTS.VIEW_LESS : EVENTS.VIEW_MORE,
                                        { section: "seller_type" },
                                        ENTITY_TYPE.FILTER,
                                        getTrackerContext(kpi, null, { component_type: TRACKING_COMPONENT.DRAWER })
                                    );
                                    handleToggle("seller_type");
                                }}
                            >
                                {expanded["seller_type"] ? "View Less" : "View More"}
                                <span className="ml-1">
                                    {expanded["seller_type"] ? <IoIosArrowUp size={16} /> : <IoIosArrowDown size={16} />}
                                </span>
                            </button>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}

export default SellerType;
import React, { useState, useEffect, useMemo } from "react";
import { useEbuxContext } from "../../../../Ebux/Context/EbuxProvider";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import { isEqual } from "lodash";
import { getBuyBoxSellerTypeAndSellers } from "../../../../Ebux/services/ebuxMaster.service";
import { escapeRegExp } from "../DrawerHelper";
import { ENTITY_TYPE, EVENTS, getTrackerContext, trackCustomEvent, TRACKING_COMPONENT } from "../../../../../tracker";



function SellerTypeFilterComponent({ expanded, handleToggle, handleSelectAll, handleCheck, searchTerm }) {
    const {
        kpi,
        filters, selectedFilters,
        activeClientProject,
        selectedFiltersWidget,
        setSelectedFiltersWidget,
        setFilters, selectedMsl
    } = useEbuxContext();
    const [sellerTypeSearch, setSellerTypeSearch] = useState("");

    const [localSelectedSellerType, setLocalSelectedSellerType] = useState(
        selectedFiltersWidget?.selectedSellerType ? [...selectedFiltersWidget.selectedSellerType] : []
    );

    useEffect(() => {
        setLocalSelectedSellerType(
            selectedFiltersWidget?.selectedSellerType ? [...selectedFiltersWidget.selectedSellerType] : []
        );
    }, [selectedFiltersWidget?.selectedSellerType]);

    const handleUpdate = (option, isChecked) => {
        let newSellerType;
        if (isChecked) {
            newSellerType = (localSelectedSellerType || []).filter(
                (p) => p.value !== option.value
            );
        } else {
            newSellerType = [...((localSelectedSellerType || []) || []), option];
        }

        setLocalSelectedSellerType(newSellerType);
    };

    const handleSelectAllUpdate = (options, allSelected) => {
        trackCustomEvent(
            allSelected ? EVENTS.UNSELECT_ALL : EVENTS.SELECT_ALL,
            {
                section: "seller_type",
                action: allSelected ? "unselect_all" : "select_all",
                count: options?.length
            },
            ENTITY_TYPE.FILTER,
            getTrackerContext(kpi, null, { component_type: TRACKING_COMPONENT.CHECKBOX })
        );

        let newSellerType = [];

        if (allSelected) {
            newSellerType = (localSelectedSellerType || []).filter(
                (b) => !options.some((opt) => opt.value === b.value)
            );
        } else {
            const uniqueItems = [
                ...(localSelectedSellerType || []),
                ...options.filter(
                    (opt) =>
                        !(localSelectedSellerType || []).some(
                            (sel) => sel.value === opt.value
                        )
                ),
            ];
            newSellerType = uniqueItems;
        }
        setLocalSelectedSellerType(newSellerType);
    };


    const handleClearAll = () => {
        trackCustomEvent(
            EVENTS.CLEAR_ALL,
            { section: "seller_type" },
            ENTITY_TYPE.FILTER,
            getTrackerContext(kpi, null, { component_type: TRACKING_COMPONENT.DRAWER })
        );

        setLocalSelectedSellerType([]);
        if (typeof handleSelectAll === "function") {
            handleSelectAll("seller_type", []);
        }
    };

    const handleApplyClick = async () => {
        const current = localSelectedSellerType || [];
        trackCustomEvent(
            EVENTS.APPLY,
            {
                section: "seller_type",
                selected_count: current.length,
                selected: current.map(c => c.label || c.value)
            },
            ENTITY_TYPE.FILTER,
            getTrackerContext(kpi, null, { component_type: TRACKING_COMPONENT.DRAWER })
        );

        if (isEqual(JSON.stringify(selectedFiltersWidget?.selectedSellerType), JSON.stringify(current))) {
            return;
        }


        const tagSkuList = selectedFiltersWidget.selectedTags?.flatMap(tag => tag?.tag_details?.map(d => d?.sku_or_keyword) ?? []) ?? [];
        let seller_response;
        const payload = {
            selectedFilters: {
                selectedPlatform: selectedFiltersWidget.selectedPlatform?.map(i => ({ value: i?.id_in_db ?? i?.value ?? "", label: i?.label ?? "" })) ?? [],
                selectedBrand: selectedFiltersWidget.selectedBrand?.map(i => ({ value: i?.id_in_db ?? i?.value ?? "", label: i?.label ?? "" })) ?? [],
                selectedCategory: selectedFiltersWidget.selectedCategory?.map(i => ({ value: i?.id_in_db ?? i?.value ?? "", label: i?.label ?? "" })) ?? [],
                selectedSellerType: current?.map(i => ({ value: i?.id_in_db ?? i?.value ?? "", label: i?.label ?? "" })) ?? [],
                selectedSellerList: selectedFiltersWidget?.selectedSellerList?.map(i => ({ value: i?.id_in_db ?? i?.value ?? "", label: i?.label ?? "" })) ?? [],
                selectedProductId: selectedFiltersWidget.selectedProductId?.map(i => ({ value: i?.id_in_db ?? i?.value ?? "", label: i?.label ?? "", web_pid: i?.web_pid ?? "" })) ?? [],
                selectedMsl: selectedMsl,
                tagSkuList: tagSkuList ?? []
            }
        }
        if (activeClientProject?.isFilterDateWise) {
            const dateRangeData = { calendarType: selectedFilters?.calendarType, selectedDateRange: selectedFilters?.selectedDateRange, selectedWeeks: selectedFilters?.selectedWeeks };
            seller_response = await getBuyBoxSellerTypeAndSellers({ ...payload, dateRangeData });
        } else {
            seller_response = await getBuyBoxSellerTypeAndSellers(payload);
        }

        setFilters(prevFilters => ({
            ...prevFilters,
            sellerType: seller_response?.seller_types ?? [],
            sellerList: seller_response?.sellers ?? []
        }));

        setSelectedFiltersWidget(prevFilters => ({
            ...prevFilters,
            selectedSellerType: current ?? []
        }));

        if (typeof handleCheck === "function") {
            const allSellerTypes = Array.isArray(filters?.sellerType) ? filters.sellerType : [];
            allSellerTypes.forEach((mp) => {
                const isChecked = current.some((c) => c.value === mp.value);
                handleCheck("seller_type", mp.value, !isChecked, mp.label, true);
            });
        }

    };

    const sortedSellerType = useMemo(() => {
        const list = Array.isArray(filters?.sellerType) ? filters.sellerType : [];
        const searchInput = (sellerTypeSearch || searchTerm || "").trim();

        if (!searchInput) {
            return list;
        }

        const terms = searchInput.split(";").map((t) => t.trim()).filter(Boolean);
        if (terms.length === 0) return list;

        const regexes = terms.map((t) => new RegExp(escapeRegExp(t), "i"));
        const filteredList = list.filter((item) => regexes.some((regex) => regex.test(item.label || "")));
        const selectedValues = (localSelectedSellerType || []).map((p) => p.value);
        const sortedList = [...filteredList].sort((a, b) => {
            const aSelected = selectedValues.includes(a.value);
            const bSelected = selectedValues.includes(b.value);
            if (aSelected === bSelected) return 0;
            return aSelected ? -1 : 1;
        });
        return sortedList;
    }, [filters?.sellerType, searchTerm, sellerTypeSearch, localSelectedSellerType]);


    const allVisibleSelected = sortedSellerType.length > 0 && sortedSellerType.every((opt) =>
        (localSelectedSellerType || []).some((sel) => sel.value === opt.value)
    );

    const someVisibleSelected = sortedSellerType.some((opt) =>
        (localSelectedSellerType || []).some((sel) => sel.value === opt.value)
    );

    const selectAllLabel = allVisibleSelected ? "Clear All" : "Select All";
    const showNoResults = sortedSellerType.length === 0 && (sellerTypeSearch?.trim() || searchTerm?.trim());
    return (
        <>
            <div className="flex flex-col px-8 p-4 space-y-8">
                <div className="border-b border-gray-100 pb-6 last:border-0">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="flex font-semibold text-gray-900 text-base">Seller Type
                            {
                                selectedFiltersWidget?.selectedSellerType?.length > 0 ?
                                    <span className="ml-1 flex items-center justify-center w-5 h-5 text-[10px] rounded-full bg-[#F0F0F0]">{selectedFiltersWidget?.selectedSellerType.length}</span>
                                    : <></>
                            }
                        </h3>
                        {sortedSellerType?.length > 3 && (
                            <button
                                type="button"
                                className="text-gray-500 hover:text-gray-700"
                                onClick={() => handleToggle("seller_type")}
                            >
                                {expanded["seller_type"] ? <IoIosArrowUp size={20} /> : <IoIosArrowDown size={20} />}
                            </button>
                        )}
                    </div>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search sellers..."
                            className="w-[70%] px-[9px] py-[2px] pr-[24px] mb-[6px] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={sellerTypeSearch}
                            onChange={(e) => setSellerTypeSearch(e.target.value)}
                            onBlur={(e) => {
                                if (e.target.value?.trim()) {
                                    trackCustomEvent(
                                        EVENTS.SEARCH,
                                        {
                                            section: "seller_type",
                                            search_term: e.target.value
                                        },
                                        ENTITY_TYPE.FILTER,
                                        getTrackerContext(kpi, null, { component_type: TRACKING_COMPONENT.DRAWER })
                                    );
                                }
                            }}
                        />
                        {sellerTypeSearch && (
                            <RxCross2
                                size={18}
                                className="absolute right-[6.4rem] top-[45%] -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer z-10"
                                onClick={() => {
                                    trackCustomEvent(
                                        EVENTS.CLEAR,
                                        {
                                            section: "seller_type",
                                            action: "clear_search"
                                        },
                                        ENTITY_TYPE.FILTER,
                                        getTrackerContext(kpi, null, { component_type: TRACKING_COMPONENT.DRAWER })
                                    );
                                    setSellerTypeSearch("");
                                }}
                            />
                        )}
                    </div>
                    {sortedSellerType?.length > 0 && (
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
                                            handleSelectAllUpdate(sortedSellerType, allVisibleSelected)
                                        }}
                                    />
                                    {selectAllLabel}
                                </label>


                                {sortedSellerType?.map((option, i) => {
                                    const isChecked = (localSelectedSellerType || []).some(
                                        (sel) => sel.value === option.value
                                    );
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
                    )}
                    {showNoResults && (
                        <div className="px-8 p-4 text-sm text-gray-500">
                            No seller type found...
                        </div>
                    )}
                    <div className="flex justify-between relative top-[8px]">
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
                        <div className="flex items-center justify-end gap-3">
                            <button
                                type="button"
                                className="px-2 py-1 text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                                onClick={handleClearAll}
                            >
                                Clear All
                            </button>

                            <button
                                type="button"
                                className="px-2 py-1 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                onClick={handleApplyClick}
                            >
                                Apply
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
}

export default SellerTypeFilterComponent;
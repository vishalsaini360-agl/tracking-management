import React, { useMemo } from "react";
import { useEbuxContext } from "../../../Ebux/Context/EbuxProvider";
import { isOptionChecked } from "./DrawerHelper";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";

function SomBrandFilterComponent({ expanded, handleToggle,
    handleCheck, searchTerm
}) {
    // console.log('sectionsection222', searchTerm)
    const {
        filters,
        selectedFiltersWidget,
        getDistinctFiltersSomFn,
    } = useEbuxContext();
    
    const handleUpdate = (option, isChecked) => {
        let newBrands;
        if (isChecked) {
            newBrands = selectedFiltersWidget.selectedBrand.filter(
                (b) => b.value !== option.value
            );
        } else {
            newBrands = [...(selectedFiltersWidget.selectedBrand || []), option];
        }
        getDistinctFiltersSomFn('brand',newBrands);
    };


    const sortedBrands = useMemo(() => {
        const list = Array.isArray(filters?.brand) ? filters.brand : [];
        return list
    }, [searchTerm, filters?.brand, selectedFiltersWidget]);

    return (
        <>

            <div className="flex flex-col px-8 p-4 space-y-8">
                <div className="border-b border-gray-100 pb-6 last:border-0">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900 text-base">Brand</h3>
                        {sortedBrands?.length > 3 && (
                            <button
                                type="button"
                                className="text-gray-500 hover:text-gray-700"
                                onClick={() => handleToggle("brand")}
                            >
                                {expanded["brand"] ? <IoIosArrowUp size={20} /> : <IoIosArrowDown size={20} />}
                            </button>
                        )}
                    </div>
                    {sortedBrands?.length > 0 && (
                        <div className="space-y-2">
                            <div className={`space-y-2 transition-all duration-300 ${expanded["brand"] ? "max-h-60 overflow-y-auto pr-2" : "max-h-[102px] overflow-hidden"}`} >
                                {sortedBrands?.map((option, i) => {

                                    const isChecked = isOptionChecked("brand", option, selectedFiltersWidget);
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
                                                            handleCheck("brand", option.value, isChecked, option.label); // keep drawer state in sync // true - false, false->
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
                    
                    {sortedBrands?.length > 2 && (
                        <button
                            type="button"
                            className="text-blue-500 text-sm font-medium mt-3 flex items-center"
                            onClick={() => handleToggle("brand")}
                        >
                            {expanded["brand"] ? "View Less" : "View More"}
                            <span className="ml-1">
                                {expanded["brand"] ? <IoIosArrowUp size={16} /> : <IoIosArrowDown size={16} />}
                            </span>
                        </button>
                    )}
                </div>
            </div>

        </>
    );
}

export default SomBrandFilterComponent;
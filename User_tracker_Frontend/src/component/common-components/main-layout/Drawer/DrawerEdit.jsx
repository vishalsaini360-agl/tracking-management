import React, { useEffect, useMemo, useState, Suspense, lazy } from "react";
import { RxCross2 } from "react-icons/rx";

import BrandCommonFilterComponent from "./BrandFilterComponent";
import BrandCompetitionFilterComponent from "./BrandCompetitionFilterComponent";
import ProductCompetitionFilterComponent from "./ProductCompetitionFilterComponent";
import SegmentFilterComponent from "./SegmentFilterComponent";
import CategoryFilterComponent from "./CategoryFilterComponent";
import KeywordCategoryFilterComponent from "./KeywordCategoryFilterComponent";
import { useEbuxContext } from "../../../Ebux/Context/EbuxProvider";
import { ENTITY_TYPE, EVENTS, getTrackerContext, trackCustomEvent, TRACKING_COMPONENT } from "../../../../tracker";

import ProductFilterComponent from "./ProductFilterComponent";
import MotherPackFilterComponent from "./MotherPackFilterComponent";
import PlatformFilterComponent from "./PlatformFilterComponent";
import OSARemarkFilterComponent from "./OSARemarkFilterComponent";
import TagManagerFilterComponent from "./TagManagerFilterComponent";
import TreeCheckbox from "./nestedComponent/TreeCheckbox"
// import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import KeywordFilterComponent from "./KeywordFilterComponent";
import PerfettiBrandFilterComponent from "./perfetti/BrandFilterComponent";
import PerfettiCategoryFilterComponent from "./perfetti/CategoryFilterComponent";
import ProductFilterPerfetti from "./perfetti/ProductFilterComponent";
import KeywordCategoryTypeFilterComponent from "./KeywordCategoryTypeFilterComponent";
import SponsFlagFilterComponent from "./SponsFlagFilterComponent";

// indented
import CategoryFilterComponentIndented from "./indented/CategoryFilterComponent";
import KeywordCategoryFilterComponentIndented from "./indented/KeywordCategoryFilterComponent";
// indented


import PlatformFilterComponentDarkStore from "./darkstoreFilters/PlatformFilterComponent";
import BrandCommonFilterComponentDarkStore from "./darkstoreFilters/BrandFilterComponent";
import CategoryFilterComponentDarkStore from "./darkstoreFilters/CategoryFilterComponent";
import CategoryFilterComponentDarkStoreIndented from "./indented/darkstore/CategoryFilterComponent";
import MotherPackFilterComponentDarkStore from "./darkstoreFilters/MotherPackFilterComponent";
import ProductFilterComponentDarkStore from "./darkstoreFilters/ProductFilterComponent";
import OSARemarkFilterComponentDarkStore from "./darkstoreFilters/OSARemarkFilterComponent";
import PerfettiBrandFilterComponentDarkStore from "./darkstoreFilters/perfetti/BrandFilterComponent";
import PerfettiCategoryFilterComponentDarkStore from "./darkstoreFilters/perfetti/CategoryFilterComponent";
import PerfettiProductFilterComponentDarkStore from "./darkstoreFilters/perfetti/ProductFilterComponent";
import RangeFilterComponentDarkStore from "./darkstoreFilters/RangeFilterComponent";


import SomBrandFilterComponent from "./SomBrandFilterComponent";
import SomCategoryFilterComponent from "./SomCategoryFilterComponent";
import SomCategoryNodeFilterComponent from "./SomCategoryNodeFilterComponent";
import DynamicPFilterComponent from "./DynamicPComponent";
import StaticPFilterComponent from "./StaticPComponent";
import SubBrandFilterComponent from "./SubBrandComponent";
import ProductTypeFilterComponent from "./ProductTypeFilterComponent";
import SellerType from "./buybox/SellerType";
import SellerTypeFilterComponent from "./buybox/SellerTypeFilterComponent";
import SellerListFilterComponent from "./buybox/SellerListFilterComponent";
import TagManagerFilterComponentKW from "./TagManagerFilterComponentKW";
import SegmentFilterComponentDarkStore from "./darkstoreFilters/SegmentFilterComponentDarkStore";
import DynamicPFilterComponentDarkStore from "./darkstoreFilters/DynamicPComponentDarkStore";
import StaticPFilterComponentDarkStore from "./darkstoreFilters/StaticPComponentDarkStore";
import SubBrandFilterComponentDarkStore from "./darkstoreFilters/SubBrandComponentDarkStore";
import ProductTypeFilterComponentDarkStore from "./darkstoreFilters/ProductTypeFilterComponentDarkStore";
import DarkstoreStatusFilter from "./DarkstoreStatusFilter";
// import StoreDataIdFilterComponent from "./darkstoreFilters/StoreDataIdFilterComponent";
const StoreDataIdFilterComponent = lazy(() => import("./darkstoreFilters/StoreDataIdFilterComponent"));

import { useLocation } from "react-router-dom";
import AlertControlFilters from "./AlertControlFilters";
import PerfettiKeywordCategoryFilterComponent from "./perfetti/KeywordCategoryFilterComponent";
import PerfettiKeywordFilterComponent from "./perfetti/KeywordFilterComponent";


import RangeFilterComponent from "./RangeFilterComponent";


function DrawerEdit({ onClose, defaultSelected }) {
    const { kpi, filters,
        setFilters,
        mainApiResponse,
        // selectedFilters,
        activeClientProject,
        setFiltersDarkStore,
        selectedMsl,
        selectedMslFilter,
        setHeaderFilterChips, setSelectedFilters, selectedFiltersWidget, setSelectedFiltersWidget, filtersDarkStore, setSelectedMsl, setSelectedMslFilter, updateSelectedFilters,
        firstTimeLoadFilter, setFirstTimeLoadFilter, setSelectedFiltersCompetition,
        tabColumnList, comprehensiveselectedTabName } = useEbuxContext();
    const isDarkStore = filtersDarkStore?.tab_type === "dark_store_analysis";
    const activeFilters = isDarkStore ? filtersDarkStore : filters;

    const isCompetitionBrandSelected = useMemo(() => {
        if (!tabColumnList) return false;
        const allCols = Object.values(tabColumnList).flat();
        //console.log('allColsallColsallCols',allCols,comprehensiveselectedTabName)
        return allCols.some((col) => col?.key === "competition_brand");
    }, [tabColumnList]);

    const isCompetitionProductSelected = useMemo(() => {
        if (!tabColumnList) return false;
        const allCols = Object.values(tabColumnList).flat();
        // console.log('allColsallColsallCols',allCols)
        return allCols.some((col) => col?.key === "competition_web_pid" || col?.key === "competition_sku_name");
    }, [tabColumnList]);

    // console.log('filters', filters);
    // console.log('filtersDarkStore2', filtersDarkStore?.products);
    //eslint-disable-next-line
    const [expanded, setExpanded] = useState({});
    const [checkedItems, setCheckedItems] = useState({});
    const [selectedLocation, setSelectedLocation] = useState([]);
    const [expandedItems, setExpandedItems] = useState({});
    //eslint-disable-next-line
    const [checkedLocation, setCheckedLocation] = useState({});
    const [searchTerm, setSearchTerm] = useState("");


    const { alertFilters, setAlertFilters, defaultAlertFilters } = useEbuxContext();
    //const [openAlerFilter, setOpenAlertFilter] = useState(false);
    const location = useLocation();


    const isAlertControlPage = location.pathname.startsWith("/alert-control");

    const [openAlerFilter, setOpenAlertFilter] = useState(isAlertControlPage);

    useEffect(() => {
        trackCustomEvent(
            EVENTS.DRAWER_OPEN,
            {},
            ENTITY_TYPE.DRAWER,
            getTrackerContext(kpi, filtersDarkStore?.tab_type, {
                component_type: TRACKING_COMPONENT.DRAWER
            })
        );
        return () => {
            trackCustomEvent(
                EVENTS.DRAWER_CLOSE,
                {},
                ENTITY_TYPE.DRAWER,
                getTrackerContext(kpi, filtersDarkStore?.tab_type, {
                    component_type: TRACKING_COMPONENT.DRAWER
                })
            );
        };
    }, []);

    useEffect(() => {
        if (isAlertControlPage) {
            setOpenAlertFilter(true);
        }
    }, [isAlertControlPage]);

    // console.log('filtersDarkStorefiltersDarkStore', filtersDarkStore)

    // const mainLocationDataOld = useMemo(() => {
    //     if (!filters?.location) return [];
    //     const regionMap = {};

    //     filters.location.forEach(cityItem => {
    //         cityItem.pincodes.forEach(pin => {
    //             const stateName = pin.state.trim() || pin.state_name.trim() || "Unknown State";
    //             const cityName = pin.city.trim() || cityItem.label.trim() || cityItem.lable.trim();
    //             const cityValue = cityItem.value.trim() ?? cityName.trim();

    //             const regionName = pin.region.trim() || "Unknown Region";
    //             // const regionValue = pin.region ?? regionName;

    //             const pincodeLabel = String(pin.label ?? pin.lable);
    //             const pincodeValue = pin.value ?? pincodeLabel;

    //             // ✅ Build Region → State → City → Pincode
    //             if (!regionMap[regionName]) {
    //                 regionMap[regionName] = {};
    //             }
    //             if (!regionMap[regionName][stateName]) {
    //                 regionMap[regionName][stateName] = {};
    //             }
    //             if (!regionMap[regionName][stateName][cityName]) {
    //                 regionMap[regionName][stateName][cityName] = {
    //                     value: cityValue,
    //                     pincodes: []
    //                 };
    //             }

    //             regionMap[regionName][stateName][cityName].pincodes.push({
    //                 label: pincodeLabel,
    //                 value: pincodeValue,
    //                 children: [] // ✅ no DarkStore info, keep empty
    //             });
    //         });
    //     });

    //     // ✅ Convert to tree format: Region → State → City → Pincode
    //     return Object.entries(regionMap).map(([regionName, states]) => ({
    //         label: regionName,
    //         value: regionName, // keep same
    //         children: Object.entries(states).map(([stateName, cities]) => ({
    //             label: stateName,
    //             value: stateName, // keep same
    //             children: Object.entries(cities).map(([cityName, cityObj]) => ({
    //                 label: cityName,
    //                 value: cityObj.value,
    //                 children: cityObj.pincodes
    //             }))
    //         }))
    //     }));
    // }, [filters.location]);



    // console.log("mainLocationData", { mainLocationData, "actual location": filters.location })

    // console.log("selected Location", selectedLocation)



    // ✅ Location tree builder. Akash

    //   const mainLocationData = useMemo(() => {
    //     // 🔹 CHANGED from `filters?.location` → `activeFilters?.location`
    //     if (!activeFilters?.location) return [];
    //     const regionMap = {};

    //         activeFilters.location.forEach(cityItem => {
    //             cityItem.pincodes.forEach(pin => {
    //                 const stateName = pin?.state?.trim() || pin?.state_name?.trim() || "Unknown State";
    //                 const cityName = pin?.city?.trim() || cityItem?.label?.trim() || cityItem?.lable?.trim();
    //                 const cityValue = cityItem?.value?.trim() ?? cityName?.trim();

    //                 const regionName = pin?.region?.trim() || "Unknown Region";
    //                 // const regionValue = pin.region ?? regionName;

    //                 const pincodeLabel = String(pin?.label ?? pin?.lable);
    //                 const pincodeValue = pin?.value ?? pincodeLabel;
    //                 if ([101, 102]?.indexOf(activeClientProject?.client_project_id) > -1) {

    //                     // ✅ Build Region → City → Pincode
    //                     if (!regionMap[regionName]) {
    //                         regionMap[regionName] = {};
    //                     }
    //                     if (!regionMap[regionName][cityName]) {
    //                         regionMap[regionName][cityName] = {
    //                             value: cityValue,
    //                             pincodes: []
    //                         };
    //                     }

    //                     regionMap[regionName][cityName].pincodes.push({
    //                         label: pincodeLabel,
    //                         value: pincodeValue,
    //                         children: [] // ✅ no DarkStore info, keep empty
    //                     });

    //                 } else {

    //                     // ✅ Build Region → State → City → Pincode
    //                     if (!regionMap[regionName]) {
    //                         regionMap[regionName] = {};
    //                     }
    //                     if (!regionMap[regionName][stateName]) {
    //                         regionMap[regionName][stateName] = {};
    //                     }
    //                     if (!regionMap[regionName][stateName][cityName]) {
    //                         regionMap[regionName][stateName][cityName] = {
    //                             value: cityValue,
    //                             pincodes: []
    //                         };
    //                     }

    //                     regionMap[regionName][stateName][cityName].pincodes.push({
    //                         label: pincodeLabel,
    //                         value: pincodeValue,
    //                         children: [] // ✅ no DarkStore info, keep empty
    //                     });
    //                 }
    //             });
    //         });
    //         if ([101, 102]?.indexOf(activeClientProject?.client_project_id) > -1) {
    //             // ✅ Convert to tree format: Region → State → City → Pincode
    //             return Object.entries(regionMap).map(([regionName, cities]) => ({
    //                 label: regionName,
    //                 value: regionName, // keep same
    //                 children: Object.entries(cities).map(([cityName, cityObj]) => ({
    //                     label: cityName,
    //                     value: cityObj.value,
    //                     children: cityObj.pincodes
    //                 }))
    //             }));
    //         } else {
    //             // ✅ Convert to tree format: Region → State → City → Pincode
    //             return Object.entries(regionMap).map(([regionName, states]) => ({
    //                 label: regionName,
    //                 value: regionName, // keep same
    //                 children: Object.entries(states).map(([stateName, cities]) => ({
    //                     label: stateName,
    //                     value: stateName, // keep same
    //                     children: Object.entries(cities).map(([cityName, cityObj]) => ({
    //                         label: cityName,
    //                         value: cityObj.value,
    //                         children: cityObj.pincodes
    //                     }))
    //                 }))
    //             }));

    //         }
    //     }, [activeFilters.location]);

    // new code by parveen 
    const mainLocationData = useMemo(() => {
        const locations = activeFilters?.location;
        if (!locations?.length) return [];

        const regionMap = Object.create(null);
        const isSimpleProject = [101, 102].includes(activeClientProject?.client_project_id);

        // --- Build nested structure efficiently ---
        for (let i = 0, len = locations.length; i < len; i++) {
            const cityItem = locations[i];
            const cityPincodes = cityItem?.pincodes;
            if (!cityPincodes?.length) continue;

            const cityLabel = (cityItem.label || cityItem.lable || "").trim();
            const cityValue = (cityItem.value || cityLabel).trim();

            for (let j = 0, plen = cityPincodes.length; j < plen; j++) {
                const pin = cityPincodes[j];
                const stateName =
                    (pin?.state || pin?.state_name || "Unknown State").trim();
                const cityName =
                    (pin?.city || cityLabel || "Unknown City").trim();
                const regionName = (pin?.region || "Unknown Region").trim();

                const pincodeLabel = String(pin?.label ?? pin?.lable ?? "");
                const pincodeValue = pin?.value ?? pincodeLabel;
                const pincodeLocationKey = pin?.location_key ?? pincodeValue;
                const pincodePfId = pin?.pf_id ?? pincodeValue;

                const nodeData = {
                    label: pincodeLabel,
                    value: pincodeValue,
                    location_key: pincodeLocationKey,
                    pf_id: pincodePfId,
                    latitude: pin?.latitude ?? null,
                    longitude: pin?.longitude ?? null,
                    children: []
                };

                // --- Build structure ---
                if (isSimpleProject) {
                    // Region → City → Pincode
                    let region = regionMap[regionName];
                    if (!region) region = regionMap[regionName] = Object.create(null);

                    let city = region[cityName];
                    if (!city) {
                        city = region[cityName] = { value: cityValue, pincodes: [] };
                    }

                    city.pincodes.push(nodeData);
                } else {
                    // Region → State → City → Pincode
                    let region = regionMap[regionName];
                    if (!region) region = regionMap[regionName] = Object.create(null);

                    let state = region[stateName];
                    if (!state) state = region[stateName] = Object.create(null);

                    let city = state[cityName];
                    if (!city) {
                        city = state[cityName] = { value: cityValue, pincodes: [] };
                    }

                    city.pincodes.push(nodeData);
                }
            }
        }

        // --- Convert to tree format ---
        const regions = [];
        for (const regionName in regionMap) {
            if (isSimpleProject) {
                const cities = regionMap[regionName];
                const cityChildren = [];
                for (const cityName in cities) {
                    const cityObj = cities[cityName];
                    cityChildren.push({
                        label: cityName,
                        value: cityObj.value,
                        children: cityObj.pincodes,
                    });
                }
                regions.push({ label: regionName, value: regionName, children: cityChildren });
            } else {
                const states = regionMap[regionName];
                const stateChildren = [];
                for (const stateName in states) {
                    const cities = states[stateName];
                    const cityChildren = [];
                    for (const cityName in cities) {
                        const cityObj = cities[cityName];
                        cityChildren.push({
                            label: cityName,
                            value: cityObj.value,
                            children: cityObj.pincodes,
                        });
                    }
                    stateChildren.push({
                        label: stateName,
                        value: stateName,
                        children: cityChildren,
                    });
                }
                regions.push({ label: regionName, value: regionName, children: stateChildren });
            }
        }

        return regions;
    }, [activeFilters.location, activeClientProject?.client_project_id]);



    // console.log("mainLocationData", { mainLocationData, "actual location": filters.location })

    // console.log("selected Location", selectedLocation)


    // const filterData = useMemo(() => {
    //     const rawData = Object.entries(filters)
    //         .map(([key, value]) => {
    //             if (!Array.isArray(value) || value.length === 0 || key === "unsubscribedPlatforms") {
    //                 return null;
    //             }
    //             return {
    //                 title: key.charAt(0).toUpperCase() + key.slice(1),
    //                 key: key,
    //                 // options: value.map((item) => ({
    //                 //     label: item.label || item.lable,
    //                 //     value: item.value,
    //                 // })),
    //                 options: value,
    //                 isObjectData: true,
    //             };
    //         })
    //         .filter(Boolean);

    //     if (!searchTerm) return rawData;

    //     return rawData
    //         .filter(({ key }) => key !== "locationPincode")
    //         .map(section => {
    //             // For location section, keep it as is during search
    //             if (section.key === "location") {
    //                 return section;
    //             }

    //             return {
    //                 ...section,
    //                 options: section.options.filter(option =>
    //                     option.label.toLowerCase().includes(searchTerm.toLowerCase())
    //                 )
    //             };
    //         })
    //         .filter(section =>
    //             section.key === "location" || section.options.length > 0
    //         );
    // }, [filters, searchTerm]);

    // const filteredLocationData = useMemo(() => {
    //     if (!searchTerm) return mainLocationData;

    //     const filterTree = (nodes) => {
    //         return nodes
    //             .map(node => {
    //                 const filteredChildren = node.children ? filterTree(node.children) : [];
    //                 const nodeMatches = node.label.toLowerCase().includes(searchTerm.toLowerCase());
    //                 const childrenMatch = filteredChildren.length > 0;

    //                 if (nodeMatches) {
    //                     // ✅ if node itself matches → keep ALL children
    //                     return {
    //                         ...node,
    //                         children: node.children || []
    //                     };
    //                 }

    //                 if (childrenMatch) {
    //                     // ✅ if only children matched → keep filtered children
    //                     return {
    //                         ...node,
    //                         children: filteredChildren
    //                     };
    //                 }

    //                 return null;
    //             })
    //             .filter(Boolean);
    //     };

    //     return filterTree(mainLocationData);
    // }, [mainLocationData, searchTerm]);


    const filterData = useMemo(() => {
        // 🔹 CHANGED from `filters` → `activeFilters`
        const rawData = Object.entries(activeFilters || {})
            .map(([key, value]) => {
                if (
                    !Array.isArray(value) ||
                    value.length === 0 ||
                    key === "unsubscribedPlatforms"
                ) {
                    return null;
                }
                return {
                    title: key.charAt(0).toUpperCase() + key.slice(1),
                    key,
                    options: value,
                    isObjectData: true,
                };
            })
            .filter(Boolean);

        if (!searchTerm) return rawData;

        return rawData
            .filter(({ key }) => key !== "locationPincode")
            .map((section) => {
                if (section.key === "location") return section;

                if (["products"].includes(String(section.key || "").toLowerCase())) {
                    const search = String(searchTerm ?? "").toLowerCase();
                    return {
                        ...section,
                        options: section.options.filter((opt) => {
                            const label = String(opt?.label ?? opt?.lable ?? "");
                            const webPid = String(opt?.web_pid ?? "");
                            const labelMatch = label.toLowerCase().includes(search);
                            const webPidMatch = webPid.toLowerCase().includes(search);
                            return labelMatch || webPidMatch;
                        }),
                    };
                }

                return {
                    ...section,
                    // options: section.options.filter((opt) =>
                    //     opt.label?.toLowerCase().includes(searchTerm?.toLowerCase())
                    // ),
                    options: section.options.filter((opt) => {
                        const label = String(opt?.label ?? opt?.lable ?? "");
                        return label.toLowerCase().includes(String(searchTerm ?? "").toLowerCase());
                    }),
                };
            })
            .filter((section) => section.key === "location" || section.options.length);
    }, [activeFilters, searchTerm]); // 🔹 CHANGED dependency

    useEffect(() => {
        if (searchTerm) {
            const newExpandedItems = {};
            // Recursive function to find and expand all parents of a matching node
            const expandParents = (nodes) => {
                nodes.forEach(node => {
                    if (node.children) {
                        const childrenWithMatch = expandParents(node.children);
                        // Check if the current node or any of its children match
                        if (childrenWithMatch || node.label.toLowerCase().includes(searchTerm.toLowerCase())) {
                            newExpandedItems[node.value] = true;
                        }
                    }
                });
                // Return true if any child or the current node matches, to signal the parent
                return nodes.some(node =>
                    node.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (node.children && expandParents(node.children))
                );
            };
            expandParents(mainLocationData);
            setExpandedItems(newExpandedItems);
        } else {
            // Clear expanded state when search is cleared
            setExpandedItems({});
        }
    }, [searchTerm, mainLocationData]);


    const handleToggle = (section) => {
        const nextExpanded = !expanded[section];
        trackCustomEvent(
            nextExpanded ? EVENTS.EXPAND : EVENTS.COLLAPSE,
            { section, action: nextExpanded ? "view_more" : "view_less" },
            ENTITY_TYPE.DRAWER,
            getTrackerContext(kpi, filtersDarkStore?.tab_type)
        );
        setExpanded((prev) => ({ ...prev, [section]: nextExpanded }));
    };

    const handleCheck = (section, optionValue, isChecked, label = null, skipTracking = false) => {
        if (!skipTracking) {
            trackCustomEvent(
                EVENTS.CHECKBOX,
                { section, value: optionValue, ...(label ? { label, item: label } : {}), checked: !isChecked },
                ENTITY_TYPE.DRAWER,
                getTrackerContext(kpi, filtersDarkStore?.tab_type, { component_type: TRACKING_COMPONENT.CHECKBOX })
            );
        }
        setCheckedItems((prev) => {
            const updated = {
                ...prev,
                [section]: {
                    ...prev[section],
                    [optionValue]: !isChecked
                },
            };
            return updated;
        });
    };

    const handleSelectAll = (section, options) => {
        setCheckedItems((prev) => {
            const allSelected = options.every((opt) => prev[section]?.[opt.value]);
            trackCustomEvent(
                allSelected ? EVENTS.UNSELECT_ALL : EVENTS.SELECT_ALL,
                { section, action: allSelected ? "unselect_all" : "select_all", totalOptions: options.length },
                ENTITY_TYPE.DRAWER,
                getTrackerContext(kpi, filtersDarkStore?.tab_type, { component_type: TRACKING_COMPONENT.CHECKBOX })
            );
            const newSelections = {};
            options.forEach((opt) => {
                newSelections[opt.value] = !allSelected;
            });
            return { ...prev, [section]: newSelections };
        });
    };

    // const handleApply = () => {
    //     const selected = {};
    //     console.log("filterDatafilterDatanew", filterData);
    //     filterData.forEach((section) => {
    //         const checked = checkedItems[section.key] || {};
    //         // console.log("checkeddata", section.key, checked);
    //         const chosen = section.options.filter((opt) => checked[opt.value]);
    //         // console.log("chosenchosen", chosen);
    //         if (chosen.length > 0) {
    //             selected[section.key] = chosen.map((opt) => ({
    //                 label: opt.label,
    //                 value: opt.value,
    //             }));
    //         }
    //     });
    //     if (selectedLocation.length > 0) {
    //         selected.location = selectedLocation;
    //     }

    //     console.log("selectedsssssssss", selected);

    //     setSelectedFilters(prevFilters => ({
    //         ...prevFilters,
    //         selectedBrand: selectedFiltersWidget?.selectedBrand ?? [],
    //         selectedKeywordCategory: selectedFiltersWidget?.selectedKeywordCategory ?? [],
    //         selectedCategory: selectedFiltersWidget?.selectedCategory ?? [],
    //         selectedKeyword: selectedFiltersWidget?.selectedKeyword ?? [],
    //         selectedProductId: selectedFiltersWidget?.selectedProductId ?? [],
    //         selectedProduct_ppg: selectedFiltersWidget?.selectedProduct_ppg ?? [],
    //         selectedMotherPack: selectedFiltersWidget?.selectedMotherPack ?? [],
    //         selectedOSARemarks: selectedFiltersWidget?.selectedOSARemarks ?? [],
    //         selectedLocation: selectedFiltersWidget?.selectedLocation ?? [],
    //     }));
    //     setHeaderFilterChips(selected);
    //     console.log('setCheckedItemssetCheckedItems', selectedFiltersWidget?.selectedCategory)
    //     onClose();
    // };



    //     const handleApply = () => {
    //   const selected = {};
    //   console.log("filterDatafilterDatanew", filterData);

    //   filterData.forEach((section) => {
    //     const checked = checkedItems[section.key] || {};
    //     const chosen = section.options.filter((opt) => checked[opt.value]);

    //     if (chosen.length > 0) {
    //       selected[section.key] = chosen.map((opt) => ({
    //         label: opt.label,
    //         value: opt.value,
    //       }));
    //     }
    //   });

    //   if (selectedLocation.length > 0) {
    //     selected.location = selectedLocation;
    //   }

    //   console.log("selectedsssssssss", selected);

    //   // ✅ Only keep selectedCategory values that exist in selected.category
    //   const filteredSelectedCategory = selected.category
    //     ? selectedFiltersWidget?.selectedCategory?.filter(widgetCat =>
    //         selected.category.some(sel => sel.value === widgetCat.value)
    //       ) ?? []
    //     : selectedFiltersWidget?.selectedCategory ?? [];

    //   setSelectedFilters((prevFilters) => ({
    //     ...prevFilters,
    //     selectedBrand: selectedFiltersWidget?.selectedBrand ?? [],
    //     selectedKeywordCategory: selectedFiltersWidget?.selectedKeywordCategory ?? [],
    //     selectedCategory: filteredSelectedCategory,  // ✅ updated line
    //     selectedKeyword: selectedFiltersWidget?.selectedKeyword ?? [],
    //     selectedProductId: selectedFiltersWidget?.selectedProductId ?? [],
    //     selectedProduct_ppg: selectedFiltersWidget?.selectedProduct_ppg ?? [],
    //     selectedMotherPack: selectedFiltersWidget?.selectedMotherPack ?? [],
    //     selectedOSARemarks: selectedFiltersWidget?.selectedOSARemarks ?? [],
    //     selectedLocation: selectedFiltersWidget?.selectedLocation ?? [],
    //   }));

    //   // ✅ Also filter Header Chips
    //   const filteredHeaderChips = {
    //     ...selected,
    //     category: filteredSelectedCategory.map(cat => ({
    //       label: cat.label,
    //       value: cat.value,
    //     }))
    //   };

    //   setHeaderFilterChips(filteredHeaderChips);

    //   console.log('filtered selectedCategory', filteredSelectedCategory);
    //   onClose();
    // };





    const handleApply = async (alert_filters) => {
        trackCustomEvent(
            EVENTS.APPLY,
            { action: "apply_all_filters", appliedCount: trueCount },
            ENTITY_TYPE.DRAWER,
            getTrackerContext(kpi, filtersDarkStore?.tab_type, { component_type: TRACKING_COMPONENT.BUTTON })
        );

        if (isAlertControlPage) {
            // console.log("payload:", alert_filters);
            setAlertFilters(alert_filters);
            setOpenAlertFilter(false);
            onClose();
        } else {
            const selected = {};


            // Build selected object from checkedItems
            filterData.forEach((section) => {
                const checked = checkedItems[section.key] || {};
                const chosen = section.options.filter((opt) => checked[opt.value]);

                if (chosen.length > 0) {
                    selected[section.key] = chosen.map((opt) => ({
                        label: opt.label,
                        value: opt.value,
                    }));
                }
            });

            if (selectedLocation.length > 0) {
                selected.location = selectedLocation;
            }

            //console.log("selectedsssssssss", selected);

            // ✅ Generic filter function for all keys
            //eslint-disable-next-line
            const filterByExistence = (widgetValues = [], selectedValues = []) => {
                if (!selectedValues || selectedValues.length === 0) return widgetValues;
                return widgetValues.filter((widget) =>
                    selectedValues.some((sel) => sel.value == widget.value)
                );
            };

            // ✅ Apply filtering for all keys


            // const filtered = {
            //     selectedPlatform: filterByExistence(selectedFiltersWidget?.selectedPlatform, selected.platform),
            //     selectedBrand: filterByExistence(selectedFiltersWidget?.selectedBrand, selected.brand),
            //     selectedKeywordCategory: filterByExistence(selectedFiltersWidget?.selectedKeywordCategory, selected.keywordCategory),
            //     selectedCategory: filterByExistence(selectedFiltersWidget?.selectedCategory, selected.category),
            //     selectedKeyword: filterByExistence(selectedFiltersWidget?.selectedKeyword, selected.keyword),
            //     selectedProductId: filterByExistence(selectedFiltersWidget?.selectedProductId, selected.productId),
            //     selectedProduct_ppg: filterByExistence(selectedFiltersWidget?.selectedProduct_ppg, selected.product_ppg),
            //     selectedMotherPack: filterByExistence(selectedFiltersWidget?.selectedMotherPack, selected.motherPack),
            //     selectedOSARemarks: filterByExistence(selectedFiltersWidget?.selectedOSARemarks, selected.osaRemarks),
            //     selectedLocation: filterByExistence(selectedFiltersWidget?.selectedLocation, selected.location),
            // };

            // alert(JSON.stringify(selectedFiltersWidget?.selectedPlatform?.length >0 ? (selectedFiltersWidget?.selectedPlatform) : (filtersDarkStore?.tab_type == 'dark_store_analysis'?filtersDarkStore?.platform:filters?.platform)))
            // let mslProductList = [];
            if (selectedMsl != selectedMslFilter) {
                setSelectedMsl(selectedMslFilter);
                // mslProductList = filters?.products
            }
            const filtered = {
                // selectedPlatform: selectedFiltersWidget?.selectedPlatform?.length >0 ? (selectedFiltersWidget?.selectedPlatform) : filters?.platform,
                selectedPlatform: selectedFiltersWidget?.selectedPlatform?.length > 0 ? (selectedFiltersWidget?.selectedPlatform) : (filtersDarkStore?.tab_type == 'dark_store_analysis' ? filtersDarkStore?.platform : filters?.platform),
                selectedBrand: (selectedFiltersWidget?.selectedBrand),
                selectedKeywordCategory: (selectedFiltersWidget?.selectedKeywordCategory),
                selectedCategory: (selectedFiltersWidget?.selectedCategory),
                selectedKeyword: (selectedFiltersWidget?.selectedKeyword),
                selectedProductId: (selectedFiltersWidget?.selectedProductId),
                selectedProduct_ppg: (selectedFiltersWidget?.selectedProduct_ppg),
                selectedMotherPack: (selectedFiltersWidget?.selectedMotherPack),
                selectedOSARemarks: (selectedFiltersWidget?.selectedOSARemarks),
                selectedLocation: (selectedFiltersWidget?.selectedLocation),
                selectedDarkstore: (selectedFiltersWidget?.selectedDarkstore),
                selectCategory_node: (selectedFiltersWidget?.selectCategory_node),
                selectedMsl: (selectedMslFilter),

                selectedSegmentData: (selectedFiltersWidget?.selectedSegmentData),
                selectedDynamicPData: (selectedFiltersWidget?.selectedDynamicPData),
                selectedStaticPData: (selectedFiltersWidget?.selectedStaticPData),
                selectedSubBrandData: (selectedFiltersWidget?.selectedSubBrandData),
                selectedProductTypeData: (selectedFiltersWidget?.selectedProductTypeData),

                selectedSellerType: (selectedFiltersWidget?.selectedSellerType),
                selectedSellerList: (selectedFiltersWidget?.selectedSellerList),
                selectedTags: (selectedFiltersWidget?.selectedTags),
                selectedTagsKW: (selectedFiltersWidget?.selectedTagsKW),
                active_location_status: (selectedFiltersWidget?.active_location_status),
                selected_sos_type: (selectedFiltersWidget?.selected_sos_type ? selectedFiltersWidget?.selected_sos_type : "overall"),
                selected_keyword_type: (selectedFiltersWidget?.selected_keyword_type),
                ...((selectedFiltersWidget?.selectedRange) ? { selectedRange: selectedFiltersWidget?.selectedRange ?? [] } : {}),

                // selectedBrandCompetition: (selectedFiltersWidget?.selectedBrandCompetition),
                // selectedProductCompetitionFilterComponent: (selectedFiltersWidget?.selectedProductCompetitionFilterComponent)


            };

            // console.log('selectedFiltersWidgetselectedFiltersWidget', selected)
            // ✅ Save to state
            setSelectedFilters((prevFilters) => ({
                ...prevFilters,
                ...filtered,
            }));
            console.log('selectedFiltersWidgetselectedFiltersWidget', selectedFiltersWidget?.selectedBrandCompetition)
            if (selectedFiltersWidget?.selectedBrandCompetition?.length > 0 || selectedFiltersWidget?.selectedProductCompetition?.length > 0) {
                setSelectedFiltersCompetition({
                    selectedBrand: selectedFiltersWidget?.selectedBrandCompetition ?? [],
                    selectedProductId: selectedFiltersWidget?.selectedProductCompetition ?? [],
                    selectedPlatform: selectedFiltersWidget?.selectedPlatformCompetition ?? [],
                    selectedCategory: selectedFiltersWidget?.selectedCategoryCompetition ?? [],
                });
            } else {
                setSelectedFiltersCompetition({
                    selectedBrand: [],
                    selectedProductId: [],
                });
            }

            // ✅ Also update Header Chips with only existing values
            const filteredHeaderChips = {};
            const chipObj = {
                // "platform": "selectedPlatform",
                "brand": "selectedBrand",
                "category": "selectedCategory",
                "keywordCategory": "selectedKeywordCategory",
                "mother_pack": "selectedMotherPack",
                "products": "selectedProductId",
                "location": "selectedLocation",
                "osa_remarks": "selectedOSARemarks",
                "keyword": "selectedKeyword",
                "darkstore": "selectedDarkstore",
                "category_som": "selectCategory_som",
                "category_node": "selectCategory_node",

                "segmentData": "selectedSegmentData",
                "dynamicPData": "selectedDynamicPData",
                "staticPData": "selectedStaticPData",
                "subBrandData": "selectedSubBrandData",
                "productTypeData": "selectedProductTypeData",
                "seller_type": "selectedSellerType",
                "seller_list": "selectedSellerList",

                "tags": "selectedTags",
                "tags_keyword": "selectedTagsKW",
                "selected_sos_type": "selected_sos_type",
                "selected_keyword_type": "selected_keyword_type",
                "range": "selectedRange",


                // "brandCompetitionFilterComponent": "selectedBrandCompetition",
                // "productCompetitionFilterComponent": "selectedProductCompetitionFilterComponent"
            }
            filteredHeaderChips.product_tags = (selectedFiltersWidget?.selectedTags ?? []).map(
                (item) => ({
                    label: item?.tag_name ?? "",
                    value: item?.tag_name ?? "",
                })
            );
            filteredHeaderChips.keyword_tags = (selectedFiltersWidget?.selectedTagsKW ?? []).map(
                (item) => ({
                    label: item?.tag_name ?? "",
                    value: item?.tag_name ?? "",
                })
            );
            filteredHeaderChips.category = (selectedFiltersWidget?.selectedCategory ?? []).map(
                (item) => ({
                    label: item.label || item.category_name || "",
                    value: item.value,
                })
            );

            filteredHeaderChips.sos_type = selectedFiltersWidget?.selected_sos_type
                ? [{
                    label: selectedFiltersWidget.selected_sos_type,
                    value: selectedFiltersWidget.selected_sos_type,
                }]
                : [];

            filteredHeaderChips.keyword_type = (selectedFiltersWidget?.selected_keyword_type ?? []).map(
                (item) => ({
                    label: item?.label,
                    value: item?.value,
                })
            );

            Object.keys(selected).forEach((key) => {
                filteredHeaderChips[key] = filtered[`${chipObj[key]}`]?.map((item) => ({
                    label: item.label,
                    value: item.value,
                    ...(item.location_key !== undefined ? { location_key: item.location_key } : {}),
                    ...(item.pf_id !== undefined ? { pf_id: item.pf_id } : {}),
                    ...(item.city !== undefined ? { city: item.city } : {}),
                    ...(item.state !== undefined ? { state: item.state } : {}),
                    ...(item.region !== undefined ? { region: item.region } : {}),
                })) ?? [];
            });

            if (kpi == "BUYBOX") {
                filteredHeaderChips.seller_type = (selectedFiltersWidget?.selectedSellerType ?? []).map(
                    (item) => ({
                        label: item.label,
                        value: item.value,
                    })
                );
                filteredHeaderChips.sellers = (selectedFiltersWidget?.selectedSellerList ?? []).map(
                    (item) => ({
                        label: item.label,
                        value: item.value,
                    })
                );

                filteredHeaderChips.platform = (selectedFiltersWidget?.selectedPlatform ? selectedFiltersWidget.selectedPlatform : []).map(
                    (item) => ({
                        label: item.label,
                        value: item.value,
                    })
                );

            }


            // FIX: Perfetti tree filters bypass checkedItems, so explicitly map them
            filteredHeaderChips.brand = (selectedFiltersWidget?.selectedBrand ?? []).map((item) => ({
                label: item.label || item.lable || "",
                value: item.value,
            }));
            filteredHeaderChips.products = (selectedFiltersWidget?.selectedProductId ?? []).map((item) => ({
                label: item.label || item.lable || "",
                value: item.value,
            }));
            if (selectedMslFilter == 'msl') {
                filteredHeaderChips.msl = [{
                    label: "MSL",
                    value: 1,
                }];
            }
            console.log('selectedFilters?.selectedMsl', selectedMslFilter)
            setHeaderFilterChips(filteredHeaderChips);
            if (!firstTimeLoadFilter) {
                setFirstTimeLoadFilter(true)
            }
            // console.log("filtered applied", filtered);
            onClose();
        }
    };



    const handleCancel = () => {
        trackCustomEvent(
            EVENTS.CLEAR_ALL,
            { action: "clear_all_filters" },
            ENTITY_TYPE.DRAWER,
            getTrackerContext(kpi, filtersDarkStore?.tab_type, { component_type: TRACKING_COMPONENT.BUTTON })
        );

        if (isAlertControlPage) {
            setAlertFilters(defaultAlertFilters); // reset structure
            setOpenAlertFilter(false);
            onClose();
        }
        else {
            if (kpi == "BUYBOX" && !activeClientProject?.isBuyBoxWithPF) {
                updateSelectedFilters("selectedSellerType", []);
            }
            setCheckedItems({});
            setHeaderFilterChips({});
            // setSelectedFiltersWidget([])
            setSelectedLocation([]);      // clears the selected location array passed to TreeCheckbox
            setCheckedLocation({});
            setSelectedMsl('all');
            setSelectedMslFilter('all');
            let kpiType = "";
            if (['SOS', 'OR', "Wt_SOS"].includes(kpi)) {
                kpiType = "kw";
            } else if (['SOM'].includes(kpi)) {
                kpiType = "SOM";
            } else {
                kpiType = "pdp";
            }
            // console.log('mainApiResponsemainApiResponse', mainApiResponse)
            let res_osa_remarks = [], darkstore = [], location = [], res_platform = [], res_unsubscribed_platform = [], res_brand = [], res_location_new = [], res_darkstore = [], res_competition_brand = [];
            let res_category = [], res_mother_pack = [], res_products = [], res_sub_category = [], res_product_ppg = [];
            let res_keyword = [], res_keyword_category = [], res_keyword_type = [];
            let res_sod_display_ad_type = [], res_sod_page_location = []; let category_node = []
            let category_som;

            res_osa_remarks = mainApiResponse?.res_osa_remarks;//pdp
            res_category = mainApiResponse?.res_category;//pdp
            res_sub_category = mainApiResponse?.res_sub_category;//pdp
            // sub_Categories = mainApiResponse?.sub_Categories;//pdp
            res_products = mainApiResponse?.res_products;//pdp
            res_mother_pack = mainApiResponse?.res_mother_pack;//pdp

            res_keyword = mainApiResponse?.res_keyword;//kw
            // _keywords = mainApiResponse?._keywords;//kw
            res_keyword_category = mainApiResponse?.res_keyword_category;//kw
            // keyword_sub_Categories = mainApiResponse?.keyword_sub_Categories;//kw
            res_keyword_type = mainApiResponse?.res_keyword_type;//kw


            res_sod_display_ad_type = mainApiResponse?.res_sod_display_ad_type;//sod
            res_sod_page_location = mainApiResponse?.res_sod_page_location;//sod


            if (kpiType == "kw") {
                res_platform = mainApiResponse?.res_platform_kw;
                res_unsubscribed_platform = mainApiResponse?.res_unsubscribed_platform_kw;
                res_brand = mainApiResponse?.res_brand_kw;
                res_location_new = mainApiResponse?.res_location_new_kw;
                res_darkstore = mainApiResponse?.res_darkstore_kw;
                res_competition_brand = mainApiResponse?.res_competition_brand_kw;
                // sub_brands = mainApiResponse?.sub_brands_kw;
                location = mainApiResponse?.location_kw;
                darkstore = mainApiResponse?.darkstore_kw;
            } else if (kpiType == "SOM") {
                // console.log('mainApiResponse?.res_platform_pdp', mainApiResponse?.res_platform_pdp)
                res_platform = mainApiResponse?.res_platform_som;
                res_unsubscribed_platform = mainApiResponse?.res_unsubscribed_platform_kw;
                res_brand = mainApiResponse?.res_brand_som;
                // sub_brands = mainApiResponse?.res_brand_som;
                category_som = mainApiResponse?.category_som
                category_node = mainApiResponse?.category_node;
                res_sub_category = category_som;//pdp
            } else {
                res_platform = mainApiResponse?.res_platform_pdp;
                res_unsubscribed_platform = mainApiResponse?.res_unsubscribed_platform_pdp;
                res_brand = mainApiResponse?.res_brand_pdp;
                res_location_new = mainApiResponse?.res_location_new_pdp;
                res_darkstore = mainApiResponse?.res_darkstore_pdp;
                res_competition_brand = mainApiResponse?.res_competition_brand_pdp;
                // sub_brands = mainApiResponse?.sub_brands_pdp;
                location = mainApiResponse?.location_pdp;
                darkstore = mainApiResponse?.darkstore_pdp;
                res_product_ppg = mainApiResponse?.res_product_ppg ?? [];//pdp
            }
            let res_buy_box_seller_types = [], res_buy_box_sellers = [];
            if (kpi == "BUYBOX" && activeClientProject?.isBuyBoxWithPF) {
                res_buy_box_seller_types = mainApiResponse.res_buy_box_seller_types ?? [];
                res_buy_box_sellers = mainApiResponse.res_buy_box_sellers ?? [];
            }
            console.log("res_brand_competition", mainApiResponse?.res_competition_brand_pdp)
            setFilters((prevFilters) => {
                const updatedFilters = {
                    ...prevFilters,
                    unsubscribedPlatforms: res_unsubscribed_platform ?? [],
                    platform: res_platform ?? [],
                    brand: res_brand ?? [],
                    competition_brand: res_competition_brand ?? [],
                    category: res_category ?? [],
                    sub_category: res_sub_category ?? [],
                    location: res_location_new ?? [],
                    locationPincode: location ?? [],
                    darkstore: res_darkstore ?? [],
                    darkstore_id: darkstore ?? [],
                    products: res_products ?? [],
                    mother_pack: res_mother_pack ?? [],
                    keywordCategory: res_keyword_category ?? [],
                    keywordType: res_keyword_type ?? [],
                    keyword: res_keyword ?? [],
                    osa_remarks: res_osa_remarks ?? [],
                    sod_display_ad_type: res_sod_display_ad_type ?? [],
                    sod_page_location: res_sod_page_location ?? [],
                    category_som: category_som ?? [],
                    category_node: category_node ?? [],
                    product_ppg: res_product_ppg ?? [],

                    res_products_competition: mainApiResponse?.res_products_competition ?? [],
                    res_brand_competition: mainApiResponse?.res_brand_pdp_competition ?? [],
                    ...(kpi == "BUYBOX" && activeClientProject?.isBuyBoxWithPF
                        ? {
                            sellerType: res_buy_box_seller_types ?? [],
                            sellerList: res_buy_box_sellers ?? []
                        }
                        : {}),
                    ...((mainApiResponse?.range) ? { range: mainApiResponse?.range ?? [] } : {}),
                };

                setSelectedFiltersWidget(prevSelectedFilters => ({
                    ...prevSelectedFilters,
                    //   selectedPlatform: res_platform ?? [],
                    isUserChangePlatform: false,
                    selectedPlatform: [],
                    selectedPlatformPdp: mainApiResponse?.res_platform_pdp ?? [],
                    selectedPlatformKw: mainApiResponse?.res_platform_kw ?? [],
                    selectedBrand: [],
                    selectedBrandPdp: [],
                    selectedBrandKw: [],
                    selectedBrandSOM: [],
                    // selectedBrand_init: sub_brands ?? [],
                    selectedCategory: [],
                    // selectedCategory_init: sub_Categories ?? [],
                    selectedSubCategory: [],
                    // selectedSubCategory_init: res_sub_category ?? [],
                    selectedProductId: [],
                    selectedMotherPack: [],
                    selectedLocation: [],
                    selectedLocationPdp: [],
                    selectedLocationKw: [],
                    // selectedLocationpincode: location ?? [],
                    selectedDarkstore: [],
                    // selectedDarkstoreID: darkstore ?? [],
                    selectedKeyword: [],
                    // selectedKeyword_init: _keywords ?? [],
                    selectedKeywordCategory: [],
                    // selectedKeywordCategory_init: keyword_sub_Categories ?? [],
                    selectedKeywordType: [],
                    selectedOSARemarks: [],
                    selectCategory_som: [],
                    selectCategory_node: [],
                    selectedProduct_ppg: [],

                    selectedSegmentData: [],
                    selectedProductTypeData: [],
                    selectedDynamicPData: [],
                    selectedStaticPData: [],
                    selectedSubBrandData: [],
                    selectedTags: [],
                    selectedTagsKW: [],
                    active_location_status: undefined,
                    selected_sos_type: "",
                    selected_keyword_type: [],

                    selectedBrandCompetition: [],
                    selectedProductCompetition: [],
                    ...(kpi == "BUYBOX" && activeClientProject?.isBuyBoxWithPF
                        ? {
                            selectedSellerType: [],
                            selectedSellerList: []
                        }
                        : {}),
                    ...((mainApiResponse?.range) ? { selectedRange: [] } : {})
                }));
                setSelectedFilters(prevSelectedFilters => ({
                    ...prevSelectedFilters,
                    selectedPlatform: res_platform ?? [],
                    //   selectedPlatform: (filtersDarkStore?.tab_type == 'dark_store_analysis'?filtersDarkStore?.platform:res_platform ?? []),
                    selectedPlatformPdp: mainApiResponse?.res_platform_pdp ?? [],
                    selectedPlatformKw: mainApiResponse?.res_platform_kw ?? [],
                    selectedBrand: [],
                    selectedBrandPdp: [],
                    selectedBrandKw: [],
                    selectedBrandSOM: [],
                    // selectedBrand_init: sub_brands ?? [],
                    selectedCategory: [],
                    // selectedCategory_init: sub_Categories ?? [],
                    selectedSubCategory: [],
                    // selectedSubCategory_init: res_sub_category ?? [],
                    selectedProductId: [],
                    selectedMotherPack: [],
                    selectedLocation: [],
                    selectedLocationPdp: [],
                    selectedLocationKw: [],
                    // selectedLocationpincode: location ?? [],
                    selectedDarkstore: [],
                    // selectedDarkstoreID: darkstore ?? [],
                    selectedKeyword: [],
                    // selectedKeyword_init: _keywords ?? [],
                    selectedKeywordCategory: [],
                    // selectedKeywordCategory_init: keyword_sub_Categories ?? [],
                    selectedKeywordType: [],
                    selectedOSARemarks: [],
                    selectCategory_som: [],
                    selectCategory_node: [],
                    selectedProduct_ppg: [],
                    selectedSegmentData: [],
                    selectedProductTypeData: [],
                    selectedDynamicPData: [],
                    selectedStaticPData: [],
                    selectedSubBrandData: [],
                    selectedTags: [],
                    selectedTagsKW: [],
                    active_location_status: undefined,
                    ...(kpi == "BUYBOX" && activeClientProject?.isBuyBoxWithPF
                        ? {
                            selectedSellerType: [],
                            selectedSellerList: []
                        }
                        : {}),
                    ...((mainApiResponse?.range) ? { selectedRange: [] } : {})
                }));
                // setSelectedFiltersCompetition({});

                setSelectedFiltersCompetition(prevSelectedFilters => ({
                    ...prevSelectedFilters,
                    selectedBrand: [],
                    selectedProductId: [],
                    selectedPlatform: [],
                    selectedCategory: [],
                }));


                return updatedFilters;
            });



            setFiltersDarkStore((prevFilters) => {
                const updatedFilters = {
                    ...prevFilters,
                    platform: prevFilters.platform_reset ?? [],
                    brand: prevFilters.brand_reset ?? [],
                    category: prevFilters.category_reset ?? [],
                    products: prevFilters.products_reset ?? [],
                    mother_pack: prevFilters.mother_pack_reset ?? [],
                    location: prevFilters.location_reset ?? [],
                    locationPincode: prevFilters.locationPincode_reset ?? [],
                    darkstore: prevFilters.darkstore_reset ?? [],
                    osa_remarks: prevFilters.osa_remarks_reset ?? [],
                    ...((prevFilters.range_reset) ? { range: prevFilters.range_reset ?? [] } : {}),
                    // range: prevFilters.range_reset ?? [],
                };
                return updatedFilters;
            });

            setSelectedFilters((prev) => ({
                ...prev,
                selectedPlatform: filtersDarkStore?.platform_reset ?? [],
                // ...resetValues,
            }));

            setSelectedFiltersWidget((prev) => ({
                ...prev,
                selectedPlatform: filtersDarkStore?.platform_reset ?? [],
                // ...resetValues,
            }));


            //     setFilters((prevFilters) => {
            //   const updatedFilters = {
            //     ...prevFilters,
            //     unsubscribedPlatforms: res_unsubscribed_platform ?? [],
            //     platform: res_platform ?? [],
            //     brand: res_brand ?? [],
            //     competition_brand: res_competition_brand ?? [],
            //     category: res_category ?? [],
            //     sub_category: res_sub_category ?? [],
            //     location: res_location_new ?? [],
            //     locationPincode: location ?? [],
            //     darkstore: res_darkstore ?? [],
            //     darkstore_id: darkstore ?? [],
            //     products: res_products ?? [],
            //     mother_pack: res_mother_pack ?? [],
            //     keywordCategory: res_keyword_category ?? [],
            //     keywordType: res_keyword_type ?? [],
            //     keyword: res_keyword ?? [],
            //     osa_remarks: res_osa_remarks ?? [],
            //     sod_display_ad_type: res_sod_display_ad_type ?? [],
            //     sod_page_location: res_sod_page_location ?? [],
            //     category_som: category_som ?? [],
            //     category_node: category_node ?? [],
            //     product_ppg: res_product_ppg ?? [],

            //   }
            //   return updatedFilters;
            // });

            // setSelectedFiltersWidget(prevFilters => ({
            //     ...prevFilters,
            //     selectedPlatform: filters?.platform,
            //     selectedBrand: [],
            //     selectedKeywordCategory: [],
            //     selectedCategory: [],
            //     selectedKeyword: [],
            //     selectedProductId: [],
            //     selectedProduct_ppg: [],
            //     selectedMotherPack: [],
            //     selectedOSARemarks: [],
            //     selectedLocation: [],
            // }));
            // setSelectedFilters(prevFilters => ({
            //     ...prevFilters,
            //     selectedPlatform: filters?.platform,
            //     selectedBrand: [],
            //     selectedKeywordCategory: [],
            //     selectedCategory: [],
            //     selectedKeyword: [],
            //     selectedProductId: [],
            //     selectedProduct_ppg: [],
            //     selectedMotherPack: [],
            //     selectedOSARemarks: [],
            //     selectedLocation: [],
            // }));
            // onClose();
        }
    };

    useEffect(() => {

        // console.log('selectedFiltersselectedFiltersselectedFiltersselectedFiltersfilters', filters)
        if (defaultSelected) {
            const initialState = {};

            filterData.forEach((section) => {
                initialState[section.key] = {};

                section.options.forEach((opt) => {
                    const isSelected = defaultSelected[section.key]?.some(
                        (item) => item.value === opt.value
                    );

                    initialState[section.key][opt.value] = isSelected || false;
                });
            });

            setCheckedItems(initialState);

            if (defaultSelected.location) {
                console.log("defaultSelected.location", defaultSelected.location)
                const locationInitial = {};

                const normalizeKey = (k) => {
                    if (k === undefined || k === null) return undefined;
                    return Array.isArray(k) ? k.join('-') : String(k);
                };

                const getNodeKey = (node) => {
                    const rawKey = (node?.location_key !== undefined && node?.location_key !== null)
                        ? node.location_key
                        : node?.value;
                    return Array.isArray(rawKey) ? rawKey.join('-') : rawKey;
                };

                const leafNodesWithContext = [];
                const traverseLocationTree = (nodes, region = "", state = "", city = "", parentKey = "") => {
                    (nodes || []).forEach((n) => {
                        const nodeKey = parentKey ? `${parentKey}_${getNodeKey(n)}` : getNodeKey(n);
                        if (n.children && n.children.length > 0) {
                            const nextRegion = !region ? n.label : region;
                            const nextState = region && !state && n.children.some(c => c.children && c.children.length > 0) ? n.label : state;
                            const nextCity = region ? (state || !n.children.some(c => c.children && c.children.length > 0) ? n.label : city) : city;
                            traverseLocationTree(n.children, nextRegion, nextState, nextCity, nodeKey);
                        } else {
                            leafNodesWithContext.push({
                                leafNode: n,
                                key: nodeKey,
                                location_key: normalizeKey(n.location_key),
                                value: n.value !== undefined && n.value !== null ? String(n.value) : undefined,
                                label: n.label !== undefined && n.label !== null ? String(n.label) : undefined,
                                city: (city || "").trim().toLowerCase(),
                                state: (state || "").trim().toLowerCase(),
                                region: (region || "").trim().toLowerCase(),
                            });
                        }
                    });
                };
                traverseLocationTree(mainLocationData);

                defaultSelected.location.forEach((loc) => {
                    const locKey = normalizeKey(loc.location_key ?? loc.value);
                    const locKeyStr = normalizeKey(loc.location_key);
                    const locValueStr = loc.value !== undefined && loc.value !== null ? String(loc.value) : undefined;
                    const locLabelStr = loc.label !== undefined && loc.label !== null ? String(loc.label) : undefined;
                    const locCityStr = (loc.city || "").trim().toLowerCase();
                    const locStateStr = (loc.state || "").trim().toLowerCase();

                    let matched = false;

                    if (locKeyStr) {
                        const directMatch = leafNodesWithContext.find(l => l.location_key === locKeyStr);
                        if (directMatch) {
                            locationInitial[directMatch.key] = true;
                            matched = true;
                        }
                    }

                    if (!matched && locKey) {
                        const keyMatch = leafNodesWithContext.find(l => l.location_key === locKey || l.value === locKey);
                        if (keyMatch) {
                            locationInitial[keyMatch.key] = true;
                            matched = true;
                        }
                    }

                    if (!matched) {
                        leafNodesWithContext.forEach((leafCtx) => {
                            const cityMatches = !locCityStr || !leafCtx.city || locCityStr === leafCtx.city;
                            const stateMatches = !locStateStr || !leafCtx.state || locStateStr === leafCtx.state;

                            if (cityMatches && stateMatches) {
                                if (
                                    (locKeyStr && leafCtx.location_key === locKeyStr) ||
                                    (locValueStr && leafCtx.value === locValueStr) ||
                                    (locLabelStr && leafCtx.label === locLabelStr)
                                ) {
                                    locationInitial[leafCtx.key] = true;
                                }
                            }
                        });
                    }
                });

                setSelectedLocation(defaultSelected.location);
                setCheckedLocation(locationInitial);
            }
        }
    }, [defaultSelected, mainLocationData]);

    // console.log('selectedFiltersselectedFiltersselectedFiltersselectedFilters', filters?.location)
    const trueCount = Object.values(defaultSelected).reduce((count, arr) => {
        return count + (Array.isArray(arr) ? arr.length : 0);
    }, 0);

    // console.log("defaultSelected", defaultSelected)
    // console.log("filterDatacccc", filterData)
    // console.log("setCheckedItems", checkedItems)

    // 🔹 Custom order for sections
    // const keyOrder = ["platform", "brand", "category", "mother_pack", "products", "osa_remarks"];

    // const sortedFilterData = useMemo(() => {
    //     return filterData
    //         ?.filter(({ key }) => key !== "locationPincode")
    //         .sort((a, b) => {
    //             const aIndex = keyOrder.indexOf(a.key);
    //             const bIndex = keyOrder.indexOf(b.key);
    //             if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
    //             if (aIndex !== -1) return -1;
    //             if (bIndex !== -1) return 1;
    //             return 0;
    //         });
    // }, [filterData]);


    return (
        <div className="flex-1 overflow-y-auto">
            {openAlerFilter ? (
                <AlertControlFilters handleCancel={handleCancel} onApply={handleApply} setOpenAlertFilter={setOpenAlertFilter} alertFilters={alertFilters} setAlertFilters={setAlertFilters} defaultAlertFilters={defaultAlertFilters} />
            ) : (
                <div className="w-[400px] h-screen bg-white shadow-lg flex flex-col" role="presentation">
                    <div className="flex-shrink-0">
                        <div className="p-4 flex items-center justify-between border-b border-gray-200">
                            <div className="flex gap-2 items-center">
                                <RxCross2 size={20} className="cursor-pointer" onClick={() => {
                                    trackCustomEvent(EVENTS.BUTTON_CLICK, { action: "close_filter_drawer" }, ENTITY_TYPE.DRAWER, getTrackerContext(kpi, filtersDarkStore?.tab_type, { component_type: TRACKING_COMPONENT.BUTTON }));
                                    onClose();
                                }} />
                                <p className="font-semibold text-gray-900 text-lg">All Filters</p>
                            </div>
                            <div className="text-blue-500 font-medium">Applied <span>({trueCount})</span></div>
                        </div>

                        <div className="relative p-4 ">
                            <input
                                type="text"
                                placeholder="Search..."
                                className="w-full px-3 py-2 pr-[35px] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onBlur={(e) => {
                                    if (e.target.value) {
                                        trackCustomEvent(EVENTS.SEARCH, { search: e.target.value, section: "global" }, ENTITY_TYPE.DRAWER, getTrackerContext(kpi, filtersDarkStore?.tab_type));
                                    }
                                }}
                            />
                            {searchTerm && (
                                <RxCross2
                                    size={18}
                                    className="absolute right-7 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer z-10"
                                    onClick={() => {
                                        trackCustomEvent(EVENTS.CLEAR, { action: "clear_global_search" }, ENTITY_TYPE.DRAWER, getTrackerContext(kpi, filtersDarkStore?.tab_type));
                                        setSearchTerm("");
                                    }}
                                />
                            )}
                        </div>
                    </div>
                    {true && <div className="flex-1 overflow-y-auto">
                        {
                            filtersDarkStore?.tab_type == 'dark_store_analysis' ?
                                <form onSubmit={(e) => e.preventDefault()} className="h-[calc(100vh-64px)] flex flex-col">
                                    <PlatformFilterComponentDarkStore expanded={expanded} handleToggle={handleToggle} checkedItems={checkedItems} handleSelectAll={handleSelectAll} handleCheck={handleCheck} searchTerm={searchTerm} handleCancel={handleCancel} />
                                    {
                                        activeClientProject?.treeFilterDS2 ? (
                                            <PerfettiBrandFilterComponentDarkStore expanded={expanded} handleToggle={handleToggle} searchTerm={searchTerm} />
                                        ) : (
                                            <BrandCommonFilterComponentDarkStore expanded={expanded} handleToggle={handleToggle} checkedItems={checkedItems} handleSelectAll={handleSelectAll} handleCheck={handleCheck} searchTerm={searchTerm} handleCancel={handleCancel} />
                                        )
                                    }
                                    {
                                        activeClientProject?.treeFilterDS2 ? (
                                            <PerfettiCategoryFilterComponentDarkStore expanded={expanded} handleToggle={handleToggle} searchTerm={searchTerm} />
                                        ) : (
                                            activeClientProject?.indented?.pdp?.category
                                                ?
                                                <CategoryFilterComponentDarkStoreIndented expanded={expanded} handleToggle={handleToggle} checkedItems={checkedItems} handleSelectAll={handleSelectAll} handleCheck={handleCheck} searchTerm={searchTerm} handleCancel={handleCancel} />
                                                :
                                                <CategoryFilterComponentDarkStore expanded={expanded} handleToggle={handleToggle} checkedItems={checkedItems} handleSelectAll={handleSelectAll} handleCheck={handleCheck} searchTerm={searchTerm} handleCancel={handleCancel} />
                                        )
                                    }
                                    {(([2].indexOf(activeClientProject?.client_project_id) > -1) && (kpi == "OSA" || kpi == "PRO" || kpi == "RR")) && (
                                        <MotherPackFilterComponentDarkStore expanded={expanded} handleToggle={handleToggle} checkedItems={checkedItems} handleSelectAll={handleSelectAll} handleCheck={handleCheck} searchTerm={searchTerm} handleCancel={handleCancel} />
                                    )}
                                    {
                                        activeClientProject?.treeFilterDS2 ? (
                                            <PerfettiProductFilterComponentDarkStore expanded={expanded} handleToggle={handleToggle} handleSelectAll={handleSelectAll} handleCheck={handleCheck} searchTerm={searchTerm} />
                                        ) : (
                                            <ProductFilterComponentDarkStore expanded={expanded} handleToggle={handleToggle} checkedItems={checkedItems} handleSelectAll={handleSelectAll} handleCheck={handleCheck} searchTerm={searchTerm} handleCancel={handleCancel} />
                                        )
                                    }
                                    {(([111].indexOf(activeClientProject?.client_project_id) > -1) && (kpi == "OSA" || kpi == "CS" || kpi == "PRO" || kpi == "RR")) && (
                                        <RangeFilterComponentDarkStore expanded={expanded} handleToggle={handleToggle} checkedItems={checkedItems} handleSelectAll={handleSelectAll} handleCheck={handleCheck} searchTerm={searchTerm} handleCancel={handleCancel} />
                                    )}


                                    {(([1].indexOf(activeClientProject?.client_project_id) > -1)) && (
                                        (kpi != "SOS" && kpi != "OR" && kpi != "Wt_SOS") ?
                                            <>
                                                <SegmentFilterComponentDarkStore expanded={expanded} handleToggle={handleToggle} checkedItems={checkedItems} handleSelectAll={handleSelectAll} handleCheck={handleCheck} searchTerm={searchTerm} handleCancel={handleCancel} />
                                                <DynamicPFilterComponentDarkStore expanded={expanded} handleToggle={handleToggle} checkedItems={checkedItems} handleSelectAll={handleSelectAll} handleCheck={handleCheck} searchTerm={searchTerm} handleCancel={handleCancel} />
                                                <StaticPFilterComponentDarkStore expanded={expanded} handleToggle={handleToggle} checkedItems={checkedItems} handleSelectAll={handleSelectAll} handleCheck={handleCheck} searchTerm={searchTerm} handleCancel={handleCancel} />
                                                <SubBrandFilterComponentDarkStore expanded={expanded} handleToggle={handleToggle} checkedItems={checkedItems} handleSelectAll={handleSelectAll} handleCheck={handleCheck} searchTerm={searchTerm} handleCancel={handleCancel} />
                                                <ProductTypeFilterComponentDarkStore expanded={expanded} handleToggle={handleToggle} checkedItems={checkedItems} handleSelectAll={handleSelectAll} handleCheck={handleCheck} searchTerm={searchTerm} handleCancel={handleCancel} />
                                            </> : <>  </>
                                    )}

                                    {(!(kpi === "SOS" || kpi === "OR" || kpi === "Wt_SOS")) && (activeClientProject?.isUseWidgetDarkstore) && (activeClientProject?.isUseInActiveDarkstore) && (
                                        <DarkstoreStatusFilter expanded={expanded} handleToggle={handleToggle} checkedItems={checkedItems} handleSelectAll={handleSelectAll} handleCheck={handleCheck} searchTerm={searchTerm} />
                                    )}

                                    {mainLocationData?.length > 0 && (
                                        <div className="flex flex-col px-8 p-4 space-y-8">
                                            {/* <div className=" overflow-y-auto px-8 p-4 space-y-8"> */}
                                            <div className="border-b border-gray-100 pb-6 last:border-0">
                                                {/* <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-semibold text-gray-900 text-base">Location</h3>
                                    {(mainLocationData?.length > 3 || searchTerm.length > 0) && (
                                        <button
                                            type="button"
                                            className="text-gray-500 hover:text-gray-700"
                                            onClick={() => handleToggle("location")}
                                        >
                                            {expanded["location"] ? <IoIosArrowUp size={20} /> : <IoIosArrowDown size={20} />}
                                        </button>
                                    )}
                                </div> */}
                                                <TreeCheckbox data={mainLocationData} expanded={expanded} onToggle={() => handleToggle('location')} onSelectionChange={(selected) => setSelectedLocation(selected)} defaultChecked={checkedLocation} expandedItems={expandedItems} setExpandedItems={setExpandedItems} searchTerm={searchTerm} />
                                            </div>
                                        </div>
                                    )}
                                    <Suspense fallback={<div className="p-4 text-gray-500">Loading filters...</div>}>
                                        <StoreDataIdFilterComponent expanded={expanded} handleToggle={handleToggle} checkedItems={checkedItems} handleSelectAll={handleSelectAll} handleCheck={handleCheck} searchTerm={searchTerm} />
                                    </Suspense>

                                    {!(kpi === "SOS" || kpi === "OR" || kpi === "Wt_SOS") && (
                                        <OSARemarkFilterComponentDarkStore expanded={expanded} handleToggle={handleToggle} checkedItems={checkedItems} handleSelectAll={handleSelectAll} handleCheck={handleCheck} searchTerm={searchTerm} />
                                    )}

                                </form>

                                :

                                <form onSubmit={(e) => e.preventDefault()} className="h-[calc(100vh-64px)] flex flex-col">
                                    {
                                        (kpi != "BUYBOX" || (kpi == "BUYBOX" && activeClientProject?.isBuyBoxWithPF)) && (
                                            <PlatformFilterComponent expanded={expanded} handleToggle={handleToggle} checkedItems={checkedItems} handleSelectAll={handleSelectAll} handleCheck={handleCheck} searchTerm={searchTerm} handleCancel={handleCancel} />
                                        )
                                    }

                                    {
                                        kpi == "SOM" ?
                                            <SomBrandFilterComponent expanded={expanded} handleToggle={handleToggle} checkedItems={checkedItems} handleSelectAll={handleSelectAll} handleCheck={handleCheck} searchTerm={searchTerm} handleCancel={handleCancel} />
                                            :
                                            activeClientProject?.treeFilterDS2 ? (
                                                <PerfettiBrandFilterComponent expanded={expanded} handleToggle={handleToggle} searchTerm={searchTerm} />
                                            ) : (
                                                <BrandCommonFilterComponent expanded={expanded} handleToggle={handleToggle} checkedItems={checkedItems} handleSelectAll={handleSelectAll} handleCheck={handleCheck} searchTerm={searchTerm} handleCancel={handleCancel} />
                                            )
                                    }

                                    {
                                        (kpi === "SOS" || kpi === "OR" || kpi === "Wt_SOS") ?
                                            <>
                                                {activeClientProject?.treeFilterDS2 ? (
                                                    <PerfettiKeywordCategoryFilterComponent expanded={expanded} handleToggle={handleToggle} handleSelectAll={handleSelectAll} handleCheck={handleCheck} searchTerm={searchTerm} />
                                                ) : (activeClientProject?.indented?.kw?.category ?
                                                    <KeywordCategoryFilterComponentIndented expanded={expanded} handleToggle={handleToggle} checkedItems={checkedItems} handleSelectAll={handleSelectAll} handleCheck={handleCheck} searchTerm={searchTerm} handleCancel={handleCancel} />
                                                    :
                                                    <KeywordCategoryFilterComponent expanded={expanded} handleToggle={handleToggle} checkedItems={checkedItems} handleSelectAll={handleSelectAll} handleCheck={handleCheck} searchTerm={searchTerm} handleCancel={handleCancel} />
                                                )}
                                                {activeClientProject?.treeFilterDS2 ?
                                                    (<PerfettiKeywordFilterComponent expanded={expanded} handleToggle={handleToggle} checkedItems={checkedItems} handleSelectAll={handleSelectAll} handleCheck={handleCheck} searchTerm={searchTerm} handleCancel={handleCancel} />)
                                                    :
                                                    (<KeywordFilterComponent expanded={expanded} handleToggle={handleToggle} checkedItems={checkedItems} handleSelectAll={handleSelectAll} handleCheck={handleCheck} searchTerm={searchTerm} handleCancel={handleCancel} />)
                                                }
                                                {activeClientProject?.client_project_id == 2 && (
                                                    <>
                                                        <KeywordCategoryTypeFilterComponent expanded={expanded} handleToggle={handleToggle} checkedItems={checkedItems} handleSelectAll={handleSelectAll} handleCheck={handleCheck} searchTerm={searchTerm} handleCancel={handleCancel} />
                                                        <SponsFlagFilterComponent expanded={expanded} handleToggle={handleToggle} checkedItems={checkedItems} handleSelectAll={handleSelectAll} handleCheck={handleCheck} searchTerm={searchTerm} handleCancel={handleCancel} />
                                                    </>
                                                )}
                                            </>
                                            :
                                            (kpi === "SOM") ?
                                                <>
                                                    <SomCategoryFilterComponent expanded={expanded} handleToggle={handleToggle} checkedItems={checkedItems} handleSelectAll={handleSelectAll} handleCheck={handleCheck} searchTerm={searchTerm} handleCancel={handleCancel} />
                                                    <SomCategoryNodeFilterComponent expanded={expanded} handleToggle={handleToggle} checkedItems={checkedItems} handleSelectAll={handleSelectAll} handleCheck={handleCheck} searchTerm={searchTerm} handleCancel={handleCancel} />
                                                </>
                                                :
                                                <>
                                                    {(kpi == "BUYBOX" && !activeClientProject?.isBuyBoxWithPF) ? <></>
                                                        :
                                                        activeClientProject?.indented?.pdp?.category
                                                            ?
                                                            <CategoryFilterComponentIndented expanded={expanded} handleToggle={handleToggle} checkedItems={checkedItems} handleSelectAll={handleSelectAll} handleCheck={handleCheck} searchTerm={searchTerm} handleCancel={handleCancel} />
                                                            :
                                                            activeClientProject?.treeFilterDS2 ? (
                                                                <PerfettiCategoryFilterComponent expanded={expanded} handleToggle={handleToggle} searchTerm={searchTerm} />
                                                            ) : (
                                                                <CategoryFilterComponent expanded={expanded} handleToggle={handleToggle} checkedItems={checkedItems} handleSelectAll={handleSelectAll} handleCheck={handleCheck} searchTerm={searchTerm} handleCancel={handleCancel} />
                                                            )
                                                    }

                                                    {(([2].indexOf(activeClientProject?.client_project_id) > -1) && (kpi == "OSA" || kpi == "PRO" || kpi == "RR")) && (
                                                        <MotherPackFilterComponent expanded={expanded} handleToggle={handleToggle} checkedItems={checkedItems} handleSelectAll={handleSelectAll} handleCheck={handleCheck} searchTerm={searchTerm} handleCancel={handleCancel} />

                                                    )}
                                                    {(kpi == "GLOBALVIEW") ? <></> :
                                                        activeClientProject?.treeFilterDS2 ? (
                                                            <ProductFilterPerfetti expanded={expanded} handleToggle={handleToggle} searchTerm={searchTerm} handleSelectAll={handleSelectAll} handleCheck={handleCheck} handleCancel={handleCancel} />
                                                        ) : (
                                                            <ProductFilterComponent expanded={expanded} handleToggle={handleToggle} checkedItems={checkedItems} handleSelectAll={handleSelectAll} handleCheck={handleCheck} searchTerm={searchTerm} handleCancel={handleCancel} />
                                                        )
                                                    }

                                                    {(([111].indexOf(activeClientProject?.client_project_id) > -1) && (kpi == "OSA" || kpi == "CS" || kpi == "PRO" || kpi == "RR")) && (
                                                        <RangeFilterComponent expanded={expanded} handleToggle={handleToggle} checkedItems={checkedItems} handleSelectAll={handleSelectAll} handleCheck={handleCheck} searchTerm={searchTerm} handleCancel={handleCancel} />
                                                    )}

                                                </>
                                    }

                                    {(([1].indexOf(activeClientProject?.client_project_id) > -1)) && (
                                        (kpi != "SOS" && kpi != "OR" && kpi != "Wt_SOS") ?
                                            <>
                                                <SegmentFilterComponent expanded={expanded} handleToggle={handleToggle} checkedItems={checkedItems} handleSelectAll={handleSelectAll} handleCheck={handleCheck} searchTerm={searchTerm} handleCancel={handleCancel} />
                                                <DynamicPFilterComponent expanded={expanded} handleToggle={handleToggle} checkedItems={checkedItems} handleSelectAll={handleSelectAll} handleCheck={handleCheck} searchTerm={searchTerm} handleCancel={handleCancel} />
                                                <StaticPFilterComponent expanded={expanded} handleToggle={handleToggle} checkedItems={checkedItems} handleSelectAll={handleSelectAll} handleCheck={handleCheck} searchTerm={searchTerm} handleCancel={handleCancel} />
                                                <SubBrandFilterComponent expanded={expanded} handleToggle={handleToggle} checkedItems={checkedItems} handleSelectAll={handleSelectAll} handleCheck={handleCheck} searchTerm={searchTerm} handleCancel={handleCancel} />
                                                <ProductTypeFilterComponent expanded={expanded} handleToggle={handleToggle} checkedItems={checkedItems} handleSelectAll={handleSelectAll} handleCheck={handleCheck} searchTerm={searchTerm} handleCancel={handleCancel} />
                                            </> : <>  </>
                                    )}

                                    {(!(kpi === "SOS" || kpi === "OR" || kpi === "Wt_SOS")) && (activeClientProject?.isUseInActiveDarkstore) && (
                                        <DarkstoreStatusFilter expanded={expanded} handleToggle={handleToggle} checkedItems={checkedItems} handleSelectAll={handleSelectAll} handleCheck={handleCheck} searchTerm={searchTerm} />
                                    )}

                                    {(kpi !== "GLOBALVIEW") && mainLocationData?.length > 0 && (
                                        <div className="flex flex-col px-8 p-4 space-y-8">
                                            {/* <div className=" overflow-y-auto px-8 p-4 space-y-8"> */}
                                            <div className="border-b border-gray-100 pb-6 last:border-0">
                                                {/* <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-semibold text-gray-900 text-base">Location</h3>
                                    {(mainLocationData?.length > 3 || searchTerm.length > 0) && (
                                        <button
                                            type="button"
                                            className="text-gray-500 hover:text-gray-700"
                                            onClick={() => handleToggle("location")}
                                        >
                                            {expanded["location"] ? <IoIosArrowUp size={20} /> : <IoIosArrowDown size={20} />}
                                        </button>
                                    )}
                                </div> */}
                                                <TreeCheckbox data={mainLocationData} expanded={expanded} onToggle={() => handleToggle('location')} onSelectionChange={(selected) => setSelectedLocation(selected)} defaultChecked={checkedLocation} expandedItems={expandedItems} setExpandedItems={setExpandedItems} searchTerm={searchTerm} />
                                            </div>
                                        </div>
                                    )}
                                    {(([2, 11, 101, 102, 103, 104, 105].indexOf(activeClientProject?.client_project_id) > -1 || activeClientProject?.useCombineFilter) && (kpi == "OSA" || kpi == "PRO" || kpi == "RR")) && (
                                        <OSARemarkFilterComponent expanded={expanded} handleToggle={handleToggle} checkedItems={checkedItems} handleSelectAll={handleSelectAll} handleCheck={handleCheck} searchTerm={searchTerm} />
                                    )}

                                    {((activeClientProject?.isUseWidget) && (kpi == "OSA" || kpi == "PRO" || kpi == "RR" || kpi == "CS")) && (
                                        <TagManagerFilterComponent expanded={expanded} handleToggle={handleToggle} checkedItems={checkedItems} handleSelectAll={handleSelectAll} handleCheck={handleCheck} searchTerm={searchTerm} />
                                    )}
                                    {((activeClientProject?.isUseWidget) && (kpi == "SOS" || kpi == "OR" || kpi == "Wt_SOS")) && (
                                        <TagManagerFilterComponentKW expanded={expanded} handleToggle={handleToggle} checkedItems={checkedItems} handleSelectAll={handleSelectAll} handleCheck={handleCheck} searchTerm={searchTerm} />
                                    )}

                                    {
                                        activeClientProject?.isBuyBox ?
                                            (
                                                activeClientProject?.isBuyBoxWithPF ? (
                                                    <SellerTypeFilterComponent expanded={expanded} handleToggle={handleToggle} checkedItems={checkedItems} handleSelectAll={handleSelectAll} handleCheck={handleCheck} searchTerm={searchTerm} />
                                                ) : (
                                                    <SellerType expanded={expanded} handleToggle={handleToggle} checkedItems={checkedItems} handleSelectAll={handleSelectAll} handleCheck={handleCheck} searchTerm={searchTerm} />
                                                )
                                            ) : null
                                    }
                                    {
                                        activeClientProject?.isBuyBox && activeClientProject?.isBuyBoxWithPF ? (
                                            <SellerListFilterComponent expanded={expanded} handleToggle={handleToggle} checkedItems={checkedItems} handleSelectAll={handleSelectAll} handleCheck={handleCheck} searchTerm={searchTerm} />
                                        ) : null
                                    }


                                    {(
                                        (activeClientProject?.isUseCompFilter) &&
                                        (filtersDarkStore?.tab_type == "comprehensive_breakdown") && (isCompetitionBrandSelected || comprehensiveselectedTabName == "Competition Reviews") && (kpi == "OSA" || kpi == "PRO" || kpi == "RR" || kpi == "CS" || kpi == "SOS" || kpi == "OR" || kpi == "Wt_SOS")) && (
                                            <BrandCompetitionFilterComponent expanded={expanded} handleToggle={handleToggle} checkedItems={checkedItems} handleSelectAll={handleSelectAll} handleCheck={handleCheck} searchTerm={searchTerm} />
                                        )}

                                    {((activeClientProject?.isUseCompFilter) && (filtersDarkStore?.tab_type == "comprehensive_breakdown") && (isCompetitionProductSelected || comprehensiveselectedTabName == "Competition Reviews") && (kpi == "OSA" || kpi == "PRO" || kpi == "RR" || kpi == "CS")) && (
                                        <ProductCompetitionFilterComponent expanded={expanded} handleToggle={handleToggle} checkedItems={checkedItems} handleSelectAll={handleSelectAll} handleCheck={handleCheck} searchTerm={searchTerm} />
                                    )}



                                </form>
                        }




                    </div>}

                    <div className="flex-shrink-0 mt-auto p-4 border-t border-gray-200 bg-white">
                        <div className="flex items-center justify-end gap-3">
                            <button
                                type="button"
                                className="px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                                onClick={handleCancel}
                            >
                                Clear All
                            </button>
                            <button
                                type="submit"
                                onClick={handleApply}
                                className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                Apply
                            </button>
                        </div>
                    </div>
                </div>
            )
            }
        </div>
    );
}

export default DrawerEdit;
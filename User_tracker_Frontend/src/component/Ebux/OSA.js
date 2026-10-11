import React, { useEffect, useState } from 'react';
import 'react-tabs/style/react-tabs.css';
const FocuschartsComponent = () => null;
const BreakdownComponent = () => null;
import PlatformTabsComponent from './common-components/PlatformTabsComponent';
import PlatformChartComponent from './common-components/PlatformChartComponent';
import { DndContext, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
    saveTabsPlateform
    // , getTabsPlateform 
} from './services/saveTabsPlateform.services';
const OsaByBrand = () => null;
const TableDayOnDay = () => null;
const PlatformDistribution = () => null;
const OosDaysOverview = () => null;
const OsaPerformanceOverview = () => null;
import { useEbuxContext } from './Context/EbuxProvider';
const PALETTE = [
    { id: "PlatformChart", kpi: ["OSA"], label: "Graphical Analysis", rowSize: 1 },
    { id: "Focuscharts", kpi: ["OSA"], label: "Category Focus", rowSize: 1 },
    { id: "ComprehensiveBreakdown", kpi: ["OSA"], label: "Comprehensive Breakdown", rowSize: 1 }
];
import PlatformTabsComponent1 from './common-components/PlatformTabsComponent1';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
const TrendAnalysis = () => null;
const ToggleWidget = () => null;
const DarkStoreOverview = () => null;
import PlatformTabsComponentDarkStore from './common-components/PlatformTabsComponentDarkStore';
import { useDarkStoreHelperContext } from './Context/DarkStoreHelperProvider';
import { moduleMap, Page_Data, Tab_TYPE, trackTabSwitch } from '../../tracker';


function SortableItem({ id, platformSubCat }) {


    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition
    } = useSortable({ id });

    const style = {
        transform: CSS?.Transform?.toString(transform),
        transition,
        zIndex: transform ? 999 : 'auto',
        position: transform ? 'relative' : 'static',
    };
    const getComponent = (ComponentName = "", listeners, attributes) => {
        switch (ComponentName) {
            case "PlatformChart":
                return <PlatformChartComponent listeners={listeners} attributes={attributes} />;
            case "Focuscharts":
                return <FocuschartsComponent listeners={listeners} attributes={attributes} chartTitle='Category Focus' chartType='Category' chartLable={'OSA'} platformSubCat={platformSubCat} />;
            case "ComprehensiveBreakdown":
                //     // return <ComprehensiveBreakdownComponent  listeners={listeners} attributes={attributes} platformSubCat={platformSubCat}/>;
                return <BreakdownComponent listeners={listeners} attributes={attributes} platformSubCat={platformSubCat} />;
            // return <ComprehensiveBreakdownComponent  listeners={listeners} attributes={attributes} platformSubCat={platformSubCat}/>;
            case "OsaByBrand":
                return <React.Suspense fallback={<div>Loading...</div>}><OsaByBrand listeners={listeners} attributes={attributes} /></React.Suspense>;
            case "OosDaysOverview":
                return <React.Suspense fallback={<div>Loading...</div>}><OosDaysOverview listeners={listeners} attributes={attributes} /></React.Suspense>;
            case "OsaPerformanceOverview":
                return <React.Suspense fallback={<div>Loading...</div>}><OsaPerformanceOverview listeners={listeners} attributes={attributes} /></React.Suspense>;
            case "DayonDayTable":
                return <React.Suspense fallback={<div>Loading...</div>}><TableDayOnDay listeners={listeners} attributes={attributes} /></React.Suspense>;
            case "PlatformDistribution":
                return <React.Suspense fallback={<div>Loading...</div>}><PlatformDistribution listeners={listeners} attributes={attributes} /></React.Suspense>;
            default:
                return <></>;
        }
    }
    return (
        <div
            ref={setNodeRef}
            style={style}
        >
            {getComponent(id, listeners, attributes)}
        </div>
    );
}
const OSA = ({ type = 1 }) => {
    const {
        kpi,
        // selectedKpiDragPosition,
        activeClientProject,
        // initFitersLoadDarkStore,
        // filters,
        filtersDarkStore,
        // setFiltersDarkStore,
        // selectedFilters,
        // setSelectedFilters,
        // setHeaderFilterChips,
        // selectedFiltersWidget,
        // setSelectedFiltersWidget,
        // isDarkstoreFilter,
        // getDistinctFiltersDarkStoreFn,
        // getCombineFilterWidget,
        // setFilters,
        // getPincodesfromLocation,
        // rearrangePlatformPosition
        tabsPlatformData,
        setTabsPlatformData,
        platformSubCat
    } = useEbuxContext();
    const { handleTabChangeDarkStoreHelperProvider } = useDarkStoreHelperContext();
    const [platform, setPlatform] = useState([]);
    // const [platformSubCat,
    //     setPlatformSubCat
    // ] = useState([]);
    // const [isPlatform, setIsPlatform] = useState(false);

    // const savePlatformPositions = async (data) => {

    //     // const platformPosition = data.OSAPosition?.map((item, index) => ({
    //     //     value: item.value,
    //     //     position: index + 1
    //     // }));
    //     // console.log('66',platformPosition)
    //     // localStorage.setItem("OSAPosition", JSON.stringify(platformPosition));
    //     // const tabsPayload = {
    //     //     OSAPosition: platformPosition,
    //     // };

    //     // Save to API
    //     await saveTabsPlateform(data);

    // };

    // const loadAndRearrangePlatformPositions = (data) => {

    //     const storedPlatformPosition = JSON.parse(localStorage.getItem("OSAPosition"));
    //     if (storedPlatformPosition?.length) {

    //         const rearrangedArray = storedPlatformPosition
    //             ?.map(posItem => data.find(item => item.value === posItem.value))
    //             ?.filter(item => item !== undefined);

    //         const newItems = data.filter(item =>
    //             !storedPlatformPosition?.some(posItem => posItem.value === item.value)
    //         );

    //         const finalArray = [...rearrangedArray, ...newItems];

    //         savePlatformPositions(finalArray);
    //         return finalArray;
    //     } else {
    //         return [];
    //     }

    // };




    // useEffect(() => {
    //     let res_platform = [
    //         {
    //             value: "PlatformChart",
    //             position: 0
    //         },
    //         {
    //             value: "Focuscharts",
    //             position: 1
    //         },
    //         {
    //             value: "ComprehensiveBreakdown",
    //             position: 2
    //         }];

    //     const storedPlatformPosition = JSON.parse(localStorage.getItem("OSAPosition"));
    //     if (!storedPlatformPosition) {
    //         savePlatformPositions(res_platform ?? []);
    //     } else {
    //         res_platform = loadAndRearrangePlatformPositions(res_platform ?? []);
    //     }
    //     setPlatform(res_platform);
    // }, []);
    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (over && active?.id !== over?.id) {
            setPlatform((prevPlatforms) => {
                const oldIndex = prevPlatforms.findIndex((item) => item.value === active.id);
                const newIndex = prevPlatforms.findIndex((item) => item.value === over.id);
                const newdata = arrayMove(prevPlatforms, oldIndex, newIndex);
                const platformPosition = newdata.map((item, index) => ({
                    value: item.value,
                    position: index + 1
                }));
                // localStorage.setItem("OSAPosition", JSON.stringify(platformPosition));
                let tabsPayload = {
                    "OSAPosition": platformPosition,
                }
                saveTabsPlateform(tabsPayload);
                setTabsPlatformData(prev => ({
                    ...prev,
                    userRecord: {
                        ...prev?.userRecord,
                        tabs_plateform: {
                            ...prev?.userRecord?.tabs_plateform,
                            ...tabsPayload
                        }
                    }
                }));
                return newdata;
            });
        }
    };
    // useEffect(() => {
    //     // console.log('hiiiiiii')
    //     loadPlatformData();
    // }, []);

    useEffect(() => {
        if (tabsPlatformData) {
            if (tabsPlatformData?.userRecord?.tabs_plateform?.OSAPosition?.length) {
                setPlatform(tabsPlatformData.userRecord.tabs_plateform.OSAPosition);
            } else {
                const defaultPlatform = [
                    { value: "PlatformChart", position: 0 },
                    { value: "Focuscharts", position: 1 },
                    { value: "OsaByBrand", position: 2 },
                    { value: "OosDaysOverview", position: 3 },
                    { value: "OsaPerformanceOverview", position: 4 },
                    { value: "ComprehensiveBreakdown", position: 5 },
                    { value: "DayonDayTable", position: 6 },
                    { value: "PlatformDistribution", position: 7 },
                ];
                setPlatform(defaultPlatform);
            }
        }
    }, [tabsPlatformData]);


    useEffect(() => {
        // console.log('Platform state updated:', platform);
        const newP = [...platform];
        if (type == 1 && platform?.findIndex((i) => i.value == "PlatformChart") == -1) {
            newP.push({ value: "PlatformChart", position: newP.length });
        }
        if (type == 1 && platform?.findIndex((i) => i.value == "Focuscharts") == -1) {
            newP.push({ value: "Focuscharts", position: newP.length });

        }
        if (type == 1 && platform?.findIndex((i) => i.value == "ComprehensiveBreakdown") == -1) {
            newP.push({ value: "ComprehensiveBreakdown", position: newP.length });

        }
        if (newP?.length > platform?.length) {
            setPlatform(newP);
        }
    }, [platform]);

    // const loadPlatformData = async () => {
    //     // alert("RRunning over here")
    //     try {
    //         let response = await getTabsPlateform(); // Fetch data from API
    //         // console.log('=====pc', response.userRecord)
    //         if (response?.userRecord?.tabs_plateform?.OSAPosition?.length) {
    //             setPlatform(response.userRecord.tabs_plateform.OSAPosition);
    //             setPlatformSubCat(response?.userRecord);
    //             rearrangePlatformPosition(
    //                 filters?.platform,
    //                 response?.userRecord?.osa_plateform?.PlatformPosition ?? [],
    //             );
    //         } else {
    //             // If no data from API, initialize with default data
    //             const defaultPlatform = [
    //                 { value: "PlatformChart", position: 0 },
    //                 { value: "Focuscharts", position: 1 },
    //                 { value: "OsaByBrand", position: 2 },
    //                 { value: "OosDaysOverview", position: 3 },
    //                 { value: "OsaPerformanceOverview", position: 4 },
    //                 { value: "ComprehensiveBreakdown", position: 5 },
    //                 { value: "DayonDayTable", position: 6 },
    //                 { value: "PlatformDistribution", position: 7 },
    //             ];
    //             let tabsPayload = {
    //                 OSAPosition: defaultPlatform,
    //             };

    //             // setPlatform(tabsPayload);
    //             // setIsPlatform(true);
    //             await savePlatformPositions(tabsPayload);
    //             //    response = await getTabsPlateform();
    //             setPlatform(defaultPlatform);
    //             rearrangePlatformPosition(
    //                 filters?.platform,
    //                 filters?.platform ?? [],
    //             );
    //         }

    //     } catch (error) {
    //         console.error("Error loading platform data:", error);
    //         setPlatform([]);
    //     }
    // };
    const sensors = useSensors(
        useSensor(MouseSensor, { activationConstraint: { distance: 10 } }),
        useSensor(TouchSensor)
    );
    const [selected, setSelected] = useState(type == 1 ? "executive_summary" : "executive_summary")

    useEffect(() => {
        if (filtersDarkStore?.tab_type) {
            // console.log('filtersDarkStore.tab_type', filtersDarkStore.tab_type)
            setSelected(filtersDarkStore.tab_type);
        }
    }, [filtersDarkStore?.tab_type]);

    // const handleChange = (event, newValue) => {
    //     if (newValue === "dark_store_analysis") {
    //         if (!filtersDarkStore?.platform || filtersDarkStore.platform.length === 0) {
    //             initFitersLoadDarkStore();
    //         }else{
    //             setSelectedFilters(prevFilters => ({
    //                 ...prevFilters,
    //                 selectedPlatform: filtersDarkStore?.platform
    //             }))
    //         }
    //     }else{
    //         setSelectedFilters(prevFilters => ({
    //             ...prevFilters,
    //             selectedPlatform: filters?.platform,
    //             selectedBrand:[],
    //             selectedCategory:[],
    //             selectedMotherPack:[],
    //             selectedProductId:[]
    //         }))
    //         setSelectedFiltersWidget(prevSelectedFilters => ({
    //       ...prevSelectedFilters,
    //       selectedPlatformPdp: [],
    //       selectedPlatformKw: [],
    //       selectedBrand: [],
    //       selectedBrandPdp: [],
    //       selectedBrandKw: [],
    //       selectedBrandSOM: [],
    //       // selectedBrand_init: sub_brands ?? [],
    //       selectedCategory: [],
    //       // selectedCategory_init: sub_Categories ?? [],
    //       selectedSubCategory: [],
    //       // selectedSubCategory_init: res_sub_category ?? [],
    //       selectedProductId: [],
    //       selectedMotherPack: [],
    //       selectedLocation: [],
    //       selectedLocationPdp: [],
    //       selectedLocationKw: [],
    //       // selectedLocationpincode: location ?? [],
    //       selectedDarkstore: [],
    //       // selectedDarkstoreID: darkstore ?? [],
    //       selectedKeyword: [],
    //       // selectedKeyword_init: _keywords ?? [],
    //       selectedKeywordCategory: [],
    //       // selectedKeywordCategory_init: keyword_sub_Categories ?? [],
    //       selectedKeywordType: [],
    //       selectedOSARemarks: [],
    //       selectCategory_som: [],
    //       selectCategory_node: [],
    //       selectedProduct_ppg: [],
    //     }));
    //     }
    //     setSelected(newValue);
    //     setFiltersDarkStore(prevFilters => ({
    //         ...prevFilters,
    //         tab_type: newValue
    //     }));
    //     setHeaderFilterChips({})
    // };

    function a11yProps(index) {
        return {
            id: `simple-tab-${index}`,
            'aria-controls': `simple-tabpanel-${index}`,
        };
    }

    const tabItems = ([2].indexOf(activeClientProject?.client_project_id) > -1)
        ? [
            { label: "Executive Summary", value: "trend_analysis" },
            { label: "6P Analytics", value: "executive_summary" },
            ...(activeClientProject?.isHideDarkstore ? [] : [{ label: "Dark Store Analysis", value: "dark_store_analysis", disabled: (!activeClientProject?.isUseWidgetDarkstore) }]),
            { label: "Comprehensive Breakdown", value: "comprehensive_breakdown" },
        ]
        : [
            { label: "Executive Summary", value: "executive_summary" },
            ...(activeClientProject?.isHideDarkstore ? [] : [{ label: "Dark Store Analysis", value: "dark_store_analysis", disabled: (!activeClientProject?.isUseWidgetDarkstore) }]),
            { label: "Trend Analysis", value: "trend_analysis" },
            { label: "Comprehensive Breakdown", value: "comprehensive_breakdown" },
        ];

    const onChangeTab = (event, newValue) => {
        const clickedTab = tabItems?.find((item) => item.value === newValue);
        const tabLabel = clickedTab ? clickedTab.label : newValue;

        console.log("[ActivityTracker] Tab clicked:", {
            tabLabel,
            tabValue: newValue,
        });

        trackTabSwitch({
            tabName: tabLabel,
            tabValue: newValue,
        }, {
            module: moduleMap.dashboard,
            ...(Page_Data?.[kpi] ?? {}),
            tab: Tab_TYPE?.[newValue] ?? tabLabel ?? newValue
        });

        // setSelected(newValue);
        handleTabChangeDarkStoreHelperProvider({
            event,
            newValue,
            setSelected
        });
        // handleTabChange({
        //     event,
        //     newValue,
        //     filters,
        //     filtersDarkStore,
        //     initFitersLoadDarkStore,
        //     setSelected,
        //     setFiltersDarkStore,
        //     setSelectedFilters,
        //     selectedFilters,
        //     selectedFiltersWidget,
        //     setSelectedFiltersWidget,
        //     setHeaderFilterChips,
        //     isDarkstoreFilter,
        //     getDistinctFiltersDarkStoreFn,
        //     getCombineFilterWidget,
        //     setFilters,
        //     activeClientProject,
        //     getPincodesfromLocation
        // });

    };
    // console.log("selected Tab", selected)
    return (
        <>
            {type == 1 ? <PlatformTabsComponent type={"osa_plateform"} /> :
                filtersDarkStore?.tab_type === "dark_store_analysis"
                    ?
                    <PlatformTabsComponentDarkStore type={"osa_plateform"} />
                    :
                    <PlatformTabsComponent1 type={"osa_plateform"} />
            }
            {type == 2 && <div className='w-full bg-[#FFFFFF] px-4 my-4 relative flex justify-between items-center'>
                <div>
                    <Tabs
                        value={selected}
                        // onChange={handleChange}
                        onChange={onChangeTab}
                        aria-label="drawer tabs"
                        textColor="primary"
                        indicatorColor="primary"
                        sx={{
                            "& .MuiTab-root": {
                                color: "#00000099",
                                textTransform: "none",
                            },
                            "& .MuiTab-root.Mui-selected": {
                                color: "#1890FF",
                            },
                            "& .MuiTabs-indicator": {
                                backgroundColor: "#1890FF",
                                bottom: 0, // Aligns the indicator to the container bottom
                                height: "2px", // Adjust thickness if needed
                            },
                        }}
                    >
                        {tabItems.map((tab) => (
                            <Tab
                                key={tab.value}
                                value={tab.value}
                                disabled={tab?.disabled}
                                label={
                                    <div className={`flex items-center gap-1 font-inter font-normal text-base leading-6 tracking-normal align-middle ${tab?.disabled ? "cursor-not-allowed" : "cursor-pointer"}`}>
                                        {tab.label}
                                    </div>
                                }
                                {...a11yProps(tab.value)}
                            />
                        ))}
                    </Tabs>
                </div>
                {selected == "executive_summary" && <ToggleWidget />}
            </div>
            }

            {selected == "trend_analysis" ? <div><TrendAnalysis /></div> : <></>}
            {selected == "dark_store_analysis" ? <div><DarkStoreOverview /></div> : <></>}
            {selected == "comprehensive_breakdown" ? Array.isArray(platformSubCat) && platformSubCat.length == 0 && platform.length == 0 ? null : <BreakdownComponent listeners={null} attributes={null} platformSubCat={platformSubCat} /> : <></>}

            {selected == "executive_summary" ? (

                <DndContext sensors={sensors} onDragEnd={handleDragEnd} >
                    {/* <SortableContext items={(Array.isArray(platform) ? platform : []).map((item) => item.value)} >
                    {(Array.isArray(platform) ? platform : []).map((item) => (
                        <SortableItem
                            key={item.value}
                            id={item.value}
                            platformSubCat={platformSubCat}
                            className="mb-4ssssssssssssss"
                        />
                    ))
                    }
                </SortableContext> */}

                    <SortableContext items={(Array.isArray(platform) ? platform : []).map((item) => item.value)} >
                        <div className="grid grid-cols-2 gap-4 w-full">
                            {(Array.isArray(platform) ? platform : []).map((item) => {
                                const meta = PALETTE.find((p) => p?.id === item?.value); // match with widgetConstant.js
                                const notAllow = ((meta?.kpi?.indexOf(kpi) ?? -1) == -1);
                                // Decide width from rowSize
                                let spanClass = "col-span-2"; // default full width
                                if (meta?.rowSize === 2) spanClass = "col-span-1 max-w-[100%]"; // half width (50%)
                                if (meta?.rowSize === 4) spanClass = "col-span-1 max-w-[100%]"; // quarter width if you want
                                if (type == 1 && ["OsaByBrand", "OosDaysOverview", "OsaPerformanceOverview", "TableDayOnDay", "DayonDayTable", "PlatformDistribution"]?.indexOf(item.value) > -1) {
                                    return null;
                                } else if (type == 2 && ((["ComprehensiveBreakdown"]?.indexOf(item.value) > -1) || notAllow)) {
                                    return null;
                                }
                                return (
                                    <div
                                        key={item.value}
                                        className={spanClass}
                                    >
                                        <SortableItem
                                            key={item.value}
                                            id={item.value}
                                            platformSubCat={platformSubCat}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </SortableContext>

                </DndContext>
            ) : <></>}


        </>
    );
};


export default OSA;
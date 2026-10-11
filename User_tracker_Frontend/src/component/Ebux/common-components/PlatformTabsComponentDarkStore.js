import React, { useEffect, useRef, useState } from "react";
import "react-tabs/style/react-tabs.css";
import { useEbuxContext } from "../Context/EbuxProvider";
import Loader from "./Loader";
import { saveOSAPlateform } from "../services/saveTabsPlateform.services";

import {
  DndContext,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { fetchPlatformTabDataDarkStore } from "../services/ebux.service";

import { LuLock } from "react-icons/lu";
import { isEqual } from "lodash";
import { IoMdArrowDropup, IoMdArrowDropdown } from "react-icons/io";
import { ENTITY_TYPE, EVENTS, moduleMap, Page_Data, Tab_TYPE, trackCustomEvent } from "../../../tracker";
import TildeIcon from "./TildeIcon";

function SortableItem({ id, item }) {
  const {
    kpi,
    loadingReport,
    percentageIcon,
    averagePercentageData,
    // selectedPlatform,
    handlePlatformTabClickNewDarkStore,
    selectedFilters,
  } = useEbuxContext();

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS?.Transform?.toString(transform),
    transition,
    zIndex: transform ? 999 : "auto",
    position: transform ? "relative" : "static",
  };
  // const getStatus = (data) => {
  //   const diff = (data?.currentData ?? 0) - (data?.previousData ?? 0);
  //   if (
  //     data?.currentData &&
  //     selectedFilters?.selectedDateRange?.isCompareToPrevious &&
  //     !isNaN(diff)
  //   ) {
  //     if (diff < 0) {
  //       return (
  //         <span className=" statsStatus downStatus">
  //           <img
  //             src="/assets/images/downArrow.svg"
  //             width={8}
  //             alt="Down Arrow"
  //           />
  //           {Math.abs(diff)?.toFixed(2) + "" + percentageIcon}
  //         </span>
  //       );
  //     } else {
  //       return (
  //         <span className=" statsStatus upStatus">
  //           <img src="/assets/images/upArrow.svg" width={8} alt="Up Arrow" />
  //           {diff.toFixed(2) + "" + percentageIcon}
  //         </span>
  //       );
  //     }
  //   } else {
  //     return <></>;
  //   }
  // };

  const getStatus1 = (data) => {
    const diff = (data?.currentData ?? 0) - (data?.previousData ?? 0);
    if (
      ((data?.currentData ?? -1) > -1) &&
      selectedFilters?.[selectedFilters?.calendarType == "week" ? "selectedWeeks" : "selectedDateRange"]?.isCompareToPrevious &&
      !isNaN(diff)
    ) {
      if (Math.abs(diff).toFixed(2) == 0.00) {
        return (
          <span className="flex items-center text-xs  px-1 py-0.5 border-[0.2px] border-[#A3A39E] bg-[#e5e5e5] text-[#484545] rounded-full">
            <TildeIcon size={9} color="#484545" strokeWidth={4} className="text-sm " /> {"0" + percentageIcon}
          </span>
        );
      } else if (diff < 0) {
        return (
          <span className="text-[#DD4242] flex items-center text-xs  px-1 py-0.5 border-[0.2px] border-[#FFA39E] bg-[#FFF1F0] rounded-full">
            <IoMdArrowDropdown className="text-sm " />
            {decimalValueManager(Math.abs(diff)?.toFixed(2)) + "" + percentageIcon}
          </span>
        );
      } else {
        return (
          <span className="text-[#329900] flex items-center text-xs  px-1 py-0.5 border-[0.2px] border-[#B7EB8F] bg-[#E8FFEB] rounded-full">
            <IoMdArrowDropup className="text-sm " />
            {decimalValueManager(diff.toFixed(2)) + "" + percentageIcon}
          </span>
        );
      }
    } else {
      return <></>;
    }
  }

  const decimalValueManager = (val) => {
    if (!val) return val;
    const value = val?.split(".");
    if (value[0].length > 2) {
      return value?.[0] // no point visible 100, 121
    } else if (value[0].length > 1 && value[0].length <= 2) {
      return value?.[0] + (value?.[1]?.length > 0 ? ("." + value?.[1]?.substring(0, 1)) : ""); // 10 - 99 -> 12.1
    } else {
      return value?.[0] + (value?.[1]?.length > 0 ? ("." + (value?.[1] + "00")?.substring(0, 2)) : ""); //. 0.99
    }
  }

  const getPlatfomValue = (_platform = "") => {
    if (_platform in averagePercentageData) {
      const val =
        averagePercentageData?.[_platform]?.currentData?.toFixed(2) ?? 0;
      return `${decimalValueManager(val) + percentageIcon}`;
    } else {
      return "...";
    }
  };

  const timer = useRef(null);

  const handleSingleClick = (e, item) => {
    if (loadingReport) return;
    e.stopPropagation();
    trackCustomEvent(EVENTS.CLICK, { item: item.label }, ENTITY_TYPE.Platform_Tile_Component, {
      module: moduleMap.dashboard,
      ...(Page_Data?.[kpi] ?? {}),
      tab: Tab_TYPE.dark_store_analysis
    })
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      handlePlatformTabClickNewDarkStore(item);
    }, 250);
  };

  const handleDoubleClick = (e, item) => {
    if (loadingReport) return;
    e.stopPropagation();

    trackCustomEvent(EVENTS.DOUBLE_CLICK, { item: item.label }, ENTITY_TYPE.Platform_Tile_Component, {
      module: moduleMap.dashboard,
      ...(Page_Data?.[kpi] ?? {}),
      tab: Tab_TYPE.dark_store_analysis
    })
    clearTimeout(timer.current);
    handlePlatformTabClickNewDarkStore(item, true);
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <div
        className={`statsTabContentBox !bg-[#FFFFFF] !rounded-lg flex flex-col items-center justify-center min-h-[130px] w-full !p-4 ${selectedFilters.selectedPlatform.some(
          (platform) =>
            platform.value === item.value && platform.label === item.label
        )
          ? "selected !border-[1px] !border-[#0081F7]"
          : "disabled  !border-[#EFF0F6]"
          }
          ${loadingReport ? "cursor-not-allowed" : "cursor-pointer"}
          `}
        onClick={(e) => !loadingReport && handleSingleClick(e, item)}
        onDoubleClick={(e) => !loadingReport && handleDoubleClick(e, item)}

      >
        <div className="flex  items-center justify-center mb-2  w-[30px] h-[30px]">
          <img
            src={item?.platform_description ?? "/assets/logo/amazon1logo.svg"}
            className="object-contain w-full h-full"
            alt="Amazon Logo"
          />

        </div>

        <h6 className="text-center mt-1">{item.label}</h6>
        <div className=" flex items-center mt-1 gap-1 ">
          <span className="statsPercent !text-[16px]">
            {loadingReport && (
              <Loader show={loadingReport} fullScreen={false} />
            )}
            {!loadingReport && getPlatfomValue(item.label)}
          </span>
          <span className="text-xs mt-1 text-[#00000099]">

            {!loadingReport && ((averagePercentageData[`${item.label}`]?.previousData ?? -1) > -1) && decimalValueManager(averagePercentageData[`${item.label}`]?.previousData.toFixed(2)) + "" + percentageIcon}
          </span>

          {!loadingReport && (
            <>
              <>{getStatus1(averagePercentageData[`${item.label}`])} </>
            </>
          )}

          {/* {!loadingReport && (
            <>{getStatus(averagePercentageData[`${item.label}`])} </>
          )} */}
        </div>
      </div>
    </div>
  );
}

const PlatformTabsComponentDarkStore = ({ type }) => {
  const {
    setAveragePercentageData,
    setLoadingReport,
    filtersDarkStore,   // ✅ added for dark_store
    kpi,
    // selectedPlatform,
    selectedFilters,
    filtersLoading,
    // setFiltersDarkStore,
    activeClientProject,
    tabsPlatformData,
    setTabsPlatformData
  } = useEbuxContext();
  if (activeClientProject?.uiType === "ds3") return;

  const previousSelectedFilters = useRef({});
  //const previousSelectedPlatform = useRef({});
  const [platform, setPlatform] = useState([]);
  const [platformType, setPlatformType] = useState(type);
  const [unsubscribedPlatforms, setUnsubscribedPlatforms] = useState([]);

  // useEffect(() => {
  //   //console.log('---platformplatform--------', platform)
  //   // setPlatform([...(filters?.platform?.filter(i=>((kpi!="RR")?true:((i?.review_status??1)==1))) ?? [])]);
  //   setPlatform([
  //     ...(filters?.platform?.filter(i => {
  //       if (kpi == "RR") return (i?.review_status ?? 1) == 1;
  //       if (kpi == "SOM") return i?.app_status_som == 1;
  //       return true;
  //     }) ?? [])
  //   ]);
  //   console.log("cheking the platformposition", filters?.platform);

  //   setPlatformType(type)
  //   // setUnsubscribedPlatforms([...(filters?.unsubscribedPlatforms ?? []),...(filters?.platform?.filter(i=>(kpi=="RR"&&(i?.review_status??1)==0)) ?? [])]);
  //   setUnsubscribedPlatforms([
  //     ...(filters?.unsubscribedPlatforms ?? []),
  //     ...(filters?.platform?.filter(i =>
  //       (kpi == "RR" && (i?.review_status ?? 1) == 0) ||
  //       (kpi == "SOM" && i?.app_status_som == 0)
  //     ) ?? [])
  //   ]);
  // }, [filters]);


  // useEffect(() => {

  //   setPlatform([
  //     ...(filtersDarkStore?.platform?.filter(i => {
  //       if (kpi == "RR") return (i?.review_status ?? 1) == 1;
  //       if (kpi == "SOM") return i?.app_status_som == 1;
  //       return true;
  //     }) ?? [])
  //   ]);

  //   setPlatformType(type);
  //   setUnsubscribedPlatforms([
  //     ...(filtersDarkStore?.unsubscribedPlatforms ?? []),
  //     ...(filtersDarkStore?.platform?.filter(i =>
  //       (kpi == "RR" && (i?.review_status ?? 1) == 0) ||
  //       (kpi == "SOM" && i?.app_status_som == 0)
  //     ) ?? [])
  //   ]);
  // }, [filtersDarkStore]);   // ✅ watch both
  useEffect(() => {
    let rawPlatform = filtersDarkStore?.platform?.filter(i => {
      if (kpi == "RR") return (i?.review_status ?? 1) == 1;
      if (kpi == "SOM") return i?.app_status_som == 1;
      return true;
    }) ?? [];

    let storedPositions = tabsPlatformData?.userRecord?.[type]?.darkstorePlatformPosition;

    if (storedPositions && storedPositions.length > 0) {
      const rearrangedArray = storedPositions
        .map(posItem => rawPlatform.find(item => item.value === posItem.value))
        .filter(item => item !== undefined);
      const newItems = rawPlatform.filter(item =>
        !storedPositions.some(posItem => posItem.value === item.value)
      );
      rawPlatform = [...rearrangedArray, ...newItems];
    }

    setPlatform(rawPlatform);

    setPlatformType(type);
    setUnsubscribedPlatforms([
      ...(filtersDarkStore?.unsubscribedPlatforms ?? []),
      ...(filtersDarkStore?.platform?.filter(i =>
        (kpi == "RR" && (i?.review_status ?? 1) == 0) ||
        (kpi == "SOM" && i?.app_status_som == 0)
      ) ?? [])
    ]);
  }, [filtersDarkStore, tabsPlatformData, type, kpi]);   // ✅ watch both

  // useEffect(() => {
  //   async function fetchData() {
  //     setLoadingReport(true);
  //     const currentData = await fetchPlatformTabData(
  //       kpi,
  //       filters,
  //       selectedFilters,
  //       selectedFilters.selectedPlatform,
  //       false
  //     );

  //     let previousData = {};
  //     if (selectedFilters?.selectedDateRange?.isCompareToPrevious) {
  //       previousData = await fetchPlatformTabData(
  //         kpi,
  //         filters,
  //         selectedFilters,
  //         selectedFilters.selectedPlatform,
  //         true
  //       );
  //     }
  //     const avg = {};
  //     console.log("cureentdata", currentData);

  //     Object.keys(currentData)?.forEach((k) => {
  //       if (!avg[k]) {
  //         avg[k] = {};
  //       }
  //       avg[k]["currentData"] = currentData[k]?.output;
  //     });

  //     Object.keys(previousData)?.forEach((k) => {
  //       if (!avg[k]) {
  //         avg[k] = {};
  //       }
  //       avg[k]["previousData"] = previousData[k]?.output;
  //     });
  //     // eslint-disable-next-line no-console
  //     //console.log(previousSelectedPlatform.current);

  //     setAveragePercentageData(avg);
  //     setLoadingReport(false);
  //   }
  //   if (
  //     !filtersLoading &&
  //     platform.length &&
  //     (!isEqual(previousSelectedFilters.current, selectedFilters))
  //   ) {
  //     previousSelectedFilters.current = selectedFilters;
  //     fetchData();
  //   }
  // }, [selectedFilters, platform]);



  useEffect(() => {
    // async function fetchData() {
    //   setLoadingReport(true);


    //   const currentData = await fetchKPIOverallDataDarkStore(
    //     kpi,
    //     filtersDarkStore,
    //     selectedFilters,
    //     selectedFilters.selectedPlatform,
    //     false
    //   );

    //   let previousData = {};
    //   if (selectedFilters?.selectedDateRange?.isCompareToPrevious) {
    //     previousData = await fetchKPIOverallDataDarkStore(
    //       kpi,
    //       filtersDarkStore,
    //       selectedFilters,
    //       selectedFilters.selectedPlatform,
    //       true
    //     );
    //   }
    //   const avg = {};
    //   console.log("cureentdatassss", previousData);

    //   Object.keys(currentData)?.forEach((k) => {
    //     if (!avg[k]) {
    //       avg[k] = {};
    //     }
    //     avg[k]["currentData"] = currentData[k]?.output;
    //   });

    //   Object.keys(previousData)?.forEach((k) => {
    //     if (!avg[k]) {
    //       avg[k] = {};
    //     }
    //     avg[k]["previousData"] = previousData[k]?.output;
    //   });
    //   // eslint-disable-next-line no-console
    //   console.log('kpi-data',avg);

    //   setAveragePercentageData(avg);
    //    setFiltersDarkStore((prev) => ({
    //   ...prev,
    //   OSA: currentData["OSA"] ?? 0,
    //   PRO: currentData["PRO"] ?? 0,
    // }));

    //   setLoadingReport(false);
    // }

    // async function fetchData() {
    //   setLoadingReport(true);
    //   const currentData = await fetchKPIOverallDataDarkStore(kpi, filtersDarkStore, selectedFilters, selectedFilters.selectedPlatform, false);

    //   let previousData = {};
    //   if (selectedFilters?.[selectedFilters?.calendarType == "week" ? "selectedWeeks" : "selectedDateRange"]?.isCompareToPrevious) {
    //     previousData = await fetchKPIOverallDataDarkStore(kpi, filtersDarkStore, selectedFilters, selectedFilters.selectedPlatform, true);
    //   }
    //   const avg = {};
    //   Object.keys(currentData)?.forEach(k => {
    //     if (!avg[k]) {
    //       avg[k] = {};
    //     }
    //     avg[k]['currentData'] = currentData[k];
    //   });

    //   Object.keys(previousData)?.forEach(k => {
    //     if (!avg[k]) {
    //       avg[k] = {};
    //     }
    //     avg[k]['previousData'] = previousData[k];
    //   })
    //   console.log('aaaaaaaaaaaaaaa', avg)
    //   // eslint-disable-next-line no-console
    //   //   console.log({avg});
    //   // setAveragePercentageData(avg);
    //   setFiltersDarkStore((prev) => ({
    //     ...prev,
    //     OSA: {
    //       ...prev.OSA,
    //       currentData: avg?.OSA?.currentData ?? prev.OSA?.currentData
    //     },
    //     PRO: {
    //       ...prev.PRO,
    //       currentData: avg?.PRO?.currentData ?? prev.PRO?.currentData
    //     }
    //   }));

    //   setLoadingReport(false);

    // }





    async function fetchData2() {
      setLoadingReport(true);
      const currentData = await fetchPlatformTabDataDarkStore(
        kpi,
        filtersDarkStore,
        selectedFilters,
        selectedFilters.selectedPlatform,
        false
      );

      let previousData = {};
      if (selectedFilters?.[selectedFilters?.calendarType == "week" ? "selectedWeeks" : "selectedDateRange"]?.isCompareToPrevious) {
        previousData = await fetchPlatformTabDataDarkStore(
          kpi,
          filtersDarkStore,
          selectedFilters,
          selectedFilters.selectedPlatform,
          true
        );
      }
      const avg = {};
      // console.log("cureentdata", currentData);

      Object.keys(currentData)?.forEach((k) => {
        if (!avg[k]) {
          avg[k] = {};
        }
        avg[k]["currentData"] = currentData[k]?.output;
      });

      Object.keys(previousData)?.forEach((k) => {
        if (!avg[k]) {
          avg[k] = {};
        }
        avg[k]["previousData"] = previousData[k]?.output;
      });
      // eslint-disable-next-line no-console
      //console.log(previousSelectedPlatform.current);

      setAveragePercentageData(avg);
      setLoadingReport(false);
    }

    if (
      !filtersLoading &&
      platform.length &&
      (!isEqual(previousSelectedFilters.current, selectedFilters))
    ) {
      previousSelectedFilters.current = selectedFilters;
      // fetchData();
      fetchData2();
    }
  }, [selectedFilters, platform]);

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (over && active?.id !== over?.id) {
      const oldIndex = platform.findIndex(
        (item) => item.value === active.id
      );
      trackCustomEvent(EVENTS.Drag_End, { item: platform?.[oldIndex]?.label }, ENTITY_TYPE.Platform_Tile_Component, {
        module: moduleMap.dashboard,
        ...(Page_Data?.[kpi] ?? {}),
      })
      setPlatform((prevPlatforms) => {
        const oldIndex = prevPlatforms.findIndex(
          (item) => item.value === active.id
        );
        const newIndex = prevPlatforms.findIndex(
          (item) => item.value === over.id
        );
        const newdata = arrayMove(prevPlatforms, oldIndex, newIndex);
        const platformPosition = newdata.map((item, index) => ({
          value: item.value,
          position: index + 1,
        }));
        //  console.log('---', platformPosition)
        // localStorage.setItem(
        //   "platformPosition",
        //   JSON.stringify(platformPosition)
        // );
        let tabsPayload = {
          "type": platformType,
          "key": 'darkstorePlatformPosition',
          "darkstorePlatformPosition": platformPosition,
        }
        //saveOSAPlateform(tabsPayload);
        saveOSAPlateform(tabsPayload).then((res) => {
          if (res?.updatedData) {
            setTabsPlatformData(prev => ({ ...prev, userRecord: res.updatedData }));
          }
        });
        return newdata;
      });
    }
  };
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 10 } }),
    useSensor(TouchSensor)
  );

  const contentRef = useRef(null);
  const scrollAmount = 250;

  const scrollLeft = () => {
    if (contentRef.current) {
      trackCustomEvent(EVENTS.SCROLL, {}, ENTITY_TYPE.Platform_Tile_Component, {
        module: moduleMap.dashboard,
        ...(Page_Data?.[kpi] ?? {}),
      })
      const maxScrollLeft = 0;
      const newScrollLeft = contentRef.current.scrollLeft - scrollAmount;

      if (contentRef.current.scrollLeft > maxScrollLeft) {
        contentRef.current.scrollTo({
          left: newScrollLeft,
          behavior: "smooth",
        });
      }
    }
  };
  const scrollRight = () => {
    if (contentRef.current) {
      trackCustomEvent(EVENTS.SCROLL, {}, ENTITY_TYPE.Platform_Tile_Component, {
        module: moduleMap.dashboard,
        ...(Page_Data?.[kpi] ?? {}),
      })
      const maxScrollRight =
        contentRef.current.scrollWidth - contentRef.current.clientWidth;
      const newScrollLeft = contentRef.current.scrollLeft + scrollAmount;

      if (contentRef.current.scrollLeft < maxScrollRight) {
        contentRef.current.scrollTo({
          left: newScrollLeft,
          behavior: "smooth",
        });
      }
    }
  };
  return (
    <div className="tabsWrapContent shadow-md">
      <div className="statTabOuter">
        <button type="button" className="prevStats !top-[60px]" onClick={scrollLeft}>
          <img src="/assets/images/arrowLeft.svg" width={14} height={14} />
        </button>

        <div className="statsTabContentWrap" ref={contentRef}>
          <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
            <SortableContext items={platform.map((item) => item.value)}>
              {platform?.map((item) => (
                <SortableItem key={item.value} id={item.value} item={item} />
              ))}
            </SortableContext>
          </DndContext>

          {unsubscribedPlatforms?.map((item, index) => (
            <div
              key={index}
              className={`statsTabContentBox disabled cursor-not-allowed `}
            >
              <div className="statsTabHead justify-between">
                <div className="flex flex-row gap-2 items-center">
                  <img
                    src={
                      item?.platform_description ??
                      `/assets/images/${item.label.toLowerCase()}Logo.svg`
                    }
                    width={18}
                    height={18}
                    alt=""
                  />
                  <h6>{item.label} </h6>
                </div>
                <span className="platformLock">
                  <LuLock size={14} color="black" />
                </span>
              </div>
            </div>
          ))}
        </div>
        <button type="button" className="nextStats !top-[60px]" onClick={scrollRight}>
          <img src="/assets/images/arrowRight.svg" width={14} height={14} />
        </button>
      </div>
    </div>

  );
};

export default PlatformTabsComponentDarkStore;

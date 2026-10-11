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
import { fetchPlatformTabData } from "../services/platformTab.services";

import { LuLock } from "react-icons/lu";
import { isEqual } from "lodash";

function SortableItem({ id, item }) {
  const {
    loadingReport,
    percentageIcon,
    averagePercentageData,
    // selectedPlatform,
    handlePlatformTabClick,
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
  const getStatus = (data) => {
    const diff = (data?.currentData ?? 0) - (data?.previousData ?? 0);
    if (
      data?.currentData &&
      selectedFilters?.[selectedFilters?.calendarType == "week" ? "selectedWeeks" : "selectedDateRange"]?.isCompareToPrevious &&
      !isNaN(diff)
    ) {
      if (diff < 0) {
        return (
          <span className="ml-2 statsStatus downStatus">
            <img
              src="/assets/images/downArrow.svg"
              width={8}
              alt="Down Arrow"
            />
            {Math.abs(diff)?.toFixed(2) + "" + percentageIcon}
          </span>
        );
      } else {
        return (
          <span className="ml-2 statsStatus upStatus">
            <img src="/assets/images/upArrow.svg" width={8} alt="Up Arrow" />
            {diff.toFixed(2) + "" + percentageIcon}
          </span>
        );
      }
    } else {
      return <></>;
    }
  };

  const getPlatfomValue = (_platform = "") => {
    if (_platform in averagePercentageData) {
      const val =
        averagePercentageData?.[_platform]?.currentData?.toFixed(2) ?? 0;
      return `${val + percentageIcon}`;
    } else {
      return "...";
    }
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <div
        className={`statsTabContentBox cursor-pointer ${selectedFilters.selectedPlatform.some(
          (platform) =>
            platform.value === item.value && platform.label === item.label
        )
          ? "selected"
          : "disabled"
          }`}
        onClick={() => handlePlatformTabClick(item)}
      >
        <div className="statsTabHead">
          <img
            src={
              item?.platform_description ??
              `/assets/images/${item.label.toLowerCase()}Logo.svg`
            }
            width={18}
            height={18}
            alt={`${item.label.toLowerCase()} Logo`}
          />
          <h6>{item.label}</h6>
        </div>
        <div className="statsBoxData">
          <span className="statsPercent">
            {loadingReport && (
              <Loader show={loadingReport} fullScreen={false} />
            )}
            {!loadingReport && getPlatfomValue(item.label)}
          </span>

          {!loadingReport && (
            <>{getStatus(averagePercentageData[`${item.label}`])} </>
          )}
        </div>
      </div>
    </div>
  );
}

const PlatformTabsComponent = ({ type }) => {
  const {
    setAveragePercentageData,
    setLoadingReport,
    filters,
    kpi,
    // selectedPlatform,
    selectedFilters,
    filtersLoading,
  } = useEbuxContext();

  const previousSelectedFilters = useRef({});
  //const previousSelectedPlatform = useRef({});
  const [platform, setPlatform] = useState([]);
  const [platformType, setPlatformType] = useState(type);
  const [unsubscribedPlatforms, setUnsubscribedPlatforms] = useState([]);

  useEffect(() => {
    //console.log('---platformplatform--------', platform)
    // setPlatform([...(filters?.platform?.filter(i=>((kpi!="RR")?true:((i?.review_status??1)==1))) ?? [])]);
    setPlatform([
      ...(filters?.platform?.filter(i => {
        if (kpi == "RR") return (i?.review_status ?? 1) == 1;
        if (kpi == "SOM") return i?.app_status_som == 1;
        return true;
      }) ?? [])
    ]);
    // console.log("cheking the platformposition",filters?.platform);

    setPlatformType(type)
    // setUnsubscribedPlatforms([...(filters?.unsubscribedPlatforms ?? []),...(filters?.platform?.filter(i=>(kpi=="RR"&&(i?.review_status??1)==0)) ?? [])]);
    setUnsubscribedPlatforms([
      ...(filters?.unsubscribedPlatforms ?? []),
      ...(filters?.platform?.filter(i =>
        (kpi == "RR" && (i?.review_status ?? 1) == 0) ||
        (kpi == "SOM" && i?.app_status_som == 0)
      ) ?? [])
    ]);
  }, [filters]);

  useEffect(() => {
    async function fetchData() {
      setLoadingReport(true);
      const currentData = await fetchPlatformTabData(
        kpi,
        filters,
        selectedFilters,
        selectedFilters.selectedPlatform,
        false
      );

      let previousData = {};
      if (selectedFilters?.[selectedFilters?.calendarType == "week" ? "selectedWeeks" : "selectedDateRange"]?.isCompareToPrevious) {
        previousData = await fetchPlatformTabData(
          kpi,
          filters,
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
      fetchData();
    }
  }, [selectedFilters, platform]);

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (over && active?.id !== over?.id) {
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
          "key": 'PlatformPosition',
          "PlatformPosition": platformPosition,
        }
        saveOSAPlateform(tabsPayload);
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
    <div className="tabsWrapContent">
      <div className="statTabOuter">
        <button type="button" className="prevStats" onClick={scrollLeft}>
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
        <button type="button" className="nextStats" onClick={scrollRight}>
          <img src="/assets/images/arrowRight.svg" width={14} height={14} />
        </button>
      </div>
    </div>

  );
};

export default PlatformTabsComponent;

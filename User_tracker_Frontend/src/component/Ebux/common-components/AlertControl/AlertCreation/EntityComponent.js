import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartShopping,
  faTableCellsLarge,
  faTags,
  // faLayerGroup,
  faCube,
  faLocationDot,
  faCircleInfo,
  // faMegaphone,
} from "@fortawesome/free-solid-svg-icons";
// import { useState } from "react";
import EntityConditionComponent from "./EntityConditionComponent";
import { EVENTS, TRACKING_COMPONENT, trackCustomEvent } from "../../../../../tracker";

export default function EntityComponent({ alertControlObj, setAlertControlObj, trackerContext }) {
  const selected = alertControlObj.entity;
  const setSelected = (val) => {
    trackCustomEvent(
      EVENTS.TOGGLE_BUTTON,
      {
        action: "select_entity",
        entity: val,
        component: TRACKING_COMPONENT.TOGGLE_BUTTON,
      },
      "Entity Component",
      trackerContext
    );
    setAlertControlObj(prev => {
      let nextMetricType = prev.metricType || "Product";
      let nextKpi = prev.kpi;

      if (val === "Products") {
        nextKpi = "OSA";
        nextMetricType = "Product";
      } else if (val === "Keywords") {
        nextKpi = "SOS";
        nextMetricType = "Keyword";
      } else if (val === "keywordCategory") {
        nextKpi = "SOS";
        nextMetricType = "Keyword";
      } else {
        // Brands, Categories, Platforms, Locations
        nextKpi = nextMetricType === "Product" ? "OSA" : "SOS";
      }

      const isChange = prev.metricType && prev.metricType !== nextMetricType;
      // console.log('isChangeisChange', isChange)

      return {
        ...prev,
        ...(isChange ? {
          breakdown: [],
          items: {
            selectedBrand: [],
            selectedCategory: [],
            selectedPlatform: [],
            selectedLocation: [],
            selectedProductId: [],
            selectedCompetitionBrand: [],
            selectedCompetitionProductId: [],
            selectedKeywordCategory: [],
            selectedKeyword: [],
            selectedTags: [],
            selectedTagsKW: [],
            //      status: [],
            // entity: [],
            // conditions: [],
            // lastTriggered: [],
            // createdBy:[],
            // scheduling: {
            //   nextRun: [],
            //   frequency: []
            // },
          },
          conditions: [[{ type: null, metric: "", operator: "", value: "", continuity: "" }]],
        } : {}),
        entity: val,
        metricType: nextMetricType,
        kpi: nextKpi
      };
    });
  };

  const cards = [
    {
      title: "Products",
      desc: "Track specific SKUs, individual items, or catalog entries.",
      icon: faCartShopping,
      img: "shopping-cart-top.svg"
    },
    {
      title: "Keywords",
      desc: "Monitor search terms, ranking performance, and SEO trends.",
      icon: faTableCellsLarge,
      img: "layout-dashboard.svg"
    },
    {
      title: "Brands",
      desc: "Aggregated alerts for specific competitor or owned brands.",
      icon: faTags,
      img: "grid-2x2-plus.svg"
    },
    {
      title: "Categories",
      desc: "Monitor entire product taxonomy or specific departments.",
      icon: faTags,
      img: "notification.svg"
    },
    {
      title: "Platforms",
      desc: "Alerts based on marketplace or retailer performance.",
      icon: faCube,
      img: "codesandbox.svg"
    },
    {
      title: "Locations",
      desc: "Geographic specific alerts for regional availability.",
      icon: faLocationDot,
      img: "map-pin.svg"
    },
  ];

  return (
    <div className="pb-10">
      {/* Heading */}
      <h2 className="text-2xl font-semibold text-gray-800">
        What would you like to be alerted about?
      </h2>
      <p className="text-gray-500 mt-2">
        Select the core entity type that will form your alert list.
      </p>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {cards.map((card) => {
          let isActive = selected === card.title;
          if (card.title === "Categories" && selected === "keywordCategory") {
            isActive = true;
          }

          return (
            <div
              key={card.title}
              onClick={() => setSelected(card.title)}
              className={`cursor-pointer rounded-xl border p-6 transition-all duration-200
                ${isActive
                  ? "border-[#0081F7] bg-blue-50 shadow-md"
                  : "border-gray-200 bg-white hover:shadow-sm"
                }
              `}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 flex items-center justify-center rounded-lg
                    ${isActive
                      ? "bg-blue-100 text-blue-600"
                      : "bg-gray-100 text-gray-500"
                    }
                  `}
                >
                  {/* <FontAwesomeIcon icon={card.icon} /> */}
                  <img src={`/assets/images/alert-images/${card.img}`} alt={card.title} />
                </div>
                <h3 className="text-lg font-medium #000000D9">
                  {card.title}
                </h3>
              </div>

              <p className="text-sm text-[#000000A6] mt-4 leading-relaxed">
                {card.desc}
              </p>
            </div>
          );
        })}
      </div>

      <div className="mt-10 bg-blue-50 border border-blue-100 rounded-lg p-5 flex gap- border-l-[5px] border-l-[#0081F7]">
        <div className="p-[10px_8px]">
          <FontAwesomeIcon
            icon={faCircleInfo}
            className="text-[#1890FF] mt-1 text-2xl"
          />
        </div>
        <div>
          <h4 className="text-[#1890FF] text-[20px] font-medium">
            Why am I choosing this?
          </h4>
          <p className="text-sm text-[#000000A6] mt-1">
            This determines what items will appear in your alert list.
            For example, selecting {selected} means youll receive a
            list of specific items that triggered the alert.
          </p>
        </div>
      </div>
      {!["Products", "Keywords"].includes(selected) && (
        <EntityConditionComponent alertControlObj={alertControlObj} setAlertControlObj={setAlertControlObj} trackerContext={trackerContext} />
      )}
    </div>
  );
}
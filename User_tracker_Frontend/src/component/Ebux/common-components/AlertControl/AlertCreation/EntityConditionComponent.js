import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  // faCircleInfo,
  // faCartShopping,
  // faSearch,
  faCheck,
  faCircleCheck
} from "@fortawesome/free-solid-svg-icons";
import { EVENTS, TRACKING_COMPONENT, trackCustomEvent } from "../../../../../tracker";

export default function EntityConditionComponent({ alertControlObj, setAlertControlObj, trackerContext }) {
  const selectedCategory = alertControlObj.metricType;
  const setSelectedCategory = (val) => {
    trackCustomEvent(
      EVENTS.TOGGLE_BUTTON,
      {
        action: "select_metric_type",
        metric_type: val,
        component: TRACKING_COMPONENT.TOGGLE_BUTTON,
      },
      "Entity Component",
      trackerContext
    );
    setAlertControlObj(prev => {
    let nextEntity = prev.entity;
    if (["Categories", "keywordCategory"].includes(prev.entity)) {
      nextEntity = val === "Product" ? "Categories" : "keywordCategory";
    }

    const isChange = prev.metricType !== val;

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
      entity: nextEntity,
      metricType: val,
      kpi: val === "Product" ? "OSA" : "SOS"
    };
  });
};

  const productMetrics = [
    "Out-of-Stocks Days",
    "On-Shelf Availability Percentage",
    "Promotion Percentage",
    "Selling Price",
    "Maximum Retail Price",
    "Product Ratings"
  ];

  const keywordMetrics = [
    "Overall Share of Search",
    "Paid Share of Search",
    "Organic Share of Search",
    "Overall Ranking",
    "Paid Ranking",
    "Organic Ranking"
  ];

  return (
    <div className="px-0 pb-12">
      {/* Heading */}
      <h2 className="text-2xl font-semibold text-gray-800 mt-8">
        Choose your metrics
      </h2>

      <p className="text-gray-500 mt-1">
        Select the type of performance metrics to monitor
      </p>


      {/* Cards */}
      <div className="grid md:grid-cols-2 gap-8 mt-8">

        {/* Product Based Metrics */}
        <div
          onClick={() => setSelectedCategory("Product")}
          className={`cursor-pointer border rounded-2xl p-6 transition-all duration-200 shadow-sm relative
            ${selectedCategory === "Product"
              ? "border-[#0081F7] bg-blue-50/50 ring-1 ring-[#0081F7]"
              : "border-gray-200 bg-white hover:border-blue-300"
            }
          `}
        >
          {selectedCategory === "Product" && (
            <div className="absolute top-4 right-4 text-[#0081F7]">
              <FontAwesomeIcon icon={faCircleCheck} className="text-xl" />
            </div>
          )}

          <div className="flex items-center gap-3 mb-5">

            <div className={`w-10 h-10 rounded-lg flex items-center justify-center
              ${selectedCategory === "Product" ? "bg-[#F3E8FF] text-blue-600" : "bg-purple-100 text-purple-600"}
            `}>
              {/* <FontAwesomeIcon icon={faCartShopping} /> */}
              <img src="/assets/images/alert-images/shopping-cart-prod.svg" alt="Product" />
            </div>

            <h3 className="text-lg font-semibold">
              Product- Based Metrics
            </h3>

          </div>

          <p className="text-gray-600 mb-4">
            Available Metric:
          </p>

          <div className="space-y-3">

            {productMetrics.map((metric) => (
              <div key={metric} className="flex items-center gap-3 text-gray-700">

                <FontAwesomeIcon
                  icon={faCheck}
                  className="text-green-500 text-sm"
                />

                {metric}

              </div>
            ))}

          </div>
        </div>


        {/* Keyword Based Metrics */}
        <div
          onClick={() => setSelectedCategory("Keyword")}
          className={`cursor-pointer border rounded-2xl p-6 transition-all duration-200 shadow-sm relative
            ${selectedCategory === "Keyword"
              ? "border-[#0081F7] bg-blue-50/50 ring-1 ring-[#0081F7]"
              : "border-gray-200 bg-white hover:border-blue-300"
            }
          `}
        >
          {selectedCategory === "Keyword" && (
            <div className="absolute top-4 right-4 text-[#0081F7]">
              <FontAwesomeIcon icon={faCircleCheck} className="text-xl" />
            </div>
          )}

          <div className="flex items-center gap-3 mb-5">

            <div className={`w-10 h-10 rounded-lg flex items-center justify-center
              ${selectedCategory === "Keyword" ? "bg-blue-100 text-blue-600" : "bg-blue-100 text-blue-600"}
            `}>
              {/* <FontAwesomeIcon icon={faSearch} /> */}
              <img src="/assets/images/alert-images/shopping-cart.svg" alt="Product" />
            </div>

            <h3 className="text-lg font-semibold">
              Keyword- Based Metrics
            </h3>

          </div>

          <p className="text-gray-600 mb-4">
            Available Metric:
          </p>

          <div className="space-y-3">

            {keywordMetrics.map((metric) => (
              <div key={metric} className="flex items-center gap-3 text-gray-700">

                <FontAwesomeIcon
                  icon={faCheck}
                  className="text-green-500 text-sm"
                />

                {metric}

              </div>
            ))}

          </div>

        </div>

      </div>

    </div>
  );
}
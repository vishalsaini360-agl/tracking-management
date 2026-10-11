import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import moment from "moment";
import ReactECharts from "echarts-for-react";
import "react-tabs/style/react-tabs.css";
import Loader from "./Loader";
import { useEbuxContext } from "../Context/EbuxProvider";
import { fetchCompetitionPlatformChartData, fetchPlatformChartData, fetchRRCompetitionPlatformChartData, fetchSOMCompetitionPlatformChartData } from "../services/platformChart.services";
import { isEqual } from "lodash";

import { MdOutlineDragIndicator } from "react-icons/md";
import AlertDailog from "./Popups/AlertDailog";
import CompetitionDailog from "./Popups/CompetitionDailog";
import { getEbuxCompetitionBrandsWithPlatform } from "../services/ebux.service";
import { trackDashboardClick } from "../../../analytics/EventController";
import { ENTITY_TYPE, EVENTS, moduleMap, Page_Data, Tab_TYPE, trackCustomEvent, TRACKING_COMPONENT, Widget_TYPE } from "../../../tracker";

const PlatformChartComponent = React.memo(({ is_brand = true, listeners, attributes }) => {
  const {
    sortPlatforms,
    uniqueColorsMap,
    filtersLoading,
    kpi,
    platformColor,
    percentageIcon,
    defaultOption,
    // selectedPlatform,
    selectedFilters,
    // setSelectedFilters,
    filters,
    activeClientProject
  } = useEbuxContext();


  // const enabledKPIs = (kpi=="SOS"&&activeClientProject?.client_project_id == 4)? false : activeClientProject.competition || false;
  const enabledKPIs = activeClientProject.competition || false;

  const chartRef = useRef(null);
  const [competitionBrand, setCompetitionBrand] = useState([]);
  const [activeCompetitionBrand, setActiveCompetitionBrand] = useState([]);
  const [competitionReportTableData, setCompetitionReportTableData] = useState([]);

  const [seriesVisibility, setSeriesVisibility] = useState({});
  const [activeSeries, setActiveSeries] = useState("");
  const [optionGraph, setOptionGraph] = useState(defaultOption);
  const [open, setOpen] = useState(true);
  const [selectedOption, setSelectedOption] = useState("day");


  const [loadingReport, setLoadingReport] = useState(false);


  const [reportTableData, setReportTableData] = useState([]);
  const [perviousReportTableData, setPerviousReportTableData] = useState([]);

  const previousSelectedFilters = useRef({});

  const previousSelectedOption = useRef({});
  const [competitionDailogObj, setCompetitionDailogObj] = useState({
    show: false,
    data: { brand_id: undefined, brand_name: undefined },
  });
  const [alertDailogObj, setAlertDailogObj] = useState({
    show: false,
    data: {},
  });
  const previousSelectedBrandForCompetition = useRef(undefined);
  const previousSelectedBrand_name_ForCompetition = useRef(undefined);
  const [loadingBrandForCompetition, setLoadingBrandForCompetition] = useState(false);

  const [tooltipData, setTooltipData] = useState(null);
  const tooltipRef = useRef(null);
  const [disableWeekly, setDisableWeekly] = useState(false);
  const [disableMonthly, setDisableMonthly] = useState(false);





  useEffect(() => {
    if (!selectedFilters?.selectedDateRange?.startDate || !selectedFilters?.selectedDateRange?.endDate) return;

    const startDate = new Date(selectedFilters?.selectedDateRange.startDate);
    const endDate = new Date(selectedFilters?.selectedDateRange.endDate);

    const diffInDays = (endDate - startDate) / (1000 * 3600 * 24) + 1;


    if (diffInDays < 7) {
      setDisableWeekly(true);
      setDisableMonthly(true);
      setSelectedOption("day");

    } else if (diffInDays < 30) {
      setDisableWeekly(false);
      setDisableMonthly(true);
      if (selectedOption === "month") {
        setSelectedOption("day");
      }
    } else {
      setDisableWeekly(false);
      setDisableMonthly(false);
    }


  }, [selectedFilters?.selectedDateRange]);


  // Create a mapping from original names to desired order keys




  const renderSVGMarker = (markerType, color) => {
    const size = 10; // Size of the SVG
    switch (markerType) {
      case "square":
        return `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg" style="margin-right: 6px;">
                  <rect width="${size}" height="${size}" fill="${color}" />
                </svg>`;
      case "triangle":
        return `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg" style="margin-right: 6px;">
                  <polygon points="${size / 2},0 ${size},${size} 0,${size}" fill="${color}" />
                </svg>`;
      case "diamond":
        return `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg" style="margin-right: 6px;">
                  <polygon points="${size / 2},0 ${size},${size / 2} ${size / 2},${size} 0,${size / 2}" fill="${color}" />
                </svg>`;
      default:
        return `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg" style="margin-right: 6px;">
                  <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="${color}" />
                </svg>`;
    }
  };
  const myFormatter = (params) => {

    // const { uniqueDURATION: previousUniqueDURATION } = perviousMemoizedOption;
    // console.log({previousUniqueDURATION});

    let curent = "";
    let curentData = "";
    let competitionData = {};
    let previous = "";
    let previousData = "";

    let parts = [];
    let value = '';
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    params.forEach((item) => {
      if (item.seriesName.includes("Competition")) {
        const dynamicColor = item.color;
        const dottedCircle = `
          <svg width="12" height="12" style="margin-right: 6px;">
            <circle cx="7" cy="7" r="5" fill="none" stroke="${dynamicColor}" stroke-width="1.5" stroke-dasharray="3,2"></circle>
          </svg>
        `;
        const brand_name = (item.seriesName?.split(':|:')?.[0] ?? "-");
        const pf = (item.seriesName?.split(':|:')?.[1]?.replace("Competition ", "") ?? "-");
        if (!competitionData?.[brand_name]) {
          competitionData[brand_name] = {};
        }
        competitionData[brand_name][pf] = `<div style="display:flex;align-items: center;">${dottedCircle} ${pf} : ${item.data.value > -1 ? item.data.value : "-"} ${item.data.value > -1 ? percentageIcon : ""}</div>`;

      } else if (item.seriesName.includes("Previous")) {
        const dynamicColor = item.color;
        const dottedCircle = `
          <svg width="12" height="12" style="margin-right: 6px;">
            <circle cx="7" cy="7" r="5" fill="none" stroke="${dynamicColor}" stroke-width="1.5" stroke-dasharray="3,2"></circle>
          </svg>
        `;
        value = item?.data?.name ?? item?.axisValue;
        parts = value.split('-');

        previous = `<div style="margin-top:8px">Previous (${parts[2]}-${monthNames[parseInt(parts[1], 10) - 1]}-${parts[0]?.toString()?.slice(-2)})</div>`;
        previousData += `<div style="display:flex;align-items: center;margin-bottom: 5px;">${dottedCircle} ${item.seriesName.replace("Previous ", "")}: ${item?.data?.value > -1 ? item?.data?.value : "-"} ${item?.data?.value > -1 ? percentageIcon : ""}</div>`
      } else {
        value = item?.data?.name ?? item?.axisValue;
        parts = value.split('-');
        const my_marker = renderSVGMarker(item?.marker, item?.color);
        // console.log({my_marker});

        curent = `${parts[2]}-${monthNames[parseInt(parts[1], 10) - 1]}-${parts[0]?.toString()?.slice(-2)}`;
        curentData += `<div style="display:flex;align-items: center;margin-bottom: 5px;">${my_marker} ${item?.seriesName}: ${item?.data?.value > -1 ? item?.data?.value : "-"} ${item?.data?.value > -1 ? percentageIcon : ""}</div>`;
      }
    });
    if (Object.keys(competitionData)?.length) {
      curentData = `${previousSelectedBrand_name_ForCompetition?.current ?? selectedFilters?.selectedBrand?.[0]?.label ?? ""} - Brand<br/>${curentData}`
      Object.keys(competitionData)?.forEach((competition) => {
        curentData += `${competition} - Competition<br/><div style="margin-bottom: 5px;">`;
        Object.values(competitionData?.[competition])?.forEach((pf) => {
          curentData += pf;
        });
        curentData += "</div>";
      })
    }




    // return curent + `<div style="width: 100%; height: 100px; overflow: scroll;">${curentData}</div>` + previous + previousData;
    // console.log(curent,"here the cheking current data");

    return `${previous != "" ? `Current (${curent})` : curent}<br/>` + curentData + previous + previousData;
  }
  const activePlatform = [
    ...(selectedFilters?.selectedPlatform ?? []),
    // {
    //   value: 1,
    //   label: "Zepto"
    // },
    // {
    //   value: 3,
    //   label: "Flipkart"

    // },
    // {
    //   value: 4,
    //   label: "Blinkit"

    // }
  ];

  const handleCompetitionDailogClose = (localCompetitionBrand) => {
    trackCustomEvent(EVENTS.POPUP_CLOSE, {}, ENTITY_TYPE.Graphical_Analysis, {
      module: moduleMap.dashboard,
      ...(Page_Data?.[kpi] ?? {}),
      tab: Tab_TYPE.executive_summary,
      component_type: ENTITY_TYPE.Competition_POPUP,
      widget_name: Widget_TYPE.Graphical_Analysis
    })
    setCompetitionBrand(localCompetitionBrand)
    setCompetitionDailogObj({ show: false, data: {} })
    const activeBrand = (localCompetitionBrand?.filter((item) => item?.selected_platform?.length ? { ...item } : false)) ?? [];
    setActiveCompetitionBrand([...activeBrand]);
  };
  const handleCompetitionDailogRest = () => {
    setCompetitionDailogObj({ show: false, data: {} })
    setCompetitionBrand((previousData) => {
      const updatedData = previousData.map((data) => {
        return {
          ...data,
          status: false,
          selected_platform: [],
        };
      });
      return updatedData;
    })
    setActiveCompetitionBrand([]);
  };
  const loadCompetitionBrand = async (brand_id, brand_name, mother_brand_id, sub_brand_id) => {
    setLoadingBrandForCompetition(true);
    if (previousSelectedBrandForCompetition.current != brand_id) {
      previousSelectedBrandForCompetition.current = brand_id;
      previousSelectedBrand_name_ForCompetition.current = brand_name;

      const currentData = await getEbuxCompetitionBrandsWithPlatform(kpi, brand_id, mother_brand_id, sub_brand_id, (activePlatform?.map(i => i.value) ?? []), selectedFilters);
      setCompetitionBrand(currentData);
    }
    setCompetitionDailogObj((previousData) => ({ ...previousData, show: true, data: { brand_id: selectedFilters?.selectedBrand?.[0]?.value, brand_name: selectedFilters?.selectedBrand?.[0]?.label } }))

    setLoadingBrandForCompetition(false);
  }
  const handleCompetitionClick = () => {
    let message_data = { show: false, data: {} };
    //  console.log('selectedFilters?.selectedBrand',selectedFilters?.selectedBrand)
    trackCustomEvent(EVENTS.CLICK, {}, ENTITY_TYPE.Graphical_Analysis, {
      module: moduleMap.dashboard,
      ...(Page_Data?.[kpi] ?? {}),
      tab: Tab_TYPE.executive_summary,
      component_type: ENTITY_TYPE.Competition_POPUP,
      widget_name: Widget_TYPE.Graphical_Analysis
    })
    if (selectedFilters?.selectedBrand?.length == 1) {

      trackCustomEvent(EVENTS.POPUP_OPEN, {}, ENTITY_TYPE.Graphical_Analysis, {
        module: moduleMap.dashboard,
        ...(Page_Data?.[kpi] ?? {}),
        tab: Tab_TYPE.executive_summary,
        component_type: ENTITY_TYPE.Competition_POPUP,
        widget_name: Widget_TYPE.Graphical_Analysis
      })
      loadCompetitionBrand(selectedFilters?.selectedBrand?.[0]?.value, selectedFilters?.selectedBrand?.[0]?.label, selectedFilters?.selectedBrand?.[0]?.mother_brand_id, selectedFilters?.selectedBrand?.[0]?.sub_brand_id);
    } else {
      message_data = {
        show: true,
        data: {
          heading: "Alert!",
          text: ((selectedFilters?.selectedBrand?.length > 1) ? "Please Select Only One Brand to Analyze its Competition." : "Please Select a Brand to Analyze its Competition.")
        }
      };
      setCompetitionDailogObj((previousData) => ({ ...previousData, show: false, data: {} }));
    }
    setAlertDailogObj((previousData) => ({ ...previousData, ...message_data }));
  };

  useEffect(() => {
    async function fetchData() {
      setLoadingReport(true);
      let currentData = []
      if (!is_brand && kpi == "RR") {
        currentData = await fetchRRCompetitionPlatformChartData(kpi, filters, selectedFilters, selectedFilters.selectedPlatform, selectedOption, false);

      } else if (!is_brand && kpi == "SOM") {
        currentData = await fetchSOMCompetitionPlatformChartData(kpi, filters, selectedFilters, selectedFilters.selectedPlatform, selectedOption, false);

      } else {
        currentData = await fetchPlatformChartData(kpi, filters, selectedFilters, selectedFilters.selectedPlatform, selectedOption, false);

      }

      let previousData = [];
      if ((selectedFilters?.[selectedFilters?.calendarType == "week" ? "selectedWeeks" : "selectedDateRange"]?.isCompareToPrevious) && (!(selectedFilters?.selectedBrand?.length == 1 && activeCompetitionBrand?.length))) {
        if (!is_brand && kpi == "RR") {

          previousData = await fetchRRCompetitionPlatformChartData(kpi, filters, selectedFilters, selectedFilters.selectedPlatform, selectedOption, true);

        } else if (!is_brand && kpi == "SOM") {

          previousData = await fetchSOMCompetitionPlatformChartData(kpi, filters, selectedFilters, selectedFilters.selectedPlatform, selectedOption, true);

        } else {
          previousData = await fetchPlatformChartData(kpi, filters, selectedFilters, selectedFilters.selectedPlatform, selectedOption, true);
        }

      }


      setReportTableData(currentData);
      setPerviousReportTableData(previousData);

      setLoadingReport(false);
    }
    if (!filtersLoading && (!isEqual(previousSelectedFilters.current, JSON.stringify({ ...selectedFilters })) || !isEqual(previousSelectedOption.current, JSON.stringify({ ...selectedOption })))) {
      previousSelectedFilters.current = JSON.stringify({ ...selectedFilters });
      previousSelectedOption.current = JSON.stringify({ ...selectedOption });
      fetchData();
      if (competitionDailogObj.show && selectedFilters?.selectedBrand?.length != 1) {
        setCompetitionDailogObj((previousData) => ({ ...previousData, show: false, data: {} }));
        setAlertDailogObj((previousData) => ({ ...previousData, show: true, data: { heading: "Alert!", text: "Please Select Brand to Analyze its Competition." } }))
      }
    }
  }, [filtersLoading, selectedFilters, selectedOption]);

  useEffect(() => {
    async function fetchData() {
      // setLoadingReport(true);
      if (activeCompetitionBrand?.length && (selectedFilters?.selectedBrand?.length == 1)) {
        const currentData = await fetchCompetitionPlatformChartData(kpi, filters, selectedFilters, selectedOption, activeCompetitionBrand);
        setCompetitionReportTableData(currentData);
        if (selectedFilters?.[selectedFilters?.calendarType == "week" ? "selectedWeeks" : "selectedDateRange"]?.isCompareToPrevious) {
          setPerviousReportTableData([]);
        }
      } else {
        setCompetitionBrand((previousData) => {
          const updatedData = previousData.map((data) => {
            return {
              ...data,
              status: false,
              selected_platform: [],
            };
          });
          return updatedData;
        })
        setActiveCompetitionBrand([]);
        setCompetitionReportTableData([]);
        if (selectedFilters?.[selectedFilters?.calendarType == "week" ? "selectedWeeks" : "selectedDateRange"]?.isCompareToPrevious) {
          let previousData = []

          if (!is_brand && kpi == "RR") {
            previousData = await fetchRRCompetitionPlatformChartData(kpi, filters, selectedFilters, selectedFilters.selectedPlatform, selectedOption, true);

          } else if (!is_brand && kpi == "SOM") {
            previousData = await fetchSOMCompetitionPlatformChartData(kpi, filters, selectedFilters, selectedFilters.selectedPlatform, selectedOption, true);

          } else {
            previousData = await fetchPlatformChartData(kpi, filters, selectedFilters, selectedFilters.selectedPlatform, selectedOption, true);

          }
          setPerviousReportTableData(previousData);
        }
      }
      // setLoadingReport(false);
    }
    fetchData();

  }, [JSON.stringify(activeCompetitionBrand), selectedFilters, selectedOption]);



  const getMemoizedOption = (data, is_seriesVisibility = false) => {
    if (data?.length) {
      // eslint-disable-next-line no-console
      // console.log({ data });


      let groupedData = {};
      const _uniqueDURATION = [];
      if (data?.length) {
        data?.forEach(data => {
          _uniqueDURATION.push(data?.date);
          Object.keys(data)?.forEach(key => {
            if (key != 'date' && key != 'avg') {
              if (!groupedData[key]) {
                groupedData[key] = {}
              }
              groupedData[key][data?.date] = data?.[key]?.output;

            }
          })
        });
      }

      const uniqueXAXIS = Object.keys(groupedData);
      if (is_seriesVisibility) {

        const _seriesVisibility = uniqueXAXIS?.reduce((acc, item) => {
          acc[item] = true;
          return acc;
        }, {});
        if (activeClientProject?.client_project_id == 2) {
          (Object.keys(_seriesVisibility))?.sort((a, b) => {
            return sortPlatforms?.indexOf(a) - sortPlatforms.indexOf(b);
          })?.forEach((series, idx) => { if (idx > 2) { _seriesVisibility[series] = false; } })

        }
        setSeriesVisibility(_seriesVisibility);
      }
      return { uniqueDURATION: [...new Set(_uniqueDURATION)], groupedData, uniqueXAXIS };
    } else {
      return { uniqueDURATION: [], groupedData: {}, uniqueXAXIS: [] };
    }
  }

  const memoizedOption = useMemo(() => {
    return getMemoizedOption(reportTableData, true);
  }, [reportTableData]);

  const perviousMemoizedOption = useMemo(() => {
    return getMemoizedOption(perviousReportTableData);
    // console.log({data});

    // return data;
  }, [perviousReportTableData]);

  const competitionMemoizedOption = useMemo(() => {
    const data = [];
    competitionReportTableData?.forEach((item) => {
      if (Array.isArray(item?.ChartData) && item?.ChartData?.length) {
        const firstData = {};
        Object.keys(item.ChartData[0])?.forEach(key => {
          if (key != 'date') {
            firstData[key] = {};
          }
        });
        const { uniqueDURATION } = memoizedOption;
        const ChartData = uniqueDURATION.map(date => {
          const dateIndex = item?.ChartData?.find(i => i?.date == date)
          if (dateIndex) {
            return { ...dateIndex };
          } else {
            return { ...firstData, date }
          }
        })


        const _data = getMemoizedOption(ChartData);
        // console.log("competitionReportTableData", { _data });

        data.push({
          value: item?.value ?? "",
          label: item?.label ?? "",
          data: _data
        })
      }
    })
    return data;
  }, [JSON.stringify(competitionReportTableData)]);


  const addSeries = (data, isPervious = false, isCompetition = false, label = false, item_index = 0) => {
    const series = [];
    const { uniqueDURATION, groupedData, uniqueXAXIS } = data;
    if (uniqueDURATION.length > 0) {

      uniqueXAXIS.forEach((item, ii) => {
        if (seriesVisibility?.[item] || item == "Average") {
          let data = Object.values(groupedData?.[item]).map(
            (i, _in) => (i ? { name: uniqueDURATION[_in], value: i ? parseFloat(i) : "" } : "")
          );
          series.push({
            name: `${isCompetition ? `${label ? `${label} :|: ` : ""}Competition ${item}` : isPervious ? `Previous ${item}` : item}`,
            type: "line",
            areaStyle: isPervious ? null : ((isCompetition ? uniqueColorsMap?.[item_index]?.[ii]?.["area"] : platformColor?.[item]?.["area"]) ?? platformColor["Amazon"]["area"]),
            itemStyle: {
              color:
                (isCompetition ? uniqueColorsMap?.[item_index]?.[ii]?.["line"] : platformColor?.[item]?.["line"]) ?? platformColor["Amazon"]["line"], // Set your desired line color here (e.g., blue)
            },
            lineStyle: {
              type: (isPervious || isCompetition) ? 'dotted' : 'solid',
              color:
                (isCompetition ? uniqueColorsMap?.[item_index]?.[ii]?.["line"] : platformColor?.[item]?.["line"]) ?? platformColor["Amazon"]["line"], // Set the line color (you can use the same or different color from itemStyle)
            },
            smooth: true,
            showSymbol: true,
            emphasis: {
              focus: "none",
              showSymbol: true
            },
            data,
          });
        }
        return null;
      });
    }
    return series;
  }
  const memoizedOptionGraph = useMemo(() => {


    const { uniqueDURATION, uniqueXAXIS } = memoizedOption;


    const series = (addSeries(memoizedOption, false, false, false)).sort((a, b) => {
      const indexA = sortPlatforms.indexOf(a?.name);
      const indexB = sortPlatforms.indexOf(b?.name);
      return indexA - indexB;
    });

    //  const series = addSeries(memoizedOption, false, false, false);
    const pseries = addSeries(perviousMemoizedOption, true, false, false);


    const cseries = [];
    competitionMemoizedOption?.map((item, item_index) => {
      cseries.push(...addSeries((item?.data ?? []), false, true, (item?.label ?? ''), item_index))
    })




    if (series.length > 0) {
      return {
        ...defaultOption,
        title: {
          show: false,
          text: `Graphical Analysis`,
          top: 0,
          textStyle: {
            fontSize: 14,
            fontWeight: 'bold',
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        legend: {
          show: false,
          icon: 'circle',
          right: 10,
          data: uniqueXAXIS,
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: uniqueDURATION,
          axisLabel: {
            // interval: 0,
            // rotate: 30,
            formatter: function (value) {
              const parts = value.split('-');
              const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

              if (selectedOption === "week") {
                // Daily or Weekly (e.g., '2024-10-01')
                const date = moment(value);
                const weekOfYear = date.week();
                return `week${weekOfYear}`;
              } else if (selectedOption === "month") {
                // Monthly (e.g., '2024-10')
                return `${monthNames[parseInt(parts[1], 10) - 1]} ${parts[0]}`;
              }
              // return monthNames[parseInt(parts[1], 10) - 1];
              return `${parts[2]}-${monthNames[parseInt(parts[1], 10) - 1]}-${parts[0]?.toString()?.slice(-2)}`; // e.g., 'Oct 01'
            },
            align: 'center',
            padding: [0, 0, 0, 0]
          },
        },
        yAxis: [
          {
            type: "value",
            axisLabel: {
              formatter: `{value}${percentageIcon}`,
            },
            splitLine: {
              show: false,
            },
            alignTicks: false
          },
        ],
        tooltip: {
          show: false,
          trigger: "axis",
          backgroundColor: "#030229",
          textStyle: {
            color: "#fff",
          },

          formatter: (params) => myFormatter(params),
          extraCssText: "width: 200px; white-space: normal;",
          borderColor: "#030229",
          borderWidth: 1,
          shadowBlur: 10,
          shadowOffsetX: 3,
          shadowOffsetY: 3,
          shadowColor: "rgba(0, 0, 0, 0.3)",
        },
        series: [...series, ...pseries, ...cseries]
      };
    }
    return defaultOption;
  }, [memoizedOption, perviousMemoizedOption, JSON.stringify(competitionMemoizedOption), seriesVisibility]);
  useEffect(() => {
    setOptionGraph(memoizedOptionGraph);
  }, [memoizedOptionGraph]);


  const handleToggleSeries = (seriesKey) => {
    trackCustomEvent(EVENTS.TOGGLE_BUTTON, { item: seriesKey }, ENTITY_TYPE.Graphical_Analysis, {
      module: moduleMap.dashboard,
      ...(Page_Data?.[kpi] ?? {}),
      tab: Tab_TYPE.executive_summary,
      component_type: ENTITY_TYPE.GRAPH,
      widget_name: Widget_TYPE.Graphical_Analysis
    })
    if (activeClientProject?.client_project_id == 2) {
      setSeriesVisibility((prevState) => {
        const updated = Object.fromEntries(
          Object.entries(prevState).map(([key, value]) =>
            key === seriesKey ? [key, !value] : [key, value]
          )
        );

        if (!Object.values(updated).some(Boolean)) {
          updated[seriesKey] = true;
        }

        return updated;
      });

    } else {
      if (activeSeries == seriesKey) {
        setActiveSeries("");
        setSeriesVisibility((prevState) =>
          Object.fromEntries(
            Object.entries(prevState).map(([key]) => [key, true])
          )
        );
      } else {
        setActiveSeries(seriesKey);
        setSeriesVisibility((prevState) =>
          Object.fromEntries(
            Object.entries(prevState).map(([key]) =>
              key == seriesKey ? [key, true] : [key, false]
            )
          )
        );
      }

    }
  };
  const downloadImage = () => {
    const echartsInstance = chartRef.current.getEchartsInstance();
    echartsInstance.setOption({
      legend: {
        show: true,
      },
    });
    const imgData = echartsInstance.getDataURL({
      type: "png", // You can also set this to 'jpeg'
      pixelRatio: 2,
      backgroundColor: "#fff",
    });

    // Create a temporary link element to trigger the download
    const link = document.createElement("a");
    link.href = imgData;
    link.download = "chart-image.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    echartsInstance.setOption({
      legend: {
        show: false,
      },
    });
  };

  // const chartRef = useRef(null);
  const resizeAnimationFrameRef = useRef(null);

  useEffect(() => {
    const chartInstance = chartRef?.current?.getEchartsInstance();

    const handleResize = () => {
      // Cancel the previous animation frame if there’s one
      if (resizeAnimationFrameRef.current) {
        cancelAnimationFrame(resizeAnimationFrameRef.current);
      }

      // Use requestAnimationFrame to make resizing smoother
      resizeAnimationFrameRef.current = requestAnimationFrame(() => {
        chartInstance.resize();
      });
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(chartRef.current.getEchartsInstance().getDom());

    return () => {
      resizeObserver.disconnect();
      if (resizeAnimationFrameRef.current) {
        cancelAnimationFrame(resizeAnimationFrameRef.current);
      }
    };
  }, []);

  const handleClickOutside = (event) => {
    if (tooltipRef.current && !tooltipRef.current.contains(event.target)) {
      setTooltipData(null); // Close tooltip if clicked outside
    }
  };
  useEffect(() => {
    if (tooltipData) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [tooltipData]);
  const handleChartClick = (params) => {

    if (params.componentType === "series" && chartRef?.current) {

      // console.log("Data Point Clicked:", params);
      const { dataIndex, event } = params;
      const chart = chartRef?.current?.getEchartsInstance();
      const currentOption = chart?.getOption();
      const allSeriesData = myFormatter(currentOption?.series?.map((series) => {

        return {
          marker: series.symbol,
          dataIndex: dataIndex,
          axisValue: params?.name,
          color: series?.itemStyle?.color,
          seriesName: series.name,
          data: series.data[dataIndex],
        }
      }) ?? []);



      const tooltipX = event.offsetX;
      const tooltipY = event.offsetY - 3;//event.offsetY;

      const chartWidth = chart.getWidth();
      const chartHeight = chart.getHeight()

      const tooltipWidth = 250;
      const tooltipHeight = chartHeight;
      const adjustedX =
        ((tooltipX + 20) + tooltipWidth) > chartWidth
          ? tooltipX - (tooltipWidth)
          : tooltipX + 20;

      // const adjustedY =
      //   tooltipY + tooltipHeight > chartHeight
      //     ? chartHeight - 2
      //     : tooltipY + 2;

      setTooltipData({ data: allSeriesData, position: { x: adjustedX, y: tooltipY }, tooltipWidth, tooltipHeight });
    }
  };

  const handleChartReady = (chart) => {
    chart.on("click", handleChartClick);
  };
  useEffect(() => {
    if (tooltipData) {
      trackCustomEvent(
        EVENTS.CLICK,
        {},
        ENTITY_TYPE.Graphical_Analysis,
        {
          module: moduleMap.dashboard,
          ...(Page_Data?.[kpi] ?? {}),
          tab: Tab_TYPE.executive_summary,
          component_type: ENTITY_TYPE.GRAPH,
          widget_name: Widget_TYPE.Graphical_Analysis
        }
      );
    }
  }, [tooltipData])


  const handleBackgroundClick = (event) => {
    if (event.target.classList.contains("modal-overlay")) {
      setTooltipData(null);
    }
  };
  return (
    <div className="graphicalSection !mb-0 !rounded-2xl shadow-[0px_2px_4px_0px_#00000005,0px_1px_6px_-1px_#00000005,0px_1px_2px_0px_#00000008]">
      <Loader show={loadingReport} />
      <div className="sectionIconHead">
        <div className="flex gap-2 items-center">
          <MdOutlineDragIndicator
            {...listeners}
            {...attributes}
          />
          <div className="sectionIcon">
            <img
              src="/assets/images/graphicalAnalysis.svg"
              width={14}
              height={14}
            />
          </div>
          {/* <h4>{
            (kpi=="SOM" && is_brand==false)? "Competition Graphical Analysis" : "Graphical Analysis"
          }</h4> */}

          {/* <h4>{
            (kpi == "SOM" && is_brand == false) ? "Competition " : (kpi == "SOM" && is_brand == true) ? `${activeClientProject?.client_project_name} ` : ""
          }Graphical Analysis</h4> */}
          <h4 className="chart-title flex items-center gap-2">
            {
              (kpi == "SOM" && is_brand == false) ? "Competition " : (kpi == "SOM" && is_brand == true) ? `${activeClientProject?.client_project_name} ` : ""
            }Graphical Analysis
            {loadingReport && <Loader show={loadingReport} fullScreen={false} />}
          </h4>
        </div>
        <button
          type="button"
          onClick={() => {
            const nextOpen = !open;
            const chartTitle = `${(kpi == "SOM" && is_brand == false) ? "Competition " : (kpi == "SOM" && is_brand == true) ? `${activeClientProject?.client_project_name} ` : (!is_brand) ? "Competition " : ""}Graphical Analysis`;
            trackCustomEvent(
              nextOpen ? EVENTS.EXPAND : EVENTS.COLLAPSE,
              {
                action: nextOpen ? "expand" : "collapse",
                item: chartTitle.trim(),
              },
              is_brand ? ENTITY_TYPE.Graphical_Analysis : (ENTITY_TYPE.Competition_Graphical_Analysis || "Competition Graphical Analysis"),
              {
                module: moduleMap.dashboard,
                ...(Page_Data?.[kpi] ?? {}),
                tab: Tab_TYPE.executive_summary,
                component_type: TRACKING_COMPONENT.BUTTON,
                widget_name: is_brand ? Widget_TYPE.Graphical_Analysis : (ENTITY_TYPE.Competition_Graphical_Analysis || "Competition Graphical Analysis"),
              }
            );
            setOpen(nextOpen);
          }}
          className={`graphIconBtn ${open ? 'arrowRotate' : ''}`}
        >
          <img src="/assets/images/toggleDown.svg" width={20} height={20} />
        </button>
      </div>
      {open && (
        <div className="p-4 w-full">
          <div className="graphHeadWrap">
            <div className="graphHeadLeft">
              <div className="relative">
                <select name="graph" id="graph" value={selectedOption} onChange={(e) => {
                  trackCustomEvent(EVENTS.DROPDOWN_SELECT, { item: e.target.options[e.target.selectedIndex].text.toLowerCase() }, ENTITY_TYPE.GRAPH_FILTER, {
                    module: moduleMap.dashboard,
                    ...(Page_Data?.[kpi] ?? {}),
                    tab: Tab_TYPE.executive_summary,
                    component_type: TRACKING_COMPONENT.DROPDOWN,
                    widget_name: Widget_TYPE.Graphical_Analysis
                  })
                  trackDashboardClick({ section: 'graphical analysis', eventcategory: 'ds e-genie graphical analysis filter', eventaction: 'click', eventlabel: e.target.options[e.target.selectedIndex].text.toLowerCase() })
                  setSelectedOption(e.target.value)
                }} className="appearance-none pr-8 selectBox w-[100px]">
                  <option value="" disabled>
                    Adjust
                  </option>
                  <option value="day" >Daily</option>
                  <option value="week" disabled={disableWeekly}>Weekly</option>
                  <option value="month" disabled={disableMonthly}>Monthly</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                  <svg
                    className="w-4 h-4 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="graphHeadRightWrap">
              <div className="graphHeadRight">
                <div className="graphLegend ">
                  <div className="analysisStats">
                    {(Object.keys(seriesVisibility))?.sort((a, b) => {
                      return sortPlatforms?.indexOf(a) - sortPlatforms.indexOf(b);
                    })?.map((i) => (
                      <button
                        type="button"
                        key={i}
                        onClick={() => handleToggleSeries(i)}
                        className={`legendBtn ${seriesVisibility[i] ? "" : "opacity-40"
                          }`}
                      >
                        <span
                          className="platformCircle"
                          style={{
                            backgroundColor: `${platformColor[i]?.line ?? "#FF9901"
                              }`,
                          }}
                        ></span>{" "}
                        {i}
                      </button>
                    ))}
                  </div>
                  {["OSA", "SOS", "PRO", "Wt_SOS"].includes(kpi) ? (
                    <>
                      <button
                        type="button"
                        className={`competitionBtn ${!enabledKPIs ? 'customreportdisabled__btn cursor-not-allowed' : 'applyBtn'}`}
                        onClick={() => handleCompetitionClick()}
                        disabled={!enabledKPIs}
                      >
                        Competition
                      </button>
                    </>) : ""}
                </div>
                <div className="graphIconBtnWrap">
                  <button
                    type="button"
                    onClick={(e) => {
                      trackCustomEvent(EVENTS.DOWNLOAD, {}, ENTITY_TYPE.Graphical_Analysis, {
                        module: moduleMap.dashboard,
                        ...(Page_Data?.[kpi] ?? {}),
                        tab: Tab_TYPE.executive_summary,
                        component_type: ENTITY_TYPE.GRAPH,
                        widget_name: Widget_TYPE.Graphical_Analysis
                      })
                      trackDashboardClick({ section: 'graphical analysis', eventcategory: 'ds e-genie graphical analysis', eventaction: e.type })

                      downloadImage()
                    }}
                    className="graphIconBtn"
                  >
                    <img
                      src="/assets/images/downloadIcon.svg"
                      width={22}
                      height={22}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <ReactECharts
            ref={chartRef}
            //   option={graphOption}
            notMerge={true}
            lazyUpdate={true}
            option={optionGraph}
            style={{ height: "300px", width: "100%" }}
            onChartReady={handleChartReady}
          />
          {
            // JSON.stringify(selectedFilters?.selectedBrand)
            // JSON.stringify(tooltipData)
          }
          {tooltipData && (
            <div
              ref={tooltipRef}
              // className="modal-overlay w-full h-full  absolute top-0 z-[500] flex justify-center items-center"
              onClick={handleBackgroundClick}
            >
              <div
                style={{
                  position: "absolute",
                  left: tooltipData?.position.x,
                  top: tooltipData?.position.y,
                  backgroundColor: "#030229",
                  border: "1px solid #030229",
                  color: "#fff",
                  borderRadius: "4px",
                  padding: "10px",
                  zIndex: 10,
                  maxHeight: `${tooltipData?.tooltipHeight}px`,
                  maxWidth: `${tooltipData?.tooltipWidth}px`,
                  width: `${tooltipData?.tooltipWidth}px`,
                  overflow: "auto",
                }}
                dangerouslySetInnerHTML={{ __html: `${tooltipData?.data ?? ""}` }}
              >

              </div>
            </div>
          )}
        </div>
      )}
      {alertDailogObj?.show && alertDailogObj?.data?.heading ? (
        <AlertDailog
          heading={alertDailogObj?.data?.heading ?? ""}
          text={alertDailogObj?.data?.text ?? ""}
          handleClose={() =>
            setAlertDailogObj({
              show: false,
              data: {},
            })
          }
        />
      ) : ""}
      {competitionDailogObj?.show && (competitionDailogObj?.data?.brand_id && competitionDailogObj?.data?.brand_name) ? (
        <CompetitionDailog
          data={competitionDailogObj?.data ?? {}}
          // setCompetitionBrand={setCompetitionBrand}
          handleClose={(localCompetitionBrand) => handleCompetitionDailogClose(localCompetitionBrand)}
          handleRest={() => handleCompetitionDailogRest()}
          loading={loadingBrandForCompetition}
          activePlatform={[
            ...(((selectedFilters?.selectedPlatform ?? [])?.length > 1) ? [{
              value: 0,
              label: "Average"
            }] : []), ...activePlatform]}
          competitionBrand={competitionBrand}
        />
      ) : ""}
    </div>

  );
});
PlatformChartComponent.displayName = "PlatformChartComponent";
export default PlatformChartComponent;

import React, { useState, useMemo, useEffect, useRef } from "react";
import { fetchPreviewData } from "../services/service";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faSort, faSortUp, faSortDown } from "@fortawesome/free-solid-svg-icons";
import { useEbuxContext } from "../../../Context/EbuxProvider";
import CustomizeCampiagnModal from "../../CustomizeCampiangn";
import { CiFilter } from "react-icons/ci";
import { EVENTS, TRACKING_COMPONENT, trackCustomEvent } from "../../../../../tracker";


export default function PreviewComponent({ alertControlObj, setAlertControlObj, trackerContext }) {

  const { filters, clientCustomizeColumnsComprehensiveBreakdown, activeClientProject } = useEbuxContext();
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState([]); // Array of arrays (one per condition group)
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [customizeInfo, setCustomizeInfo] = useState({ isOpen: false, column: null });
  const [tabColumnList, setTabColumnList] = useState({});
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const ROW_HEIGHT = 57;
  const OVERSCAN = 8;

  const [scrollTop, setScrollTop] = useState(0);
  const tableContainerRef = useRef(null);
  const initCustomizeColumns = useMemo(() => {
    if (!clientCustomizeColumnsComprehensiveBreakdown?.breakdown) return {};

    const breakdownCols = clientCustomizeColumnsComprehensiveBreakdown.breakdown.columns || [];
    const dsCols = clientCustomizeColumnsComprehensiveBreakdown.ds?.columns || [];

    const filteredBreakdownCols = breakdownCols.filter(col => {
      if (col.value?.startsWith("competition_")) return false;
      if (alertControlObj.metricType === "Keyword" && (
        col.value === "sub_category" || col.key === "sub_category" ||
        col.value === "sos_type" || col.key === "sos_type"
      )) return false;
      return true;
    });
    const filteredDsCols = dsCols.filter(col =>
      !col.value?.startsWith("competition_") &&
      col.value !== "last_in_stock" &&
      col.key !== "last_in_stock" &&
      col.value !== "nd_osa" &&
      col.key !== "nd_osa"
    );

    return {
      breakdowns: {
        title: "Breakdowns",
        columns: filteredBreakdownCols
      },
      ds: {
        title: clientCustomizeColumnsComprehensiveBreakdown.ds?.title || "Matrices",
        columns: filteredDsCols
      }
    };
  }, [clientCustomizeColumnsComprehensiveBreakdown]);

  // console.log('initCustomizeColumnsinitCustomizeColumns', initCustomizeColumns)

  const handleRunReview = async (fromUserClick = false) => {
    if (fromUserClick) {
      trackCustomEvent(
        EVENTS.BUTTON_CLICK,
        {
          action: "run_review",
          component: TRACKING_COMPONENT.BUTTON,
        },
        "Preview Component",
        trackerContext
      );
    }
    setLoading(true);
    setShowResults(true);
    setActiveTab(0);
    try {
      // const activeClientProject = JSON.parse(localStorage.getItem("active_client_project") || "{}");
      console.log('activeClientProjectactiveClientProject', activeClientProject)
      const itemsPayload = { ...(alertControlObj.items || {}) };

      const tagProductsWebPids = (itemsPayload.selectedTags || []).flatMap(t => t.tag_details?.map(d => String(d.sku_or_keyword)) || []);
      const tagKeywordsKws = (itemsPayload.selectedTagsKW || []).flatMap(t => t.tag_details?.map(d => String(d.sku_or_keyword)) || []);

      if (tagProductsWebPids.length > 0) {
        const matchingProducts = (filters?.products || []).filter(p => tagProductsWebPids.includes(String(p.web_pid || p.value)));
        const existingIds = new Set((itemsPayload.selectedProductId || []).map(p => String(p.value)));
        const uniqueMatchingProducts = matchingProducts.filter(p => !existingIds.has(String(p.value)));
        itemsPayload.selectedProductId = [...(itemsPayload.selectedProductId || []), ...uniqueMatchingProducts];
      }

      if (tagKeywordsKws.length > 0) {
        const matchingKeywords = (filters?.keyword || []).filter(k => tagKeywordsKws.includes(String(k.keyword_name || k.value || k.label)));
        const existingKws = new Set((itemsPayload.selectedKeyword || []).map(k => String(k.value)));
        const uniqueMatchingKeywords = matchingKeywords.filter(k => !existingKws.has(String(k.value)));
        itemsPayload.selectedKeyword = [...(itemsPayload.selectedKeyword || []), ...uniqueMatchingKeywords];
      }

      let response = await fetchPreviewData({
        ...alertControlObj,
        items: itemsPayload,
        breakdown: tabColumnList["preview"] || [],
        client_project_es_id: activeClientProject?.client_project_es_id
      });
      // Ensure we have an array of arrays (one for each OR group)
      const processedData = Array.isArray(response)
        ? Array.isArray(response[0])
          ? response
          : [response]
        : [];

      // console.log("Processed Preview Data", processedData);
      setResults(processedData);
    } catch (error) {
      console.error("Error fetching preview data:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const getProductName = (productStr) => {
    if (!productStr) return "-";
    return productStr.includes("::") ? productStr.split("::")[1] : productStr;
  };

  const getOSABadge = (osa, isPercentage = false) => {
    const value = parseFloat(osa);
    if (isNaN(value)) return <span className="text-gray-400">-</span>;

    if (value === 0) {
      return (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 border border-red-200">
          0{isPercentage ? '%' : ''}
        </span>
      );
    } else {
      return (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200">
          {value}{isPercentage ? '%' : ''}
        </span>
      );
    }
  };

  // Determine which columns should be visible across all condition groups
  const activeColumns = useMemo(() => {
    // alertControlObj.conditions is an array of groups, each group is an array of AND conditions
    // Collect metrics across all condition groups so both/all condition tables display all configured metrics
    const allConditions = (alertControlObj?.conditions || []).flat();
    const metrics = allConditions.map((c) => c?.metric).filter(Boolean);

    return {
      stock: metrics.includes("Out-of-Stocks Days"),
      osa: metrics.includes("On-Shelf Availability Percentage"),
      promotion: metrics.includes("Promotion Percentage"),
      sellingPrice: metrics.includes("Selling Price"),
      mrp: metrics.includes("Maximum Retail Price"),
      score: metrics.includes("Content Score"),
      imageScore: metrics.includes("Image Score"),
      videoScore: metrics.includes("Video Score"),
      highlightScore: metrics.includes("Highlight Score"),
      bulletinScore: metrics.includes("Bulletin Score"),
      descScore: metrics.includes("Description Score"),
      titleScore: metrics.includes("Title Score"),
      aPlusScore: metrics.includes("A+ Score"),
      ratings: metrics.includes("Product Ratings"),
      reviews: metrics.includes("Review Count"),
      sos: metrics.some((m) => m === "Overall Share of Search"),
      paidSos: metrics.some((m) => m === "Paid Share of Search"),
      organicSos: metrics.some((m) => m === "Organic Share of Search"),
      or: metrics.some((m) => m === "Overall Ranking"),
      paidOr: metrics.some((m) => m === "Paid Ranking"),
      organicOr: metrics.some((m) => m === "Organic Ranking"),
    };
  }, [alertControlObj?.conditions]);

  const getApiEntityValue = (entity) => {
    switch (entity) {
      case "Brands": return "brand";
      case "Keywords": return "keyword";
      case "Category":
      case "Categories": return "category";
      case "Platforms": return "platform";
      case "Locations": return "location";
      case "keywordCategory": return "keyword_category";
      case "Products":
      default: return "sku_name";
    }
  };

  const allApiColumns = useMemo(() => {
    return [
      ...(initCustomizeColumns?.breakdowns?.columns || []),
      ...(initCustomizeColumns?.ds?.columns || [])
    ];
  }, [initCustomizeColumns]);

  const activeColumnsStr = JSON.stringify(activeColumns);

  useEffect(() => {
    if (!tabColumnList["preview"] && allApiColumns.length > 0) {
      const colsObj = JSON.parse(activeColumnsStr);
      // Map API matrix value -> activeColumns key
      const mapping = {
        'price_sp': 'sellingPrice',
        'price_rp': 'mrp',
        'osa': 'osa',
        'sos': 'sos',
        'total_score': 'score',
        'title_score': 'titleScore',
        'desc_score': 'descScore',
        'bulletin_score': 'bulletinScore',
        'image_score': 'imageScore',
        'video_score': 'videoScore',
        'highlight_score': 'highlightScore',
        'a_plus_score': 'aPlusScore',
        'rating_value': 'ratings',
        'review_count': 'reviews',
        'price_variation': 'promotion',
        'paid_sos': 'paidSos',
        'organic_sos': 'organicSos',
        'or': 'or',
        'paid_or': 'paidOr',
        'organic_or': 'organicOr',
        'oos_total': 'stock',
        'last_in_stock': 'stock',
        'oos_consecutive': 'stock',
      };

      if (alertControlObj.breakdown && alertControlObj.breakdown.length > 0) {
        const existingKeys = new Set(alertControlObj.breakdown.map(c => c.value));
        const missingParamCols = allApiColumns.filter(col => {
          if (col.type === "breakdown") return false;
          const activeKey = mapping[col.value] || col.value;
          return colsObj[activeKey] && !existingKeys.has(col.value);
        });

        setTabColumnList({ preview: [...alertControlObj.breakdown, ...missingParamCols] });
        return;
      }

      const defaultParamCols = allApiColumns.filter(col => {
        if (col.type === "breakdown") return false;
        const activeKey = mapping[col.value] || col.value;
        return colsObj[activeKey];
      });

      const entityApiVal = getApiEntityValue(alertControlObj.entity);
      const apiEntityCol = allApiColumns.find(col => col.value === entityApiVal);
      const finalEntityCol = apiEntityCol ? { ...apiEntityCol, remove: false, drag: false } : null;

      const initialCols = finalEntityCol ? [finalEntityCol, ...defaultParamCols] : [...defaultParamCols];

      setTabColumnList({ preview: initialCols });
    }
  }, [allApiColumns, activeColumnsStr, alertControlObj.entity, tabColumnList]);

  const orderedColumns = tabColumnList["preview"] || [];

  useEffect(() => {
    if (setAlertControlObj && orderedColumns.length > 0) {
      setAlertControlObj(prev => ({
        ...prev,
        breakdown: orderedColumns
      }));
    }
  }, [orderedColumns, setAlertControlObj]);

  const previousColumnsRef = useRef(orderedColumns);

  useEffect(() => {
    if (showResults && JSON.stringify(previousColumnsRef.current) !== JSON.stringify(orderedColumns)) {
      handleRunReview();
    }
    previousColumnsRef.current = orderedColumns;
  }, [orderedColumns]);

  const renderCellValue = (item, colValue) => {
    console.log('colValuecolValue', colValue)
    switch (colValue) {
      case 'Products':
      case 'sku_name':
      case 'products':
        return (
          <div className="flex gap-2 font-normal text-[#0F172A] line-clamp-2">
            {alertControlObj.entity === "Products" && item.product_image && (
              <img src={item.product_image} alt="" className="w-[24px] h-[24px] object-contain" />
            )}
            {getProductName(item[colValue] || item.products || item.Products)}
          </div>
        );
      case 'stock': return <span className="text-[#0F172A] font-normal">{item.oos_total ?? item.oos_consecutive ?? "-"}</span>;
      case 'total_score': return <span className="text-[#0F172A] font-normal"> {item.total_score != null ? `${item.total_score}%` : "-"}</span>;
      case 'title_score': return <span className="text-[#0F172A] font-normal">{item.title_score != null ? `${item.title_score}%` : "-"}</span>;
      case 'desc_score': return <span className="text-[#0F172A] font-normal">{item.desc_score != null ? `${item.desc_score}%` : "-"}</span>;
      case 'bulletin_score': return <span className="text-[#0F172A] font-normal">{item.bulletin_score != null ? `${item.bulletin_score}%` : "-"}</span>;
      case 'image_score': return <span className="text-[#0F172A] font-normal">{item.image_score != null ? `${item.image_score}%` : "-"}</span>;
      case 'videoScore': return <span className="text-[#0F172A] font-normal">{item.video_score != null ? `${item.video_score}%` : "-"}</span>;
      case 'highlightScore': return <span className="text-[#0F172A] font-normal">{item.highlight_score != null ? `${item.highlight_score}%` : "-"}</span>;

      case 'video_score': return <span className="text-[#0F172A] font-normal">{item.video_score != null ? `${item.video_score}%` : "-"}</span>;
      case 'highlight_score': return <span className="text-[#0F172A] font-normal">{item.highlight_score != null ? `${item.highlight_score}%` : "-"}</span>;
      case 'aPlusScore': return <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-normal">{item.a_plus_score ?? "-"}</span>;
      case 'ratings': return <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-normal">{item.rating_value ?? "-"}</span>;
      case 'reviews': return <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-normal">{item.review_count ?? "-"}</span>;
      case 'price_sp':
      case 'sellingPrice': return <span className="font-normal text-[#0F172A]">{item.price_sp ? `${activeClientProject?.currency} ${item.price_sp}` : "-"}</span>;
      case 'price_rp':
      case 'mrp': return <span className="font-normal text-[#0F172A]">{item.price_rp ? `${activeClientProject?.currency} ${item.price_rp}` : "-"}</span>;
      case 'price_variation':
      case 'promotion': {
        const val = item.price_variation ?? item.promotion ?? item.promo_val;
        return <span className="font-normal">{val != null && val !== "" ? `${val}%` : "-"}</span>;
      }
      case 'osa':
      case 'OSA': return getOSABadge(item.osa ?? item.OSA, true);
      case 'sos':
      case 'SOS': return getOSABadge(item.sos ?? item.SOS, true);
      case 'paid_sos':
      case 'paidSos': return getOSABadge(item.paid_sos, true);
      case 'organic_sos':
      case 'organicSos': return getOSABadge(item.organic_sos, true);
      case 'or':
      case 'OR': return getOSABadge(item.or ?? item.OR, false);
      case 'paid_or':
      case 'paidOr': return getOSABadge(item.paid_or, false);
      case 'organic_or':
      case 'organicOr': return getOSABadge(item.organic_or, false);
      default: return <span className="text-[#0F172A] font-normal">{item[colValue] ?? "-"}</span>;
    }
  };



  const scopeLabel = useMemo(() => {
    const isKeywordMetrics = ["SOS", "OR"].includes(alertControlObj.kpi);
    const {
      selectedBrand = [],
      selectedCategory = [],
      selectedPlatform = [],
      selectedLocation = [],
      selectedProductId = [],
      selectedKeywordCategory = [],
      selectedKeyword = [],
      selectedTags = [],
      selectedTagsKW = [],
      selected_keyword_type = []
    } = alertControlObj.items || {};

    const parts = [];

    if (isKeywordMetrics) {
      if (selectedKeyword?.length > 0)
        parts.push(`${selectedKeyword.length} Keywords`);
      if (selectedTagsKW?.length > 0)
        parts.push(`${selectedTagsKW.length} Keyword Tags`);
      if (selectedKeywordCategory?.length > 0)
        parts.push(`${selectedKeywordCategory.length} Categories`);
      if (selectedBrand?.length > 0)
        parts.push(`${selectedBrand.length} Brands`);
      if (selectedPlatform?.length > 0)
        parts.push(`${selectedPlatform.length} Platforms`);
      if (selectedLocation?.length > 0)
        parts.push(`${selectedLocation.length} Locations`);
      if (selected_keyword_type?.length > 0)
        parts.push(`${selected_keyword_type.length} Selected Key Type`);
    } else {
      if (selectedProductId?.length > 0)
        parts.push(`${selectedProductId.length} Products`);
      if (selectedTags?.length > 0)
        parts.push(`${selectedTags.length} Product Tags`);
      if (selectedBrand?.length > 0)
        parts.push(`${selectedBrand.length} Brands`);
      if (selectedCategory?.length > 0)
        parts.push(`${selectedCategory.length} Categories`);
      if (selectedPlatform?.length > 0)
        parts.push(`${selectedPlatform.length} Platforms`);
      if (selectedLocation?.length > 0)
        parts.push(`${selectedLocation.length} Locations`);
    }

    return parts.length > 0 ? parts.join(" / ") : "--";
  }, [alertControlObj.kpi, alertControlObj.items]);

  // const currentResults = results[activeTab] || [];
  // const currentResults = activeTab === 0
  // ? 
  // results.flat()
  // .filter(
  //       (item, index, arr) =>
  //         index ===
  //         arr.findIndex(
  //           row => JSON.stringify(row) === JSON.stringify(item)
  //         )
  //     )
  // : results[activeTab - 1] || [];

  const currentResults = useMemo(() => {
    if (activeTab !== 0) {
      return results[activeTab - 1] || [];
    }

    const seen = new Set();

    return results.flat().filter((item) => {
      const key = JSON.stringify(item);

      if (seen.has(key)) {
        return false;
      }

      seen.add(key);
      return true;
    });
  }, [results, activeTab]);


  const getSortableValue = (item, colValue) => {
    let val;
    switch (colValue) {
      case 'stock': val = item.oos_total ?? item.oos_consecutive; break;
      case 'score': val = item.total_score; break;
      case 'titleScore': val = item.title_score; break;
      case 'descScore': val = item.desc_score; break;
      case 'bulletinScore': val = item.bulletin_score; break;
      case 'imageScore': val = item.image_score; break;
      case 'videoScore': val = item.video_score; break;
      case 'highlightScore': val = item.highlight_score; break;
      case 'aPlusScore': val = item.a_plus_score; break;
      case 'ratings': val = item.rating_value; break;
      case 'reviews': val = item.review_count; break;
      case 'price_sp':
      case 'sellingPrice': val = item.price_sp; break;
      case 'price_rp':
      case 'mrp': val = item.price_rp; break;
      case 'price_variation':
      case 'promotion': val = item.price_variation ?? item.promotion ?? item.promo_val; break;
      case 'osa':
      case 'OSA': val = item.osa ?? item.OSA; break;
      case 'sos':
      case 'SOS': val = item.sos ?? item.SOS; break;
      case 'paid_sos':
      case 'paidSos': val = item.paid_sos; break;
      case 'organic_sos':
      case 'organicSos': val = item.organic_sos; break;
      case 'or':
      case 'OR': val = item.or ?? item.OR; break;
      case 'paid_or':
      case 'paidOr': val = item.paid_or; break;
      case 'organic_or':
      case 'organicOr': val = item.organic_or; break;
      case 'Products':
      case 'sku_name':
      case 'products':
        val = item[colValue] || item.products || item.Products;
        if (typeof val === 'object' && val != null) {
          // Fallback if the object contains sku_name or similar (handled by getProductName conceptually)
          val = val.sku_name || val.product_name || val.name || JSON.stringify(val);
        }
        break;
      default: val = item[colValue]; break;
    }

    if (val == null) return "";
    if (typeof val === 'string' && val.endsWith('%')) {
      return Number(val.replace('%', ''));
    }
    return val;
  };

  const sortedResults = useMemo(() => {
    let sortableItems = [...currentResults];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        let aValue = getSortableValue(a, sortConfig.key);
        let bValue = getSortableValue(b, sortConfig.key);

        if (aValue === "" && bValue !== "") return 1;
        if (bValue === "" && aValue !== "") return -1;

        if (!isNaN(aValue) && !isNaN(bValue) && aValue !== "" && bValue !== "") {
          aValue = Number(aValue);
          bValue = Number(bValue);
        } else {
          aValue = String(aValue).toLowerCase();
          bValue = String(bValue).toLowerCase();
        }

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [currentResults, sortConfig]);

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    trackCustomEvent(
      EVENTS.SORT,
      {
        action: "sort_preview_column",
        column: key,
        direction,
        component: TRACKING_COMPONENT.TABLE,
      },
      "Preview Component",
      trackerContext
    );
    setSortConfig({ key, direction });
  };

  const displayColumns = useMemo(() => {
    let cols = [];
    const excludedKeys = new Set([
      'product_image', 'product_url', 'dates', 'dateRange', 'date', 'date_range'
    ]);

    if (orderedColumns && orderedColumns.length > 0) {
      cols = orderedColumns.filter(c => !excludedKeys.has(c.value) && !String(c.value).startsWith('oos_day_'));
    } else if (currentResults && currentResults.length > 0) {
      const keys = Object.keys(currentResults[0]).filter(k => !excludedKeys.has(k) && !String(k).startsWith('oos_day_'));
      cols = keys.map(k => ({
        title: k === 'oos_total' ? 'OOS Total' : k === 'oos_consecutive' ? 'OOS Consecutive' : k.charAt(0).toUpperCase() + k.slice(1).replace(/_/g, ' '),
        value: k
      }));
    }

    // Map active condition metrics to required columns
    const colsObj = activeColumns;
    const requiredMetricCols = [];

    if (colsObj.stock) requiredMetricCols.push({ value: 'oos_total', title: 'OOS Total', type: 'parameters' });
    if (colsObj.sellingPrice) requiredMetricCols.push({ value: 'price_sp', title: 'Selling Price', type: 'parameters' });
    if (colsObj.mrp) requiredMetricCols.push({ value: 'price_rp', title: 'MRP', type: 'parameters' });
    if (colsObj.osa) requiredMetricCols.push({ value: 'osa', title: 'OSA', type: 'parameters' });
    if (colsObj.promotion) requiredMetricCols.push({ value: 'price_variation', title: 'Promotion', type: 'parameters' });
    if (colsObj.score) requiredMetricCols.push({ value: 'total_score', title: 'Content Score', type: 'parameters' });
    if (colsObj.titleScore) requiredMetricCols.push({ value: 'title_score', title: 'Title Score', type: 'parameters' });
    if (colsObj.descScore) requiredMetricCols.push({ value: 'desc_score', title: 'Description Score', type: 'parameters' });
    if (colsObj.bulletinScore) requiredMetricCols.push({ value: 'bulletin_score', title: 'Bulletin Score', type: 'parameters' });
    if (colsObj.imageScore) requiredMetricCols.push({ value: 'image_score', title: 'Image Score', type: 'parameters' });
    if (colsObj.videoScore) requiredMetricCols.push({ value: 'video_score', title: 'Video Score', type: 'parameters' });
    if (colsObj.highlightScore) requiredMetricCols.push({ value: 'highlight_score', title: 'Highlight Score', type: 'parameters' });
    if (colsObj.aPlusScore) requiredMetricCols.push({ value: 'a_plus_score', title: 'A+ Score', type: 'parameters' });
    if (colsObj.ratings) requiredMetricCols.push({ value: 'rating_value', title: 'Ratings', type: 'parameters' });
    if (colsObj.reviews) requiredMetricCols.push({ value: 'review_count', title: 'Reviews', type: 'parameters' });
    if (colsObj.sos) requiredMetricCols.push({ value: 'sos', title: 'SOS', type: 'parameters' });
    if (colsObj.paidSos) requiredMetricCols.push({ value: 'paid_sos', title: 'Paid SOS', type: 'parameters' });
    if (colsObj.organicSos) requiredMetricCols.push({ value: 'organic_sos', title: 'Organic SOS', type: 'parameters' });
    if (colsObj.or) requiredMetricCols.push({ value: 'or', title: 'OR', type: 'parameters' });
    if (colsObj.paidOr) requiredMetricCols.push({ value: 'paid_or', title: 'Paid OR', type: 'parameters' });
    if (colsObj.organicOr) requiredMetricCols.push({ value: 'organic_or', title: 'Organic OR', type: 'parameters' });

    const existingValues = new Set(cols.map(c => c.value));
    requiredMetricCols.forEach(reqCol => {
      const isAlreadyIncluded = existingValues.has(reqCol.value) ||
        (reqCol.value === 'oos_total' && (existingValues.has('stock') || existingValues.has('oos_consecutive') || existingValues.has('oos_total'))) ||
        (reqCol.value === 'price_sp' && (existingValues.has('sellingPrice') || existingValues.has('price_sp'))) ||
        (reqCol.value === 'price_rp' && (existingValues.has('mrp') || existingValues.has('price_rp'))) ||
        (reqCol.value === 'osa' && (existingValues.has('osa') || existingValues.has('OSA'))) ||
        (reqCol.value === 'sos' && (existingValues.has('sos') || existingValues.has('SOS')));

      if (!isAlreadyIncluded) {
        cols.push(reqCol);
        existingValues.add(reqCol.value);
      }
    });

    // Check if Start Date / End Date exists in currentResults[0] and append if not included
    if (currentResults && currentResults.length > 0) {
      const firstItem = currentResults[0];
      const startDateKey = Object.keys(firstItem).find(k => k === 'Start Date' || k === 'start_date');
      if (startDateKey && !existingValues.has(startDateKey)) {
        cols.push({ title: 'Start Date', value: startDateKey });
        existingValues.add(startDateKey);
      }

      const endDateKey = Object.keys(firstItem).find(k => k === 'End Date' || k === 'end_date');
      if (endDateKey && !existingValues.has(endDateKey)) {
        cols.push({ title: 'End Date', value: endDateKey });
        existingValues.add(endDateKey);
      }
    }

    cols = cols.map(c => {
      if (c.value === 'oos_total' || (c.value === 'stock' && (c.title === 'Stock' || !c.title))) {
        return { ...c, title: 'OOS Total' };
      }
      return c;
    });

    if (cols.length > 0) {
      const nonParams = cols.filter(col => col.type !== 'parameters');
      const params = cols.filter(col => col.type === 'parameters');
      return [...nonParams, ...params];
    }
    return [];
  }, [orderedColumns, currentResults, activeColumns]);

  const virtualRows = useMemo(() => {
    const totalRows = sortedResults.length;

    if (!totalRows) {
      return {
        startIndex: 0,
        endIndex: 0,
        topSpacer: 0,
        bottomSpacer: 0,
        rows: []
      };
    }

    const containerHeight = 500;

    const visibleCount = Math.ceil(containerHeight / ROW_HEIGHT);

    const startIndex = Math.max(
      0,
      Math.floor(scrollTop / ROW_HEIGHT) - OVERSCAN
    );

    const endIndex = Math.min(
      totalRows,
      startIndex + visibleCount + OVERSCAN * 2
    );

    return {
      startIndex,
      endIndex,
      topSpacer: startIndex * ROW_HEIGHT,
      bottomSpacer: (totalRows - endIndex) * ROW_HEIGHT,
      rows: sortedResults.slice(startIndex, endIndex)
    };
  }, [sortedResults, scrollTop]);
  return (
    <div className="flex flex-col gap-6">
      {/* Page Title */}
      <div className="flex flex-col gap-1">
        <h1 className="text-[24px] font-bold text-[#0F172A] tracking-tight">
          Preview your alert
        </h1>
        <p className="text-[#64748B] text-[15px]">
          Validate your alert configuration using current marketplace data.
        </p>
      </div>


      <div className="bg-[#F9FAFB] shadow-sm border border-[#E2E8F0] rounded-[16px] p-4 flex flex-col gap-4 overflow-hidden">

        <div className="bg-[#F8FAFC] border-b border-[#E2E8F0]">

          <h2 className="text-[18px] font-semibold text-[#0F172A]">

            Configuration Summary
          </h2>
        </div>
        <div className="flex flex-col md:flex-row gap-[80px]">

          <div className="space-y-4">

            <div className="flex items-center  gap-[10px] py-1 border-b border-[#F1F5F9]">

              <span className="min-w-[80px] text-[#64748B] text-sm font-medium">
                Entity Type:
              </span>
              <span className="text-[#0F172A] text-sm font-medium capitalize text-start">

                {alertControlObj.entity || "Products"}
              </span>
            </div>
            <div className="flex items-center  gap-[10px] py-1 border-b border-[#F1F5F9]">

              <span className="min-w-[80px] text-[#64748B] text-sm font-medium">
                Scope:
              </span>
              <span className="text-[#0F172A] text-sm font-medium text-start">

                {scopeLabel}
              </span>
            </div>
          </div>
          <div className="space-y-4">

            <div className="flex items-center gap-[10px] py-1 border-b border-[#F1F5F9]">

              <span className="min-w-[92px] text-[#64748B] text-sm font-medium">
                Metric Focus:
              </span>
              <span className="text-[#0F172A] text-sm font-medium text-start">

                {alertControlObj.metricType || "Product"} Based
              </span>
            </div>
            <div className="flex items-center gap-[10px] py-1 border-b border-[#F1F5F9]">

              <span className="min-w-[92px] text-[#64748B] text-sm font-medium">
                Conditions:
              </span>
              <span className="text-[#0F172A] text-sm font-medium text-start">

                {/* {alertControlObj.conditions[activeTab]?.length || 0} Rules (Group {activeTab + 1}) */}
                {alertControlObj?.conditions?.length || 0} Active
              </span>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={() => handleRunReview(true)}
        disabled={loading}
        className="self-start flex items-center gap-2 bg-[#1890FF]  disabled:bg-[#93C5FD] text-white px-5 py-3 rounded-[2px] text-sm font-medium transition-all shadow-md"
      >
        {loading ? (
          <>
            <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
            Processing...
          </>
        ) : (
          <>

            <div className="flex items-center justify-center w-4 h-4 rounded-full border-2 border-white">
              <FontAwesomeIcon icon={faPlay} className="text-white text-[8px] ml-[2px]" />
            </div> Run Review
          </>
        )}
      </button>

      {showResults && (
        <div className="bg-white shadow-lg border border-[#E2E8F0] rounded-[20px] overflow-hidden">
          <div className="px-6 py-5 border-b border-[#F1F5F9]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-semibold text-[#191919]">
                  Preview Results
                </h2>
                <p className="text-sm text-[#64748B] mt-1">
                  {loading
                    ? "Analyzing database..."
                    : currentResults.length > 0
                      ? `Found ${currentResults.length} items for this condition group`
                      : "No matches found for the current configuration"}
                </p>
              </div>
              <button
                onClick={() => {
                  trackCustomEvent(
                    EVENTS.POPUP_OPEN,
                    {
                      action: "open_customize_columns",
                      component: TRACKING_COMPONENT.BUTTON,
                    },
                    "Preview Component",
                    trackerContext
                  );
                  setCustomizeInfo({ isOpen: true, column: null });
                }}
                disabled={loading}
                className="flex items-center justify-center border px-3 py-1.5 rounded bg-white text-[#0F172A] hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors shadow-sm"
              >
                {loading ? (
                  <div className="animate-spin h-4 w-4 border-2 border-[#0F172A] border-t-transparent rounded-full mr-2" />
                ) : (
                  <CiFilter className="text-lg mr-2" />
                )}
                Customize Columns
              </button>
            </div>

            {/* Tab Navigation - Only show if multiple arrays exist */}
            {results.length > 1 && (
              <div className="flex gap-2 border-b border-[#F1F5F9]">
                {[...Array(results.length + 1)].map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      trackCustomEvent(
                        EVENTS.TAB_SWITCH,
                        {
                          action: "switch_preview_condition_tab",
                          tab: idx === 0 ? "All" : `Condition ${idx}`,
                          tab_index: idx,
                          component: TRACKING_COMPONENT.TAB,
                        },
                        "Preview Component",
                        trackerContext
                      );
                      setActiveTab(idx);
                    }}
                    className={`px-4 py-2 text-sm font-semibold transition-all border-b-2 ${activeTab === idx
                      ? "border-[#2563EB] text-[#2563EB]"
                      : "border-transparent text-[#64748B] hover:text-[#0F172A]"
                      }`}
                  >
                    {/* Condition {idx + 1} */}
                    {idx === 0 ? "All" : `Condition ${idx}`}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div
            ref={tableContainerRef}
            className="max-h-[500px] overflow-y-auto overflow-x-auto"
            onScroll={(e) => {
              setScrollTop(e.currentTarget.scrollTop);
            }}
          >
            <table className="w-full text-sm text-left">
              <thead className="bg-[#F8FAFC] text-[#64748B] text-[11px] font-bold tracking-wider sticky top-0 z-10">
                <tr>
                  {displayColumns.map((col, idx) => {
                    const upperTitle = (col.title || '').toUpperCase();
                    const isUpper = ['OSA', 'SOS', 'OR', 'MRP', 'SP'].includes(upperTitle);
                    const formattedTitle = isUpper
                      ? upperTitle
                      : (col.title || '').replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
                    return (
                      <th
                        key={`bkd-${idx}`}
                        className={`cursor-pointer hover:bg-gray-100 select-none ${idx === 0 ? "px-6 py-4" : "px-6 py-4 text-center whitespace-nowrap"}`}
                        onClick={() => requestSort(col.value)}
                      >
                        <div className={`flex items-center gap-2 ${idx === 0 ? "justify-start" : "justify-center"}`}>
                          {formattedTitle}
                          {sortConfig.key === col.value ? (
                            <FontAwesomeIcon icon={sortConfig.direction === 'asc' ? faSortUp : faSortDown} className="text-[#0F172A]" />
                          ) : (
                            <FontAwesomeIcon icon={faSort} className="text-gray-300" />
                          )}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>

              <tbody className="divide-y divide-[#F1F5F9]">
                {/* Top virtual space */}
                {virtualRows.topSpacer > 0 && (
                  <tr>
                    <td
                      colSpan={displayColumns.length}
                      style={{
                        height: virtualRows.topSpacer,
                        padding: 0,
                        border: 0
                      }}
                    />
                  </tr>
                )}
                {/* {sortedResults.map((item, index) => (
                  <tr
                    key={index}
                    className="hover:bg-[#F8FAFC] transition-colors group"
                  >
                    {displayColumns.map((col, idx) => (
                      <td key={`bkd-val-${idx}`} className={idx === 0 ? "px-6 py-4 max-w-[300px]" : "px-6 py-4 text-center"}>
                        {renderCellValue(item, col.value)}
                      </td>
                    ))}
                  </tr>
                ))} */}
                {virtualRows.rows.map((item, virtualIndex) => {
                  const index = virtualRows.startIndex + virtualIndex;

                  return (
                    <tr
                      key={item.id || item.web_pid || index}
                      className="hover:bg-[#F8FAFC] transition-colors group"
                      style={{
                        height: ROW_HEIGHT
                      }}
                    >
                      {displayColumns.map((col, idx) => (
                        <td
                          key={`bkd-val-${idx}`}
                          className={
                            idx === 0
                              ? "px-6 py-4 max-w-[300px]"
                              : "px-6 py-4 text-center"
                          }
                        >
                          {renderCellValue(item, col.value)}
                        </td>
                      ))}
                    </tr>
                  );
                })}
                {/* Bottom virtual space */}
                {virtualRows.bottomSpacer > 0 && (
                  <tr>
                    <td
                      colSpan={displayColumns.length}
                      style={{
                        height: virtualRows.bottomSpacer,
                        padding: 0,
                        border: 0
                      }}
                    />
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {customizeInfo.isOpen && (
        <CustomizeCampiagnModal
          isWidget={false}
          closePopup={() => {
            trackCustomEvent(
              EVENTS.POPUP_CLOSE,
              {
                action: "close_customize_columns",
                component: TRACKING_COMPONENT.BUTTON,
              },
              "Preview Component",
              trackerContext
            );
            setCustomizeInfo({ isOpen: false, column: null });
          }}
          selectedTabName="preview"
          kpi={alertControlObj.kpi}
          tabColumnList={tabColumnList}
          setTabColumnList={setTabColumnList}
          isSaveViewVisible={false}
          columnVisible="All"
          initCustomizeColumns={initCustomizeColumns}
          isRemovable={false}
        />
      )}
    </div>
  );
}

import React from 'react'
// import {useState} from 'react'
import DateRangePicker from './dateRangePicker';
import {
  DateRangeProvider,
  useDateRangeContext
} from './context/dateRangeProvider';
import moment from 'moment';
import { useEbuxContext } from '../../../Ebux/Context/EbuxProvider';
import { arrowIcon, calenderIcon } from './utils/icons';
import { samePeriodAsCurrent } from './utils/helper';
import { getCombineFilterWidget, getCombineFilterWidgetKW, getCombineFilterWidgetSOM, getDistinctFiltersDarkStore, getEbuxDarkstoreLocation, getEbuxLocationsNew, getEbuxLocationsNewDarkStore, getStoreDataIdDarkStore } from '../../../Ebux/services/ebux.service';

import { getBuyBoxSellerTypeAndSellers } from "../../../Ebux/services/ebuxMaster.service";
import { ENTITY_TYPE, EVENTS, getTrackerContext, trackCustomEvent, TRACKING_COMPONENT } from '../../../../tracker';
import { fetchGlobalViewCombineFiltersPdpKw, getEbuxLocationsGlobalView } from '../../../Ebux/ds2.0/global-view/services/service';
// import { get_consecutive_out_of_stock_products } from '../../../Ebux/services/consecutive_out_of_stock_products.service';

const DateRangeCard = ({
  isCurrent = true,
  start = "23/07/25",
  end = "23/07/25",
  onClick = () => { }
}) => {
  return (
    <div onClick={() => onClick(isCurrent)} className="cursor-pointer border border-gray-300 rounded-lg shadow-sm bg-white px-6 pt-3 pb-1 leading-none inline-block relative">
      <div className="flex items-center gap-1  absolute -top-[12px] left-1 bg-white p-1 rounded-full ">
        {calenderIcon}
        <span className="text-sm font-semibold text-gray-800">{isCurrent ? "Current" : "Compare"} Date Range</span>
      </div>
      <div className="flex items-center text-sm text-gray-600">
        {start}
        <span className="mx-1 text-gray-500">
          {arrowIcon}
        </span>
        {end}
      </div>
    </div>
  );
}
const DatePiker = () => {

  const {

    kpi,
    selectedFilters, setSelectedFilters, activeClientProject,
    minDate, maxDate
    // , selectedFiltersWidget
    , setSelectedFiltersWidget,
    setFilters, setFiltersDarkStore, filtersDarkStore,
    selectedMsl, setEbuxLoading,
    getPincodesfromLocation,
    getDarkstorefromDarkstoreLocation,
    setTempFilterData,
    setErrorToSetFilterData,
    setSelectedMslFilter,
    firstTimeLoadFilter, setFirstTimeLoadFilter
  } = useEbuxContext();

  // const activeClientProject={client_project_id:1,maxDate:moment().subtract(1, 'day').format("YYYY-MM-DD")};

  // const endDate=moment(activeClientProject?.maxDate).format("YYYY-MM-DD");
  // const startDate=moment(endDate).subtract(6, 'day').format("YYYY-MM-DD");
  // const previousEndDate=moment(startDate).subtract(1, 'day').format("YYYY-MM-DD");
  // const previousStartDate=moment(previousEndDate).subtract(6, 'day').format("YYYY-MM-DD");
  // const [ selectedFilters, setSelectedFilters]=useState({selectedDateRange: {
  //     isCompareToPrevious: false,
  //     endDate,
  //     startDate,
  //     previousEndDate,
  //     previousStartDate,
  //     currentFilters:"Last 7 days",
  //     previousFilters: "Previous Period"
  //   }});
  if (activeClientProject?.WeekPicker) {
    return (
      <></>
    )
  }
  const {
    setActivePreviousFilters,
    displayDateRangePicker, setDisplayDateRangePicker,
    setIsOpenCurrentDateRangePicker } = useDateRangeContext();

  const onClickDateRangeCard = (isCurrent) => {
    trackCustomEvent(
      EVENTS.CLICK,
      {
        action: "open_date_picker",
        card: isCurrent ? "current_date_range" : "compare_date_range",
        startDate: isCurrent ? selectedFilters?.selectedDateRange?.startDate : selectedFilters?.selectedDateRange?.previousStartDate,
        endDate: isCurrent ? selectedFilters?.selectedDateRange?.endDate : selectedFilters?.selectedDateRange?.previousEndDate
      },
      ENTITY_TYPE.DATE_RANGE_PICKER,
      getTrackerContext(kpi, filtersDarkStore?.tab_type, { component_type: TRACKING_COMPONENT.DATE_PICKER })
    );
    setDisplayDateRangePicker(true);
    setIsOpenCurrentDateRangePicker(isCurrent);
  };

  const updateDateRanges = async (ranges) => {
    const selectedDateRange = {
      isCompareToPrevious: ranges?.comparisonMode ?? false,
      endDate: moment(ranges?.currentPeriod?.endDate).format("YYYY-MM-DD"),
      startDate: moment(ranges?.currentPeriod?.startDate).format("YYYY-MM-DD"),
      previousEndDate: moment(ranges?.previousPeriod?.endDate ?? ranges?.currentPeriod?.endDate).format("YYYY-MM-DD"),
      previousStartDate: moment(ranges?.previousPeriod?.startDate ?? ranges?.currentPeriod?.startDate).format("YYYY-MM-DD"),
      currentFilters: ranges?.activeCurrentFilters ?? "Custom",
      previousFilters: ranges?.activePreviousFilters ?? "Custom"
    };
    if (activeClientProject?.isFilterDateWise) {
      setEbuxLoading(true);
      if (!firstTimeLoadFilter) {
        setFirstTimeLoadFilter(true)
      }
      try {
        const dateRangeData = { calendarType: selectedFilters?.calendarType, selectedDateRange: selectedDateRange, selectedWeeks: selectedFilters?.selectedWeeks };
        let apiResponse = {}, errorData = {};
        let combineFilterWidget = {};
        let combineFilterWidgetKW = {};
        let combineFilterWidgetSOM = {};
        const isDarkStoreTab = filtersDarkStore?.tab_type === "dark_store_analysis";
        const use_range = [111].indexOf(activeClientProject?.client_project_id) > -1;

        if (kpi == "GLOBALVIEW") {
          combineFilterWidget = await fetchGlobalViewCombineFiltersPdpKw("GLOBALVIEW", (selectedFilters.selectedPlatform?.flatMap(i => i?.id_in_db ?? i?.value) ?? []), (selectedFilters.selectedBrand?.flatMap(i => i?.id_in_db ?? i?.value) ?? []), (selectedFilters.selectedCategory?.flatMap(i => i?.id_in_db ?? i?.value) ?? []), dateRangeData);

        } if (["SOS", "OR", "SOM", "Wt_SOS"]?.indexOf(kpi) == -1) {
          // combineFilterWidget = await getCombineFilterWidget(
          //   "OSA",
          //   [],
          //   [],
          //   [],
          //   [],
          //   [],
          //   selectedMsl,
          //   [],
          //   dateRangeData
          // );
          combineFilterWidget = await getCombineFilterWidget((kpi == "BUYBOX" ? "BUYBOX" : "OSA"), (selectedFilters.selectedPlatform?.flatMap(i => i?.id_in_db ?? i?.value) ?? []), (selectedFilters.selectedBrand?.flatMap(i => i?.id_in_db ?? i?.value) ?? []), (selectedFilters.selectedCategory?.flatMap(i => i?.id_in_db ?? i?.value) ?? []), (selectedFilters.selectedMotherPack?.flatMap(i => i?.id_in_db ?? i?.value) ?? []), (selectedFilters.selectedProductId?.flatMap(i => i?.id_in_db ?? i?.value) ?? []), (use_range ? (selectedFilters.selectedRange?.flatMap(i => i?.id_in_db ?? i?.value) ?? []) : []), selectedMsl, [], dateRangeData);
          if (kpi == "BUYBOX" && activeClientProject?.isBuyBoxWithPF) {
            const payload = {
              selectedFilters: {
                selectedPlatform: selectedFilters.selectedPlatform?.map(i => ({ value: i?.id_in_db ?? i?.value ?? "", label: i?.label ?? "" })) ?? [],
                selectedBrand: selectedFilters.selectedBrand?.map(i => ({ value: i?.id_in_db ?? i?.value ?? "", label: i?.label ?? "" })) ?? [],
                selectedCategory: selectedFilters.selectedCategory?.map(i => ({ value: i?.id_in_db ?? i?.value ?? "", label: i?.label ?? "" })) ?? [],
                selectedSellerType: selectedFilters?.selectedSellerType?.map(i => ({ value: i?.id_in_db ?? i?.value ?? "", label: i?.label ?? "" })) ?? [],
                selectedSellerList: selectedFilters?.selectedSellerList?.map(i => ({ value: i?.id_in_db ?? i?.value ?? "", label: i?.label ?? "" })) ?? [],
                selectedProductId: selectedFilters.selectedProductId?.map(i => ({ value: i?.id_in_db ?? i?.value ?? "", label: i?.label ?? "", web_pid: i?.web_pid ?? "" })) ?? [],
                selectedMsl: selectedMsl,
                tagSkuList: [],
                selectedRange: selectedFilters?.selectedRange?.map(i => ({ value: i?.id_in_db ?? i?.value ?? "", label: i?.label ?? "" })) ?? [],
              }
            }

            let seller_response = await getBuyBoxSellerTypeAndSellers({ ...payload, dateRangeData });
            apiResponse.res_buy_box_seller_types = seller_response?.seller_types ?? [];
            apiResponse.res_buy_box_sellers = seller_response?.sellers ?? [];
          }
        } else if (["SOM"]?.indexOf(kpi) == -1) {
          // combineFilterWidgetKW = await getCombineFilterWidgetKW(
          //   "SOS",
          //   [],
          //   [],
          //   [],
          //   [],
          //   [],
          //   dateRangeData
          // );
          combineFilterWidgetKW = await getCombineFilterWidgetKW("SOS", (selectedFilters.selectedPlatform?.map(i => i.value) ?? []), (selectedFilters.selectedBrand?.flatMap(i => i.id_in_db) ?? []), (selectedFilters.selectedKeywordCategory?.map(i => i.value) ?? []), (selectedFilters.selectedKeyword?.map(i => i.value) ?? []), ([]), dateRangeData);
        } else if (kpi == "SOM") {
          // combineFilterWidgetSOM = await getCombineFilterWidgetSOM(
          //   "SOM",
          //   [],
          //   [],
          //   [],
          //   [],
          //   dateRangeData
          // );
          combineFilterWidgetSOM = await getCombineFilterWidgetSOM(
            "SOM",
            (selectedFilters.selectedBrand?.flatMap(i => i?.id_in_db ?? i?.value) ?? []),
            (selectedFilters.selectCategory_som?.flatMap(i => i?.id_in_db ?? i?.value) ?? []),
            (selectedFilters.selectCategory_node?.flatMap(i => i?.id_in_db ?? i?.value) ?? []),
            dateRangeData
          );
        }
        apiResponse.res_platform_pdp = (kpi == "GLOBALVIEW") ? combineFilterWidget?.platforms ?? [] : (kpi == "SOS" || kpi == "OR" || kpi == "Wt_SOS") ? combineFilterWidgetKW?.platforms ?? [] : (kpi == "SOM") ? combineFilterWidgetSOM?.platforms ?? [] : combineFilterWidget?.platforms ?? [];
        if (!isDarkStoreTab && !apiResponse?.res_platform_pdp?.length) {
          errorData.noDataFound = true

          setErrorToSetFilterData(true);
          setTempFilterData({
            apiResponse: {},
            setSelectedFiltersData: {},
            errorData
          });
          setEbuxLoading(false);
          return;
        }
        apiResponse.res_brand_pdp = (kpi == "GLOBALVIEW") ? combineFilterWidget?.brands ?? [] : (kpi == "SOS" || kpi == "OR" || kpi == "Wt_SOS") ? combineFilterWidgetKW?.brands ?? [] : (kpi == "SOM") ? combineFilterWidgetSOM?.brands ?? [] : combineFilterWidget?.brands ?? [];
        apiResponse.res_category = (kpi == "GLOBALVIEW") ? combineFilterWidget?.categories ?? [] : combineFilterWidget?.categories ?? [];
        apiResponse.res_mother_pack = (kpi == "GLOBALVIEW") ? [] : combineFilterWidget?.mother_packs ?? [];
        apiResponse.res_products = (kpi == "GLOBALVIEW") ? [] : combineFilterWidget?.products ?? [];

        // KW FILTER
        apiResponse.keywordCategory = (kpi == "GLOBALVIEW") ? [] : combineFilterWidgetKW?.keyword_categories ?? [];
        apiResponse.keyword = (kpi == "GLOBALVIEW") ? combineFilterWidget?.keywords ?? [] : combineFilterWidgetKW?.keywords ?? [];
        // SOM FILTER
        apiResponse.category_som = (kpi == "GLOBALVIEW") ? [] : combineFilterWidgetSOM?.category_som ?? [];
        apiResponse.category_node = (kpi == "GLOBALVIEW") ? [] : combineFilterWidgetSOM?.category_node ?? [];

        if (combineFilterWidget?.range) { apiResponse.range = (kpi == "GLOBALVIEW") ? [] : combineFilterWidget?.range ?? [] }


        if (kpi == "GLOBALVIEW") {
          apiResponse.res_location_new_pdp = await getEbuxLocationsGlobalView("GLOBALVIEW", (selectedFilters?.selectedPlatform?.map(i => i.value) ?? []), dateRangeData);
          apiResponse.location_pdp = getPincodesfromLocation(apiResponse.res_location_new_pdp);
        } else if (["SOS", "OR", "Wt_SOS"].indexOf(kpi) == -1) {
          apiResponse.res_location_new_pdp = await getEbuxLocationsNew("OSA", (selectedFilters?.selectedPlatform?.map(i => i.value) ?? []), (selectedFilters?.active_location_status), dateRangeData);
          apiResponse.location_pdp = getPincodesfromLocation(apiResponse.res_location_new_pdp);
          if (kpi != "BUYBOX") {
            apiResponse.res_darkstore_pdp = await getEbuxDarkstoreLocation("OSA", (selectedFilters?.selectedPlatform?.map(i => i.value) ?? []), dateRangeData);
            apiResponse.darkstore_pdp = getDarkstorefromDarkstoreLocation(apiResponse.res_darkstore_pdp);
          }
        } else {
          apiResponse.res_location_new_kw = await getEbuxLocationsNew("SOS", (selectedFilters?.selectedPlatform?.map(i => i.value) ?? []), undefined, dateRangeData);
          apiResponse.location_kw = getPincodesfromLocation(apiResponse.res_location_new_kw);
        }

        if (activeClientProject?.isUseWidgetDarkstore && ["SOS", "OR", "SOM", "Wt_SOS", "BUYBOX", "GLOBALVIEW"].indexOf(kpi) == -1) {
          apiResponse.darkstore = {};
          let payload = {
            msl: selectedMsl,
            brand_category_name: selectedFilters?.selectedCategory?.flatMap(i => i.id_in_db) ?? [],
            brand_name: selectedFilters?.selectedBrand?.flatMap(i => i.id_in_db) ?? [],
            mother_pack: selectedFilters?.selectedMotherPack?.map(i => i.value) ?? [],
            web_pid: selectedFilters?.selectedProductId?.flatMap(i => i.value) ?? [],
            // dateRangeData: { calendarType: selectedFilters?.calendarType, selectedDateRange: selectedFilters?.selectedDateRange, selectedWeeks: selectedFilters?.selectedWeeks }
            dateRangeData,
            ...((use_range) ? { range: selectedFilters.selectedRange?.flatMap(i => i?.id_in_db ?? i?.value) ?? [] } : {})
          }
          const res = await getDistinctFiltersDarkStore(payload);
          apiResponse.darkstore.brand = res?.brand ?? [];
          apiResponse.darkstore.category = res?.category ?? [];
          apiResponse.darkstore.mother_pack = res?.mother_pack ?? [];
          apiResponse.darkstore.web_pid = res?.web_pid ?? [];
          apiResponse.darkstore.pf_id = res?.pf_id ?? [];
          apiResponse.darkstore.range = res?.range ?? [];

          apiResponse.darkstore.res_location_new = await getEbuxLocationsNewDarkStore("OSA", ((res?.pf_id ?? [])?.map(i => i.value) ?? []), (selectedFilters?.active_location_status), dateRangeData);
          apiResponse.darkstore.location = getPincodesfromLocation(apiResponse.darkstore.res_location_new);
          apiResponse.darkstore.darkStoreId = await getStoreDataIdDarkStore("OSA", ((res?.pf_id ?? [])?.map(i => i.value) ?? []), (selectedFilters?.active_location_status), dateRangeData);

          if (isDarkStoreTab && !apiResponse?.darkstore?.pf_id?.length) {
            errorData.noDataFound = true;

            setErrorToSetFilterData(true);
            setTempFilterData({
              apiResponse: {},
              setSelectedFiltersData: {},
              errorData
            });
            setEbuxLoading(false);
            return;
          }
        }

        if (isDarkStoreTab) {
          const darkstorePf = apiResponse?.darkstore?.pf_id ?? [];
          const selectedPlats = filtersDarkStore?.platform?.length ? filtersDarkStore.platform : (selectedFilters?.selectedPlatform ?? []);
          if (selectedPlats?.length) {
            if (!darkstorePf?.length) {
              errorData.Platform = selectedPlats.slice(0, 5)?.map(i => i?.label || i?.value)?.join(", ");
            } else {
              const after = selectedPlats.filter(i => (!darkstorePf.some(j => (j.label && i.label && j.label == i.label) || (j.value != null && i.value != null && j.value == i.value) || (j.id_in_db != null && i.id_in_db != null && j.id_in_db == i.id_in_db))));
              if (after?.length) {
                errorData.Platform = after.slice(0, 5)?.map(i => i?.label || i?.value)?.join(", ");
              }
            }
          }

          const darkstoreBrands = apiResponse?.darkstore?.brand ?? [];
          const selectedBrands = filtersDarkStore?.brand?.length ? filtersDarkStore.brand : (selectedFilters?.selectedBrand ?? []);
          if (selectedBrands?.length) {
            if (!darkstoreBrands?.length) {
              errorData.Brand = selectedBrands.slice(0, 5)?.map(i => i?.label || i?.value)?.join(", ");
            } else {
              const after = selectedBrands.filter(i => (!darkstoreBrands.some(j => (j.label && i.label && j.label == i.label) || (j.value != null && i.value != null && j.value == i.value) || (j.id_in_db != null && i.id_in_db != null && j.id_in_db == i.id_in_db))));
              if (after?.length) {
                errorData.Brand = after.slice(0, 5)?.map(i => i?.label || i?.value)?.join(", ");
              }
            }
          }

          const darkstoreCats = apiResponse?.darkstore?.category ?? [];
          const selectedCats = filtersDarkStore?.category?.length ? filtersDarkStore.category : (selectedFilters?.selectedCategory ?? []);
          if (selectedCats?.length && ["SOS", "OR", "SOM", "Wt_SOS"].indexOf(kpi) == -1) {
            if (!darkstoreCats?.length) {
              errorData.Category = selectedCats.slice(0, 5)?.map(i => i?.label || i?.value)?.join(", ");
            } else {
              const after = selectedCats.filter(i => (!darkstoreCats.some(j => (j.label && i.label && j.label == i.label) || (j.value != null && i.value != null && j.value == i.value) || (j.id_in_db != null && i.id_in_db != null && j.id_in_db == i.id_in_db))));
              if (after?.length) {
                errorData.Category = after.slice(0, 5)?.map(i => i?.label || i?.value)?.join(", ");
              }
            }
          }

          const darkstoreMotherPacks = apiResponse?.darkstore?.mother_pack ?? [];
          const selectedMotherPacks = filtersDarkStore?.mother_pack?.length ? filtersDarkStore.mother_pack : (selectedFilters?.selectedMotherPack ?? []);
          if (selectedMotherPacks?.length && ["SOS", "OR", "SOM", "Wt_SOS"].indexOf(kpi) == -1) {
            if (!darkstoreMotherPacks?.length) {
              errorData["Mother Pack"] = selectedMotherPacks.slice(0, 5)?.map(i => i?.label || i?.value)?.join(", ");
            } else {
              const after = selectedMotherPacks.filter(i => (!darkstoreMotherPacks.some(j => (j.label && i.label && j.label == i.label) || (j.value != null && i.value != null && j.value == i.value) || (j.id_in_db != null && i.id_in_db != null && j.id_in_db == i.id_in_db))));
              if (after?.length) {
                errorData["Mother Pack"] = after.slice(0, 5)?.map(i => i?.label || i?.value)?.join(", ");
              }
            }
          }

          const darkstoreProds = apiResponse?.darkstore?.web_pid ?? [];
          const selectedProds = filtersDarkStore?.products?.length ? filtersDarkStore.products : (selectedFilters?.selectedProductId ?? []);
          if (selectedProds?.length && ["SOS", "OR", "SOM", "Wt_SOS"].indexOf(kpi) == -1) {
            if (!darkstoreProds?.length) {
              errorData.Product = selectedProds.slice(0, 5)?.map(i => i?.label || i?.value)?.join(", ");
            } else {
              const after = selectedProds.filter(i => (!darkstoreProds.some(j => (j.label && i.label && j.label == i.label) || (j.value != null && i.value != null && j.value == i.value) || (j.id_in_db != null && i.id_in_db != null && j.id_in_db == i.id_in_db))));
              if (after?.length) {
                errorData.Product = after.slice(0, 5)?.map(i => i?.label || i?.value)?.join(", ");
              }
            }
          }

          const darkstoreLocs = apiResponse?.darkstore?.location ?? apiResponse?.darkstore?.res_location_new ?? [];
          const selectedLocs = filtersDarkStore?.location?.length ? filtersDarkStore.location : (selectedFilters?.selectedLocation ?? []);
          if (selectedLocs?.length) {
            if (!darkstoreLocs?.length) {
              errorData.Location = selectedLocs.slice(0, 5)?.map(i => i?.label || i?.value)?.join(", ");
            } else {
              const after = selectedLocs.filter(i => (!darkstoreLocs.some(j => (j.label && i.label && j.label == i.label) || (j.value != null && i.value != null && j.value == i.value) || (j.id_in_db != null && i.id_in_db != null && j.id_in_db == i.id_in_db))));
              if (after?.length) {
                errorData.Location = after.slice(0, 5)?.map(i => i?.label || i?.value)?.join(", ");
              }
            }
          }

          const darkStores = apiResponse?.darkstore?.darkStoreId ?? [];
          const selectedDarkStores = filtersDarkStore?.darkstore ?? [];
          if (selectedDarkStores?.length) {
            if (!darkStores?.length) {
              errorData["Dark Store"] = selectedDarkStores.slice(0, 5)?.map(i => i?.label || i?.value)?.join(", ");
            } else {
              const after = selectedDarkStores.filter(i => (!darkStores.some(j => (j.label && i.label && j.label == i.label) || (j.value != null && i.value != null && j.value == i.value) || (j.id_in_db != null && i.id_in_db != null && j.id_in_db == i.id_in_db))));
              if (after?.length) {
                errorData["Dark Store"] = after.slice(0, 5)?.map(i => i?.label || i?.value)?.join(", ");
              }
            }
          }

          if (filtersDarkStore?.selectedRange?.length && apiResponse?.darkstore?.range) {
            if (!apiResponse?.darkstore?.range?.length) {
              errorData.Range = filtersDarkStore?.selectedRange?.slice(0, 5)?.map(i => i?.label)?.join(", ")
            } else {
              const after = filtersDarkStore?.selectedRange?.filter(i => (!apiResponse?.darkstore?.range?.some(j => j.label == i.label)))
              if (after?.length) {
                errorData.Range = after?.slice(0, 5)?.map(i => i?.label)?.join(", ")
              }
            }
          }
        } else {
          if (selectedFilters?.selectedPlatform?.length) {
            if (!apiResponse.res_platform_pdp?.length) {
              errorData.Platform = selectedFilters?.selectedPlatform?.slice(0, 5)?.map(i => i?.label)?.join(", ")
            } else {
              const after = selectedFilters?.selectedPlatform?.filter(i => (!apiResponse.res_platform_pdp?.some(j => j.label == i.label)))
              if (after?.length) {
                errorData.Platform = after?.slice(0, 5)?.map(i => i?.label)?.join(", ")
              }
            }
          }
          if (selectedFilters?.selectedBrand?.length) {
            if (!apiResponse.res_brand_pdp?.length) {
              errorData.Brand = selectedFilters?.selectedBrand?.slice(0, 5)?.map(i => i?.label)?.join(", ")
            } else {
              const after = selectedFilters?.selectedBrand?.filter(i => (!apiResponse.res_brand_pdp?.some(j => j.label == i.label)))
              if (after?.length) {
                errorData.Brand = after?.slice(0, 5)?.map(i => i?.label)?.join(", ")
              }
            }
          }
          if (selectedFilters?.selectedCategory?.length && ["SOS", "OR", "SOM", "Wt_SOS"].indexOf(kpi) == -1) {
            if (!apiResponse.res_category?.length) {
              errorData.Category = selectedFilters?.selectedCategory?.slice(0, 5)?.map(i => i?.label)?.join(", ")
            } else {
              const after = selectedFilters?.selectedCategory?.filter(i => (!apiResponse.res_category?.some(j => j.label == i.label)))
              if (after?.length) {
                errorData.Category = after?.slice(0, 5)?.map(i => i?.label)?.join(", ")
              }
            }
          }
          if (selectedFilters?.selectedMotherPack?.length && ["SOS", "OR", "SOM", "Wt_SOS"].indexOf(kpi) == -1) {
            if (!apiResponse.res_mother_pack?.length) {
              errorData["Mother Pack"] = selectedFilters?.selectedMotherPack?.slice(0, 5)?.map(i => i?.label)?.join(", ")
            } else {
              const after = selectedFilters?.selectedMotherPack?.filter(i => (!apiResponse.res_mother_pack?.some(j => j.label == i.label)))
              if (after?.length) {
                errorData["Mother Pack"] = after?.slice(0, 5)?.map(i => i?.label)?.join(", ")
              }
            }
          }
          if (selectedFilters?.selectedProductId?.length && ["SOS", "OR", "SOM", "Wt_SOS"].indexOf(kpi) == -1) {
            if (!apiResponse.res_products?.length) {
              errorData.Product = selectedFilters?.selectedProductId?.slice(0, 5)?.map(i => i?.label)?.join(", ")
            } else {
              const after = selectedFilters?.selectedProductId?.filter(i => (!apiResponse.res_products?.some(j => j.label == i.label)))
              if (after?.length) {
                errorData.Product = after?.slice(0, 5)?.map(i => i?.label)?.join(", ")
              }
            }
          }
          if (selectedFilters?.selectedLocation?.length) {
            if ((!apiResponse.location_pdp?.length && ["SOS", "OR", "Wt_SOS"].indexOf(kpi) == -1) || (!apiResponse.location_kw?.length && ["SOS", "OR", "Wt_SOS"].indexOf(kpi) > -1)) {
              errorData.Location = selectedFilters?.selectedLocation?.slice(0, 5)?.map(i => i?.label)?.join(", ")
            } else {
              const after = selectedFilters?.selectedLocation?.filter(i => ((kpi == "SOS" || kpi == "OR" || kpi == "Wt_SOS") ? !apiResponse.location_kw?.some(j => j.label == i.label) : !apiResponse.location_pdp?.some(j => j.label == i.label)))
              if (after?.length) {
                errorData.Location = after?.slice(0, 5)?.map(i => i?.label)?.join(", ")
              }
            }
          }
          if (selectedFilters?.selectedKeywordCategory?.length && ["SOS", "OR", "Wt_SOS"].indexOf(kpi) > -1) {
            if (!apiResponse.keywordCategory?.length) {
              errorData.KeywordCategory = selectedFilters?.selectedKeywordCategory?.slice(0, 5)?.map(i => i?.label)?.join(", ")
            } else {
              const after = selectedFilters?.selectedKeywordCategory?.filter(i => (!apiResponse.keywordCategory?.some(j => j.label == i.label)))
              if (after?.length) {
                errorData.KeywordCategory = after?.slice(0, 5)?.map(i => i?.label)?.join(", ")
              }
            }
          }
          if (selectedFilters?.selectedKeyword?.length && ["SOS", "OR", "Wt_SOS"].indexOf(kpi) > -1) {
            if (!apiResponse.keyword?.length) {
              errorData.Keyword = selectedFilters?.selectedKeyword?.slice(0, 5)?.map(i => i?.label)?.join(", ")
            } else {
              const after = selectedFilters?.selectedKeyword?.filter(i => (!apiResponse.keyword?.some(j => j.label == i.label)))
              if (after?.length) {
                errorData.Keyword = after?.slice(0, 5)?.map(i => i?.label)?.join(", ")
              }
            }
          }
          if (selectedFilters?.selectCategory_som?.length && ["SOM"].indexOf(kpi) > -1) {
            if (!apiResponse.category_som?.length) {
              errorData.CategorySOM = selectedFilters?.selectCategory_som?.slice(0, 5)?.map(i => i?.label)?.join(", ")
            } else {
              const after = selectedFilters?.selectCategory_som?.filter(i => (!apiResponse.category_som?.some(j => j.label == i.label)))
              if (after?.length) {
                errorData.CategorySOM = after?.slice(0, 5)?.map(i => i?.label)?.join(", ")
              }
            }
          }
          if (selectedFilters?.selectCategory_node?.length && ["SOM"].indexOf(kpi) > -1) {
            if (!apiResponse.category_node?.length) {
              errorData.CategoryNode = selectedFilters?.selectCategory_node?.slice(0, 5)?.map(i => i?.label)?.join(", ")
            } else {
              const after = selectedFilters?.selectCategory_node?.filter(i => (!apiResponse.category_node?.some(j => j.label == i.label)))
              if (after?.length) {
                errorData.CategoryNode = after?.slice(0, 5)?.map(i => i?.label)?.join(", ")
              }
            }
          }
          if (selectedFilters?.selectedSellerType?.length && activeClientProject?.isBuyBoxWithPF && ["BUYBOX"].indexOf(kpi) > -1) {
            if (!apiResponse.res_buy_box_seller_types?.length) {
              errorData.SellerType = selectedFilters?.selectedSellerType?.slice(0, 5)?.map(i => i?.label)?.join(", ")
            } else {
              const after = selectedFilters?.selectedSellerType?.filter(i => (!apiResponse.res_buy_box_seller_types?.some(j => j.label == i.label)))
              if (after?.length) {
                errorData.SellerType = after?.slice(0, 5)?.map(i => i?.label)?.join(", ")
              }
            }
          }
          if (selectedFilters?.selectedSellerList?.length && activeClientProject?.isBuyBoxWithPF && ["BUYBOX"].indexOf(kpi) > -1) {
            if (!apiResponse.res_buy_box_sellers?.length) {
              errorData.Sellers = selectedFilters?.selectedSellerList?.slice(0, 5)?.map(i => i?.label)?.join(", ")
            } else {
              const after = selectedFilters?.selectedSellerList?.filter(i => (!apiResponse.res_buy_box_sellers?.some(j => j.label == i.label)))
              if (after?.length) {
                errorData.Sellers = after?.slice(0, 5)?.map(i => i?.label)?.join(", ")
              }
            }
          }
          if (selectedFilters?.selectedRange?.length && apiResponse?.range) {
            if (!apiResponse.range?.length) {
              errorData.Range = selectedFilters?.selectedRange?.slice(0, 5)?.map(i => i?.label)?.join(", ")
            } else {
              const after = selectedFilters?.selectedRange?.filter(i => (!apiResponse.range?.some(j => j.label == i.label)))
              if (after?.length) {
                errorData.Range = after?.slice(0, 5)?.map(i => i?.label)?.join(", ")
              }
            }
          }
        }


        if (Object.keys(errorData).length) {

          setErrorToSetFilterData(true);
          setTempFilterData({
            apiResponse,
            setSelectedFiltersData: {
              selectedDateRange,
              ...(["SOS", "OR", "Wt_SOS"].indexOf(kpi) != -1) ? { selectedPlatformPdp: apiResponse?.res_platform_pdp ?? [] } :
                { selectedPlatformKW: apiResponse?.res_platform_pdp ?? [] }
            },
            errorData
          });
          setEbuxLoading(false);

        } else {
          setTempFilterData({});
          setErrorToSetFilterData(false);
          setFilters((prevFilters) => {
            const updatedFilters = {
              ...prevFilters,
              platform: apiResponse?.res_platform_pdp,
              brand: apiResponse?.res_brand_pdp,
              category: apiResponse.res_category ?? [],
              // location: apiResponse?.res_location_new_pdp ?? [],
              // locationPincode: apiResponse?.location_pdp ?? [],
              location: (["SOS", "OR", "Wt_SOS"].indexOf(kpi) > -1) ? apiResponse?.res_location_new_kw ?? [] : apiResponse?.res_location_new_pdp ?? [],
              locationPincode: (["SOS", "OR", "Wt_SOS"].indexOf(kpi) > -1) ? apiResponse?.location_kw ?? [] : apiResponse?.location_pdp ?? [],
              darkstore: apiResponse?.res_darkstore_pdp ?? [],
              darkstore_id: apiResponse?.darkstore_pdp,
              products: apiResponse.res_products ?? [],
              mother_pack: apiResponse.res_mother_pack ?? [],
              ...((apiResponse?.range) ? { range: apiResponse?.range ?? [] } : {}),

              keywordCategory: apiResponse.keywordCategory ?? [],
              keyword: apiResponse.keyword ?? [],

              category_som: apiResponse.category_som ?? [],
              category_node: apiResponse.category_node ?? [],
              ...(kpi == "BUYBOX" && activeClientProject?.isBuyBoxWithPF) ? {
                selectedSellerList: apiResponse?.res_buy_box_sellers ?? [],
                selectedSellerType: apiResponse?.res_buy_box_seller_types ?? [],
              } : {}
            };

            setSelectedFiltersWidget(prevSelectedFilters => ({
              ...prevSelectedFilters,
              ...((["SOS", "OR", "Wt_SOS"]?.indexOf(kpi) == -1) ?
                { selectedPlatformPdp: apiResponse?.res_platform_pdp ?? [] } :
                { selectedPlatformKW: apiResponse?.res_platform_pdp ?? [] })
            }));

            return updatedFilters;
          });
          if (activeClientProject?.isUseWidgetDarkstore && ["SOS", "OR", "SOM", "Wt_SOS", "BUYBOX", "GLOBALVIEW"].indexOf(kpi) == -1) {
            setFiltersDarkStore(prevFilters => ({
              ...prevFilters,
              platform: apiResponse.darkstore.pf_id ?? [],
              platform_reset: apiResponse.darkstore.pf_id ?? [],
              brand: apiResponse.darkstore.brand ?? [],
              brand_reset: apiResponse.darkstore.brand ?? [],
              category: apiResponse.darkstore.category ?? [],
              category_reset: apiResponse.darkstore.category ?? [],
              products: apiResponse.darkstore.web_pid ?? [],
              products_reset: apiResponse.darkstore.web_pid ?? [],
              mother_pack: apiResponse.darkstore.mother_pack ?? [],
              mother_pack_reset: apiResponse.darkstore.mother_pack ?? [],
              location: apiResponse.darkstore.res_location_new ?? [],
              location_reset: apiResponse.darkstore.res_location_new ?? [],
              locationPincode: apiResponse.darkstore.location ?? [],
              locationPincode_reset: apiResponse.darkstore.location ?? [],
              darkstore: apiResponse.darkstore.darkStoreId ?? [],
              darkstore_reset: apiResponse.darkstore.darkStoreId ?? [],
              ...((apiResponse?.darkstore?.range) ? { range: apiResponse?.darkstore?.range ?? [] } : {}),

            }))
          }

          setSelectedFilters(prevSelectedFilters => ({
            ...prevSelectedFilters,
            selectedDateRange,
            selectedPlatformPdp: apiResponse?.res_platform_pdp ?? [],
            selectedMsl: selectedMsl
          }));
          setSelectedMslFilter(selectedMsl)
          setEbuxLoading(false);

        }
        // console.log('combineFilterWidgetcombineFilterWidgetcombineFilterWidget', combineFilterWidget)
        // setFilters(prevFilters => ({
        //   ...prevFilters,
        //   platform: combineFilterWidget?.platforms ?? [],
        //   brand: combineFilterWidget?.brands ?? [],
        //   category: combineFilterWidget?.categories ?? [],
        //   mother_pack: combineFilterWidget?.mother_packs ?? [],
        //   products: combineFilterWidget?.products ?? [],
        // }));

        // setSelectedFilters(prevFilters => ({
        //   ...prevFilters,
        //   selectedWeeks: { ...prevFilters?.selectedWeeks, [(displayDateRangePicker?.type ?? "current")]: [...weeks], ...(compareModeOn == false ? { isCompareToPrevious: false } : {}) },
        //   selectedProductId: (combineFilterWidget?.products ?? []),
        //   selectedPlatform: (combineFilterWidget?.platforms ?? []),
        // }));
      } catch (error) {
        console.error("Error fetching combined filters:", error);
      } finally {
        setEbuxLoading(false);
        // onClose();
      }
      return;
    } else {
      setSelectedFilters((prevFilters) => ({
        ...prevFilters,
        selectedDateRange,
        // seven_or_more_days_out_of_stock_list
      }));
    }
    // const seven_or_more_days_out_of_stock_list=await get_consecutive_out_of_stock_products({startDate:selectedDateRange?.startDate,endDate:selectedDateRange?.endDate});

  }


  const updateComparisonMode = (previousPeriod, previousFilters) => {
    if (!firstTimeLoadFilter) {
      setFirstTimeLoadFilter(true)
    }
    if (selectedFilters?.selectedDateRange?.isCompareToPrevious) {
      setSelectedFilters((prevFilters) => ({
        ...prevFilters,
        selectedDateRange: { ...prevFilters?.selectedDateRange, isCompareToPrevious: false }
      }));
    } else {
      setSelectedFilters((prevFilters) => ({
        ...prevFilters,
        selectedDateRange: {
          ...prevFilters?.selectedDateRange,
          isCompareToPrevious: true,
          previousStartDate: moment(previousPeriod?.startDate).format("YYYY-MM-DD"),
          previousEndDate: moment(previousPeriod?.endDate).format("YYYY-MM-DD"),
          previousFilters
        }
      }));
    }

  }
  return (
    <div className=" flex gap-2 items-center justify-end   bg-transparent ">
      <DateRangeCard isCurrent={true} start={moment(selectedFilters?.selectedDateRange?.startDate).format("DD/MM/YY")} end={moment(selectedFilters?.selectedDateRange?.endDate).format("DD/MM/YY")} onClick={(isCurrent) => onClickDateRangeCard(isCurrent)} />
      {selectedFilters?.selectedDateRange?.isCompareToPrevious && (
        <DateRangeCard isCurrent={false} start={moment(selectedFilters?.selectedDateRange?.previousStartDate).format("DD/MM/YY")} end={moment(selectedFilters?.selectedDateRange?.previousEndDate).format("DD/MM/YY")} onClick={(isCurrent) => onClickDateRangeCard(isCurrent)} />
      )}
      {displayDateRangePicker && (
        <div className="absolute top-[50px] right-0 z-10 p-0 w-full min-w-[600px]">
          <DateRangePicker allowedMinDate={minDate ?? (activeClientProject?.minDate ? new Date(activeClientProject.minDate) : new Date("2000-01-01"))} allowedMaxDate={maxDate ?? (activeClientProject?.maxDate ? new Date(activeClientProject.maxDate) : moment().subtract(1, "day").toDate())} onChange={updateDateRanges} defaultComparisonMode={selectedFilters?.selectedDateRange?.isCompareToPrevious} defaultCurrentStart={selectedFilters?.selectedDateRange?.startDate} defaultCurrentEnd={selectedFilters?.selectedDateRange?.endDate} defaultPreviousStart={selectedFilters?.selectedDateRange?.previousStartDate} defaultPreviousEnd={selectedFilters?.selectedDateRange?.previousEndDate} defaultCurrentFilters={selectedFilters?.selectedDateRange?.currentFilters ?? "Last 7 days"} defaultPreviousFilters={selectedFilters?.selectedDateRange?.previousFilters ?? "Previous Period"} />
        </div>
      )}
      <div className="flex items-center gap-1 p-1 rounded-full ">
        <span className="text-sm font-semibold text-gray-800">Compare:</span>
        <button
          onClick={() => {
            const nextCompare = !selectedFilters?.selectedDateRange?.isCompareToPrevious;
            trackCustomEvent(
              EVENTS.TOGGLE_BUTTON,
              { item: "compare_toggle", comparisonMode: nextCompare },
              ENTITY_TYPE.DATE_RANGE_PICKER,
              getTrackerContext(kpi, filtersDarkStore?.tab_type, { component_type: TRACKING_COMPONENT.TOGGLE_BUTTON })
            );
            samePeriodAsCurrent({ startDate: selectedFilters?.selectedDateRange?.startDate, endDate: selectedFilters?.selectedDateRange?.endDate }, (previousPeriod) => { updateComparisonMode(previousPeriod, "Previous Period") }, "Previous Period", setActivePreviousFilters);
          }}
          aria-pressed={selectedFilters?.selectedDateRange?.isCompareToPrevious}
          className={`
          relative inline-flex h-[22px] w-[42px] items-center rounded-full transition
          ${selectedFilters?.selectedDateRange?.isCompareToPrevious ? "bg-blue-600" : "bg-neutral-300"}
          shadow-[inset_0_0_0_1px_rgba(0,0,0,0.08)]
        `}
        >
          <span
            className={`
            pointer-events-none inline-block h-[18px] w-[18px] rounded-full bg-white transform transition
            ${selectedFilters?.selectedDateRange?.isCompareToPrevious ? "translate-x-[22px]" : "translate-x-[4px]"}
            shadow-[0_1px_1px_rgba(0,0,0,0.2)]
          `}
          />
        </button>
      </div>
    </div>
  );
}
export default function HeaderDatePicker() {


  return (
    <DateRangeProvider>
      <DatePiker />
    </DateRangeProvider>
  )
}

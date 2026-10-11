import React, { createContext, useContext, useState } from "react";
import { useEbuxContext } from "../../../Context/EbuxProvider";
import { getCombineFilterWidget, getCombineFilterWidgetKW, getEbuxLocationsNew, getCombineFilterCompetitionWidget } from "../../../services/ebux.service";
import { getAllTag } from "../../../services/tag.service";

const AlertContext = createContext();

export const useAlertContext = () => {
    return useContext(AlertContext);
};

export const AlertProvider = ({ children }) => {
    const { activeClientProject, getPincodesfromLocation } = useEbuxContext();

    const [filters, setFilters] = useState({
        brand: [],
        category: [],
        platform: [],
        products: [],
        mother_pack: [],
        location: [],
        locationPincode: [],

        brandKW: [],
        keywordCategory: [],
        keyword: [],
        platformKW: [],
        locationKW: [],
        locationPincodeKW: [],

        productsCompetition: [],
        brandCompetition: [],

        res_brand_competition: [],
        res_brand_pdp_competition: [],
        res_products_competition: [],
        keyword_category_type : []
    });

    const [isAlertLoading, setIsAlertLoading] = useState(false);
    const [isFilterLoaded, setIsFilterLoaded] = useState(false);
    const [tagList, setTagList] = useState([]);

    const initFilterLoad = async () => {
        // console.log("isFilterLoadedalert", isFilterLoaded);
        if (isFilterLoaded) return;
        setIsAlertLoading(true);

        const formatDate = (date) => {
            const d = new Date(date);
            let month = '' + (d.getMonth() + 1);
            let day = '' + d.getDate();
            const year = d.getFullYear();
            if (month.length < 2) month = '0' + month;
            if (day.length < 2) day = '0' + day;
            return [year, month, day].join('-');
        };

        const endDate = new Date();
        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 3);

        const dateRangeData = {
            calendarType: "Daily",
            selectedDateRange: {
                startDate: formatDate(startDate),
                endDate: formatDate(endDate),
                selection: "last3Months"
            },
            selectedWeeks: []
        };

        try {
            const isDateWise = activeClientProject?.isFilterDateWise;

            const [tagResult, pdpResult, kwResult, compResult, locPdpResult, locKwResult] = await Promise.allSettled([
                getAllTag(),
                isDateWise ? getCombineFilterWidget("OSA", [], [], [], [], [], [], "all", [], dateRangeData) : getCombineFilterWidget("OSA", [], [], [], [], [], [], "all", []),
                isDateWise ? getCombineFilterWidgetKW("SOS", [], [], [], [], [], dateRangeData) : getCombineFilterWidgetKW("SOS", [], [], [], [], []),
                isDateWise ? getCombineFilterCompetitionWidget("OSA", [], [], [], [], [], 'all', [], dateRangeData) : getCombineFilterCompetitionWidget("OSA"),
                getEbuxLocationsNew("OSA", [], undefined, isDateWise ? dateRangeData : undefined),
                getEbuxLocationsNew("SOS", [], undefined, isDateWise ? dateRangeData : undefined)
            ]);

            const _tagList = tagResult.status === "fulfilled" ? tagResult.value : [];
            setTagList(_tagList);

            const pdpData = pdpResult.status === "fulfilled" ? pdpResult.value : null;
            const kwData = kwResult.status === "fulfilled" ? kwResult.value : null;
            const compData = compResult.status === "fulfilled" ? compResult.value : null;

            const locationPdpData = locPdpResult.status === "fulfilled" ? locPdpResult.value : null;
            const locationKwData = locKwResult.status === "fulfilled" ? locKwResult.value : null;
            const locationPincodePdp = locationPdpData ? getPincodesfromLocation(locationPdpData) : [];
            const locationPincodeKw = locationKwData ? getPincodesfromLocation(locationKwData) : [];
            setFilters(prev => ({
                ...prev,
                brand: pdpData?.brands || [],
                category: pdpData?.categories || [],
                platform: pdpData?.platforms || [],
                products: pdpData?.products || [],
                mother_pack: pdpData?.mother_packs || [],
                location: locationPdpData || [],
                locationPincode: locationPincodePdp,
                ...((pdpData?.range) ? { range: pdpData?.range ?? [] } : {}),

                brandKW: kwData?.brands || [],
                keywordCategory: kwData?.keyword_categories || [],
                keyword: kwData?.keywords || [],
                platformKW: kwData?.platforms || [],
                locationKW: locationKwData || [],
                locationPincodeKW: locationPincodeKw,
                res_brand_competition: compData?.brands || [],
                res_brand_pdp_competition: compData?.brands || [],
                res_products_competition: compData?.products || [],
                keyword_category_type: kwData?.keyword_category_type || []
            }));

            setIsFilterLoaded(true);
        } catch (err) {
            console.error("Error loading alert filters:", err);
        } finally {
            setIsAlertLoading(false);
        }
    };

    const value = {
        filters,
        setFilters,
        initFilterLoad,
        isAlertLoading,
        isFilterLoaded,
        tagList,
        setTagList
    };

    return (
        <AlertContext.Provider value={value}>
            {children}
        </AlertContext.Provider>
    );
};

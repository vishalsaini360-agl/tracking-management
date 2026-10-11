import React, { createContext, useContext, useState } from "react";
import { useEbuxContext } from "../../../Context/EbuxProvider";
import { getCombineFilterWidget, getCombineFilterWidgetKW, getEbuxLocationsNew } from "../../../services/ebux.service";
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
    });

    const [isAlertLoading, setIsAlertLoading] = useState(false);
    const [isFilterLoaded, setIsFilterLoaded] = useState(false);
    const [tagList, setTagList] = useState([]);

    const initFilterLoad = async () => {
        console.log("isFilterLoadedalert", isFilterLoaded);
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
            const _tagList = await getAllTag();
            setTagList(_tagList);

            let pdpData;
            let kwData;
            let locationPdpData;
            let locationKwData;

            if (activeClientProject?.isFilterDateWise) {
                pdpData = await getCombineFilterWidget("OSA", [], [], [], [], [], "all", [], dateRangeData);
                kwData = await getCombineFilterWidgetKW("SOS", [], [], [], [], [], dateRangeData);

                locationPdpData = await getEbuxLocationsNew("OSA", pdpData?.platforms?.map(i => i.value) || [], undefined, dateRangeData);
                locationKwData = await getEbuxLocationsNew("SOS", kwData?.platforms?.map(i => i.value) || [], undefined, dateRangeData);
            } else {
                pdpData = await getCombineFilterWidget("OSA", [], [], [], [], [], "all", []);
                kwData = await getCombineFilterWidgetKW("SOS", [], [], [], [], []);

                locationPdpData = await getEbuxLocationsNew("OSA", pdpData?.platforms?.map(i => i.value) || [], undefined);
                locationKwData = await getEbuxLocationsNew("SOS", kwData?.platforms?.map(i => i.value) || [], undefined);
            }

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

                brandKW: kwData?.brands || [],
                keywordCategory: kwData?.keyword_categories || [],
                keyword: kwData?.keywords || [],
                platformKW: kwData?.platforms || [],
                locationKW: locationKwData || [],
                locationPincodeKW: locationPincodeKw
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

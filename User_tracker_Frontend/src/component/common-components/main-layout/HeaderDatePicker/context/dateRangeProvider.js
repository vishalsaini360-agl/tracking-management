import moment from 'moment';
import React, { createContext, useContext,   useEffect,   useState } from 'react';
import { getAllSaveDateRanges } from '../services/saveDateRange.service';

const DateRangeContext = createContext();

const { Provider } = DateRangeContext;


export const DateRangeProvider = (props) => {
    // const maxDate = moment().subtract(1, 'day').toDate();
    const [allowedMaxDate, setAllowedMaxDate] = useState(null);
    const [allowedMinDate, setAllowedMinDate] = useState(null);
    const [comparisonMode, setComparisonMode] = useState(false);
    const [currentPeriod, setCurrentPeriod] = useState({ startDate: moment(new Date(allowedMaxDate)).subtract(6, 'day').toDate(), endDate: allowedMaxDate });
    const [previousPeriod, setPreviousPeriod] = useState({ startDate: moment(new Date(currentPeriod?.startDate)).subtract(7, 'day').toDate(), endDate: moment(new Date(currentPeriod?.startDate)).subtract(1, 'day').toDate() });

    const [displayDateRangePicker, setDisplayDateRangePicker] = useState(false);
    const [isOpenCurrentDateRangePicker, setIsOpenCurrentDateRangePicker] = useState(true);

      const [activeCurrentFilters, setActiveCurrentFilters] = useState("Last 7 days");
      const [activePreviousFilters, setActivePreviousFilters] = useState("Previous Period");


    const [savedDateRanges, setSavedDateRanges] = useState([]);
    const loadSavedDateRanges = async () => {
        const all=await getAllSaveDateRanges();
        setSavedDateRanges(Array.isArray(all)?all:[]);
      }
      useEffect(() => {
        if (savedDateRanges.length === 0) {
          loadSavedDateRanges();
        }
      }, []);

      
      

    return (
        <Provider value={{
            allowedMaxDate,setAllowedMaxDate,
            allowedMinDate,setAllowedMinDate,
            comparisonMode, setComparisonMode,
            currentPeriod, setCurrentPeriod,
            previousPeriod, setPreviousPeriod,
            displayDateRangePicker, setDisplayDateRangePicker,
            isOpenCurrentDateRangePicker, setIsOpenCurrentDateRangePicker,
            activeCurrentFilters, setActiveCurrentFilters,
            activePreviousFilters, setActivePreviousFilters,
            loadSavedDateRanges,savedDateRanges, setSavedDateRanges

        }}
      {...props}
    />
    );
};

export const useDateRangeContext = () => {
    return useContext(DateRangeContext);
};
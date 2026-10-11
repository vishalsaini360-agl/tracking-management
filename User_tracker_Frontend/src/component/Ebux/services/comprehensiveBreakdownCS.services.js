import { _POST } from "../../../services/axios.method";
import { BASE_URL } from "../../../utils/url";
export const fetchComprehensiveBreakdownData = async (kpi, datakey, dataLable, breakdownFilters, filters, selectedFilters, selectedPlatform, selectedTableRows, isPrevious = false) => {
    try {

        const payload = {
            datakey,
            dataLable,
            breakdownFilters,
            filters,
            selectedFilters,
            selectedPlatform,
            selectedTableRows,
            isPrevious
        }


        const response = await _POST(`${BASE_URL}ebux/${kpi}/comprehensive-breakdown-data`, payload, {
            'Content-Type': 'application/json'
        });


        return response?.data?.data ?? [];
    } catch (error) {

        // eslint-disable-next-line no-console
        console.log("fetchComprehensiveBreakdownData-response", { error });
        return [];
    }
}

export const fetchDailyBasisComprehensiveBreakdownData = async (kpi, datakey, dataValue, breakdownFilters, filters, selectedFilters, selectedPlatform, selectedTableRows, comprehensiveBreakdownTableData, isPrevious = false) => {
    try {        
        const payload = {
            datakey,
            dataValue,
            breakdownFilters,
            filters,
            selectedFilters,
            selectedPlatform,
            selectedTableRows,
            comprehensiveBreakdownTableData,
            isPrevious
        }


        const response = await _POST(`${BASE_URL}ebux/${kpi}/daily-comprehensive-breakdown-data`, payload, {
            'Content-Type': 'application/json'
        });

        return response?.data?.data ?? [];
    } catch (error) {
        return [];
    }
}
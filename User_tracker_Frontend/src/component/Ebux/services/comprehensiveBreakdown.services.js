import { _POST } from "../../../services/axios.method";
import { BASE_URL } from "../../../utils/url";

export const fetchComprehensiveBreakdownTabUniqueDataCount = async (kpi, breakdownFilters, filters, selectedFilters, selectedPlatform, selectedTableRows, tabData = [], selectedFiltersCompetition = []) => {
    try {
        let getActiveClientProject = JSON.parse(localStorage.getItem("active_client_project")) || {};
        const payload = {
            kpi,
            breakdownFilters,
            filters: (getActiveClientProject?.isFilterDateWise ?
                {
                    ...(
                        (['OSA', 'CS', 'PRO', 'RR'].indexOf(kpi) > -1) ? {
                            platform: filters?.platform,
                            // category: filters?.category, products: filters?.products 
                        } : (['SOS', 'OR', 'Wt_SOS'].indexOf(kpi) > -1) ? {
                            platform: filters?.platform,
                            // brand: filters?.brand, 
                            // keyword: filters?.keyword,
                            //  keywordCategory: filters?.keywordCategory, 
                            //  location: filters?.location,
                        } : (['SOM'].indexOf(kpi) > -1) ? {
                            platform: filters?.platform,
                            // brand: filters?.brand, 
                            // category_node: filters?.category_node, 
                            // category_som: filters?.category_som 
                        } : {}
                    ),
                }
                : filters),
            selectedFilters,
            selectedPlatform,
            selectedTableRows,
            tabData,
            selectedFiltersCompetition
        }
        let id_token = localStorage.getItem("id_token");
        let clientId = localStorage.getItem("client_id");
        const response = await _POST(`${BASE_URL}ebux/breakdown/tab-data?clientId=${clientId}`, payload,
            //     {
            //     'Content-Type': 'application/json'
            // }
            {
                headers: {
                    idtoken: id_token
                },
            }
        );
        return response?.data?.data ?? [];
    } catch (error) {
        // eslint-disable-next-line no-console
        console.log("fetchComprehensiveBreakdownData-response", { error });
        return [];
    }
}
export const fetchComprehensiveBreakdownData = async (kpi, datakey, dataLable, breakdownFilters, filters, selectedFilters, selectedPlatform, selectedTableRows, isPrevious = false, columnsData = [], selectedFiltersCompetition = []) => {
    try {
        let getActiveClientProject = JSON.parse(localStorage.getItem("active_client_project")) || {};
        const payload = {
            kpi,
            datakey,
            dataLable,
            breakdownFilters,
            // filters: (getActiveClientProject?.isFilterDateWise ? { competition_brand: filters?.competition_brand, ...((['SOS', 'OR', 'SOM'].indexOf(kpi) > -1) ? { brand: filters?.brand } : { products: filters?.products }) } : filters),

            filters: (getActiveClientProject?.isFilterDateWise ?
                {
                    competition_brand: filters?.competition_brand,
                    ...(
                        (['OSA', 'CS', 'PRO', 'RR'].indexOf(kpi) > -1) ? {
                            platform: filters?.platform,
                            // category: filters?.category, products: filters?.products 
                        } : (['SOS', 'OR', 'Wt_SOS'].indexOf(kpi) > -1) ? {
                            platform: filters?.platform,
                            // brand: filters?.brand, 
                            // keyword: filters?.keyword, 
                            // keywordCategory: filters?.keywordCategory,
                            //  location: filters?.location
                        } : (['SOM'].indexOf(kpi) > -1) ? {
                            platform: filters?.platform,
                            // brand: filters?.brand, 
                            // category_node: filters?.category_node, 
                            // category_som: filters?.category_som 
                        } : {}
                    ),
                }
                : filters),

            selectedFilters,
            selectedPlatform,
            selectedTableRows,
            isPrevious,
            columnsData,
            selectedFiltersCompetition
        }
        // const response = await _POST(`${BASE_URL}ebux/breakdown/comprehensive-breakdown-data`, payload, {
        //     'Content-Type': 'application/json'
        // });
        let clientId = localStorage.getItem("client_id");
        const response = await _POST(`${BASE_URL}ebux/breakdown/comprehensive-breakdown-data?clientId=${clientId}`, payload, {
            'Content-Type': 'application/json'
        });
        return response?.data?.data ?? [];
    } catch (error) {
        // eslint-disable-next-line no-console
        console.log("fetchComprehensiveBreakdownData-response", { error });
        return [];
    }
}
export const fetchDailyBasisComprehensiveBreakdownData = async (kpi, datakey, dataValue, breakdownFilters, filters, selectedFilters, selectedPlatform, selectedTableRows, comprehensiveBreakdownTableData, isPrevious = false, columnsData = [], selectedFiltersCompetition = []) => {
    try {
        let getActiveClientProject = JSON.parse(localStorage.getItem("active_client_project")) || {};
        const payload = {
            kpi,
            datakey,
            dataValue,
            breakdownFilters,
            // filters: (getActiveClientProject?.isFilterDateWise ? ((['SOS', 'OR', 'SOM'].indexOf(kpi) > -1) ? {} : { products: filters?.products }) : filters),
            filters: (getActiveClientProject?.isFilterDateWise ?
                {
                    ...(
                        (['OSA', 'CS', 'PRO', 'RR'].indexOf(kpi) > -1) ? {
                            platform: filters?.platform,
                            // category: filters?.category, products: filters?.products 
                        } : (['SOS', 'OR', 'Wt_SOS'].indexOf(kpi) > -1) ? {
                            platform: filters?.platform,
                            // brand: filters?.brand,
                            // keyword: filters?.keyword,
                            // keywordCategory: filters?.keywordCategory, 
                            // location: filters?.location,
                        } : (['SOM'].indexOf(kpi) > -1) ? {
                            platform: filters?.platform,
                            // brand: filters?.brand,
                            //  category_node: filters?.category_node,
                            //   category_som: filters?.category_som 
                        } : {}
                    ),
                }
                : filters),
            selectedFilters,
            selectedPlatform,
            selectedTableRows,
            comprehensiveBreakdownTableData,
            isPrevious,
            columnsData,
            selectedFiltersCompetition
        }
        let clientId = localStorage.getItem("client_id");
        const response = await _POST(`${BASE_URL}ebux/breakdown/daily-comprehensive-breakdown-data?clientId=${clientId}`, payload, {
            'Content-Type': 'application/json'
        });
        return response?.data?.data ?? [];
    } catch (error) {
        return [];
    }
}
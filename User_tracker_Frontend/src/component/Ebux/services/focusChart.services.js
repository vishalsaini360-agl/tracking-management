import { _POST } from "../../../services/axios.method";
import { BASE_URL } from "../../../utils/url";
export const fetchFocusChartData = async (focusKpi, kpi, filters, selectedFilters, selectedPlatform, isPrevious = false) => {
    try {
        let getActiveClientProject = JSON.parse(localStorage.getItem("active_client_project")) || {};
        const payload = {
            focusKpi, selectedFilters, selectedPlatform, isPrevious,
            filters: (getActiveClientProject?.isFilterDateWise ?
                {
                    ...(
                        (['RR'].indexOf(kpi) > -1) ? {
                            platform: filters?.platform,
                            // brand: filters?.brand 
                        } : (['OSA', 'CS', 'PRO'].indexOf(kpi) > -1) ? {
                            // brand: filters?.brand 
                        } : (['SOS', 'OR', 'Wt_SOS'].indexOf(kpi) > -1) ? {
                            platform: filters?.platform,
                            //  brand: filters?.brand, 
                            // keyword: filters?.keyword, keywordCategory: filters?.keywordCategory, location: filters?.location, 
                        } : (['SOM'].indexOf(kpi) > -1) ? {
                            platform: filters?.platform,
                            // brand: filters?.brand, 
                            // category_node: filters?.category_node, category_som: filters?.category_som 
                        } : {}
                    ),
                }
                : filters)
        }


        // const response = await _POST(`${BASE_URL}ebux/${kpi}/fetch-focus-chart-data`, payload, {
        //     'Content-Type': 'application/json'
        // });
        let clientId = localStorage.getItem("client_id");
        const response = await _POST(`${BASE_URL}ebux/${kpi}/fetch-focus-chart-data?clientId=${clientId}`, payload, {
            'Content-Type': 'application/json'
        });

        // eslint-disable-next-line no-console
        // console.log("fetchFocusChartData-response",{response});

        return response?.data?.data ?? [];

    } catch (error) {
        return [];
    }
}
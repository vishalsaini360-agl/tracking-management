import { _POST } from "../../../services/axios.method";
import { BASE_URL } from "../../../utils/url";
export const fetchPlatformChartData = async (kpi, filters, selectedFilters, selectedPlatform, selectedOption, isPrevious = false) => {
    try {
        let getActiveClientProject = JSON.parse(localStorage.getItem("active_client_project")) || {};
        const payload = {
            selectedFilters, selectedPlatform, selectedOption,
            isPrevious,
            // filters: (getActiveClientProject?.isFilterDateWise ? {} : filters)
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
                            //  brand: filters?.brand,
                            // category_node: filters?.category_node, category_som: filters?.category_som 
                        } : {}
                    ),
                }
                : filters)
        }


        // const response = await _POST(`${BASE_URL}ebux/${kpi}/fetch-platform-chart-data`, payload, {
        //     'Content-Type': 'application/json'
        // });
        let clientId = localStorage.getItem("client_id");
        const response = await _POST(`${BASE_URL}ebux/${kpi}/fetch-platform-chart-data?clientId=${clientId}`, payload, {
            'Content-Type': 'application/json'
        });


        return response?.data?.data ?? [];
    } catch (error) {
        return [];
    }
}
export const fetchCompetitionPlatformChartData = async (kpi, filters, selectedFilters, selectedOption, competitionBrand = []) => {
    try {

        let getActiveClientProject = JSON.parse(localStorage.getItem("active_client_project")) || {};

        const payload = {
            kpi,
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
                            //  brand: filters?.brand,
                            // category_node: filters?.category_node, category_som: filters?.category_som 
                        } : {}
                    ),
                }
                : filters)

            , selectedFilters, competitionBrand, selectedOption
        }


        // const response = await _POST(`${BASE_URL}ebux/fetch-competition-platform-chart-data`, payload, {
        //     'Content-Type': 'application/json'
        // });
        let clientId = localStorage.getItem("client_id");
        const response = await _POST(`${BASE_URL}ebux/fetch-competition-platform-chart-data?clientId=${clientId}`, payload, {
            'Content-Type': 'application/json'
        });


        return response?.data?.data ?? [];
    } catch (error) {
        return [];
    }
}

export const fetchRRCompetitionPlatformChartData = async (kpi, filters, selectedFilters, selectedPlatform, selectedOption, isPrevious = false) => {
    try {
        let getActiveClientProject = JSON.parse(localStorage.getItem("active_client_project")) || {};
        const payload = {
            filters: (getActiveClientProject?.isFilterDateWise ?
                {
                    platform: filters?.platform,
                }
                : filters), selectedFilters, selectedPlatform, selectedOption,
            isPrevious
        }


        // const response = await _POST(`${BASE_URL}ebux/${kpi}/fetch-platform-chart-data`, payload, {
        //     'Content-Type': 'application/json'
        // });
        let clientId = localStorage.getItem("client_id");
        const response = await _POST(`${BASE_URL}ebux/${kpi}/fetch-competition-platform-chart-data?clientId=${clientId}`, payload, {
            'Content-Type': 'application/json'
        });


        return response?.data?.data ?? [];
    } catch (error) {
        return [];
    }
}
export const fetchSOMCompetitionPlatformChartData = async (kpi, filters, selectedFilters, selectedPlatform, selectedOption, isPrevious = false) => {
    try {

        const payload = {
            filters, selectedFilters, selectedPlatform, selectedOption,
            isPrevious
        }


        // const response = await _POST(`${BASE_URL}ebux/${kpi}/fetch-platform-chart-data`, payload, {
        //     'Content-Type': 'application/json'
        // });
        let clientId = localStorage.getItem("client_id");
        const response = await _POST(`${BASE_URL}ebux/${kpi}/fetch-competition-platform-chart-data?clientId=${clientId}`, payload, {
            'Content-Type': 'application/json'
        });


        return response?.data?.data ?? [];
    } catch (error) {
        return [];
    }
}
import { _POST } from "../../../services/axios.method";
import { BASE_URL } from "../../../utils/url";

export const fetchKPIOverallData = async (kpi, filters, selectedFilters, selectedPlatform, isPrevious = false) => {
  try {

    let getActiveClientProject = JSON.parse(localStorage.getItem("active_client_project")) || {};
    let payload = {
      selectedFilters, selectedPlatform, isPrevious, kpi,
      filters: (getActiveClientProject?.isFilterDateWise ?
        {
          ...(
            (['OSA', 'CS', 'PRO', 'RR'].indexOf(kpi) > -1) ?
              {
                platform: filters?.platform,
                // brand: filters?.brand, 
                // keyword: filters?.keyword, 
                // keywordCategory: filters?.keywordCategory, 
                // category_node: filters?.category_node,
                //  category_som: filters?.category_som 
              }
              : (['SOS', 'OR', 'Wt_SOS'].indexOf(kpi) > -1) ? {
                platform: filters?.platform,
                //  brand: filters?.brand, 
                //  keyword: filters?.keyword, 
                //  keywordCategory: filters?.keywordCategory, 
                //  location: filters?.location, 
                //  category_node
                // : filters?.category_node, 
                // category_som: filters?.category_som 
              } : (['SOM'].indexOf(kpi) > -1)
                ? {
                  // keyword: filters?.keyword, 
                  // keywordCategory: filters?.keywordCategory, 
                  platform: filters?.platform,
                  // brand: filters?.brand 
                } : {}
          ),
        }
        : filters)
    }


    // const response = await _POST(`${BASE_URL}ebux/kpi-overall-report`, payload, {
    //   'Content-Type': 'application/json'  
    // });

    let id_token = localStorage.getItem("id_token");
    let clientId = localStorage.getItem("client_id");
    const response = await _POST(`${BASE_URL}ebux/kpi-overall-report?clientId=${clientId}`, payload,
      //   {
      //   'Content-Type': 'application/json'
      // }
      {
        headers: {
          idtoken: id_token
        },
      }
    );
    return response?.data?.data ?? [];
  } catch (error) {
    return [];
  }
};
export const fetchPlatformTabData = async (kpi, filters, selectedFilters, selectedPlatform, isPrevious = false) => {
  try {

    let getActiveClientProject = JSON.parse(localStorage.getItem("active_client_project")) || {};
    let payload = {
      selectedFilters, selectedPlatform, isPrevious,
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
              // brand: filters?.brand,
              //  keyword: filters?.keyword, 
              //  keywordCategory: filters?.keywordCategory, 
              //  location: filters?.location,
            } : (['SOM'].indexOf(kpi) > -1) ? {
              platform: filters?.platform,
              //  brand: filters?.brand,
              //  category_node: filters?.category_node, 
              //  category_som: filters?.category_som 
            } : {}
          ),
        }
        : filters)
    }


    // const response = await _POST(`${BASE_URL}ebux/${kpi}/fetch-platform-tab-data`, payload, {
    //     'Content-Type': 'application/json'
    // });

    let clientId = localStorage.getItem("client_id");
    const response = await _POST(`${BASE_URL}ebux/${kpi}/fetch-platform-tab-data?clientId=${clientId}`, payload, {
      'Content-Type': 'application/json'
    });


    return response?.data?.data ?? [];
  } catch (error) {
    return {};
  }
}
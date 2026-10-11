import { _POST } from "../../../../../services/axios.method";
import { BASE_URL } from "../../../../../utils/url";

export const fetchGlobalViewContinentCountryAnalysisData = async (payload = {}) => {
  try {
    let clientId = localStorage.getItem("client_id");
    const response = await _POST(`${BASE_URL}ebux/global-widgets/fetch-global-view-continent-country-analysis-data?clientId=${clientId}`, payload, {
      'Content-Type': 'application/json'
    });
    return response?.data?.data ?? {};
  } catch (error) {
    return {};
  }
}

export const fetchGlobalViewCombineFiltersPdpKw = async (kpi, pf_id = [], brand_id = [], brand_category_id = [], dateRangeData = {}) => {
  try {
    const payload = {
      kpi,
      pf_id,
      brand_id,
      brand_category_id,
      dateRangeData
    }
    let clientId = localStorage.getItem("client_id");
    const response = await _POST(`${BASE_URL}ebux/global-widgets/fetch-global-view-combined-filter-pdp-kw?clientId=${clientId}`, payload, {
      'Content-Type': 'application/json'
    });
    return response?.data?.data ?? {};
  } catch (error) {
    return {};
  }
}

export const getEbuxLocationsGlobalView = async (kpi, pf_id = [], dateRangeData = {}) => {

  try {
    const payload = {
      kpi,
      pf_id,
      dateRangeData
    }

    let id_token = localStorage.getItem("id_token");
    let clientId = localStorage.getItem("client_id");
    const response = await _POST(`${BASE_URL}ebux/global-widgets/fetch-global-view-location?clientId=${clientId}`, payload,
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
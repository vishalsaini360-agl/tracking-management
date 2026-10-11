import { _POST } from "../../../services/axios.method";
import { BASE_URL } from "../../../utils/url";

export const fetchSameDatePlatformPlacementBannersData = async (filters,selectedFilters,banner_id,banner_url,is_brand) => {
    try {
        const payload = {filters,selectedFilters,banner_id,banner_url,is_brand
        }

      const response = await _POST(`${BASE_URL}ebux/SOD/fetch-same-date-platform-placement-banners-data`, payload, {
        'Content-Type': 'application/json'
      });
      return response?.data?.data ?? [];
    } catch (error) {
      return [];
    }
  };
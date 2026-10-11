import { _POST } from "../../../services/axios.method";
import { BASE_URL } from "../../../utils/url";

export const fetchSentimentTabUniqueDataCount = async (kpi, breakdownFilters, filters, selectedFilters, selectedPlatform, selectedTableRows, tabData = [], sentimentState) => {
  try {
    let getActiveClientProject = JSON.parse(localStorage.getItem("active_client_project")) || {};
    const payload = {
      kpi,
      breakdownFilters,
      filters: (getActiveClientProject?.isFilterDateWise ?
        {
          platform: filters?.platform,
        }
        : filters),
      selectedFilters,
      selectedPlatform,
      selectedTableRows,
      tabData,
      sentimentState
    }
    let id_token = localStorage.getItem("id_token");
    let clientId = localStorage.getItem("client_id");
    const response = await _POST(`${BASE_URL}ebux/sentiment/sentiment-tab-data?clientId=${clientId}`, payload,
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
    // console.log("fetchComprehensiveBreakdownData-response", { error });
    return [];
  }
}

// ... existing code ...
export const getEbuxGraphicalRatingDistribution = async (is_competition_data, filters, selectedFilters, selectedPlatform, selectedOption, isPrevious = false) => {
  try {
    let getActiveClientProject = JSON.parse(localStorage.getItem("active_client_project")) || {};
    const payload = {
      is_competition_data,
      filters: (getActiveClientProject?.isFilterDateWise ?
        {
          platform: filters?.platform,
        }
        : filters),
      selectedFilters, selectedPlatform, selectedOption, isPrevious
    }
    let id_token = localStorage.getItem("id_token");
    let clientId = localStorage.getItem("client_id");

    const response = await _POST(`${BASE_URL}ebux/sentiment/graphical-rating-distribution?clientId=${clientId}`, payload,
      {
        headers: {
          idtoken: id_token
        },
      });

    return response?.data?.data ?? [];
  } catch (error) {
    console.error("Error fetching rating distribution:", error);
    return [];
  }
};


// ... existing code ...
export const getEbuxSentimentDistribution = async (filters, selectedFilters, selectedPlatform, selectedOption, isPrevious = false) => {
  try {
    const payload = { filters, selectedFilters, selectedPlatform, selectedOption, isPrevious }
    let id_token = localStorage.getItem("id_token");
    let clientId = localStorage.getItem("client_id");

    const response = await _POST(`${BASE_URL}ebux/sentiment/get-rating-distribution?clientId=${clientId}`, payload,
      {
        headers: {
          idtoken: id_token
        },
      });

    return response?.data?.data ?? { total_reviews: 0, distribution: [] };
  } catch (error) {
    console.error("Error fetching sentiment distribution:", error);
    return { total_reviews: 0, distribution: [] };
  }
};



export const getSentimentotalcount = async () => {
  try {
    const payload = {}
    let id_token = localStorage.getItem("id_token");
    let clientId = localStorage.getItem("client_id");

    const response = await _POST(`${BASE_URL}ebux/sentiment/get-total-count?clientId=${clientId}`, payload,
      {
        headers: {
          idtoken: id_token
        },
      });

    return response?.data?.data ?? [];
  } catch (error) {
    console.error("Error fetching review details:", error);
    return [];
  }
};

// ... existing code ...
export const getEbuxReviewDetails = async (filters, selectedFilters, selectedPlatform, isPrevious = false, startindex, limit) => {
  try {
    const payload = {
      filters, selectedFilters, selectedPlatform, isPrevious, startindex, limit
    }
    let id_token = localStorage.getItem("id_token");
    let clientId = localStorage.getItem("client_id");

    const response = await _POST(`${BASE_URL}ebux/sentiment/get-review-details?clientId=${clientId}`, payload,
      {
        headers: {
          idtoken: id_token
        },
      });

    return response?.data?.data ?? [];
  } catch (error) {
    console.error("Error fetching review details:", error);
    return [];
  }
};

export const getEbuxCategorySentiment = async (filters, selectedFilters, selectedPlatform, isPrevious = false, startindex, limit) => {
  try {
    const payload = { filters, selectedFilters, selectedPlatform, isPrevious, startindex, limit }
    let id_token = localStorage.getItem("id_token");
    let clientId = localStorage.getItem("client_id");

    const response = await _POST(`${BASE_URL}ebux/sentiment/get-category-sentiment?clientId=${clientId}`, payload,
      {
        headers: {
          idtoken: id_token
        },
      });

    return response?.data?.data ?? { categories: {} };
  } catch (error) {
    console.error("Error fetching category sentiment data:", error);
    return { categories: {} };
  }
};

export const getEbuxPlatformStats = async (is_competition = false, breakdownFilter, selectedFilters, isPrevious = false, startindex, limit, selectedFiltersCompetition = []) => {
  try {
    const payload = { is_competition, breakdownFilter, selectedFilters, isPrevious, startindex, limit, selectedFiltersCompetition }
    let id_token = localStorage.getItem("id_token");
    let clientId = localStorage.getItem("client_id");

    const response = await _POST(`${BASE_URL}ebux/sentiment/${is_competition ? `get-competition-reviews` : `get-platform-stats`}?clientId=${clientId}`, payload,
      {
        headers: {
          idtoken: id_token
        },
      });

    return response?.data ?? {
      data: {
        data: [],
        total: 0,
        summary: {
          total_reviews: 0,
          avg_rating: 0,
          total_platforms: 0,
          total_products: 0
        }
      }
    };
  } catch (error) {
    console.error("Error fetching platform stats:", error);
    return {
      data: {
        data: [],
        total: 0,
        summary: {
          total_reviews: 0,
          avg_rating: 0,
          total_platforms: 0,
          total_products: 0
        }
      }
    };
  }
};





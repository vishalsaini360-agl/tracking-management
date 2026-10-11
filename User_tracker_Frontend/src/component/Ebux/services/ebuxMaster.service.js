import { _POST, _GET, _PATCH, _DELETE, _PUT } from "../../../services/axios.method";
import { MASTER_CMS_CONFIGURATION_BASE_URL } from "../../../utils/url";
import { BASE_URL } from "../../../utils/url";
const getActiveClientProject = () => JSON.parse(localStorage.getItem("active_client_project")) || {};

export const getPlatformList = async () => {
  try {
    let id_token = localStorage.getItem("id_token");
    const response = await _GET(`${MASTER_CMS_CONFIGURATION_BASE_URL}/platforms?app_status=1`,
      {
        headers: {
          idtoken: id_token
        },
      }
    )
    return response?.data?.data ?? [];
  } catch (error) {
    return [];
  }
};


export const createBrandMaster = async (payload) => {
  try {
    let id_token = localStorage.getItem("id_token");
    const response = await _POST(`${MASTER_CMS_CONFIGURATION_BASE_URL}/brands`, payload,
      {
        headers: {
          idtoken: id_token
        },
      }
    );
    return response?.data?.data ?? [];
  } catch (error) {
    return {};
  }
};

export const getBrandList = async () => {
  try {
    let clientId = localStorage.getItem("client_id");
    const response = await _GET(`${MASTER_CMS_CONFIGURATION_BASE_URL}/brands`,
      {
        headers: {
          clientId: clientId
        },
      }
    );
    return response?.data?.data ?? {};
  } catch (error) {
    return {};
  }
};

export const UpdateIsBrandAndStatus = async (id, payload) => {
  try {
    let id_token = localStorage.getItem("id_token");
    const response = await _PATCH(`${MASTER_CMS_CONFIGURATION_BASE_URL}/brands/${id}`, payload,
      {
        headers: {
          idtoken: id_token
        },
      }
    );
    return response?.data?.data ?? [];
  } catch (error) {
    return {};
  }
};

export const DeleteBrandMaster = async (id) => {
  try {
    let id_token = localStorage.getItem("id_token");
    const response = await _DELETE(`${MASTER_CMS_CONFIGURATION_BASE_URL}/brands/${id}`,
      {
        headers: {
          idtoken: id_token
        },
      }
    );
    return response?.data?.data ?? [];
  } catch (error) {
    return {};
  }
};

export const updateBrandMaster = async (id, payload) => {
  try {
    let id_token = localStorage.getItem("id_token");
    const response = await _PUT(`${MASTER_CMS_CONFIGURATION_BASE_URL}/brands/${id}`, payload,
      {
        headers: {
          idtoken: id_token
        },
      }
    );
    return response?.data?.data ?? [];
  } catch (error) {
    return {};
  }
};

// for sub brand
export const getSubBrandList = async () => {
  try {
    let clientId = localStorage.getItem("client_id");
    const response = await _GET(`${MASTER_CMS_CONFIGURATION_BASE_URL}/sub-brands`,
      {
        headers: {
          clientId: clientId
        },
      }
    );
    return response?.data?.data ?? {};
  } catch (error) {
    return {};
  }
};

export const UpdateIsBrandAndStatusForSubBrand = async (id, payload) => {
  try {
    let id_token = localStorage.getItem("id_token");
    const response = await _PATCH(`${MASTER_CMS_CONFIGURATION_BASE_URL}/brands/${id}`, payload,
      {
        headers: {
          idtoken: id_token
        },
      }
    );
    return response?.data?.data ?? [];
  } catch (error) {
    return {};
  }
};

export const DeleteSubBrandMaster = async (id) => {
  try {
    let id_token = localStorage.getItem("id_token");
    const response = await _DELETE(`${MASTER_CMS_CONFIGURATION_BASE_URL}/brands/${id}`,
      {
        headers: {
          idtoken: id_token
        },
      }
    );
    return response?.data?.data ?? [];
  } catch (error) {
    return {};
  }
};

export const createSubBrandMaster = async (payload) => {
  try {
    let id_token = localStorage.getItem("id_token");
    const response = await _POST(`${MASTER_CMS_CONFIGURATION_BASE_URL}/sub-brands`, payload,
      {
        headers: {
          idtoken: id_token
        },
      }
    );
    return response?.data?.data ?? [];
  } catch (error) {
    return {};
  }
};

export const UpdateSubBrandMaster = async (id, payload) => {
  try {
    let id_token = localStorage.getItem("id_token");
    const response = await _PUT(`${MASTER_CMS_CONFIGURATION_BASE_URL}/sub-brands/${id}`, payload,
      {
        headers: {
          idtoken: id_token
        },
      }
    );
    return response?.data?.data ?? [];
  } catch (error) {
    return {};
  }
};

// Categoty master services

export const createCategoryMaster = async (payload) => {
  try {
    let id_token = localStorage.getItem("id_token");
    const response = await _POST(`${MASTER_CMS_CONFIGURATION_BASE_URL}/categories`, payload,
      {
        headers: {
          idtoken: id_token
        },
      }
    );
    return response?.data?.data ?? [];
  } catch (error) {
    return {};
  }
};

export const getCategoryList = async () => {
  try {
    let clientId = localStorage.getItem("client_id");
    const response = await _GET(`${MASTER_CMS_CONFIGURATION_BASE_URL}/categories`,
      {
        headers: {
          clientId: clientId
        },
      }
    );
    return response?.data?.data ?? {};
  } catch (error) {
    return {};
  }
};

export const UpdateIsBrandAndStatusForCategory = async (id, payload) => {
  try {
    let id_token = localStorage.getItem("id_token");
    const response = await _PATCH(`${MASTER_CMS_CONFIGURATION_BASE_URL}/categories/${id}`, payload,
      {
        headers: {
          idtoken: id_token
        },
      }
    );
    return response?.data?.data ?? [];
  } catch (error) {
    return {};
  }
};

export const DeleteCategoryMaster = async (id) => {
  try {
    let id_token = localStorage.getItem("id_token");
    const response = await _DELETE(`${MASTER_CMS_CONFIGURATION_BASE_URL}/categories/${id}`,
      {
        headers: {
          idtoken: id_token
        },
      }
    );
    return response?.data?.data ?? [];
  } catch (error) {
    return {};
  }
};


// for sub category
export const getSubCategoryList = async () => {
  try {
    let clientId = localStorage.getItem("client_id");
    const response = await _GET(`${MASTER_CMS_CONFIGURATION_BASE_URL}/sub-categories`,
      {
        headers: {
          clientId: clientId
        },
      }
    );
    return response?.data?.data ?? {};
  } catch (error) {
    return {};
  }
};

export const UpdateIsBrandAndStatusForSubCategory = async (id, payload) => {
  try {
    let id_token = localStorage.getItem("id_token");
    const response = await _PATCH(`${MASTER_CMS_CONFIGURATION_BASE_URL}/sub-categories/${id}`, payload,
      {
        headers: {
          idtoken: id_token
        },
      }
    );
    return response?.data?.data ?? [];
  } catch (error) {
    return {};
  }
};

export const DeleteSubCategoryMaster = async (id) => {
  try {
    let id_token = localStorage.getItem("id_token");
    const response = await _DELETE(`${MASTER_CMS_CONFIGURATION_BASE_URL}/sub-categories/${id}`,
      {
        headers: {
          idtoken: id_token
        },
      }
    );
    return response?.data?.data ?? [];
  } catch (error) {
    return {};
  }
};

export const createSubCategoryMaster = async (payload) => {
  try {
    let id_token = localStorage.getItem("id_token");
    const response = await _POST(`${MASTER_CMS_CONFIGURATION_BASE_URL}/sub-categories`, payload,
      {
        headers: {
          idtoken: id_token
        },
      }
    );
    return response?.data?.data ?? [];
  } catch (error) {
    return {};
  }
};

// Content Score Weightage Services

export const getContentScoreWeightage = async (platformId) => {
  try {
    let id_token = localStorage.getItem("id_token");
    const response = await _GET(`${MASTER_CMS_CONFIGURATION_BASE_URL}/platform-content/${platformId}`,
      {
        headers: {
          idtoken: id_token
        },
      }
    );
    return response?.data?.data ?? {};
  } catch (error) {
    return {};
  }
};

export const saveContentScoreWeightage = async (selectedPlatform, payload) => {
  try {
    let id_token = localStorage.getItem("id_token");
    const response = await _PUT(`${MASTER_CMS_CONFIGURATION_BASE_URL}/platform-content/${selectedPlatform}`, payload,
      {
        headers: {
          idtoken: id_token
        },
      }
    );
    return response?.data?.data ?? [];
  } catch (error) {
    return {};
  }
};



//  by box seller settings services can be added here

// export const getByBoxSellerSettings = async (page=0,limit=10) => {
//   try {
//     let id_token= localStorage.getItem("id_token");
//     const response = await _GET(`${MASTER_CMS_CONFIGURATION_BASE_URL}/seller-master?page=${page}&limit=${limit}`,
//       {
//         headers: {
//           idtoken: id_token
//         },
//       }
//     );
//     return response?.data ?? {};
//   } catch (error) {
//     return {};
//   }
// };

// export const getByBoxSellerSettings = async (page = 1, limit = 10, seller_type = "", seller_name="") => {
//   try {
//     const id_token = localStorage.getItem("id_token");

//     const params = new URLSearchParams({
//       page: String(page),
//       limit: String(limit),
//     });

//     if (seller_type) {
//       params.append("seller_type", seller_type);
//     }
//     console.log('seller_nameseller_nameseller_namee',seller_name)
//     if (seller_name) {
//       params.append("seller_type", seller_type);
//     }

//     const response = await _GET(
//       `${MASTER_CMS_CONFIGURATION_BASE_URL}/seller-master?${params.toString()}`,
//       {
//         headers: {
//           idtoken: id_token,
//         },
//       }
//     );
//     return response?.data ?? {};
//   } catch (error) {
//     console.error("getByBoxSellerSettings error:", error);
//     return {};
//   }
// };

export const getByBoxSellerSettings = async (
  page = 1,
  limit = 10,
  seller_type = "",
  seller_name = "",
  platform_id = "",
) => {
  try {
    const id_token = localStorage.getItem("id_token");

    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });

    if (seller_type) {
      params.append("seller_type", seller_type);
    }

    if (seller_name) {
      params.append("seller_name", seller_name);
    }
    if (platform_id) {
      params.append("pf_id", platform_id);
    }
    const api_url = getActiveClientProject()?.isBuyBoxWithPF ? "seller-master-pf" : "seller-master";
    const response = await _GET(
      `${MASTER_CMS_CONFIGURATION_BASE_URL}/${api_url}?${params.toString()}`,
      {
        headers: {
          idtoken: id_token,
        },
      }
    );

    return response?.data ?? {};
  } catch (error) {
    console.error("getByBoxSellerSettings error:", error);
    return {};
  }
};



export const updateByBoxSellerSettings = async (payload) => {
  try {
    let id_token = localStorage.getItem("id_token");


    const api_url = getActiveClientProject()?.isBuyBoxWithPF ? "seller-master-pf" : "seller-master";
    const response = await _PUT(`${MASTER_CMS_CONFIGURATION_BASE_URL}/${api_url}/seller-type/bulk`, payload,
      {
        headers: {
          idtoken: id_token
        },
      }
    );
    // console.log('responseresponse', response?.data)
    return response?.data?.data ?? [];
  } catch (error) {
    return {};
  }
};

export const updateByBoxSellerAutoAssigned = async (payload) => {
  try {
    let id_token = localStorage.getItem("id_token");
    const response = await _PATCH(`${MASTER_CMS_CONFIGURATION_BASE_URL}/cms-config/is_seller_type_autoset`, payload,
      {
        headers: {
          idtoken: id_token
        },
      }
    );
    // console.log('responseresponse', response?.data)
    return response?.data?.data ?? [];
  } catch (error) {
    return {};
  }
};

export const getByBoxTrendGraphicalData = async ({ startDate, endDate }) => {
  try {
    let id_token = localStorage.getItem("id_token");
    const response = await _GET(`${MASTER_CMS_CONFIGURATION_BASE_URL}/seller-master/trending/line-chart?start_date=${startDate}&end_date=${endDate}`,
      {
        headers: {
          idtoken: id_token
        },
      }
    );
    return response?.data ?? {};
  } catch (error) {
    return {};
  }
};


export const fetchBuyBoxTileData = async (filters, selectedFilters, selectedPlatform) => {
  try {
    const payload = {
      filters: (getActiveClientProject()?.isFilterDateWise ? { platform: filters?.platform ?? [] } : filters),
      selectedFilters, selectedPlatform
    }
    let clientId = localStorage.getItem("client_id");
    const response = await _POST(`${BASE_URL}ebux/buy-box/fetch-overall-tile-data?clientId=${clientId}`, payload, {
      'Content-Type': 'application/json'
    });


    return response?.data?.data ?? [];
  } catch (error) {
    return [];
  }
}

export const fetchPlatformChartData = async (filters, selectedFilters, selectedPlatform) => {
  try {

    const payload = {
      filters: (getActiveClientProject()?.isFilterDateWise ? { platform: filters?.platform ?? [] } : filters),
      selectedFilters, selectedPlatform
    }

    let clientId = localStorage.getItem("client_id");
    const response = await _POST(`${BASE_URL}ebux/buy-box/fetch-platform-chart-data?clientId=${clientId}`, payload, {
      'Content-Type': 'application/json'
    });


    return response?.data?.data ?? [];
  } catch (error) {
    return [];
  }
}

export const fetchSellerList = async (filters, selectedFilters, selectedPlatform) => {
  try {
    const payload = {
      filters: (getActiveClientProject()?.isFilterDateWise ? { platform: filters?.platform ?? [] } : filters),
      selectedFilters, selectedPlatform
    }
    let clientId = localStorage.getItem("client_id");
    const response = await _POST(`${BASE_URL}ebux/buy-box/fetch-seller-list?clientId=${clientId}`, payload, {
      'Content-Type': 'application/json'
    });
    return response?.data?.data ?? [];
  } catch (error) {
    return [];
  }
}

export const fetchComprehensiveBreakdownTable = async (payload) => {
  try {
    if (getActiveClientProject()?.isFilterDateWise && payload?.filters) {
      payload.filters = { platform: payload?.filters?.platform ?? [] }
    }
    let clientId = localStorage.getItem("client_id");
    const response = await _POST(`${BASE_URL}ebux/buy-box/fetch-comprehensive-breakdown-table?clientId=${clientId}`, payload, {
      'Content-Type': 'application/json'
    });
    return response?.data?.data ?? [];
  } catch (error) {
    return [];
  }
}

export const getBuyBoxSellerType = async (payload) => {
  try {
    if (getActiveClientProject()?.isFilterDateWise && payload?.filters) {
      payload.filters = { platform: payload?.filters?.platform ?? [] }
    }
    let clientId = localStorage.getItem("client_id");
    const response = await _POST(`${BASE_URL}ebux/buy-box/get-seller-type?clientId=${clientId}`, payload, {
      'Content-Type': 'application/json'
    });
    return response?.data?.data ?? [];
  } catch (error) {
    return [];
  }
};

export const getBuyBoxSellerTypeAndSellers = async (payload = {}) => {
  try {
    if (getActiveClientProject()?.isFilterDateWise && payload?.filters) {
      payload.filters = { platform: payload?.filters?.platform ?? [] }
    }
    let clientId = localStorage.getItem("client_id");
    const response = await _POST(`${BASE_URL}ebux/buy-box/get-seller-type-and-sellers?clientId=${clientId}`, payload, {
      'Content-Type': 'application/json'
    });
    return response?.data?.data ?? [];
  } catch (error) {
    return [];
  }
};
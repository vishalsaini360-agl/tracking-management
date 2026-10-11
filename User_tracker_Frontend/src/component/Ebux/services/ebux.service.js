import {
  _POST
  // , _GETWIthToken
} from "../../../services/axios.method";
import { BASE_URL } from "../../../utils/url";

export const getMinMaxDate = async () => {
  try {
    let id_token = localStorage.getItem("id_token");
    let clientId = localStorage.getItem("client_id");
    let response = await _POST(`${BASE_URL}ebux/min-max-date?clientId=${clientId}`, {}, {
      headers: {
        idtoken: id_token
      }
    });

    // if (!response?.data) {
    //   response = await _GETWIthToken(`${BASE_URL}ebux/min-max-date`);
    // }

    const data = response?.data?.data ?? response?.data ?? {};
    return {
      minDate: data?.minDate || data?.min_date || null,
      maxDate: data?.maxDate || data?.max_date || null,
      ...data
    };
  } catch (error) {
    console.error("Error fetching min-max-date:", error);
    return { minDate: null, maxDate: null };
  }
};

export const getEbuxClientCustomizeColumnsComprehensiveBreakdown = async () => {

  try {
    const payload = {}
    // const response = await _POST(`${BASE_URL}ebux/client-customize-columns-comprehensive-breakdown`, payload, {
    //   'Content-Type': 'application/json'
    // });

    let id_token = localStorage.getItem("id_token");
    let clientId = localStorage.getItem("client_id");
    const response = await _POST(`${BASE_URL}ebux/client-customize-columns-comprehensive-breakdown?clientId=${clientId}`, payload,
      //   {
      //   'Content-Type': 'application/json'
      // }
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

export const getEbuxDarkstoreLocation = async (kpi, pf_id = [], dateRangeData = {}) => {

  try {
    const payload = {
      kpi,
      pf_id,
      dateRangeData
    }
    // const response = await _POST(`${BASE_URL}ebux/location-new`, payload, {
    //   'Content-Type': 'application/json'
    // });
    let id_token = localStorage.getItem("id_token");
    let clientId = localStorage.getItem("client_id");
    const response = await _POST(`${BASE_URL}ebux/darkstore?clientId=${clientId}`, payload,
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
export const getEbuxLocationsNew = async (kpi, pf_id = [], active_location_status = undefined, dateRangeData = {}) => {

  try {
    const payload = {
      kpi,
      pf_id,
      active_location_status,
      dateRangeData
    }
    // const response = await _POST(`${BASE_URL}ebux/location-new`, payload, {
    //   'Content-Type': 'application/json'
    // });
    let id_token = localStorage.getItem("id_token");
    let clientId = localStorage.getItem("client_id");
    const response = await _POST(`${BASE_URL}ebux/location-new?clientId=${clientId}`, payload,
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
export const getEbuxLocations = async (pf_id = []) => {
  try {
    const payload = {
      pf_id
    }
    // const response = await _POST(`${BASE_URL}ebux/location`, payload, {
    //   'Content-Type': 'application/json'
    // });
    let id_token = localStorage.getItem("id_token");
    let clientId = localStorage.getItem("client_id");
    const response = await _POST(`${BASE_URL}ebux/location?clientId=${clientId}`, payload,
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

export const getEbuxKeywordCategories = async (pf_id = [], brand_id = []) => {
  try {
    const payload = {
      pf_id,
      brand_id
    }
    // const response = await _POST(`${BASE_URL}ebux/keyword_category`, payload, {
    //   'Content-Type': 'application/json'
    // });
    let id_token = localStorage.getItem("id_token");
    let clientId = localStorage.getItem("client_id");
    const response = await _POST(`${BASE_URL}ebux/keyword_category?clientId=${clientId}`, payload,
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
export const getEbuxKeywordType = async (pf_id = [], brand_id = []) => {
  try {
    const payload = {
      pf_id,
      brand_id
    }
    // console.log('payloadpayload-new',payload)
    // const response = await _POST(`${BASE_URL}ebux/keyword_type`, payload, {
    //   'Content-Type': 'application/json'
    // });
    let id_token = localStorage.getItem("id_token");
    let clientId = localStorage.getItem("client_id");
    const response = await _POST(`${BASE_URL}ebux/keyword_type?clientId=${clientId}`, payload,
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

export const getEbuxOSARemarks = async () => {
  try {
    const payload = {
    }
    // const response = await _POST(`${BASE_URL}ebux/keyword`, payload, {
    //   'Content-Type': 'application/json'
    // });
    let id_token = localStorage.getItem("id_token");
    let clientId = localStorage.getItem("client_id");
    const response = await _POST(`${BASE_URL}ebux/osa-remarks?clientId=${clientId}`, payload,
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
export const getEbuxKeywords = async (pf_id = [], brand_id = [], keyword_category = []) => {
  try {
    const payload = {
      pf_id,
      brand_id,
      keyword_category
    }
    // const response = await _POST(`${BASE_URL}ebux/keyword`, payload, {
    //   'Content-Type': 'application/json'
    // });
    let id_token = localStorage.getItem("id_token");
    let clientId = localStorage.getItem("client_id");
    const response = await _POST(`${BASE_URL}ebux/keyword?clientId=${clientId}`, payload,
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

export const getEbuxMotherPack = async (pf_id = [], brand_id = [], brand_category_id = [], msl = null) => {
  try {
    const payload = {
      pf_id,
      brand_id,
      brand_category_id,
      msl
    }
    // const response = await _POST(`${BASE_URL}ebux/products`, payload, {
    //   'Content-Type': 'application/json'
    // });
    let id_token = localStorage.getItem("id_token");
    let clientId = localStorage.getItem("client_id");
    const response = await _POST(`${BASE_URL}ebux/mother_pack?clientId=${clientId}`, payload,
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
export const getEbuxColPalMtPpg = async (pf_id = [], brand_id = [], brand_category_id = [], msl = null) => {
  try {
    const payload = {
      pf_id,
      brand_id,
      brand_category_id,
      msl
    }
    // const response = await _POST(`${BASE_URL}ebux/products`, payload, {
    //   'Content-Type': 'application/json'
    // });
    let id_token = localStorage.getItem("id_token");
    let clientId = localStorage.getItem("client_id");
    const response = await _POST(`${BASE_URL}ebux/product-ppg?clientId=${clientId}`, payload,
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
export const getEbuxProducts = async (pf_id = [], brand_id = [], brand_category_id = [], msl = null, mother_pack = [], ppg = []) => {
  try {
    const payload = {
      pf_id,
      brand_id,
      brand_category_id,
      msl,
      mother_pack,
      ppg
    }
    // const response = await _POST(`${BASE_URL}ebux/products`, payload, {
    //   'Content-Type': 'application/json'
    // });
    let id_token = localStorage.getItem("id_token");
    let clientId = localStorage.getItem("client_id");
    const response = await _POST(`${BASE_URL}ebux/products?clientId=${clientId}`, payload,
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

export const getEbuxSubCategories = async (pf_id = [], brand_id = []) => {

  try {
    const payload = {
      pf_id,
      brand_id
    }
    // const response = await _POST(`${BASE_URL}ebux/brand_category`, payload, {
    //   'Content-Type': 'application/json'
    // });
    let id_token = localStorage.getItem("id_token");
    let clientId = localStorage.getItem("client_id");
    const response = await _POST(`${BASE_URL}ebux/sub_category?clientId=${clientId}`, payload,
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
export const getEbuxCategories = async (pf_id = [], brand_id = []) => {

  try {
    const payload = {
      pf_id,
      brand_id
    }
    // const response = await _POST(`${BASE_URL}ebux/brand_category`, payload, {
    //   'Content-Type': 'application/json'
    // });
    let id_token = localStorage.getItem("id_token");
    let clientId = localStorage.getItem("client_id");
    const response = await _POST(`${BASE_URL}ebux/brand_category?clientId=${clientId}`, payload,
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

export const getEbuxBrands = async (kpi, is_brand = true, brand_ids = [], category_ids = []) => {

  try {
    const payload = {
      kpi,
      is_brand,
      brand_ids,
      category_ids
    }
    // const response = await _POST(`${BASE_URL}ebux/brands`, payload, {
    //   'Content-Type': 'application/json'
    // });
    let id_token = localStorage.getItem("id_token");
    let clientId = localStorage.getItem("client_id");
    const response = await _POST(`${BASE_URL}ebux/brands?clientId=${clientId}`, payload,
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
export const getEbuxUserUnsubscribedPlatforms = async (kpi, pf_id = []) => {
  try {
    const payload = {
      kpi,
      pf_id
    }
    // const response = await _POST(`${BASE_URL}ebux/unsubscribed-platform`, payload, {
    //   'Content-Type': 'application/json'
    // });
    let id_token = localStorage.getItem("id_token");
    let clientId = localStorage.getItem("client_id");
    const response = await _POST(`${BASE_URL}ebux/unsubscribed-platform?clientId=${clientId}`, payload,
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
export const getEbuxPlatforms = async (kpi, pf_id = []) => {
  try {
    const payload = {
      kpi,
      pf_id
    }
    // console.log("payload-bbb",payload)
    // const response = await _POST(`${BASE_URL}ebux/subscribed-platform`, payload, {
    //   'Content-Type': 'application/json'
    // });
    let id_token = localStorage.getItem("id_token");
    let clientId = localStorage.getItem("client_id");
    const response = await _POST(`${BASE_URL}ebux/subscribed-platform?clientId=${clientId}`, payload,
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
export const getEbuxCompetitionBrands = async (kpi) => {

  try {
    const payload = {
      kpi
    }
    // const response = await _POST(`${BASE_URL}ebux/competition-brands`, {}, {
    //   'Content-Type': 'application/json'
    // });
    let id_token = localStorage.getItem("id_token");
    let clientId = localStorage.getItem("client_id");
    const response = await _POST(`${BASE_URL}ebux/competition-brands?clientId=${clientId}`, payload,
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

export const getEbuxCompetitionBrandsWithPlatform = async (kpi, brand_id = undefined, mother_brand_id = [], sub_brand_id = [], pf_id = [], selectedFilters = {}) => {
  try {
    const payload = {
      kpi,
      brand_id,
      mother_brand_id,
      sub_brand_id,
      pf_id,
      selectedFilters
    }
    let id_token = localStorage.getItem("id_token");
    let clientId = localStorage.getItem("client_id");
    const response = await _POST(`${BASE_URL}ebux/competition-brands-with-platform?clientId=${clientId}`, payload,
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



export const getEbuxSODPageLocation = async () => {
  try {
    const payload = {}
    let id_token = localStorage.getItem("id_token");
    let clientId = localStorage.getItem("client_id");
    const response = await _POST(`${BASE_URL}ebux/get-sod-page-location?clientId=${clientId}`, payload,

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


export const getEbuxSODDisplayAdType = async () => {
  try {
    const payload = {}

    let id_token = localStorage.getItem("id_token");
    let clientId = localStorage.getItem("client_id");
    const response = await _POST(`${BASE_URL}ebux/get-sod-display-ad-type?clientId=${clientId}`, payload,

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

export const getKeywordCategorySom = async (pf_id = []) => {
  try {
    const payload = {
      pf_id,

    }
    // const response = await _POST(`${BASE_URL}ebux/keyword`, payload, {
    //   'Content-Type': 'application/json'
    // });
    let id_token = localStorage.getItem("id_token");
    let clientId = localStorage.getItem("client_id");
    const response = await _POST(`${BASE_URL}ebux/category-som?clientId=${clientId}`, payload,
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



export const getCategory_node = async (pf_id = [], keyword_category = []) => {
  try {
    const payload = {
      pf_id,

      keyword_category
    }
    // const response = await _POST(`${BASE_URL}ebux/keyword`, payload, {
    //   'Content-Type': 'application/json'
    // });
    let id_token = localStorage.getItem("id_token");
    let clientId = localStorage.getItem("client_id");
    const response = await _POST(`${BASE_URL}ebux/category-node?clientId=${clientId}`, payload,
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


// darkstore services

export const getEbuxPlatformsDarkStore = async (kpi, pf_id = []) => {
  try {
    const payload = {
      kpi,
      pf_id
    }
    // console.log("payload-bbb",payload)
    // const response = await _POST(`${BASE_URL}ebux/subscribed-platform`, payload, {
    //   'Content-Type': 'application/json'
    // });
    let id_token = localStorage.getItem("id_token");
    let clientId = localStorage.getItem("client_id");
    const response = await _POST(`${BASE_URL}ebux/subscribed-platform-dark-store?clientId=${clientId}`, payload,
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

export const getEbuxBrandsDarkStore = async (kpi, pf_ids = [], is_brand = true, brand_ids = [], category_ids = []) => {

  try {
    const payload = {
      kpi,
      is_brand,
      brand_ids,
      category_ids,
      pf_ids
    }
    // const response = await _POST(`${BASE_URL}ebux/brands`, payload, {
    //   'Content-Type': 'application/json'
    // });
    let id_token = localStorage.getItem("id_token");
    let clientId = localStorage.getItem("client_id");
    const response = await _POST(`${BASE_URL}ebux/brands-dark-store?clientId=${clientId}`, payload,
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

export const getEbuxCategoriesDarkStore = async (pf_id = [], brand_id = []) => {

  try {
    const payload = {
      pf_id,
      brand_id
    }
    // const response = await _POST(`${BASE_URL}ebux/brand_category`, payload, {
    //   'Content-Type': 'application/json'
    // });
    let id_token = localStorage.getItem("id_token");
    let clientId = localStorage.getItem("client_id");
    const response = await _POST(`${BASE_URL}ebux/brand_category-dark-store?clientId=${clientId}`, payload,
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


export const getEbuxMotherPackDarkStore = async (pf_id = [], brand_id = [], brand_category_id = [], msl = null) => {
  try {
    const payload = {
      pf_id,
      brand_id,
      brand_category_id,
      msl
    }
    // const response = await _POST(`${BASE_URL}ebux/products`, payload, {
    //   'Content-Type': 'application/json'
    // });
    let id_token = localStorage.getItem("id_token");
    let clientId = localStorage.getItem("client_id");
    const response = await _POST(`${BASE_URL}ebux/mother_pack-dark-store?clientId=${clientId}`, payload,
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


export const getEbuxProductsDarkStore = async (pf_id = [], brand_id = [], brand_category_id = [], msl = null, mother_pack = [], ppg = [], dateRangeData = {}) => {
  try {
    const payload = {
      pf_id,
      brand_id,
      brand_category_id,
      msl,
      mother_pack,
      ppg,
      dateRangeData
    }
    // const response = await _POST(`${BASE_URL}ebux/products`, payload, {
    //   'Content-Type': 'application/json'
    // });
    let id_token = localStorage.getItem("id_token");
    let clientId = localStorage.getItem("client_id");
    const response = await _POST(`${BASE_URL}ebux/products-dark-store?clientId=${clientId}`, payload,
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

export const fetchKPIOverallDataDarkStore = async (kpi, filters, selectedFilters, selectedPlatform, isPrevious = false) => {
  try {
    let getActiveClientProject = JSON.parse(localStorage.getItem("active_client_project")) || {};
    const payload = {
      filters: (getActiveClientProject?.isFilterDateWise ? { platform: filters?.platform } : filters), selectedFilters, selectedPlatform,
      isPrevious, kpi
    }

    // const response = await _POST(`${BASE_URL}ebux/kpi-overall-report`, payload, {
    //   'Content-Type': 'application/json'
    // });

    let id_token = localStorage.getItem("id_token");
    let clientId = localStorage.getItem("client_id");
    const response = await _POST(`${BASE_URL}ebux/kpi-overall-report-dark-store?clientId=${clientId}`, payload,
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



export const fetchPlatformTabDataDarkStore = async (kpi, filters, selectedFilters, selectedPlatform, isPrevious = false) => {
  try {
    let getActiveClientProject = JSON.parse(localStorage.getItem("active_client_project")) || {};
    const payload = {
      filters: (getActiveClientProject?.isFilterDateWise ? { platform: filters?.platform } : filters), selectedFilters, selectedPlatform,
      isPrevious
    }


    // const response = await _POST(`${BASE_URL}ebux/${kpi}/fetch-platform-tab-data`, payload, {
    //     'Content-Type': 'application/json'
    // });

    let clientId = localStorage.getItem("client_id");
    const response = await _POST(`${BASE_URL}ebux/${kpi}/fetch-platform-tab-data-dark-store?clientId=${clientId}`, payload, {
      'Content-Type': 'application/json'
    });


    return response?.data?.data ?? [];
  } catch (error) {
    return {};
  }
}

export const getDistinctFiltersDarkStore = async (filters) => {
  try {

    let clientId = localStorage.getItem("client_id");
    const response = await _POST(`${BASE_URL}ebux/get-distinct-filters-dark-store?clientId=${clientId}`, filters, {
      'Content-Type': 'application/json'
    });


    return response?.data?.data ?? [];
  } catch (error) {
    return {};
  }
}


export const getEbuxLocationsNewDarkStore = async (kpi, pf_id = [], active_location_status = undefined, dateRangeData = {}) => {

  try {
    const payload = {
      kpi,
      pf_id,
      active_location_status,
      dateRangeData
    }
    // const response = await _POST(`${BASE_URL}ebux/location-new`, payload, {
    //   'Content-Type': 'application/json'
    // });
    let id_token = localStorage.getItem("id_token");
    let clientId = localStorage.getItem("client_id");
    const response = await _POST(`${BASE_URL}ebux/location-new-dark-store?clientId=${clientId}`, payload,
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


export const getStoreDataIdDarkStore = async (kpi, pf_id = [], active_location_status = undefined, dateRangeData = {}) => {

  try {
    const payload = {
      kpi,
      pf_id,
      active_location_status,
      dateRangeData
    }
    // const response = await _POST(`${BASE_URL}ebux/location-new`, payload, {
    //   'Content-Type': 'application/json'
    // });
    let id_token = localStorage.getItem("id_token");
    let clientId = localStorage.getItem("client_id");
    const response = await _POST(`${BASE_URL}ebux/get-store-data-id-dark-store?clientId=${clientId}`, payload,
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

export const getCombineFilterWidget = async (kpi, pf_id = [], brand_id = [], brand_category_id = [], mother_pack = [], web_pid = [], range = [], msl = 'all', product_tag = [], dateRangeData = {}, PVM_Category_id = []) => {
  try {
    const payload = {
      kpi,
      pf_id,
      brand_id,
      brand_category_id,
      mother_pack,
      web_pid,
      msl,
      product_tag,
      dateRangeData,
      PVM_Category_id,
      range
    }
    // console.log("payload-bbb",payload)
    // const response = await _POST(`${BASE_URL}ebux/subscribed-platform`, payload, {
    //   'Content-Type': 'application/json'
    // });
    let id_token = localStorage.getItem("id_token");
    let clientId = localStorage.getItem("client_id");
    const response = await _POST(`${BASE_URL}ebux/widget/combined-filter-pdp?clientId=${clientId}`, payload,
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
export const getCombineFilterCompetitionWidget = async (kpi, pf_id = [], brand_id = [], brand_category_id = [], mother_pack = [], web_pid = [], msl = 'all', product_tag = [], dateRangeData = {}, filters = [], selectedFilters = []) => {
  try {
    const payload = {
      kpi,
      pf_id,
      brand_id,
      brand_category_id,
      mother_pack,
      web_pid,
      msl,
      product_tag,
      dateRangeData,
      // filters,
      // selectedFilters,
      filters: { competition_brand: filters?.competition_brand },
      selectedFilters: { selectedBrand: selectedFilters?.selectedBrand }
    }
    // console.log("payload-bbb",payload)
    // const response = await _POST(`${BASE_URL}ebux/subscribed-platform`, payload, {
    //   'Content-Type': 'application/json'
    // });
    let id_token = localStorage.getItem("id_token");
    let clientId = localStorage.getItem("client_id");
    const response = await _POST(`${BASE_URL}ebux/widget/combined-filter-pdp-competition?clientId=${clientId}`, payload,
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
export const getCombineFilterCompetitionWidgetKW = async (kpi, pf_id = [], brand_id = [], brand_category_id = [], keyword_id = [], keyword_tag = [], dateRangeData = {}, filters = [], selectedFilters = []) => {
  try {
    const payload = {
      kpi,
      pf_id,
      brand_id,
      brand_category_id,
      keyword_id,
      keyword_tag,
      dateRangeData,
      // filters,
      // selectedFilters,
      filters: { competition_brand: filters?.competition_brand },
      selectedFilters: { selectedBrand: selectedFilters?.selectedBrand }
    }
    // console.log("payload-bbb",payload)
    // const response = await _POST(`${BASE_URL}ebux/subscribed-platform`, payload, {
    //   'Content-Type': 'application/json'
    // });
    let id_token = localStorage.getItem("id_token");
    let clientId = localStorage.getItem("client_id");
    const response = await _POST(`${BASE_URL}ebux/widget/combined-filter-kw-competition?clientId=${clientId}`, payload,
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

export const getCombineFilterWidgetKW = async (kpi, pf_id = [], brand_id = [], brand_category_id = [], keyword_id = [], keyword_tag = [], dateRangeData = {}, PVM_Category_id = []) => {
  try {
    const payload = {
      kpi,
      pf_id,
      brand_id,
      brand_category_id,
      keyword_id,
      keyword_tag,
      dateRangeData,
      PVM_Category_id
    }
    // console.log("payload-bbb",payload)
    // const response = await _POST(`${BASE_URL}ebux/subscribed-platform`, payload, {
    //   'Content-Type': 'application/json'
    // });
    let id_token = localStorage.getItem("id_token");
    let clientId = localStorage.getItem("client_id");
    const response = await _POST(`${BASE_URL}ebux/widget/combined-filter-kw?clientId=${clientId}`, payload,
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

export const getCombineFilterWidgetSOM = async (kpi, pf_id = [], brand_id = [], category_id = [], category_node_id = [], dateRangeData = {}) => {
  try {
    const payload = {
      kpi,
      pf_id,
      brand_id,
      category_id,
      category_node_id,
      dateRangeData
    }
    // console.log("payload-bbb",payload)
    // const response = await _POST(`${BASE_URL}ebux/subscribed-platform`, payload, {
    //   'Content-Type': 'application/json'
    // });
    let id_token = localStorage.getItem("id_token");
    let clientId = localStorage.getItem("client_id");
    const response = await _POST(`${BASE_URL}ebux/widget/combined-filter-som?clientId=${clientId}`, payload,
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

export const getAdditianlCombineFilterWidget = async (kpi) => {
  try {
    const payload = {
      kpi,
    }
    let id_token = localStorage.getItem("id_token");
    let clientId = localStorage.getItem("client_id");
    const response = await _POST(`${BASE_URL}ebux/widget/get-additional-combined-filter?clientId=${clientId}`, payload,
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

export const getAdditianlCombineFilterWidgetDarkStore = async (kpi) => {
  try {
    const payload = {
      kpi,
    }
    let id_token = localStorage.getItem("id_token");
    let clientId = localStorage.getItem("client_id");
    const response = await _POST(`${BASE_URL}ebux/get-additional-combined-filter-dark-store?clientId=${clientId}`, payload,
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


export const clearRedisCache = async () => {
  try {
    let id_token = localStorage.getItem("id_token");
    let clientId = localStorage.getItem("client_id");
    const response = await _POST(`${BASE_URL}redis/clear-cache?clientId=${clientId}`, {},
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


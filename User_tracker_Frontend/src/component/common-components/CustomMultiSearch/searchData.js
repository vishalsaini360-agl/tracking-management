import { FILTERACTION } from "../MultiSearch/searchData";

export const flipkartSearchFilter = {
  saved_search: [],
  name_id: [],
  campaign_m: [],
  keyword_m: [],
  ad_group_m: [],
  fsn_m: [],
  creative_m: [],
  placement_m: [],
  segment: [],
  platform: [],
  campaign_status: [],
  campaign_budget_type: [],
};

export const blinkitSearchFilter = {
  // saved_search: [],
  name_id: [],
  campaign_m: [],
  keyword_m: [],
  category_m: [],
  location_m: [],
  // product_m: [],
  blinkit_campaign_type: [],
};

export const flipkartNameIdFilter = [
  {
    key: "name_id",
    label: "Name/ID",
    selectable: false,
    children: [
      {
        key: "name_id-campaign_name",
        label: "Campaign Name",
        data: "Name/ID - Campaign Name",
        // className: this.state?.disabled ? "disableli" : "",
      },
      {
        key: "name_id-ad_group_name",
        label: "Ad Group Name",
        data: "Name/ID - Ad Group Name",
        //  className: this.state?.disabled ? "disableli" : "",
      },
      {
        key: "name_id-fsn_name",
        label: "FSN Name",
        data: "Name/ID - FSN Name",
        // className: this.state?.disabled ? "disableli" : "",
      },
      {
        key: "name_id-keyword",
        label: "Keyword",
        data: "Name/ID - Keyword",
        // className: this.state?.disabled ? "disableli" : "",
      },
      {
        key: "name_id-campaign_id",
        label: "Campaign ID",
        data: "Name/ID - Campaign ID",
        // className: this.state?.disabled ? "disableli" : "",
      },
      {
        key: "name_id-ad_group_id",
        label: "Ad Group ID",
        data: "Name/ID - Ad Group ID",
        // className: this.state?.disabled ? "disableli" : "",
      },
      {
        key: "name_id-fsn_id",
        label: "FSN ID",
        data: "Name/ID - FSN ID",
        // className: this.state?.disabled ? "disableli" : "",
      },
      {
        key: "name_id-tag_name",
        label: "Tag Name",
        data: "Name/ID - TAG",
        // className: this.state?.disabled ? "disableli" : "",
      },
    ],
  },
];

export const segmentSection = {
  key: "segment",
  label: "Segment",
  selectable: false,
  children: [
    {
      label: "PLA",
      key: "segment-PLA",
      data: "Segment - PLA",
      //   className: this.state?.disabled ? "disableli" : "",
    },
    {
      label: "PCA",
      key: "segment-PCA",
      data: "Segment - PCA",
      //   className: this.state?.disabled ? "disableli" : "",
    },
  ],
};

export const platformSection = {
  key: "platform",
  label: "Platform",
  selectable: false,
  children: [
    {
      label: "Flipkart",
      key: "platform-MP",
      data: "Platform - Flipkart",
      //   className: this.state?.disabled ? "disableli" : "",
    },
    {
      label: "Supermart",
      key: "platform-SM",
      data: "Platform - Supermart",
      //   className: this.state?.disabled ? "disableli" : "",
    },
  ],
};

export const flipkartMetric = {
  campaign_m: {
    label: "Campaign Metric",
    key: "campaign_m",
    selectable: false,
  },
  ad_group_m: {
    label: "Ad Group Metric",
    key: "ad_group_m",
    selectable: false,
  },
  keyword_m: {
    label: "Keyword Metric",
    key: "keyword_m",
    selectable: false,
  },
  fsn_m: { label: "FSN Metric", key: "fsn_m", selectable: false },
  creative_m: {
    label: "Creative Metric",
    key: "creative_m",
    selectable: false,
  },
  placement_m: {
    label: "Placement Metric",
    key: "placement_m",
    selectable: false,
  },
};

export const BlinkitMetric = {
  campaign_m: {
    label: "Campaign Metric",
    key: "campaign_m",
    selectable: false,
    tab: "campaign",
  },
  category_m: {
    label: "Category Metric",
    key: "category_m",
    selectable: false,
    tab: "category",
  },
  keyword_m: {
    label: "Keyword Metric",
    key: "keyword_m",
    selectable: false,
    tab: "keyword",
  },
};

export const BlinkItMatchMetric = {
  spends: {
    label: "Spends",
    key: "estimated_budget_consumed",
    isAvailable: ["campaign", "keyword", "category"],
  },
  impressions: {
    label: "Impressions",
    key: "impressions",
    isAvailable: ["campaign", "keyword", "category"],
  },
  clicks: {
    label: "Click",
    key: "clicks",
    isAvailable: ["campaign", "keyword", "category"],
  },
  ctr: {
    label: "CTR",
    key: "ctr",
    isAvailable: ["campaign", "keyword", "category"],
  },
  cpm: {
    label: "CPM",
    key: "cpm",
    isAvailable: ["campaign", "keyword", "category"],
  },
  atc: {
    label: "ATC",
    key: "total_atc",
    isAvailable: ["campaign", "keyword", "category"],
  },
  direct_atc: {
    label: "Direct ATC",
    key: "direct_atc",
    isAvailable: ["campaign", "keyword", "category"],
  },
  indirect_atc: {
    label: "Indirect ATC",
    key: "indirect_atc",
    isAvailable: ["campaign", "keyword", "category"],
  },
  total_quantities_sold: {
    label: "Total Orders",
    key: "total_quantities_sold",
    isAvailable: ["campaign", "keyword", "category"],
  },
  direct_quantities_sold: {
    label: "Direct Orders",
    key: "direct_quantities_sold",
    isAvailable: ["campaign", "keyword", "category"],
  },
  indirect_quantities_sold: {
    label: "Indirect Orders",
    key: "indirect_quantities_sold",
    isAvailable: ["campaign", "keyword", "category"],
  },
  total_sales: {
    label: "Total Sales",
    key: "total_sales",
    isAvailable: ["campaign", "keyword", "category"],
  },
  direct_sales: {
    label: "Direct Sales",
    key: "direct_sales",
    isAvailable: ["campaign", "keyword", "category"],
  },
  indirect_sales: {
    label: "Indirect Sales",
    key: "indirect_sales",
    isAvailable: ["campaign", "keyword", "category"],
  },
  cvr: {
    label: "New users",
    key: "new_users_acquired",
    isAvailable: ["campaign", "keyword", "category"],
  },
  roas: {
    label: "ROAS",
    key: "roas",
    isAvailable: ["campaign", "keyword", "category"],
  },
  atc_percent: {
    label: "ATC%",
    key: "atc_percent",
    isAvailable: ["campaign", "keyword", "category"],
  },
};

export const blinkitCampaignTypeReport = {
  key: "blinkit_campaign_type",
  label: "Campaign Type",
  selectable: false,
  children: [
    {
      label: "Reach",
      key: "blinkit_campaign_type-Reach",
      data: "Campaign Type - Reach",
      action: FILTERACTION.APPLY,
    },
    {
      label: "Performance",
      key: "blinkit_campaign_type-Performance",
      data: "Campaign Type - Performance",
      action: FILTERACTION.APPLY,
    },
  ],
};

export const blinkitNameIdFilterReport = {
  key: "name_id",
  label: "Name/ID",
  selectable: false,
  children: [
    {
      key: "name_id-campaign_name",
      label: "Campaign",
      data: "Campaign -",
      action: FILTERACTION.SEARCH,
    },
    {
      key: "name_id-category_name",
      label: "Category",
      data: "Category -",
      action: FILTERACTION.SEARCH,
    },
    {
      key: "name_id-keyword",
      label: "Keyword",
      data: "Keyword -",
      action: FILTERACTION.SEARCH,
    },
  ],
};

export const budgetSection = {
  key: "campaign_budget_type",
  label: "Campaign Budget Type",
  selectable: false,
  children: [
    {
      label: "Daily Budget",
      key: "campaign_budget_type-DAILY_BUDGET",
      data: "Campaign budget type - Daily budget",
      //   className: this.state?.disabled ? "disableli" : "",
    },
    {
      label: "Total Budget",
      key: "campaign_budget_type-TOTAL_BUDGET",
      data: "Campaign budget type - Total budget",
      //   className: this.state?.disabled ? "disableli" : "",
    },
  ],
};

export const campaignStatusSection = {
  key: "campaign_status",
  label: "Campaign Status",
  selectable: false,
  children: [
    {
      label: "Live",
      key: "campaign_status-LIVE",
      data: "Campaign Status - Live",
      //   className: this.state?.disabled ? "disableli" : "",
    },
    {
      label: "Completed",
      key: "campaign_status-COMPLETED",
      data: "Campaign Status - Completed",
      //   className: this.state?.disabled ? "disableli" : "",
    },
    {
      label: "Paused",
      key: "campaign_status-PAUSED",
      data: "Campaign Status - Paused",
      //   className: this.state?.disabled ? "disableli" : "",
    },
    {
      label: "Total Budget Met",
      key: "campaign_status-TOTAL BUDGET MET",
      data: "Campaign Status - Total budget met",
      //   className: this.state?.disabled ? "disableli" : "",
    },

    {
      label: "Aborted",
      key: "campaign_status-ABORTED",
      data: "Campaign Status - Aborted",
      //   className: this.state?.disabled ? "disableli" : "",
    },
  ],
};

// AMAZON
export const amazonSearchFilter = {
  saved_search: [],
  name_id: [],
  portfolio_m: [],
  campaign_m: [],
  amazon_campaign_type: [],
  keyword_m: [],
  ad_group_m: [],
  placement_m: [],
  creative_m: [],
  asin_m: [],
};
export const customamazonSearchFilter = {
  saved_search: [],
  name_id: [],
  portfolio_m: [],
  campaign_m: [],
  amazon_campaign_type: [],
  keyword_m: [],
  ad_group_m: [],
  placement_m: [],
  search_term_m: [],
  asin_m: [],
};

export const amazonNameIdFilterReport = {
  key: "name_id",
  label: "Name/ID",
  selectable: false,
  children: [
    {
      key: "name_id-name",
      label: "Portfolio Name",
      data: "Portfolio -",
      action: FILTERACTION.SEARCH,
    },
    {
      key: "name_id-campaign_name",
      label: "Campaign Name",
      data: "Campaign Name -",
      action: FILTERACTION.SEARCH,
    },
    {
      key: "name_id-ad_group_name",
      label: "Ad Group Name",
      data: "Adgroup Name -",
      action: FILTERACTION.SEARCH,
    },
    {
      key: "name_id-keyword",
      label: "Keyword Name",
      data: "Keyword Name -",
      action: FILTERACTION.SEARCH,
    },
    {
      key: "name_id-search_term",
      label: "Search Term",
      data: "Search Term -",
      action: FILTERACTION.SEARCH,
    },
    {
      key: "name_id-placement",
      label: "Placement",
      data: "Placement -",
      action: FILTERACTION.SEARCH,
    },
  ],
};

export const amazonMetric = {
  portfolio_m: {
    label: "Portfolio Metric",
    key: "portfolio_m",
    selectable: false,
    tab: "portfolio",
  },
  campaign_m: {
    label: "Campaign Metric",
    key: "campaign_m",
    selectable: false,
    tab: "campaign",
  },
  ad_group_m: {
    label: "Ad Group Metric",
    key: "ad_group_m",
    selectable: false,
    tab: "adgroup",
  },
  keyword_m: {
    label: "Keyword Metric",
    key: "keyword_m",
    selectable: false,
    tab: "keyword",
  },
  asin_m: {
    label: "ASIN  Metric",
    key: "asin_m",
    selectable: false,
    tab: "asin",
  },

  search_term_m: {
    label: "Search Term Metric",
    key: "search_term_m",
    selectable: false,
    tab: "search_term",
  },
  placement_m: {
    label: "Placement Metric",
    key: "placement_m",
    selectable: false,
    tab: "placement",
  },
};

export const amazonMatchMetric = {
  keyword_bid: {
    label: "Keyword bid",
    key: "keyword_bid",
    isAvailable: ["keyword"],
  },
  conversions: {
    label: "Conversions",
    key: "conversions",
    isAvailable: ["search_term"],
  },
  count: {
    label: "Campaign count",
    key: "count",
    isAvailable: ["portfolio"],
  },
  impression: {
    label: "Impression",
    key: "impressions",
    isAvailable: [
      "portfolio",
      "campaign",
      "adgroup",
      "placement",
      "creative",
      "keyword",
      "search_term",
    ],
  },
  // impressions: {
  //   label: "Impression",
  //   key: "views",
  //   isAvailable: ["keyword", "search_term"],
  // },
  clicks: {
    label: "Click",
    key: "clicks",
    isAvailable: [
      "portfolio",
      "campaign",
      "adgroup",
      "placement",
      "keyword",
      "creative",
      "asin",
      "search_term",
    ],
  },
  ctr: {
    label: "CTR",
    key: "ctr",
    isAvailable: [
      "portfolio",
      "campaign",
      "adgroup",
      "placement",
      "keyword",
      "creative",
      "asin",
      "search_term",
    ],
  },
  spends: {
    label: "Spend",
    key: "spend",
    isAvailable: [
      "portfolio",
      "campaign",
      "adgroup",
      "placement",
      "keyword",
      "creative",
      "asin",
      "search_term",
    ],
  },
  cpc: {
    label: "CPC",
    key: "cpc",
    isAvailable: [
      "portfolio",
      "campaign",
      "adgroup",
      "placement",
      "keyword",
      "creative",
      "asin",
    ],
  },
  cvr: {
    label: "CVR",
    key: "cvr",
    isAvailable: ["search_term"],
  },
  orders: {
    label: "Orders",
    key: "units_sold",
    isAvailable: [
      "portfolio",
      "campaign",
      "adgroup",
      "placement",
      "keyword",
      "asin",
    ],
  },
  sales: {
    label: "Sales",
    key: "sales",
    isAvailable: [
      "portfolio",
      "campaign",
      "adgroup",
      "placement",
      "keyword",
      "creative",
      "asin",
      "search_term",
    ],
  },
  acos: {
    label: "ACOS",
    key: "acos",
    isAvailable: [
      "portfolio",
      "campaign",
      "adgroup",
      "placement",
      "keyword",
      "creative",
      "asin",
    ],
  },
  roas: {
    label: "ROAS",
    key: "roas",
    isAvailable: [
      "portfolio",
      "campaign",
      "adgroup",
      "placement",
      "keyword",
      "creative",
      "asin",
    ],
  },
  ntb_order: {
    label: "NTB orders",
    key: "ntb_orders",
    isAvailable: ["portfolio", "campaign", "creative"],
  },
  ntb_order_perc: {
    label: "% of orders NTB ",
    key: "ntb_orders_perc",
    isAvailable: ["portfolio", "campaign", "creative"],
  },
  ntb_sales: {
    label: "NTB sales",
    key: "ntb_sales",
    isAvailable: ["portfolio", "campaign", "creative"],
  },
  ntb_sales_perc: {
    label: "% of sales NTB ",
    key: "ntb_sales_perc",
    isAvailable: ["portfolio", "campaign", "creative"],
  },
  viewable_impressions: {
    label: "Viewable Impressions ",
    key: "viewable_impressions",
    isAvailable: ["portfolio", "campaign"],
  },

  vtr: { label: "VTR", key: "vtr", isAvailable: ["campaign"] },
  vctr: { label: "VCTR", key: "vctr", isAvailable: ["campaign"] },
  unit_sold: {
    label: "Units Sold",
    key: "units_sold",
    isAvailable: ["creative"],
  },
};

export const amazonCampaignTypeReport = {
  key: "amazon_campaign_type",
  label: "Campaign Type",
  selectable: false,
  children: [
    {
      label: "SP",
      key: "amazon_campaign_type-SP",
      data: "Campaign Type - SP",
      action: FILTERACTION.APPLY,
    },
    {
      label: "SB",
      key: "amazon_campaign_type-SB",
      data: "Campaign Type - SB",
      action: FILTERACTION.APPLY,
    },
    {
      label: "SD",
      key: "amazon_campaign_type-SD",
      data: "Campaign Type - SD",
      action: FILTERACTION.APPLY,
    },
  ],
};

// ZEPTO
export const zeptoSearchFilter = {
  // saved_search: [],
  name_id: [],
  zepto_campaign_type: [],
  campaign_m: [],
  keyword_m: [],
  category_m: [],
  product_m: [],
};

export const zeptoNameIdFilterReport = {
  key: "name_id",
  label: "Name/ID",
  selectable: false,
  children: [
    {
      key: "name_id-campaign_name",
      label: "Campaign Name",
      data: "Campaign Name -",
      action: FILTERACTION.SEARCH,
    },

    {
      key: "name_id-keyword",
      label: "Keyword Name",
      data: "Keyword Name -",
      action: FILTERACTION.SEARCH,
    },

    {
      key: "name_id-category",
      label: "Category Name",
      data: "Category Name -",
      action: FILTERACTION.SEARCH,
    },

    {
      key: "name_id-product_name",
      label: "Product Name",
      data: "Product Name -",
      action: FILTERACTION.SEARCH,
    },
  ],
};

export const zeptoMetric = {
  campaign_m: {
    label: "Campaign Metric",
    key: "campaign_m",
    selectable: false,
    tab: "campaign",
  },

  keyword_m: {
    label: "Keyword Metric",
    key: "keyword_m",
    selectable: false,
    tab: "keyword",
  },
  category_m: {
    label: "Category Metric",
    key: "category_m",
    selectable: false,
    tab: "category",
  },

  product_m: {
    label: "Product Metric",
    key: "product_m",
    selectable: false,
    tab: "product",
  },
};

export const zeptoMatchMetric = {
  impression: {
    label: "Impression",
    key: "impressions",
    isAvailable: ["campaign", "keyword", "category", "product"],
  },
  clicks: {
    label: "Click",
    key: "clicks",
    isAvailable: ["campaign", "keyword", "category", "product"],
  },
  spend: {
    label: "Spend",
    key: "spend",
    isAvailable: ["campaign", "keyword", "category", "product"],
  },
  cpc: {
    label: "CPC",
    key: "cpc",
    isAvailable: ["campaign", "keyword", "category", "product"],
  },
  orders: {
    label: "Orders",
    key: "orders",
    isAvailable: ["campaign", "category", "product"],
  },
  roas: {
    label: "ROAS",
    key: "roas",
    isAvailable: ["campaign", "keyword", "category", "product"],
  },
  ctr: {
    label: "CTR",
    key: "ctr",
    isAvailable: ["campaign", "keyword", "category", "product"],
  },
  add2cart: {
    label: "ATC",
    key: "add2cart",
    isAvailable: ["campaign"],
  },
  revenues: {
    label: "Sales",
    key: "revenues",
    isAvailable: ["campaign", "keyword", "category", "product"],
  },
  cpm: {
    label: "CPM",
    key: "cpm",
    isAvailable: ["campaign", "keyword", "category", "product"],
  },
  view_products: {
    label: "View Products",
    key: "view_products",
    isAvailable: ["campaign"],
  },
  same_sku_orders: {
    label: "Same SKU Orders",
    key: "same_sku_orders",
    isAvailable: ["category", "product"],
  },
  other_sku_orders: {
    label: "Other SKU Orders",
    key: "other_sku_orders",
    isAvailable: ["category", "product"],
  },
  views: {
    label: "Views",
    key: "views",
    isAvailable: ["product"],
  },
};

export const zeptoCampaignTypeReport = {
  key: "zepto_campaign_type",
  label: "Campaign Type",
  selectable: false,
  children: [
    {
      label: "Awareness",
      key: "zepto_campaign_type-Awareness",
      data: "Campaign Type - Awareness",
      action: FILTERACTION.APPLY,
    },
    {
      label: "Performance",
      key: "zepto_campaign_type-Performance",
      data: "Campaign Type - Performance",
      action: FILTERACTION.APPLY,
    },
  ],
};

export const instamartSearchFilter = {
  saved_search: [],
  name_id: [],
  campaign_m: [],
  keyword_m: [],
  product_m: [],
};

export const instamartNameIdReportFilter = {
  key: "name_id",
  label: "Name/ID",
  selectable: false,
  children: [
    {
      key: "name_id-campaign_name",
      label: "Campaign Name",
      data: "Campaign Name -",
      action: FILTERACTION.SEARCH,
    },

    {
      key: "name_id-keyword",
      label: "Keyword Name",
      data: "Keyword Name -",
      action: FILTERACTION.SEARCH,
    },

    {
      key: "name_id-product_name",
      label: "Product Name",
      data: "Product Name -",
      action: FILTERACTION.SEARCH,
    },
  ],
};

export const instamartMetric = {
  campaign_m: {
    label: "Campaign Metric",
    key: "campaign_m",
    selectable: false,
    tab: "campaign",
  },
  // campaign_id: {
  //   label: "Campaign Id Metric",
  //   key: "campaign_id",
  //   selectable: false,
  //   tab: "campaign",
  // },

  keyword_m: {
    label: "Keyword Metric",
    key: "keyword_m",
    selectable: false,
    tab: "keyword",
  },

  product_m: {
    label: "Product Metric",
    key: "product_m",
    selectable: false,
    tab: "product",
  },
};

export const instamartMatchMetric = {
  impression: {
    label: "Impression",
    key: "impressions",
    isAvailable: ["campaign", "keyword", "product"],
  },

  spend: {
    label: "Spend",
    key: "spend",
    isAvailable: ["campaign", "keyword", "product"],
  },

  add2cart: {
    label: "Orders",
    key: "add2cart",
    isAvailable: ["campaign", "keyword", "product"],
  },
  sales: {
    label: "Sales",
    key: "gmv",
    isAvailable: ["campaign", "keyword", "product"],
  },

  budget: {
    label: "Budget",
    key: "budget",
    isAvailable: ["campaign"],
  },

  roi: {
    label: "ROI",
    key: "roi",
    isAvailable: ["campaign", "keyword", "product"],
  },
};

export const flipkartNameIdFilterReport = {
  key: "name_id",
  label: "Name/ID",
  selectable: false,
  children: [
    {
      key: "name_id-campaign_name",
      label: "Campaign Name",
      data: "Campaign Name -",
      action: FILTERACTION.SEARCH,
    },
    {
      key: "name_id-ad_group_name",
      label: "Ad Group Name",
      data: "Ad Group Name -",
      action: FILTERACTION.SEARCH,
    },
    {
      key: "name_id-product_name",
      label: "FSN Name",
      data: "FSN Name -",
      action: FILTERACTION.SEARCH,
    },
    {
      key: "name_id-keyword",
      label: "Keyword",
      data: "Keyword -",
      action: FILTERACTION.SEARCH,
    },
    {
      key: "name_id-campaign_id",
      label: "Campaign ID",
      data: "Campaign ID -",
      action: FILTERACTION.SEARCH,
    },
    {
      key: "name_id-ad_group_id",
      label: "Ad Group ID",
      data: "Ad Group ID -",
      action: FILTERACTION.SEARCH,
    },
    {
      key: "name_id-fsn_id",
      label: "FSN ID",
      data: "FSN ID -",
      action: FILTERACTION.SEARCH,
    },
  ],
};

export const flipkartCampaignTypeReport = {
  key: "segment",
  label: "Campaign Type",
  selectable: false,
  children: [
    {
      label: "PLA",
      key: "segment-PLA",
      data: "Campaign Type - PLA",
      action: FILTERACTION.APPLY,
    },
    {
      label: "PCA",
      key: "segment-PCA",
      data: "Campaign Type - PCA",
      action: FILTERACTION.APPLY,
    },
  ],
};

export const flipkartPlatformTypeReport = {
  key: "platform",
  label: "Platform",
  selectable: false,
  children: [
    {
      label: "Flipkart",
      key: "platform-MP",
      data: "Platform - Flipkart",
      action: FILTERACTION.APPLY,
    },
    {
      label: "Supermart",
      key: "platform-SM",
      data: "Platform - Supermart",
      action: FILTERACTION.APPLY,
    },
  ],
};

export const flipkartBudgetTypeReport = {
  key: "campaign_budget_type",
  label: "Campaign Budget Type",
  selectable: false,
  children: [
    {
      label: "Daily Budget",
      key: "campaign_budget_type-DAILY_BUDGET",
      data: "Campaign budget type - Daily budget",
      action: FILTERACTION.APPLY,
    },
    {
      label: "Total Budget",
      key: "campaign_budget_type-TOTAL_BUDGET",
      data: "Campaign budget type - Total budget",
      action: FILTERACTION.APPLY,
    },
  ],
};

export const flipkartCampaignStatusReport = {
  key: "campaign_status",
  label: "Campaign Status",
  selectable: false,
  children: [
    {
      label: "Live",
      key: "campaign_status-LIVE",
      data: "Campaign Status - Live",
      action: FILTERACTION.APPLY,
    },
    {
      label: "Completed",
      key: "campaign_status-COMPLETED",
      data: "Campaign Status - Completed",
      action: FILTERACTION.APPLY,
    },
    {
      label: "Paused",
      key: "campaign_status-PAUSED",
      data: "Campaign Status - Paused",
      action: FILTERACTION.APPLY,
    },
    {
      label: "Total Budget Met",
      key: "campaign_status-TOTAL_BUDGET_MET",
      data: "Campaign Status - Total budget met",
      action: FILTERACTION.APPLY,
    },

    {
      label: "Aborted",
      key: "campaign_status-ABORTED",
      data: "Campaign Status - Aborted",
      action: FILTERACTION.APPLY,
    },
  ],
};

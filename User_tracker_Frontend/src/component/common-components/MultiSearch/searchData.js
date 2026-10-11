export const FILTERACTION = Object.freeze({
  METRIC: "metric",
  SEARCH: "search",
  APPLY: "apply",
  TAG: "tag",
});

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
  saved_search: [],
  name_id: [],
  campaign_m: [],
  keyword_m: [],
  category_m: [],
  campaign_status: [],
  location_m: [],
  // product_m: [],
  blinkit_campaign_type: [],
};

export const blinkitActionActivitySearchFilter = {
  name_id: [],
  blinkit_campaign_type: [],
};

export const flipkartActionActivitySearchFilter = {
  name_id: [],
  flipkart_campaign_type: [],
  platform: [],
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
        data: "Campaign Name -",
        // className: this.state?.disabled ? "disableli" : "",
      },
      {
        key: "name_id-ad_group_name",
        label: "Ad Group Name",
        data: "Ad Group Name - ",
        //  className: this.state?.disabled ? "disableli" : "",
      },
      {
        key: "name_id-fsn_name",
        label: "FSN Name",
        data: "FSN Name - ",
        // className: this.state?.disabled ? "disableli" : "",
      },
      {
        key: "name_id-keyword",
        label: "Keyword",
        data: "Keyword - ",
        // className: this.state?.disabled ? "disableli" : "",
      },
      {
        key: "name_id-campaign_id",
        label: "Campaign ID",
        data: "Campaign ID - ",
        // className: this.state?.disabled ? "disableli" : "",
      },
      {
        key: "name_id-ad_group_id",
        label: "Ad Group ID",
        data: "Ad Group ID - ",
        // className: this.state?.disabled ? "disableli" : "",
      },
      {
        key: "name_id-fsn_id",
        label: "FSN ID",
        data: "FSN ID - ",
        // className: this.state?.disabled ? "disableli" : "",
      },
      {
        key: "name_id-tag_name",
        label: "Tag Name",
        data: "TAG - ",
        // className: this.state?.disabled ? "disableli" : "",
      },
    ],
  },
];

export const flipkartNameIdFilterObj = {
  key: "name_id",
  label: "Name/ID",
  selectable: false,
  children: [
    {
      key: "name_id-campaign_name",
      label: "Campaign Name",
      data: "Campaign Name -",
      action: FILTERACTION.SEARCH,
      // className: this.state?.disabled ? "disableli" : "",
    },
    {
      key: "name_id-ad_group_name",
      label: "Ad Group Name",
      data: "Ad Group Name - ",
      action: FILTERACTION.SEARCH,
      //  className: this.state?.disabled ? "disableli" : "",
    },
    {
      key: "name_id-fsn_name",
      label: "FSN Name",
      data: "FSN Name - ",
      action: FILTERACTION.SEARCH,
      // className: this.state?.disabled ? "disableli" : "",
    },
    {
      key: "name_id-keyword",
      label: "Keyword",
      data: "Keyword - ",
      action: FILTERACTION.SEARCH,
      // className: this.state?.disabled ? "disableli" : "",
    },
    {
      key: "name_id-campaign_id",
      label: "Campaign ID",
      data: "Campaign ID - ",
      action: FILTERACTION.SEARCH,
      // className: this.state?.disabled ? "disableli" : "",
    },
    {
      key: "name_id-ad_group_id",
      label: "Ad Group ID",
      data: "Ad Group ID - ",
      action: FILTERACTION.SEARCH,
      // className: this.state?.disabled ? "disableli" : "",
    },
    {
      key: "name_id-fsn_id",
      label: "FSN ID",
      data: "FSN ID - ",
      action: FILTERACTION.SEARCH,
      // className: this.state?.disabled ? "disableli" : "",
    },
    // {
    //   key: "name_id-tag_name",
    //   label: "Tag Name",
    //   data: "TAG - ",
    //   action: FILTERACTION.SEARCH,
    //   // className: this.state?.disabled ? "disableli" : "",
    // },
  ],
};

export const BlinkitNameIdFilter = {
  key: "name_id",
  label: "Name/ID",
  selectable: false,
  children: [
    {
      key: "name_id-campaign_name",
      label: "Campaign Name",
      data: "Campaign Name - ",
      // className: this.state?.disabled ? "disableli" : "",
    },

    {
      key: "name_id-keyword",
      label: "Keyword",
      data: "Keyword - ",
      // className: this.state?.disabled ? "disableli" : "",
    },
    {
      key: "name_id-fsn_name",
      label: "Category Name",
      data: "FSN Name - ",
      // className: this.state?.disabled ? "disableli" : "",
    },
    {
      key: "name_id-fsn_name",
      label: "Location Name",
      data: "FSN Name - ",
      // className: this.state?.disabled ? "disableli" : "",
    },
    {
      key: "name_id-fsn_name",
      label: "Adervertise",
      data: "FSN Name - ",
      // className: this.state?.disabled ? "disableli" : "",
    },
    {
      key: "name_id-campaign_id",
      label: "Campaign ID",
      data: "Campaign ID - ",
      // className: this.state?.disabled ? "disableli" : "",
    },

    {
      key: "name_id-tag_name",
      label: "Tag Name",
      data: "TAG - ",
      // className: this.state?.disabled ? "disableli" : "",
    },
  ],
};

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
    key: "cvr",
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

export const budgetSection = {
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

export const campaignStatusSection = {
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
      key: "campaign_status-TOTAL BUDGET MET",
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

// AMAZON
export const amazonSearchFilter = {
  saved_search: [],
  name_id: [],
  portfolio_m: [],
  campaign_m: [],
  amazon_campaign_type: [],
  keyword_m: [],
  ad_group_m: [],
  campaign_status: [],
  placement_m: [],
  creative_m: [],
  asin_m: [],
};
export const amazonActionActivitySearchFilter = {
  name_id: [],
  amazon_campaign_type: [],
};

export const amazonNameIdFilter = {
  key: "name_id",
  label: "Name/ID",
  selectable: false,
  children: [
    {
      key: "name_id-portfolio",
      label: "Portfolio Name",
      data: "Portfolio - ",
      mapKey: "portfolio",
      action: FILTERACTION.SEARCH,
    },
    {
      key: "name_id-campaign_name",
      label: "Campaign Name",
      data: "Campaign Name - ",
      mapKey: "campaign_name",
      action: FILTERACTION.SEARCH,
      // className: this.state?.disabled ? "disableli" : "",
    },
    {
      key: "name_id-adgroupname",
      label: "Ad Group Name",
      data: "Adgroup Name - ",
      mapKey: "ad_group_name",
      action: FILTERACTION.SEARCH,
      // className: this.state?.disabled ? "disableli" : "",
    },
    {
      key: "name_id-keyword",
      label: "Keyword Name",
      data: "Keyword Name - ",
      mapKey: "keyword",
      action: FILTERACTION.SEARCH,
      // className: this.state?.disabled ? "disableli" : "",
    },

    // {
    //   key: "name_id-creative",
    //   label: "Creative Name",
    //   data: "Creative Name",
    // className: this.state?.disabled ? "disableli" : "",
    // },
    {
      key: "name_id-placement",
      label: "Placement",
      data: "Placement - ",
      mapKey: "placement",
      action: FILTERACTION.SEARCH,
      // className: this.state?.disabled ? "disableli" : "",
    },
    {
      key: "name_id-asin",
      label: "ASIN ID",
      data: "ASIN - ",
      mapKey: "asin",
      action: FILTERACTION.SEARCH,
      // className: this.state?.disabled ? "disableli" : "",
    },
    // {
    //   key: "name_id-campaign_id",
    //   label: "Campaign ID",
    //   data: "Campaign ID",
    //   // className: this.state?.disabled ? "disableli" : "",
    // },

    // {
    //   key: "name_id-tag_name",
    //   label: "Tag Name",
    //   data: "TAG - ",
    //   mapKey: "tag_name",
    //   action: FILTERACTION.SEARCH,
    //   // className: this.state?.disabled ? "disableli" : "",
    // },
  ],
};

export const amazonActionActivityNameIdFilter = {
  key: "name_id",
  label: "Name/ID",
  selectable: false,
  children: [
    {
      key: "name_id-user_name",
      label: "Action By",
      data: "Name/ID - Action By",
      mapKey: "user_name",
    },
    {
      key: "name_id-action_type",
      label: "Action Type",
      data: "Name/ID - Action Type",
      mapKey: "action_type",
    },
    {
      key: "name_id-campaign_name",
      label: "Action On",
      data: "Name/ID - Action On",
      mapKey: "campaign_name",
      // className: this.state?.disabled ? "disableli" : "",
    },
    {
      key: "name_id-action_message",
      label: "Action Taken",
      data: "Name/ID - Action Taken",
      mapKey: "action_message",
      // className: this.state?.disabled ? "disableli" : "",
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

  creative_m: {
    label: "Creative Metric",
    key: "creative_m",
    selectable: false,
    tab: "creative",
  },
  placement_m: {
    label: "Placement Metric",
    key: "placement_m",
    selectable: false,
    tab: "placement",
  },
};

export const amazonMatchMetric = {
  // keyword_bid: {
  //   label: "Keyword bid",
  //   key: "keyword_bid",
  //   isAvailable: ["keyword"],
  // },
  count: {
    label: "Campaign count",
    key: "count",
    isAvailable: ["portfolio"],
  },
  impression: {
    label: "Impression",
    key: "impressions",
    isAvailable: ["portfolio", "campaign", "adgroup", "placement", "creative"],
  },
  impressions: {
    label: "Impression",
    key: "views",
    isAvailable: ["keyword"],
  },
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
  units_sold: {
    label: "Orders",
    key: "units_sold",
    isAvailable: ["campaign", "adgroup"],
  },
  orders: {
    label: "Orders",
    key: "orders",
    isAvailable: ["asin", "portfolio"],
  },
  conversion: {
    label: "Orders",
    key: "conversion",
    isAvailable: ["placement"],
  },
  conversions: {
    label: "Orders",
    key: "conversions",
    isAvailable: ["keyword"],
  },
  sales: {
    label: "Sales",
    key: "sales",
    isAvailable: [
      "portfolio",
      "campaign",
      "adgroup",
      "placement",

      "creative",
      "asin",
    ],
  },

  revenue: {
    label: "Sales",
    key: "revenue",
    isAvailable: ["keyword"],
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
  // ntb_order: {
  //   label: "NTB orders",
  //   key: "ntb_order",
  //   isAvailable: ["portfolio", "campaign", "creative"],
  // },
  // ntb_order_perc: {
  //   label: "% of orders NTB ",
  //   key: "ntb_order_perc",
  //   isAvailable: ["portfolio", "campaign", "creative"],
  // },
  // ntb_sales: {
  //   label: "NTB sales",
  //   key: "ntb_sales",
  //   isAvailable: ["portfolio", "campaign", "creative"],
  // },
  // ntb_sales_perc: {
  //   label: "% of sales NTB ",
  //   key: "ntb_sales_perc",
  //   isAvailable: ["portfolio", "campaign", "creative"],
  // },
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
  sov: {
    label: "SOV",
    key: "sov",
    isAvailable: ["keyword"],
  },
  review: { label: "Review", key: "review", isAvailable: ["asin"] },
  rating: { label: "Rating", key: "rating", isAvailable: ["asin"] },
  price: { label: "MRP", key: "price", isAvailable: ["asin"] },
};

export const amazonCampaignType = {
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
export const tagsFilter = {
  key: "tags",
  label: "Select Tags",
  join: true,
  children: [],
};
export const flipkartCampaignType = {
  key: "flipkart_campaign_type",
  label: "Campaign Type",
  selectable: false,
  children: [
    {
      label: "PLA",
      key: "flipkart_campaign_type-PLA",
      data: "Campaign Type - PLA",
      action: FILTERACTION.APPLY,
    },
    {
      label: "PCA",
      key: "flipkart_campaign_type-PCA",
      data: "Campaign Type - PCA",
      action: FILTERACTION.APPLY,
    },
  ],
};

export const flipkartPlatformSection = {
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

// ZEPTO
export const zeptoSearchFilter = {
  saved_search: [],
  name_id: [],
  campaign_m: [],
  zepto_campaign_type: [],
  keyword_m: [],
  campaign_status: [],
  placement_m: [],
  category_m: [],
  product_m: [],
};

export const zeptoNameIdFilter = {
  key: "name_id",
  label: "Name/ID",
  selectable: false,
  children: [
    {
      key: "name_id-campaign_name",
      label: "Campaign Name",
      data: "Campaign Name - ",
      mapKey: "campaign_name",
      action: FILTERACTION.SEARCH,
      // className: this.state?.disabled ? "disableli" : "",
    },

    {
      key: "name_id-keyword",
      label: "Keyword Name",
      data: "Keyword Name - ",
      mapKey: "keyword",
      action: FILTERACTION.SEARCH,
      // className: this.state?.disabled ? "disableli" : "",
    },

    {
      key: "name_id-category_name",
      label: "Category Name",
      data: "Category Name - ",
      mapKey: "category_name",
      action: FILTERACTION.SEARCH,
      // className: this.state?.disabled ? "disableli" : "",
    },

    {
      key: "name_id-product_name",
      label: "Product Name",
      data: "Product Name - ",
      mapKey: "product_name",
      action: FILTERACTION.SEARCH,
      // className: this.state?.disabled ? "disableli" : "",
    },

    // {
    //   key: "name_id-campaign_id",
    //   label: "Campaign ID",
    //   data: "Campaign ID - ",
    //   // className: this.state?.disabled ? "disableli" : "",
    // },

    // {
    //   key: "name_id-tag_name",
    //   label: "Tag Name",
    //   data: "TAG - ",
    //   mapKey: "tag_name",
    //   action: FILTERACTION.SEARCH,
    //   // className: this.state?.disabled ? "disableli" : "",
    // },
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
  sov: {
    label: "SOV",
    key: "sov",
    isAvailable: ["keyword"],
  },
  discount: { label: "Promotion", key: "discount", isAvailable: ["product"] },
  price: { label: "MRP", key: "price", isAvailable: ["product"] },
};

export const zeptoCampaignType = {
  key: "zepto_campaign_type",
  label: "Campaign Type",
  selectable: false,
  children: [
    {
      label: "Awareness",
      key: "zepto_campaign_type-Awareness",
      data: "Campaign Type - Awareness",
      action: FILTERACTION.APPLY,
      //   className: this.state?.disabled ? "disableli" : "",
    },
    {
      label: "Performance",
      key: "zepto_campaign_type-Performance",
      data: "Campaign Type - Performance",
      action: FILTERACTION.APPLY,
      //   className: this.state?.disabled ? "disableli" : "",
    },
  ],
};

export const blinkitCampaignType = {
  key: "blinkit_campaign_type",
  label: "Campaign Type",
  selectable: false,
  children: [
    {
      label: "Reach",
      key: "blinkit_campaign_type-Reach",
      data: "Campaign Type - Reach",
      //   className: this.state?.disabled ? "disableli" : "",
      action: FILTERACTION.APPLY,
    },
    {
      label: "Performance",
      key: "blinkit_campaign_type-Performance",
      data: "Campaign Type - Performance",
      //   className: this.state?.disabled ? "disableli" : "",
      action: FILTERACTION.APPLY,
    },
  ],
};

export const blinkitNameIdFilter = {
  key: "name_id",
  label: "Name/ID",
  selectable: false,
  children: [
    {
      key: "name_id-campaign_name",
      label: "Campaign",
      data: "Campaign - ",
      mapKey: "campaign_name",
      action: FILTERACTION.SEARCH,
    },
    {
      key: "name_id-category_name",
      label: "Category",
      data: "Category - ",
      mapKey: "category_name",
      action: FILTERACTION.SEARCH,
    },
    {
      key: "name_id-keyword",
      label: "Keyword",
      data: "Keyword - ",
      mapKey: "keyword",
      action: FILTERACTION.SEARCH,
    },
    // {
    //   key: "name_id-product",
    //   label: "Product",
    //   data: "Product",
    //   action: FILTERACTION.SEARCH,
    // },
    // {
    //   key: "name_id-tag_name",
    //   label: "Tag Name",
    //   data: "TAG - ",
    //   mapKey: "tag_name",
    //   action: FILTERACTION.SEARCH,
    // },
  ],
};

export const blinkitActionActivityNameIdFilter = {
  key: "name_id",
  label: "Name/ID",
  selectable: false,
  children: [
    {
      key: "name_id-user_name",
      label: "Action By",
      data: "Name/ID - Action By",
      mapKey: "user_name",
      // className: this.state?.disabled ? "disableli" : "",
    },
    {
      key: "name_id-action_type",
      label: "Action Type",
      data: "Name/ID - Action Type",
      mapKey: "action_type",
      // className: this.state?.disabled ? "disableli" : "",
    },
    {
      key: "name_id-campaign_name",
      label: "Action On",
      data: "Name/ID - Action On",
      mapKey: "campaign_name",
      // className: this.state?.disabled ? "disableli" : "",
    },
    {
      key: "name_id-action_message",
      label: "Action Taken",
      data: "Name/ID - Action Taken",
      mapKey: "action_message",
      // className: this.state?.disabled ? "disableli" : "",
    },
  ],
};

export const flipkartActionActivityNameIdFilter = {
  key: "name_id",
  label: "Name/ID",
  selectable: false,
  children: [
    {
      key: "name_id-user_name",
      label: "Action By",
      data: "Name/ID - Action By",
      mapKey: "user_name",
      // className: this.state?.disabled ? "disableli" : "",
    },
    {
      key: "name_id-action_type",
      label: "Action Type",
      data: "Name/ID - Action Type",
      mapKey: "action_type",
      // className: this.state?.disabled ? "disableli" : "",
    },
    {
      key: "name_id-campaign_name",
      label: "Action On",
      data: "Name/ID - Action On",
      mapKey: "campaign_name",
      // className: this.state?.disabled ? "disableli" : "",
    },
    {
      key: "name_id-action_message",
      label: "Action Taken",
      data: "Name/ID - Action Taken",
      mapKey: "action_message",
      // className: this.state?.disabled ? "disableli" : "",
    },
  ],
};

export const catalogSearchFilters = {
  name_id: [],
};
export const catalogNameIdFilter = {
  key: "name_id",
  label: "Name/ID",
  selectable: false,
  children: [
    {
      key: "name_id-product_name",
      label: "Product Name",
      data: "Product - ",
    },
    // {
    //   key: "name_id-flipkart_product_name",
    //   label: "Flipkart Product Name",
    //   data: "Flipkart Product Name",
    // },
    // {
    //   key: "name_id-amazon_product_name",
    //   label: "Amazon Product Name",
    //   data: "Amazon Product Name",
    // },
    // {
    //   key: "name_id-zepto_product_name",
    //   label: "Zepto Product Name",
    //   data: "Zepto Product Name",
    // },

    // {
    //   key: "name_id-blinkit_product_name",
    //   label: "Blinkit Product Name",
    //   data: "Blinkit Product Name",
    // },
  ],
};

export const instamartSearchFilter = {
  saved_search: [],
  name_id: [],
  campaign_m: [],
  campaign_status: [],
  keyword_m: [],
  product_m: [],
};

export const instamartNameIdFilter = {
  key: "name_id",
  label: "Name/ID",
  selectable: false,
  children: [
    {
      key: "name_id-campaign_name",
      label: "Campaign Name",
      data: "Campaign Name - ",
      mapKey: "campaign_name",
      action: FILTERACTION.SEARCH,
    },

    {
      key: "name_id-keyword",
      label: "Keyword Name",
      data: "Keyword Name - ",
      mapKey: "keyword",
      action: FILTERACTION.SEARCH,
    },

    {
      key: "name_id-product_name",
      label: "Product Name",
      data: "Product Name - ",
      mapKey: "product_name",
      action: FILTERACTION.SEARCH,
    },

    // {
    //   key: "name_id-campaign_id",
    //   label: "Campaign ID",
    //   data: "Campaign ID",
    //   action: FILTERACTION.SEARCH,
    // },

    // {
    //   key: "name_id-tag_name",
    //   label: "Tag Name",
    //   data: "TAG - ",
    //   mapKey: "tag_name",
    //   action: FILTERACTION.SEARCH,
    // },
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
};

export const negKeywordAms = {
  name_id: [],
  segment: [],
};

export const amsNegKeywordSearchFilter = {
  key: "name_id",
  label: "Name",
  selectable: false,
  children: [
    {
      key: "name_id-keyword",
      label: "Keyword",
      data: "Keyword",
    },
    {
      key: "name_id-campaign_name",
      label: "Campaign Name",
      data: "Name - Campaign Name",
    },
    {
      key: "name_id-ad_group_name",
      label: "Ad Group Name",
      data: "Name - Ad Group Name",
    },
    {
      key: "name_id-portfolio_name",
      label: "Portfolio Name",
      data: "Name - Portfolio Name",
    },
  ],
};

export const amsNegKeywordCampaignType = {
  key: "segment",
  label: "Campaign Type",
  selectable: false,
  children: [
    {
      label: "SP",
      key: "segment-SP",
      data: "Campaign Type - SP",
      // className: this.state?.disabled ? "disableli" : "",
    },
    {
      label: "SB",
      key: "segment-SB",
      data: "Campaign Type - SB",
      // className: this.state?.disabled ? "disableli" : "",
    },
  ],
};
export const searchTermFkSearchFilter = {
  key: "name_id",
  label: "Name",
  selectable: false,
  children: [
    {
      key: "name_id-search_term",
      label: "Search Term",
      data: "Name- Search Term",
    },
    {
      key: "name_id-campaign_name",
      label: "Campaign Name",
      data: "Name - Campaign Name",
    },
    {
      key: "name_id-ad_group_name",
      label: "Ad Group Name",
      data: "Name - Ad Group Name",
    },
  ],
};
export const searchTermAmsSearchFilter = {
  key: "name_id",
  label: "Name",
  selectable: false,
  children: [
    {
      key: "name_id-search_term",
      label: "Search Term",
      data: "Name- Search Term",
    },
    {
      key: "name_id-campaign_name",
      label: "Campaign Name",
      data: "Name - Campaign Name",
    },
    {
      key: "name_id-ad_group_name",
      label: "Ad Group Name",
      data: "Name - Ad Group Name",
    },
    {
      key: "name_id-keyword",
      label: "Keyword Name",
      data: "Name - Keyword Name",
    },
  ],
};

export const blinkitNegKeywordSearchFilter = {
  key: "name_id",
  label: "Name",
  selectable: false,
  children: [
    {
      key: "name_id-campaign_name",
      label: "Campaign Name",
      data: "Name - Campaign Name",
    },

    {
      key: "name_id-keyword",
      label: "Keyword Name",
      data: "Name - Keyword Name",
    },
  ],
};

export const fkNegKeywordSearchFilter = {
  key: "name_id",
  label: "Name",
  selectable: false,
  children: [
    {
      key: "name_id-campaign_name",
      label: "Campaign Name",
      data: "Name - Campaign Name",
    },
    {
      key: "name_id-adgroup",
      label: "Adgroup Name",
      data: "Name - Adgroup Name",
    },

    {
      key: "name_id-keyword",
      label: "Keyword Name",
      data: "Name - Keyword Name",
    },
  ],
};

export const searchTermAmsCampaignType = {
  key: "segment",
  label: "Campaign Type",
  selectable: false,
  children: [
    {
      label: "SP",
      key: "segment-SP",
      data: "Campaign Type - SP",
      // className: this.state?.disabled ? "disableli" : "",
    },
    {
      label: "SB",
      key: "segment-SB",
      data: "Campaign Type - SB",
      // className: this.state?.disabled ? "disableli" : "",
    },
    {
      label: "SD",
      key: "segment-SD",
      data: "Campaign Type - SD",
      // className: this.state?.disabled ? "disableli" : "",
    },
  ],
};

export const searchTermFkCampaignType = {
  key: "segment",
  label: "Campaign Type",
  selectable: false,
  children: [
    {
      label: "PLA",
      key: "segment-PLA",
      data: "Campaign Type - PLA",
      // className: this.state?.disabled ? "disableli" : "",
    },
    {
      label: "PCA",
      key: "segment-PCA",
      data: "Campaign Type - PCA",
      // className: this.state?.disabled ? "disableli" : "",
    },
  ],
};
export const negKeywordFkCampaignType = {
  key: "segment",
  label: "Campaign Type",
  selectable: false,
  children: [
    {
      label: "PLA",
      key: "segment-PLA",
      data: "Campaign Type - PLA",
      // className: this.state?.disabled ? "disableli" : "",
    },
    {
      label: "PCA",
      key: "segment-PCA",
      data: "Campaign Type - PCA",
      // className: this.state?.disabled ? "disableli" : "",
    },
  ],
};

export const searchTermAmsMetric = {
  campaign_m: {
    label: "Campaign Metric",
    key: "campaign_m",
    selectable: false,
    tab: "campaign",
  },
};

export const searchTermAmsMatchMetric = {
  impression: {
    label: "Impression",
    key: "views",
  },

  clicks: {
    label: "Clicks",
    key: "clicks",
  },
  spend: {
    label: "Spend",
    key: "spend",
  },
  conversions: {
    label: "Conversions",
    key: "conversions",
  },
  sales: {
    label: "Sales",
    key: "revenue",
  },
  cvr: {
    label: "CVR",
    key: "cvr",
  },
  keyword_bid: {
    label: "Keyword Bid",
    key: "keyword_bid",
  },
};

export const searchTermFkMatchMetric = {
  views: {
    label: "Views",
    key: "views",
  },

  clicks: {
    label: "Clicks",
    key: "clicks",
  },
  ctr: {
    label: "CTR",
    key: "ctr",
  },
  cpc: {
    label: "CPC",
    key: "cpc",
  },
  total_units_sold: {
    label: "Total Orders",
    key: "total_units_sold",
  },
  direct_units_sold: {
    label: "Direct Orders",
    key: "direct_units_sold",
  },
  indirect_units_sold: {
    label: "Indirect Orders",
    key: "indirect_units_sold",
  },
  total_revenue: {
    label: "Total Sales",
    key: "total_revenue",
  },

  indirect_revenue: {
    label: "Indirect Sales",
    key: "indirect_revenue",
  },
  cvr: {
    label: "CVR",
    key: "cvr",
  },
  cvr_direct: {
    label: "Direct CVR",
    key: "cvr_direct",
  },
  cvr_indirect: {
    label: "Indirect CVR",
    key: "cvr_indirect",
  },
  roi_total: {
    label: "ROAS",
    key: "roi_total",
  },
  roi_direct: {
    label: "Direct ROAS",
    key: "roi_direct",
  },
  roi_indirect: {
    label: "Indirect CVR",
    key: "roi_indirect",
  },
  aov_total: {
    label: "AOV",
    key: "aov_total",
  },
  aov_direct: {
    label: "Direct AOV",
    key: "aov_direct",
  },
  aov_indirect: {
    label: "Indirect AOV",
    key: "aov_indirect",
  },
};

export const amsSearchTerm = {
  name_id: [],
  segment: [],
  campaign_m: [],
};
export const blinkitNegKeyword = {
  name_id: [],
};

export const amsNegKeyword = {
  name_id: [],
  segment: [],
};

export const flipkartKeyword = {
  name_id: [],
  segment: [],
};

export const mathSign = {
  is_greater_than: ">",
  is_less_than: "<",
  is_between: "between",
  isnt_between: "isn't between",
  contains: "contains",
};

export const notAllowedList = {
  campaign_budget_type: true,
  campaign_status: true,
  segment: true,
  amazon_campaign_type: true,
  platform: true,
  zepto_campaign_type: true,
  blinkit_campaign_type: true,
};

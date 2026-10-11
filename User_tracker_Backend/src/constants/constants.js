const constants = {
  // URL: "http://localhost:3000",
  URL: "http://3.7.198.131:8080/",
  response_code: {
    /** Success Codes */
    SUCCESS: 200,
    No_Content: 204,
    EMPTY_REQ: 227,
    MAX_SUCCESS_CODE: 299,

    /** Other Codes*/
    RESOURCE_MOVED_PERMANENTLY: 301,

    /** Error Codes*/
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    JWT: 402,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INVALID_ID: 406,
    DUPLICATE: 406,
    UPGRADE_APP: 426,
    ROLE_BREACH: 451,
    RECORD_NOT_FOUND: 499,
    INTERNAL_SERVER_ERROR: 500,
  },
  COMMON_GRAPH_FILTERS: [
    "views",
    "clicks",
    "spend",
    "ctr",
    "cpc",
    "total_revenue",
    "cvr",
    "cpa",
    "aov",
    "orders",
    "total_roas",
    "total_ppv",
    "direct_aov",
    "direct_revenue",
    "units_sold_direct",
    "direct_roas",
    "ppv_direct_click",
    "indirect_revenue",
    "units_sold_indirect",
    "indirect_roas",
    "ppv_indirect_click",
    "indirect_aov",
  ],
  GRAPH_FILTERS: [
    "views",
    "clicks",
    "spend",
    "ctr",
    "cpc",
    "total_revenue",
    "cvr",
    "cpa",
    "aov",
    "orders",
    "total_roas",
    "total_ppv",
    "direct_aov",
    "direct_revenue",
    "units_sold_direct",
    "direct_roas",
    "ppv_direct_click",
    "indirect_revenue",
    "units_sold_indirect",
    "indirect_roas",
    "ppv_indirect_click",
    "indirect_aov",
  ],
  GRAPH_FILTERS_FK: [
    "spend",
    "views",
    "clicks",
    "cvr",
    "ctr",
    "cpc",
    "total_revenue",
    "revenue",
    "orders",
    "total_roas",
    "aov",
    "total_ppv",
    "direct_revenue",
    "units_sold_direct",
    "direct_roas",
    "direct_aov",
    "ppv_direct_click",
    "indirect_revenue",
    "units_sold_indirect",
    "indirect_roas",
    "ppv_indirect_click",
    "indirect_aov",
    "units_sold",
    "direct_cvr",
    "indirect_cvr",
    "direct_roi",
    "indirect_roi",
    "roi",
    "aov_direct",
    "cpm",
    "direct_cpa",
    "indirect_cpa",
    "cpa",
    "ppv",
  ],
  INSTAMART_GRAPH_FILTERS: ["spend", "add2cart", "impressions", "gmv", "roi"],
  COMMON_SCREEN_KEYS: {
    amazon: {
      spend: "spend",
      impressions: "impressions",
      clicks: "clicks",
      sales: "sales",
      aov: "aov",
    },
    blinkit: {
      spend: "estimated_budget_consumed",
      impressions: "impressions",
      clicks: "clicks",
      sales: "sales",
      ctr: "ctr",
      cpc: "cpc",
      aov: "aov",
      roas: "roas",
      orders: "total_quantities_sold",
    },
    flipkart: {
      spend: "spend",
      impressions: "views",
      clicks: "clicks",
      sales: "total_revenue",
      ctr: "ctr",
      cpc: "cpc",
      aov: "aov",
      roas: "roas",
      orders: "orders",
    },
    zepto: {
      spend: "spend",
      impressions: "impressions",
      clicks: "clicks",
      sales: "sales",
      ctr: "ctr",
      cpc: "cpc",
      aov: "aov",
      roas: "roas",
      orders: "orders",
    },
    instamart: {
      spend: "spend",
      impressions: "impressions",
      clicks: "clicks",
      sales: "gmv",
      ctr: "ctr",
      cpc: "cpc",
      aov: "aov",
      roas: "roi",
      orders: "units_sold",
    },
  },

  graphFields: {
    keyword: [
      "impressions",
      "estimated_budget_consumed",
      "new_users_acquired",
      "total_atc",
      "direct_atc",
      "indirect_atc",
      "total_quantities_sold",
      "direct_quantities_sold",
      "indirect_quantities_sold",
      "total_sales",
      "direct_sales",
      "indirect_sales",
    ],
    campaign: [
      "impressions",
      "estimated_budget_consumed",
      "new_users_acquired",
      "total_atc",
      "direct_atc",
      "indirect_atc",
      "direct_quantities_sold",
      "total_quantities_sold",
      "indirect_quantities_sold",
      "total_sales",
      "direct_sales",
      "indirect_sales",
    ],
    category: [
      "impressions",
      "estimated_budget_consumed",
      "new_users_acquired",
      "total_atc",
      "direct_atc",
      "indirect_atc",
      "direct_quantities_sold",
      "total_quantities_sold",
      "indirect_quantities_sold",
      "total_sales",
      "direct_sales",
      "indirect_sales",
      "unique_clicks",
    ],
  },

  graphFieldsInstamart: {
    campaign: ["spend", "impressions", "add2cart", "gmv"],
    keyword: ["spend", "impressions", "add2cart", "gmv"],
    product: ["spend", "impressions", "add2cart", "gmv"],
  },

  graphFieldsZepto: {
    keyword: [
      "spend",
      "impressions",
      "clicks",
      "revenues",
      // "roas",
      // "cpc",
      // "ctr",
      // "cpm",
    ],
    campaign: [
      // "campaign_budget",
      "impressions",
      "spend",
      "clicks",
      // "ctr",
      "add2cart",
      "orders",
      "revenues",
      // "roas",
      // "cpm",
      // "cpc",
      // "indirect_sales",
    ],
    category: [
      "spend",
      "impressions",
      "clicks",
      "revenues",
      // "roas",
      "orders",
      // "ctr",
      // "cpc",
      // "cpm",
    ],
    product: [
      "spend",
      "impressions",
      "clicks",
      "revenues",
      // "roas",
      "orders",
      // "cpc",
      // "ctr",
      // "cpm",
    ],
  },

  graphFieldsFlipkart: {
    campaign: [
      "views",
      "clicks",
      // "ctr",
      "spend",
      "orders",
      // "revenue",
      "direct_revenue",
      "indirect_revenue",
      // "ppv",
      "ppv_direct_click",
      "ppv_indirect_click",
      // "units_sold",
      "units_sold_direct",
      "units_sold_indirect",
      "total_ppv",
    ],
    placement: [
      "clicks",
      "views",
      "spend",
      "units_sold_direct",
      "units_sold_indirect",
      "total_units_sold",
      "direct_revenue",
      "indirect_revenue",
      "total_revenue",
      "ppv_direct_click",
      "ppv_indirect_click",
    ],
    adgroup: [
      "views",
      "clicks",
      // "ctr",
      "spend",
      "orders",
      // "revenue",
      "direct_revenue",
      "indirect_revenue",
      // "ppv",
      "ppv_direct_click",
      "ppv_indirect_click",
      // "units_sold",
      "units_sold_direct",
      "units_sold_indirect",
    ],
    keyword: [
      "spend",
      "views",
      "clicks",
      "total_units_sold",

      "direct_units_sold",

      "indirect_units_sold",

      "total_revenue",

      "direct_revenue",

      "indirect_revenue",

      "total_ppv",
    ],
    creative: [
      
        {
          sumAlias: "spend", //
          field: "spend",
        },
        {
          sumAlias: "views", //
          field: "views",
        },

        { sumAlias: "clicks", field: "clicks" },
        {
          sumAlias: "units_sold", //
          field: "total_units_click",
        },
        {
          sumAlias: "direct_units_sold", //
          field: "units_direct_click",
        },
        {
          sumAlias: "indirect_units_sold", //
          field: "units_indirect_click",
        },
        {
          sumAlias: "direct_ppv", //
          field: "ppv_direct_click",
        },
        {
          sumAlias: "indirect_ppv", //
          field: "ppv_indirect_click",
        },
        // {
        //   sumAlias: "direct_aov",
        //   field: "direct_aov",
        // },
        // {
        //   sumAlias: "indirect_aov",
        //   field: "indirect_aov",
        // },

        // {
        //   sumAlias: "roi",
        //   field: "total_roas",
        // },
        // {
        //   sumAlias: "direct_roi",
        //   field: "direct_roas",
        // },
        // {
        //   sumAlias: "direct_roi",
        //   field: "direct_roas",
        // },
        // {
        //   sumAlias: "indirect_roi",
        //   field: "indirect_roas",
        // },
        {
          sumAlias: "revenue",
          field: "total_revenue_click",
        },
        {
          sumAlias: "direct_revenue",
          field: "revenue_direct_click",
        },
        {
          sumAlias: "indirect_revenue",
          field: "revenue_indirect_click",
        },
      
    ],
    fsn: [
      "clicks",
      "views",
      "spend",
      "units_sold_direct",
      "units_sold_indirect",
      "total_units_sold",
      "direct_revenue",
      "indirect_revenue",
      "total_revenue",
    ],
  },

  DASHBOARD_SUMMARY: {
    overview: {
      all: {
        spend: {
          name: "Spends",
          value: 0,
          graphName: "Spends",
          totalValue: 0,
          totalLastValue: 0,
        },
        views: {
          name: "Views",
          value: 0,
          graphName: "Views",
          totalValue: 0,
          totalLastValue: 0,
        },
        clicks: {
          name: "Clicks + ATB",
          value: 0,
          graphName: "Clicks",
          totalValue: 0,
          totalLastValue: 0,
        },
        cvr: { name: "CVR", value: 0, graphName: "CVR" },
        ctr: { name: "CTR", value: 0, graphName: "CTR" },
        cpc: { name: "CPC", value: 0, graphName: "CPC" },
        total_revenue: {
          name: "Sales",
          value: 0,
          graphName: "Sales",
          totalValue: 0,
          totalLastValue: 0,
        },
        orders: {
          name: "Orders",
          value: 0,
          graphName: "Orders",
          totalValue: 0,
          totalLastValue: 0,
        },
        total_roas: { name: "ROAS", value: 0, graphName: "ROAS" },
        aov: { name: "AOV", value: 0, graphName: "AOV" },
        total_ppv: {
          name: "PPV",
          value: 0,
          graphName: "PPV",
          totalValue: 0,
          totalLastValue: 0,
        },
      },
      GRAPH_FILTERS_FK: {
        spend: {
          name: "Spends",
          value: 0,
          graphName: "Spends",
          totalValue: 0,
          totalLastValue: 0,
        },
        views: {
          name: "Views",
          value: 0,
          graphName: "Views",
          totalValue: 0,
          totalLastValue: 0,
        },
        clicks: {
          name: "Clicks + ATB",
          value: 0,
          graphName: "Clicks",
          totalValue: 0,
          totalLastValue: 0,
        },
        cvr: { name: "CVR", value: 0, graphName: "CVR" },
        ctr: { name: "CTR", value: 0, graphName: "CTR" },
        cpc: { name: "CPC", value: 0, graphName: "CPC" },
        total_revenue: {
          name: "Sales",
          value: 0,
          graphName: "Sales",
          totalValue: 0,
          totalLastValue: 0,
        },
        revenue: {
          name: "Sales",
          value: 0,
          graphName: "Sales",
          totalValue: 0,
          totalLastValue: 0,
        },
        orders: {
          name: "Orders",
          value: 0,
          graphName: "Orders",
          totalValue: 0,
          totalLastValue: 0,
        },
        units_sold: {
          name: "Orders",
          value: 0,
          graphName: "Orders",
          totalValue: 0,
          totalLastValue: 0,
        },
        total_roas: { name: "ROAS", value: 0, graphName: "ROAS" },
        aov: { name: "AOV", value: 0, graphName: "AOV" },
        total_ppv: {
          name: "PPV",
          value: 0,
          graphName: "PPV",
          totalValue: 0,
          totalLastValue: 0,
        },
        direct_cvr: {
          name: "Direct CVR",
          value: 0,
          graphName: "Direct CVR",
          totalValue: 0,
          totalLastValue: 0,
        },
        indirect_cvr: {
          name: "Indirect CVR",
          value: 0,
          graphName: "Indirect CVR",
          totalValue: 0,
          totalLastValue: 0,
        },
        direct_roi: {
          name: "Direct ROI",
          value: 0,
          graphName: "Direct ROI",
          totalValue: 0,
          totalLastValue: 0,
        },
        indirect_roi: {
          name: "Indirect ROI",
          value: 0,
          graphName: "Indirect ROI",
          totalValue: 0,
          totalLastValue: 0,
        },
        roi: {
          name: "ROI",
          value: 0,
          graphName: "ROI",
          totalValue: 0,
          totalLastValue: 0,
        },
        aov_direct: {
          name: "Direct AOV",
          value: 0,
          graphName: "Direct AOV",
          totalValue: 0,
          totalLastValue: 0,
        },
        aov_direct: {
          name: "Direct AOV",
          value: 0,
          graphName: "Direct AOV",
          totalValue: 0,
          totalLastValue: 0,
        },
        cpm: {
          name: "CPM",
          value: 0,
          graphName: "CPM",
          totalValue: 0,
          totalLastValue: 0,
        },
        direct_cpa: {
          name: "Direct CPA",
          value: 0,
          graphName: "Direct CPA",
          totalValue: 0,
          totalLastValue: 0,
        },
        indirect_cpa: {
          name: "Indirect CPA",
          value: 0,
          graphName: "Indirect CPA",
          totalValue: 0,
          totalLastValue: 0,
        },
        cpa: {
          name: "CPA",
          value: 0,
          graphName: "CPA",
          totalValue: 0,
          totalLastValue: 0,
        },
        total_units_sold: {
          name: "Orders",
          value: 0,
          graphName: "Orders",
          totalValue: 0,
          totalLastValue: 0,
        }
        // ppv: {
        //   name: "PPV",
        //   value: 0,
        //   graphName: "PPV",
        //   totalValue: 0,
        //   totalLastValue: 0,
        // }
      },
      view: [
        "spend",
        "views",
        "clicks",
        "cvr",
        "ctr",
        "cpc",
        "total_revenue",
        "orders",
        "total_roas",
        "aov",
      ],
      graph: ["spend", "orders"],
    },
    direct: {
      all: {
        direct_revenue: {
          name: "Sales",
          value: 0,
          graphName: "Direct Sales",
          totalValue: 0,
          totalLastValue: 0,
        },
        units_sold_direct: {
          name: "Orders",
          value: 0,
          graphName: "Direct Orders",
          totalValue: 0,
          totalLastValue: 0,
        },
        direct_roas: { name: "ROAS", value: 0, graphName: "Direct ROAS" },
        direct_aov: { name: "AOV", value: 0, graphName: "Direct AOV" },
        ppv_direct_click: {
          name: "PPV",
          value: 0,
          graphName: "Direct PPV",
          totalValue: 0,
          totalLastValue: 0,
        },
      },
      view: [
        "direct_revenue",
        "units_sold_direct",
        "direct_roas",
        "direct_aov",
      ],
      graph: [],
    },
    indirect: {
      all: {
        indirect_revenue: {
          name: "Sales",
          value: 0,
          graphName: "Indirect Sales",
          totalValue: 0,
          totalLastValue: 0,
        },
        units_sold_indirect: {
          name: "Orders",
          value: 0,
          graphName: "Indirect Orders",
          totalValue: 0,
          totalLastValue: 0,
        },
        indirect_roas: { name: "ROAS", value: 0, graphName: "Indirect ROAS" },
        indirect_aov: { name: "AOV", value: 0, graphName: "Indirect AOV" },
        ppv_indirect_click: {
          name: "PPV",
          value: 0,
          graphName: "Indirect PPV",
          totalValue: 0,
          totalLastValue: 0,
        },
      },
      view: [
        "indirect_revenue",
        "units_sold_indirect",
        "indirect_roas",
        "indirect_aov",
      ],
      graph: [],
    },
  },
  BLINKIT_GRAPH_FILTERS: [
    "estimated_budget_consumed",
    "impressions",
    "estimated_budget_consumed_reach",
    "impressions_reach",
    "estimated_budget_consumed_performance",
    "impressions_performance",
    "reach",
    "unique_clicks",
    "total_roas",
    "cpm",
    "new_users_acquired",
    "direct_sales",
    "indirect_sales",
    "ctr",
    "total_atc",
    "direct_atc",
    "indirect_atc",
    "total_quantities_sold",
    "direct_quantities_sold",
    "indirect_quantities_sold",
    "total_sales",
    "roas",
    "atc_percent",
    "campaign_budget",
    "cpm_performance",
        "new_users_acquired_performance",
        "direct_sales_performance",
        "indirect_sales_performance",
        "estimated_budget_consumed_performance",
        "impressions_performance",
        "total_atc_performance",
        "direct_atc_performance",
        "indirect_atc_performance",
        "direct_quantities_sold_performance",
        "indirect_quantities_sold_performance",
        "total_quantities_sold_performance",
        "unique_clicks_performance",
        "total_sales_performance",
        "roas_performance",
        "ctr_performance",


        "estimated_budget_consumed",
        "impressions",
        "estimated_budget_consumed_reach",
        "impressions_reach",
        "unique_clicks_reach",
        "total_roas_reach",
        "cpm_reach",
        "new_users_acquired_reach",
        "direct_sales_reach",
        "indirect_sales_reach",
        "total_sales_reach",
        "total_atc_reach",
        "direct_atc_reach",
        "indirect_atc_reach",
        "direct_quantities_sold_reach",
        "indirect_quantities_sold_reach",
        "total_quantities_sold_reach",
        "roas_reach",
        "ctr_reach",
        "reach",
        "unique_clicks",
        "unique_clicks_reach",
        "total_roas",
        "cpm",
        "new_users_acquired",
        "direct_sales",
        "indirect_sales",
        "total_sales",
        "total_atc",
        "direct_atc",
        "indirect_atc",
        "direct_quantities_sold",
        "indirect_quantities_sold",
        "total_quantities_sold",
        "roas",
        "ctr",
  ],
  BLINKIT_COMMON_GRAPH_FILTERS: [
    "estimated_budget_consumed",
    "impressions",
    "estimated_budget_consumed_reach",
    "impressions_reach",
    "estimated_budget_consumed_performance",
    "impressions_performance",
    "reach",
    "unique_clicks",
    "total_roas",
    "cpm",
    "new_users_acquired",
    "direct_sales",
    "indirect_sales",
    "clicks",
    "roas"
  ],

  BLINKIT_DASHBOARD_SUMMARY_CommonScreen: {
    overview: {
      all: {
        estimated_budget_consumed: {
          name: "Spends",
          value: 0,
          graphName: "Spends",
        },
        impressions: {
          name: "Impressions",
          value: 0,
          graphName: "Impressions",
        },
        total_sales: {
          name: "Total Sales",
          value: 0,
          graphName: "total_sales",
        },
        total_quantities_sold: {
          name: "Total Quantities Sold",
          value: 0,
          graphName: "total_quantities_sold",
        },
        total_roas: {
          name: "Total ROAS",
          value: 0,
          graphName: "total_roas",
        },
        unique_clicks: {
          name: "Unique Clicks",
          value: 0,
          graphName: "unique_clicks",
        },
        ctr: {
          name: "CTR",
          value: 0,
          graphName: "ctr",
        },
        cpc: {
          name: "CPC",
          value: 0,
          graphName: "cpc",
        },
        aov: {
          name: "AOV",
          value: 0,
          graphName: "aov",
        },
      },
      view: ["estimated_budget_consumed", "impressions"],
      graph: ["estimated_budget_consumed", "impressions"],
    },
  },

  BLINKIT_DASHBOARD_SUMMARY: {
    overview: {
      all: {
        estimated_budget_consumed: {
          name: "Spends",
          value: 0,
          graphName: "Spends",
          totalValue: 0,
          totalLastValue: 0,
        },
        impressions: {
          name: "Impressions",
          value: 0,
          graphName: "Impressions",
          totalValue: 0,
          totalLastValue: 0,
        },
        ctr: {
          name: "CTR",
          value: 0,
          graphName: "CTR",
        },
        total_quantities_sold: {
          name: "Total Orders",
          value: 0,
          graphName: "Total Orders",
        },
        roas: {
          name: "ROAS",
          value: 0,
          graphName: "roas",
        },
        unique_clicks: {
          name: "Clicks",
          value: 0,
          graphName: "R. Clicks",
          totalValue: 0,
          totalLastValue: 0,
        },
        cpm: {
          name: "CPM",
          value: 0,
          graphName: "CPM",
        },
        new_users_acquired: {
          name: "New User",
          value: 0,
          graphName: "New User",
        },
        total_atc: {
          name: "Total ATC",
          value: 0,
          graphName: "Total ATC",
        },
        direct_atc: {
          name: "Direct ATC",
          value: 0,
          graphName: "Direct ATC",
        },
        indirect_atc: {
          name: "Indirect ATC",
          value: 0,
          graphName: "Indirect ATC",
        },
        total_quantities_sold: {
          name: "Total Orders",
          value: 0,
          graphName: "Total Orders",
        },
        direct_quantities_sold: {
          name: "Direct Orders",
          value: 0,
          graphName: "Direct Orders",
        },
        indirect_quantities_sold: {
          name: "Indirect Orders",
          value: 0,
          graphName: "Indirect Orders",
        },
        total_sales: {
          name: "Total Sales",
          value: 0,
          graphName: "Total Sales",
        },
        direct_sales: {
          name: "Direct Sales",
          value: 0,
          graphName: "Direct Sales",
        },
        indirect_sales: {
          name: "Indirect Sales",
          value: 0,
          graphName: "Indirect Orders",
        },
      },
      CM_graph: {
        estimated_budget_consumed: {
          name: "Spends",
          value: 0,
          graphName: "Spends",
        },
        impressions: {
          name: "Impressions",
          value: 0,
          graphName: "Impressions",
        },
        ctr: {
          name: "CTR",
          value: 0,
          graphName: "CTR",
        },
        cpm: {
          name: "CPM",
          value: 0,
          graphName: "CPM",
        },
        new_users_acquired: {
          name: "New User",
          value: 0,
          graphName: "New User",
        },
        total_atc: {
          name: "Total ATC",
          value: 0,
          graphName: "Total ATC",
        },
        direct_atc: {
          name: "Direct ATC",
          value: 0,
          graphName: "Direct ATC",
        },
        indirect_atc: {
          name: "Indirect ATC",
          value: 0,
          graphName: "Indirect ATC",
        },
        total_quantities_sold: {
          name: "Total Orders",
          value: 0,
          graphName: "Total Orders",
        },
        direct_quantities_sold: {
          name: "Direct Orders",
          value: 0,
          graphName: "Direct Orders",
        },
        indirect_quantities_sold: {
          name: "Indirect Orders",
          value: 0,
          graphName: "Indirect Orders",
        },
        total_sales: {
          name: "Total Sales",
          value: 0,
          graphName: "Total Sales",
        },
        direct_sales: {
          name: "Direct Sales",
          value: 0,
          graphName: "Direct Sales",
        },
        indirect_sales: {
          name: "Indirect Sales",
          value: 0,
          graphName: "Indirect Orders",
        },
        roas: {
          name: "ROAS",
          value: 0,
          graphName: "ROAS",
        },
        atc_percent: {
          name: "ATC%",
          value: 0,
          graphName: "ATC%",
        },
        campaign_budget: {
          name: "Budget%",
          value: 0,
          graphName: "Budget",
        },
        unique_clicks: {
          name: "Clicks",
          value: 0,
          graphName: "Clicks",
          totalValue: 0,
          totalLastValue: 0,
        },

      },
      view: ["estimated_budget_consumed", "impressions", "total_sales"],
      graph: ["estimated_budget_consumed", "impressions"],
    },
    reach: {
      all: {
        estimated_budget_consumed_reach: {
          name: "Spends",
          value: 0,
          graphName: "R. Spends",
          totalValue: 0,
          totalLastValue: 0,
        },
        impressions_reach: {
          name: "Impressions",
          value: 0,
          graphName: "R. Impressions",
          totalValue: 0,
          totalLastValue: 0,
        },

        reach: {
          name: "Reach",
          value: 0,
          graphName: "R. Reach",
          totalValue: 0,
          totalLastValue: 0,
        },

        unique_clicks_reach: {
          name: "Clicks",
          value: 0,
          graphName: "R. Clicks",
          totalValue: 0,
          totalLastValue: 0,
        },
        ctr_reach: {
          name: "CTR",
          value: 0,
          graphName: "R. CTR",
          totalValue: 0,
          totalLastValue: 0,
        },
        total_quantities_sold_reach: {
          name: "Total Orders",
          value: 0,
          graphName: "R. Total Orders",
          totalValue: 0,
          totalLastValue: 0,
        },
        roas_reach: {
          name: "ROAS",
          value: 0,
          graphName: "R. Roas",
          totalValue: 0,
          totalLastValue: 0,
        },
        cpm_reach: {
          name: "CPM",
          value: 0,
          graphName: "R. CPM",
          totalValue: 0,
          totalLastValue: 0,
        },
        new_users_acquired_reach: {
          name: "New User",
          value: 0,
          graphName: "R. New User",
          totalValue: 0,
          totalLastValue: 0,
        },
        total_atc_reach: {
          name: "Total ATC",
          value: 0,
          graphName: "R. Total ATC",
          totalValue: 0,
          totalLastValue: 0,
        },
        direct_atc_reach: {
          name: "Direct ATC",
          value: 0,
          graphName: "R. Direct ATC",
          totalValue: 0,
          totalLastValue: 0,
        },
        indirect_atc_reach: {
          name: "Indirect ATC",
          value: 0,
          graphName: "R. Indirect ATC",
          totalValue: 0,
          totalLastValue: 0,
        },
        total_quantities_sold_reach: {
          name: "Total Orders",
          value: 0,
          graphName: "R. Total Orders",
          totalValue: 0,
          totalLastValue: 0,
        },
        direct_quantities_sold_reach: {
          name: "Direct Orders",
          value: 0,
          graphName: "R. Direct Orders",
          totalValue: 0,
          totalLastValue: 0,
        },
        indirect_quantities_sold_reach: {
          name: "Indirect Orders",
          value: 0,
          graphName: "R. Indirect Orders",
          totalValue: 0,
          totalLastValue: 0,
        },
        total_sales_reach: {
          name: "Total Sales",
          value: 0,
          graphName: "R. Total Sales",
          totalValue: 0,
          totalLastValue: 0,
        },
        direct_sales_reach: {
          name: "Direct Sales",
          value: 0,
          graphName: "R. Direct Sales",
          totalValue: 0,
          totalLastValue: 0,
        },
        indirect_sales: {
          name: "Indirect Sales",
          value: 0,
          graphName: "R. Indirect Orders",
          totalValue: 0,
          totalLastValue: 0,
        },
      },
      view: [
        "estimated_budget_consumed_reach",
        "impressions_reach",
        "total_sales_reach",
      ],
      graph: [],
    },
    performance: {
      all: {
        estimated_budget_consumed_performance: {
          name: "Spends",
          value: 0,
          graphName: "P. Spends",
          totalValue: 0,
          totalLastValue: 0,
        },
        impressions_performance: {
          name: "Impressions",
          value: 0,
          graphName: "P. Impressions",
          totalValue: 0,
          totalLastValue: 0,
        },
        roas_performance: {
          name: "ROAS",
          value: 0,
          graphName: "P. ROAS",
        },
        cpm_performance: {
          name: "CPM",
          value: 0,
          graphName: "P. CPM",
        },

        new_users_acquired_performance: {
          name: "New Users",
          value: 0,
          graphName: "P. New Users",
          totalValue: 0,
          totalLastValue: 0,
        },
        direct_sales_performance: {
          name: "Direct Sales",
          value: 0,
          graphName: "P. Direct Sales",
          totalValue: 0,
          totalLastValue: 0,
        },
        indirect_sales_performance: {
          name: "Indirect Sales",
          value: 0,
          graphName: "P. Indirect Sales",
          totalValue: 0,
          totalLastValue: 0,
        },
        total_atc_performance: {
          name: "Total ATC",
          value: 0,
          graphName: "P. Total ATC",
          totalValue: 0,
          totalLastValue: 0,
        },
        direct_atc_performance: {
          name: "Direct ATC",
          value: 0,
          graphName: "P. Direct ATC",
          totalValue: 0,
          totalLastValue: 0,
        },
        indirect_atc_performance: {
          name: "Indirect ATC",
          value: 0,
          graphName: "P. Indirect ATC",
          totalValue: 0,
          totalLastValue: 0,
        },
        total_quantities_sold_performance: {
          name: "Total Orders",
          value: 0,
          graphName: "P. Total Orders",
          totalValue: 0,
          totalLastValue: 0,
        },
        direct_quantities_sold_performance: {
          name: "Direct Orders",
          value: 0,
          graphName: "P. Direct Orders",
          totalValue: 0,
          totalLastValue: 0,
        },
        indirect_quantities_sold_performance: {
          name: "Indirect Orders",
          value: 0,
          graphName: "P. Indirect Orders",
          totalValue: 0,
          totalLastValue: 0,
        },
        unique_clicks_performance: {
          name: "Clicks",
          value: 0,
          graphName: "P. Clicks",
          totalValue: 0,
          totalLastValue: 0,
        },
        total_sales_performance: {
          name: "Total Sales",
          value: 0,
          graphName: "P. Total Sales",
          totalValue: 0,
          totalLastValue: 0,
        },
        roas_performance: {
          name: "ROAS",
          value: 0,
          graphName: "P. Roas",
          totalValue: 0,
          totalLastValue: 0,
        },
        ctr_performance: {
          name: "CTR",
          value: 0,
          graphName: "P. CTR",
          totalValue: 0,
          totalLastValue: 0,
        },
      },

      view: [
        "estimated_budget_consumed_performance",
        "total_sales_performance",
        "total_quantities_sold_performance",
        "impressions_performance",
        "roas_performance",
        "cpm_performance",
      ],
      graph: [],
    },
  },
  BLINKIT_PERFORMANCE_BREAKDOWN: {
    overview: {
      all: {
        spend: {
          name: "Spend",
          value: 0,
          totalValue: 0,
          totalLastValue: 0,
          // graphName: "spend",
        },
        impression: {
          name: "Impressions",
          value: 0,
          totalValue: 0,
          totalLastValue: 0,
          // graphName: "impression",
        },
        ATC: {
          name: "ATC",
          value: 0,
          // graphName: "ATC",
        },
        Orders: {
          name: "Orders",
          value: 0,
          totalValue: 0,
          totalLastValue: 0,
          // graphName: "Orders",
        },
        roas: {
          name: "ROAS",
          value: 0,
          // graphName: "roas",
        },
        sales: {
          name: "Sales",
          value: 0,
          totalValue: 0,
          totalLastValue: 0,
          // graphName: "sales",
        },
        newUser: {
          name: "New User",
          value: 0,
          totalValue: 0,
          totalLastValue: 0,
          // graphName: "newUser",
        },
      },
      // view: [
      //   "spend",
      //   "impression",
      //   "ATC",
      //   "Orders",
      //   "roas",
      //   "sales",
      //   "newUser",
      // ],
      // graph: [
      //   "spend",
      //   "impression",
      //   "ATC",
      //   "Orders",
      //   "roas",
      //   "sales",
      //   "newUser",
      // ],
    },
    keyword: {
      all: {
        spend: {
          name: "Spend",
          value: 0,
          totalValue: 0,
          totalLastValue: 0,
          // graphName: "spend",
        },
        impression: {
          name: "Impressions",
          value: 0,
          totalValue: 0,
          totalLastValue: 0,
          // graphName: "impression",
        },
        ATC: {
          name: "ATC",
          value: 0,
          // graphName: "ATC",
        },
        Orders: {
          name: "Orders",
          value: 0,
          totalValue: 0,
          totalLastValue: 0,
          // graphName: "Orders",
        },
        roas: {
          name: "ROAS",
          value: 0,
          // graphName: "roas",
        },
        sales: {
          name: "Sales",
          value: 0,
          totalValue: 0,
          totalLastValue: 0,
          // graphName: "sales",
        },
        newUser: {
          name: "New User",
          value: 0,
          totalValue: 0,
          totalLastValue: 0,
          // graphName: "newUser",
        },
      },
      // view: [
      //   "spend",
      //   "impression",
      //   "ATC",
      //   "Orders",
      //   "roas",
      //   "sales",
      //   "newUser",
      // ],
      // graph: [
      //   "spend",
      //   "impression",
      //   "ATC",
      //   "Orders",
      //   "roas",
      //   "sales",
      //   "newUser",
      // ],
    },
    category: {
      all: {
        spend: {
          name: "Spend",
          value: 0,
          totalValue: 0,
          totalLastValue: 0,
          // graphName: "spend",
        },
        impression: {
          name: "Impressions",
          value: 0,
          totalValue: 0,
          totalLastValue: 0,
          // graphName: "impression",
        },
        ATC: {
          name: "ATC",
          value: 0,
          totalValue: 0,
          totalLastValue: 0,
          // graphName: "ATC",
        },
        Orders: {
          name: "Orders",
          value: 0,
          totalValue: 0,
          totalLastValue: 0,
          // graphName: "Orders",
        },
        roas: {
          name: "ROAS",
          value: 0,
          // graphName: "roas",
        },
        sales: {
          name: "Sales",
          value: 0,
          totalValue: 0,
          totalLastValue: 0,
          // graphName: "sales",
        },
        newUser: {
          name: "New User",
          value: 0,
          totalValue: 0,
          totalLastValue: 0,
          // graphName: "newUser",
        },
      },
      // view: [
      //   "spend",
      //   "impression",
      //   "ATC",
      //   "Orders",
      //   "roas",
      //   "sales",
      //   "newUser",
      // ],
      // graph: [
      //   "spend",
      //   "impression",
      //   "ATC",
      //   "Orders",
      //   "roas",
      //   "sales",
      //   "newUser",
      // ],
    },
  },

  // AMS_GRAPHF_FILTERS: [
  //   "spend",
  //   "impressions",
  //   "clicks",
  //   "ctr",
  //   "cpc",
  //   "orders",
  //   "roas",
  //   "sales",
  //   "cvr",
  // ],
  // AMS_DASHBOARD: {
  //   overview: {
  //     all: {
  //       spend: { name: "Spends", value: 0, graphName: "Spends" },
  //       impressions: { name: "Views", value: 0, graphName: "Views" },
  //       clicks: { name: "Clicks", value: 0, graphName: "Clicks" },
  //       cvr: { name: "CVR", value: 0, graphName: "CVR" },
  //       ctr: { name: "CTR", value: 0, graphName: "CTR" },
  //       cpc: { name: "CPC", value: 0, graphName: "CPC" },
  //       sales: { name: "Sales", value: 0, graphName: "Sales" },
  //       orders: { name: "Units Sold", value: 0, graphName: "Units Sold" },
  //       roas: { name: "ROI", value: 0, graphName: "ROI" },
  //     },
  //     view: [
  //       "spend",
  //       "impressions",
  //       "clicks",
  //       "cvr",
  //       "ctr",
  //       "cpc",
  //       "orders",
  //       "roas",
  //       "sales",
  //     ],
  //     graph: ["spend", "orders"],
  //   },
  // },
  // BLINKIT_REPORT_CALCULATIONS: {
  //   campaign: [
  //     {
  //       alias: "cpm",
  //       formula:
  //         "ROUND((CASE WHEN subquery.impressions <> 0 THEN (subquery.estimated_budget_consumed / subquery.impressions * 1000) ELSE 0 END)::numeric, 2)",
  //     },
  //   ],
  // },
  AMAZON_FILTERS: [
    "impressions",
    "clicks",
    "ctr",
    "spend",
    "cpc",
    "sales",
    "acos",
    "vctr",
    "revenue",
    "roas",
    // "orders",
    "units_sold",
    // "aov",
    "views",
    "conversions",
    "conversion",
    "cvr",
    "ntb_orders_perc",
    "ntb_sales",
    "ntb_sales_perc",
    "viewable_impressions",
    "ntb_orders",
    "vtr",
    "impressions_sp",
    "clicks_sp",
    "ctr_sp",
    "spend_sp",
    "cpc_sp",
    "sales_sp",
    "acos_sp",
    "roas_sp",
    "units_sold_sp",
    "aov_sp",
    "cvr_sp",
    "impressions_sb",
    "clicks_sb",
    "ctr_sb",
    "spend_sb",
    "cpc_sb",
    "sales_sb",
    "acos_sb",
    "roas_sb",
    "units_sold_sb",
    "ntb_orders_sb",
    "ntb_orders_perc_sb",
    "ntb_sales_sb",
    "viewable_impressions_sb",
    "aov_sb",
    "cvr_sb",
    "impressions_sd",
    "clicks_sd",
    "ctr_sd",
    "spend_sd",
    "cpc_sd",
    "sales_sd",
    "acos_sd",
    "roas_sd",
    "units_sold_sd",
    "ntb_orders_sd",
    "ntb_orders_perc_sd",
    "ntb_sales_sd",
    "viewable_impressions_sd",
    "aov_sd",
    "cvr_sd",
  ],
  Amazon_DASHBOARD_SUMMARY: {
    overview: {
      all: {
        impressions: {
          name: "Impressions",
          value: 0,
          graphName: "Impressions",
          totalValue: 0,
          totalLastValue: 0,
        },
        clicks: {
          name: "Clicks",
          value: 0,
          graphName: "Clicks",
          totalValue: 0,
          totalLastValue: 0,
        },
        ctr: {
          name: "CTR",
          value: 0,
          graphName: "CTR",
        },
        spend: {
          name: "Spend",
          value: 0,
          graphName: "Spend",
          totalValue: 0,
          totalLastValue: 0,
        },
        cpc: {
          name: "CPC",
          value: 0,
          graphName: "CPC",
        },
        sales: {
          name: "Sales",
          value: 0,
          graphName: "Sales",
          totalValue: 0,
          totalLastValue: 0,
        },
        acos: {
          name: "ACOS",
          value: 0,
          graphName: "ACOS",
        },
        roas: {
          name: "ROAS",
          value: 0,
          graphName: "ROAS",
        },
        units_sold: {
          name: "Orders",
          value: 0,
          graphName: "Orders",
          totalValue: 0,
          totalLastValue: 0,
        },
        aov: {
          name: "AOV",
          value: 0,
          graphName: "AOV",
        },
        cvr: {
          name: "CVR",
          value: 0,
          graphName: "CVR",
        },
      },
      CM_graph: {
        impressions: {
          name: "Impressions",
          value: 0,
          graphName: "Impressions",
        },
        views: {
          name: "Impressions",
          value: 0,
          graphName: "Impressions",
        },
        clicks: {
          name: "Clicks",
          value: 0,
          graphName: "Clicks",
        },
        ctr: {
          name: "CTR",
          value: 0,
          graphName: "CTR",
        },
        spend: {
          name: "Spend",
          value: 0,
          graphName: "Spend",
        },
        cpc: {
          name: "CPC",
          value: 0,
          graphName: "CPC",
        },
        sales: {
          name: "Sales",
          value: 0,
          graphName: "Sales",
        },
        acos: {
          name: "ACOS",
          value: 0,
          graphName: "ACOS",
        },
        roas: {
          name: "ROAS",
          value: 0,
          graphName: "ROAS",
        },
        units_sold: {
          name: "Orders",
          value: 0,
          graphName: "Orders",
        },
        aov: {
          name: "AOV",
          value: 0,
          graphName: "AOV",
        },
        cvr: {
          name: "CVR",
          value: 0,
          graphName: "CVR",
        },
        ntb_orders_perc: {
          name: "% of orders NTB",
          value: 0,
          graphName: "% of orders NTB",
        },
        ntb_sales: {
          name: "NTB Sales",
          value: 0,
          graphName: "NTB Sales",
        },
        ntb_sales_perc: {
          name: "% of sales NTB",
          value: 0,
          graphName: "% of sales NTB",
        },
        viewable_impressions: {
          name: "Viewable impressions",
          value: 0,
          graphName: "Viewable impressions",
        },
        ntb_orders: {
          name: "NTB Orders",
          value: 0,
          graphName: "NTB Orders",
        },
        vtr: {
          name: "VTR",
          value: 0,
          graphName: "VTR",
        },
        vctr: {
          name: "vCTR",
          value: 0,
          graphName: "vCTR",
        },
        orders: {
          name: "Orders",
          value: 0,
          graphName: "Orders",
        },
        revenue: {
          name: "Sales",
          value: 0,
          graphName: "Sales",
        },
        conversions: {
          name: "Orders",
          value: 0,
          graphName: "Orders",
        },
        conversion: {
          name: "Orders",
          value: 0,
          graphName: "Orders",
        },
      },
      view: [
        "impressions",
        "clicks",
        "ctr",
        "spend",
        "cpc",
        "sales",
        "acos",
        "roas",
        "units_sold",
        "aov",
        "cvr",
      ],
      graph: ["impressions", "spend"],
    },
    sp: {
      all: {
        impressions_sp: {
          name: "Impressions",
          value: 0,
          graphName: "Impressions SP",
          totalValue: 0,
          totalLastValue: 0,
        },
        clicks_sp: {
          name: "Clicks",
          value: 0,
          graphName: "Clicks sp",
          totalValue: 0,
          totalLastValue: 0,
          modifiedGraphName: "Clicks SP"
        },
        ctr_sp: {
          name: "CTR",
          value: 0,
          graphName: "CTR SP",
        },
        spend_sp: {
          name: "Spend",
          value: 0,
          graphName: "Spend SP",
          totalValue: 0,
          totalLastValue: 0,
        },
        cpc_sp: {
          name: "CPC",
          value: 0,
          graphName: "CPC SP",
        },
        sales_sp: {
          name: "Sales",
          value: 0,
          graphName: "Sales SP",
          totalValue: 0,
          totalLastValue: 0,
        },
        acos_sp: {
          name: "ACOS",
          value: 0,
          graphName: "ACOS SP",
        },
        roas_sp: {
          name: "ROAS",
          value: 0,
          graphName: "ROAS SP",
        },
        units_sold_sp: {
          name: "Orders",
          value: 0,
          graphName: "Orders SP",
          totalValue: 0,
          totalLastValue: 0,
        },
        aov_sp: {
          name: "AOV",
          value: 0,
          graphName: "AOV SP",
        },
        cvr_sp: {
          name: "CVR",
          value: 0,
          graphName: "CVR SP",
        },
      },
      view: [
        "impressions_sp",
        "clicks_sp",
        "ctr_sp",
        "spend_sp",
        // "cpc_sp",
        // "sales_sp",
        // "acos_sp",
        // "roas_sp",
        // "units_sold_sp",
      ],
      graph: [],
    },
    sb: {
      all: {
        impressions_sb: {
          name: "Impressions",
          value: 0,
          graphName: "Impressions SB",
          totalValue: 0,
          totalLastValue: 0,
        },
        clicks_sb: {
          name: "Clicks",
          value: 0,
          graphName: "Clicks SB",
          totalValue: 0,
          totalLastValue: 0,
        },
        ctr_sb: {
          name: "CTR",
          value: 0,
          graphName: "CTR SB",
        },
        spend_sb: {
          name: "Spend",
          value: 0,
          graphName: "Spend SB",
          totalValue: 0,
          totalLastValue: 0,
        },
        cpc_sb: {
          name: "CPC",
          value: 0,
          graphName: "CPC SB",
        },
        sales_sb: {
          name: "sales",
          value: 0,
          graphName: "Sales SB",
          totalValue: 0,
          totalLastValue: 0,
        },
        acos_sb: {
          name: "ACOS",
          value: 0,
          graphName: "ACOS SB",
        },
        roas_sb: {
          name: "ROAS",
          value: 0,
          graphName: "ROAS SB",
        },
        units_sold_sb: {
          name: "Orders",
          value: 0,
          graphName: "units_sold sb",
          totalValue: 0,
          totalLastValue: 0,
          modifiedGraphName: 'Orders SB'
        },
        ntb_orders_sb: {
          name: "NtbOrders",
          value: 0,
          graphName: "ntb_orders sb",
          totalValue: 0,
          totalLastValue: 0,
          modifiedGraphName: "NTB Orders SB"
        },
        ntb_orders_perc_sb: {
          name: "Ntb Order perc",
          value: 0,
          graphName: "ntb_orders_perc sb",
          totalValue: 0,
          totalLastValue: 0,
          modifiedGraphName: '%NTB Orders SB'
        },
        ntb_sales_sb: {
          name: "Ntb Sales",
          value: 0,
          graphName: "ntb_sales sb",
          totalValue: 0,
          totalLastValue: 0,
          modifiedGraphName: "NTB Sales SB"
        },
        viewable_impressions_sb: {
          name: "Viewable Impressions",
          value: 0,
          graphName: "viewable_impressions sb",
          totalValue: 0,
          totalLastValue: 0,
          modifiedGraphName: "Viewable Impressions SB"
        },
        aov_sb: {
          name: "AOV",
          value: 0,
          graphName: "AOV SB",
        },
        cvr_sb: {
          name: "CVR",
          value: 0,
          graphName: "CVR SB",
        },
      },
      view: [
        "impressions_sb",
        "clicks_sb",
        "ctr_sb",
        "spend_sb",
        // "cpc_sb",
        // "sales_sb",
        // "acos_sb",
        // "roas_sb",
        // "units_sold_sb",
        // "ntb_orders_sb",
        // "ntb_orders_perc_sb",
        // "ntb_sales_sb",
        // "viewable_impressions_sb",
      ],
      graph: [],
    },
    sd: {
      all: {
        impressions_sd: {
          name: "Impressions",
          value: 0,
          graphName: "Impressions SD",
          totalValue: 0,
          totalLastValue: 0,
        },
        clicks_sd: {
          name: "Clicks",
          value: 0,
          graphName: "Clicks SD",
          totalValue: 0,
          totalLastValue: 0,
        },
        ctr_sd: {
          name: "CTR",
          value: 0,
          graphName: "CTR SD",
        },
        spend_sd: {
          name: "Spend",
          value: 0,
          graphName: "Spend SD",
          totalValue: 0,
          totalLastValue: 0,
        },
        cpc_sd: {
          name: "CPC",
          value: 0,
          graphName: "CPC SD",
        },
        sales_sd: {
          name: "Sales",
          value: 0,
          graphName: "Sales SD",
          totalValue: 0,
          totalLastValue: 0,
        },
        acos_sd: {
          name: "acos",
          value: 0,
          graphName: "ACOS SD",
        },
        roas_sd: {
          name: "ROAS",
          value: 0,
          graphName: "ROAS SD",
        },
        units_sold_sd: {
          name: "Orders",
          value: 0,
          graphName: "units_sold sd",
          totalValue: 0,
          totalLastValue: 0,
          modifiedGraphName: "Orders SD"
        },
        ntb_orders_sd: {
          name: "Ntb Orders",
          value: 0,
          graphName: "ntb_orders sd",
          totalValue: 0,
          totalLastValue: 0,
          modifiedGraphName: "NTB Orders SD"
        },
        ntb_orders_perc_sd: {
          name: "Ntb Orders perc",
          value: 0,
          graphName: "ntb_orders_perc sd",
          totalValue: 0,
          totalLastValue: 0,
          modifiedGraphName: "%NTB Orders SD"
        },
        ntb_sales_sd: {
          name: "Ntb Sales",
          value: 0,
          graphName: "ntb_sales sd",
          totalValue: 0,
          totalLastValue: 0,
          modifiedGraphName: "NTB Sales SD"
        },
        viewable_impressions_sd: {
          name: "Viewable Impressions",
          value: 0,
          graphName: "viewable_impressions sd",
          totalValue: 0,
          totalLastValue: 0,
          modifiedGraphName: "Viewable Impressions SD"
        },
        aov_sd: {
          name: "AOV",
          value: 0,
          graphName: "aov sd",
          modifiedGraphName: "AOV SD"
        },
        cvr_sd: {
          name: "CVR",
          value: 0,
          graphName: "CVR SD",
        },
      },
      view: [
        "impressions_sd",
        "clicks_sd",
        "ctr_sd",
        "spend_sd",
        // "cpc_sd",
        // "sales_sd",
        // "acos_sd",
        // "roas_sd",
        // "units_sold_sd",
        // "ntb_orders_sd",
        // "ntb_orders_perc_sd",
        // "ntb_sales_sd",
        // "viewable_impressions_sd",
      ],
      graph: [],
    },
  },

  INSTAMART_DASHBOARD_SUMMARY_COMMON_SCREEN: {
    overview: {
      all: {
        spend: {
          name: "Spends",
          value: "0",
          last_val: 0,
          last_data: "0",
          graphName: "Spends",
          original_val: 0,
          last_original_val: 0
        },
        impressions: {
          name: "Impressions",
          value: "0",
          last_val: 0,
          last_data: "0",
          graphName: "Impressions",
          original_val: 0,
          last_original_val: 0
        },
        gmv: {
          name: "Sales",
          value: "0",
          last_val: 0,
          last_data: "0",
          graphName: "Sales",
          original_val: 0,
          last_original_val: 0
        },
        clicks: {
          name: "Clicks",
          value: "0",
          last_val: 0,
          last_data: "0",
          graphName: "Clicks",
          original_val: 0,
          last_original_val: 0
        },
        ctr: {
          name: "CTR",
          value: "0",
          last_val: 0,
          last_data: "0",
          graphName: "CTR",
          original_val: 0,
          last_original_val: 0
        },
        cpc: {
          name: "CPC",
          value: "0",
          last_val: 0,
          last_data: "0",
          graphName: "CPC",
          original_val: 0,
          last_original_val: 0
        },
        roi: {
          name: "ROAS",
          value: "0",
          last_val: 0,
          last_data: "0",
          graphName: "ROAS",
          original_val: 0,
          last_original_val: 0
        },
        units_sold: {
          name: "Orders",
          value: "0",
          last_val: 0,
          last_data: "0",
          graphName: "Orders",
          original_val: 0,
          last_original_val: 0
        },
        aov: {
          name: "AOV",
          value: "0",
          last_val: 0,
          last_data: "0",
          graphName: "AOV",
          original_val: 0,
          last_original_val: 0
        }        
      },
      view: ["spend", "impressions", "clicks", "gmv", "roas"],
      graph: ["Spends", "Impressions", "Clicks", "Sales", "ROAS"]
    }
  },

  INSTAMART_FILTERS: ["spend", "impressions", "clicks", "gmv", "roas"],
  
  Amazon_DASHBOARD_SUMMARY_CommonScreen: {
    overview: {
      all: {
        impressions: {
          name: "Impressions",
          value: 0,
          graphName: "Impressions",
        },
        clicks: {
          name: "Clicks",
          value: 0,
          graphName: "clicks",
        },
        ctr: {
          name: "CTR",
          value: 0,
          graphName: "ctr",
        },
        spend: {
          name: "Spend",
          value: 0,
          graphName: "spend",
        },
        cpc: {
          name: "CPC",
          value: 0,
          graphName: "cpc",
        },
        sales: {
          name: "Sales",
          value: 0,
          graphName: "sales",
        },
        acos: {
          name: "ACOS",
          value: 0,
          graphName: "acos",
        },
        roas: {
          name: "ROAS",
          value: 0,
          graphName: "roas",
        },
        units_sold: {
          name: "Orders",
          value: 0,
          graphName: "units_sold",
        },
        aov: {
          name: "AOV",
          value: 0,
          graphName: "aov",
        },
      },
    },
  },

  BLINKIT_REPORT_DATA: {
    fields: ["cpm", "atc_percent"],
    perArray: [
      "atc_percent",

      "ctr",
      // "direct_aov",
      // "indirect_aov",
      // "total_aov",
    ],
    rupeeArray: [
      "estimated_budget_consumed",
      "indirect_sales",
      "direct_sales",
      "total_sales",
      "direct_aov",
      "direct_AOV",
      "Indirect AOV",
      "indirect_aov",
      "total_aov",
      // "direct_roas",
      // "indirect_roas",
      // "total_roas",
      "cpm",
    ],
    numbers: [
      "impressions",
      "direct_atc",
      "indirect_atc",
      "total_atc",
      "direct_quantities_sold",
      "indirect_quantities_sold",
      "total_quantities_sold",
      "new_users_acquired",
      "unique_clicks",
      "direct_roas",
      "indirect_roas",
      "total_roas",
    ],
  },
  category: {
    fields: [],
  },
  ZEPTO_GRAPH_FILTERS: [
    "spend",
    "impressions",
    "spend_awareness",
    "impressions_awareness",
    "clicks_awareness",
    "spend_performance",
    "impressions_performance",
    "cpm",
    "roas",
    "revenues",
    "revenues_performance",
    "orders",
    "clicks",
    "ctr",
    "aov",
    "cpc",
  ],
  ZEPTO_GRAPH_FILTERS_CAMP: [
    "spend",
    "impressions",
    "spend_awareness",
    "impressions_awareness",
    "clicks_awareness",
    "spend_performance",
    "impressions_performance",
    "cpm",
    "roas",
    "revenues",
    "revenues_performance",
    "orders",
    "clicks",
    "ctr",
    "aov",
    "cpc",
    "add2cart",
    "campaign_budget",
  ],
  Zepto_FILTERS: [
    "spend",
    "impressions",
    "spend_awareness",
    "impressions_awareness",
    "clicks_awareness",
    "clicks",
    "spend_performance",
    "impressions_performance",
    "cpm",
    "roas",
    // "add2cart",
    "orders",
    // "view_products",
    "revenues",
    "revenues_performance",
  ],
  ZEPTO_DASHBOARD_SUMMARY_CommonScreen: {
    overview: {
      all: {
        spend: {
          name: "Spends",
          value: 0,
          graphName: "Spends",
        },
        impressions: {
          name: "Impressions",
          value: 0,
          graphName: "Impression",
        },
        revenues: {
          name: "Revenues",
          value: 0,
          graphName: "Revenues",
        },
        orders: {
          name: "Orders",
          value: 0,
          graphName: "Orders",
        },
        total_roas: {
          name: "Total ROAS",
          value: 0,
          graphName: "total_roas",
        },
        clicks: {
          name: "Clicks",
          value: 0,
          graphName: "clicks",
        },
        ctr: {
          name: "CTR",
          value: 0,
          graphName: "ctr",
        },
        cpc: {
          name: "CPC",
          value: 0,
          graphName: "cpc",
        },
        aov: {
          name: "AOV",
          value: 0,
          graphName: "aov",
        },
      },
      view: ["spend", "impressions"],
      graph: ["Spends", "Impression"],
    },
  },
  ZEPTO_DASHBOARD_SUMMARY_COMMON: {
    overview: {
      all: {
        spend: {
          name: "Spends",
          value: 0,
          graphName: "Spends",
        },
        impressions: {
          name: "Impressions",
          value: 0,
          graphName: "Impression",
        },
        sales: {
          name: "Sales",
          value: 0,
          graphName: "Sales",
        },
        orders: {
          name: "Orders",
          value: 0,
          graphName: "Orders",
        },
        roas: {
          name: "ROAS",
          value: 0,
          graphName: "ROAS",
        },
        clicks: {
          name: "Clicks",
          value: 0,
          graphName: "clicks",
        },
        ctr: {
          name: "CTR",
          value: 0,
          graphName: "ctr",
        },
        cpc: {
          name: "CPC",
          value: 0,
          graphName: "cpc",
        },
        aov: {
          name: "AOV",
          value: 0,
          graphName: "aov",
        },
      },
      view: ["spend", "impressions"],
      graph: ["Spends", "Impression"],
    },
  },
  ZEPTO_DASHBOARD_SUMMARY: {
    overview: {
      all: {
        spend: {
          name: "Spends",
          value: 0,
          graphName: "Spends",
          totalValue: 0,
          totalLastValue: 0,
        },
        impressions: {
          name: "Impressions",
          value: 0,
          graphName: "Impression",
          totalValue: 0,
          totalLastValue: 0,
        },
      },
      CM_graph: {
        spend: {
          name: "Spends",
          value: 0,
          graphName: "Spends",
          totalValue: 0,
          totalLastValue: 0,
        },
        impressions: {
          name: "Impressions",
          value: 0,
          graphName: "Impression",
          totalValue: 0,
          totalLastValue: 0,
        },
        clicks: {
          name: "Clicks",
          value: 0,
          graphName: "Clicks",
          totalValue: 0,
          totalLastValue: 0,
        },
        orders: {
          name: "Orders",
          value: 0,
          graphName: "Orders",
          totalValue: 0,
          totalLastValue: 0,
        },
        revenues: {
          name: "Sales",
          value: 0,
          graphName: "Sales",
          totalValue: 0,
          totalLastValue: 0,
        },
        add2cart: {
          name: "ATC",
          value: 0,
          graphName: "ATC",
          totalValue: 0,
          totalLastValue: 0,
        },
        cpc: {
          name: "CPC",
          value: 0,
          graphName: "CPC",
          totalValue: 0,
          totalLastValue: 0,
        },
        ctr: {
          name: "CTR",
          value: 0,
          graphName: "CTR",
          totalValue: 0,
          totalLastValue: 0,
        },
        campaign_budget: {
          name: "Budget",
          value: 0,
          graphName: "Budget",
          totalValue: 0,
          totalLastValue: 0,
        },
      },
      view: ["spend", "impressions"],
      graph: ["Spends", "Impression"],
    },
    awareness: {
      all: {
        spend_awareness: {
          name: "Spends",
          value: 0,
          graphName: "A. Spends",
          totalValue: 0,
          totalLastValue: 0,
        },
        impressions_awareness: {
          name: "Impressions",
          value: 0,
          graphName: "A. Impressions",
          totalValue: 0,
          totalLastValue: 0,
        },

        clicks_awareness: {
          name: "Clicks",
          value: 0,
          graphName: "A. Clicks",
          totalValue: 0,
          totalLastValue: 0,
        },
        // add2cart_awareness: {
        //   name: "Add to Cart",
        //   value: 0,
        //   graphName: "Awareness Add to cart",
        // },
      },
      view: [
        "spend_awareness",
        "impressions_awareness",
        "clicks_awareness",
        // "add2cart_awareness",
      ],
      graph: [],
    },
    performance: {
      all: {
        spend_performance: {
          name: "Spends",
          value: 0,
          graphName: "P. Spends",
          totalValue: 0,
          totalLastValue: 0,
        },
        impressions_performance: {
          name: "Impressions",
          value: 0,
          graphName: "P. Impressions",
          totalValue: 0,
          totalLastValue: 0,
        },
        roas: {
          name: "ROAS",
          value: 0,
          graphName: "ROAS",
        },
        cpm: {
          name: "CPM",
          value: 0,
          graphName: "CPM",
        },

        revenues_performance: {
          name: "Sales",
          value: 0,
          graphName: "Sales",
          totalValue: 0,
          totalLastValue: 0,
        },
        orders: {
          name: "Orders",
          value: 0,
          graphName: "Orders",
          totalValue: 0,
          totalLastValue: 0,
        },
      },
      view: [
        "spend_performance",
        "impressions_performance",
        "roas",
        "cpm",
        "revenues_performance",
        "orders",
      ],
      graph: [],
    },
  },

  ZEPTO_PERFORMANCE_BREAKDOWN: {
    // overview: {
    //   all: {
    //     spend: {
    //       name: "Spend",
    //       value: 0,
    //     },
    //     impressions: {
    //       name: "Impressions",
    //       value: 0,
    //     },
    //     clicks: {
    //       name: "Clicks",
    //       value: 0,
    //     },
    //     revenues: {
    //       name: "Sales",
    //       value: 0,
    //     },
    //     roi: {
    //       name: "ROAS",
    //       value: 0,
    //     },
    //     cpc: {
    //       name: "CPC",
    //       value: 0,
    //     },
    //   },
    // },
    keyword: {
      all: {
        spend: {
          name: "Spend",
          value: 0,
          totalValue: 0,
          totalLastValue: 0,
        },
        impressions: {
          name: "Impressions",
          value: 0,
          totalValue: 0,
          totalLastValue: 0,
        },
        clicks: {
          name: "Clicks",
          value: 0,
          totalValue: 0,
          totalLastValue: 0,
        },
        revenues: {
          name: "Sales",
          value: 0,
          totalValue: 0,
          totalLastValue: 0,
        },
        roi: {
          name: "ROAS",
          value: 0,
        },
        cpc: {
          name: "CPC",
          value: 0,
        },
      },
    },
    category: {
      all: {
        spend: {
          name: "Spend",
          value: 0,
          totalValue: 0,
          totalLastValue: 0,
        },
        impressions: {
          name: "Impressions",
          value: 0,
          totalValue: 0,
          totalLastValue: 0,
        },
        clicks: {
          name: "Clicks",
          value: 0,
          totalValue: 0,
          totalLastValue: 0,
        },
        revenues: {
          name: "Sales",
          value: 0,
          totalValue: 0,
          totalLastValue: 0,
        },
        roi: {
          name: "ROAS",
          value: 0,
        },
        cpc: {
          name: "CPC",
          value: 0,
        },
      },
    },
  },

  FLIPKART_REPORT: {
    FLIPKART_CAMPAIGN_REPORT: {
      SUM_FIELD: [
        {
          sumAlias: "views",
          field: "views", //
        },
        // { sumAlias: "campaign_budget", field: "campaign_budget" },
        { sumAlias: "clicks", field: "clicks" }, //
        { sumAlias: "orders", field: "orders" }, //
        { sumAlias: "ppv_direct_click", field: "ppv_direct_click" }, //
        { sumAlias: "ppv_indirect_click", field: "ppv_indirect_click" }, //
        { sumAlias: "total_ppv_data", field: "total_ppv" }, //
        { sumAlias: "units_sold_direct", field: "units_sold_direct" }, //
        { sumAlias: "units_sold_indirect", field: "units_sold_indirect" }, //
        { sumAlias: "direct_revenue", field: "direct_revenue" }, //
        { sumAlias: "indirect_revenue", field: "indirect_revenue" }, //
        { sumAlias: "total_revenue", field: "total_revenue" }, //
        { sumAlias: "total_units_sold", field: "orders" }, //
        { sumAlias: "spend", field: "spend" },
      ],
      FIRST_ALIAS: [
        "campaign_name", //
        "ad_group_id", //
        "ad_group_name", //
        "report_type", //
        "account", //
        "platform", //
        "created_on", //
        "campaign_budget",
        "segment", //
      ],
      CALCULATED_FIELDS: [
        {
          alias: "CTR",
          expression: "(subquery.clicks / subquery.views * 100)",
          denominator: "subquery.views",
        },
        {
          alias: "cpc",
          expression: "subquery.spend / subquery.clicks",
          denominator: "subquery.clicks",
        },

        {
          alias: "cvr_direct",
          expression: "(subquery.units_sold_direct / subquery.clicks*100)",
          denominator: "subquery.clicks",
        },
        {
          alias: "cvr_indirect",
          expression: "(subquery.units_sold_indirect / subquery.clicks*100)",
          denominator: "subquery.clicks",
        },
        {
          alias: "cvr_total",
          expression: "(subquery.orders / subquery.clicks*100)",
          denominator: "subquery.clicks",
        },
        {
          alias: "aov_direct",
          expression: "(subquery.direct_revenue / subquery.units_sold_direct)",
          denominator: "subquery.units_sold_direct",
        },
        {
          alias: "aov_indirect",
          expression:
            "(subquery.indirect_revenue / subquery.units_sold_indirect)",
          denominator: "subquery.units_sold_indirect",
        },
        {
          alias: "aov_total",
          expression: "(subquery.total_revenue / subquery.orders)",
          denominator: "subquery.orders",
        },
        {
          alias: "roi_direct",
          expression: "(subquery.direct_revenue / subquery.spend)",
          denominator: "subquery.spend",
        },
        {
          alias: "roi_indirect",
          expression: "(subquery.indirect_revenue / subquery.spend)",
          denominator: "subquery.spend",
        },

        {
          alias: "total_roi",
          expression: "(subquery.total_revenue / subquery.spend)",
          denominator: "subquery.spend",
        },
      ],
    },
    FLIPKART_FSN_REPORT: {
      SUM_FIELD: [
        {
          sumAlias: "views", //
          field: "views",
        },
        {
          sumAlias: "add_to_baskets", //
          field: "clicks",
        },
        // {
        //   sumAlias: "add_to_basket_rate", //
        //   field: "ctr",
        // },
        {
          sumAlias: "clicks", //
          field: "clicks",
        },
        { sumAlias: "total_units_sold", field: "total_units_sold" },
        {
          sumAlias: "units_sold_direct",
          field: "units_sold_direct",
        },
        {
          sumAlias: "units_sold_indirect",
          field: "units_sold_indirect",
        },
        {
          sumAlias: "direct_revenue",
          field: "direct_revenue",
        },
        {
          sumAlias: "indirect_revenue",
          field: "indirect_revenue",
        },

        {
          sumAlias: "spend",
          field: "spend",
        },
        {
          sumAlias: "total_revenue",
          field: "total_revenue",
        },
      ],
      FIRST_ALIAS: [
        "campaign_id",
        "fsn_id",
        "product_name",
        "campaign_name",
        "ad_group_id",
        "adgroup_name",
        "report_type",
        "account",
        "platform",
        "created_on",
        // "id",
        "segment",
      ],
      CALCULATED_FIELDS: [
        {
          alias: "ctr",
          expression: "(subquery.clicks / subquery.views * 100)",
          denominator: "subquery.views",
        },
        {
          alias: "cpc",
          expression: "subquery.spend / subquery.clicks",
          denominator: "subquery.clicks",
        },

        {
          alias: "cvr_direct",
          expression: "(subquery.units_sold_direct / subquery.clicks*100)",
          denominator: "subquery.clicks",
        },
        {
          alias: "cvr_indirect",
          expression: "(subquery.units_sold_indirect / subquery.clicks*100)",
          denominator: "subquery.clicks",
        },
        {
          alias: "cvr_total",
          expression: "(subquery.total_units_sold / subquery.clicks*100)",
          denominator: "subquery.clicks",
        },
        {
          alias: "aov_direct",
          expression: "(subquery.direct_revenue / subquery.units_sold_direct)",
          denominator: "subquery.units_sold_direct",
        },
        {
          alias: "aov_indirect",
          expression:
            "(subquery.indirect_revenue / subquery.units_sold_indirect)",
          denominator: "subquery.units_sold_indirect",
        },
        {
          alias: "aov_total",
          expression: "(subquery.total_revenue / subquery.total_units_sold)",
          denominator: "subquery.total_units_sold",
        },
        {
          alias: "roi_direct",
          expression: "(subquery.direct_revenue / subquery.spend)",
          denominator: "subquery.spend",
        },
        {
          alias: "roi_indirect",
          expression: "(subquery.indirect_revenue / subquery.spend)",
          denominator: "subquery.spend",
        },

        {
          alias: "total_roi",
          expression: "(subquery.total_revenue / subquery.spend)",
          denominator: "subquery.spend",
        },
      ],
    },
    FLIPKART_KEYWORD_REPORT: {
      SUM_FIELD: [
        {
          sumAlias: "views", //
          field: "views",
        },
        {
          sumAlias: "clicks", //
          field: "clicks",
        },
        // {
        //   sumAlias: "ctr", //
        //   field: "ctr",
        // },
        { sumAlias: "total_units_sold", field: "total_units_sold" },
        {
          sumAlias: "direct_units_sold", //
          field: "direct_units_sold",
        },
        {
          sumAlias: "indirect_units_sold", //
          field: "indirect_units_sold",
        },
        {
          sumAlias: "direct_revenue", //
          field: "direct_revenue",
        },
        {
          sumAlias: "indirect_revenue", //
          field: "indirect_revenue",
        },

        {
          sumAlias: "spend", //
          field: "spend",
        },
        {
          sumAlias: "total_revenue",
          field: "total_revenue",
        },
      ],
      FIRST_ALIAS: [
        "campaign_id",
        "ad_group_id",
        "ad_group_name",
        "campaign_name",
        "keyword",
        "keyword_match_type",
        "report_type",
        "account",
        "platform",
        "created_on",
        "segment",
      ],
      CALCULATED_FIELDS: [
        {
          alias: "CTR",
          expression: "(subquery.clicks / subquery.views * 100)",
          denominator: "subquery.views",
        },
        {
          alias: "cpc",
          expression: "subquery.spend / subquery.clicks",
          denominator: "subquery.clicks",
        },

        {
          alias: "cvr_direct",
          expression: "(subquery.direct_units_sold / subquery.clicks*100)",
          denominator: "subquery.clicks",
        },
        {
          alias: "cvr_indirect",
          expression: "(subquery.indirect_units_sold / subquery.clicks*100)",
          denominator: "subquery.clicks",
        },
        {
          alias: "cvr_total",
          expression: "(subquery.total_units_sold / subquery.clicks*100)",
          denominator: "subquery.clicks",
        },
        {
          alias: "aov_direct",
          expression: "(subquery.direct_revenue / subquery.direct_units_sold)",
          denominator: "subquery.direct_units_sold",
        },
        {
          alias: "aov_indirect",
          expression:
            "(subquery.indirect_revenue / subquery.indirect_units_sold)",
          denominator: "subquery.indirect_units_sold",
        },
        {
          alias: "aov_total",
          expression: "(subquery.total_revenue / subquery.total_units_sold)",
          denominator: "subquery.total_units_sold",
        },
        {
          alias: "roi_direct",
          expression: "(subquery.direct_revenue / subquery.spend)",
          denominator: "subquery.spend",
        },
        {
          alias: "roi_indirect",
          expression: "(subquery.indirect_revenue / subquery.spend)",
          denominator: "subquery.spend",
        },

        {
          alias: "total_roi",
          expression: "(subquery.total_revenue / subquery.spend)",
          denominator: "subquery.spend",
        },
      ],
    },
    FLIPKART_SEARCH_REPORT: {
      SUM_FIELD: [
        {
          sumAlias: "views",
          field: "views",
        },
        {
          sumAlias: "clicks",
          field: "clicks",
        },
        { sumAlias: "total_units_sold", field: "total_units_sold" },
        {
          sumAlias: "direct_units_sold",
          field: "direct_units_sold",
        },
        {
          sumAlias: "indirect_units_sold",
          field: "indirect_units_sold",
        },
        {
          sumAlias: "direct_revenue",
          field: "direct_revenue",
        },
        {
          sumAlias: "indirect_revenue",
          field: "indirect_revenue",
        },

        {
          sumAlias: "spend",
          field: "spend",
        },
        {
          sumAlias: "total_revenue",
          field: "total_revenue",
        },
      ],
      FIRST_ALIAS: [
        "campaign_id",
        "ad_group_id",
        "ad_group_name",
        "campaign_name",
        "search_term",
        "report_type",
        "account",
        "platform",
        "created_on",
        "segment",
        "id",
        "account_id",
        "platform_id",
        "platform",
        "account",
      ],
      CALCULATED_FIELDS: [
        {
          alias: "ctr",
          expression: "(subquery.clicks / subquery.views * 100)",
          denominator: "subquery.views",
        },
        {
          alias: "cpc",
          expression: "subquery.spend / subquery.clicks",
          denominator: "subquery.clicks",
        },

        {
          alias: "cvr_direct",
          expression: "(subquery.direct_units_sold / subquery.clicks*100)",
          denominator: "subquery.clicks",
        },
        {
          alias: "cvr_indirect",
          expression: "(subquery.indirect_units_sold / subquery.clicks*100)",
          denominator: "subquery.clicks",
        },
        {
          alias: "cvr_total",
          expression: "(subquery.total_units_sold / subquery.clicks*100)",
          denominator: "subquery.clicks",
        },
        {
          alias: "aov_direct",
          expression: "(subquery.direct_revenue / subquery.direct_units_sold)",
          denominator: "subquery.direct_units_sold",
        },
        {
          alias: "aov_indirect",
          expression:
            "(subquery.indirect_revenue / subquery.indirect_units_sold)",
          denominator: "subquery.indirect_units_sold",
        },
        {
          alias: "aov_total",
          expression: "(subquery.total_revenue / subquery.total_units_sold)",
          denominator: "subquery.total_units_sold",
        },
        {
          alias: "roi_direct",
          expression: "(subquery.direct_revenue / subquery.spend)",
          denominator: "subquery.spend",
        },
        {
          alias: "roi_indirect",
          expression: "(subquery.indirect_revenue / subquery.spend)",
          denominator: "subquery.spend",
        },

        {
          alias: "roi_total",
          expression: "(subquery.total_revenue / subquery.spend)",
          denominator: "subquery.spend",
        },
      ],
    },
    FLIPKART_PLACEMENT_REPORT: {
      SUM_FIELD: [
        {
          sumAlias: "views", //
          field: "views",
        },
        {
          sumAlias: "clicks", //
          field: "clicks",
        },

        { sumAlias: "total_units_sold", field: "total_units_sold" },
        {
          sumAlias: "units_sold_direct", //
          field: "units_sold_direct",
        },
        {
          sumAlias: "units_sold_indirect", //
          field: "units_sold_indirect",
        },
        {
          sumAlias: "revenue_direct_view", //
          field: "revenue_direct_view",
        },
        {
          sumAlias: "revenue_indirect_view", //
          field: "revenue_indirect_view",
        },
        {
          sumAlias: "direct_revenue",
          field: "direct_revenue",
        },
        {
          sumAlias: "indirect_revenue",
          field: "indirect_revenue",
        },

        {
          sumAlias: "spend",
          field: "spend",
        },
        {
          sumAlias: "total_revenue",
          field: "total_revenue",
        },
      ],
      FIRST_ALIAS: [
        // "campaign_id",
        // "ad_group_id",
        // "ad_group_name",
        "campaign_name",
        "placement_type", //
        "placement_bid",
        // "report_type",
        "account",
        "platform", //
        "created_on",
        "segment", //
      ],
      CALCULATED_FIELDS: [
        {
          alias: "ctr",
          expression: "(subquery.clicks / subquery.views * 100)",
          denominator: "subquery.views",
        },
        {
          alias: "cpc",
          expression: "subquery.spend / subquery.clicks",
          denominator: "subquery.clicks",
        },

        {
          alias: "direct_cvr",
          expression: "(subquery.units_sold_direct / subquery.clicks*100)",
          denominator: "subquery.clicks",
        },
        {
          alias: "cvr_indirect",
          expression: "(subquery.units_sold_indirect / subquery.clicks*100)",
          denominator: "subquery.clicks",
        },
        {
          alias: "cvr_total",
          expression: "(subquery.total_units_sold / subquery.clicks*100)",
          denominator: "subquery.clicks",
        },
        {
          alias: "direct_aov",
          expression: "(subquery.direct_revenue / subquery.units_sold_direct)",
          denominator: "subquery.units_sold_direct",
        },
        {
          alias: "indirect_aov",
          expression:
            "(subquery.indirect_revenue / subquery.units_sold_indirect)",
          denominator: "subquery.units_sold_indirect",
        },
        {
          alias: "aov_total",
          expression: "(subquery.total_revenue / subquery.total_units_sold)",
          denominator: "subquery.total_units_sold",
        },
        {
          alias: "direct_roi",
          expression: "(subquery.direct_revenue / subquery.spend)",
          denominator: "subquery.spend",
        },
        {
          alias: "roi_indirect",
          expression: "(subquery.indirect_revenue / subquery.spend)",
          denominator: "subquery.spend",
        },

        {
          alias: "roi_total",
          expression: "(subquery.total_revenue / subquery.spend)",
          denominator: "subquery.spend",
        },
      ],
    },
    FLIPKART_CREATIVE_REPORT: {
      SUM_FIELD: [
        {
          sumAlias: "views", //
          field: "views",
        },
        {
          sumAlias: "clicks", //
          field: "clicks",
        },
        // {
        //   sumAlias: "ctr", //
        //   field: "ctr",
        // },
        { sumAlias: "total_units_sold", field: "total_units_click" }, //
        {
          sumAlias: "units_sold_direct", //
          field: "units_direct_click",
        },
        { sumAlias: "ppv_direct_click", field: "ppv_direct_click" }, //
        { sumAlias: "ppv_indirect_click", field: "ppv_indirect_click" }, //
        {
          sumAlias: "units_sold_indirect", //
          field: "units_indirect_click",
        },
        {
          sumAlias: "direct_revenue",
          field: "revenue_direct_click", //
        },
        {
          sumAlias: "indirect_revenue",
          field: "revenue_indirect_click", //
        },

        {
          sumAlias: "spend", //
          field: "spend",
        },
        {
          sumAlias: "banner_spend", //
          field: "spend",
        },
        {
          sumAlias: "total_revenue",
          field: "total_revenue_click",
        },
      ],
      FIRST_ALIAS: [
        "campaign_id",
        "ad_group_id",
        "ad_group_name", //
        "campaign_name", //
        // "campaign_type",//
        "banner_id", //
        "banner_preview", //
        "banner_name", //
        // "type_banner",
        "report_type",
        "account",
        "platform", //
        "created_on",
        "segment",
      ],
      CALCULATED_FIELDS: [
        {
          alias: "ctr",
          expression: "(subquery.clicks / subquery.views * 100)",
          denominator: "subquery.views",
        },
        {
          alias: "cpc",
          expression: "subquery.spend / subquery.clicks",
          denominator: "subquery.clicks",
        },

        {
          alias: "cvr_direct",
          expression: "(subquery.units_sold_direct / subquery.clicks*100)",
          denominator: "subquery.clicks",
        },
        {
          alias: "cvr_indirect",
          expression: "(subquery.units_sold_indirect / subquery.clicks*100)",
          denominator: "subquery.clicks",
        },
        {
          alias: "cvr_total",
          expression: "(subquery.total_units_sold / subquery.clicks*100)",
          denominator: "subquery.clicks",
        },
        {
          alias: "aov_direct",
          expression: "(subquery.direct_revenue / subquery.units_sold_direct)",
          denominator: "subquery.units_sold_direct",
        },
        {
          alias: "aov_indirect",
          expression:
            "(subquery.indirect_revenue / subquery.units_sold_indirect)",
          denominator: "subquery.units_sold_indirect",
        },
        {
          alias: "aov_total",
          expression: "(subquery.total_revenue / subquery.total_units_sold)",
          denominator: "subquery.total_units_sold",
        },
        {
          alias: "roi_direct",
          expression: "(subquery.direct_revenue / subquery.spend)",
          denominator: "subquery.spend",
        },
        {
          alias: "roi_indirect",
          expression: "(subquery.indirect_revenue / subquery.spend)",
          denominator: "subquery.spend",
        },

        {
          alias: "roi_total",
          expression: "(subquery.total_revenue / subquery.spend)",
          denominator: "subquery.spend",
        },
        {
          alias: "total_ppv",
          expression:
            "(subquery.ppv_indirect_click + subquery.ppv_direct_click)",
          denominator: "subquery.spend",
        },
      ],
    },
    FLIPKART_REVENUE_REPORT: {
      SUM_FIELD: [
        {
          sumAlias: "views",
          field: "views",
        }, //
        { sumAlias: "clicks", field: "clicks" }, //
        { sumAlias: "orders", field: "orders" }, //
        { sumAlias: "ppv_direct_click", field: "ppv_direct_click" },
        { sumAlias: "ppv_indirect_click", field: "ppv_indirect_click" },
        { sumAlias: "total_ppv_data", field: "total_ppv" },
        { sumAlias: "units_sold_direct", field: "units_sold_direct" },
        { sumAlias: "units_sold_indirect", field: "units_sold_indirect" },
        { sumAlias: "direct_revenue", field: "direct_revenue" }, //
        { sumAlias: "indirect_revenue", field: "indirect_revenue" },
        { sumAlias: "total_revenue", field: "total_revenue" },
        { sumAlias: "total_units_sold", field: "orders" },
        { sumAlias: "spend", field: "spend" },
      ],
      FIRST_ALIAS: [
        "campaign_budget",
        "campaign_name",
        "ad_group_id",
        "ad_group_name",
        "report_type",
        "account",
        "platform",
        "created_on",
        // "id",
        "segment",
      ],
      CALCULATED_FIELDS: [
        {
          alias: "CTR",
          expression: "(subquery.clicks / subquery.views * 100)",
          denominator: "subquery.views",
        },
        {
          alias: "cpc",
          expression: "subquery.spend / subquery.clicks",
          denominator: "subquery.clicks",
        },

        {
          alias: "cvr_direct",
          expression: "(subquery.units_sold_direct / subquery.clicks*100)",
          denominator: "subquery.clicks",
        },
        {
          alias: "cvr_indirect",
          expression: "(subquery.units_sold_indirect / subquery.clicks*100)",
          denominator: "subquery.clicks",
        },
        {
          alias: "cvr_total",
          expression: "(subquery.orders / subquery.clicks*100)",
          denominator: "subquery.clicks",
        },
        {
          alias: "direct_aov",
          expression: "(subquery.direct_revenue / subquery.units_sold_direct)",
          denominator: "subquery.units_sold_direct",
        },
        {
          alias: "indirect_aov",
          expression:
            "(subquery.indirect_revenue / subquery.units_sold_indirect)",
          denominator: "subquery.units_sold_indirect",
        },
        {
          alias: "aov_total",
          expression: "(subquery.total_revenue / subquery.orders)",
          denominator: "subquery.orders",
        },
        {
          alias: "direct_roi",
          expression: "(subquery.direct_revenue / subquery.spend)",
          denominator: "subquery.spend",
        },
        {
          alias: "indirect_roi",
          expression: "(subquery.indirect_revenue / subquery.spend)",
          denominator: "subquery.spend",
        },

        {
          alias: "total_roi",
          expression: "(subquery.total_revenue / subquery.spend)",
          denominator: "subquery.spend",
        },
      ],
    },
  },

  INSTAMART_DASHBOARD_SUMMARY: {
    overview: {
      all: {
        spend: {
          name: "Spends",
          value: 0,
          graphName: "Spends",
          totalValue: 0,
          totalLastValue: 0,
        },
        impressions: {
          name: "Impressions",
          value: 0,
          graphName: "Impressions",
          totalValue: 0,
          totalLastValue: 0,
        },
        add2cart: {
          name: "Cart Addition",
          value: 0,
          graphName: "Cart Addition",
          totalValue: 0,
          totalLastValue: 0,
        },
        gmv: {
          name: "Sales",
          value: 0,
          graphName: "Sales",
          totalValue: 0,
          totalLastValue: 0,
        },
        roi: {
          name: "ROI",
          value: 0,
          graphName: "ROI",
        },
      },
      view: ["spend", "impressions", "add2cart", "gmv", "roi"],
      graph: ["Spends", "Impression", "Add2cart", "Gmv", "Roi"],
    },
  },
  INSTAMART_FILTERS: ["spend", "impressions", "add2cart", "gmv", "roi"],
};

function deepFreeze(object) {
  // Retrieve the property names defined on object
  const propNames = Reflect.ownKeys(object);

  // Freeze properties before freezing self
  for (const name of propNames) {
    const value = object[name];

    if ((value && typeof value === "object") || typeof value === "function") {
      deepFreeze(value);
    }
  }

  return Object.freeze(object);
}

module.exports = constants;

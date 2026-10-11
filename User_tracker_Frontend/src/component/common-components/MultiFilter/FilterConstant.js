import {
  amazonCampaignTypeReport,
  amazonNameIdFilterReport,
  blinkitCampaignTypeReport,
  blinkitNameIdFilterReport,
  flipkartBudgetTypeReport,
  flipkartCampaignStatusReport,
  flipkartCampaignTypeReport,
  flipkartNameIdFilterReport,
  flipkartPlatformTypeReport,
  instamartNameIdReportFilter,
  zeptoCampaignTypeReport,
  zeptoNameIdFilterReport,
} from "../CustomMultiSearch/searchData";
import {
  amazonCampaignType,
  amazonNameIdFilter,
  blinkitCampaignType,
  blinkitNameIdFilter,
  budgetSection,
  flipkartCampaignType,
  flipkartNameIdFilterObj,
  flipkartPlatformSection,
  instamartNameIdFilter,
  zeptoCampaignType,
  zeptoNameIdFilter,
  tagsFilter,
} from "../MultiSearch/searchData";

export const chipLabelNameFixObj = {
  estimated_budget_consumed: "Spends",
  views: "Impressions",
  units_sold: "Orders",
  conversion: "Orders",
  conversions: "Orders",
  roi: "roas",
  add2cart: "Orders",
  discount: "Promotion",
  price: "MRP",
  "flipkart_supermart_campaign.campaign_budget": "Budget",
};

export const mathSign = {
  is_greater_than: ">",
  is_less_than: "<",
  is_between: "between",
  isnt_between: "isn't between",
  contains: "contains",
};

export const FILTERACTION = Object.freeze({
  METRIC: "metric",
  SEARCH: "search",
  APPLY: "apply",
  TAG: "tag",
});

const campaignCountObj = {
  label: "Campaign count",
  key: "count",
  action: FILTERACTION.METRIC,
};

const impressionObj = {
  label: "Impressions",
  key: "impressions",
  action: FILTERACTION.METRIC,
};

const viewsObj = {
  label: "Views",
  key: "views",
  action: FILTERACTION.METRIC,
};

const viewImpressionObj = {
  label: "Impressions",
  key: "views",
  action: FILTERACTION.METRIC,
};

const clickObj = {
  label: "Click",
  key: "clicks",
  action: FILTERACTION.METRIC,
};

const ctrObj = {
  label: "CTR",
  key: "ctr",
  action: FILTERACTION.METRIC,
};

const spendObj = {
  label: "Spend",
  key: "spend",
  action: FILTERACTION.METRIC,
};

const cpcObj = {
  label: "CPC",
  key: "cpc",
  action: FILTERACTION.METRIC,
};

const unitOrderSoldObj = {
  label: "Orders",
  key: "units_sold",
  action: FILTERACTION.METRIC,
};

const ordersObj = {
  label: "Orders",
  key: "orders",
  action: FILTERACTION.METRIC,
};

const ordersConversionObj = {
  label: "Orders",
  key: "conversion",
  action: FILTERACTION.METRIC,
};

const conversionsObj = {
  label: "Conversions",
  key: "conversions",
  action: FILTERACTION.METRIC,
};

const ordersConversionsObj = {
  label: "Orders",
  key: "conversions",
  action: FILTERACTION.METRIC,
};

const salesObj = {
  label: "Sales",
  key: "sales",
  action: FILTERACTION.METRIC,
};

const revenueObj = {
  label: "Revenue",
  key: "revenue",
  action: FILTERACTION.METRIC,
};

const salesRevenueObj = {
  label: "Sales",
  key: "revenue",
  action: FILTERACTION.METRIC,
};

const salesRevenuesObj = {
  label: "Sales",
  key: "revenues",
  action: FILTERACTION.METRIC,
};

const acosObj = {
  label: "ACOS",
  key: "acos",
  action: FILTERACTION.METRIC,
};

const roasObj = {
  label: "ROAS",
  key: "roas",
  action: FILTERACTION.METRIC,
};

const viewableImpressionsObj = {
  label: "Viewable Impressions",
  key: "viewable_impressions",
  action: FILTERACTION.METRIC,
};

const cpmObj = {
  label: "CPM",
  key: "cpm",
  action: FILTERACTION.METRIC,
};

const cvrObj = {
  label: "CVR",
  key: "cvr",
  action: FILTERACTION.METRIC,
};

const atcPercentObj = {
  label: "ATC%",
  key: "atc_percent",
  action: FILTERACTION.METRIC,
};

const newUserCvrObj = {
  label: "New users",
  key: "cvr",
  action: FILTERACTION.METRIC,
};

const totalAtcObj = {
  label: "ATC",
  key: "total_atc",
  action: FILTERACTION.METRIC,
};

const directAtcObj = {
  label: "Direct ATC",
  key: "direct_atc",
  action: FILTERACTION.METRIC,
};

const indirectAtcObj = {
  label: "Indirect ATC",
  key: "indirect_atc",
  action: FILTERACTION.METRIC,
};

const totalQuantitiesSoldObj = {
  label: "Total Orders",
  key: "total_quantities_sold",
  action: FILTERACTION.METRIC,
};

const directQuantitiesSoldObj = {
  label: "Direct Orders",
  key: "direct_quantities_sold",
  action: FILTERACTION.METRIC,
};

const indirectQuantitiesSoldObj = {
  label: "Indirect Orders",
  key: "indirect_quantities_sold",
  action: FILTERACTION.METRIC,
};

const totalSalesObj = {
  label: "Total Sales",
  key: "total_sales",
  action: FILTERACTION.METRIC,
};

const directSalesObj = {
  label: "Direct Sales",
  key: "direct_sales",
  action: FILTERACTION.METRIC,
};

const indirectSalesObj = {
  label: "Indirect Sales",
  key: "indirect_sales",
  action: FILTERACTION.METRIC,
};

const roiObj = {
  label: "ROI",
  key: "roi",
  action: FILTERACTION.METRIC,
};

const roasRoiObj = {
  label: "ROAS",
  key: "roi",
  action: FILTERACTION.METRIC,
};

const aovObj = {
  label: "AOV",
  key: "aov",
  action: FILTERACTION.METRIC,
};

const vtrObj = {
  label: "VTR",
  key: "vtr",
  action: FILTERACTION.METRIC,
};

const vctrObj = {
  label: "VCTR",
  key: "vctr",
  action: FILTERACTION.METRIC,
};

const unitSoldObj = {
  label: "Units Sold",
  key: "units_sold",
  action: FILTERACTION.METRIC,
};

const addToCartObj = {
  label: "ATC",
  key: "add2cart",
  action: FILTERACTION.METRIC,
};

const ordersAddToCart = {
  label: "Orders",
  key: "add2cart",
  action: FILTERACTION.METRIC,
};

const salesGmvObj = {
  label: "Sales",
  key: "gmv",
  action: FILTERACTION.METRIC,
};

const budgetObj = {
  label: "Budget",
  key: "budget",
  action: FILTERACTION.METRIC,
};

const viewProductsObj = {
  label: "View Products",
  key: "view_products",
  action: FILTERACTION.METRIC,
};

const sovObj = {
  label: "SOV",
  key: "sov",
  action: FILTERACTION.METRIC,
};

const promotionDiscountObj = {
  label: "Promotion",
  key: "discount",
  action: FILTERACTION.METRIC,
};

const mrpPriceObj = {
  label: "MRP",
  key: "price",
  action: FILTERACTION.METRIC,
};

const reviewObj = {
  label: "Review",
  key: "review",
  action: FILTERACTION.METRIC,
};

const ratingObj = {
  label: "Rating",
  key: "rating",
  action: FILTERACTION.METRIC,
};

const spendsBudgetObj = {
  label: "Spends",
  key: "estimated_budget_consumed",
  action: FILTERACTION.METRIC,
};

const sameSkuOrdersObj = {
  label: "Same SKU Orders",
  key: "same_sku_orders",
  action: FILTERACTION.METRIC,
};

const otherSkuOrdersObj = {
  label: "Other SKU Orders",
  key: "other_sku_orders",
  action: FILTERACTION.METRIC,
};

const flipkartBudgetObj = {
  label: "Budget",
  key: "flipkart_supermart_campaign.campaign_budget",
  action: FILTERACTION.METRIC,
};

const newUsersObj = {
  label: "New users",
  key: "new_users_acquired",
  action: FILTERACTION.METRIC,
};

const ntbOrdersObj = {
  label: "NTB orders",
  key: "ntb_orders",
  action: FILTERACTION.METRIC,
};

const ntbOrdersPercentObj = {
  label: "% of orders NTB ",
  key: "ntb_orders_perc",
  action: FILTERACTION.METRIC,
};

const ntbSalesObj = {
  label: "NTB sales",
  key: "ntb_sales",
  action: FILTERACTION.METRIC,
};

const ntbSalesPercentObj = {
  label: "% of sales NTB ",
  key: "ntb_sales_perc",
  action: FILTERACTION.METRIC,
};

const keywordBidObj = {
  label: "Keyword bid",
  key: "keyword_bid",
  action: FILTERACTION.METRIC,
};

export const amazonFilterArr = [
  amazonNameIdFilter,
  tagsFilter,
  amazonCampaignType,
  {
    key: "campaign_status",
    label: "Campaign Status",
    selectable: false,
    children: [
      {
        label: "Active",
        key: "campaign_status-ENABLED",
        data: "Campaign Status - Active",
        action: FILTERACTION.APPLY,
      },
      {
        label: "Archived",
        key: "campaign_status-ARCHIVED",
        data: "Campaign Status - Archived",
        action: FILTERACTION.APPLY,
      },
      {
        label: "Paused",
        key: "campaign_status-PAUSED",
        data: "Campaign Status - Paused",
        action: FILTERACTION.APPLY,
      },
    ],
  },
  {
    label: "Portfolio Metric",
    key: "portfolio_m",
    join: true, // It is mandatory to map join parent's label and key to children
    children: [
      campaignCountObj,
      impressionObj,
      clickObj,
      ctrObj,
      spendObj,
      cpcObj,
      ordersObj,
      salesObj,
      acosObj,
      roasObj,
      viewableImpressionsObj,
    ],
  },
  {
    label: "Campaign Metric",
    key: "campaign_m",
    join: true, // It is mandatory to map join parent's label and key to children
    children: [
      impressionObj,
      clickObj,
      ctrObj,
      spendObj,
      cpcObj,
      unitOrderSoldObj,
      salesObj,
      acosObj,
      roasObj,
      viewableImpressionsObj,
      vtrObj,
      vctrObj,
    ],
  },
  {
    label: "Ad Group Metric",
    key: "ad_group_m",
    join: true, // It is mandatory to map join parent's label and key to children
    children: [
      impressionObj,
      clickObj,
      ctrObj,
      spendObj,
      cpcObj,
      unitOrderSoldObj,
      salesObj,
      acosObj,
      roasObj,
    ],
  },
  {
    label: "Keyword Metric",
    key: "keyword_m",
    join: true, // It is mandatory to map join parent's label and key to children
    children: [
      viewImpressionObj,
      clickObj,
      ctrObj,
      spendObj,
      cpcObj,
      ordersConversionsObj,
      salesRevenueObj,
      acosObj,
      roasObj,
      sovObj,
    ],
  },
  {
    label: "ASIN  Metric",
    key: "asin_m",
    join: true, // It is mandatory to map join parent's label and key to children
    children: [
      clickObj,
      ctrObj,
      spendObj,
      cpcObj,
      ordersObj,
      salesObj,
      acosObj,
      roasObj,
      mrpPriceObj,
      reviewObj,
      ratingObj,
    ],
  },
  {
    label: "Creative Metric",
    key: "creative_m",
    join: true, // It is mandatory to map join parent's label and key to children
    children: [
      impressionObj,
      clickObj,
      ctrObj,
      spendObj,
      cpcObj,
      salesObj,
      acosObj,
      roasObj,
      unitSoldObj,
    ],
  },
  {
    label: "Placement Metric",
    key: "placement_m",
    join: true, // It is mandatory to map join parent's label and key to children
    children: [
      impressionObj,
      clickObj,
      ctrObj,
      spendObj,
      cpcObj,
      ordersConversionObj,
      salesObj,
      acosObj,
      roasObj,
    ],
  },
];

export const flipkartFilterArr = [
  flipkartNameIdFilterObj,
  tagsFilter,
  flipkartCampaignType,
  flipkartPlatformSection,
  {
    key: "campaign_status",
    label: "Campaign Status",
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
  },
  budgetSection,
  {
    label: "Campaign Metric",
    key: "campaign_m",
    join: true, // It is mandatory to map join parent's label and key to children
    children: [
      flipkartBudgetObj,
      spendObj,
      viewsObj,
      clickObj,
      ctrObj,
      cpcObj,
      unitSoldObj,
      revenueObj,
      cvrObj,
      roasRoiObj,
      aovObj,
    ],
  },
  {
    label: "Ad Group Metric",
    key: "ad_group_m",
    join: true, // It is mandatory to map join parent's label and key to children
    children: [
      spendObj,
      viewsObj,
      clickObj,
      ctrObj,
      cpcObj,
      unitSoldObj,
      revenueObj,
      cvrObj,
      roasRoiObj,
      aovObj,
    ],
  },
  {
    label: "Keyword Metric",
    key: "keyword_m",
    join: true, // It is mandatory to map join parent's label and key to children
    children: [
      spendObj,
      viewsObj,
      clickObj,
      ctrObj,
      cpcObj,
      unitSoldObj,
      revenueObj,
      cvrObj,
      roasRoiObj,
      aovObj,
    ],
  },
  {
    label: "FSN Metric",
    key: "fsn_m",
    join: true, // It is mandatory to map join parent's label and key to children
    children: [
      spendObj,
      viewsObj,
      clickObj,
      ctrObj,
      cpcObj,
      unitSoldObj,
      revenueObj,
      cvrObj,
      roasRoiObj,
      aovObj,
    ],
  },
  {
    label: "Creative Metric",
    key: "creative_m",
    join: true, // It is mandatory to map join parent's label and key to children
    children: [
      spendObj,
      viewsObj,
      clickObj,
      ctrObj,
      cpcObj,
      unitSoldObj,
      revenueObj,
      cvrObj,
      roasRoiObj,
      aovObj,
    ],
  },
  {
    label: "Placement Metric",
    key: "placement_m",
    join: true, // It is mandatory to map join parent's label and key to children
    children: [
      spendObj,
      viewsObj,
      clickObj,
      ctrObj,
      cpcObj,
      unitSoldObj,
      revenueObj,
      cvrObj,
      roasRoiObj,
      aovObj,
    ],
  },
];

export const zeptoFilterArr = [
  zeptoNameIdFilter,
  tagsFilter,
  zeptoCampaignType,
  {
    key: "campaign_status",
    label: "Campaign Status",
    selectable: false,
    children: [
      {
        label: "Active",
        key: "campaign_status-ACTIVE",
        data: "Campaign Status - Active",
        action: FILTERACTION.APPLY,
      },
      {
        label: "Paused",
        key: "campaign_status-PAUSED",
        data: "Campaign Status - Paused",
        action: FILTERACTION.APPLY,
      },
      {
        label: "Draft",
        key: "campaign_status-DRAFT",
        data: "Campaign Status - Draft",
        action: FILTERACTION.APPLY,
      },
    ],
  },
  {
    label: "Campaign Metric",
    key: "campaign_m",
    join: true, // It is mandatory to map join parent's label and key to children
    children: [
      impressionObj,
      clickObj,
      spendObj,
      cpcObj,
      ordersObj,
      roasObj,
      ctrObj,
      addToCartObj,
      salesRevenueObj,
      cpmObj,
      viewProductsObj,
    ],
  },
  {
    label: "Keyword Metric",
    key: "keyword_m",
    join: true, // It is mandatory to map join parent's label and key to children
    children: [
      impressionObj,
      clickObj,
      spendObj,
      cpcObj,
      roasObj,
      ctrObj,
      salesRevenueObj,
      cpmObj,
      sovObj,
    ],
  },
  {
    label: "Category Metric",
    key: "category_m",
    join: true, // It is mandatory to map join parent's label and key to children
    children: [
      impressionObj,
      clickObj,
      spendObj,
      cpcObj,
      ordersObj,
      roasObj,
      ctrObj,
      salesRevenueObj,
      cpmObj,
      sameSkuOrdersObj,
      otherSkuOrdersObj,
    ],
  },
  {
    label: "Product Metric",
    key: "product_m",
    join: true, // It is mandatory to map join parent's label and key to children
    children: [
      impressionObj,
      clickObj,
      spendObj,
      cpcObj,
      ordersObj,
      roasObj,
      ctrObj,
      salesRevenueObj,
      cpmObj,
      sameSkuOrdersObj,
      otherSkuOrdersObj,
      viewsObj,
      promotionDiscountObj,
      mrpPriceObj,
    ],
  },
];

export const blinkitFilterArr = [
  blinkitNameIdFilter,
  tagsFilter,
  blinkitCampaignType,
  {
    key: "campaign_status",
    label: "Campaign Status",
    selectable: false,
    children: [
      {
        label: "Active",
        key: "campaign_status-ACTIVE",
        data: "Campaign Status - Active",
        action: FILTERACTION.APPLY,
      },
      {
        label: "Stopped",
        key: "campaign_status-STOPPED",
        data: "Campaign Status - Stopped",
        action: FILTERACTION.APPLY,
      },
      {
        label: "Completed",
        key: "campaign_status-COMPLETED",
        data: "Campaign Status - Completed",
        action: FILTERACTION.APPLY,
      },
    ],
  },
  {
    label: "Campaign Metric",
    key: "campaign_m",
    join: true, // It is mandatory to map join parent's label and key to children
    children: [
      spendsBudgetObj,
      impressionObj,
      clickObj,
      ctrObj,
      cpmObj,
      totalAtcObj,
      directAtcObj,
      indirectAtcObj,
      totalQuantitiesSoldObj,
      directQuantitiesSoldObj,
      indirectQuantitiesSoldObj,
      totalSalesObj,
      directSalesObj,
      indirectSalesObj,
      newUserCvrObj,
      roasObj,
      atcPercentObj,
    ],
  },
  {
    label: "Category Metric",
    key: "category_m",
    join: true, // It is mandatory to map join parent's label and key to children
    children: [
      spendsBudgetObj,
      impressionObj,
      clickObj,
      ctrObj,
      cpmObj,
      totalAtcObj,
      directAtcObj,
      indirectAtcObj,
      totalQuantitiesSoldObj,
      directQuantitiesSoldObj,
      indirectQuantitiesSoldObj,
      totalSalesObj,
      directSalesObj,
      indirectSalesObj,
      newUserCvrObj,
      roasObj,
      atcPercentObj,
    ],
  },
  {
    label: "Keyword Metric",
    key: "keyword_m",
    join: true, // It is mandatory to map join parent's label and key to children
    children: [
      spendsBudgetObj,
      impressionObj,
      clickObj,
      ctrObj,
      cpmObj,
      totalAtcObj,
      directAtcObj,
      indirectAtcObj,
      totalQuantitiesSoldObj,
      directQuantitiesSoldObj,
      indirectQuantitiesSoldObj,
      totalSalesObj,
      directSalesObj,
      indirectSalesObj,
      newUserCvrObj,
      roasObj,
      atcPercentObj,
    ],
  },
];

export const instamartFilterArr = [
  instamartNameIdFilter,
  tagsFilter,
  {
    key: "campaign_status",
    label: "Campaign Status",
    selectable: false,
    children: [
      {
        label: "Active",
        key: "campaign_status-CAMPAIGN_STATUS_LIVE",
        data: "Campaign Status - Active",
        action: FILTERACTION.APPLY,
      },
      {
        label: "Stopped",
        key: "campaign_status-CAMPAIGN_STATUS_STOPPED",
        data: "Campaign Status - Stopped",
        action: FILTERACTION.APPLY,
      },
    ],
  },
  {
    label: "Campaign Metric",
    key: "campaign_m",
    join: true, // It is mandatory to map join parent's label and key to children
    children: [impressionObj, spendObj, ordersAddToCart, salesGmvObj],
  },
  {
    label: "Keyword Metric",
    key: "keyword_m",
    join: true, // It is mandatory to map join parent's label and key to children
    children: [impressionObj, spendObj, ordersAddToCart, salesGmvObj],
  },
  {
    label: "Product Metric",
    key: "product_m",
    join: true, // It is mandatory to map join parent's label and key to children
    children: [impressionObj, spendObj, ordersAddToCart, salesGmvObj],
  },
];

export const instamartReportFilterArr = [
  instamartNameIdReportFilter,
  tagsFilter,
  {
    label: "Campaign Metric",
    key: "campaign_m",
    join: true, // It is mandatory to map join parent's label and key to children
    children: [
      impressionObj,
      spendObj,
      ordersAddToCart,
      salesGmvObj,
      budgetObj,
      roiObj,
    ],
  },
  {
    label: "Keyword Metric",
    key: "keyword_m",
    join: true, // It is mandatory to map join parent's label and key to children
    children: [impressionObj, spendObj, ordersAddToCart, salesGmvObj, roiObj],
  },
  {
    label: "Product Metric",
    key: "product_m",
    join: true, // It is mandatory to map join parent's label and key to children
    children: [impressionObj, spendObj, ordersAddToCart, salesGmvObj, roiObj],
  },
];

export const blinkitReportFilterArr = [
  blinkitNameIdFilterReport,
  tagsFilter,
  blinkitCampaignTypeReport,
  {
    label: "Campaign Metric",
    key: "campaign_m",
    join: true, // It is mandatory to map join parent's label and key to children
    children: [
      spendsBudgetObj,
      impressionObj,
      clickObj,
      ctrObj,
      cpmObj,
      totalAtcObj,
      directAtcObj,
      indirectAtcObj,
      totalQuantitiesSoldObj,
      directQuantitiesSoldObj,
      indirectQuantitiesSoldObj,
      totalSalesObj,
      directSalesObj,
      indirectSalesObj,
      newUsersObj,
      roasObj,
      atcPercentObj,
    ],
  },
  {
    label: "Category Metric",
    key: "category_m",
    join: true, // It is mandatory to map join parent's label and key to children
    children: [
      spendsBudgetObj,
      impressionObj,
      clickObj,
      ctrObj,
      cpmObj,
      totalAtcObj,
      directAtcObj,
      indirectAtcObj,
      totalQuantitiesSoldObj,
      directQuantitiesSoldObj,
      indirectQuantitiesSoldObj,
      totalSalesObj,
      directSalesObj,
      indirectSalesObj,
      newUsersObj,
      roasObj,
      atcPercentObj,
    ],
  },
  {
    label: "Keyword Metric",
    key: "keyword_m",
    join: true, // It is mandatory to map join parent's label and key to children
    children: [
      spendsBudgetObj,
      impressionObj,
      clickObj,
      ctrObj,
      cpmObj,
      totalAtcObj,
      directAtcObj,
      indirectAtcObj,
      totalQuantitiesSoldObj,
      directQuantitiesSoldObj,
      indirectQuantitiesSoldObj,
      totalSalesObj,
      directSalesObj,
      indirectSalesObj,
      newUsersObj,
      roasObj,
      atcPercentObj,
    ],
  },
];

export const amazonReportFilterArr = [
  amazonNameIdFilterReport,
  tagsFilter,
  amazonCampaignTypeReport,
  {
    label: "Portfolio Metric",
    key: "portfolio_m",
    join: true, // It is mandatory to map join parent's label and key to children
    children: [
      campaignCountObj,
      impressionObj,
      clickObj,
      ctrObj,
      spendObj,
      cpcObj,
      unitOrderSoldObj,
      salesObj,
      acosObj,
      roasObj,
      ntbOrdersObj,
      ntbOrdersPercentObj,
      ntbSalesObj,
      ntbSalesPercentObj,
      viewableImpressionsObj,
    ],
  },
  {
    label: "Campaign Metric",
    key: "campaign_m",
    join: true, // It is mandatory to map join parent's label and key to children
    children: [
      impressionObj,
      clickObj,
      ctrObj,
      spendObj,
      cpcObj,
      unitOrderSoldObj,
      salesObj,
      acosObj,
      roasObj,
      ntbOrdersObj,
      ntbOrdersPercentObj,
      ntbSalesObj,
      ntbSalesPercentObj,
      viewableImpressionsObj,
      vtrObj,
      vctrObj,
    ],
  },
  {
    label: "Ad Group Metric",
    key: "ad_group_m",
    join: true, // It is mandatory to map join parent's label and key to children
    children: [
      impressionObj,
      clickObj,
      ctrObj,
      spendObj,
      cpcObj,
      unitOrderSoldObj,
      salesObj,
      acosObj,
      roasObj,
    ],
  },
  {
    label: "Keyword Metric",
    key: "keyword_m",
    join: true, // It is mandatory to map join parent's label and key to children
    children: [
      keywordBidObj,
      impressionObj,
      clickObj,
      ctrObj,
      spendObj,
      cpcObj,
      unitOrderSoldObj,
      salesObj,
      acosObj,
      roasObj,
    ],
  },
  {
    label: "ASIN  Metric",
    key: "asin_m",
    join: true, // It is mandatory to map join parent's label and key to children
    children: [
      clickObj,
      ctrObj,
      spendObj,
      cpcObj,
      unitOrderSoldObj,
      salesObj,
      acosObj,
      roasObj,
    ],
  },
  {
    label: "Search Term Metric",
    key: "search_term_m",
    join: true, // It is mandatory to map join parent's label and key to children
    children: [
      conversionsObj,
      impressionObj,
      clickObj,
      ctrObj,
      spendObj,
      cvrObj,
      salesObj,
    ],
  },
  {
    label: "Placement Metric",
    key: "placement_m",
    join: true, // It is mandatory to map join parent's label and key to children
    children: [
      impressionObj,
      clickObj,
      ctrObj,
      spendObj,
      cpcObj,
      unitOrderSoldObj,
      salesObj,
      acosObj,
      roasObj,
    ],
  },
];

export const zeptoReportFilterArr = [
  zeptoNameIdFilterReport,
  tagsFilter,
  zeptoCampaignTypeReport,
  {
    label: "Campaign Metric",
    key: "campaign_m",
    join: true, // It is mandatory to map join parent's label and key to children
    children: [
      impressionObj,
      clickObj,
      spendObj,
      cpcObj,
      ordersObj,
      roasObj,
      ctrObj,
      addToCartObj,
      salesRevenuesObj,
      cpmObj,
      viewProductsObj,
    ],
  },
  {
    label: "Keyword Metric",
    key: "keyword_m",
    join: true, // It is mandatory to map join parent's label and key to children
    children: [
      impressionObj,
      clickObj,
      spendObj,
      cpcObj,
      roasObj,
      ctrObj,
      salesRevenuesObj,
      cpmObj,
    ],
  },
  {
    label: "Category Metric",
    key: "category_m",
    join: true, // It is mandatory to map join parent's label and key to children
    children: [
      impressionObj,
      clickObj,
      spendObj,
      cpcObj,
      ordersObj,
      roasObj,
      ctrObj,
      salesRevenuesObj,
      cpmObj,
      sameSkuOrdersObj,
      otherSkuOrdersObj,
    ],
  },
  {
    label: "Product Metric",
    key: "product_m",
    join: true, // It is mandatory to map join parent's label and key to children
    children: [
      impressionObj,
      clickObj,
      spendObj,
      cpcObj,
      ordersObj,
      roasObj,
      ctrObj,
      salesRevenuesObj,
      cpmObj,
      sameSkuOrdersObj,
      otherSkuOrdersObj,
      viewsObj,
    ],
  },
];

export const flipkartReportFilterArr = [
  flipkartNameIdFilterReport,
  tagsFilter,
  flipkartCampaignTypeReport,
  flipkartPlatformTypeReport,
  flipkartCampaignStatusReport,
  flipkartBudgetTypeReport,
  {
    label: "Campaign Metric",
    key: "campaign_m",
    join: true, // It is mandatory to map join parent's label and key to children
    children: [
      spendObj,
      viewsObj,
      clickObj,
      ctrObj,
      cpcObj,
      unitOrderSoldObj,
      salesRevenueObj,
      cvrObj,
      roasRoiObj,
      aovObj,
    ],
  },
  {
    label: "Ad Group Metric",
    key: "ad_group_m",
    join: true, // It is mandatory to map join parent's label and key to children
    children: [
      spendObj,
      viewsObj,
      clickObj,
      ctrObj,
      cpcObj,
      unitOrderSoldObj,
      salesRevenueObj,
      cvrObj,
      roasRoiObj,
      aovObj,
    ],
  },
  {
    label: "Keyword Metric",
    key: "keyword_m",
    join: true, // It is mandatory to map join parent's label and key to children
    children: [
      spendObj,
      viewsObj,
      clickObj,
      ctrObj,
      cpcObj,
      unitOrderSoldObj,
      salesRevenueObj,
      cvrObj,
      roasRoiObj,
      aovObj,
    ],
  },
  {
    label: "FSN Metric",
    key: "fsn_m",
    join: true, // It is mandatory to map join parent's label and key to children
    children: [
      spendObj,
      viewsObj,
      clickObj,
      ctrObj,
      cpcObj,
      unitOrderSoldObj,
      salesRevenueObj,
      cvrObj,
      roasRoiObj,
      aovObj,
    ],
  },
  {
    label: "Creative Metric",
    key: "creative_m",
    join: true, // It is mandatory to map join parent's label and key to children
    children: [
      spendObj,
      viewsObj,
      clickObj,
      ctrObj,
      cpcObj,
      unitOrderSoldObj,
      salesRevenueObj,
      cvrObj,
      roasRoiObj,
      aovObj,
    ],
  },
  {
    label: "Placement Metric",
    key: "placement_m",
    join: true, // It is mandatory to map join parent's label and key to children
    children: [
      spendObj,
      viewsObj,
      clickObj,
      ctrObj,
      cpcObj,
      unitOrderSoldObj,
      salesRevenueObj,
      cvrObj,
      roasRoiObj,
      aovObj,
    ],
  },
];

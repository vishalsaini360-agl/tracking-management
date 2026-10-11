const Joi = require("joi");

const tableDataSchema = Joi.object()
  .keys({
    account: Joi.array().items(Joi.string()).allow(null),
    campaign_status: Joi.string().allow("").optional(),
    dataLIMIT: Joi.number().required(),
    end_date: Joi.string().required(),
    offset: Joi.number().required(),
    sort: Joi.object().required(),
    start_date: Joi.string().required(),
    tags: Joi.array().allow(null).optional(),
    type: Joi.array().items(Joi.string()).allow(null),
    columsData: Joi.array(),
  })
  .unknown(true);

const summarySchema = Joi.object()
  .keys({
    brand: Joi.array().items(Joi.string()).required(),
    compareId: Joi.string().required(),
    drr: Joi.boolean().required(),
    end_date: Joi.string().required(),
    manual_compare_date: Joi.object(),
    start_date: Joi.string().required(),
    tags: Joi.array().allow(null).optional(),
    types: Joi.array().items(Joi.string()).required(),
    comp_start_date: Joi.any(),
    comp_end_date: Joi.any(),
  })
  .unknown(true);

const graphSchema = Joi.object()
  .keys({
    brand: Joi.alternatives()
      .try(Joi.string(), Joi.array().items(Joi.string()))
      .required(),
    compareId: Joi.string(),
    drr: Joi.boolean(),
    end_date: Joi.string().required(),
    filters: Joi.array().items(Joi.string()).required(),
    manual_compare_date: Joi.object(),
    start_date: Joi.string().required(),
    tags: Joi.array().allow(null).optional(),
    types: Joi.array().items(Joi.string()),
    dateGrouping: Joi.string(),
    comp_start_date: Joi.any(),
    comp_end_date: Joi.any(),
    tab_name: Joi.string(),
    campaign_id: Joi.array().items(Joi.string()),
    category: Joi.array().items(Joi.string()),
    keyword: Joi.array().items(Joi.string()),
    product_name: Joi.array().items(Joi.string()),
  })
  .unknown(true);

const performanceBreakdownSchema = Joi.object()
  .keys({
    brand: Joi.array().items(Joi.string()).required(),
    compareId: Joi.string().required(),
    drr: Joi.boolean().required(),
    end_date: Joi.string().required(),
    filters: Joi.array().items(Joi.string()).required(),
    manual_compare_date: Joi.object(),
    start_date: Joi.string().required(),
    tags: Joi.array().allow(null).optional(),
    types: Joi.array().items(Joi.string()).required(),
    comp_start_date: Joi.any(),
    comp_end_date: Joi.any(),
  })
  .unknown(true);

const getCampaignListSchema = Joi.object()
  .keys({
    account: Joi.string().required(),
    campaign_type: Joi.object(),
    columsData: Joi.array().required(),
    dataLIMIT: Joi.number().required(),
    download: Joi.number().required(),
    end_date: Joi.string().required(),
    groupByCampaign: Joi.boolean().required(),
    offset: Joi.number().required(),
    platform_id: Joi.string().required(),
    sort: Joi.object().required(),
    start_date: Joi.string().required(),
    campaign_m: Joi.array(),
    campaign_name: Joi.array(),
    category_m: Joi.array(),
    keyword_m: Joi.array(),
    name_id: Joi.array(),
    placement_m: Joi.array(),
    product_m: Joi.array(),
    saved_search: Joi.array(),
    searchFilter: Joi.object(),
    zepto_campaign_type: Joi.array(),
    ad_group_m: Joi.array(),
    campaign_budget_type: Joi.array(),
    campaign_status: Joi.array(),
    creative_m: Joi.array(),
    fsn_m: Joi.array(),
    platform: Joi.array(),
    segment: Joi.array(),
    "": Joi.array(),
    campaign_ids: Joi.array(),
    tag_name: Joi.array(),
    manual_compare_date: Joi.object(),
    compDateRange: Joi.array(),
    drr: Joi.boolean(),
    compareId: Joi.string(),
  })
  .unknown(true);

const getKeywordListSchema = Joi.object()
  .keys({
    account: Joi.string().required(),
    campaign_type: Joi.object(),
    columsData: Joi.array().required(),
    dataLIMIT: Joi.number().required(),
    download: Joi.number().required(),
    end_date: Joi.string().required(),
    groupByCampaign: Joi.boolean().required(),
    offset: Joi.number().required(),
    platform_id: Joi.string().required(),
    sort: Joi.object().required(),
    start_date: Joi.string().required(),
    campaign_m: Joi.array(),
    keyword_m: Joi.array(),
    name_id: Joi.array(),
    placement_m: Joi.array(),
    saved_search: Joi.array(),
    zepto_campaign_type: Joi.array(),
    ad_group_m: Joi.array(),
    campaign_budget_type: Joi.array(),
    campaign_status: Joi.array(),
    creative_m: Joi.array(),
    fsn_m: Joi.array(),
    platform: Joi.array(),
    segment: Joi.array(),
    keyword: Joi.array(),
    category_m: Joi.array(),
    product_m: Joi.array(),
    "": Joi.array(),
    campaign_ids: Joi.array(),
    manual_compare_date: Joi.object(),
    compareId: Joi.string(),
    drr: Joi.boolean(),
    compDateRange: Joi.array(),
  })
  .unknown(true);

const getCategoryListSchema = Joi.object()
  .keys({
    account: Joi.string().required(),
    ad_group_m: Joi.array(),
    campaign_budget_type: Joi.array(),
    campaign_m: Joi.array(),
    campaign_status: Joi.array(),
    campaign_type: Joi.object(),
    columsData: Joi.array().required(),
    creative_m: Joi.array(),
    dataLIMIT: Joi.number().required(),
    download: Joi.number().required(),
    end_date: Joi.string().required(),
    fsn_m: Joi.array(),
    groupByCampaign: Joi.boolean().required(),
    keyword_m: Joi.array(),
    name_id: Joi.array(),
    offset: Joi.number().required(),
    placement_m: Joi.array(),
    platform: Joi.array(),
    platform_id: Joi.string().required(),
    saved_search: Joi.array(),
    segment: Joi.array(),
    sort: Joi.object().required(),
    start_date: Joi.string().required(),
    zepto_campaign_type: Joi.array(),
    category_m: Joi.array(),
    product_m: Joi.array(),
    category_name: Joi.array(),
    "": Joi.array(),
    campaign_ids: Joi.array(),
    manual_compare_date: Joi.object(),
    compareId: Joi.string(),
    compDateRange: Joi.array(),
    drr: Joi.boolean(),
  })
  .unknown(true);

const getProductListSchema = Joi.object()
  .keys({
    account: Joi.string().required(),
    ad_group_m: Joi.array(),
    campaign_budget_type: Joi.array(),
    campaign_m: Joi.array(),
    campaign_status: Joi.array(),
    campaign_type: Joi.object(),
    columsData: Joi.array().required(),
    creative_m: Joi.array(),
    dataLIMIT: Joi.number().required(),
    download: Joi.number().required(),
    end_date: Joi.string().required(),
    fsn_m: Joi.array(),
    groupByCampaign: Joi.boolean().required(),
    keyword_m: Joi.array(),
    name_id: Joi.array(),
    offset: Joi.number().required(),
    placement_m: Joi.array(),
    platform: Joi.array(),
    platform_id: Joi.string().required(),
    saved_search: Joi.array(),
    segment: Joi.array(),
    sort: Joi.object().required(),
    start_date: Joi.string().required(),
    zepto_campaign_type: Joi.array(),
    category_m: Joi.array(),
    product_m: Joi.array(),
    "": Joi.array(),
    campaign_ids: Joi.array(),
    manual_compare_date: Joi.object(),
    compareId: Joi.string(),
    compDateRange: Joi.array(),
    drr: Joi.boolean(),
  })
  .unknown(true);

const campaignReportSchema = Joi.object()
  .keys({
    campaign_type: Joi.array().items(Joi.string()).required(),
    columsData: Joi.array(),
    dataLIMIT: Joi.number().required(),
    end_date: Joi.string().required(),
    offset: Joi.number().required(),
    platform: Joi.string().required(),
    sort: Joi.array().required(),
    start_date: Joi.string().required(),
    type: Joi.array().items(Joi.string()).required(),
  })
  .unknown(true);

const campaignReportDownloadSchema = Joi.object()
  .keys({
    campaign_type: Joi.array().items(Joi.string()).required(),
    columsData: Joi.array(),
    date: Joi.string().required(),
    end_date: Joi.string().required(),
    platform: Joi.string().required(),
    sort: Joi.array().required(),
    start_date: Joi.string().required(),
    type: Joi.array().allow(null).required(),
  })
  .unknown(true);

const categoryReportSchema = Joi.object()
  .keys({
    campaign_type: Joi.array().items(Joi.string()).required(),
    columsData: Joi.array(),
    dataLIMIT: Joi.number().required(),
    end_date: Joi.string().required(),
    offset: Joi.number().required(),
    platform: Joi.string().required(),
    sort: Joi.array().required(),
    start_date: Joi.string().required(),
    type: Joi.array().items(Joi.string()).required(),
  })
  .unknown(true);

const categoryReportDownloadSchema = Joi.object()
  .keys({
    campaign_type: Joi.array().items(Joi.string()).required(),
    columsData: Joi.array(),
    date: Joi.string().required(),
    end_date: Joi.string().required(),
    platform: Joi.string().required(),
    sort: Joi.array().required(),
    start_date: Joi.string().required(),
    type: Joi.array().allow(null).required(),
  })
  .unknown(true);

const keywordReportSchema = Joi.object()
  .keys({
    campaign_type: Joi.array().items(Joi.string()).required(),
    columsData: Joi.array(),
    dataLIMIT: Joi.number().required(),
    end_date: Joi.string().required(),
    offset: Joi.number().required(),
    platform: Joi.string().required(),
    sort: Joi.array().required(),
    start_date: Joi.string().required(),
    type: Joi.array().items(Joi.string()).required(),
  })
  .unknown(true);

const keywordReportDownloadSchema = Joi.object()
  .keys({
    campaign_type: Joi.array().items(Joi.string()).required(),
    columsData: Joi.array(),
    date: Joi.string().required(),
    end_date: Joi.string().required(),
    platform: Joi.string().required(),
    sort: Joi.array().required(),
    start_date: Joi.string().required(),
    type: Joi.array().allow(null).required(),
  })
  .unknown(true);

const productReportSchema = Joi.object()
  .keys({
    campaign_type: Joi.array().items(Joi.string()).required(),
    columsData: Joi.array(),
    dataLIMIT: Joi.number().required(),
    end_date: Joi.string().required(),
    offset: Joi.number().required(),
    platform: Joi.string().required(),
    sort: Joi.array().required(),
    start_date: Joi.string().required(),
    type: Joi.array().items(Joi.string()).required(),
  })
  .unknown(true);

const productReportDownloadSchema = Joi.object()
  .keys({
    campaign_type: Joi.array().items(Joi.string()).required(),
    columsData: Joi.array(),
    date: Joi.string().required(),
    end_date: Joi.string().required(),
    platform: Joi.string().required(),
    sort: Joi.array().required(),
    start_date: Joi.string().required(),
    type: Joi.array().allow(null).required(),
  })
  .unknown(true);

const actionResultSchema = Joi.object()
  .keys({
    account: Joi.array().items(Joi.string()).required(),
    end_date: Joi.string().required(),
    media_type: Joi.string().required(),
    // platform: Joi.array().required(),
    segment: Joi.array().required(),
    start_date: Joi.string().required(),
    status: Joi.array().allow(null).required(),
    sort: Joi.object(),
  })
  .unknown(true);

module.exports = {
  tableDataSchema,
  summarySchema,
  graphSchema,
  performanceBreakdownSchema,
  getCampaignListSchema,
  getKeywordListSchema,
  getCategoryListSchema,
  getProductListSchema,
  campaignReportSchema,
  campaignReportDownloadSchema,
  categoryReportSchema,
  categoryReportDownloadSchema,
  keywordReportSchema,
  keywordReportDownloadSchema,
  productReportSchema,
  productReportDownloadSchema,
  actionResultSchema,
};

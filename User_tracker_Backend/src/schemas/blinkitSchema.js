const Joi = require("joi");

const summarySchema = Joi.object()
  .keys({
    compareId: Joi.string().required(),
    drr: Joi.boolean().required(),
    end_date: Joi.string().required(),
    manual_compare_date: Joi.object(),
    start_date: Joi.string().required(),
    comp_start_date: Joi.any(),
    comp_end_date: Joi.any(),
    tags: Joi.array(),
  })
  .unknown(true);

const getPerformanceCampaignSchema = Joi.object()
  .keys({
    compareId: Joi.string().required(),
    drr: Joi.boolean().required(),
    end_date: Joi.string().required(),
    manual_compare_date: Joi.object(),
    sort: Joi.array().required(),
    start_date: Joi.string().required(),
    comp_start_date: Joi.any(),
    comp_end_date: Joi.any(),
    tags: Joi.array(),
  })
  .unknown(true);

const getReachCampaignSchema = Joi.object()
  .keys({
    compareId: Joi.string().required(),
    drr: Joi.boolean().required(),
    end_date: Joi.string().required(),
    manual_compare_date: Joi.object(),
    sort: Joi.array().required(),
    start_date: Joi.string().required(),
    comp_start_date: Joi.any(),
    comp_end_date: Joi.any(),
    tags: Joi.array(),
  })
  .unknown(true);

const dashboardGraphSchema = Joi.object()
  .keys({
    compareId: Joi.string(),
    drr: Joi.boolean(),
    dateGrouping: Joi.string(),
    end_date: Joi.string().required(),
    manual_compare_date: Joi.object(),
    sort: Joi.array(),
    filters: Joi.array(),
    start_date: Joi.string().required(),
    comp_start_date: Joi.any(),
    comp_end_date: Joi.any(),
    tab_name: Joi.string(),
    campaign_id: Joi.array().items(Joi.string()),
    category: Joi.array(),
    keyword: Joi.array(),
    campaign: Joi.array(),
    tags: Joi.array(),
  })
  .unknown(true);

const performanceBreakdownSchema = Joi.object()
  .keys({
    compareId: Joi.string().required(),
    drr: Joi.boolean().required(),
    end_date: Joi.string().required(),
    filters: Joi.array().items(Joi.string()).required(),
    manual_compare_date: Joi.object(),
    start_date: Joi.string().required(),
    comp_start_date: Joi.any(),
    comp_end_date: Joi.any(),
    tags: Joi.array(),
  })
  .unknown(true);

const getCampaignListSchema = Joi.object()
  .keys({
    compareId: Joi.string(),
    campaign_type: Joi.object(),
    columsData: Joi.array().required(),
    dataLIMIT: Joi.number().required(),
    download: Joi.number().required(),
    end_date: Joi.string().required(),
    groupByCampaign: Joi.boolean().required(),
    offset: Joi.number().required(),
    sort: Joi.object().required(),
    start_date: Joi.string().required(),
    blinkit_campaign_type: Joi.array(),
    campaign_m: Joi.array(),
    campaign_name: Joi.array(),
    category_m: Joi.array(),
    keyword_m: Joi.array(),
    location_m: Joi.array(),
    name_id: Joi.array(),
    saved_search: Joi.array(),
    searchFilter: Joi.object(),
    campaign_budget_type: Joi.array(),
    campaign_status: Joi.array(),
    creative_m: Joi.array(),
    fsn_m: Joi.array(),
    placement_m: Joi.array(),
    platform: Joi.array(),
    segment: Joi.array(),
    "": Joi.array(),
    campaign_ids: Joi.array(),
    tag_name: Joi.array(),
    manual_compare_date: Joi.object(),
    compDateRange: Joi.array(),
    drr: Joi.boolean(),
  })
  .unknown(true);

const getCategoryListSchema = Joi.object()
  .keys({
    campaign_type: Joi.object().required(),
    columsData: Joi.array().required(),
    dataLIMIT: Joi.number().required(),
    download: Joi.number().required(),
    end_date: Joi.string().required(),
    groupByCampaign: Joi.boolean().required(),
    offset: Joi.number().required(),
    sort: Joi.object().required(),
    start_date: Joi.string().required(),
    blinkit_campaign_type: Joi.array(),
    campaign_m: Joi.array(),
    category_m: Joi.array(),
    category_name: Joi.array(),
    keyword_m: Joi.array(),
    location_m: Joi.array(),
    name_id: Joi.array(),
    saved_search: Joi.array(),
    campaign_budget_type: Joi.array(),
    campaign_status: Joi.array(),
    creative_m: Joi.array(),
    fsn_m: Joi.array(),
    placement_m: Joi.array(),
    platform: Joi.array(),
    segment: Joi.array(),
    "": Joi.array(),
    campaign_ids: Joi.array(),
    manual_compare_date: Joi.object(),
    compDateRange: Joi.array(),
    drr: Joi.boolean(),
    compareId: Joi.string(),
  })
  .unknown(true);

const getKeywordListSchema = Joi.object()
  .keys({
    campaign_type: Joi.object().required(),
    columsData: Joi.array().required(),
    dataLIMIT: Joi.number().required(),
    download: Joi.number().required(),
    end_date: Joi.string().required(),
    groupByCampaign: Joi.boolean().required(),
    offset: Joi.number().required(),
    sort: Joi.object().required(),
    start_date: Joi.string().required(),
    blinkit_campaign_type: Joi.array(),
    campaign_m: Joi.array(),
    category_m: Joi.array(),
    keyword: Joi.array(),
    keyword_m: Joi.array(),
    location_m: Joi.array(),
    name_id: Joi.array(),
    saved_search: Joi.array(),
    campaign_budget_type: Joi.array(),
    campaign_status: Joi.array(),
    creative_m: Joi.array(),
    fsn_m: Joi.array(),
    placement_m: Joi.array(),
    platform: Joi.array(),
    segment: Joi.array(),
    "": Joi.array(),
    campaign_ids: Joi.array(),
    manual_compare_date: Joi.object(),
    compDateRange: Joi.array(),
    drr: Joi.boolean(),
    compareId: Joi.string(),
  })
  .unknown(true);

const negativeKeywordSchema = Joi.object()
  .keys({
    dataLIMIT: Joi.number().required(),
    end_date: Joi.string().required(),
    filters: Joi.alternatives().try(Joi.array(), Joi.object()).required(),
    offset: Joi.number().required(),
    sort: Joi.array().required(),
    start_date: Joi.string().required(),
  })
  .unknown(true);

const campaignReportSchema = Joi.object()
  .keys({
    account: Joi.array()
      .items(Joi.string().valid("Reach", "Performance"))
      .min(1)
      .required(),
    columsData: Joi.array().required(),
    dataLIMIT: Joi.number().required(),
    end_date: Joi.string().required(),
    offset: Joi.number().required(),
    platform: Joi.array(),
    sort: Joi.array().required(),
    start_date: Joi.string().required(),
    type: Joi.array(),
  })
  .unknown(true);

const campaignReportDownloadSchema = Joi.object()
  .keys({
    account: Joi.array()
      .items(Joi.string().valid("Reach", "Performance"))
      .min(1)
      .required(),
    columsData: Joi.array().required(),
    date: Joi.string().required(),
    end_date: Joi.string().required(),
    platform: Joi.array(),
    sort: Joi.array().required(),
    start_date: Joi.string().required(),
    type: Joi.array(),
  })
  .unknown(true);

const categoryReportSchema = Joi.object()
  .keys({
    account: Joi.array()
      .items(Joi.string().valid("Reach", "Performance"))
      .min(1)
      .required(),
    columsData: Joi.array().required(),
    dataLIMIT: Joi.number().required(),
    end_date: Joi.string().required(),
    offset: Joi.number().required(),
    platform: Joi.array(),
    sort: Joi.array().required(),
    start_date: Joi.string().required(),
    type: Joi.array(),
  })
  .unknown(true);

const categoryReportDownloadSchema = Joi.object()
  .keys({
    account: Joi.array()
      .items(Joi.string().valid("Reach", "Performance"))
      .min(1)
      .required(),
    columsData: Joi.array().required(),
    date: Joi.string().required(),
    end_date: Joi.string().required(),
    platform: Joi.array(),
    sort: Joi.array().required(),
    start_date: Joi.string().required(),
    type: Joi.array(),
  })
  .unknown(true);

const keywordReportSchema = Joi.object()
  .keys({
    account: Joi.array()
      .items(Joi.string().valid("Reach", "Performance"))
      .min(1)
      .required(),
    columsData: Joi.array().required(),
    dataLIMIT: Joi.number().required(),
    end_date: Joi.string().required(),
    offset: Joi.number().required(),
    platform: Joi.array(),
    sort: Joi.array().required(),
    start_date: Joi.string().required(),
    type: Joi.array(),
  })
  .unknown(true);

const keywordReportDownloadSchema = Joi.object()
  .keys({
    account: Joi.array()
      .items(Joi.string().valid("Reach", "Performance"))
      .min(1)
      .required(),
    columsData: Joi.array().required(),
    date: Joi.string().required(),
    end_date: Joi.string().required(),
    platform: Joi.array(),
    sort: Joi.array().required(),
    start_date: Joi.string().required(),
    type: Joi.array(),
  })
  .unknown(true);

const actionResultSchema = Joi.object()
  .keys({
    end_date: Joi.string().required(),
    media_type: Joi.string().required(),
    sort: Joi.object(),
    // platform: Joi.array()
    //   .items(Joi.string().valid("Reach", "Performance"))
    //   .min(1)
    //   .required(),
    segment: Joi.array().items(Joi.string().valid("Reach", "Performance")),
    start_date: Joi.string().required(),
    status: Joi.array()
      .items(Joi.string().valid("false", "true", "Pending"))
      .min(1)
      .required(),
  })
  .unknown(true);

module.exports = {
  summarySchema,
  getPerformanceCampaignSchema,
  getReachCampaignSchema,
  dashboardGraphSchema,
  performanceBreakdownSchema,
  getCampaignListSchema,
  getCategoryListSchema,
  getKeywordListSchema,
  negativeKeywordSchema,
  campaignReportSchema,
  campaignReportDownloadSchema,
  categoryReportSchema,
  categoryReportDownloadSchema,
  keywordReportSchema,
  keywordReportDownloadSchema,
  actionResultSchema,
};

const Joi = require("joi");
const { join } = require("sequelize/lib/operators");
const readNotificationSchema = Joi.object()
  .keys({
    media_type: Joi.array().items(Joi.string()),
    platforms: Joi.array().items(Joi.string()).required(),
    status: Joi.string().required(),
  })
  .unknown(true)
  .unknown(true);

const updateNotificationStatusSchema = Joi.object()
  .keys({
    media_type: Joi.array().items(Joi.object()).required(),
    platform: Joi.string().required(),
    status: Joi.number().required(),
  })
  .unknown(true)
  .unknown(true);

const summarySchema = Joi.object()
  .keys({
    brand: Joi.array().items(Joi.string()).required(),
    compareId: Joi.string().required(),
    drr: Joi.boolean().required(),
    end_date: Joi.string().required(),
    manual_compare_date: Joi.object(),
    platform: Joi.array().items(Joi.string()).required(),
    start_date: Joi.string().required(),
    types: Joi.array().items(Joi.string()).required(),
    tags: Joi.array().items(Joi.string()),
    comp_start_date: Joi.any(),
    comp_end_date: Joi.any(),
  })
  .unknown(true);

const tableDataSchema = Joi.object()
  .keys({
    account: Joi.array().items(Joi.string()).allow(null),
    campaign_status: Joi.array(),
    dataLIMIT: Joi.number().required(),
    end_date: Joi.string().required(),
    offset: Joi.number().required(),
    platform: Joi.array().items(Joi.string()).allow(null),
    sort: Joi.object().required(),
    start_date: Joi.string().required(),
    tags: Joi.array().items(Joi.string()).allow(null),
    type: Joi.array().items(Joi.string()).allow(null).required(),
    columsData: Joi.array(),
  })
  .unknown(true);

const dashboardGraphSchema = Joi.object()
  .keys({
    brand: Joi.array().items(Joi.string()).required(),
    compareId: Joi.string().required(),
    drr: Joi.boolean().required(),
    end_date: Joi.string().required(),
    filters: Joi.array().items(Joi.string()).required(),
    manual_compare_date: Joi.object(),
    platform: Joi.array().items(Joi.string()).required(),
    start_date: Joi.string().required(),
    tags: Joi.array().items(Joi.string()).allow(null),
    types: Joi.array().items(Joi.string()).required(),
    comp_start_date: Joi.any(),
    comp_end_date: Joi.any(),
  })
  .unknown(true);

const allcomparisonDateSchema = Joi.object()
  .keys({
    platform: Joi.string().required(),
  })
  .unknown(true);

const walletSummaryDataSchema = Joi.object()
  .keys({
    account: Joi.alternatives()
      .try(Joi.string(), Joi.array().items(Joi.string()))
      .required(),
  })
  .unknown(true);

const getSavedFilterSchema = Joi.object()
  .keys({
    media_type: Joi.string().required(),
    user_id: Joi.number().required(),
  })
  .unknown(true);

const savedFilterSchema = Joi.object()
  .keys({
    filters: Joi.object().required(),
    media_type: Joi.string().required(),
    name: Joi.string().required(),
    user_id: Joi.number().required(),
  })
  .unknown(true);

const campaignManagerGraphSchema = Joi.object()
  .keys({
    dateGrouping: Joi.string().required(),
    end_date: Joi.string().required(),
    filters: Joi.array().items(Joi.string()).required(),
    platform_id: Joi.string().required(),
    start_date: Joi.string().required(),
    tab_name: Joi.string().required(),
    campaign: Joi.array(),
    placement: Joi.array(),
    fsn: Joi.array(),
    creative: Joi.array(),
    keyword: Joi.array(),
    creative: Joi.array(),
    adgroup: Joi.array(),
    campaign_id: Joi.array(),
  })
  .unknown(true);

const campaignListSchema = Joi.object()
  .keys({
    columsData: Joi.array().required(),
    dataLIMIT: Joi.number().required(),
    download: Joi.number().required(),
    end_date: Joi.string().required(),
    groupByCampaign: Joi.boolean().required(),
    offset: Joi.number().required(),
    platform_id: Joi.string().required(),
    sort: Joi.object().required(),
    start_date: Joi.string().required(),
    campaign_name: Joi.array(),
    "": Joi.array(),
    ad_group_m: Joi.array(),
    amazon_campaign_type: Joi.array(),
    campaign_budget_type: Joi.array(),
    campaign_m: Joi.array(),
    campaign_status: Joi.array(),
    creative_m: Joi.array(),
    fsn_m: Joi.array(),
    keyword_m: Joi.array(),
    name_id: Joi.array(),
    placement_m: Joi.array(),
    platform: Joi.array(),
    saved_search: Joi.array(),
    segment: Joi.array(),
    searchFilter: Joi.object(),
    tag_name: Joi.array(),
    compareId: Joi.string(),
    drr: Joi.boolean(),
    manual_compare_date: Joi.object(),
    compDateRange: Joi.array(),
  })
  .unknown(true);

const adGroupListSchema = Joi.object()
  .keys({
    campaign_ids: Joi.array().optional(),
    columsData: Joi.array().required(),
    dataLIMIT: Joi.number().required(),
    download: Joi.number().required(),
    end_date: Joi.string().required(),
    groupByCampaign: Joi.boolean().required(),
    offset: Joi.number().required(),
    platform_id: Joi.string().required(),
    sort: Joi.object().required(),
    start_date: Joi.string().required(),
    ad_group_name: Joi.array(),
    "": Joi.array(),
    ad_group_m: Joi.array(),
    ad_group_id: Joi.array(),
    campaign_id: Joi.array(),
    amazon_campaign_type: Joi.array(),
    campaign_budget_type: Joi.array(),
    campaign_m: Joi.array(),
    campaign_status: Joi.array(),
    creative_m: Joi.array(),
    fsn_id: Joi.array(),
    fsn_m: Joi.array(),
    keyword_m: Joi.array(),
    name_id: Joi.array(),
    placement_m: Joi.array(),
    platform: Joi.array(),
    saved_search: Joi.array(),
    segment: Joi.array(),
    searchFilter: Joi.object(),
    tag_name: Joi.array(),
    compareId: Joi.string(),
    drr: Joi.boolean(),
    manual_compare_date: Joi.object(),
    compDateRange: Joi.array(),
  })
  .unknown(true);

const fsnListSchema = Joi.object()
  .keys({
    columsData: Joi.array().required(),
    dataLIMIT: Joi.number().required(),
    download: Joi.number().required(),
    end_date: Joi.string().required(),
    groupByCampaign: Joi.boolean().required(),
    offset: Joi.number().required(),
    platform_id: Joi.string().required(),
    sort: Joi.object().required(),
    start_date: Joi.string().required(),
    ad_group_name: Joi.array(),
    "": Joi.array(),
    ad_group_m: Joi.array(),
    ad_group_id: Joi.array(),
    campaign_id: Joi.array(),
    amazon_campaign_type: Joi.array(),
    campaign_budget_type: Joi.array(),
    campaign_m: Joi.array(),
    campaign_status: Joi.array(),
    creative_m: Joi.array(),
    fsn_id: Joi.array(),
    fsn_m: Joi.array(),
    keyword_m: Joi.array(),
    name_id: Joi.array(),
    placement_m: Joi.array(),
    platform: Joi.array(),
    saved_search: Joi.array(),
    segment: Joi.array(),
    searchFilter: Joi.object(),
    tag_name: Joi.array(),
    fsn_name: Joi.array(),
    campaign_ids: Joi.array().optional(),
    compareId: Joi.string(),
    drr: Joi.boolean(),
    manual_compare_date: Joi.object(),
    compDateRange: Joi.array(),
  })
  .unknown(true);

const placementListSchema = Joi.object()
  .keys({
    columsData: Joi.array().required(),
    dataLIMIT: Joi.number().required(),
    download: Joi.number().required(),
    end_date: Joi.string().required(),
    groupByCampaign: Joi.boolean().required(),
    offset: Joi.number().required(),
    platform_id: Joi.string().required(),
    sort: Joi.object().required(),
    start_date: Joi.string().required(),
    ad_group_name: Joi.array(),
    "": Joi.array(),
    ad_group_m: Joi.array(),
    ad_group_id: Joi.array(),
    campaign_id: Joi.array(),
    amazon_campaign_type: Joi.array(),
    campaign_budget_type: Joi.array(),
    campaign_m: Joi.array(),
    campaign_status: Joi.array(),
    creative_m: Joi.array(),
    fsn_id: Joi.array(),
    fsn_m: Joi.array(),
    keyword_m: Joi.array(),
    name_id: Joi.array(),
    placement_m: Joi.array(),
    platform: Joi.array(),
    saved_search: Joi.array(),
    segment: Joi.array(),
    searchFilter: Joi.object(),
    tag_name: Joi.array(),
    fsn_name: Joi.array(),
    campaign_ids: Joi.array(),
  })
  .unknown(true);

const keywordListSchema = Joi.object()
  .keys({
    columsData: Joi.array().required(),
    dataLIMIT: Joi.number().required(),
    download: Joi.number().required(),
    end_date: Joi.string().required(),
    groupByCampaign: Joi.boolean().required(),
    offset: Joi.number().required(),
    platform_id: Joi.string().required(),
    sort: Joi.object().required(),
    start_date: Joi.string().required(),
    ad_group_name: Joi.array(),
    "": Joi.array(),
    ad_group_m: Joi.array(),
    ad_group_id: Joi.array(),
    campaign_id: Joi.array(),
    amazon_campaign_type: Joi.array(),
    campaign_budget_type: Joi.array(),
    campaign_m: Joi.array(),
    campaign_status: Joi.array(),
    creative_m: Joi.array(),
    fsn_id: Joi.array(),
    fsn_m: Joi.array(),
    keyword_m: Joi.array(),
    name_id: Joi.array(),
    placement_m: Joi.array(),
    platform: Joi.array(),
    saved_search: Joi.array(),
    segment: Joi.array(),
    searchFilter: Joi.object(),
    tag_name: Joi.array(),
    fsn_name: Joi.array(),
    keyword: Joi.array(),
    campaign_ids: Joi.array(),
    compareId: Joi.string(),
    drr: Joi.boolean(),
    manual_compare_date: Joi.object(),
    compDateRange: Joi.array(),
  })
  .unknown(true);

const creativeListSchema = Joi.object()
  .keys({
    columsData: Joi.array().required(),
    dataLIMIT: Joi.number().required(),
    download: Joi.number().required(),
    end_date: Joi.string().required(),
    groupByCampaign: Joi.boolean().required(),
    offset: Joi.number().required(),
    platform_id: Joi.string().required(),
    sort: Joi.object().required(),
    start_date: Joi.string().required(),
    ad_group_name: Joi.array(),
    "": Joi.array(),
    ad_group_m: Joi.array(),
    ad_group_id: Joi.array(),
    campaign_id: Joi.array(),
    amazon_campaign_type: Joi.array(),
    campaign_budget_type: Joi.array(),
    campaign_m: Joi.array(),
    campaign_status: Joi.array(),
    creative_m: Joi.array(),
    fsn_id: Joi.array(),
    fsn_m: Joi.array(),
    keyword_m: Joi.array(),
    name_id: Joi.array(),
    placement_m: Joi.array(),
    platform: Joi.array(),
    saved_search: Joi.array(),
    segment: Joi.array(),
    searchFilter: Joi.object(),
    tag_name: Joi.array(),
    fsn_name: Joi.array(),
    keyword: Joi.array(),
    campaign_ids: Joi.array(),
    compareId: Joi.string(),
    drr: Joi.boolean(),
    manual_compare_date: Joi.object(),
    compDateRange: Joi.array(),
  })
  .unknown(true);

const getNegativeKeywordSchema = Joi.object()
  .keys({
    dataLIMIT: Joi.number().required(),
    end_date: Joi.string().required(),
    filters: Joi.any().optional(),
    offset: Joi.number().required(),
    platform_id: Joi.string().required(),
    sort: Joi.object().required(),
    start_date: Joi.string().required(),
  })
  .unknown(true);

const getSearchTermSchema = Joi.object()
  .keys({
    dataLIMIT: Joi.number().required(),
    end_date: Joi.string().required(),
    filters: Joi.any().optional(),
    offset: Joi.number().required(),
    // performing: Joi.boolean().required(),
    platform_id: Joi.string().required(),
    sort: Joi.object().required(),
    start_date: Joi.string().required(),
  })
  .unknown(true);

const getCampaignListSchema = Joi.object()
  .keys({
    account: Joi.string().required(),
  })
  .unknown(true);

const editSearchTermSchema = Joi.object()
  .keys({
    ad_group_id: Joi.string().required(),
    campaign_id: Joi.string().required(),
    id: Joi.array().required(),
    keywordType: Joi.string().required(),
  })
  .unknown(true);

const addNegativeKeywordSchema = Joi.object()
  .keys({
    data: Joi.array().required(),
  })
  .unknown(true);

const campaignReportSchema = Joi.object()
  .keys({
    account: Joi.string().required(),
    columsData: Joi.array().required(),
    dataLIMIT: Joi.number().required(),
    end_date: Joi.string().required(),
    offset: Joi.number().required(),
    platform: Joi.array().items(Joi.string()).required(),
    sort: Joi.object().required(),
    start_date: Joi.string().required(),
    type: Joi.array().items(Joi.string()).required(),
  })
  .unknown(true);

const campaignReportDownloadSchema = Joi.object()
  .keys({
    account: Joi.string().required(),
    columsData: Joi.array().required(),
    date: Joi.string().required(),
    end_date: Joi.string().required(),
    platform: Joi.array().items(Joi.string()).required(),
    sort: Joi.object().required(),
    start_date: Joi.string().required(),
    type: Joi.array().items(Joi.string()).required(),
  })
  .unknown(true);

const adgroupReportSchema = Joi.object()
  .keys({
    account: Joi.string().required(),
    columsData: Joi.array().required(),
    dataLIMIT: Joi.number().required(),
    end_date: Joi.string().required(),
    offset: Joi.number().required(),
    platform: Joi.array().items(Joi.string()).required(),
    sort: Joi.object().required(),
    start_date: Joi.string().required(),
    type: Joi.array().items(Joi.string()).required(),
  })
  .unknown(true);

const adgroupReportDownloadSchema = Joi.object()
  .keys({
    account: Joi.string().required(),
    columsData: Joi.array().required(),
    date: Joi.string().required(),
    end_date: Joi.string().required(),
    platform: Joi.array().items(Joi.string()).required(),
    sort: Joi.object().required(),
    start_date: Joi.string().required(),
    type: Joi.array().items(Joi.string()).required(),
  })
  .unknown(true);

const fsnReportSchema = Joi.object()
  .keys({
    account: Joi.string().required(),
    columsData: Joi.array().required(),
    dataLIMIT: Joi.number().required(),
    end_date: Joi.string().required(),
    offset: Joi.number().required(),
    platform: Joi.array().items(Joi.string()).required(),
    sort: Joi.object().required(),
    start_date: Joi.string().required(),
    type: Joi.array().items(Joi.string()).required(),
  })
  .unknown(true);

const fsnReportDownloadSchema = Joi.object()
  .keys({
    account: Joi.string().required(),
    columsData: Joi.array().required(),
    date: Joi.string().required(),
    end_date: Joi.string().required(),
    platform: Joi.array().items(Joi.string()).required(),
    sort: Joi.object().required(),
    start_date: Joi.string().required(),
    type: Joi.array().items(Joi.string()).required(),
  })
  .unknown(true);

const keywordReportSchema = Joi.object()
  .keys({
    account: Joi.string().required(),
    columsData: Joi.array().required(),
    dataLIMIT: Joi.number().required(),
    end_date: Joi.string().required(),
    offset: Joi.number().required(),
    platform: Joi.array().items(Joi.string()).required(),
    sort: Joi.object().required(),
    start_date: Joi.string().required(),
    type: Joi.array().items(Joi.string()).required(),
  })
  .unknown(true);

const keywordReportDownloadSchema = Joi.object()
  .keys({
    account: Joi.string().required(),
    columsData: Joi.array().required(),
    date: Joi.string().required(),
    end_date: Joi.string().required(),
    platform: Joi.array().items(Joi.string()).required(),
    sort: Joi.object().required(),
    start_date: Joi.string().required(),
    type: Joi.array().items(Joi.string()).required(),
  })
  .unknown(true);

const searchReportSchema = Joi.object()
  .keys({
    account: Joi.string().required(),
    columsData: Joi.array().required(),
    dataLIMIT: Joi.number().required(),
    end_date: Joi.string().required(),
    offset: Joi.number().required(),
    platform: Joi.array().items(Joi.string()).required(),
    sort: Joi.object().required(),
    start_date: Joi.string().required(),
    type: Joi.array().items(Joi.string()).required(),
  })
  .unknown(true);

const searchReportDownloadSchema = Joi.object()
  .keys({
    account: Joi.string().required(),
    columsData: Joi.array().required(),
    date: Joi.string().required(),
    end_date: Joi.string().required(),
    platform: Joi.array().items(Joi.string()).required(),
    sort: Joi.object().required(),
    start_date: Joi.string().required(),
    type: Joi.array().items(Joi.string()).required(),
  })
  .unknown(true);

const placementReportSchema = Joi.object()
  .keys({
    account: Joi.string().required(),
    columsData: Joi.array().required(),
    dataLIMIT: Joi.number().required(),
    end_date: Joi.string().required(),
    offset: Joi.number().required(),
    platform: Joi.array().items(Joi.string()).required(),
    sort: Joi.object().required(),
    start_date: Joi.string().required(),
    type: Joi.array().items(Joi.string()).required(),
  })
  .unknown(true);

const placementReportDownloadSchema = Joi.object()
  .keys({
    account: Joi.string().required(),
    columsData: Joi.array().required(),
    date: Joi.string().required(),
    end_date: Joi.string().required(),
    platform: Joi.array().items(Joi.string()).required(),
    sort: Joi.object().required(),
    start_date: Joi.string().required(),
    type: Joi.array().items(Joi.string()).required(),
  })
  .unknown(true);

const creativeReportSchema = Joi.object()
  .keys({
    account: Joi.string().required(),
    columsData: Joi.array().required(),
    dataLIMIT: Joi.number().required(),
    end_date: Joi.string().required(),
    offset: Joi.number().required(),
    platform: Joi.array().items(Joi.string()).required(),
    sort: Joi.object().required(),
    start_date: Joi.string().required(),
    type: Joi.array().items(Joi.string()).required(),
  })
  .unknown(true);

const creativeReportDownloadSchema = Joi.object()
  .keys({
    account: Joi.string().required(),
    columsData: Joi.array().required(),
    date: Joi.string().required(),
    end_date: Joi.string().required(),
    platform: Joi.array().items(Joi.string()).required(),
    sort: Joi.object().required(),
    start_date: Joi.string().required(),
    type: Joi.array().items(Joi.string()).required(),
  })
  .unknown(true);

const revenueReportSchema = Joi.object()
  .keys({
    account: Joi.string().required(),
    columsData: Joi.array().required(),
    dataLIMIT: Joi.number().required(),
    end_date: Joi.string().required(),
    offset: Joi.number().required(),
    platform: Joi.array().items(Joi.string()).required(),
    sort: Joi.object().required(),
    start_date: Joi.string().required(),
    type: Joi.array().items(Joi.string()).required(),
  })
  .unknown(true);

const revenueReportDownloadSchema = Joi.object()
  .keys({
    account: Joi.string().required(),
    columsData: Joi.array().required(),
    date: Joi.string().required(),
    end_date: Joi.string().required(),
    platform: Joi.array().items(Joi.string()).required(),
    sort: Joi.object().required(),
    start_date: Joi.string().required(),
    type: Joi.array().items(Joi.string()).required(),
  })
  .unknown(true);

const actionResultSchema = Joi.object()
  .keys({
    account: Joi.array().items(Joi.string()).required(),
    end_date: Joi.string().required(),
    media_type: Joi.string().required(),
    // platform: Joi.array().items(Joi.string()).required(),
    // segment: Joi.array().allow(null).required(),
    start_date: Joi.string().required(),
    status: Joi.array().items(Joi.string()).required(),
    sort: Joi.object(),
    filters: Joi.object(),
  })
  .unknown(true);

module.exports = {
  readNotificationSchema,
  updateNotificationStatusSchema,
  summarySchema,
  tableDataSchema,
  dashboardGraphSchema,
  allcomparisonDateSchema,
  walletSummaryDataSchema,
  getSavedFilterSchema,
  campaignManagerGraphSchema,
  campaignListSchema,
  adGroupListSchema,
  fsnListSchema,
  placementListSchema,
  keywordListSchema,
  creativeListSchema,
  getNegativeKeywordSchema,
  getSearchTermSchema,
  getCampaignListSchema,
  editSearchTermSchema,
  addNegativeKeywordSchema,
  savedFilterSchema,
  campaignReportSchema,
  campaignReportDownloadSchema,
  adgroupReportSchema,
  adgroupReportDownloadSchema,
  fsnReportSchema,
  fsnReportDownloadSchema,
  keywordReportSchema,
  keywordReportDownloadSchema,
  searchReportSchema,
  searchReportDownloadSchema,
  placementReportSchema,
  placementReportDownloadSchema,
  creativeReportSchema,
  creativeReportDownloadSchema,
  revenueReportSchema,
  revenueReportDownloadSchema,
  actionResultSchema,
};

const Joi = require("joi");

const summarySchema = Joi.object()
  .keys({
    brand: Joi.array().items(Joi.string()).required(),
    compareId: Joi.string(),
    drr: Joi.boolean().required(),
    end_date: Joi.string().required(),
    manual_compare_date: Joi.object(),
    start_date: Joi.string().required(),
    types: Joi.array().items(Joi.string()).required(),
    tags: Joi.array(),
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
    sort: Joi.object().required(),
    start_date: Joi.string().required(),
    tags: Joi.array().allow(null).optional(),
    type: Joi.array().items(Joi.string()).allow(null),
    columsData: Joi.array(),
  })
  .unknown(true);

const graphSchema = Joi.object()
  .keys({
    brand: Joi.alternatives()
      .try(Joi.string().allow(""), Joi.array().items(Joi.string()))
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
    campaign_id: Joi.array().items(Joi.string()),
    tab_name: Joi.string(),
    keyword_id: Joi.array().items(Joi.string()),
    campaign_name: Joi.array().items(Joi.string()),
    ad_group_id: Joi.array().items(Joi.string()),
    placement: Joi.array().items(Joi.string()),
    portfolio_id: Joi.array().items(Joi.string()),
  })
  .unknown(true);

const portfolioListSchema = Joi.object()
  .keys({
    campaign_type: Joi.object(),
    columsData: Joi.array(),
    dataLIMIT: Joi.number().required(),
    download: Joi.number().required(),
    end_date: Joi.string().required(),
    groupByCampaign: Joi.boolean().required(),
    offset: Joi.number().required(),
    platform_id: Joi.string().required(),
    sort: Joi.object().required(),
    start_date: Joi.string().required(),
    ad_group_m: Joi.array(),
    amazon_campaign_type: Joi.array(),
    campaign_budget_type: Joi.array(),
    campaign_status: Joi.array(),
    asin_m: Joi.array(),
    campaign_m: Joi.array(),
    creative_m: Joi.array(),
    fsn_m: Joi.array(),
    keyword_m: Joi.array(),
    name_id: Joi.array(),
    placement_m: Joi.array(),
    platform: Joi.array(),
    platform_id: Joi.string(),
    portfolio: Joi.array(),
    portfolio_m: Joi.array(),
    saved_search: Joi.array(),
    segment: Joi.array(),
    searchFilter: Joi.object(),
    "": Joi.array(),
  })
  .unknown(true);

const campaignListSchema = Joi.object()
  .keys({
    campaign_type: Joi.object(),
    columsData: Joi.array(),
    dataLIMIT: Joi.number().required(),
    download: Joi.number().required(),
    end_date: Joi.string().required(),
    groupByCampaign: Joi.boolean().required(),
    offset: Joi.number().required(),
    platform_id: Joi.string().required(),
    sort: Joi.object().required(),
    start_date: Joi.string().required(),
    ad_group_m: Joi.array(),
    amazon_campaign_type: Joi.array(),
    campaign_budget_type: Joi.array(),
    campaign_m: Joi.array(),
    campaign_name: Joi.array(),
    campaign_status: Joi.array(),
    creative_m: Joi.array(),
    fsn_m: Joi.array(),
    keyword_m: Joi.array(),
    name_id: Joi.array(),
    placement_m: Joi.array(),
    platform: Joi.array(),
    platform_id: Joi.string(),
    portfolio_m: Joi.array().optional(),
    asin_m: Joi.array().optional(),
    saved_search: Joi.array(),
    segment: Joi.array(),
    searchFilter: Joi.object(),
    tag_name: Joi.array(),
    "": Joi.array(),
    portfolioIds: Joi.any(),
    manual_compare_date: Joi.any(),
    compareId: Joi.any(),
    compDateRange: Joi.any(),
    drr: Joi.any(),
  })
  .unknown(true);

const adGroupListSchema = Joi.object()
  .keys({
    campaign_type: Joi.object(),
    columsData: Joi.array(),
    dataLIMIT: Joi.number().required(),
    download: Joi.number().required(),
    end_date: Joi.string().required(),
    groupByCampaign: Joi.boolean().required(),
    offset: Joi.number().required(),
    platform_id: Joi.string().required(),
    sort: Joi.object().required(),
    start_date: Joi.string().required(),
    ad_group_m: Joi.array(),
    adgroupname: Joi.array(),
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
    "": Joi.array(),
    campaign_ids: Joi.array(),
    manual_compare_date: Joi.any(),
    compareId: Joi.any(),
    compDateRange: Joi.any(),
    drr: Joi.any(),
    portfolio_m: Joi.array(),
    asin_m: Joi.array(),
  })
  .unknown(true);

const asinListSchema = Joi.object()
  .keys({
    campaign_type: Joi.object(),
    columsData: Joi.array(),
    dataLIMIT: Joi.number().required(),
    download: Joi.number().required(),
    end_date: Joi.string().required(),
    groupByCampaign: Joi.boolean().required(),
    offset: Joi.number().required(),
    platform_id: Joi.string().required(),
    sort: Joi.object().required(),
    start_date: Joi.string().required(),
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
    "": Joi.array(),
    campaign_ids: Joi.array(),
    manual_compare_date: Joi.any(),
    compareId: Joi.string(),
    compDateRange: Joi.any(),
    drr: Joi.any(),
  })
  .unknown(true);

const keywordListSchema = Joi.object()
  .keys({
    campaign_type: Joi.object(),
    columsData: Joi.array(),
    dataLIMIT: Joi.number().required(),
    download: Joi.number().required(),
    end_date: Joi.string().required(),
    groupByCampaign: Joi.boolean().required(),
    offset: Joi.number().required(),
    platform_id: Joi.string().required(),
    sort: Joi.object().required(),
    start_date: Joi.string().required(),
    ad_group_m: Joi.array(),
    amazon_campaign_type: Joi.array(),
    campaign_budget_type: Joi.array(),
    campaign_m: Joi.array(),
    campaign_status: Joi.array(),
    creative_m: Joi.array(),
    fsn_m: Joi.array(),
    keyword: Joi.array(),
    keyword_m: Joi.array(),
    name_id: Joi.array(),
    placement_m: Joi.array(),
    platform: Joi.array(),
    saved_search: Joi.array(),
    segment: Joi.array(),
    searchFilter: Joi.object(),
    "": Joi.array(),
    campaign_ids: Joi.array(),
    portfolio_m: Joi.array(),
    asin_m: Joi.array(),
    manual_compare_date: Joi.any(),
    compareId: Joi.string(),
    compDateRange: Joi.any(),
    drr: Joi.any(),
  })
  .unknown(true);

const creativeSchema = Joi.object()
  .keys({
    campaign_type: Joi.object(),
    columsData: Joi.array(),
    dataLIMIT: Joi.number().required(),
    download: Joi.number().required(),
    end_date: Joi.string().required(),
    groupByCampaign: Joi.boolean().required(),
    offset: Joi.number().required(),
    platform_id: Joi.string().required(),
    sort: Joi.object().required(),
    start_date: Joi.string().required(),
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
    "": Joi.array(),
    campaign_ids: Joi.array(),
  })
  .unknown(true);

const placementSchema = Joi.object()
  .keys({
    campaign_type: Joi.object(),
    columsData: Joi.array(),
    dataLIMIT: Joi.number().required(),
    download: Joi.number().required(),
    end_date: Joi.string().required(),
    groupByCampaign: Joi.boolean().required(),
    offset: Joi.number().required(),
    platform_id: Joi.string().required(),
    sort: Joi.object().required(),
    start_date: Joi.string().required(),
    ad_group_m: Joi.array(),
    amazon_campaign_type: Joi.array(),
    campaign_budget_type: Joi.array(),
    campaign_m: Joi.array(),
    campaign_status: Joi.array(),
    creative_m: Joi.array(),
    fsn_m: Joi.array(),
    keyword_m: Joi.array(),
    name_id: Joi.array(),
    placement: Joi.array(),
    placement_m: Joi.array(),
    platform: Joi.array(),
    saved_search: Joi.array(),
    segment: Joi.array(),
    searchFilter: Joi.object(),
    "": Joi.array(),
    campaign_ids: Joi.array(),
    manual_compare_date: Joi.any(),
    compareId: Joi.any(),
    compDateRange: Joi.any(),
    drr: Joi.any(),
  })
  .unknown(true);

const campaignReportSchema = Joi.object()
  .keys({
    account: Joi.string().required(),
    dataLIMIT: Joi.number().required(),
    end_date: Joi.string().required(),
    sort: Joi.object().required(),
    start_date: Joi.string().required(),
    columsData: Joi.array(),
  })
  .unknown(true);

const campaignReportDownloadSchema = Joi.object()
  .keys({
    account: Joi.string().required(),
    date: Joi.string().required(),
    end_date: Joi.string().required(),
    sort: Joi.object().required(),
    start_date: Joi.string().required(),
    columsData: Joi.array(),
  })
  .unknown(true);

const adgroupReportSchema = Joi.object()
  .keys({
    account: Joi.string().required(),
    dataLIMIT: Joi.number().required(),
    end_date: Joi.string().required(),
    sort: Joi.object().required(),
    start_date: Joi.string().required(),
    columsData: Joi.array(),
  })
  .unknown(true);

const adgroupReportDownloadSchema = Joi.object()
  .keys({
    account: Joi.string().required(),
    date: Joi.string().required(),
    end_date: Joi.string().required(),
    sort: Joi.object().required(),
    start_date: Joi.string().required(),
    columsData: Joi.array(),
  })
  .unknown(true);

const asinReportSchema = Joi.object()
  .keys({
    account: Joi.string().required(),
    dataLIMIT: Joi.number(),
    end_date: Joi.string().required(),
    offset: Joi.number(),
    platform: Joi.any(),
    sort: Joi.object().required(),
    start_date: Joi.string().required(),
    type: Joi.array(),
    columsData: Joi.array(),
    download: Joi.boolean(),
    date: Joi.string(),
  })
  .unknown(true);

const keywordReportSchema = Joi.object()
  .keys({
    account: Joi.string().required(),
    dataLIMIT: Joi.number(),
    end_date: Joi.string().required(),
    match_type: Joi.array(),
    sort: Joi.object().required(),
    start_date: Joi.string().required(),
    columsData: Joi.array(),
    date: Joi.string(),
  })
  .unknown(true);

const searchReportSchema = Joi.object()
  .keys({
    account: Joi.string(),
    columsData: Joi.array(),
    dataLIMIT: Joi.number(),
    end_date: Joi.string().required(),
    filters: Joi.alternatives().try(Joi.array(), Joi.object()),
    offset: Joi.number(),
    performing: Joi.boolean(),
    platform_id: Joi.string(),
    platform: Joi.any(),
    sort: Joi.object().required(),
    start_date: Joi.string().required(),
    type: Joi.array(),
  })
  .unknown(true);

const searchReportDownloadSchema = Joi.object()
  .keys({
    account: Joi.string().required(),
    columsData: Joi.array(),
    date: Joi.string(),
    end_date: Joi.string().required(),
    platform: Joi.any(),
    sort: Joi.object().required(),
    start_date: Joi.string().required(),
    type: Joi.array(),
  })
  .unknown(true);

const placementReportSchema = Joi.object()
  .keys({
    account: Joi.string().required(),
    columsData: Joi.array(),
    dataLIMIT: Joi.number().required(),
    end_date: Joi.string().required(),
    offset: Joi.number().required(),
    platform: Joi.any(),
    sort: Joi.object().required(),
    start_date: Joi.string().required(),
  })
  .unknown(true);

const placementReportDownloadSchema = Joi.object()
  .keys({
    account: Joi.string().required(),
    columsData: Joi.array(),
    date: Joi.string(),
    end_date: Joi.string().required(),
    sort: Joi.object().required(),
    start_date: Joi.string().required(),
  })
  .unknown(true);

const creativeReportSchema = Joi.object()
  .keys({
    account: Joi.string().required(),
    columsData: Joi.array(),
    dataLIMIT: Joi.number().required(),
    end_date: Joi.string().required(),
    offset: Joi.number().required(),
    platform: Joi.any(),
    sort: Joi.object().required(),
    start_date: Joi.string().required(),
    type: Joi.array(),
  })
  .unknown(true);

const creativeReportDownloadSchema = Joi.object()
  .keys({
    account: Joi.string().required(),
    columsData: Joi.array(),
    date: Joi.string(),
    end_date: Joi.string().required(),
    platform: Joi.any(),
    sort: Joi.object().required(),
    start_date: Joi.string().required(),
    type: Joi.array(),
  })
  .unknown(true);

const actionResultSchema = Joi.object()
  .keys({
    account: Joi.array().required(),
    end_date: Joi.string().required(),
    media_type: Joi.string().required(),
    platform: Joi.array(),
    segment: Joi.array().allow(null),
    start_date: Joi.string().required(),
    status: Joi.array(),
    sort: Joi.object(),
  })
  .unknown(true);

const valueKeywordMetricSchema = Joi.object()
  .keys({
    account: Joi.array().items(Joi.string()).required(),
    compare: Joi.string().required(),
    compare_by: Joi.string().required(),
    end_date: Joi.string().required(),
    start_date: Joi.string().required(),
    type: Joi.array().items(Joi.string()).required(),
    value_1: Joi.number().required(),
    value_2: Joi.number().required(),
  })
  .unknown(true);

const valueCampaignMetricSchema = Joi.object()
  .keys({
    account: Joi.array().items(Joi.string()).required(),
    compare: Joi.string().required(),
    compare_by: Joi.string().required(),
    end_date: Joi.string().required(),
    groupBy: Joi.array().required(),
    offset: Joi.number(),
    start_date: Joi.string().required(),
    tags: Joi.array().allow(null).optional(),
    type: Joi.array().items(Joi.string()).required(),
    value_1: Joi.number().required(),
    value_2: Joi.number().required(),
  })
  .unknown(true);

const topCampaignSchema = Joi.object()
  .keys({
    account: Joi.array().items(Joi.string()).required(),
    compare: Joi.string().required(),
    compare_by: Joi.string().required(),
    dataLIMIT: Joi.number().required(),
    end_date: Joi.string().required(),
    offset: Joi.number().required(),
    sort: Joi.object().required(),
    start_date: Joi.string().required(),
    tags: Joi.array().allow(null).optional(),
    type: Joi.array().items(Joi.string()).required(),
    value_1: Joi.number().required(),
    value_2: Joi.number().required(),
  })
  .unknown(true);

const adgroupMetricSchema = Joi.object()
  .keys({
    breakdown: Joi.array(),
    campType: Joi.array().items(Joi.string()).required(),
    compareValue: Joi.string().required(),
    dataLimit: Joi.number().required(),
    end_date: Joi.string().required(),
    platform: Joi.array().items(Joi.string()).required(),
    selectedMetricOptions: Joi.string().required(),
    sort: Joi.object().required(),
    start_date: Joi.string().required(),
    value1: Joi.number().required(),
    value2: Joi.number().required(),
  })
  .unknown(true);

const keywordMetricSchema = Joi.object()
  .keys({
    breakdown: Joi.array(),
    campType: Joi.array().items(Joi.string()).required(),
    compareValue: Joi.string().required(),
    dataLimit: Joi.number().required(),
    end_date: Joi.string().required(),
    platform: Joi.array().items(Joi.string()).required(),
    selectedMetricOptions: Joi.string().required(),
    sort: Joi.object().required(),
    start_date: Joi.string().required(),
    value1: Joi.number().required(),
    value2: Joi.number().required(),
  })
  .unknown(true);

const asinMetricSchema = Joi.object()
  .keys({
    asinLevelFilter: Joi.string().required(),
    campType: Joi.array().required(),
    compareValue: Joi.string().required(),
    dateRange: Joi.array().required(),
    lowBreakdown: Joi.array(),
    lowDataLimit: Joi.number(),
    platform: Joi.array().required(),
    selectedMetric: Joi.string().required(),
    topBreakdown: Joi.array(),
    topDataLimit: Joi.number(),
    valueFirst: Joi.number().required(),
    valueSecond: Joi.number().required(),
  })
  .unknown(true);

const placementMetricSchema = Joi.object()
  .keys({
    campType: Joi.array().required(),
    compareValue: Joi.string().required(),
    dateRange: Joi.array().required(),
    lowBreakdown: Joi.array(),
    lowDataLimit: Joi.number(),
    placementLevelFilter: Joi.string(),
    platform: Joi.array().required(),
    selectedMetric: Joi.string().required(),
    topBreakdown: Joi.array(),
    topDataLimit: Joi.number(),
    valueFirst: Joi.number().required(),
    valueSecond: Joi.number().required(),
  })
  .unknown(true);

const scheduleApiSchema = Joi.object()
  .keys({
    client_id: Joi.string().required(),
    created_by: Joi.string().required(),
    custom_schedule: Joi.object(),
    emails: Joi.array().required(),
    entity: Joi.string(),
    execution_status: Joi.string(),
    frequency: Joi.string(),
    media_type: Joi.string(),
    report_format: Joi.string().required(),
    report_id: Joi.string().required(),
    schedule: Joi.string(),
    scheduled_time: Joi.string().required(),
    start_date: Joi.string().required(),
    time_range: Joi.string(),
  })
  .unknown(true);

const createPortfolioSchema = Joi.object()
  .keys({
    budget: Joi.string(),
    budget_cap: Joi.string(),
    endDate: Joi.string(),
    startDate: Joi.string(),
    portfolio_name: Joi.string().required(),
    profile_id: Joi.string().required(),
  })
  .unknown(true);

module.exports = {
  tableDataSchema,
  summarySchema,
  graphSchema,
  portfolioListSchema,
  campaignListSchema,
  adGroupListSchema,
  asinListSchema,
  keywordListSchema,
  creativeSchema,
  placementSchema,
  campaignReportSchema,
  campaignReportDownloadSchema,
  adgroupReportSchema,
  adgroupReportDownloadSchema,
  asinReportSchema,
  keywordReportSchema,
  searchReportSchema,
  searchReportDownloadSchema,
  placementReportSchema,
  placementReportDownloadSchema,
  creativeReportSchema,
  creativeReportDownloadSchema,
  actionResultSchema,
  valueKeywordMetricSchema,
  valueCampaignMetricSchema,
  topCampaignSchema,
  adgroupMetricSchema,
  keywordMetricSchema,
  asinMetricSchema,
  placementMetricSchema,
  scheduleApiSchema,
  createPortfolioSchema,
};

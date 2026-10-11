const Joi = require("joi");
const fetchRulesSchema = Joi.object()
  .keys({
    media_type: Joi.string().required(),
    platform: Joi.array().items(Joi.string()),
    platformId: Joi.array().items(Joi.string()).required(),
    search: Joi.string().allow(""),
    status: Joi.array().items(Joi.boolean()).required(),
  })
  .unknown(true);

const rulesSchema = Joi.object()
  .keys({
    action: Joi.string().required(),
    budget_amount: Joi.string().optional(),
    budget_percent: Joi.string().optional(),
    campaign_type: Joi.array().items(Joi.string()).required(),
    entity: Joi.string().required(),
    is_condition_present: Joi.boolean().required(),
    media_type: Joi.string().required(),
    platform: Joi.array().items(Joi.string()).required(),
    platformId: Joi.array().items(Joi.string()).required(),
    rule_name: Joi.string().required(),
    schedule: Joi.string().required(),
    tags: Joi.array().items(Joi.boolean()).required(),
    time_range: Joi.string().required(),
  })
  .unknown(true);

const previewDataSchema = Joi.object()
  .keys({
    ruleData: Joi.object().required(),
  })
  .unknown(true);

const rpaActionEditSchema = Joi.array().items(
  Joi.object({
    account: Joi.string(),
    account_id: Joi.string(),
    action: Joi.string().required(),
    action_message: Joi.string().required(),
    action_status: Joi.number().valid(0, 1).required(),
    action_type: Joi.string().required(),
    campaign_id: Joi.array().items(Joi.string()).required(),
    campaign_name: Joi.array().items(Joi.string()).required(),
    client_id: Joi.string(),
    platform: Joi.string().required(),
    platform_id: Joi.string().required(),
    segment: Joi.string()
      .valid("PLA", "PCA", "Performance", "Reach")
      .required(),
    min_bid: Joi.string(),
    set_value: Joi.number().min(1),
    end_date: Joi.string(),
    ad_group_id: Joi.string(),
    ad_group_name: Joi.string(),
    placement_bid: Joi.number(),
    placement_type: Joi.string(),
    exact_keyword: Joi.string(),
    broad_keyword: Joi.string(),
    media_type: Joi.string(),
  })
);

const bulkCampaignTagSchema = Joi.object()
  .keys({
    campaign_id: Joi.array().items(Joi.string()).required(),
    platform: Joi.string().required(),
    tag_id: Joi.array().items(Joi.string()).required(),
  })
  .unknown(true);

module.exports = {
  fetchRulesSchema,
  rulesSchema,
  previewDataSchema,
  bulkCampaignTagSchema,
};

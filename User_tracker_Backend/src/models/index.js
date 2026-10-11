const flipkart_campaign = require("./flipkart_campaign").schema;
const flipkart_category = require("./flipkart_category").schema;
const flipkart_products = require("./flipkart_products").schema;
const ebux_ui_error = require("./ebux_ui_error").schema;
const ebux_campaign_saved_search =
  require("./ebux_campaign_saved_search").schema;
const rpa_action_rules = require("./rpa_action_rules").schema;
const flipkart_keywords = require("./flipkart_keywords").schema;
const log = require("./log").schema;
const ebux_notification_data = require("./ebux_notification_data").schema;

module.exports = [
  ["flipkart_campaign", flipkart_campaign],
  ["flipkart_category", flipkart_category],
  ["flipkart_products", flipkart_products],
  ["ebux_ui_error", ebux_ui_error],
  ["ebux_campaign_saved_search", ebux_campaign_saved_search],
  ["flipkart_keywords", flipkart_keywords],
  ["log", log],

  ["ebux_notification_data", ebux_notification_data],
];

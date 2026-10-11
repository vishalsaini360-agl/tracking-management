import { kpiMap } from "../component/Ebux/Context/EbuxProvider";
import { REACT_APP_Tracking_API_ENDPOINT } from "../utils/url";

export const SESSION_KEY = "activity_session_id";
export const SESSION_START_TIME_KEY = "activity_session_started_at";
export const FLUSH_INTERVAL_MS = 5000; // send every 5 seconds...
export const FLUSH_BATCH_SIZE = 20; // ...or as soon as we have 20 events, whichever first
export const EVENT_API_ENDPOINT = `${REACT_APP_Tracking_API_ENDPOINT}`;

export const TRACKING_EVENTS = {
  SESSION_START: "SESSION_START",
  PAGE_ENTER: "PAGE_ENTER",
  PAGE_EXIT: "PAGE_EXIT",
  PAGE_VISIBLE: "PAGE_VISIBLE",
  PAGE_HIDDEN: "PAGE_HIDDEN",
  CLICK: "CLICK",
  SCROLL: "SCROLL",
  SESSION_END: "SESSION_END",
};

export const TRACKING_COMPONENT = {
  TAB: "Tab",
  BUTTON: "Button",
  LINK: "Link",
  DROPDOWN: "Dropdown",
  CHECKBOX: "Checkbox",
  TOGGLE_BUTTON: "Toggle_Button",
  MAP: "Map",
  TABLE: "Table",
  DATE_PICKER: "Date_Picker",
  DRAWER: "Drawer",
  POPUP: "Popup",
  INPUT: "Input"
};


export const Tab_TYPE = {
  trend_analysis: "Executive Summary / Trend Analysis",
  executive_summary: "Executive Summary / 6P Analytics",
  dark_store_analysis: "Dark Store Analysis",
  comprehensive_breakdown: "Comprehensive Breakdown"
}
export const Page_Data = Object.keys(kpiMap)?.reduce((acc, kpi) => {
  acc[kpi] = {
    page_url: kpiMap[kpi]?.link,
    page_name: kpiMap[kpi]?.lable,
    tab: Tab_TYPE.executive_summary
  };
  return acc;
}, {});



export const Widget_TYPE = {
  Graphical_Analysis: "Graphical Analysis",
  Products_Distribution: "Products Distribution",
  Keywords_Distribution: "Keywords Distribution",

  Category_Focus: "Category Focus",
  OSA_by_Brand: "OSA by Brand",
  OOS_Days_Overview: "OOS Days Overview",


  OSA_Performance_Overview: "OSA Performance Overview",
  PRO_Performance_Overview: "Promotions Performance Overview",
  SOS_Performance_Overview: "SOS Analysis",

  OSA_Performance: "OSA Performance",
  Promotions_Performance: "Promotions Performance",
  SOS_Performance: "SOS Analysis",

  SOS_Analysis: "SOS Analysis",
  Keyword_Analysis: "Keyword Analysis",

  Brand_Analysis: "Brand Analysis",
  Competition_Analysis: "Competition Analysis",
  Widget_POPUP: "Widget POPUP",
  Global_Summary: "Global Summary",
  Global_Tabular_View: "Global Tabular View",
}
export const ENTITY_TYPE = {
  Widget_POPUP: "Widget POPUP",
  Customize_Column: "Customize Column",

  Platform_Tile_Component: "Platform Tile Component",
  Tile_Component: "Tile Component",

  Graphical_Analysis: "Graphical Analysis",
  Products_Distribution: "Products Distribution",
  Keywords_Distribution: "Keywords Distribution",

  Category_Focus: "Category Focus",
  OSA_by_Brand: "OSA by Brand",
  OOS_Days_Overview: "OOS Days Overview",
  OOS_Performance_Overview: "OOS Days Performance_Overview",

  OSA_Performance_Overview: "OSA Performance Overview",
  OSA_Movers_and_Shakers: "OSA Movers and Shakers",
  Region_Wise_OSA_Performance_Map: "Region-wise OSA Performance - Map",
  Region_Wise_OSA_Performance_Tabular_View: "Region-wise OSA Performance - Tabular View",

  Platform_Distribution: "Platform Distribution",
  Location_Distribution: "Location Distribution",
  Product_Distribution: "Product Distribution",
  Competition_Analysis: "Competition Analysis",
  Competition_Distribution: "Competition Distribution",

  Keyword_Distribution: "Keyword Distribution",


  Geographical_Analysis: "Geographical Analysis",
  Comprehensive_Breakdown: "Comprehensive Breakdown",

  SOS_Analysis: "SOS Analysis",

  SOS_Performance_Overview: "SOS Analysis",
  Tabular_View: "Tabular View",
  Graph_Component: "Graph Component",
  Rank_Distribution: "Rank Distribution",

  Keyword_Analysis: "Keyword Analysis",


  PRO_Performance_Overview: "Promotions Performance Overview",
  PRO_Movers_and_Shakers: "Promotions Movers and Shakers",
  Region_Wise_PRO_Performance_Map: "Region-wise Promotions Performance - Map",
  Region_Wise_PRO_Performance_Tabular_View: "Region-wise Promotions Performance - Tabular View",

  Rating_Distribution: "Rating Distribution",

  Competition_Graphical_Analysis: "Competition Graphical Analysis",
  Wt_SOS_Configuration: "Wt. SOS Configuration",
  Global_Summary: "Global Summary",
  Global_Tabular_View: "Global Tabular View",

  BULK_ACTION: "BULK_ACTION",
  CLEAR_SELECTION: "CLEAR_SELECTION",
  ALERT: "ALERT",
  END_DATE: "END_DATE",
  POPUP: "POPUP",
  POP_OVER: "POP_OVER",
  DRAWER: "DRAWER",
  TABLE_INPUT: "TABLE_INPUT",
  CREATE_ALERT: "CREATE ALERT",
  STATUS_CHANGE: "STATUS_CHANGE",
  GRAPH_FILTER: "GRAPH_FILTER",
  CUSTOM_REPORT: "CUSTOM_REPORT",
  HEADER: "HEADER",
  TEMPLATE: "TEMPLATE",
  CARD: "CARD",
  EMAIL_LIST: "EMAIL_LIST",
  TABLE: "TABLE",
  FILTER: "FILTER",
  SCHEDULER: "SCHEDULER",
  CUSTOM_METRIC: "CUSTOM_METRIC",
  RIGHT_PANEL: "RIGHT_PANEL",
  DOWNLOAD_HISTORY: "DOWNLOAD_HISTORY",
  TABLE_ACCOUNT_DROPDOWN: "TABLE_ACCOUNT_DROPDOWN",
  TAG_REPORT: "TAG_REPORT",
  TAG_DRAWER: "TAG_DRAWER",
  TAG_DRAWER_TABLE: "TAG_DRAWER_TABLE",
  GRAPH: "GRAPH",
  DASHBOARD_FILTER: "DASHBOARD_FILTER",
  DASHBOARD_CARD: "DASHBOARD_CARD",
  NEGATIVE_KEYWORD: "NEGATIVE_KEYWORD",
  DAY_PARTING: "DAY_PARTING",
  SEARCH_TERM: "SEARCH_TERM",
  CONFIRMATION: "CONFIRMATION",
  TAG_MANAGER: "TAG_MANAGER",
  Competition_POPUP: "Competition POPUP",
  DATE_RANGE_PICKER: "DATE_RANGE_PICKER",
  FILTER_DRAWER: "FILTER_DRAWER",
  CLIENT_DROPDOWN: "CLIENT_DROPDOWN",
  QUICK_FILTER: "QUICK_FILTER",
  CALENDAR: "CALENDAR",
};

export const EVENTS = Object.freeze({
  CLICK: "CLICK",
  SORT: "SORT",
  TAB_SWITCH: "TAB_SWITCH",
  SWITCH: "SWITCH",
  INPUT: "INPUT",
  BUTTON_CLICK: "BUTTON_CLICK",
  NAVIGATE: "NAVIGATE",
  DROPDOWN_SELECT: "DROPDOWN_SELECT",
  MULTI_DROPDOWN_SELECT: "MULTI_DROPDOWN_SELECT",
  POPUP_OPEN: "POPUP_OPEN",
  POPUP_CLOSE: "POPUP_CLOSE",
  DRAWER_OPEN: "DRAWER_OPEN",
  DRAWER_CLOSE: "DRAWER_CLOSE",
  POP_OVER_OPEN: "POP_OVER_OPEN",
  POP_OVER_CLOSE: "POP_OVER_CLOSE",
  DOWNLOAD: "DOWNLOAD",
  ADD_TAGS: "ADD_TAGS",
  REMOVE_TAGS: "REMOVE_TAGS",
  VIEW_TAG: "VIEW_TAG",
  SEARCH: "SEARCH",
  DATE_CHANGE: "DATE_CHANGE",
  EXPAND: "EXPAND",
  COLLAPSE: "COLLAPSE",
  CHECKBOX: "CHECKBOX",
  SELECT_ALL: "SELECT_ALL",
  UNSELECT_ALL: "UNSELECT_ALL",
  TABLE_ROW_SELECT: "TABLE_ROW_SELECT",
  TABLE_ROW_DESELECT: "TABLE_ROW_DESELECT",
  RADIO: "RADIO",
  RADIO_CHANGE: "RADIO_CHANGE",
  TOGGLE_BUTTON: "TOGGLE_BUTTON",
  UPLOAD: "UPLOAD",
  REUPLOAD: "REUPLOAD",
  DOUBLE_CLICK: "DOUBLE_CLICK",
  COLUMN_REORDER: "COLUMN_REORDER",
  DOWNLOAD_HISTORY: "DOWNLOAD_HISTORY",
  COPY_TO_CLIPBOARD: "COPY_TO_CLIPBOARD",
  COLUMN_SIZE_RESET: "COLUMN_SIZE_RESET",
  ADD: "ADD",
  REMOVE: "REMOVE",
  WARNING: "WARNING",
  ERROR: "ERROR",
  DELETE: "DELETE",
  PAGINATE: "PAGINATE",
  CLEAR: "CLEAR",
  CLEAR_ALL: "CLEAR_ALL",
  APPLY: "APPLY",
  CANCEL: "CANCEL",
  SAVE: "SAVE",
  Drag_Start: "Drag_Start",
  Drag_End: "Drag_End",
  SCROLL: "SCROLL",
});

export const moduleMap = {
  dashboard: "dashboard",
  alert: "alert",
  tagManager: "tag_manager",
  product_tagReport: "product_tag_report",
  keyword_tagReport: "keyword_tag_report",
  product_alertReport: "product_alert_report",
  keyword_alertReport: "keyword_alert_report",
  buyBox: "buy_box",
  globalView: "global_view",
  pricingRuleEngine: "pricing_rule_engine",
  configuration: "configuration"
  // campaign: "campaign_manager",
  // dayparting: "day_parting",
  // negativekeyword: "negative_keyword",
  // searchterm: "search_term",
  // customreport: "custom_report",
  // customreport_downloadHistory: "download_history",
  // campaign_tagReport: "campaign_tag_report",
  // rules: "rules",
  // autotagging: "auto_tagging",
  // budgettrend: "budget_trend",
  // "budget-allocate": "budget_allocation",
  // "action-activity": "action_activity",
  // "rules-action-activity": "rules_action_activity",
  // metricanalyzer: "metric_analyzer",
};

export const trackerLinkInfo = {
  "/global-view": {
    module: moduleMap.globalView,
    page_name: moduleMap.globalView
  },
  "/dashboard": {
    module: moduleMap.dashboard,
    ...(Page_Data?.["OSA"] ?? {}),
  },
  "/ebux/reports/on_shelf_availability": {
    module: moduleMap.dashboard,
    ...(Page_Data?.["OSA"] ?? {}),
  },
  "/ebux/reports/share_of_search": {
    module: moduleMap.dashboard,
    ...(Page_Data?.["SOS"] ?? {}),
  },
  "/ebux/reports/weighted_share_of_search": {
    module: moduleMap.dashboard,
    ...(Page_Data?.["Wt_SOS"] ?? {}),
  },
  "/ebux/reports/organic_ranking": {
    module: moduleMap.dashboard,
    ...(Page_Data?.["OR"] ?? {}),
  },
  "/ebux/reports/content_score": {
    module: moduleMap.dashboard,
    ...(Page_Data?.["CS"] ?? {}),
  },
  "/ebux/reports/promotions": {
    module: moduleMap.dashboard,
    ...(Page_Data?.["PRO"] ?? {}),
  },
  "/ebux/reports/rating_reviews": {
    module: moduleMap.dashboard,
    ...(Page_Data?.["RR"] ?? {}),
  },
  "/ebux/reports/share_of_merchandise": {
    module: moduleMap.dashboard,
    ...(Page_Data?.["SOM"] ?? {}),
  },
  "/pricing-rule-engine": {
    module: moduleMap.pricingRuleEngine,
    page_name: moduleMap.pricingRuleEngine
  },
  "/configuration/buy-box-trends": {
    module: moduleMap.buyBox,
    page_name: moduleMap.buyBox
  },
  "/tagManager": {
    module: moduleMap.tagManager,
    page_name: moduleMap.tagManager
  },
  "/alert-control": {
    module: moduleMap.alert,
    page_name: moduleMap.alert
  },
  "/alert-control/create": {
    module: moduleMap.alert,
    page_name: "Alert Create"
  },
  "/alert-control/edit": {
    module: moduleMap.alert,
    page_name: "Alert Edit"
  },
  "/configuration": {
    module: moduleMap.configuration,
    page_name: "Configuration - Create Master"
  },
  "/configuration/content-score-configuration": {
    module: moduleMap.configuration,
    page_name: "Configuration - Content Score"
  },
  "/configuration/buy-box-seller-settings": {
    module: moduleMap.configuration,
    page_name: "Configuration - Buy Box Seller Settings"
  },
  "/weighted-sos": {
    module: moduleMap.configuration,
    page_name: "Configuration - Weighted SOS"
  }
}
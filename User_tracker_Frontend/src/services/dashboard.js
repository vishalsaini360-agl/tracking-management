import { _POST } from "./axios.method";
import { BASE_URL } from "../utils/url";

export const dashboardOverview = async (payload) => {
  return await _POST(BASE_URL + "flipkart/dashboard/summary", payload);
};
export const dashboardBlinkitOverview = async (payload) => {
  return await _POST(BASE_URL + "blinkit/dashboard/summary", payload);
};
export const dashboardAmazonOverview = async (payload) => {
  return await _POST(BASE_URL + "amazon/dashboard/summary", payload);
};
export const dashboardZeptoOverview = async (payload) => {
  return await _POST(BASE_URL + "zepto/dashboard/summary", payload);
};

export const dashboardGraph = async (payload) => {
  return await _POST(BASE_URL + "flipkart/dashboard/graph", payload);
};
export const dashboardlinkitGraph = async (payload) => {
  return await _POST(BASE_URL + "blinkit/dashboard/graph", payload);
};
export const dashboardzeptoGraph = async (payload) => {
  return await _POST(BASE_URL + "zepto/dashboard/graph", payload);
};
export const dashboardAmazonGraph = async (payload) => {
  return await _POST(BASE_URL + "amazon/dashboard/graph", payload);
};

export const commonScreenAMS = async (payload) => {
  return await _POST(BASE_URL + "commonscreen/amazonoverview", payload);
};

export const commonScreenFlipkart = async (payload) => {
  return await _POST(BASE_URL + "commonscreen/flipkartoverview", payload);
};

export const commonScreenBlinkit = async (payload) => {
  return await _POST(BASE_URL + "commonscreen/blinkitoverview", payload);
};

export const commonScreenZepto = async (payload) => {
  return await _POST(BASE_URL + "commonscreen/zeptooverview", payload);
};

export const commonScreenInstamart = async (payload) => {
  return await _POST(BASE_URL + "commonscreen/instamartoverview", payload);
};

export const metricAnalyzerAdgroup = async (payload) => {
  return await _POST(BASE_URL + "amazon/metric-analyzer/adgroup", payload);
};

export const metricAnalyzerAvgAdgroup = async (payload) => {
  return await _POST(BASE_URL + "amazon/metricanalyzer/valuecampaign", payload);
};

export const metricAnalyzerKeyword = async (payload) => {
  return await _POST(BASE_URL + "amazon/metric-analyzer/keyword", payload);
};

export const metricAnalyzerAvgKeyword = async (payload) => {
  return await _POST(BASE_URL + "amazon/metric-analyzer/valuekeyword", payload);
};

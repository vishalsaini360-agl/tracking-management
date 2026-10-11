import { EVENTS, TRACKING_COMPONENT, trackCustomEvent, moduleMap } from "../../../../../../tracker";

const defaultTrackerContext = {
  module: moduleMap.alert,
  page_name: "Alert Creation",
  page_url: typeof window !== "undefined" ? window.location.href : "",
  component_type: TRACKING_COMPONENT.CHECKBOX,
  widget_name: "Alert Scope",
};

export const trackFilterCheck = (filterName, option, isChecked, trackerContext) => {
  trackCustomEvent(
    EVENTS.CHECKBOX,
    {
      action: isChecked ? "uncheck_filter_item" : "check_filter_item",
      filter: filterName,
      label: option?.label || option?.name || option?.value || "",
      value: option?.value || option?.id || "",
      checked: !isChecked,
      component: TRACKING_COMPONENT.CHECKBOX,
    },
    "Scope Component",
    trackerContext || defaultTrackerContext
  );
};

export const trackFilterSelectAll = (filterName, allSelected, count, trackerContext) => {
  trackCustomEvent(
    allSelected ? EVENTS.UNSELECT_ALL : EVENTS.SELECT_ALL,
    {
      action: allSelected ? "unselect_all" : "select_all",
      filter: filterName,
      count: count || 0,
      component: TRACKING_COMPONENT.CHECKBOX,
    },
    "Scope Component",
    trackerContext || defaultTrackerContext
  );
};

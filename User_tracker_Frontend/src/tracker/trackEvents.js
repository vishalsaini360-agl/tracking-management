import { TRACKING_EVENTS, EVENTS, moduleMap, Page_Data, Tab_TYPE } from "./constants";
import { sanitizeEventPayload } from "./helpers";
import { tracker } from "./tracker";

export function getTrackerContext(kpi, tab_type, extra = {}) {
  return {
    module: moduleMap.dashboard,
    ...(Page_Data?.[kpi] ?? {}),
    tab: Tab_TYPE[tab_type] ?? Tab_TYPE.executive_summary,
    ...extra
  };
}

export function trackButtonClick(data = {}, entityType = "") {
  // eslint-disable-next-line no-console
  console.log(EVENTS.BUTTON_CLICK, data, entityType);
  tracker.track(EVENTS.BUTTON_CLICK, {
    eventData: JSON.stringify(data),
    entityType,
  });
}

export function trackDropdown(data = {}, entityType = "") {
  // eslint-disable-next-line no-console
  console.log(EVENTS.DROPDOWN_SELECT, data, entityType);
  tracker.track(EVENTS.DROPDOWN_SELECT, {
    eventData: JSON.stringify(data),
    entityType,
  });
}

export function trackFilterChange(eventType, data = {}, entityType = "") {
  // eslint-disable-next-line no-console
  console.log(eventType, data, entityType);
  tracker.track(eventType, {
    eventData: JSON.stringify(data),
    entityType,
  });
}

export function trackDateChange(data = {}, entityType = "") {
  // eslint-disable-next-line no-console
  console.log(EVENTS.DATE_CHANGE, data, entityType);
  tracker.track(EVENTS.DATE_CHANGE, {
    eventData: JSON.stringify(data),
    entityType,
  });
}

export function trackInputBlur(data = {}, entityType = "") {
  // eslint-disable-next-line no-console
  console.log(EVENTS.INPUT, data, entityType);
  tracker.track(EVENTS.INPUT, {
    eventData: JSON.stringify(data),
    entityType,
  });
}

export function trackSearch(data = {}, entityType = "") {
  // eslint-disable-next-line no-console
  console.log(EVENTS.SEARCH, data, entityType);
  tracker.track(EVENTS.SEARCH, {
    eventData: JSON.stringify(data),
    entityType,
  });
}

// export function trackScroll({
//   type,
//   value,
//   scrollPercent,
//   ...extraDetails
// } = {}) {
//   tracker.track(TRACKING_EVENTS.SCROLL, {
//     type,
//     value,
//     scrollPercent,
//     ...extraDetails,
//   });
// }


export function trackPageSwitch(
  trackerData = {
    //   module, // pass in trackerData //dashboard //alert
    //   page_name, pass in trackerData // OSA // SOS
    //   page_url, pass in trackerData 
    //   tab, pass in trackerData
    //   widget_name, pass in trackerData
    //   action_type, pass in trackerData
    //   component_type, pass in trackerData
  }) {
  const defaultTab = trackerData?.module === moduleMap.dashboard ? Tab_TYPE.executive_summary : "";
  const dataWithTab = {
    tab: defaultTab,
    ...trackerData,
  };
  // eslint-disable-next-line no-console
  console.log(TRACKING_EVENTS.PAGE_ENTER, { trackerData: dataWithTab });
  const cleanTrackerData = sanitizeEventPayload(dataWithTab);
  tracker.setContext(cleanTrackerData);
  tracker.track(TRACKING_EVENTS.PAGE_ENTER, {
    ...cleanTrackerData
  });
}
export function trackTabSwitch(data = {},
  trackerData = {
    //   module, // pass in trackerData //dashboard //alert
    //   page_name, pass in trackerData // OSA // SOS
    //   page_url, pass in trackerData 
    //   tab, pass in trackerData
    //   widget_name, pass in trackerData
    //   action_type, pass in trackerData
    //   component_type, pass in trackerData
  }) {
  // eslint-disable-next-line no-console
  console.log(EVENTS.TAB_SWITCH, data);
  const cleanTrackerData = sanitizeEventPayload(trackerData);
  tracker.setContext(cleanTrackerData);
  tracker.track(EVENTS.TAB_SWITCH, {
    // metadata: JSON.stringify(data),
    metadata: data,
    ...cleanTrackerData
  });
}


export function trackCustomEvent(eventType, data = {}, entityType = "",
  trackerData = {
    //   module, // pass in trackerData //dashboard //alert
    //   page_name, pass in trackerData // OSA // SOS
    //   page_url, pass in trackerData 
    //   tab, pass in trackerData
    //   widget_name, pass in trackerData
    //   action_type, pass in trackerData
    //   component_type, pass in trackerData
  }) {
  // eslint-disable-next-line no-console
  console.log(eventType, data, entityType);
  const cleanTrackerData = sanitizeEventPayload(trackerData);

  tracker.setContext({
    ...((cleanTrackerData?.module) ? { module: cleanTrackerData?.module } : {}),
    ...((cleanTrackerData?.page_name) ? { page_name: cleanTrackerData?.page_name } : {}),
    ...((cleanTrackerData?.page_url) ? { page_url: cleanTrackerData?.page_url } : {}),
    ...((cleanTrackerData?.tab) ? { tab: cleanTrackerData?.tab } : {})
  });

  const payload = sanitizeEventPayload({
    // metadata: JSON.stringify(data),
    metadata: data,
    entity_type: entityType,
    ...cleanTrackerData
  });

  tracker.track(eventType, payload);
}
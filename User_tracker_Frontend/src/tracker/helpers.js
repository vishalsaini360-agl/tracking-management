import { v4 as uuidv4, validate as uuidValidate } from "uuid";
import { SESSION_KEY, SESSION_START_TIME_KEY, trackerLinkInfo } from "./constants";

export function isLocalhost() {
  return false;
  // if (typeof window === "undefined" || !window.location) return false;
  // const hostname = window.location.hostname;
  // return Boolean(
  //   hostname === "localhost" ||
  //   hostname === "127.0.0.1" ||
  //   hostname === "[::1]" ||
  //   hostname.includes("localhost")
  // );
}

export function getSessionId() {
  let id = sessionStorage.getItem(SESSION_KEY);
  if (!id || !uuidValidate(id)) {
    id = uuidv4();
    sessionStorage.setItem(SESSION_KEY, id);
    sessionStorage.setItem(SESSION_START_TIME_KEY, new Date().toISOString());
  }
  return id;
}
export function getSessionStartTime() {
  let time = sessionStorage.getItem(SESSION_START_TIME_KEY);
  if (!time) {
    getSessionId();
    time = sessionStorage.getItem(SESSION_START_TIME_KEY);
  }
  return time;
}

export function generateEventId() {
  return uuidv4();
}


export function getModuleInfo(pathname) {
  if (trackerLinkInfo?.[pathname]) {
    return {
      ...trackerLinkInfo?.[pathname],
      page_url: pathname
    }
  }
  const pathArr = pathname.split("/");
  if (pathArr.length === 2) {
    return {
      // businessPlatform:
      //   pathArr[1] === "dashboard" || !pathArr[1] ? "home" : pathArr[1],
      module: "dashboard",
    };
  }
  // let modulePath = pathArr.slice(2).join("_");
  return {
    // businessPlatform: pathArr[1],
    // module: moduleMap[modulePath] || "Unknown",
  };
}


export function getDeviceInfo() {
  const ua = navigator.userAgent;

  let device_type = "Desktop";
  let browser = "Unknown";
  let operating_system = "Unknown";

  // Device type
  if (/Mobi|Android|iPhone|iPad|iPod/i.test(ua)) {
    device_type = /iPad|Tablet/i.test(ua) ? "Tablet" : "Mobile";
  }

  // Browser
  if (/Edg/i.test(ua)) {
    browser = "Edge";
  } else if (/Chrome/i.test(ua) && !/Edg/i.test(ua)) {
    browser = "Chrome";
  } else if (/Firefox/i.test(ua)) {
    browser = "Firefox";
  } else if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) {
    browser = "Safari";
  } else if (/MSIE|Trident/i.test(ua)) {
    browser = "Internet Explorer";
  } else if (/Opera|OPR/i.test(ua)) {
    browser = "Opera";
  }

  // Operating System
  if (/Windows NT/i.test(ua)) {
    operating_system = "Windows";
  } else if (/Android/i.test(ua)) {
    operating_system = "Android";
  } else if (/iPhone|iPad|iPod/i.test(ua)) {
    operating_system = "iOS";
  } else if (/Mac OS X/i.test(ua)) {
    operating_system = "macOS";
  } else if (/Linux/i.test(ua)) {
    operating_system = "Linux";
  }

  return {
    device_type,
    browser,
    operating_system
  };
}

export function formatEntityType(val) {
  if (val == null) return undefined;
  const str = String(val).trim();
  if (!str) return undefined;
  const formatted = str
    .replace(/[^a-zA-Z0-9_-]+/g, "_")
    .replace(/[-_]{2,}/g, "_")
    .replace(/^[-_]+|[-_]+$/g, "");
  return formatted || undefined;
}

export function sanitizeEventPayload(obj = {}) {
  const clean = { ...obj };
  delete clean.service;
  delete clean.client_id;
  delete clean.client_name;
  delete clean.user_id;
  delete clean.user_email;

  if (clean.dashboard_id != null) {
    clean.dashboard_id = String(clean.dashboard_id).slice(0, 128);
  }
  if (clean.dashboard_name != null) {
    clean.dashboard_name = String(clean.dashboard_name).slice(0, 128);
  }
  if (clean.event_id && !uuidValidate(clean.event_id)) {
    clean.event_id = uuidv4();
  }
  if (clean.session_id && !uuidValidate(clean.session_id)) {
    clean.session_id = getSessionId();
  }

  const rawEntityType = clean.entity_type ?? clean.entityType;
  delete clean.entityType;
  if (rawEntityType) {
    const formatted = formatEntityType(rawEntityType);
    if (formatted) {
      clean.entity_type = formatted;
    } else {
      delete clean.entity_type;
    }
  } else {
    delete clean.entity_type;
  }

  const rawComponentType = clean.component_type ?? clean.componentType ?? clean.component;
  delete clean.componentType;
  delete clean.component;
  if (rawComponentType) {
    const formatted = formatEntityType(rawComponentType);
    if (formatted) {
      clean.component_type = formatted;
    } else {
      delete clean.component_type;
    }
  } else {
    delete clean.component_type;
  }

  return clean;
}
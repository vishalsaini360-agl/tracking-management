import { Tracking_POST } from "../services/axios.method";
// import axiosInstance from "../services/axios.service";
import { APP_ENVIRONMENT } from "../utils/url";
import { EVENT_API_ENDPOINT, FLUSH_BATCH_SIZE, FLUSH_INTERVAL_MS } from "./constants";
import {
  generateEventId,
  getSessionId,
  getSessionStartTime,
  isLocalhost,
  sanitizeEventPayload,
} from "./helpers";

// It owns: the session id, the in-memory buffer, and sending events to the backend.
// useActivityTracker() (mounted once, at the root) keeps this updated as the user navigates. Any component, anywhere, can read it via getContext() when it manually tracks a CLICK/SCROLL, without needing to call a hook itself.

let buffer = [];
let sequenceNo = 0;
let flushTimer = null;

let currentContext = {
  environment: APP_ENVIRONMENT,
  pageFlowId: 0,
  // page: "",
  // businessPlatform: "",
  module: "",
};

function setContext(partial) {
  const cleanPartial = sanitizeEventPayload(partial);
  currentContext = { ...currentContext, ...cleanPartial };
}

function getContext() {
  return currentContext;
}



// ---------------------------------------------------------------------------
// track(): the ONE function every part of the app calls to record something.
// Example: track('CLICK', { element: { tag: 'button', text: 'Save' } })
// ---------------------------------------------------------------------------
function track(eventType, payload = {}) {
  const context = tracker.getContext();
  const event = sanitizeEventPayload({
    ...context,
    ...payload,
    event_id: generateEventId(),
    event_timestamp: new Date().toISOString(),
    session_id: getSessionId(),
    session_started_at: getSessionStartTime(),
    event_version: ++sequenceNo,
    event_type: eventType,
  });
  // {
  //   module, // pass from payload
  //   page_name, // pass from payload
  //   page_url, // pass from payload
  //   tab, // pass from payload
  //   widget_name, // pass from payload
  //   action_type, // pass from payload
  //   component_type, // pass from payload
  //   entity_type, // pass from payload
  //   metadata,    // pass from payload 
  // }

  // eslint-disable-next-line no-console
  console.log(
    `%c[ActivityTracker] ${eventType}`,
    "color: #1890FF; font-weight: bold; font-size: 11px;",
    event
  );

  if (isLocalhost()) return;

  buffer.push(event);

  if (buffer.length >= FLUSH_BATCH_SIZE) {
    flush(false);
  }
}

// ---------------------------------------------------------------------------
// flush(): sends whatever is currently buffered.
// useBeacon=true is used on tab close, because a normal fetch() call gets
// cancelled by the browser the moment the tab closes -- sendBeacon does not.
// ---------------------------------------------------------------------------
// eslint-disable-next-line no-unused-vars
function flush(useBeacon) {
  if (isLocalhost() || buffer.length === 0) return;

  const rawEvents = buffer.splice(0, buffer.length); // grab everything, empty the buffer
  const events = rawEvents.map((evt) => sanitizeEventPayload(evt));

  // eslint-disable-next-line no-console
  // console.log(events);
  const body = JSON.stringify({ events });

  if (useBeacon && navigator.sendBeacon) {
    navigator.sendBeacon(EVENT_API_ENDPOINT, body);
    return;
  }

  // axiosInstance.post(EVENT_API_ENDPOINT, {
  //   events: events,
  // }).catch(() => {
  //   // If sending failed (offline, server down), put the events back at the
  //   // front of the buffer so they go out with the next successful flush
  //   // instead of being lost.
  //   buffer.unshift(...events);
  // });
    const active_client_id = localStorage.getItem("client_id") ?? "";

  // console.log('EVENT_API_ENDPOINT',active_client?.client_project_id)
  //EVENT_API_ENDPOINT=`${EVENT_API_ENDPOINT}?clientId=${getContext()?.clientId}`
  Tracking_POST(`${EVENT_API_ENDPOINT}?clientId=${active_client_id}`, {
    events: events,
  }).catch(() => {
    // If sending failed (offline, server down), put the events back at the
    // front of the buffer so they go out with the next successful flush
    // instead of being lost.
    buffer.unshift(...events);
  });
}

function startFlushTimer() {
  if (isLocalhost()) return;
  if (flushTimer) return; // don't start it twice
  flushTimer = setInterval(() => flush(false), FLUSH_INTERVAL_MS);
}

function stopFlushTimer() {
  clearInterval(flushTimer);
  flushTimer = null;
}

export const tracker = {
  track,
  flush,
  startFlushTimer,
  stopFlushTimer,
  getSessionId,
  setContext,
  getContext,
};
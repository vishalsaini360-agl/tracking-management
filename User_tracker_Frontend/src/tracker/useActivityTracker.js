import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { tracker } from "./tracker";
import { TRACKING_EVENTS } from "./constants";
import { getDeviceInfo, getModuleInfo } from "./helpers";

// It handles the automatic lifecycle events: SESSION_START, PAGE_ENTER,
// PAGE_EXIT, PAGE_VISIBLE, PAGE_HIDDEN.
// It also keeps tracker.setContext() updated with the current page info.

export function useActivityTracker(userInfo) {
  const location = useLocation();
  const pageFlowIdRef = useRef(0); // increments every time the user visits a new screen
  const enterTimeRef = useRef(null); // when the current screen was entered
  const hiddenSinceRef = useRef(null);
  const hiddenMsRef = useRef(0); // how long the tab was hidden during this screen visit
  const prevPageInfoRef = useRef(null); // Remembers which page/module we were JUST on to remember which page we left when route changes.

  // 1) SESSION_START once when the app first mounts, and start the flush timer.
  useEffect(() => {
    const newPageInfo = getModuleInfo(location.pathname);
    const newDeviceInfo = getDeviceInfo();
    console.log('newDeviceInfonewDeviceInfo',newDeviceInfo)

    tracker.setContext({
      ...userInfo,
      ...newDeviceInfo,
      tab: newPageInfo?.tab ?? "",
      ...newPageInfo,
      pageFlowId: pageFlowIdRef.current,
      // page: location.pathname,
      // businessPlatform: newPageInfo.businessPlatform,
      // module: newPageInfo.module,
    });
    tracker.track(TRACKING_EVENTS.SESSION_START);
    tracker.startFlushTimer();

    // Flush events on tab close using sendBeacon
    const handleUnload = () => {
      tracker.track(TRACKING_EVENTS.SESSION_END);
      tracker.flush(true);
    };
    window.addEventListener("beforeunload", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleUnload);
      tracker.stopFlushTimer();
    };
  }, []);

  // 2) PAGE_EXIT (for the old page) + PAGE_ENTER (for the new page)
  //    every time the route changes.
  useEffect(() => {
    const newPageInfo = getModuleInfo(location.pathname);

    // If previous page info is available, track PAGE_EXIT
    if (enterTimeRef.current && prevPageInfoRef.current) {
      const activeMs = Date.now() - enterTimeRef.current - hiddenMsRef.current;
      tracker.track(TRACKING_EVENTS.PAGE_EXIT, {
        pageFlowId: pageFlowIdRef.current,
        ...newPageInfo,
        // page: prevPageInfoRef.current.page,
        // businessPlatform: prevPageInfoRef.current.businessPlatform,
        // module: prevPageInfoRef.current.module,
        timeSpentMs: Math.max(0, activeMs), // never negative
      });
    }

    pageFlowIdRef.current += 1;
    enterTimeRef.current = Date.now();
    hiddenMsRef.current = 0;

    tracker.track(TRACKING_EVENTS.PAGE_ENTER, {
      pageFlowId: pageFlowIdRef.current,
      tab: newPageInfo?.tab ?? "",
      ...newPageInfo,
      // page: location.pathname,
      // businessPlatform: newPageInfo.businessPlatform,
      // module: newPageInfo.module,
    });

    // Update the context for manual tracking
    tracker.setContext({
      pageFlowId: pageFlowIdRef.current,
      tab: newPageInfo?.tab ?? "",
      ...newPageInfo,
      // page: location.pathname,
      // businessPlatform: newPageInfo.businessPlatform,
      // module: newPageInfo.module,
    });

    // Remember this page for the next route change to correctly label its PAGE_EXIT.
    prevPageInfoRef.current = { page: location.pathname, ...newPageInfo };
  }, [location.pathname]);

  // 3) Pause the "time spent" clock while the tab is in the background.
  // Without this, leaving a tab open overnight would count as active time.
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        hiddenSinceRef.current = Date.now();
        tracker.track(TRACKING_EVENTS.PAGE_HIDDEN, {
          pageFlowId: pageFlowIdRef.current,
        });
      } else {
        if (hiddenSinceRef.current) {
          const gap = Date.now() - hiddenSinceRef.current;
          // cap any single "hidden" gap at 5 minutes so a tab left open for
          // days doesn't wipe out the time-spent number when it's reopened
          hiddenMsRef.current += Math.min(gap, 5 * 60 * 1000);
          hiddenSinceRef.current = null;
        }
        tracker.track(TRACKING_EVENTS.PAGE_VISIBLE, {
          pageFlowId: pageFlowIdRef.current,
        });
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibility);
  }, []);
}
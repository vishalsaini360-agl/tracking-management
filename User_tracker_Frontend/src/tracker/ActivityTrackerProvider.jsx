import { isLocalhost } from "./helpers";
import { useActivityTracker } from "./useActivityTracker";
import { safeJsonParse } from "../utils/helpers";

const ActivityTrackerConsumer = () => {
  const activeClientProject = safeJsonParse(localStorage.getItem("active_client_project"), {});
  const dashboardId =
    activeClientProject?.client_project_id != null
      ? String(activeClientProject.client_project_id).slice(0, 128)
      : undefined;
  const dashboardName =
    activeClientProject?.client_project_name != null
      ? String(activeClientProject.client_project_name).slice(0, 128)
      : undefined;

  useActivityTracker({
    ...(dashboardId != null ? { dashboard_id: dashboardId } : {}),
    ...(dashboardName != null ? { dashboard_name: dashboardName } : {}),
  });

  return null;
};

const ActivityTrackerProvider = () => {
  if (isLocalhost()) {
    return null;
  }
  return <ActivityTrackerConsumer />;
};

export default ActivityTrackerProvider;
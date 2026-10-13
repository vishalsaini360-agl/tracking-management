import axios from "axios";
import { STATUS_CODES } from "../utils/constants";
import { BASE_URL, Tracking_API_BASE_URL } from "../utils/url";
import STORE from "../redux/store";
import { setLoading } from "../redux/action-creator/commonAction";

let activeRequests = 0;

const onRequestStart = (config) => {
  const urlStr = String(config?.url || "");
  const isBackground =
    Boolean(config?.hideLoader) ||
    urlStr.includes("events/batch") ||
    urlStr.includes("tracking") ||
    urlStr.includes("refreshToken") ||
    urlStr.includes("notification");

  if (!isBackground) {
    activeRequests++;
    if (activeRequests === 1) {
      try {
        STORE.dispatch(setLoading(true));
      } catch (e) {
        // ignore
      }
    }
    return true;
  }
  return false;
};

const onRequestEnd = (wasTracked) => {
  if (wasTracked) {
    activeRequests = Math.max(0, activeRequests - 1);
    if (activeRequests === 0) {
      try {
        STORE.dispatch(setLoading(false));
      } catch (e) {
        // ignore
      }
    }
  }
};

const createAxiosInstance = (baseURL) => {
  const instance = axios.create({
    baseURL,
    validateStatus: (status) => status < STATUS_CODES.INTERNAL_ERROR,
  });

  instance.interceptors.request.use(
    (config) => {
      config._tracked = onRequestStart(config);
      const searchParams = new URLSearchParams(window.location.search);

      const url = new URL(config.url, baseURL);
      const pathname = url.pathname.split("/").pop();
      const isEventsBatch =
        url.pathname.includes("events/batch") ||
        Boolean(config.url && config.url.includes("events/batch"));

      config.headers = config.headers || {};

      // -------------------------
      // Authentication
      // -------------------------
      const token =
        searchParams.get("id_token") ??
        localStorage.getItem("id_token") ??
        sessionStorage.getItem("id_token");

      const accessToken =
        searchParams.get("access_token") ??
        localStorage.getItem("access_token");

      if (accessToken) {
        config.headers.Authorization = accessToken;
      }

      if (token) {
        config.headers.idtoken = token;
      }

      // -------------------------
      // Active Client Project
      // -------------------------
      const activeClientProject = localStorage.getItem(
        "active_client_project"
      );

      if (
        activeClientProject &&
        pathname !== "getApplicationsNew" &&
        pathname !== "refreshToken"
      ) {
        let project = {};

        try {
          project = JSON.parse(activeClientProject);
        } catch (error) {
          console.error(
            "Invalid active_client_project:",
            error
          );
        }

        if (project?.client_project_id) {
          config.headers["X-DSM-Client-ID"] =
            project.client_project_id;
        }

        if (project?.isUseWidget && !isEventsBatch) {
          config.headers["X-DSM-Client-WIDGET"] =
            project.isUseWidget;
        }

        if (project?.client_project_es_id) {
          config.headers["X-DSM-Client-ES-ID"] =
            project.client_project_es_id;
        }

        if (project?.cms_client_code) {
          config.headers["client-code"] =
            project.cms_client_code;

          config.headers["client-country"] =
            project.cms_client_country ??
            project.country ??
            "";
        }
      }

      if (isEventsBatch && config.headers) {
        [
          "X-DSM-Client-WIDGET",
          "x-dsm-client-widget",
          "x-dsm-client-es-id",
          "client-country",
          "client-code",
        ].forEach((header) => {
          if (typeof config.headers.delete === "function") {
            config.headers.delete(header);
          } else {
            delete config.headers[header];
          }
        });
      }

      return config;
    },
    (error) => {
      onRequestEnd(error?.config?._tracked);
      return Promise.reject(error);
    }
  );

  instance.interceptors.response.use(
    (response) => {
      onRequestEnd(response?.config?._tracked);
      return response;
    },
    (error) => {
      onRequestEnd(error?.config?._tracked);
      return Promise.reject(error);
    }
  );

  return instance;
};

const axiosInstance = createAxiosInstance(BASE_URL);

export const axiosInstanceTracking =
  createAxiosInstance(Tracking_API_BASE_URL);

export default axiosInstance;



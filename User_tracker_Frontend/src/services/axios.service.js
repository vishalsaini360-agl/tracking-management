import axios from "axios";
import { STATUS_CODES } from "../utils/constants";
import { BASE_URL, Tracking_API_BASE_URL } from "../utils/url";


// const axiosInstance = axios.create({
//   baseURL: BASE_URL,
//   validateStatus: function (status) {
//     return status < STATUS_CODES.INTERNAL_ERROR;
//   },
// });

// const errHandling = (error) => Promise.reject(error);

// const reqHandling = async (config) => {
//   const searchParams = new URLSearchParams(window.location.search);

//   const url = new URL(config.url, BASE_URL); // Ensure absolute URL
//   const pathname = url.pathname.split("/").pop(); // Extract last segment
//   const obj = { ...config };
//   if (localStorage.getItem("token")) {
//     const token =
//       // localStorage.getItem("token") || sessionStorage.getItem("token");
//       searchParams.get("id_token") ?? (localStorage.getItem("id_token") || sessionStorage.getItem("id_token"));

//     const access_token = searchParams.get("access_token") ?? localStorage.getItem("access_token");
//     // const client_id = localStorage.getItem("client_id");
//     obj.headers.Authorization = access_token;
//     // obj.headers.id_token = token;
//     obj.headers.idtoken = token;
//   }
//   if (localStorage.getItem("active_client_project") && (pathname !== "getApplicationsNew") && (pathname !== "refreshToken")) {
//     const active_client_project = JSON.parse(localStorage.getItem("active_client_project") ?? "{}")
//     obj.headers["X-DSM-Client-ID"] = active_client_project?.client_project_id;
//     if (active_client_project?.isUseWidget) {
//       obj.headers["X-DSM-Client-WIDGET"] = active_client_project?.isUseWidget;
//     }
//     if (active_client_project?.client_project_es_id) {
//       obj.headers["X-DSM-Client-ES-ID"] = active_client_project?.client_project_es_id;
//     }
//     if (active_client_project?.cms_client_code) {
//       obj.headers["client-code"] = active_client_project?.cms_client_code;
//       obj.headers["client-country"] = active_client_project?.cms_client_country ?? active_client_project?.country ?? "";
//     }
//   }
//   // if(localStorage.getItem("client_id")){
//   //   obj.headers["clientId"] = localStorage.getItem("client_id");
//   // }



//   return obj;
// };

// const resHandling = (response) => response;
// axiosInstance.interceptors.request.use(reqHandling, errHandling);
// axiosInstance.interceptors.response.use(resHandling, errHandling);
// export default axiosInstance;

const createAxiosInstance = (baseURL) => {
  const instance = axios.create({
    baseURL,
    validateStatus: (status) => status < STATUS_CODES.INTERNAL_ERROR,
  });

  instance.interceptors.request.use(
    (config) => {
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

      // if (isEventsBatch) {
      //   if (typeof config.headers?.delete === "function") {
      //     config.headers.delete("X-DSM-Client-WIDGET");
      //     config.headers.delete("x-dsm-client-widget");
      //     config.headers.delete("x-dsm-client-es-id");
      //   }
      //   delete config.headers["X-DSM-Client-WIDGET"];
      //   delete config.headers["x-dsm-client-widget"];
      //   delete config.headers["x-dsm-client-es-id"];
      // }
      if (isEventsBatch && config.headers) {
        ["X-DSM-Client-WIDGET", "x-dsm-client-widget", "x-dsm-client-es-id","client-country","client-code"]
          .forEach((header) => config.headers.delete(header));
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  instance.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(error)
  );

  return instance;
};

const axiosInstance = createAxiosInstance(BASE_URL);

export const axiosInstanceTracking =
  createAxiosInstance(Tracking_API_BASE_URL);

export default axiosInstance;



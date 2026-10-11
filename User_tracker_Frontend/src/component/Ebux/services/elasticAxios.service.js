import axios from "axios";
import { STATUS_CODES } from "../../../utils/constants";
import { Ebux_credentials, Ebux_Elastic_BASE_URL } from "../../../utils/elastic_env";

const elsticAxiosInstance = axios.create({
  baseURL: Ebux_Elastic_BASE_URL,
  validateStatus: function (status) {
    return status < STATUS_CODES.INTERNAL_ERROR;
  },
});

const errHandling = (error) => Promise.reject(error);

const reqHandling = async (config) => {
  const obj = { ...config };
    // obj.headers["'Access-Control-Allow-Origin'"] = "*";
    obj.headers.Authorization = `Basic ${Ebux_credentials}`;
  return obj;
};

const resHandling = (response) => response;
elsticAxiosInstance.interceptors.request.use(reqHandling, errHandling);
elsticAxiosInstance.interceptors.response.use(resHandling, errHandling);

export default elsticAxiosInstance;

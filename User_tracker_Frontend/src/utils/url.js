export const APP_ENVIRONMENT = process.env.REACT_APP_ENVIRONMENT || "development";
export const Tracking_API_BASE_URL = process.env.REACT_APP_Tracking_API_BASE_URL;
export const REACT_APP_Tracking_API_ENDPOINT = process.env.REACT_APP_Tracking_API_ENDPOINT;


// export const BASE_URL = "http://localhost:5000/api/"; //local
export const BASE_URL = process.env.REACT_APP_BASE_URL; //dev
// export const BASE_URL = "https://apigateway-dev-ds.e-genie.ai/"; //dev
// export const BASE_URL = "https://api-qa-ds.e-genie.ai/api/"; //QA
// export const BASE_URL = "https://api-uat-ds.e-genie.ai/api/"; //UAT
// export const BASE_URL = "https://api-ds.e-genie.ai/api/"; //live/production

export const ENV_MODE = process.env.REACT_APP_ENV || process.env.NODE_ENV || "development";



export const SOCKET_URL = process.env.REACT_APP_SOCKET_URL; //development
// export const SOCKET_URL = "http://3.7.198.131:5000"; //development


export const IDENTITY_MODULE_BASE_URL = process.env.REACT_APP_IDENTITY_MODULE_BASE_URL;//dev
// export const IDENTITY_MODULE_BASE_URL = "https://dev-api.e-genie.ai/api/";//dev
export const ONECOMMERCE_URL = process.env.REACT_APP_ONECOMMERCE_URL;//dev
export const ONECOMMERCE_LOGIN_URL = process.env.REACT_APP_ONECOMMERCE_LOGIN_URL;//dev


export const PROJECT_CONFIGURATION_BASE_URL = process.env.REACT_APP_PROJECT_CONFIGURATION_BASE_URL;//dev
// export const MASTER_CMS_CONFIGURATION_BASE_URL = "http://localhost:4200/api/v1";//dev
export const MASTER_CMS_CONFIGURATION_BASE_URL = process.env.REACT_APP_MASTER_CMS_CONFIGURATION_BASE_URL;//dev
// export const MASTER_CMS_CONFIGURATION_BASE_URL = "https://configuration-uat-api.e-genie.ai/api/v1";//dev



// export const IDENTITY_MODULE_BASE_URL = "https://qa-api.e-genie.ai/api/";//QA
// export const ONECOMMERCE_URL = "https://qa.e-genie.ai/";//QA
// export const ONECOMMERCE_LOGIN_URL = "https://qa.e-genie.ai/logout";//QA


// export const IDENTITY_MODULE_BASE_URL = "https://uat-api.e-genie.ai/api/";//UAT
// export const ONECOMMERCE_URL = "https://uat.e-genie.ai/";//UAT
// export const ONECOMMERCE_LOGIN_URL = "https://uat.e-genie.ai/logout";//UAT


// export const IDENTITY_MODULE_BASE_URL = "https://api.e-genie.ai/api/";//production
// export const ONECOMMERCE_URL = "https://app.e-genie.ai/";//production
// export const ONECOMMERCE_LOGIN_URL = "https://app.e-genie.ai/logout";//production

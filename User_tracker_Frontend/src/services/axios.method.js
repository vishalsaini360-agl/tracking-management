import { ONECOMMERCE_LOGIN_URL } from "../utils/url";
import Axios, { axiosInstanceTracking } from "./axios.service";


export async function Tracking_POST(url, requestData, headers = {}) {
  try {
    await axiosInstanceTracking.post(url, requestData, headers);

  } catch (error) {
    return error;
  }
}

export async function _GET2(url) {
  try {
    const response = await Axios.get(url, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("id_token");
      localStorage.removeItem("access_token");
      localStorage.removeItem("token");
      window.location.href = ONECOMMERCE_LOGIN_URL;
      throw {
        error: response.statusText,
      };
    }

    return response;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    return error;
  }
}


export async function _GET(url) {
  try {
    const response = await Axios.get(url, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    // if unverified token is provided, remove that token from the local storage
    if (response.status === 401 || response.status === 403) {
      localStorage.removeItem("token");
      localStorage.removeItem("id_token");
      localStorage.removeItem("access_token");
      localStorage.removeItem("token");
      window.location.href = ONECOMMERCE_LOGIN_URL;
      throw {
        error: response.statusText,
      };
    }

    return response;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    return error;
  }
}

export async function _GETWIthToken(url) {
  try {
    let id_token = localStorage.getItem("id_token");
    let client_id = localStorage.getItem("client_id");
    const response = await Axios.get(`${url}?clientId=${client_id}`, {
      headers: {
        "Content-Type": "application/json",
        idtoken: id_token
      },
    });

    // if unverified token is provided, remove that token from the local storage
    if (response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("id_token");
      localStorage.removeItem("access_token");
      localStorage.removeItem("token");
      window.location.href = ONECOMMERCE_LOGIN_URL;
      throw {
        error: response.statusText,
      };
    }

    return response;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    return error;
  }
}

// const requestControllerMap = new Map();
// const cancelRequest = (key) => {
//   if (requestControllerMap.has(key)) {
//     console.log(`Cancelling request for key: ${key}`);

//     const controller = requestControllerMap.get(key);
//     controller.abort();
//   }
// }
// const removeRequest = (key) => {
//   if (requestControllerMap.has(key)) {      
//     console.log(`deleting request for key: ${key}`);  
//     requestControllerMap.delete(key);
//   }
// }

export async function _POST(url, requestData, headers = {}) {
  // const key = url;
  // cancelRequest(key);
  // const controller = new AbortController();
  // requestControllerMap.set(key, controller);
  try {
    const response = await Axios.post(url, requestData, headers);
    // const response = await Axios.post(url, requestData, {...headers, signal: controller.signal});

    // removeRequest(key);
    if (response.status === 401 || response.status === 403) {
      localStorage.removeItem("token");
      localStorage.removeItem("id_token");
      localStorage.removeItem("access_token");
      localStorage.removeItem("token");
      window.location.href = ONECOMMERCE_LOGIN_URL;
      throw {
        error: response.statusText,
      };
    }
    return response;
  } catch (error) {
    // removeRequest(key);
    return error;
  } finally {
    // removeRequest(key);
  }
}

export async function _PATCH(url, requestData) {
  try {
    const response = await Axios.patch(url, requestData);
    if (response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("id_token");
      localStorage.removeItem("access_token");
      localStorage.removeItem("token");
      window.location.href = ONECOMMERCE_LOGIN_URL;
      throw {
        error: response.statusText,
      };
    }
    return response;
  } catch (error) {
    return error;
  }
}

export async function _PUT(url, requestData) {
  try {
    const response = await Axios.put(url, requestData);
    if (response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("id_token");
      localStorage.removeItem("access_token");
      localStorage.removeItem("token");
      window.location.href = ONECOMMERCE_LOGIN_URL;
      throw {
        error: response.statusText,
      };
    }
    return response;
  } catch (error) {
    return error;
  }
}

export async function _DELETE(url) {
  try {
    const response = await Axios.delete(url);
    if (response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("id_token");
      localStorage.removeItem("access_token");
      localStorage.removeItem("token");
      window.location.href = ONECOMMERCE_LOGIN_URL;
      throw {
        error: response.statusText,
      };
    }
    return response;
  } catch (error) {
    return error;
  }
}
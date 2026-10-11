import Axios from "./elasticAxios.service";

export async function _GET(url,
  headers={
    headers: {
      // "Content-Type": "application/json;charset=UTF-8",
      // "Access-Control-Allow-Origin": "*",
    },
  }
  ) {
  try {
    const response = await Axios.get(url,headers );

    // if unverified token is provided, remove that token from the local storage
    if (response.status === 401) {
      localStorage.removeItem("token");
      // redirect the user to the login page
      window.location.href = "/";
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

export async function _POST(url, requestData, headers) {
  try {
    const response = await Axios.post(url, requestData, headers);
    if (response.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/";
      throw {
        error: response.statusText,
      };
    }
    return response;
  } catch (error) {
    return error;
  }
}





import { _DELETE, _GET, _POST } from "../../../../../services/axios.method";
import { BASE_URL, IDENTITY_MODULE_BASE_URL } from "../../../../../utils/url";

export const fetchPreviewData = async (payload = {}) => {
  try {
    let clientId = localStorage.getItem("client_id");
    const response = await _POST(`${BASE_URL}ebux/preview-alert?clientId=${clientId}`, payload, {
      'Content-Type': 'application/json'
    });
    return response?.data?.data?.rowData ?? {};
  } catch (error) {
    return {};
  }
}

export const saveAlert = async (payload = {}) => {
  try {
    let clientId = localStorage.getItem("client_id");
    const response = await _POST(`${BASE_URL}ebux/create-alert?clientId=${clientId}`, payload, {
      'Content-Type': 'application/json'
    });
    return response?.data ?? {};
  } catch (error) {
    return { status: false, message: error.message };
  }
}



export const fetchAlertList = async (search = "", sort = "", filters, page = 1, limit) => {
  try {
    let clientId = localStorage.getItem("client_id");
    //const url = `${BASE_URL}ebux/alert-list?clientId=${clientId}&search=${search}&sort=${sort}`;
    const url =
      `${BASE_URL}ebux/alert-list?clientId=${clientId}` +
      `&search=${search}` +
      `&sort=${sort}` +
      `&page=${page}` +
      `&limit=${limit}` +
      `&filters=${encodeURIComponent(JSON.stringify(filters))}`;
    console.log("API URL:", url);
    const response = await _GET(url, {
      'Content-Type': 'application/json'
    });

    return response?.data ?? {};
  } catch (error) {
    return { status: false, message: error.message };
  }
};

export const editAlert = async (payload = {}) => {
  try {
    let clientId = localStorage.getItem("client_id");
    const response = await _POST(`${BASE_URL}ebux/update-alert?clientId=${clientId}`, payload, {
      'Content-Type': 'application/json'
    });
    return response?.data ?? {};
  } catch (error) {
    return { status: false, message: error.message };
  }
}


export const deleteAlert = async (id) => {
  try {

    const response = await _DELETE(`${BASE_URL}ebux/alerts/${id}`, {
      'Content-Type': 'application/json'
    });

    console.log("Deleted:", response.data);

    fetchAlertList();
    return response?.data ?? {};
  } catch (error) {
    return { status: false, message: error.message };
  }
};


export const bulkDeleteAlert = async (ids) => {
  try {

    const response = await _POST(
      `${BASE_URL}ebux/alerts/bulk-delete`,
      { ids: ids }
    );

    return response?.data ?? {};

  } catch (error) {
    console.error("Bulk delete failed:", error.response?.data || error.message);
    return { status: false, message: error.message };
  }
};


export const duplicateAlert = async (id) => {
  try {


    const response = await _POST(`${BASE_URL}ebux/alerts/duplicate/${id}`);
    return response?.data ?? {};

  } catch (error) {
    console.error("duplicate failed:", error.response?.data || error.message);
    return { status: false, message: error.message };
  }
};

export const bulkDuplicateAlert = async (ids) => {
  try {

    const response = await _POST(
      `${BASE_URL}ebux/alerts/bulk-duplicate`,
      { ids: ids }
    );

    return response?.data ?? {};

  } catch (error) {
    console.error("Bulk duplicate failed:", error.response?.data || error.message);
    return { status: false, message: error.message };
  }
};



export const getAlertEmail = async () => {
  try {
    let clientId = localStorage.getItem("client_id") || "100";
    const response = await _GET(`${IDENTITY_MODULE_BASE_URL}user/getUserListNew?clientId=${clientId}`, {}, {
      'Content-Type': 'application/json'
    });
    return response?.data ?? {};
  } catch (error) {
    return { status: false, message: error.message };
  }
}


export const updateAlertStatus = async (payload = {}) => {
  try {
    let clientId = localStorage.getItem("client_id");
    const response = await _POST(`${BASE_URL}ebux/alerts/update-alert-status?clientId=${clientId}`, payload, {
      'Content-Type': 'application/json'
    });
    return response?.data ?? {};
  } catch (error) {
    return { status: false, message: error.message };
  }
}

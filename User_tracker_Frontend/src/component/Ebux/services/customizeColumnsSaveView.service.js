import { _POST } from "../../../services/axios.method";
import { BASE_URL } from "../../../utils/url";

  export const getCustomizeColumnsSaveViews = async (kpi, tabName) => {
    try {
        
        const payload = {kpi, tabName}

        let clientId = localStorage.getItem("client_id");
        const response = await _POST(`${BASE_URL}ebux/customize-columns-save-view/get-all-views?clientId=${clientId}`, payload, {
            'Content-Type': 'application/json'
        });

        return response?.data?.data ?? [];

    } catch (error) {
        return [];
    }
}

 export const getCustomizeColumnDefaultView = async (kpi, tabName) => {
    try {
        
        const payload = {kpi, tabName}

        let clientId = localStorage.getItem("client_id");
        const response = await _POST(`${BASE_URL}ebux/customize-columns-save-view/get-default-views?clientId=${clientId}`, payload, {
            'Content-Type': 'application/json'
        });

        return response?.data?.data ?? [];

    } catch (error) {
        return [];
    }
}

  
  export const saveCustomizeColumnsView = async (view) => {
    try {
        
        const payload = {view}

        let clientId = localStorage.getItem("client_id");
        const response = await _POST(`${BASE_URL}ebux/customize-columns-save-view/save-view?clientId=${clientId}`, payload, {
            'Content-Type': 'application/json'
        });

        return response?.data?.data ?? [];

    } catch (error) {
        return [];
    }
}
export const deleteCustomizeColumnsSaveView = async (id) => {
    try {
        
        const payload = {id}

        let clientId = localStorage.getItem("client_id");
        const response = await _POST(`${BASE_URL}ebux/customize-columns-save-view/delete-view?clientId=${clientId}`, payload, {
            'Content-Type': 'application/json'
        });

        return response?.data?.data ?? [];

    } catch (error) {
        return [];
    }
}

export const setDefaultCustomizeColumnsView = async (id, kpi, tabName) => {
    try {
        const payload = { id, kpi, tabName };

        let clientId = localStorage.getItem("client_id");

        const response = await _POST(
            `${BASE_URL}ebux/customize-columns-save-view/set-default?clientId=${clientId}`,
            payload,
            { "Content-Type": "application/json" }
        );

        return response?.data?.data ?? [];

    } catch (error) {
        return [];
    }
};

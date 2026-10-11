import { _POST } from "../../../../../services/axios.method";
import { BASE_URL } from "../../../../../utils/url";

  export const getAllSaveDateRanges = async () => {
    try {
        
        // const savedDateRanges = JSON.parse(localStorage.getItem("savedDateRanges")) || [];
        // return savedDateRanges;

        //-------------------------------//
        const payload = {}

        let clientId = localStorage.getItem("client_id");
        const response = await _POST(`${BASE_URL}ebux/save-date-ranges/get-all?clientId=${clientId}`, payload, {
            'Content-Type': 'application/json'
        });

        return response?.data?.data ?? [];

    } catch (error) {
        return [];
    }
}
  
  export const saveNewDateRange = async (newRange) => {
    try {
        // const savedDateRanges = JSON.parse(localStorage.getItem("savedDateRanges")) || [];
        // if(!newRange?.label||savedDateRanges.filter(i=>i?.label==newRange?.label).length) return false;
        // localStorage.setItem("savedDateRanges", JSON.stringify([...savedDateRanges, newRange]));
        // return true;

        //-------------------------------//
        const payload = {newRange}

        let clientId = localStorage.getItem("client_id");
        const response = await _POST(`${BASE_URL}ebux/save-date-range/save-new?clientId=${clientId}`, payload, {
            'Content-Type': 'application/json'
        });

        return response?.data?.data?.success ??true;

    } catch (error) {
        return false;
    }
}
export const deleteSaveDateRange = async (id) => {
    try {
        // if (id === undefined || id === null) return false;
        // if (id < 0) return false;        
        // const savedDateRanges = await JSON.parse(localStorage.getItem("savedDateRanges")) || [];
        // const newRange = await savedDateRanges.filter((_, index) => index !== id);
        // localStorage.setItem("savedDateRanges", JSON.stringify([...newRange]));
        // return true;

        //-------------------------------//
        const payload = {id}

        let clientId = localStorage.getItem("client_id");
        const response =  await _POST(`${BASE_URL}ebux/save-date-range/delete?clientId=${clientId}`, payload, {
            'Content-Type': 'application/json'
        });
        
        return response?.data?.data?.success ??true;

    } catch (error) {
        return false;
    }
}
import { _POST } from "../../../services/axios.method";
import { BASE_URL } from "../../../utils/url";
export const keywordCloudData = async (selectedFilters, selectedPlatform) => {
    try {

        const payload = {selectedFilters, selectedPlatform}


        // const response = await _POST(`${BASE_URL}ebux/keyword-cloud`, payload, {
        //     'Content-Type': 'application/json'
        // });
        let clientId = localStorage.getItem("client_id");
        const response = await _POST(`${BASE_URL}ebux/keyword-cloud?clientId=${clientId}`, payload, {
            'Content-Type': 'application/json'
        });



        return response?.data?.data ?? [];
    } catch (error) {
        return {};
    }
}
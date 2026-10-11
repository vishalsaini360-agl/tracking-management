import { _POST } from "../../../services/axios.method";
import { BASE_URL } from "../../../utils/url";

export const get_consecutive_out_of_stock_products= async (payload = {}) => {

  try {
    let id_token= localStorage.getItem("id_token");
    let clientId = localStorage.getItem("client_id");
    const response = await _POST(`${BASE_URL}ebux/oos-widgets/fetch-consecutive-out-of-stock-products?clientId=${clientId}`, payload,
    {
      headers: {
        idtoken:id_token
      },
    }
  );
    return response?.data?.data ?? [];
  } catch (error) {
    return [];
  }
};
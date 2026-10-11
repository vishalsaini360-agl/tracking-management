import { _GET } from "../services/axios.method";
import { setLoading } from "../redux/action-creator/commonAction";
import { GET_ACCOUNTS } from "./constants";

export const AccountNames = async (accounts) => {
  try {
    setLoading(true);

    const result = await _GET(GET_ACCOUNTS);
    const data = result.data.data.result;
    accounts = data.map((item) => ({
      label: item._id.account,
      value: item._id.account,
      account_id: item._id.account_id,
      platform_id: item._id.platform_id,
    }));
    return accounts;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
};

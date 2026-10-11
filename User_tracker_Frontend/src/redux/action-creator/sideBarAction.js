import { _POST } from "../../services/axios.method";
import { WALLET_BALANCE } from "../../utils/constants";
import ActionType from "../types";




export const firstcollapse = (state) => async (dispatch) => {
  try {
    dispatch({
      type: ActionType.FIRSTCOLLASPSE,
      payload: state,
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
  }
};

export const collapse = (state) => async (dispatch) => {
  try {
    dispatch({
      type: ActionType.COLLAPSE,
      payload: state,
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
  }
};
export const getWallletBalance = (payload) => async (dispatch) => {
  try {
    const res = await _POST(WALLET_BALANCE, {
      account: payload,
    });
  
    dispatch({
      type: ActionType.WALLETBALANCE,
      payload: res?.data?.data?.data,
    });

    dispatch({
      type: ActionType.DATASYNCTIME,
      payload: res?.data?.data?.time,
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
  }
};

/* eslint-disable no-console */
import React, { useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { _POST } from "../../services/axios.method";
import { APPLICATION_ROUTES, TOKEN_LOGIN_API_URL } from "../../utils/constants";
// import { postPlatormData } from "../../redux/action-creator/platformAction";
import { checkIsLoggedIn } from "../../redux/action-creator/authCreator";
import { useDispatch } from "react-redux";
import { useClientPermission } from "../../context/ClientPermissionContext";
import { useEbuxContext } from "../Ebux/Context/EbuxProvider";
import Login from "./index";

const TokenLogin = () => {
  const { setActiveClientProject } = useEbuxContext();
  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);
  const history = useHistory();
  const dispatch = useDispatch();

  const { setClientPermission } = useClientPermission(null);

  const client_id = searchParams.get("client_id");
  const id_token = searchParams.get("id_token");
  const access_token = searchParams.get("access_token");
  const refresh_token = searchParams.get("refresh_token");

  const hasSSOParams = Boolean(client_id && (id_token || access_token));

  useEffect(() => {
    if (!hasSSOParams) {
      const existingToken = localStorage.getItem("token");
      if (existingToken) {
        history.push(APPLICATION_ROUTES.COMMONSCREEN);
      }
      return;
    }

    (async () => {
      try {
        if (id_token) localStorage.setItem("id_token", id_token);
        if (access_token) localStorage.setItem("access_token", access_token);
        if (refresh_token) localStorage.setItem("refresh_token", refresh_token);

        const response = await _POST(
          `${TOKEN_LOGIN_API_URL}?client_id=${client_id}`,
          {
            client_id,
            token: id_token,
          },
          {
            headers: {
              idtoken: id_token,
              Authorization: `${access_token}`,
            },
          }
        );
console.log('response?.data?', response?.data?.status);
        const statusCode = response?.data?.status?.code;

        if (statusCode == 200) {
          const rawData = response?.data?.data?.data || {};

          const clients = rawData?.clients || [];
          setClientPermission(clients);
          localStorage.setItem(
            "clientPermission",
            JSON.stringify(clients)
          );

          const token = rawData?.data;
          const client_id = rawData?.client_id;
          const client_name = rawData?.client_name;
          const userDetails = rawData?.userName;
          const client_id_val = rawData?.client_id || client_id;
          const user_id = rawData?.user_id;
          const role = rawData?.role || "admin";
          const appids = rawData?.appids || [];
          const client_projects = rawData?.client_projects || [];
          const active_client_project =
            rawData?.active_client_project || {};
          const full_name = rawData?.full_name || userDetails;

          // if (platform) {
          //   dispatch(postPlatormData(platform));
          // }

          localStorage.setItem("token", token);
          localStorage.setItem("name", userDetails || "");
          localStorage.setItem("full_name", full_name || "");
          // if (currency) localStorage.setItem("currency", currency);
          // if (currency_format)
            // localStorage.setItem("currency_format", currency_format);
          localStorage.setItem("client_id", client_id_val || "");
          localStorage.setItem("client_name", client_name || "");
          localStorage.setItem("user_id", user_id || "");
          localStorage.setItem(
            "client_projects",
            JSON.stringify(client_projects)
          );
          localStorage.setItem(
            "active_client_project",
            JSON.stringify(active_client_project)
          );
          setActiveClientProject(active_client_project);

          // localStorage.setItem(
          //   "platforms",
          //   JSON.stringify(platform ? { platform } : {})
          // );
          localStorage.setItem("role", role);
          if (id_token) localStorage.setItem("im_token", id_token);
          if (access_token)
            localStorage.setItem("access_token", access_token);
          if (rawData?.email) localStorage.setItem("email", rawData.email);
          localStorage.setItem("appids", JSON.stringify(appids));

          dispatch(checkIsLoggedIn());
          history.push(APPLICATION_ROUTES.COMMONSCREEN);
        } else {
          console.error("TokenLogin error status:", statusCode, response);
        }
      } catch (error) {
        console.error("TokenLogin error:", error);
      }
    })();
  }, [hasSSOParams, client_id, id_token, access_token, refresh_token, dispatch, history, setActiveClientProject, setClientPermission]);

  if (!hasSSOParams) {
    return <Login />;
  }

  return (
    <div className="w-full h-screen grid justify-items-stretch align-middle">
      <img
        className="w-1/6 justify-self-center inline-block align-middle mt-48 "
        src="/assets/images/egenie.gif"
        alt="loader"
      />
    </div>
  );
};

export default TokenLogin;

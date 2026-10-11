/* eslint-disable no-console */
import React, { useContext, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { _POST } from "../../services/axios.method";
import { APPLICATION_ROUTES, TOKEN_LOGIN_API_URL } from "../../utils/constants";
import { postPlatormData } from "../../redux/action-creator/platformAction";
import { useDispatch } from "react-redux";
import { setUserProperty } from "../../analytics/EventController";
import { AuthContext } from "../../context/authContext";
import { useClientPermission } from "../../context/ClientPermissionContext";
import { useEbuxContext } from "../Ebux/Context/EbuxProvider";
//import { ConnectedOverlayScrollHandler } from "primereact/utils";

const TokenLogin = () => {
  const { setActiveClientProject } = useEbuxContext()
  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);
  const history = useHistory();
  const dispatch = useDispatch();
  const authContext = useContext(AuthContext);

  const { setClientPermission } = useClientPermission(null);

  useEffect(() => {
    (async () => {
      try {
        // const im_token = searchParams.get("token");
        const client_id = searchParams.get("client_id");
        const id_token = searchParams.get("id_token");
        const access_token = searchParams.get("access_token");
        const refresh_token = searchParams.get("refresh_token");

        if (!id_token || !access_token || !refresh_token || !client_id) {
          // history.push("/");
          return;
        }

        localStorage.setItem("id_token", id_token);
        localStorage.setItem("access_token", access_token);
        localStorage.setItem("refresh_token", refresh_token);

        let response = await _POST(
          // TOKEN_LOGIN_API_URL,
          `${TOKEN_LOGIN_API_URL}?client_id=${client_id}`,
          {
            // email,
            // token: im_token,
            client_id,
            token: id_token,
          },
          {
            headers: {
              idtoken: id_token,
              // clientId : client_id,
              Authorization: `${access_token}`,
            },
          }
        );
        if (response.data?.status?.code == 200) {
          setClientPermission(response?.data?.data?.data?.clients)
          localStorage.setItem('clientPermission', JSON.stringify(response?.data?.data?.data?.clients));
          const token = response?.data?.data?.data?.data;
          const platform = response?.data?.data?.data?.allPlatforms;
          const currency = response?.data?.data?.data?.currency;
          const currency_format = response?.data?.data?.data?.currency_format;
          const client_name = response?.data?.data?.data?.client_name;
          const userDetails = response?.data?.data?.data?.userName;
          const client_id = response?.data?.data?.data?.client_id;
          const user_id = response?.data?.data?.data?.user_id;
          const role = response?.data?.data?.data?.role;
          const appids = response?.data?.data?.data?.appids;
          const client_projects = response?.data?.data?.data?.client_projects;
          const active_client_project = response?.data?.data?.data?.active_client_project;
          const full_name = response?.data?.data?.data?.full_name;

          if (platform) {
            dispatch(postPlatormData(platform));
          }

          localStorage.setItem("token", token);
          localStorage.setItem("name", userDetails);
          localStorage.setItem("full_name", full_name);
          localStorage.setItem("currency", currency);
          localStorage.setItem("currency_format", currency_format);
          localStorage.setItem("client_id", client_id);
          localStorage.setItem("client_name", client_name);
          localStorage.setItem("user_id", user_id);
          localStorage.setItem("client_projects", JSON.stringify(client_projects));
          localStorage.setItem("active_client_project", JSON.stringify(active_client_project));
          setActiveClientProject(active_client_project)

          localStorage.setItem(
            "platforms",
            JSON.stringify({ platform: platform })
          );
          localStorage.setItem("role", role);
          // localStorage.setItem("im_token", im_token);
          localStorage.setItem("im_token", id_token);
          localStorage.setItem("access_token", access_token);
          // localStorage.setItem("id_token", id_token);
          // localStorage.setItem("email", email);
          localStorage.setItem("email", response?.data?.data?.data?.email);
          localStorage.setItem("appids", JSON.stringify(appids));

          setUserProperty(); //Firebase event to set client.
          await authContext.onLogin(token, true, userDetails);
          history.push(APPLICATION_ROUTES.COMMONSCREEN);
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log("error", error);
        history.push("/");
      }
    })();
  }, []);

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

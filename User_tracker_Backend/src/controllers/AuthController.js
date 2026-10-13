const resLib = require("./../lib/response");
const { sendResponse } = resLib;
const jwt = require("jsonwebtoken");
const axios = require("axios");
const uuid = require("uuid");
const constants = require("./../constants/constants");
const { All_Client_Project_List } = require("../configs/ds_all_customize_columns_comprehensive_breakdown.config");

const filterProjectsByClients = (clientsList, projectsList, disableDarkstore) => {
  // Extract clientIds from clients array
  const clientIds = clientsList.map((client) => client.clientId);

  // Filter projects that match any of the clientIds
  return projectsList.filter(
    (project) =>
      clientIds.includes(project.one_commerce_client_id) &&
      !disableDarkstore.includes(project.client_project_id)
  );
};

class AuthController {
  async internalLogin(req, res) {
    try {
      const decodedToken = req.user;
      let active_client_project = req.active_client_project;

      if (
        !decodedToken ||
        !decodedToken.email ||
        (!decodedToken["custom:features"] && !decodedToken["custom:product"])
      ) {
        return sendResponse(
          constants.response_code.UNAUTHORIZED,
          "invalid id_token new ",
          {},
          res,
          {}
        );
      }

      let resuleData = {};
      let appData = {};
      let getClientAppRole = JSON.parse(decodedToken["custom:feature"]);
      let getCreatedUserDetail = JSON.parse(decodedToken["custom:product"]);
      let disableDarkstore = [];
      if (getCreatedUserDetail["disableDarkstore"]) {
        if (getCreatedUserDetail["disableDarkstore"].length > 0) {
          disableDarkstore = getCreatedUserDetail["disableDarkstore"];
        }
      }

      let filteredData = getClientAppRole.clientAppRole.filter(
        (client) => client.clientId == req.body.client_id
      );

      if (filteredData.length > 0) {
        appData = filteredData[0].appRoleAccess.map((app) => ({
          appId: parseInt(app.appId, 10),
        }));

        let appRoleAccess = filteredData[0].appRoleAccess.filter(
          (app) => app.appId == 1
        );

        if (appRoleAccess.length > 0) {
          resuleData.role = appRoleAccess[0].roleName;
        }
      }

      const clientsWithAppId1 = getClientAppRole?.clientAppRole?.filter((client) =>
        client.appRoleAccess.some((role) => role.appId == "1")
      );

      if (!resuleData.role) {
        return sendResponse(
          constants.response_code.UNAUTHORIZED,
          "invalid id_token role",
          {},
          res,
          {}
        );
      }

      const client_projects = filterProjectsByClients(
        clientsWithAppId1,
        All_Client_Project_List,
        disableDarkstore
      );

      const _active_client_project =
        client_projects?.filter((i) => i.default)?.[0] ??
        client_projects?.[0] ??
        {};
      if (!active_client_project?.default && _active_client_project?.default) {
        active_client_project = _active_client_project;
      }

      resuleData.client_id = filteredData[0].clientId;
      resuleData.client_name = filteredData[0].clientName;
      resuleData.email = decodedToken.email;
      resuleData.full_name = `${getCreatedUserDetail.firstName} ${getCreatedUserDetail.middleName} ${getCreatedUserDetail.lastName}`;
      resuleData.userName = decodedToken.name;
      resuleData.data = req.headers?.idtoken || req.headers?.Idtoken;
      resuleData.user_id = getCreatedUserDetail.id;
      resuleData.appids = appData;
      resuleData.clients = clientsWithAppId1;
      resuleData.active_client_project = active_client_project;
      resuleData.client_projects = client_projects;
      resuleData.disableDarkstore = disableDarkstore;

      const apiUrl = `${process.env.IDENTITY_MODULE_BASE_URL}api/user/getUserByEmailAndClient?clientId=${req.body.client_id}&email=${decodedToken.email}`;
      const headers = {
        idToken: req.headers?.idtoken || req.headers?.Idtoken,
      };

      try {
        let allPlatforms = [];
        const apiResponse = await axios.get(apiUrl, { headers });
        const userData = apiResponse.data;
        if (
          userData &&
          userData.data &&
          userData.data.clientsAppPlateformAccess &&
          Array.isArray(userData.data.clientsAppPlateformAccess.clientPlateformAccess)
        ) {
          userData.data.clientsAppPlateformAccess.clientPlateformAccess.forEach((client) => {
            if (client.appPalteformAccess && Array.isArray(client.appPalteformAccess)) {
              client.appPalteformAccess.forEach((app) => {
                if (app.plateform && Array.isArray(app.plateform)) {
                  app.plateform.forEach((platform) => {
                    if (
                      platform.plateformName &&
                      !allPlatforms.includes(platform.plateformName)
                    ) {
                      allPlatforms.push(platform.plateformName);
                    }
                  });
                }
              });
            }
          });

          resuleData.allPlatforms = allPlatforms;
        } else {
          console.error("Invalid or missing clientPlatformAccess data");
        }
      } catch (error) {
        console.error("API call failed:", error.message);
      }

      return sendResponse(
        constants.response_code.SUCCESS,
        "Login succexxxxss",
        {
          data: resuleData,
        },
        res,
        { apiUrl }
      );
    } catch (e) {
      console.error(e.message, e);
      return sendResponse(constants.response_code.BAD_REQUEST, "", {}, res, {});
    }
  }

  async logoutForEgine(req, res) {
    try {
      if (req.headers) {
        delete req.headers.authorization;
      }
      return sendResponse(
        constants.response_code.SUCCESS,
        "logout successfully",
        {},
        res,
        {}
      );
    } catch (e) {
      console.error(e.message, e);
      return sendResponse(constants.response_code.BAD_REQUEST, "", {}, res, {});
    }
  }

  async logout(req, res) {
    try {
      const url =
        process.env.IDENTITY_MODULE_BASE_URL + "api/user/verifyTokenbyemail";

      // verify token
      const response = await axios.post(url, {
        email: req.body.email,
        refresh_token: req.body.refresh_token,
      });

      const id_token = response.data?.data?.id_token;

      if (!id_token) {
        return resLib.sendResponse(
          constants.response_code.BAD_REQUEST,
          "",
          {},
          res,
          {}
        );
      }

      const decodedToken = jwt.decode(id_token);

      if (!decodedToken || !decodedToken.email) {
        return sendResponse(
          constants.response_code.BAD_REQUEST,
          "invalid id_token",
          {},
          res,
          {}
        );
      }

      return sendResponse(
        constants.response_code.SUCCESS,
        "logout successfully",
        {},
        res,
        {}
      );
    } catch (e) {
      console.error(e.message, e);
      return sendResponse(constants.response_code.BAD_REQUEST, "", {}, res, {});
    }
  }
}

module.exports = new AuthController();

const jwt = require("jsonwebtoken");
const resLib = require("../lib/response");
const constants = require("../constants/constants");
const { jwtDecode } = require("jwt-decode");
const { PROD_CLIENT_INDEX, DEV_CLIENT_INDEX } = require("../configs/elastic_search_index.config");
const { All_Client_Project_List } = require("../configs/ds_all_customize_columns_comprehensive_breakdown.config");
const { SECRET_KEY_JWT } = process.env;

const filterByClientId = (clientId) => {
  return All_Client_Project_List.filter((project) => project.one_commerce_client_id == clientId);
};

const authorize = async (req, res, next) => {
  try {
    if (req.headers?.authorization) {
      req.user = jwt.verify(req.headers.authorization, SECRET_KEY_JWT);
      if (process.env.KEY && req.user.key && req.user.key != process.env.KEY) {
        delete req.headers.authorization;
        return resLib.sendResponse(
          constants.response_code.UNAUTHORIZED,
          "",
          {},
          res,
          {}
        );
      }
      req.token = req.headers.authorization;
      return next();
    } else {
      delete req.headers?.authorization;
      return resLib.sendResponse(
        constants.response_code.UNAUTHORIZED,
        "",
        {},
        res,
        {}
      );
    }
  } catch (e) {
    console.error(e);
    delete req.headers?.authorization;
    return resLib.sendResponse(
      constants.response_code.UNAUTHORIZED,
      "",
      {},
      res,
      {}
    );
  }
};

const authorizeNewBeforLogin = async (req, res, next) => {
  try {
    const idToken = req.headers?.Idtoken || req.headers?.idtoken;
    let { client_id } = req.query;

    if (!idToken || !client_id) {
      return res.status(400).json({ error: "UnAuthorize Request" });
    }

    const decoded = jwtDecode(idToken);
    if (decoded.exp) {
      const currentTime = Math.floor(Date.now() / 1000);
      if (decoded.exp < currentTime) {
        return res.status(401).json({ error: "Un-Authorize Request" });
      }
    } else {
      return res.status(400).json({ error: "UnAuthorize Request 2" });
    }

    const filteredProjects = filterByClientId(client_id);
    if (filteredProjects.length === 0 || filteredProjects?.[0]?.client_project_id == null) {
      return res.status(400).json({ error: "Unauthorized Request: Client Not Found" });
    }

    const clientIndex = (process.env.MODE === "production") ? PROD_CLIENT_INDEX : DEV_CLIENT_INDEX;
    let filteredData = clientIndex.filter((client) => {
      return client.client_id == filteredProjects?.[0]?.client_project_id;
    });

    const active_client_project = filteredProjects?.filter((i) => i?.default)?.[0] ?? filteredProjects?.[0];

    if (filteredData[0]) {
      req.user = decoded;
      req.index = filteredData[0];
      req.active_client_project = active_client_project;
      req.elstic_indexs = filteredData[0];
      return next();
    } else {
      return res.status(400).json({ error: "Unauthorized Request: Client Not Found" });
    }
  } catch (e) {
    console.error(e);
    return res.status(401).json({ error: "UnAuthorize Request 3" });
  }
};

module.exports = {
  authorize,
  authorizeNewBeforLogin,
  authorizeNew: (req, res, next) => next(),
  byPassAuthorizeNew: (req, res, next) => next(),
  verifyRequest: (req, res, next) => next(),
  decodeToken: (token) => jwtDecode(token),
};

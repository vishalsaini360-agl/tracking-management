// function for authentication for API access
const jwt = require("jsonwebtoken");
const resLib = require("./../lib/response");
const constants = require("./../constants/constants");
const { logger } = require("./logger");
psdb = require("../configs/postgres.config");
const qb = require("../helpers/QueryBuilder");
const config = require("../../config");
const { validationMiddleware } = require("./joiValidation");
const schemaMapping = require("../schemas/schemasMapping");
const env = process.env.MODE;
const dbConfig = config[env];
const { SECRET_KEY_JWT } = process.env;
const { Op } = require("sequelize");
const { jwtDecode } = require("jwt-decode");
const { PROD_CLIENT_INDEX, DEV_CLIENT_INDEX } = require("../configs/elastic_search_index.config");
const { All_Client_Project_List } = require("../configs/ds_all_customize_columns_comprehensive_breakdown.config");

const { CognitoJwtVerifier } = require("aws-jwt-verify");
const Verifier = require('verify-cognito-token');
const AWS = require("aws-sdk");



const verifyRequest = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    // console.log("Auth Header:", authHeader);

    if (!authHeader)
      return resLib.sendResponse(
        constants.response_code.BAD_REQUEST,
        "no token found",
        {},
        res,
        true
      );

    const decoded = jwt.verify(authHeader, process.env.UPDATE_PASSWORD, {
      algorithms: ["HS256"],
    });
    const { client_id, user_id } = decoded;
    req["client_id"] = client_id;
    req["user_id"] = user_id;
    next();
  } catch (error) {
    // console.log("error>>>>>>>>>", error);
    return resLib.sendResponse(
      constants.response_code.BAD_REQUEST,
      "invalid token",
      {},
      res,
      true
    );
  }
};

const authorize = async (req, res, next) => {
  try {
    if (req.headers?.authorization) {
      req.user = jwt.verify(req.headers?.authorization, SECRET_KEY_JWT);
      req.db = req.user.db;
      if (req.user.key != process.env.KEY || !req.user.key) {
        delete req.headers?.authorization;
        return resLib.sendResponse(
          constants.response_code.UNAUTHORIZED,
          "",
          {},
          res,
          {}
        );
      }
      if (process.env.WILD_CARD === req.user.user_id) {
        req.psdb = psdb[req.db];
        qb.setDB(psdb[req.db]);
        req.token = req.headers?.authorization;
        return next();
      }
      // console.log(req.user, "emailllllll");
      let user_info = await psdb[process.env.COMMON_DB].users_info.findOne({
        attributes: { exclude: ["password"] },
        where: { email: req.user.email, is_verified: 1, status: 1 },
        raw: true,
      });

      if (user_info.token_validation_key !== req.user.token_validation_key) {
        delete req.headers?.authorization;
        return resLib.sendResponse(
          constants.response_code.UNAUTHORIZED,
          "",
          {},
          res,
          {}
        );
      }

      // console.log()
      // if (user.status != 1) {
      //   console.log("debugerrrr user.status 2", user.status);
      //   delete req.headers?.authorization;
      //   return resLib.sendResponse(
      //     constants.response_code.UNAUTHORIZED,
      //     "",
      //     {},
      //     res,
      //     {}
      //   );
      // }
      if (user_info === null) {
        delete req.headers?.authorization;
        return resLib.sendResponse(
          constants.response_code.UNAUTHORIZED,
          "",
          {},
          res,
          {}
        );
      }
      req.psdb = psdb[req.db];
      req.user.user_info = user_info;

      qb.setDB(psdb[req.db]);
      req.token = req.headers?.authorization;
      logger(req);
      if (schemaMapping.mapping[req.path]) {
        //console.log("inside");
        await validationMiddleware(
          req,
          res,
          next,
          schemaMapping.mapping[req.path]
        );
      } else {
        return next();
      }
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
    return resLib.sendResponse(
      constants.response_code.UNAUTHORIZED,
      "",
      {},
      res,
      {}
    );
  }
};

const filterByClientId = (clientId) => {
  // console.log('clientId2', clientId)
  return All_Client_Project_List.filter(project => project.one_commerce_client_id == clientId);
};



// Initialize Cognito verifiers dynamically if environment variables are provided
let cognitoAccessVerifier = null;
let cognitoIdVerifier = null;
let cognitoClient = null;

if (process.env.COGNITO_USER_POOL_ID) {
  try {
    cognitoAccessVerifier = CognitoJwtVerifier.create({
      userPoolId: process.env.COGNITO_USER_POOL_ID,
      tokenUse: "access",
      clientId: process.env.COGNITO_CLIENT_ID || null,
    });
    cognitoIdVerifier = CognitoJwtVerifier.create({
      userPoolId: process.env.COGNITO_USER_POOL_ID,
      tokenUse: "id",
      clientId: process.env.COGNITO_CLIENT_ID || null,
    });
    if (process.env.COGNITO_REGION) {
      cognitoClient = new AWS.CognitoIdentityServiceProvider({
        region: process.env.COGNITO_REGION,
        credentials: {
          accessKeyId: process.env.ACCESS_KEY_ID,
          secretAccessKey: process.env.SECRET_ACCESS_KEY,
        }
      });
    }
  } catch (err) {
    console.error("Error initializing CognitoJwtVerifier:", err);
  }
}

// In-memory cache for token validity status to prevent Cognito rate limits
const tokenCache = new Map();
const CACHE_TTL = 10 * 1000; // 10 seconds

/**
 * Validates Cognito Access Token or ID Token.
 * 1. Checks if token exists.
 * 2. Uses aws-jwt-verify (if COGNITO_USER_POOL_ID is configured) for JWKS RSA signature & expiration verification.
 * 3. Fallbacks to decoding payload and checking expiration (`exp`) timestamp.
 */
const validateCognitoToken = async (token) => {
  // console.log(`Validating ${expectedTokenType} token...`);
  if (!token) {
    return { valid: false, expired: false, error: 'Token missing' };
  }

  if (cognitoAccessVerifier) {
    try {
      const payload = await cognitoAccessVerifier.verify(token);
      // console.log('payloadpayloadpayload', payload)

      if (cognitoClient) {
        const now = Date.now();
        const cached = tokenCache.get(token);

        if (cached && cached.expiresAt > now) {
          if (!cached.valid) {
            return { valid: false, expired: cached.expired, error: cached.error };
          }
        } else {
          try {
            await cognitoClient.getUser({ AccessToken: token }).promise();
            tokenCache.set(token, { valid: true, expiresAt: now + CACHE_TTL });
          } catch (cognitoErr) {
            console.error("Cognito online token validation failed (revoked/logged out):", cognitoErr.message);
            const isRevokedOrExpired = cognitoErr.code === "NotAuthorizedException";
            const errorMsg = cognitoErr.message || 'Token is invalid or has been revoked';

            tokenCache.set(token, {
              valid: false,
              expired: isRevokedOrExpired && cognitoErr.message?.toLowerCase().includes("expired"),
              error: errorMsg,
              expiresAt: now + CACHE_TTL
            });

            return {
              valid: false,
              expired: isRevokedOrExpired && cognitoErr.message?.toLowerCase().includes("expired"),
              error: errorMsg,
            };
          }
        }
      }

      return { valid: true, expired: false, decoded: payload };
    } catch (err) {
      console.error("Cognito JWT verifier error:", err.message);
      const isExpired = err.message?.toLowerCase().includes("expired") || err.name === "JwtExpiredError";
      return {
        valid: false,
        expired: isExpired,
        error: isExpired ? 'Token has expired' : err.message,
      };
    }
  }
};

const authorizeNewBeforLogin = async (req, res, next) => {
  try {

    const idToken = req.headers?.Idtoken || req.headers?.idtoken;
    // const client_id =  req.headers?.clientId || req.headers?.clientId
    let { client_id } = req.query;
    // const x_dsm_client_id =  req.headers?.['X-dsm-client-id'] || req.headers?.['x-dsm-client-id']
    if (!idToken || !client_id) {
      return res.status(400).json({ error: 'UnAuthorize Request' });
    }

    const decoded = jwtDecode(idToken); // Decode the token
    if (decoded.exp) {
      const currentTime = Math.floor(Date.now() / 1000); // Get current time in seconds
      if (decoded.exp < currentTime) {
        return res.status(401).json({ error: 'Un-Authorize Request' });
      }
    } else {
      return res.status(400).json({ error: 'UnAuthorize Request 2' });
    }

    // let {client_id} = req.query;
    const filteredProjects = filterByClientId(client_id);
    // console.log('filteredProjects', filteredProjects)
    if (filteredProjects.length == 0 || filteredProjects?.[0]?.client_project_id == null) {
      return res.status(400).json({ error: 'Unauthorized Request: Client Not Foundeeee' });
    }

    // const clientIndex = (process.env.MODE == "production")? PROD_CLIENT_INDEX : DEV_CLIENT_INDEX;
    // let filteredData = clientIndex.filter(client => {
    //   console.log(client.client_id, "==", client_id); // Log each comparison
    //   return client.client_id == client_id; // Perform the filtering
    // });

    const clientIndex = (process.env.MODE == "production") ? PROD_CLIENT_INDEX : DEV_CLIENT_INDEX;
    let filteredData = clientIndex.filter(client => {
      // console.log(client.client_id, "==", filteredProjects?.[0]?.client_project_id); // Log each comparison
      // return client.client_id == filteredProjects?.[0]?.client_project_id; // Perform the filtering

      // console.log(client.one_commerce_client_id, "==", client_id); // Log each comparison
      return client.client_id == filteredProjects?.[0]?.client_project_id; // Perform the filtering
    });
    const active_client_project = (filteredProjects?.filter(i => i?.default)?.[0]) ?? filteredProjects?.[0];
    // console.log('clientssssssss-1', active_client_project)
    if (filteredData[0]) {
      req.user = decoded;
      req.index = filteredData[0]
      req.active_client_project = active_client_project;
      req.elstic_indexs = filteredData[0]
      return next();
    } else {
      return res.status(400).json({ error: 'Unauthorized Request: Client Not Foundkkk' });
    }

  } catch (e) {
    console.error(e);
    return res.status(401).json({ error: 'UnAuthorize Request 3' });
  }
};
const authorizeNew = async (req, res, next) => {
  try {

    const idToken = req.headers?.Idtoken || req.headers?.idtoken || req.headers?.['id-token'];
    const accessToken = req.headers?.authorization || req.headers?.['authorization'] || req.headers?.Authorization;

    let { clientId } = req.query;
    const x_dsm_client_id = req.headers?.['X-dsm-client-id'] || req.headers?.['x-dsm-client-id'];
    const ES_client_id = req.headers?.['x-dsm-client-es-id'] ?? null;

    const tokenToCheck = accessToken && idToken;

    if (!tokenToCheck) {
      return res.status(401).json({
        status: false,
        error: 'Unauthorized',
        message: 'Access token or ID token is required',
        code: 'TOKEN_MISSING'
      });
    }

    // Check Access Token if provided
    if (accessToken) {
      const accessResult = await validateCognitoToken(accessToken);
      // console.log('accessResultaccessResult',accessResult)
      if (accessResult.expired) {
        return res.status(401).json({
          status: false,
          error: 'Token Expired',
          message: 'Access token has expired. Please log in again.',
          code: 'TOKEN_EXPIRED'
        });
      }
      if (!accessResult.valid) {
        return res.status(401).json({
          status: false,
          error: 'Unauthorized',
          message: 'Invalid access token',
          code: 'TOKEN_INVALID'
        });
      }
    }

    const params = {
      region: process.env.COGNITO_REGION,
      userPoolId: process.env.COGNITO_USER_POOL_ID,
      debug: true,
    };

    const claims = {
      aud: process.env.COGNITO_CLIENT_ID,
      // email_verified: true, 
      auth_time: (time) => time <= Math.floor(Date.now() / 1000),
      // 'cognito:groups': (groups: any) => groups.includes('Admins'), 
    };

    const verifier = new Verifier(params, claims);

    // Verify the token
    verifier
      .verify(idToken)
      .then((result) => {
        // console.log('resultresultresult', result)
        if (result) {

          const decoded = jwtDecode(idToken); // Decode the token
          if (decoded.exp) {
            const currentTime = Math.floor(Date.now() / 1000); // Get current time in seconds
            if (decoded.exp < currentTime) {
              return res.status(401).json({ error: 'Un-Authorize Request' });
            }
          } else {
            return res.status(400).json({ error: 'UnAuthorize Request 2' });
          }

          // let {client_id} = req.query;
          const filteredProjects = filterByClientId(clientId);
          // console.log('filteredProjects', filteredProjects)
          if (filteredProjects.length == 0 || filteredProjects?.[0]?.client_project_id == null) {
            return res.status(400).json({ error: 'Unauthorized Request: Client Not Found' });
          }

          // const clientIndex = (process.env.MODE == "production")? PROD_CLIENT_INDEX : DEV_CLIENT_INDEX;
          // let filteredData = clientIndex.filter(client => {
          //   console.log(client.client_id, "==", client_id); // Log each comparison
          //   return client.client_id == client_id; // Perform the filtering
          // });

          const clientIndex = (process.env.MODE == "production") ? PROD_CLIENT_INDEX : DEV_CLIENT_INDEX;
          let filteredData = clientIndex.filter(client => {
            // console.log(client.client_id, "==", filteredProjects?.[0]?.client_project_id); // Log each comparison
            // return client.client_id == filteredProjects?.[0]?.client_project_id; // Perform the filtering

            // console.log(client.one_commerce_client_id, "==", clientId); // Log each comparison
            if (ES_client_id || client?.client_project_es_id) {
              return client.client_id == x_dsm_client_id && client.client_project_es_id == ES_client_id; // Perform the filtering
            } else {
              return client.client_id == x_dsm_client_id; // Perform the filtering
            }
          });
          let clientfilteredProjects = filteredProjects.filter(client => {
            if (ES_client_id || client?.client_project_es_id) {
              return client.client_project_id == x_dsm_client_id && client.client_project_es_id == ES_client_id;
            } else {
              return client.client_project_id == x_dsm_client_id;
            }
          })
          // console.log('clientfilteredProjects', clientfilteredProjects)
          if (filteredData[0]) {
            req.user = decoded;
            req.index = filteredData[0]
            req.active_client_project = clientfilteredProjects?.[0]
            req.elstic_indexs = filteredData[0]
            return next();
          } else {
            return res.status(400).json({ error: 'Unauthorized Request: Client Not Found' });
          }

        } else {
          return res.status(401).json({ error: 'UnAuthorize Request' });
        }
      })

  } catch (e) {
    console.error('Authentication failed', e);
    return res.status(401).json({
      status: false,
      error: 'Unauthorized',
      message: 'Authentication failed',
      code: 'AUTH_FAILED'
    });
  }
};

const byPassAuthorizeNew = async (req, res, next) => {
  try {

    const idToken = req.headers?.Idtoken || req.headers?.idtoken || req.headers?.['id-token'];
    const accessToken = req.headers?.authorization || req.headers?.['authorization'] || req.headers?.Authorization;

    let { clientId } = req.query;
    const x_dsm_client_id = req.headers?.['X-dsm-client-id'] || req.headers?.['x-dsm-client-id'];
    const ES_client_id = req.headers?.['x-dsm-client-es-id'] ?? null;

    const tokenToCheck = accessToken && idToken;




    const filteredProjects = filterByClientId(clientId);

    const clientIndex = (process.env.MODE == "production") ? PROD_CLIENT_INDEX : DEV_CLIENT_INDEX;
    let filteredData = clientIndex.filter(client => {
      if (ES_client_id || client?.client_project_es_id) {
        return client.client_id == x_dsm_client_id && client.client_project_es_id == ES_client_id; // Perform the filtering
      } else {
        return client.client_id == x_dsm_client_id; // Perform the filtering
      }
    });
    let clientfilteredProjects = filteredProjects.filter(client => {
      if (ES_client_id || client?.client_project_es_id) {
        return client.client_project_id == x_dsm_client_id && client.client_project_es_id == ES_client_id;
      } else {
        return client.client_project_id == x_dsm_client_id;
      }
    })
    console.log('clientfilteredProjects33', filteredData)
    if (filteredData[0]) {
      req.user = {};
      req.index = filteredData[0]
      req.active_client_project = clientfilteredProjects?.[0]
      req.elstic_indexs = filteredData[0]
      return next();
    } else {
      return res.status(500).json({ error: 'Unauthorized Request: Client Not Found' });
    }

  } catch (e) {
    console.error(e);
    console.log('clientfilteredProjects33', e)
    return res.status(500).json({
      status: false,
      error: 'Unauthorized',
      message: 'Authentication failed',
      code: 'AUTH_FAILED'
    });
  }
};

const decodeToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, SECRET_KEY_JWT, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded);
      }
    });
  });
};

const authorizeProductInsertion = async (req, res, next) => {
  try {
    const { EBUX_SECRET_KEY, EBUX_ACCESS_KEY } = process.env;

    if (req.headers?.ebux_secret_key && req.headers?.ebux_access_key) {
      if (
        EBUX_ACCESS_KEY === req.headers?.ebux_access_key &&
        EBUX_SECRET_KEY === req.headers?.ebux_secret_key &&
        req.headers?.client_name
      ) {
        let db_name;
        let database = [];
        dbConfig?.databases.map((item) => {
          database.push(item.pgsql_database);
        });

        if (database.includes(req.headers?.client_name)) {
          db_name = req.headers?.client_name;
        } else {
          return resLib.sendResponse(
            constants.response_code.BAD_REQUEST,
            "Incorrect client name",
            {},
            res,
            {}
          );
        }

        req.db = db_name;
        req.psdb = psdb[req.db];

        return next();
      } else {
        // delete req.headers?.authorization;

        return resLib.sendResponse(
          constants.response_code.UNAUTHORIZED,
          "Unauthorized",
          {},
          res,
          {}
        );
      }
    } else {
      return resLib.sendResponse(
        constants.response_code.NOT_FOUND,
        "Authorization header missing",
        {},
        res,
        {}
      );
    }
  } catch (error) {
    return resLib.sendResponse(
      constants.response_code.UNAUTHORIZED,
      "",
      {},
      res,
      {}
    );
  }
};

const flipkartAuthorize = async (req, res, next) => {
  try {
    if (process.env.WILD_CARD === req.user.user_id) {
      return next();
    }
    const { client_id } = req.user;
    const platform = await psdb[
      process.env.COMMON_DB
    ].e_genie_platform_mapping.findOne({
      where: {
        client_id: client_id,
        status: "1",
      },
      include: [
        {
          model: psdb[process.env.COMMON_DB].e_genie_platform_list,
          where: {
            platform_id: "1",
          },
          required: true,
        },
      ],
      raw: true,
    });

    if (!platform) {
      return resLib.sendResponse(
        constants.response_code.UNAUTHORIZED,
        "",
        {},
        res,
        {}
      );
    }
    return next();
  } catch (e) {
    console.error(e);
    return resLib.sendResponse(
      constants.response_code.UNAUTHORIZED,
      "",
      {},
      res,
      {}
    );
  }
};
const amazonAuthorize = async (req, res, next) => {
  try {
    if (process.env.WILD_CARD === req.user.user_id) {
      return next();
    }
    const { client_id } = req.user;
    const platform = await psdb[
      process.env.COMMON_DB
    ].e_genie_platform_mapping.findOne({
      where: {
        client_id: client_id,
        status: "1",
      },
      include: [
        {
          model: psdb[process.env.COMMON_DB].e_genie_platform_list,
          where: {
            platform_id: "2",
          },
          required: true,
        },
      ],
      raw: true,
    });

    if (!platform) {
      return resLib.sendResponse(
        constants.response_code.UNAUTHORIZED,
        "",
        {},
        res,
        {}
      );
    }
    return next();
  } catch (e) {
    console.error(e);
    return resLib.sendResponse(
      constants.response_code.UNAUTHORIZED,
      "",
      {},
      res,
      {}
    );
  }
};
const blinkitAuthorize = async (req, res, next) => {
  try {
    if (process.env.WILD_CARD === req.user.user_id) {
      return next();
    }
    const { client_id } = req.user;
    const platform = await psdb[
      process.env.COMMON_DB
    ].e_genie_platform_mapping.findOne({
      where: {
        client_id: client_id,
        status: "1",
      },
      include: [
        {
          model: psdb[process.env.COMMON_DB].e_genie_platform_list,
          where: {
            platform_id: "4",
          },
          required: true,
        },
      ],
      raw: true,
    });

    if (!platform) {
      return resLib.sendResponse(
        constants.response_code.UNAUTHORIZED,
        "",
        {},
        res,
        {}
      );
    }
    return next();
  } catch (e) {
    console.error(e);
    return resLib.sendResponse(
      constants.response_code.UNAUTHORIZED,
      "",
      {},
      res,
      {}
    );
  }
};
const zeptoAuthorize = async (req, res, next) => {
  try {
    if (process.env.WILD_CARD === req.user.user_id) {
      return next();
    }
    const { client_id } = req.user;
    const platform = await psdb[
      process.env.COMMON_DB
    ].e_genie_platform_mapping.findOne({
      where: {
        client_id: client_id,
        status: "1",
      },
      include: [
        {
          model: psdb[process.env.COMMON_DB].e_genie_platform_list,
          where: {
            platform_id: "3",
          },
          required: true,
        },
      ],
      raw: true,
    });

    if (!platform) {
      return resLib.sendResponse(
        constants.response_code.UNAUTHORIZED,
        "",
        {},
        res,
        {}
      );
    }
    return next();
  } catch (e) {
    console.error(e);
    return resLib.sendResponse(
      constants.response_code.UNAUTHORIZED,
      "",
      {},
      res,
      {}
    );
  }
};

const productBulkCreate = async (req, res, next) => {
  try {
    const { RECKITT_PRIVATE_ACCESS, RECKITT_SECRET_ACCESS, MODE } = process.env;
    if (
      req.headers["reckitt-secret-key"] &&
      req.headers["reckitt-private-key"]
    ) {
      if (
        RECKITT_PRIVATE_ACCESS === req.headers["reckitt-private-key"] &&
        RECKITT_SECRET_ACCESS === req.headers["reckitt-secret-key"]
        //  &&
        // req.headers?.client_name
      ) {
        // let db_name;
        // let database = [];
        // dbConfig?.databases.map((item) => {
        //   database.push(item.pgsql_database);
        // });

        // if (database.includes(req.headers?.client_name)) {
        //   db_name = req.headers?.client_name;
        // } else {
        //   return resLib.sendResponse(
        //     constants.response_code.BAD_REQUEST,
        //     "Incorrect client name",
        //     {},
        //     res,
        //     {}
        //   );
        // }

        req.db = MODE === "development" ? "reckitt_staging" : "reckitt-prod";
        // req.db = "reckitt_staging";
        req.psdb = psdb[req.db];

        return next();
      } else {
        // delete req.headers?.authorization;

        return resLib.sendResponse(
          constants.response_code.UNAUTHORIZED,
          "Unauthorized",
          {},
          res,
          {}
        );
      }
    } else {
      return resLib.sendResponse(
        constants.response_code.NOT_FOUND,
        "Authorization header missing",
        {},
        res,
        {}
      );
    }
  } catch (error) {
    return resLib.sendResponse(
      constants.response_code.UNAUTHORIZED,
      "",
      {},
      res,
      {}
    );
  }
};

const instamartAuthorize = async (req, res, next) => {
  try {
    if (process.env.WILD_CARD === req.user.user_id) {
      return next();
    }
    const { client_id } = req.user;
    const platform = await psdb[
      process.env.COMMON_DB
    ].e_genie_platform_mapping.findOne({
      where: {
        client_id: client_id,
        status: "1",
      },
      include: [
        {
          model: psdb[process.env.COMMON_DB].e_genie_platform_list,
          where: {
            platform_id: "5",
          },
          required: true,
        },
      ],
      raw: true,
    });

    if (!platform) {
      return resLib.sendResponse(
        constants.response_code.UNAUTHORIZED,
        "",
        {},
        res,
        {}
      );
    }
    return next();
  } catch (e) {
    console.error(e);
    return resLib.sendResponse(
      constants.response_code.UNAUTHORIZED,
      "",
      {},
      res,
      {}
    );
  }
};

const checkUserPlatformAccess = (platform, checkRole) => {
  return async (req, res, next) => {
    if (process.env.WILD_CARD === req.user.user_id) {
      return next();
    }
    if (checkRole && req.user.user_info.role === 'analyst') {
      return resLib.sendResponse(
        constants.response_code.UNAUTHORIZED,
        "",
        {},
        res,
        {}
      );
    }
    if (req.user.user_info.role === 'owner') {
      next();
    } else {
      const platformAccess = await psdb[
        process.env.COMMON_DB
      ].users_platforms.findOne({
        where: { user_id: req.user.user_id, platform_name: platform, status: 1 },
        raw: true
      });
      if (!platformAccess) {
        return resLib.sendResponse(
          constants.response_code.UNAUTHORIZED,
          "",
          {},
          res,
          {}
        );
      }

      next();
    }
  }
}

// const commonPlatformAuthorize = async (req, res, next) => {
//   try {
//     const { client_id } = req.user;
//     const platform = await psdb[
//       "e_genie_staging"
//     ].e_genie_platform_mapping.findOne({
//       where: {
//         client_id: client_id,
//       },
//       include: [
//         {
//           model: psdb["e_genie_staging"].e_genie_platform_list,
//           where: {
//             platform_id: "3",
//           },
//           required: true,
//         },
//       ],
//       raw: true,
//     });
//     console.log(platform);
//     if (!platform) {
//       return resLib.sendResponse(
//         constants.response_code.UNAUTHORIZED,
//         "",
//         {},
//         res,
//         {}
//       );
//     }
//     return next();
//   } catch (e) {
//     console.log(e);
//     return resLib.sendResponse(
//       constants.response_code.UNAUTHORIZED,
//       "",
//       {},
//       res,
//       {}
//     );
//   }
// };
module.exports = {
  authorize,
  authorizeNewBeforLogin,
  authorizeNew,
  byPassAuthorizeNew,
  verifyRequest,
  authorizeProductInsertion,
  flipkartAuthorize,
  amazonAuthorize,
  blinkitAuthorize,
  zeptoAuthorize,
  decodeToken,
  productBulkCreate,
  instamartAuthorize,
  checkUserPlatformAccess,
  // commonPlatformAuthorize,
};

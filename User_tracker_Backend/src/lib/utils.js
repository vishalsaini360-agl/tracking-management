const { decodeToken } = require("../middlewares/auth");

psdb = require("../configs/postgres.config");
const findQRCode = (sockets, qr) => {
  let socketObj = false;
  for (let socket of [...sockets]) {
    if (socket[1]?.qr == qr) {
      socketObj = socket[1];
      break;
    }
  }
  return socketObj;
};

const QRCodeGen = (length) => {
  let result = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
};

const calculatedFields = {
  ctr: {
    $multiply: [
      {
        $divide: ["$clicks", "$views"],
      },
      100,
    ],
  },
  cpc: {
    $sum: {
      $divide: ["$spend", { $cond: [{ $eq: ["$clicks", 0] }, 1, "$clicks"] }],
    },
  },
  cvr: {
    $multiply: [
      {
        $divide: [
          "$orders",
          { $cond: [{ $eq: ["$clicks", 0] }, 1, "$clicks"] },
        ],
      },
      100,
    ],
  },
  direct_cvr: {
    $multiply: [
      {
        $divide: [
          "$direct_units_sold",
          { $cond: [{ $eq: ["$clicks", 0] }, 1, "$clicks"] },
        ],
      },
      100,
    ],
  },
  indirect_cvr: {
    $multiply: [
      {
        $divide: [
          "$indirect_units_sold",
          { $cond: [{ $eq: ["$clicks", 0] }, 1, "$clicks"] },
        ],
      },
      100,
    ],
  },
  aov: {
    $sum: {
      $divide: ["$revenue", { $cond: [{ $eq: ["$orders", 0] }, 1, "$orders"] }],
    },
  },
  direct_aov: {
    $sum: {
      $divide: [
        "$direct_revenue",
        {
          $cond: [{ $eq: ["$direct_units_sold", 0] }, 1, "$direct_units_sold"],
        },
      ],
    },
  },
  indirect_aov: {
    $sum: {
      $divide: [
        "$indirect_revenue",
        {
          $cond: [
            { $eq: ["$indirect_units_sold", 0] },
            1,
            "$indirect_units_sold",
          ],
        },
      ],
    },
  },
  roi: {
    $sum: {
      $divide: ["$revenue", { $cond: [{ $eq: ["$spend", 0] }, 1, "$spend"] }],
    },
  },
  direct_roi: {
    $sum: {
      $divide: [
        "$direct_revenue",
        { $cond: [{ $eq: ["$spend", 0] }, 1, "$spend"] },
      ],
    },
  },
  indirect_roi: {
    $sum: {
      $divide: [
        "$indirect_revenue",
        { $cond: [{ $eq: ["$spend", 0] }, 1, "$spend"] },
      ],
    },
  },
  cpm: {
    $sum: {
      $divide: ["$spend", { $cond: [{ $eq: ["$views", 0] }, 1, "$views"] }],
    },
  },
  cpa: {
    $cond: {
      if: { $ne: ["$orders", 0] },
      then: {
        $divide: ["$spend", { $cond: [{ $eq: ["$orders", 0] }, 1, "$orders"] }],
      },
      else: 0,
    },
  },
  direct_cpa: {
    $cond: {
      if: { $ne: ["$direct_units_sold", 0] },
      then: {
        $divide: [
          "$spend",
          {
            $cond: [
              { $eq: ["$direct_units_sold", 0] },
              1,
              "$direct_units_sold",
            ],
          },
        ],
      },
      else: 0,
    },
  },
  indirect_cpa: {
    $cond: {
      if: { $ne: ["$indirect_units_sold", 0] },
      then: {
        $divide: [
          "$spend",
          {
            $cond: [
              { $eq: ["$indirect_units_sold", 0] },
              1,
              "$indirect_units_sold",
            ],
          },
        ],
      },
      else: 0,
    },
  },
};

let flipkartKeywordCalculatedFields = [
  [
    psdb.Sequelize.literal("((sum(total_revenue)/sum(NULLIF(spend, 0))))"),
    "roas",
  ],
  [
    psdb.Sequelize.literal(
      "(CASE WHEN sum(spend) = 0 THEN 0 ELSE (sum(total_revenue)/sum(spend)) END)"
    ),
    "roas",
  ],
  [
    psdb.Sequelize.literal(
      "(CASE WHEN sum(clicks) = 0 THEN 0 ELSE (sum(spend)/sum(clicks)) END)"
    ),
    "cpc",
  ],
  [
    psdb.Sequelize.literal(
      "(CASE WHEN sum(total_revenue) = 0 THEN 0 ELSE (sum(spend)/sum(total_revenue))*100 END)"
    ),
    "acos",
  ],
  [
    psdb.Sequelize.literal(
      "(CASE WHEN sum(views) =0 THEN 0 ELSE (sum(clicks)/sum(views))*100 END)"
    ),
    "ctr",
  ],
  [
    psdb.Sequelize.literal(
      "(CASE WHEN sum(clicks) =0 THEN 0 ELSE (sum(total_units_sold)/sum(clicks))*100 END)"
    ),
    "cvr",
  ],
  [
    psdb.Sequelize.literal(
      "(CASE WHEN sum(clicks) =0 THEN 0 ELSE (sum(total_units_sold)/sum(clicks))*100 END)"
    ),
    "total_cvr",
  ],
  [
    psdb.Sequelize.literal(
      "(CASE WHEN sum(clicks) = 0 THEN 0 ELSE (sum(spend)/sum(clicks)) END)"
    ),
    "cpc",
  ],
  [
    psdb.Sequelize.literal(
      "(CASE WHEN sum(total_units_sold) = 0 THEN 0 ELSE (sum(total_revenue)/sum(total_units_sold)) END)"
    ),
    "aov",
  ],
  [
    psdb.Sequelize.literal(
      "(CASE WHEN sum(total_units_sold) = 0 THEN 0 ELSE (sum(total_revenue)/sum(total_units_sold)) END)"
    ),
    "total_aov",
  ],
  [
    psdb.Sequelize.literal(
      "(CASE WHEN sum(direct_units_sold) = 0 THEN 0 ELSE (sum(direct_revenue)/sum(direct_units_sold)) END)"
    ),
    "direct_aov",
  ],
  [
    psdb.Sequelize.literal(
      "(CASE WHEN sum(indirect_units_sold) = 0 THEN 0 ELSE (sum(indirect_revenue)/sum(indirect_units_sold)) END)"
    ),
    "indirect_aov",
  ],
  [
    psdb.Sequelize.literal(
      "(CASE WHEN sum(clicks) =0 THEN 0 ELSE (sum(direct_units_sold)/sum(clicks))*100 END)"
    ),
    "direct_cvr",
  ],
  [
    psdb.Sequelize.literal(
      "(CASE WHEN sum(clicks) =0 THEN 0 ELSE (sum(indirect_units_sold)/sum(clicks))*100 END)"
    ),
    "indirect_cvr",
  ],
  [
    psdb.Sequelize.literal(
      "(CASE WHEN sum(spend) =0 THEN 0 ELSE (sum(total_revenue)/sum(spend)) END)"
    ),
    "roi",
  ],
  [
    psdb.Sequelize.literal(
      "(CASE WHEN sum(spend) =0 THEN 0 ELSE (sum(total_revenue)/sum(spend)) END)"
    ),
    "total_roi",
  ],
  [
    psdb.Sequelize.literal(
      "(CASE WHEN sum(spend) =0 THEN 0 ELSE (sum(direct_revenue)/sum(spend)) END)"
    ),
    "direct_roi",
  ],
  [
    psdb.Sequelize.literal(
      "(CASE WHEN sum(spend) =0 THEN 0 ELSE (sum(indirect_revenue)/sum(spend)) END)"
    ),
    "indirect_roi",
  ],
  [
    psdb.Sequelize.literal(
      "(CASE WHEN sum(views) =0 THEN 0 ELSE (sum(spend)/sum(views)) END)"
    ),
    "cpm",
  ],
  [
    psdb.Sequelize.literal(
      "(CASE WHEN sum(total_units_sold) =0 THEN 0 ELSE (sum(spend)/sum(total_units_sold)) END)"
    ),
    "cpa",
  ],
  [
    psdb.Sequelize.literal(
      "(CASE WHEN sum(direct_units_sold) =0 THEN 0 ELSE (sum(spend)/sum(direct_units_sold)) END)"
    ),
    "direct_cpa",
  ],
  [
    psdb.Sequelize.literal(
      "(CASE WHEN sum(indirect_units_sold) =0 THEN 0 ELSE (sum(spend)/sum(indirect_units_sold)) END)"
    ),
    "indirect_cpa",
  ],
];

let flipkartFsnCalculatedFields = [
  [
    psdb.Sequelize.literal("((sum(total_revenue)/sum(NULLIF(spend, 0))))"),
    "roas",
  ],
  [
    psdb.Sequelize.literal(
      "(CASE WHEN sum(spend) = 0 THEN 0 ELSE (sum(total_revenue)/sum(spend)) END)"
    ),
    "roas",
  ],
  [
    psdb.Sequelize.literal(
      "(CASE WHEN sum(clicks) = 0 THEN 0 ELSE (sum(spend)/sum(clicks)) END)"
    ),
    "cpc",
  ],
  [
    psdb.Sequelize.literal(
      "(CASE WHEN sum(total_revenue) = 0 THEN 0 ELSE (sum(spend)/sum(total_revenue))*100 END)"
    ),
    "acos",
  ],
  [
    psdb.Sequelize.literal(
      "(CASE WHEN sum(views) =0 THEN 0 ELSE (sum(clicks)/sum(views))*100 END)"
    ),
    "ctr",
  ],
  [
    psdb.Sequelize.literal(
      "(CASE WHEN sum(clicks) =0 THEN 0 ELSE (sum(total_units_sold)/sum(clicks))*100 END)"
    ),
    "cvr",
  ],
  [
    psdb.Sequelize.literal(
      "(CASE WHEN sum(clicks) =0 THEN 0 ELSE (sum(total_units_sold)/sum(clicks))*100 END)"
    ),
    "total_cvr",
  ],
  [
    psdb.Sequelize.literal(
      "(CASE WHEN sum(clicks) = 0 THEN 0 ELSE (sum(spend)/sum(clicks)) END)"
    ),
    "cpc",
  ],
  [
    psdb.Sequelize.literal(
      "(CASE WHEN sum(total_units_sold) = 0 THEN 0 ELSE (sum(total_revenue)/sum(total_units_sold)) END)"
    ),
    "aov",
  ],
  [
    psdb.Sequelize.literal(
      "(CASE WHEN sum(total_units_sold) = 0 THEN 0 ELSE (sum(total_revenue)/sum(total_units_sold)) END)"
    ),
    "total_aov",
  ],
  [
    psdb.Sequelize.literal(
      "(CASE WHEN sum(units_sold_direct) = 0 THEN 0 ELSE (sum(direct_revenue)/sum(units_sold_direct)) END)"
    ),
    "direct_aov",
  ],
  [
    psdb.Sequelize.literal(
      "(CASE WHEN sum(units_sold_indirect) = 0 THEN 0 ELSE (sum(indirect_revenue)/sum(units_sold_indirect)) END)"
    ),
    "indirect_aov",
  ],
  [
    psdb.Sequelize.literal(
      "(CASE WHEN sum(clicks) =0 THEN 0 ELSE (sum(units_sold_direct)/sum(clicks))*100 END)"
    ),
    "direct_cvr",
  ],
  [
    psdb.Sequelize.literal(
      "(CASE WHEN sum(clicks) =0 THEN 0 ELSE (sum(units_sold_indirect)/sum(clicks))*100 END)"
    ),
    "indirect_cvr",
  ],
  [
    psdb.Sequelize.literal(
      "(CASE WHEN sum(spend) =0 THEN 0 ELSE (sum(total_revenue)/sum(spend)) END)"
    ),
    "roi",
  ],
  [
    psdb.Sequelize.literal(
      "(CASE WHEN sum(spend) =0 THEN 0 ELSE (sum(total_revenue)/sum(spend)) END)"
    ),
    "total_roi",
  ],
  [
    psdb.Sequelize.literal(
      "(CASE WHEN sum(spend) =0 THEN 0 ELSE (sum(direct_revenue)/sum(spend)) END)"
    ),
    "direct_roi",
  ],
  [
    psdb.Sequelize.literal(
      "(CASE WHEN sum(spend) =0 THEN 0 ELSE (sum(indirect_revenue)/sum(spend)) END)"
    ),
    "indirect_roi",
  ],
  [
    psdb.Sequelize.literal(
      "(CASE WHEN sum(views) =0 THEN 0 ELSE (sum(spend)/sum(views)) END)"
    ),
    "cpm",
  ],
  [
    psdb.Sequelize.literal(
      "(CASE WHEN sum(total_units_sold) =0 THEN 0 ELSE (sum(spend)/sum(total_units_sold)) END)"
    ),
    "cpa",
  ],
  [
    psdb.Sequelize.literal(
      "(CASE WHEN sum(units_sold_direct) =0 THEN 0 ELSE (sum(spend)/sum(units_sold_direct)) END)"
    ),
    "direct_cpa",
  ],
  [
    psdb.Sequelize.literal(
      "(CASE WHEN sum(units_sold_indirect) =0 THEN 0 ELSE (sum(spend)/sum(units_sold_indirect)) END)"
    ),
    "indirect_cpa",
  ],
];

let flipkartCalculatedFields = [
  [
    psdb.Sequelize.literal("((sum(total_revenue)/sum(NULLIF(spend, 0))))"),
    "roas",
  ],
  [
    psdb.Sequelize.literal(
      "(CASE WHEN sum(spend) = 0 THEN 0 ELSE (sum(total_revenue)/sum(spend)) END)"
    ),
    "roas",
  ],
  [
    psdb.Sequelize.literal(
      "(CASE WHEN sum(clicks) = 0 THEN 0 ELSE (sum(spend)/sum(clicks)) END)"
    ),
    "cpc",
  ],
  [
    psdb.Sequelize.literal(
      "(CASE WHEN sum(total_revenue) = 0 THEN 0 ELSE (sum(spend)/sum(total_revenue))*100 END)"
    ),
    "acos",
  ],
  [
    psdb.Sequelize.literal(
      "(CASE WHEN sum(views) =0 THEN 0 ELSE (sum(clicks)/sum(views))*100 END)"
    ),
    "ctr",
  ],
  [
    psdb.Sequelize.literal(
      "(CASE WHEN sum(clicks) =0 THEN 0 ELSE (sum(orders)/sum(clicks))*100 END)"
    ),
    "cvr",
  ],
  [
    psdb.Sequelize.literal(
      "(CASE WHEN sum(clicks) = 0 THEN 0 ELSE (sum(spend)/sum(clicks)) END)"
    ),
    "cpc",
  ],
  [
    psdb.Sequelize.literal(
      "(CASE WHEN sum(orders) = 0 THEN 0 ELSE (sum(total_revenue)/sum(orders)) END)"
    ),
    "aov",
  ],
  [
    psdb.Sequelize.literal(
      "(CASE WHEN sum(orders) = 0 THEN 0 ELSE (sum(total_revenue)/sum(orders)) END)"
    ),
    "total_aov",
  ],

  [
    psdb.Sequelize.literal(
      "(CASE WHEN sum(units_sold_direct) = 0 THEN 0 ELSE (sum(direct_revenue)/sum(units_sold_direct)) END)"
    ),
    "direct_aov",
  ],
  [
    psdb.Sequelize.literal(
      "(CASE WHEN sum(units_sold_indirect) = 0 THEN 0 ELSE (sum(indirect_revenue)/sum(units_sold_indirect)) END)"
    ),
    "indirect_aov",
  ],
  [
    psdb.Sequelize.literal(
      "(CASE WHEN sum(clicks) =0 THEN 0 ELSE (sum(units_sold_direct)/sum(clicks))*100 END)"
    ),
    "direct_cvr",
  ],
  [
    psdb.Sequelize.literal(
      "(CASE WHEN sum(clicks) =0 THEN 0 ELSE (sum(units_sold_indirect)/sum(clicks))*100 END)"
    ),
    "indirect_cvr",
  ],
  [
    psdb.Sequelize.literal(
      "(CASE WHEN sum(clicks) =0 THEN 0 ELSE (sum(units_sold_indirect)/sum(clicks))*100 END)"
    ),
    "total_cvr",
  ],

  [
    psdb.Sequelize.literal(
      "(CASE WHEN sum(spend) =0 THEN 0 ELSE (sum(total_revenue)/sum(spend)) END)"
    ),
    "roi",
  ],
  [
    psdb.Sequelize.literal(
      "(CASE WHEN sum(spend) =0 THEN 0 ELSE (sum(total_revenue)/sum(spend)) END)"
    ),
    "total_roi",
  ],
  [
    psdb.Sequelize.literal(
      "(CASE WHEN sum(spend) =0 THEN 0 ELSE (sum(direct_revenue)/sum(spend)) END)"
    ),
    "direct_roi",
  ],
  [
    psdb.Sequelize.literal(
      "(CASE WHEN sum(spend) =0 THEN 0 ELSE (sum(indirect_revenue)/sum(spend)) END)"
    ),
    "indirect_roi",
  ],
  [
    psdb.Sequelize.literal(
      "(CASE WHEN sum(views) =0 THEN 0 ELSE (sum(spend)/sum(views)) END)"
    ),
    "cpm",
  ],
  [
    psdb.Sequelize.literal(
      "(CASE WHEN sum(orders) =0 THEN 0 ELSE (sum(spend)/sum(orders)) END)"
    ),
    "cpa",
  ],
  [
    psdb.Sequelize.literal(
      "(CASE WHEN sum(units_sold_direct) =0 THEN 0 ELSE (sum(spend)/sum(units_sold_direct)) END)"
    ),
    "direct_cpa",
  ],
  [
    psdb.Sequelize.literal(
      "(CASE WHEN sum(units_sold_indirect) =0 THEN 0 ELSE (sum(spend)/sum(units_sold_indirect)) END)"
    ),
    "indirect_cpa",
  ],
];
const addFieldPipeline = {
  CTR: {
    $multiply: [
      {
        $divide: ["$clicks", { $cond: [{ $eq: ["$views", 0] }, 1, "$views"] }],
      },
      100,
    ],
  },
  cpc: {
    $sum: {
      $divide: ["$spend", { $cond: [{ $eq: ["$clicks", 0] }, 1, "$clicks"] }],
    },
  },
  cvr_direct: {
    $multiply: [
      {
        $divide: [
          "$units_sold_direct",
          { $cond: [{ $eq: ["$clicks", 0] }, 1, "$clicks"] },
        ],
      },
      100,
    ],
  },
  cvr_indirect: {
    $multiply: [
      {
        $divide: [
          "$units_sold_indirect",
          { $cond: [{ $eq: ["$clicks", 0] }, 1, "$clicks"] },
        ],
      },
      100,
    ],
  },

  cvr_total: {
    $multiply: [
      {
        $divide: [
          "$orders",
          { $cond: [{ $eq: ["$clicks", 0] }, 1, "$clicks"] },
        ],
      },
      100,
    ],
  },
  aov_direct: {
    $sum: {
      $divide: [
        "$direct_revenue",
        {
          $cond: [{ $eq: ["$units_sold_direct", 0] }, 1, "$units_sold_direct"],
        },
      ],
    },
  },
  aov_indirect: {
    $sum: {
      $divide: [
        "$indirect_revenue",
        {
          $cond: [
            { $eq: ["$units_sold_indirect", 0] },
            1,
            "$units_sold_indirect",
          ],
        },
      ],
    },
  },
  aov_total: {
    $sum: {
      $divide: [
        "$total_revenue",
        { $cond: [{ $eq: ["$orders", 0] }, 1, "$orders"] },
      ],
    },
  },
  roi_direct: {
    $sum: {
      $divide: [
        "$direct_revenue",
        { $cond: [{ $eq: ["$spend", 0] }, 1, "$spend"] },
      ],
    },
  },
  roi_indirect: {
    $sum: {
      $divide: [
        "$indirect_revenue",
        { $cond: [{ $eq: ["$spend", 0] }, 1, "$spend"] },
      ],
    },
  },
  total_roi: {
    $sum: {
      $divide: [
        "$total_revenue",
        { $cond: [{ $eq: ["$spend", 0] }, 1, "$spend"] },
      ],
    },
  },
};

const generateQuery = (methods) => {
  const query = [];
  for (const method of methods) {
    // const subQuery = `ROUND((CASE WHEN ${method.denominator} <> 0 THEN ${method.expression} ELSE 0 END)) AS ${method.alias}`;
    const subQuery = `(CASE WHEN ${method.denominator} <> 0 THEN ${method.expression} ELSE 0 END) AS ${method.alias}`;
    query.push(subQuery);
  }
  // console.log(query.join(", "));
  return query.join(", ");
};

const formatData = async (
  data = [],
  syntax,
  metricHeaders,
  metricField,
  token
) => {
  let decodedToken;
  if (token) {
    decodedToken = await decodeToken(token);
  }

  // console.log(decodedToken, "<<<< decoed toekn ");

  // const [firstQuery, sumQuery, operationalQuery] = [[], [], []];
  // const { firstAlias, sumField, toBeCalculate } = fields;
  // for (const first of firstAlias) {
  //   const subQuery = `(ARRAY_AGG(${first.table}.${first.alias}))[1] AS ${first.alias}`;
  //   firstQuery.push(subQuery);
  // }
  // for (const sum of sumField) {
  //   const subQuery = `SUM(${sum.table}.${sum.field}) AS ${sum.alias}`;
  //   sumQuery.push(subQuery);
  // }
  // for (const op of toBeCalculate) {
  //   const subQuery = `(CASE WHEN ${op.denominator} <> 0 THEN ${op.expression} ELSE 0 END) AS ${op.alias}`;
  //   operationalQuery.push(subQuery);
  // }

  // return {
  //   firstQuery: firstQuery.join(", "),
  //   sumQuery: sumQuery.join(", "),
  //   operationalQuery: operationalQuery.join(", "),
  // };
  // console.log(data);
  const [newArray, formatted] = [[], []];
  let updatedObject = {};

  if (!metricHeaders) {
    for (const obj of data) {
      updatedObject = {};
      for (const prop in obj) {
        if (syntax.alias.hasOwnProperty(prop)) {
          updatedObject[syntax.alias[prop]] = obj[prop];
        } else {
          updatedObject[prop] = obj[prop];
        }
      }
      newArray.push(updatedObject);
    }

    for (const obj of newArray) {
      updatedObject = {};

      for (const prop in obj) {
        if (!obj[prop]) {
          updatedObject[prop] = "-";
        } else {
          if (
            syntax.fieldType[prop] === "rs" ||
            syntax.fieldType[prop] === "rsDecimal" ||
            syntax.fieldType[prop] === "number"
          ) {
            updatedObject[prop] =
              syntax.fieldType[prop] === "rs"
                ? decodedToken?.currency +
                  parseInt(Number(obj[prop])).toLocaleString(
                    `${decodedToken?.currency_format}`
                  )
                : syntax.fieldType[prop] === "rsDecimal"
                ? decodedToken?.currency +
                  Number(obj[prop]).toLocaleString(
                    `${decodedToken?.currency_format}`,
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }
                  )
                : Number(obj[prop]).toLocaleString(
                    `${decodedToken?.currency_format}`
                  );
          } else if (syntax.fieldType[prop] === "%") {
            updatedObject[prop] =
              (obj[prop] ? Number(obj[prop]).toFixed(2) : 0) + "%";
          } else if (syntax.fieldType[prop] === "decimal") {
            updatedObject[prop] = obj[prop]
              ? Number(obj[prop]).toLocaleString(
                  `${decodedToken?.currency_format}`,
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }
                )
              : 0;
          } else {
            updatedObject[prop] = obj[prop];
          }
        }
      }
      formatted.push(updatedObject);
    }
    return formatted;
  }
  for (const obj of data) {
    // console.log("obj:::::::::", obj);
    for (const prop in obj) {
      if (
        syntax.fieldType[metricField] === "rs" ||
        syntax.fieldType[metricField] === "rsDecimal" ||
        syntax.fieldType[metricField] === "number"
      ) {
        // console.log("etsts::::::::::::::::::::::::::::::");
        updatedObject[prop] =
          syntax.fieldType[metricField] === "rs"
            ? decodedToken?.currency +
              parseInt(Number(obj[prop])).toLocaleString(
                `${decodedToken?.currency_format}`
              )
            : syntax.fieldType[metricField] === "rsDecimal"
            ? decodedToken?.currency +
              Number(obj[prop]).toLocaleString(
                `${decodedToken?.currency_format}`,
                {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }
              )
            : parseInt(Number(obj[prop])).toLocaleString(
                `${decodedToken?.currency_format}`
              );
      } else if (syntax.fieldType[metricField] === "%") {
        updatedObject[prop] =
          (obj[prop] ? Number(obj[prop]).toFixed(2) : 0) + "%";
      } else if (syntax.fieldType[metricField] === "decimal") {
        updatedObject[prop] = obj[prop]
          ? Number(obj[prop]).toLocaleString(
              `${decodedToken?.currency_token}`,
              {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }
            )
          : 0;
      } else {
        updatedObject[prop] = obj[prop];
      }
    }
  }

  return updatedObject;
};

const limit = 50;

const getFlipkartColumns = (type) => {
 let columns = ['clicks', 'cpc', 'ctr', 'cvr', 'direct_cpa', 'direct_cvr', 'direct_revenue', 'indirect_cpa', 'indirect_cvr', 'indirect_revenue', 'roi', 'spend', 'views']
 if (type == 'campaign') {
  let campaignColumns = ['ppv_direct_click', 'aov_indirect', 'total_ppv', 'units_sold_direct', 'orders', 'ppv_indirect_click', 'indirect_cpa', 'aov', 'units_sold_indirect', 'revenue', 'cpm', 'aov_direct', 'direct_roi', 'indirect_roi', 'cpa', 'units_sold'];
  columns = [...columns, ...campaignColumns];
 }
 if (type == 'adGroup') {
  let adGroupColumns = ['ppv_direct_click', 'ppv_indirect_click', 'units_sold_direct', 'units_sold_indirect', 'revenue', 'orders', 'cpm', 'aov_direct', 'aov_indirect', 'indirect_cpa', 'direct_roi', 'indirect_roi', 'cpa', 'aov', 'units_sold']
  columns = [...adGroupColumns, ...columns];
 }
 if (type == 'fsn') {
  let fsnColumns = ['units_sold_direct', 'units_sold_indirect', 'total_units_sold', 'roas', 'acos', 'total_cvr', 'total_aov', 'indirect_aov', 'total_roi', 'cpm', 'cpa', 'indirect_cpa', 'total_revenue', ' direct_roi', 'indirect_roi', 'direct_aov', 'aov']
  columns = [...columns, ...fsnColumns]
 }
 if (type == 'placement') {
  let placementColumns = ['units_sold_direct', 'units_sold_indirect', 'total_units_sold', 'ppv_direct_click', 'ppv_indirect_click', 'roas', 'acos', 'total_cvr', 'aov', 'total_aov', 'direct_aov', 'indirect_aov', 'direct_cvr', 'indirect_cvr', 'total_roi', 'direct_roi', 'indirect_roi', 'cpm', 'ppv', 'units_sold', 'total_revenue', 'cpa'];
  columns = [...columns, ...placementColumns];
 }
 if (type == 'keyword') {
  let keywordColumns = ['total_units_sold', 'direct_units_sold', 'indirect_units_sold', 'total_revenue', 'cpm', 'roas', 'acos', 'direct_aov', 'indirect_aov', 'aov', 'direct_roi', 'cpa', 'indirect_cpa', 'indirect_cvr', 'direct_cvr', 'indirect_roi', 'cvr'];
  columns = [...columns, ...keywordColumns];
 }
 if (type == 'creative') {
  let creativeColumns = ['units_sold', 'direct_units_sold', 'indirect_units_sold', 'direct_ppv', 'indirect_ppv', 'revenue', 'ppv', 'direct_aov', 'aov', 'indirect_aov', 'direct_roi', 'indirect_roi', 'cpa', 'indirect_cpa'];
  columns = [...columns, ...creativeColumns];
 }
 return columns;
}

module.exports = {
  findQRCode,
  QRCodeGen,
  limit,
  calculatedFields,
  addFieldPipeline,
  generateQuery,
  formatData,
  getFlipkartColumns,
  flipkartCalculatedFields,
  flipkartKeywordCalculatedFields,
  flipkartFsnCalculatedFields,
};

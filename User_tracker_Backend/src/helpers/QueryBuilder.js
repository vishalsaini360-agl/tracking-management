class QueryBuilder {
  psdb = {};
  setDB(db) {
    this.psdb = db;
  }
  query = "";
  result;
  select(cols = "", type = "rows") {
    this.query = "Select *";
    if (type === "total") {
      this.query = "Select " + cols + ",count(*) total_count";
    }
    return this;
  }

  from(sql = "", alias = "al") {
    this.query += ` from (${sql}) ${alias} `;
    return this;
  }

  where(matchMetrics = {}) {
    this.query +=
      this.psdb.sequelize.dialect.queryGenerator.whereQuery(matchMetrics) + " ";
    return this;
  }

  order(sort = {}, table = "") {
    let orderByList = [];
    if (sort && Object.keys(sort).length) {
      Object.keys(sort).map((key) => {
        let sorting = "asc";
        if (sort[key] == -1) {
          sorting = "desc NULLS LAST";
        }
        orderByList.push(`${key} ${sorting}`);
      });
    }
    if (orderByList.length === 0) {
      orderByList.push("created_on desc");
    }
    if (table) {
      table = table + ".";
    }
    this.query += " order by " + table + orderByList.join(",") + " ";
    return this;
  }

  limit(limit = 50) {
    this.query += `limit ${limit} `;
    return this;
  }

  offset(offset = 0) {
    this.query += `offset ${offset} `;
    return this;
  }

  async exec() {
    try {
      let response = await this.psdb.sequelize.query(this.query);
      if (response.length > 0) {
        if (response[0]) {
          this.result = response[0];
        }
      }
      return this.result;
    } catch (e) {
      return false;
    }
  }
}

module.exports = new QueryBuilder();

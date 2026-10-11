module.exports = {
  development: {
    f_certificate: {
      type: process.env.type,
      project_id: process.env.project_id,
      private_key_id: process.env.private_key_id,
      private_key: process.env.private_key.replace(/\\n/g, "\n"),
      client_email: process.env.client_email,
      client_id: process.env.client_id,
      auth_uri: process.env.auth_uri,
      token_uri: process.env.token_uri,
      auth_provider_x509_cert_url: process.env.auth_provider_x509_cert_url,
      client_x509_cert_url: process.env.client_x509_cert_url,
      universe_domain: process.env.universe_domain,
    },

    databases: [
      {
        pgsql_url: process.env.pgsql_url_local,
        pgsql_port: process.env.pgsql_port_local,
        pgsql_user: process.env.pgsql_user_local,
        pgsql_password: process.env.pgsql_password_local,
        pgsql_database: process.env.pgsql_database_ebux_marketplace,
      }
    ],
    mysql_databases:[
      {
        mysql_url: process.env.mysql_url,
        mysql_port: process.env.mysql_port,
        mysql_user: process.env.mysql_user,
        mysql_password: process.env.mysql_password,
        mysql_database: process.env.mysql_database_colpal,
      }
    ]
  },
  
  production: {
    f_certificate: {
      type: process.env.type,
      project_id: process.env.project_id,
      private_key_id: process.env.private_key_id,
      private_key: process.env.private_key.replace(/\\n/g, "\n"),
      client_email: process.env.client_email,
      client_id: process.env.client_id,
      auth_uri: process.env.auth_uri,
      token_uri: process.env.token_uri,
      auth_provider_x509_cert_url: process.env.auth_provider_x509_cert_url,
      client_x509_cert_url: process.env.client_x509_cert_url,
      universe_domain: process.env.universe_domain,
    },

    databases: [
      {
        pgsql_url: process.env.pgsql_url_local,
        pgsql_port: process.env.pgsql_port_local,
        pgsql_user: process.env.pgsql_user_local,
        pgsql_password: process.env.pgsql_password_local,
        pgsql_database: process.env.pgsql_database_ebux_marketplace,
      }
    ],
    mysql_databases:[
      // {
      //   mysql_url: process.env.mysql_url,
      //   mysql_port: process.env.mysql_port,
      //   mysql_user: process.env.mysql_user,
      //   mysql_password: process.env.mysql_password,
      //   mysql_database: process.env.mysql_database_colpal,
      // }
    ]
  },

  development_nestle: {
    f_certificate: {
      type: process.env.type,
      project_id: process.env.project_id,
      private_key_id: process.env.private_key_id,
      private_key: process.env.private_key.replace(/\\n/g, "\n"),
      client_email: process.env.client_email,
      client_id: process.env.client_id,
      auth_uri: process.env.auth_uri,
      token_uri: process.env.token_uri,
      auth_provider_x509_cert_url: process.env.auth_provider_x509_cert_url,
      client_x509_cert_url: process.env.client_x509_cert_url,
      universe_domain: process.env.universe_domain,
    },

    databases: [
      {
        pgsql_url: process.env.pgsql_url_local,
        pgsql_port: process.env.pgsql_port_local,
        pgsql_user: process.env.pgsql_user_local,
        pgsql_password: process.env.pgsql_password_local,
        pgsql_database: process.env.pgsql_database_ebux_marketplace,
      }
    ],
    mysql_databases:[
      {
        mysql_url: process.env.mysql_url,
        mysql_port: process.env.mysql_port,
        mysql_user: process.env.mysql_user,
        mysql_password: process.env.mysql_password,
        mysql_database: process.env.mysql_database_colpal,
      }
    ]
  },
};

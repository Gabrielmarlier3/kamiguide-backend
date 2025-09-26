require('dotenv').config();

module.exports = {
  development: {
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT, 10),
    dialect: "postgres",
  }
  // production: {
  //   username: process.env.POSTGRES_USER_PROD,
  //   password: process.env.POSTGRES_PASSWORD_PROD,
  //   database: process.env.POSTGRES_DB_PROD,
  //   host: process.env.POSTGRES_HOST_PROD,
  //   port: parseInt(process.env.POSTGRES_PORT_PROD, 10),
  //   dialect: "postgres",
  // }
};

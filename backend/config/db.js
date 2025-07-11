require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });

const knex = require("knex")({
  client: "pg",
  connection: {
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
  },
});

module.exports = knex;  // ✅ Export knex correctly

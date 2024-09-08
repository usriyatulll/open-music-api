const Hapi = require("hapi");
const { Pool } = require('pg');  // Pastikan Pool diimpor dari 'pg'
const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});
require("dotenv").config();

const init = async () => {
  const server = Hapi.server({
    port: 5000,
    host: "localhost",
  });

  // Route untuk root path
  server.route({
    method: "GET",
    path: "/",
    handler: (request, h) => {
      return h
        .response({
          status: "success",
          message: "Welcome to the OpenMusic API!",
        })
        .code(200);
    },
  });

  // Route untuk mendapatkan semua album
  server.route({
    method: "GET",
    path: "/albums",
    handler: async (request, h) => {
      try {
        const result = await pool.query("SELECT * FROM albums");
        return {
          status: "success",
          data: {
            albums: result.rows,
          },
        };
      } catch (err) {
        console.error("Error fetching albums:", err);
        return h.response({ status: "fail", message: "Failed to fetch albums" }).code(500);
      }
    },
  });

  // Route untuk mendapatkan semua lagu
  server.route({
    method: "GET",
    path: "/songs",
    handler: async (request, h) => {
      try {
        const result = await pool.query("SELECT * FROM songs");
        return {
          status: "success",
          data: {
            songs: result.rows,
          },
        };
      } catch (err) {
        console.error("Error fetching songs:", err);
        return h.response({ status: "fail", message: "Failed to fetch songs" }).code(500);
      }
    },
  });

  // Mulai server
  try {
    await server.start();
    console.log("Server running on %s", server.info.uri);
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
};

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();

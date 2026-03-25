const { Pool } = require("pg");

const connectionString =
  process.env.DATABASE_URL ||
  "postgres://postgres:postgres@localhost:5432/eje2nube";

// En Render, Postgres casi siempre requiere SSL. Dependiendo del string de conexión,
// habilitamos SSL automáticamente.
const shouldUseSsl =
  process.env.RENDER === "true" ||
  /sslmode=require/i.test(connectionString) ||
  /ssl=true/i.test(connectionString);

const pool = new Pool({
  connectionString,
  ssl: shouldUseSsl ? { rejectUnauthorized: false } : undefined,
});

async function initDb() {
  // Tabla para el CRUD (tasks).
  // Ajusta el esquema si tu profe pide campos diferentes.
  await pool.query(`
    CREATE TABLE IF NOT EXISTS tasks (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `);
}

module.exports = { pool, initDb };


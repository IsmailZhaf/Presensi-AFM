require('dotenv').config();

/** @type { import("drizzle-kit").Config } */
export default {
  schema: './utils/schema.js',
  dialect: 'postgresql',
  dbCredentials: {
    migrationDir: './migrations',
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    url: process.env.POSTGRES_URL,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DATABASE,
    port: 5432,
    ssl: true,
  },
};

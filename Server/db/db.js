// db.js
const { Pool } = require("pg");

// Connection string from your database
const connectionString =
  "postgresql://neondb_owner:npg_4kbqac3HwmrK@ep-damp-hall-a8xa1gqz-pooler.eastus2.azure.neon.tech/neondb?sslmode=require&channel_binding=require";

// Set up a pool of connections
const pool = new Pool({
  connectionString: connectionString,
  ssl: {
    rejectUnauthorized: false, // Set to false to allow SSL connections to your database
  },
});

// Function to query the database
const query = async (text, params) => {
  try {
    const res = await pool.query(text, params);
    return res;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

module.exports = { query };

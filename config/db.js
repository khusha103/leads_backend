const mysql = require('mysql2/promise');
require('dotenv').config(); // Load environment variables

// Debug log to confirm env variables are loaded
console.log('Connecting to MySQL with config:', {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD ? '****' : undefined,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

// Create MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Gracefully handle app exit
process.on('SIGINT', async () => {
  try {
    await pool.end();
    console.log('MySQL connection pool closed.');
    process.exit(0);
  } catch (error) {
    console.error('Error closing MySQL pool:', error);
    process.exit(1);
  }
});

// Export query function
module.exports = {
  query: (...args) => pool.query(...args),
};

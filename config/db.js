const mysql = require('mysql2');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
};

const pool = mysql.createPool(dbConfig).promise();

process.on('SIGINT', () => {
  pool.end(() => {
    console.log('MySQL connection pool closed.');
    process.exit();
  });
});

module.exports = {
  query: async (...args) => {
    return pool.query(...args);
  }
};

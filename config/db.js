const mysql = require('mysql2');
require('dotenv').config();
 
const dbConfig = {
  host: 'localhost',           // or '127.0.0.1'
  port: 3306,                  // default MySQL port
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
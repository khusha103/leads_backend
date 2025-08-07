const mysql = require('mysql2/promise');

// Hardcoded MySQL credentials
const dbConfig = {
  host: '127.0.0.1',
  port: 3306,
  user: 'sales_ekarigar',
  password: 'sales_ekarigar@2025',
  database: 'sales_ekarigar'
};

// Debug log
console.log('Connecting to MySQL with config:', {
  host: dbConfig.host,
  user: dbConfig.user,
  password: '****',
  database: dbConfig.database,
  port: dbConfig.port
});

// Create connection pool
const pool = mysql.createPool({
  ...dbConfig,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Graceful shutdown
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

// Export query method
module.exports = {
  query: (...args) => pool.query(...args),
};

const mysql = require('mysql2');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 1, // CRITICAL: Only 1 connection per Vercel instance
  queueLimit: 0,
  connectTimeout: 10000, // Fail fast if connection takes > 10 seconds
  ssl: {
    rejectUnauthorized: false
  }
});

const promisePool = pool.promise();

pool.getConnection((err, connection) => {
  if (err) {
    console.error('❌ MySQL connection failed:', err.message);
    return;
  }
  console.log('✅ Cloud MySQL connected successfully');
  connection.release();
});

module.exports = promisePool;
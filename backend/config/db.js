const mysql = require('mysql2');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'mysql-7d4b74a-dazoratech-08a6.a.aivencloud.com',
  user: process.env.DB_USER || 'avnadmin',
  password: process.env.DB_PASSWORD, // Must come from Vercel env vars
  database: process.env.DB_NAME || 'defaultdb',
  port: process.env.DB_PORT || 14020,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: {
    rejectUnauthorized: false // Required for Aiven cloud database
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
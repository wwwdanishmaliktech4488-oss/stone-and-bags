const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const promisePool = pool.promise();

// Test the connection on startup with a real error message
pool.getConnection((err, connection) => {
  if (err) {
    console.error('❌ MySQL connection failed:');
    console.error('   code:    ', err.code);
    console.error('   errno:   ', err.errno);
    console.error('   message: ', err.message);
    return;
  }
  console.log('✅ MySQL connected successfully');
  connection.release();
});

module.exports = promisePool;
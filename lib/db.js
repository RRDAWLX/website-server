let mysql = require('mysql');

let pool = mysql.createPool({
  connectionLimit: 10,
  host: '127.0.0.1',
  port: '3306',
  user: 'root',
  password: '123',
  database: 'website'
});

module.exports.pool = pool;

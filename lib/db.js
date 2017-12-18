let mysql = require('mysql'),
  config = require('../configuration').database;

let pool = mysql.createPool(config);

module.exports.pool = pool;

let mysql = require('mysql'),
  config = require('../configuration').database;

let pool = mysql.createPool(config);

/*pool.connect = function(cb) {
  if (typeof cb !== 'function') {
    throw new Error('The argument should be a function!');
  }

  this.getConnection((err, connection) => {
    if (err) {
      res.stdjson({
        status: 0,
        error: 1,
        msg: 'database connect error'
      });
    } else {
      connection.cQuery = customQuery;
      cb(connection, err);
    }
  });
};

function customQuery(...args) {
  let cb = args[args.length - 1];
  args[args.length - 1] = (err, result) => {
    if (err) {
      this.release();
      res.stdjson({
        status: 0,
        error: 1,
        msg: 'query error'
      });
    } else {
      cb(result, err);
    }
  };
  this.query(...args);
}*/

module.exports.pool = pool;

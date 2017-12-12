let express = require('express');
let router = express.Router();
let pool = require('../lib/db').pool;
let responseWrapper = require('../lib/response-wrapper');

/* GET users listing. */
router.get('/info', (req, res, next) => {
  pool.getConnection((err, connection) => {
    connection.release();

    if (err) {
      return next(err);
    }

    connection.query(
      'select * from user',
      (err, results) => {
        if (err) {
          return next(err);
        }
        // console.log(JSON.stringify(rows));
        res.send(responseWrapper({
          status: 1,
          data: results
        }));
      }
    );
  });
});

module.exports = router;

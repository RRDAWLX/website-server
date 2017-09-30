let express = require('express');
let router = express.Router();
let db = require('../lib/db');
let responseWrapper = require('../lib/response-wrapper');

/* GET users listing. */
router.get('/info', (req, res, next) => {
  db.query(
    'select * from user where user=?',
    ['rrdawlx'],
    (err, rows) => {
      if (err) {
        throw err;
      }
      // console.log(JSON.stringify(rows));
      res.send(responseWrapper({
        status: 1,
        data: rows[0]
      }));
    }
  );
});

module.exports = router;

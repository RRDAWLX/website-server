let express = require('express');
let router = express.Router();
let pool = require('../lib/db').pool;
let responseWrapper = require('../lib/response-wrapper');

/* GET users listing. */
router.post('/register', (req, res, next) => {
  let username = req.body.username,
      passward = req.body.passward;

  if (username && passward) {

  }
});

module.exports = router;

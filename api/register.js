let express = require('express');
let router = express.Router();
let db = require('../lib/db');
let responseWrapper = require('../lib/response-wrapper');

/* GET users listing. */
router.get('/register', (req, res, next) => {
  let username = req.body.username,
      passward = req.body.passward;

  if (username && passward) {
    
  }
});

module.exports = router;

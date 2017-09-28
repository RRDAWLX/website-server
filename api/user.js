let express = require('express');
let router = express.Router();

/* GET users listing. */
router.get('/info', function(req, res, next) {
  res.send({id: 12345, name: 'rrdawlx'});
});

module.exports = router;

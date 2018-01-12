let pool = require('../lib/db').pool;
let routes = require('./routes');
let router = require('express').Router();

routes.forEach(route => {
  route(router, pool);
});

module.exports = router;
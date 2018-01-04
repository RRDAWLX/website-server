let pool = require('../lib/db').pool;
let responseWrapper = require('../lib/response-wrapper');
let routes = require('./routes');
let router = require('express').Router();

routes.forEach(route => {
  route(router, responseWrapper, pool);
});

module.exports = router;
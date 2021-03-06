let express = require('express'),
  path = require('path'),
  favicon = require('serve-favicon'),
  logger = require('morgan'),
  cookieParser = require('cookie-parser'),
  bodyParser = require('body-parser'),
  errorhandler = require('errorhandler'),
  apiRouter = require('./api/router'),
  globalConfig = require('./configuration'),
  dbConnect = require('./lib/middleware/db-connect'),
  standardJson = require('./lib/middleware/standard-json');

let app = express();

app.use(favicon(path.join(globalConfig.htmlPath, 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// static resources
app.use('/static/', express.static(globalConfig.staticResourcePath));
app.use('/pages/', express.static(globalConfig.htmlPath));
app.use('/images/', express.static(globalConfig.imagesPath)) ;

// api
app.use('/api', dbConnect, standardJson, apiRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(errorhandler());

module.exports = app;

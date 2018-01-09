let express = require('express'),
  path = require('path'),
  favicon = require('serve-favicon'),
  logger = require('morgan'),
  cookieParser = require('cookie-parser'),
  bodyParser = require('body-parser'),
  errorhandler = require('errorhandler'),
  apiRouter = require('./api/router'),
  globalConfig = require('./configuration');

let app = express();

app.use(favicon(path.join(__dirname, globalConfig.htmlPath, 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// static resources
app.use('/static/', express.static(path.resolve(__dirname, globalConfig.staticResourcePath)));
app.use('/pages/', express.static(path.resolve(__dirname, globalConfig.htmlPath)));
app.use('/images/', express.static(globalConfig.imagesPath)) ;

// api
app.use('/api', apiRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(errorhandler());

module.exports = app;

let express = require('express'),
  path = require('path'),
  favicon = require('serve-favicon'),
  logger = require('morgan'),
  cookieParser = require('cookie-parser'),
  bodyParser = require('body-parser'),
  errorhandler = require('errorhandler'),
  apiConfig = require('./api/config'),
  globalConfig = require('./configuration');

let app = express();

app.use(favicon(path.join(__dirname, 'front-end', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// static resources
app.use('/static/', express.static(path.resolve(__dirname, globalConfig.staticResourcePath)));
app.use('/pages/', express.static(path.resolve(__dirname, globalConfig.htmlPath)));

// api
apiConfig.forEach(api => {
  app.use(api.path, api.handler);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(errorhandler());

module.exports = app;

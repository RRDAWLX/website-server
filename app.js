let express = require('express');
let path = require('path');
let favicon = require('serve-favicon');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let errorhandler = require('errorhandler');

let app = express();

app.use(favicon(path.join(__dirname, 'front-end', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
// static resources
app.use('/static/', express.static(path.join(__dirname, 'front-end')));
app.use('/pages/', express.static(path.join(__dirname, 'front-end')));
// api
app.use('/api/user', require('./api/user'));
app.use('/api/register', require('./api/register'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(errorhandler());

module.exports = app;

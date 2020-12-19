var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

global.__version = require('./package.json').version;
global.__projdir = __dirname;

var mysqlMiddleware = require('./middlewares/mysql');
var redisMiddleware = require('./middlewares/redis');

var userRouter = require('./routes/user');
var eventRouter = require('./routes/event');
var sessionRouter = require('./routes/session');
var ticketRouter = require('./routes/ticket');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(mysqlMiddleware); // put mysql.pool instance into req.mysql
app.use(redisMiddleware); // put redis instance into req.redis

app.use('/api/user', userRouter);
app.use('/api/event', eventRouter);
app.use('/api/session', sessionRouter);
app.use('/api/ticket', ticketRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

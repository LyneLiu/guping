var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
// var mongoose = require('mongoose');
var session = require('express-session');
// var MongoStore = require('connect-mongo')(session);
var RedisStore = require('connect-redis')(session);

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

//设置跨域访问
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/*
app.use(session({
  secret: 'guping sincerefly my name is lxd',
  key: 'balabala',
  cookie: {maxAge: 1000 * 60 * 60 * 24 * 30},
  store: new MongoStore({
    db: 'guping',
    autoReconnection: true
    // mongooseConnection: mongoose.connection
  })
}));
*/

options = {
  host: "127.0.0.1",
  port: 6379,
  db: "test_session"
}

app.use(session({
  cookie: {maxAge: 1000 * 60 * 60 * 24 * 30},
  store: new RedisStore(),
  secret: "123sjfksfjjk"
  // resave: true,
  // saveUninitialized: true
}));

/*
app.use(function (req, res, next) {
  console.log('12444');
  if (!req.session) {
    return next(new Error('oh no'))
  }
  next()
});
*/

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;

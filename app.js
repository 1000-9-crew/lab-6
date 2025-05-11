const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const session = require('express-session');
require("dotenv").config();

var app = express();

app.set('views', [path.join(__dirname, 'views'), path.join(__dirname, 'views/partials')]);
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 } // 1 week
  })
)

app.use("/api", require('./routes/api/apiRouter'));
app.use("/", require('./routes/homeRouter'));
app.use("/auth", require('./routes/authRouter'));
app.use("/student", require('./routes/studentRouter'));
app.use("/teacher", require('./routes/teacherRouter'));
app.use(express.static(path.join(__dirname, 'public'), { extensions: ['html'] }));


app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);

  if (req.originalUrl.startsWith('/api')) {
    // Return JSON for API routes
    return res.json({
      error: {
        message: err.message || "Internal Server Error",
        ...err
      }
    });
  }

  // Render error page for non-API routes
  res.render('error');
});

module.exports = app;

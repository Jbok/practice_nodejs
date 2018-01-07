module.exports = function(){
  var express = require('express');
  var session = require('express-session');
  var MySQLStore = require('express-mysql-session')(session);
  var bodyParser = require('body-parser');
  var app = express();
  app.set('views', './views/mysql');
  app.set('view engine', 'jade');
  app.use(bodyParser.urlencoded({extended: false}));
  app.use(session({
    secret: '123@#@#$!@%$)(*&YThfjadsf1123!@#@!$', //session encryption key
    resave: false, //set whether to save sessions at al times
    saveUninitialized: true, //make a saveuninitialized state before saving the session.
    store: new MySQLStore({
      host:'localhost',
      port:3306,
      user:'root',
      password:'akzb!@#',
      database:'o2'
    })
  }));

  return app;
}

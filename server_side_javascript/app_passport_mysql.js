var express = require('express');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var bodyParser = require('body-parser');
var pbkdf2 = require('pbkdf2-password');
var bkfd2Password = require("pbkdf2-password");
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var hasher = bkfd2Password();
var app = express();
var mysql = require('mysql');
var conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'akzb!@#',
  database: 'o2'
});
conn.connect();
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
app.use(passport.initialize());
app.use(passport.session());
//Local Routes
app.get('/auth/logout', function(req, res){
  req.logout();
  req.session.save(function(){
    res.redirect('/welcome');
  })
})
app.get('/welcome', function(req, res){
  if(req.user && req.user.displayName){
     res.send(`<h1>Hello, ${req.user.displayName}<h1><a href="/auth/logout">logout</a>`);
  } else{
   res.send(`
     <h1>Welcome</h1>
     <ul>
        <li>
          <a href="/auth/login">Login</a>
        </li>
        <li>
          <a href="/auth/register">Register</a>
        </li>
      </ul>`)
  }
})
app.get('/auth/register', function(req, res){
  var output = `
    <h1>Register</h1>
      <form action="/auth/register" method="post">
        <p>
          <input type="text" name="username" placeholder="username"></p>
        <p>
          <input type="password" name="password" placeholder="password"></p>
        <p>
          <input type="text" name="displayName" placeholder="displayName"></p>
        <p>
          <input type="submit"></p>
      </form>
  `;
  res.send(output);
})


app.post('/auth/register', function(req, res){
  hasher({password:req.body.password}, function(err, pass, salt, hash){
    var user ={
      authID: 'local:'+req.body.username,
      username: req.body.username,
      password: hash,
      salt: salt,
      displayName: req.body.displayName,
      email: ''
    };
    var sql = 'INSERT INTO users SET ?';
    conn.query(sql, user, function(err, results){
      if(err){
        console.log(err);
        res.status(500);
      } else {
        res.redirect('/welcome');
      }
    });

    // req.login(user, function(err){
    //   if(err) {return next(err);}
    //   return res.redirect('/welcome')
    // })
  });
});
app.get('/auth/Login', function(req, res){
  var output=`<h1>Login</h1><form action="/auth/login" method="post"><p><input type="text" name="username" placeholder="username"></p><p><input type="password" name="password" placeholder="password"></p><p><input type="submit"></p></form>
  <a href= "/auth/facebook">facebook</a>
  `;
  res.send(output);
})



//passportjs.org/docs/username-password
passport.serializeUser(function(user, done){//if done(null, user)
  console.log('serializeUser', user);
  done(null, user.authId);
});
passport.deserializeUser(function(id, done){//search user
  console.log('deserializeUser', id);
  var sql = 'SELECT * FROM users WHERE authId=?';
  conn.query(sql, [id], function(err, results, fields){
    if (err) {
      console.log(err);
      done('There is no user');//if terminate app in facebook login state, var user's informations are disapear but sessions in file exisit => There is error!!
    } else{
      return done(null, results[0]);
    }
  });
});

//passport local strategy
passport.use(new LocalStrategy(
  function(username, password, done){
    var uname = username;
    var pwd = password;
    var sql = 'SELECT * FROM users WHERE authId=?';
    conn.query(sql, ['local:'+uname], function(err, results, fields){
      if(err){
        return done('error There is no user.');
      } else {
        var user = results[0];
        if (user){
          return hasher({password: pwd, salt:user.salt}, function(err, pass, salt, hash){
            if(hash === user.password){
              console.log ('LocalStrategy', user);
              done(null, user);
            }else{
              done(null, false);
            }
          })
        } else{
          done('error There is no user.');
        }
      }
    })
  }
));
//Facebook Strategy
passport.use(new FacebookStrategy({
    clientID: '308332733010662',
    clientSecret: '7625918088d275f3aeab04eee174a40a',
    profileFields: ['email', 'displayName'],
    callbackURL: "/auth/facebook/callback"
  }, function(accessToken, refreshToken, profile, done) {
    console.log(profile);
    var sql = 'SELECT * FROM users WHERE authId = ?';
        var authId = 'facebook:'+profile.id;
    conn.query(sql, [authId], function(err, results, fields){
      if(results.length>0){
        done(null, results[0]);
      } else{
        var newuser = {
          'authId':authId,
          'displayName':profile.displayName,
          'email':profile.emails[0].value
        }
        var sql = 'INSERT INTO users SET ?';
        conn.query(sql, newuser, function(err, results, fields){
          if(err){
            console.log(err);
            done('Error');
          } else{
            done(null, newuser);
          }
        })
      }
    })
  }
));
//Local Routes
app.post('/auth/login', passport.authenticate('local',
{
  successRedirect: '/welcome',
  failureRedirect: '/auth/login',
  failureFlash: false
}));
//Facebook Routes
app.get('/auth/facebook', passport.authenticate('facebook',{
  scope:'email'
}));
app.get('/auth/facebook/callback',passport.authenticate('facebook',
{
  successRedirect: '/welcome',
  failureRedirect: '/auth/login'
}))


app.listen(3003, function(){
  console.log('Connected 3003 port!!!');
})

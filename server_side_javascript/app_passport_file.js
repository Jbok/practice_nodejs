var express = require('express');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var bodyParser = require('body-parser');
var pbkdf2 = require('pbkdf2-password');
var bkfd2Password = require("pbkdf2-password");
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var hasher = bkfd2Password();
var app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({
  secret: '123@#@#$!@%$)(*&YThfjadsf1123!@#@!$', //session encryption key
  resave: false, //set whether to save sessions at al times
  saveUninitialized: true, //make a saveuninitialized state before saving the session.
}));
app.use(passport.initialize());
app.use(passport.session());
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
var users =[
  {
    username:'sipsyong',
    password: '/0st/MwO93Pb7zhSbEDDuekrwPdZX6c1QEBReEdVBltmbgTVfCH2aUplGmOYm1RsJGNQDSpfc2N6u5aTgSndqHP0pajkYD8nhHGwHn0p6bPrDzkxXSDeUaTYa/Gs552a5cWhuysGPw/CSBjdWCXaOZpIN65IeZmDUk3pC5rGK4E=',
    salt:'O8tiBxvrIhkYuPhmZztf1+JrVEkQTvN8biR0wYJErql24wojXml/Xi9rH7u7ctglIXkHKioSjheogIAybaSEyA==',
    displayName:'Nick sipsyong'
  }
];

app.post('/auth/register', function(req, res){
  hasher({password:req.body.password}, function(err, pass, salt, hash){
    var user ={
      username: req.body.username,
      password: hash,
      salt: salt,
      displayName: req.body.displayName
    };
    users.push(user);
    req.login(user, function(err){
      req.login(user, function(err){
        if(err) {return next(err);}
        return res.redirect('/welcome')
      })
    })
  });
});
app.get('/auth/login', function(req, res){
  var output=`<h1>Login</h1><form action="/auth/login" method="post"><p><input type="text" name="username" placeholder="username"></p><p><input type="password" name="password" placeholder="password"></p><p><input type="submit"></p></form>`;
  res.send(output);
})
//passportjs.org/docs/username-password
passport.serializeUser(function(user, done){//if done(null, user)
  console.log('serializeUser', user);
  done(null, user.username);
});
passport.deserializeUser(function(id, done){//search user
  console.log('deserializeUser', id);
  for(var i=0; i<users.length; i++){
    var user = users[i];
    if(user.username === id){
      return done(null, user);
    }
  }
});
//passport local strategy
passport.use(new LocalStrategy(
  function(username, password, done){
    var uname = username;
    var pwd = password;
    for(var i=0; i<users.length; i++){
      var user=users[i];
      if(uname === user.username){
        return hasher({password: pwd, salt:user.salt}, function(err, pass, salt, hash){
          if(hash === user.password){
            console.log ('LocalStrategy', user);
            done(null, user);
          }else{
            done(null, false);
          }
        })
      }
    }
    done(null,false);
  }
));
app.post('/auth/login', passport.authenticate('local',
{
  successRedirect: '/welcome',
  failureRedirect: '/auth/login',
  failureFlash: false
}));
// app.post('/auth/login', function(req, res){
//   var uname = req.body.username;
//   var pwd = req.body.password;
//   for(var i=0; i<users.length; i++){
//     var user=users[i];
//     if(uname === user.username){
//       return hasher({password: pwd, salt:user.salt}, function(err, pass, salt, hash){
//         if(hash === user.password){
//           req.session.displayName = user.displayName;
//           return req.session.save(function(){
//             res.redirect('/welcome');
//           })
//         }else{
//           res.send('Who are you? <a href="/auth/login">login</a>')
//         }
//       })
//     }
//   }
//   res.send('Who are you? <a href="/auth/login">login</a>');
// })


app.listen(3003, function(){
  console.log('Connected 3003 port!!!');
})

module.exports = function(passport){
  var bkfd2Password = require("pbkdf2-password");
  var hasher = bkfd2Password();
  var conn = require('../../config/mysql/db')();
  var route = require('express').Router();

  //Local Routes
  route.post('/login', passport.authenticate('local',
  {
    successRedirect: '/topic',
    failureRedirect: '/auth/login',
    failureFlash: false
  }));
  //Facebook Routes
  route.get('/facebook', passport.authenticate('facebook',{
    scope:'email'
  }));
  route.get('/facebook/callback',passport.authenticate('facebook',
  {
    successRedirect: '/topic',
    failureRedirect: '/login'
  }))

  // route.get('/welcome', function(req, res){
  //   console.log('=================welcome=================');
  //   console.log('req user, ', req.user);
  //   res.render('auth/welcome', {req: req, res: res});
  // })

  route.post('/register', function(req, res){
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
          req.login(user, function(err){
            req.session.save(function(){
              res.redirect('/topic')
            })
          })
        }
      });
    });
  });

  route.get('/register', function(req, res){
    var sql = 'SELECT * FROM topic';
    conn.query(sql, function(err, topics, fields){
      res.render('auth/register', {topics:topics});
    });
  })

  route.get('/login', function(req, res){
    var sql = 'SELECT * FROM topic';
    conn.query(sql, function(err, topics, fields){
      res.render('auth/login', {topics:topics});
    });
  })

  //Local Routes
  route.get('/logout', function(req, res){
    req.logout();
    req.session.save(function(){
      console.log('redirect');
      res.redirect('/topic');
    })
  })


  return route;
};

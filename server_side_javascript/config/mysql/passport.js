module.exports = function (app){
  var conn = require('./db')();
  var bkfd2Password = require("pbkdf2-password");
  var passport = require('passport');
  var LocalStrategy = require('passport-local').Strategy;
  var FacebookStrategy = require('passport-facebook').Strategy;
  var hasher = bkfd2Password();

  app.use(passport.initialize());
  app.use(passport.session());

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
      conn.query(sql, ['local:'+uname], function(err, results){
        if(err){
          return done('There is no user.');
        }
        var user = results[0];
        return hasher({password:pwd, salt:user.salt}, function(err, pass, salt, hash){
          if(hash === user.password){
            console.log('LocalStrategy', user);
            done(null, user);
          } else {
            done(null, false);
          }
        });
      });
    }
    // function(username, password, done){
    //   var uname = username;
    //   var pwd = password;
    //   var sql = 'SELECT * FROM users WHERE authId=?';
    //   conn.query(sql, ['local:'+uname], function(err, results, fields){
    //     if(err){
    //       return done('error There is no user.');
    //     } else {
    //       var user = results[0];
    //       if (user){
    //         return hasher({password: pwd, salt:user.salt}, function(err, pass, salt, hash){
    //           if(hash === user.password){
    //             console.log ('LocalStrategy', user);
    //             done(null, user);
    //           }else{
    //             done(null, false);
    //           }
    //         })
    //       } else{
    //         done('error There is no user.');
    //       }
    //     }
    //   })
    // }
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

  return passport;
}

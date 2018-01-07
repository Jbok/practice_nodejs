module.exports = function(){
    var route = require('express').Router();
    var conn = require('../../config/mysql/db')();
  //Routing to add
  route.get('/add', function(req, res){
    var sql = 'SELECT * FROM topic';
    conn.query(sql, function(err, topics, fields){
      if(err){
        console.log(err);
        res.status(500).send('Internal Server Error');
      } else{
        res.render('topic/add', {topics:topics, user:req.user});
      }
    })
  })
  route.post('/add', function(req, res){
    var title = req.body.title;
    var description = req.body.description;
    var author = req.body.author;
    var sql = 'INSERT INTO topic (title, description, author) VALUES(?, ?, ?)';
    var params = [title, description, author];
    conn.query(sql, params, function(err, results, fields){
      if(err){
        console.log(err);
        res.status(500).send('Internal Server Error');
      } else{
        res.redirect('/topic/'+results.insertId);
      }
    })
  })

  //Routing to edit
  route.get('/:id/edit', function(req, res){
    var sql = 'SELECT id,title FROM topic';
    conn.query(sql, function(err, topics, fields){
      var id = req.params.id;
      if(id){
        var sql = 'SELECT * FROM topic WHERE id=?';
        conn.query(sql, [id],function(err, topic, fields){
          if(err){
            console.log(err);
            res.status(500).send('Internal Server Error');
          } else{
            console.log(topic);
            res.render('topic/edit', {topics:topics, topic:topic[0], user:req.user});
          }
        })
      } else{
        console.log('There is no id.');
        res.status(500).send('Internal Server Error');
      }
    })
  })
  route.post('/:id/edit', function(req, res){
    var title = req.body.title;
    var description = req.body.description;
    var author = req.body.author;
    var id = req.params.id;
    var sql = 'UPDATE topic SET title=?, description=?, author=? WHERE id=?';
    var params = [title, description, author, id];
    conn.query(sql, params, function(err, results, fields){
      if(err){
        console.log(err);
        res.status(500).send('Internal Server Error');
      } else{
        res.redirect('/topic/'+id);
      }
    })
  })

  //Delete contents
  route.get('/:id/delete', function(req, res){
    var sql = 'SELECT * FROM topic';
    conn.query(sql, function(err, topics, fields){
      var id = req.params.id;
      if(id){
        var sql = 'SELECT * FROM topic WHERE id=?';
        conn.query(sql, [id], function(err, topic, fields){
          if(err){
            console.log(err);
            res.status(500).send('Internal Server Error');
          } else{
            if(topic.length === 0){
              console.log('There is no record. ');
              res.status(500).send('Internal Server Error');
            }else{
              res.render('topic/delete', {topics:topics, topic:topic[0], user:req.user});
            }
          }
        })
      } else{
        console.log(err);
        res.status(500).send('Internal Server Error');
      }
    })
  })
  route.post('/:id/delete', function(req, res){
    var id = req.params.id;
    var sql = 'DELETE FROM topic WHERE id=?';
    conn.query(sql, [id], function(err, results, fields){
      if(err){
        console.log(err);
        res.status(500).send('Internal Server Error');
      } else{
        res.redirect('/topic/'+results.insertId);
      }
    })
  })
  //Show post lists.
  route.get(['', '/:id'], function(req, res){
    var sql = 'SELECT id, title FROM topic';
    conn.query(sql, function(err, topics, fields){
      var id = req.params.id;
      if(id){
        var sql = 'SELECT * FROM topic WHERE id=?';
        conn.query(sql, [id], function(err, topic, fields){
          if(err){
            console.log(err);
            res.status(500).send('Internal Server Error');
          } else{
            res.render('topic/view', {topics:topics, topic:topic[0], user:req.user})
          }
        })
    } else{
      res.render('topic/view', {topics:topics, user:req.user});
    }
    });
  })

  return route;
}

var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var _storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb){
    cb(null, file.originalname + '-' + Date.now())
  }
})
var upload = multer({ storage: _storage})
var fs = require('fs');
var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.locals.pretty = true;
app.set('views', './views_file');
app.set('view engine', 'jade');
// app.get('/topic/new',function(req,res){
//   res.render('new');
// })
app.get('/upload', function(req, res){
  res.render('upload');
})
app.post('/upload', upload.single('userfile'), function(req, res){
  res.send('Uploaded: ' + req.file.originalname);
})
app.get(['/topic', '/topic/:id'], function(req, res){
  var id = req.params.id;
  fs.readdir('data', function(err, files){
    if(err){
      console.log(err);
      res.status(500).send('Internal Server Error data');
    }
      if(id){//There is id
        if(id==='new'){
          res.render('new', {topics: files})
        }
        else{
          fs.readFile('data/'+id, 'utf8', function(err, data){
            if(err){
              console.log(err);
              res.status(500).send('Internal Server Error data+id');
            }
            res.render('view', {topics: files, title: req.params.id, text: data})
          })
        }
      }
      else{
        //There is no id mainpage
        res.render('view', {topics: files, title: 'Welcome', text: 'Hello, JavaScript for server'})
      }
  })
})
app.post('/topic', function(req,res){
  var title = req.body.title;
  var description = req.body.description;
  fs.writeFile('data/'+title, description, function(err){
    if(err){
      console.log(err);
      res.status(500).send('Internal Server Error');
    }
    res.redirect('/topic/'+title);
  });
})
app.listen(3000, function(){
  console.log('Connected, 3000 port!');
})

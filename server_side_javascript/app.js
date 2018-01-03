var express = require('express');
var bodyParser = require('body-parser') //use bodyparser module
var app = express();

app.locals.pretty = true; //make temp.jade's code pretty
app.set('views', './views');
app.set('view engine', 'jade');
app.use(express.static('public')) //static file location
app.use(bodyParser.urlencoded({extended: false})) //
///////usage of post////////////////
app.get('/form',function(req,res){
  res.render('form');
})
app.get('/form_receiver', function(req,res){
  var title= req.query.title;
  var description = req.query.description;
  res.send(title+','+description)
})
app.post('/form_receiver', function(req,res){
  var title = req.body.title;
  var description = req.body.description;
  res.send(title+','+description)
  res.send('Hello, POST');
})
////////////////////////////////////

///////usage of query object////////
app.get('/topic/:id',function(req,res){
  var topics=[
    'Javascript is...',
    'Nodejs is ...',
    'Express is ...'
  ];
  var output =`
    <a href="/topic/0">JavaScript</a><br>
    <a href="/topic/1">Nodejs</a><br>
    <a href="/topic/2">Express</a><br><br>
    ${topics[req.params.id]}
  `
  res.send(output);
})
app.get('/topic/:id/:mode', function(req,res){
  res.send(req.params.id+','+req.params.mode);
})
////////////////////////////////////
const port = 3000;
app.get('/template', function(req,res){
  res.render('temp', {time:Date(), _title:'Jade'});
});
app.get('/', function(req, res){
  res.send('Hello home page');
});
app.get('/dynamic', function(req,res){
  var time = Date();
  var lis ='';
  for(var i=0; i<5; i++){
    lis = lis + '<li>coding</li>';
  }
  var output =`
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      <title></title>
    </head>
    <body>
      Hello, Dynamic!
      <ul>
      ${lis}
      </ul>
      ${time};
    </body>
  </html>`;
  res.send(output);
});
app.get('/route',function(req, res){
  res.send('Hello Tools, <img src="tools.png">')
});
app.get('/login', function(req, res){
  res.send('<h1>Login please<h1>');
});
app.listen(port, function(){
  console.log('Connected %d port!',port);
});

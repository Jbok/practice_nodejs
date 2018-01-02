var express = require('express');
var app = express();

app.locals.pretty = true; //make temp.jade's code pretty
app.set('views', './views');
app.set('view engine', 'jade');
app.use(express.static('public')) //static file location
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

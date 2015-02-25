var express = require('express'),
    app = express(),
    haml = require('haml'),
    fs = require('fs');

// view engine
app.set('views', './views');
app.set('view engine', 'haml');
// basic routing
app.get('/', function(req,res) {
  res.send('Hello there!');
});

app.get('/name/:name', function(req,res) {
  
  // res.send('Yo ' + req.params.name); // базовый пример переменных роутинга
  
  var view = fs.readFileSync('views/greeting.haml', 'utf8');            //загружаем вью из файла

  res.setHeader("Content-Type", "text/html; charset=utf8");             // чтобы воспринялся как html и в utf8
  res.end( haml.render(view, { locals:{ name: req.params.name } }) );   // рендерим и отправляем вью
});

var server = app.listen(3500);
console.log('Server is running on port 3500');
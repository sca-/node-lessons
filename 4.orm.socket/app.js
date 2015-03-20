var express = require('express'),
    app = express(),
    server = require('http').Server(app), // выделяем http.server из express-приложения для передачи в socket.io
    orm = require('orm'), // модуль для работы с базой данных
    io = require('socket.io')(server);

// стандартно задаем движок для вывода вью jade
app.set('views', './views');
app.set('view engine', 'jade');

// описываем подключение к бд. опция define описывает функцию, 
// которая при каждом запросе связывает бд с объектом models,
// который в свою очередь можно достать из объекта запроса (req)
app.use(orm.express("sqlite:db.sqlite", {
  define: function(db,models,next) {
    models.animals = db.define("animals", {
      name: String,
      gender: String,
      age: Number,
      nickname: String,
      food: String
    });
    // не забываем продолжить цепочку middlewares с помощью коллбека next, а то запрос застрянет!
    next();
  }
}));

app.get('/', function(req,res) {
  // будем выводить всех зверей. <model>.find ищет в таблице
  req.models.animals.find({}, function(err,results){
    res.render('index', { animals: results });
  });
});

// с помощью этого запроса будем добавлять в бд животных.
// !! в реальности нельзя завязывать манипуляции с бд
// на get-пути. чтобы создавать/менять/удалять информацию
// из бд, используйте post-пути!!
app.get('/new/:name/:nickname/:age/:gender/:food', function(req,res){
  // создаем запись в бд
  req.models.animals.create({ 
    name: req.params.name,
    nickname: req.params.nickname,
    age: req.params.age,
    gender: req.params.gender,
    food: req.params.food
  }, function(err, results){
    if(err) {
      console.log("Ошибка в записи в таблицу");
      res.end("Sorry, an error occured")
    } else {
      res.end("New animal accepted!")
    }
  });
});

server.listen('4000');
console.log('Server is listening on port 4000');

io.on('connection', function(socket){
  console.log(socket.id + " connected");
});
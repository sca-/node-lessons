var express = require('express'),   //1
    app = express(),                //1
    // haml = require('haml'),         //2
    // fs = require('fs'),             //2
    url = require('url'),           //2
    cookieParser = require('cookie-parser'),  //4
    bodyParser = require('body-parser'),      //4
    passport = require('passport'), //4
    LocalStrategy = require('passport-local').Strategy, //4
    flash = require('connect-flash'), //4
    orm = require('orm');

// view engine
app.set('views', './views');        //2
app.set('view engine', 'jade');     //2

// middleware -- 3
app.use(function(req,res,next){
  var pathname = url.parse(req.url).pathname;
  console.log("Стучат в " + pathname);
  next();
});

// orm middleware -- 5
app.use(orm.express("sqlite:db.sqlite", {
    define: function (db, models, next) {
        models.user = db.define("user", { 
          username: String,
          password: String
        });
        next();
    }
}));

app.use(function(req,res,next){
  User = req.models.user;
  next();
});

// статичный контент -- 2
app.use(express.static('public'));

// passport middleware -- 4
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(require('express-session')({ secret: '123456secretkey' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// auth strategy -- 4
passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password'
  },
  function( username, password, done) {
    console.log(username + ' пытается войти');
    // user = { username: 'user', password: 'pass' };
    User.find({ username:username, password:password }, function(err, results) {
      if(!results || results.length < 1)
        return done(null, false, { message: 'Неверное имя пользователя или пароль' })
      else
        return done(null, results[0]);
    });
    // if(username == user.username && password == user.password) {
    //   console.log(username + ' успешно вошел');
    //   return done(null, user);
    // } else if (username == user.username) {
    //   console.log(username + ' ввел неверный пароль');
    //   return done(null, false, { message: 'Неверный пароль'});
    // } else {
    //   console.log(username + ' не найден');
    //   return done(null, false, { message: 'Пользователь не найден' });
    // }
  }
));

passport.serializeUser(function(user, done) {
  console.log('Сериализуем пользователя');
  done(null, user.username);
});
passport.deserializeUser(function(id, done) {
  console.log('Десериализуем пользователя ' + id);
  User.find({username:id},function(err,results){
    if(!results || results.length < 1)
      done(null, null);
    else
      done(null, results[0])
  });
  //done(null, id == 'user' ? { username: 'user' } : null);
});

// basic routing -- 1
app.get('/', function(req,res) {
  res.send('Hello there! <br/> Здесь лежит <a href="/some/secret">некий секрет</a>');
});

// new user -- 5
app.get('/register', function(req,res) {
  res.render('registration-form');
});

app.post('/register', function(req,res) {
  res.setHeader("Content-Type", "text/html; charset=utf8");
  req.models.user.count({username: req.body.username}, function(err,results) {
    if(results && results > 0) {
      res.end('Простите, но такой пользователь уже существует');
    } else {
      req.models.user.create({ username:req.body.username, password:req.body.password }, function(err, results){
        if(err) {
          res.end('Произошла ошибка');
          console.log(err);
        }
        else
          res.end('Вы успешно зарегистрировались!');
      });
    }
  });
});

app.get('/name/:name', function(req,res) {
  
  // res.send('Yo ' + req.params.name); // базовый пример переменных роутинга -- 1
  
  // haml -- 2
  var view = fs.readFileSync('views/greeting.haml', 'utf8');            //загружаем вью из файла

  res.setHeader("Content-Type", "text/html; charset=utf8");             // чтобы воспринялся как html и в utf8
  res.end( haml.render(view, { locals:{ name: req.params.name } }) );   // рендерим и отправляем вью
});

// auth -- 4
app.get('/some/secret',function(req,res){
  res.setHeader("Content-Type", "text/html; charset=utf8");
  if(req.isAuthenticated())
    res.end('Твой секрет в безопасности, ' + req.user.username);
  else
    res.end('Упс, тебе сюда нельзя. Может, хочешь <a href="/login">войти</a>?');
});

app.get('/login', function(req,res){
  var error = req.flash('error');
  // var view = fs.readFileSync('views/login-form.haml', 'utf8');
  // res.setHeader("Content-Type", "text/html; charset=utf8");
  // res.end( haml.render(view, { locals:{ flash: error  }}) );
  res.render('login-form', { flash: error });
});

app.post('/login', passport.authenticate('local', { successRedirect: '/',
                                                  failureRedirect: '/login',
                                                  failureFlash: true }))

// server start -- 1
var server = app.listen(3500);
console.log('Server is running on port 3500');
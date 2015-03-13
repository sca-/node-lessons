var express = require('express'),
	app = express(),
	passport = require('passport'),
	cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    LocalStrategy = require('passport-local').Strategy,
    _ = require('underscore');

app.set('views', './views');
app.set('view engine', 'jade'); 

app.use(express.static('assets'));
app.use(express.static('public'));

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(require('express-session')({ secret: 'ufhgiufighireuthiuhgjkfdhgrueiht' }));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(

	{ 
		usernameField: 'username',
    	passwordField: 'password' 
    },

    function(username, password, done){

    	var userlist = [{ username:'cat', password:'meow' },
    					{ username:'dog', password:'woof' },
    					{ username:'bird', password:'chirick' }];

    	if(_.filter(userlist, function(user){ 
    		return(user.username == username 
    			&& user.password == password )}).length > 0) 
    	{
    		done(null, { username: username,
    							password: password });

    	} else {
    		done(null, false);
    	}
    }));

passport.serializeUser(function(user, done) {
  console.log('Сериализуем пользователя');
  done(null, user.username);
});

passport.deserializeUser(function(id, done) {
  console.log('Десериализуем пользователя ' + id);
  done(null, { username: id });
});

app.get('/', function(req,res){
	res.render('index', { name: 'Cat' });
});

app.get('/greet/:name', function(req,res){
	res.render('greet', { name: req.params.name });
});

app.get('/secret', function(req,res){
	res.setHeader("Content-Type", "text/html; charset=utf8");
	if(req.isAuthenticated())
		res.redirect('/userpage/' + req.user.username);
	else
		res.redirect('/login');
});

app.get('/userpage/:name', function(req,res){
	res.end('hello, '+req.params.name);
})

app.get('/login', function(req,res){
  res.render('login');
});

app.post('/login', passport.authenticate('local', { successRedirect: '/secret',
                                                  failureRedirect: '/login' }))

var server = app.listen('4000');
console.log('server is listening on port 4000');
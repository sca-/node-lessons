var http = require('http'),   // базовая библиотека для обработки html запросов
    url = require('url'),     // потребуется для парсинга url

    // создадим объект для обработки запросов к разным путям
    routes = {

      available: ['/','/time'],

      ignore: ['/favicon.ico'],

      '/': function(req,res) {
        res.end('Добрый вечер!');
      },

      '/time': function(req,res) {
        var time = new Date();
        res.end('Сейчас ' + time);
      }

    },

    // создаем сервер
    server = http.createServer(function(req,res){
      // res.end('Hello there!'); // это - первый привет от NodeJS
      var pathname = url.parse(req.url).pathname; // определяем url
      console.log("Тут на " + pathname + " стучатся");

      res.writeHead(200, {"Content-Type": "text/plain; charset=utf-8"});

      if(routes.available.indexOf(pathname) >= 0) {
        routes[pathname](req,res);
      }
      else if(routes.ignore.indexOf(pathname) >= 0) {
        // r.writeHead(200, {'Content-Type': 'image/x-icon'} );
        res.end();
        console.log(' --ignored');
      }
      else {
        res.end('Таких дорог мы не знаем :(')
      }
    });

server.listen(4444);
console.log("Server is running on port 4444");
// Информация по новой базе данных

var info = {
  // файл базы данных (создай самостоятельно)
  file: 'db.sqlite',
  // таблицы новой базы
  tables: [
    {
      // название таблицы
      name: 'animals',
      // дальше список атрибутов
      attributes: [
        {
          // имя животного - строка
          name: 'name',
          type: 'string'
        },
        {
          // кличка животного - строка
          name: 'nickname',
          type: 'string'
        },
        {
          // пол животного - строка
          name: 'gender',
          type: 'string'
        },
        {
          // возраст животного - число
          name: 'age',
          type: 'number'
        },
        {
          // питание животного - строка
          name: 'food',
          type: 'string'
        }
      ]
    }
  ]
}

// загружаем модуль sqlite
var sqlite3 = require('sqlite3').verbose();
// покдючаемся к базе
var db = new sqlite3.Database(info.file);
// добавляем таблицы с их полями в бд
info.tables.forEach(function(table){
  // пробегаем по всем атрибутам с запятой перед каждым, чтобы получилось
  // attr1 type1, attr2 type2, ...
  // в каждой таблице обязан быть атрибут id
  var attrs = "id INTEGER PRIMARY KEY AUTOINCREMENT";
  for(var i = 0; i < table.attributes.length; i++) {
    attrs += ", " + table.attributes[i].name + " " + table.attributes[i].type;
  }
  // создаем строку для добавления таблиц к базе
  var sql = "CREATE TABLE IF NOT EXISTS "
          + table.name
          + " (" + attrs + ")";
  // выполняем запрос к бд. CREATE TABLE создает в базе таблицу с описанными полями
  db.run(sql);
});

// теперь выполняем этот файл командой node create_db.js
// все, можно запускать сайт!
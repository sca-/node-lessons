var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('db.sqlite');
db.run("CREATE TABLE user (id NUMBER, username STRING, password STRING)");
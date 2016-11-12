// http://gielberkers.com/how-to-connect-to-a-sqlite-database-in-nodejs/

// Require the sqlite3 library. Use the 'verbose()'-flag to show stack traces while running queries.
var sqlite3     = require('sqlite3').verbose();
var fs          = require('fs');
 
// Setup database:
var dbFile = './database.db';
var dbExists = fs.existsSync(dbFile);
 
// If the database doesn't exist, create a new file:
if(!dbExists)
{
    fs.openSync(dbFile, 'w');
}
 
// Initialize the database:
var db = new sqlite3.Database(dbFile);
 
// Optional installation for newly created databases:
if(!dbExists)
{
    db.run('CREATE TABLE `my_table` (' +
    '`id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,' +
    '`name` TEXT,' +
    '`email` TEXT,' +
    '`number` INTEGER,' +
    '`extra` TEXT)');
}
 
// Insert some data using a statement:
var statement = db.prepare('INSERT INTO `my_table` (`name`, `email`, `number`, `extra`) ' +
'VALUES (?, ?, ?, ?)');
statement.run('My name', 'some@example.com', Math.round(Math.random() * 1000), 'Extra information');
statement.finalize();
 
// Close the database:
db.close();

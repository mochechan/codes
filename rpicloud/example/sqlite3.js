/* to support sql 
*/
// http://book.51cto.com/art/201504/473574.htm



var path = R.node.path;

var sqlite3 = R.npm.sqlite3.verbose();
var db;
var fs = R.node.fs;

R.event.on("sqlite3", function(){
	console.log("sql XXXXXXXXXXXXXXXXXX");
	console.log(arguments[0]);
	
	switch(arguments[0]){
		case 'init':
			db = new sqlite3.Database('/tmp/sqlite_db.db');
			db.run("CREATE TABLE IF NOT EXISTS Note (cdate TEXT PRIMARY KEY, content TEXT)");
			//db.run("CREATE TABLE lorem (info TEXT, date TEXT)");

		break;
		case 'insert':
			db.serialize(function() {
 
			  var stmt = db.prepare("INSERT INTO Note VALUES (?,?)");
			  for (var i = 0; i < 10; i++) {
    		  stmt.run("Ipsum " + i, "date('now')");
		  	}
		  	stmt.finalize();
			});
		break;
		case 'each':
  		db.each("SELECT rowid AS id, info FROM Note", function(err, row) {
				if (err) console.log(err);
   		  console.log(row);
    	  //console.log(row.id + ": " + row.info);
		  });
		break;
		case 'open':
			R.event.emit("child_process", "exec", "gpio");
		break;
		case 'close':
			R.event.emit("child_process", "exec", "gpio");
		break;
		default:
			//console.log("wrong sql");
		break;
	}
});

exports.test = function (arg) {
 
db.close();
}

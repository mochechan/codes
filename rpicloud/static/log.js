/* to log messages

Log files are stored in: ./log/.
Filenames, such as YYYYMMDD*.log, are separated by each different caller. Each .js file writes an individual log file. The YYYYMMDDall.log merges all log in a single log file. 
The first column in log files is hhmmss. 
In individual log files, the text after the first column is log messages.
In the *all.log files, the second column shows the log writer, and log messages follow the log writer.
*/

var path = require('path');
var fs = require('fs');


// converting / to _ in a path, then replace *.js with *.log
var path2log = function path2log(){
	var filename = arguments[0].replace(/\//g, '_').replace(/^_/, '');
	var line_number = filename.match(/:[0-9]*:[0-9]*/)[0];
	filename = filename.replace(/:[0-9]*:[0-9]*/, '').replace(/\.js/i, '.log');
	return [filename, line_number];
}


// convert callstack to an array
var stacktrace2array = function stacktrace2array(){
	var callstack = arguments[0];
	var callstacks = [];
	for (var i in callstack){
		var call_stack_filename = callstack[i].match(/\/.*:[0-9]*:[0-9]*/);
		//console.log(call_stack_filename);
		if(call_stack_filename == null){
			//callstacks.push("default");
		} else {
			callstacks.push(call_stack_filename[0]);
		}
	}
	return callstacks;
}


// obtain a calltrace
var stacktrace = function stacktrace(){
	//console.log(arguments.callee.caller.toString()); //This scheme can just get caller's content.

	// to find the caller: http://stackoverflow.com/questions/6715571/how-to-get-result-of-console-trace-as-string-in-javascript-with-chrome-or-fire
  var obj = {};
  Error.captureStackTrace(obj, stacktrace);
	var call_stack = obj.stack.split('\n');
	//console.log(call_stack);
	return call_stack;
	
	// another way to get error.stack
	//var ex = new Error();
	//console.log(ex, ex.stack.split('\n'));
}


var timestamp = function () {
	var date = new Date();

  var hour = date.getHours();
  hour = (hour < 10 ? "0" : "") + hour;

  var min  = date.getMinutes();
  min = (min < 10 ? "0" : "") + min;

  var sec  = date.getSeconds();
  sec = (sec < 10 ? "0" : "") + sec;

  var year = date.getFullYear();

  var month = date.getMonth() + 1;
  month = (month < 10 ? "0" : "") + month;

  var day  = date.getDate();
  day = (day < 10 ? "0" : "") + day;

  return year + "" + month + "" + day + "" + hour + "" + min + "" + sec;
}


var log = function log () {
	//console.log("in log function");
	//console.log(arguments);
	var that;// = this;
	if(typeof(this.log_path) === 'undefined'){
		that = this;
		that.log_path = path.resolve(__dirname, "..", "log");
		//console.log("newing log: " + that.log_path );
	}
	//console.log("You're calling the existing log.");
	var st = stacktrace();
	//console.log(st);
	var stack_array = stacktrace2array(st); //stacktrace in an array
	//console.log(stack_array);
	var caller = stack_array[1];
	//console.log(caller);
	var log_file = path2log(caller)[0]; //log filename
	var line_number = path2log(stack_array[1])[1];
	//console.log(line_number);
	//console.log(log_file);

	var date = (timestamp().substr(0,8));
	var time = (timestamp().substr(8));
	var log_text = " ";
	if (typeof(arguments[0]) === 'string') {
		log_text += arguments[0];
	} else {
		try {
			log_text += JSON.stringify(arguments[0]);
		} catch (e) {
			var item = [];
			for (var i in arguments[0]) item.push(i);
			log_text += __filename + " says: unconvertable object [" + item.join(",") + "]";
			//console.log(arguments[0]);
		}
	}

	fs.appendFile(path.resolve(__dirname, '../log', date + log_file), time + log_text + '\n', function(err){
		if (err) throw err;
	});
	fs.appendFile(path.resolve(__dirname, '../log', date + "all.log"), time + ' ' + caller + log_text + '\n', function(err){
		if (err) throw err;
	});

}


module.exports = log;


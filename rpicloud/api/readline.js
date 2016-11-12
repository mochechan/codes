/* 
This file supports server-side terminal/console to keyin/read command lines.
*/

var log, _rc;
var rl;

function prompt () {
	process.nextTick(function () {
		rl.prompt();
	});
};

module.exports = function readline () {
	//console.log("in readline");
	//console.log(arguments);
	if (typeof(arguments[0]._rc) === 'object' && typeof(arguments[0]._rc.log) === 'function') {
		_rc = arguments[0]._rc;
		log = arguments[0]._rc.log;
	} else log = console.log;

	rl = require('readline').createInterface({input: process.stdin, output: process.stdout});
	rl.setPrompt('rc>');
	prompt();

	rl.on('line', function(line) {
		var command = line.trim();
		if (command == "") {
			console.log("Please key in a valid command.");
			prompt();
			return;
		}
		log("readline got: " + command);
		// standard 20160928
		_rc.call_api({api_name: 'parse_command', api_args: {command: command}});
		prompt();
	}).on('close', function() {
  	log('Have a great day!');
		process.nextTick(function () {
	  	process.exit(0);
		});
	}).on('pause', function() {
  		log('Readline paused.');
	}).on('resume', function() {
  		log('Readline resumed.');
	}).on('SIGINT', function() {
  	rl.question('You pressed ctrl-c. Are you sure to exit? (y/n)', function(answer) {
    	if (answer.match(/^y(es)?$/i)){ 
     		rl.pause();
				_rc.call_api({api_name: "spawn", api_args: {"control":"killall"}});
  	   	log("quitting rpicloud...");
				process.nextTick(function(){
    		 	process.exit(0);
				});
    	}
  	});
	}).on('SIGTSTP', function() {
  		log('SIGTSTP.');
	});
}



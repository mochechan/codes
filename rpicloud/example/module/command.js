/* R.event.emit('command', {command: string, callback: function (){}});
This script parses an input string to be an event and an object as an argument.

The function is being insert into the argument to be a callback. 
The event and the argument are finally emited.
note: Script can input the function, but terminal command line cannot input the function.
*/

var log = R.log; 

var parse = function () {
	var first_space = arguments[0].indexOf(' ');
	var event = arguments[0].substring(0, first_space);
	var arg_string = arguments[0].substring(first_space +1);
	event = event.trim();
	arg_string = arg_string.trim();
	//console.log(event);
	//console.log(arg_string);
	var args;
	try {
		args = JSON.parse(arg_string);
	} catch (e) {
		//log(e);
		//log(e.stack);
		log("Hint: The second arguement should be able to be parsed by JSON.parse. ");
		// {} [] "" are fine.
		return {event: event, args: {}};
	}
	return {event: event, args: args};
}

R.event.on("command", function () {
	if (!arguments[0]) {
		log("warn: no any input");
		return;
	}

	//log('command line got an input: ');
	//log(arguments[0]);

	if (!arguments[0].command) {
		log("warn: no any command");
		return;
	}

	var input;
	switch (typeof(arguments[0])) {
		case 'object':
			input = parse(arguments[0].command);
		break;
		case 'string':
			input = parse(arguments[0]);
		break;
		default:
			R.log("incorrect to call command");
			return;
		break;
	}

	if (!input) {
		R.log("command cannot be recognizable");
		return;
	}

	for (var i in arguments[0]) {
		if (i === 'callback') continue;
		if (!input.args[i]) input.args[i] = arguments[0][i];
	}
	//console.log(arguments);

  if (arguments[0] && typeof(arguments[0].callback) === 'function') {
		var that_callback = arguments[0].callback;
		input.args.callback = function () {
			//console.log("in input.callback");
			//console.log(arguments);
			arguments.R_metadata = input.args.R_metadata;
			that_callback(arguments);
		}
	}

	//console.log("input:");
	//console.log(input);
	R.event.emit(input.event, input.args);

});


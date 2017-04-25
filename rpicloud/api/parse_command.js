/* ('command', {command: string, callback: function (){}});
This script parses an input string to be an event and an object as an argument.

The function is being insert into the argument to be a callback. 
The event and the argument are finally emited.
note: Script can input the function, but terminal command line cannot input the function.
*/

var log, _rc;

var parse = function () {
	//console.log("in parse");
	//console.log(arguments);

	//TODO: accepts {api:"string",command:"string"} 

	var first_space = arguments[0].indexOf('{');
	if (first_space < 0) {
		return {event: arguments[0], args: {}};
	}

	var event = arguments[0].substring(0, first_space);
	var arg_string = arguments[0].substring(first_space);
	event = event.trim();
	arg_string = arg_string.trim();
	console.log("event");
	console.log(event);
	console.log("arg_string");
	console.log(arg_string);
	var args;
	try {
		args = JSON.parse(arg_string);
	} catch (e) {
		//log(e);
		//log(e.stack);
		log("Hint: The second arguement should be able to be parsed by JSON.parse. ");
		// Either {} [] "" can be parsed by JSON.parse().
		return {event: event, args: {}};
	}
	return {event: event, args: args};
}


module.exports = function () {
	//console.log("in parse_command");
	//console.log(arguments);
	if (typeof(arguments[0]._rc) === 'object' && typeof(arguments[0]._rc.log) === 'function') {
		_rc = arguments[0]._rc;
		log = arguments[0]._rc.log;
	} else log = console.log;

	var args = arguments[0].args;

	if (!args) {
		log("warn: no any input");
		return;
	}

	if (!args.command) {
		log("warn: no any command");
		return;
	}

	var input;
	switch (typeof(args)) {
		case 'object':
			input = parse(args.command);
		break;
		case 'string':
			input = parse(args);
		break;
		default:
			log("incorrect to call " + __filename);
			return;
		break;
	}

	if (!input) {
		log("command cannot be parsed");
		return;
	}

	for (var i in args) {
		if (i === 'callback') continue;
		if (!input.args[i]) input.args[i] = args[i];
	}

	var parsed_command;
	try {
		parsed_command = JSON.stringify(input);
	} catch (e) {
		log("The input cannot be JSON.stringified()." + e);
	}
	log("parsed command: " + parsed_command);

  if (args && typeof(args.callback) === 'function') {
		var that_callback = args.callback;
		input.args.callback = function () {
			//console.log("in input.callback");
			//console.log(arguments);
			arguments.R_metadata = input.args.R_metadata;
			that_callback(arguments);
		}
	}

	_rc.call_api({api_name: input.event, api_args: input.args});
}


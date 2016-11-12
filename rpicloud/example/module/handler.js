/* R.event.emit('handler', {control: 'list|delete', handler: 'xxx', arg: {}});

*/

var log = R.log;
var fs = R.node.fs;
//var handler = R.service.handler || {}; //some problem to self-contained
var util = R.utility;
var path = R.node.path;
var handler_path = path.resolve(__dirname, "../handler");
//log("to define handler_path: " + handler_path);


R.event.on("handler", function () {
	log("handler XXXXXXXXXXXXXXXXXX");
	log(arguments[0]);

	if (!arguments[0]) {
		log("no any inputs");
		return;
	}

	if (arguments[0].control && typeof(arguments[0].control) === 'string') {
		switch (arguments[0].control) {
			case 'list':
				log(R.service.handler);
			break;
			case 'delete':
			break;
			default:
			break;
		}
		return;
	}

	if (!arguments[0].handler || typeof(arguments[0].handler) !== 'string') {
		log("error: wrong input in handler.js");
		return;
	} 

	if (R.service.handler[arguments[0].handler]) {
		log("running handler : " + arguments[0].handler);
		R.service.handler[arguments[0].handler](arguments[0]);
	} else {
		log("incorrect handler name, current handler list: " );
		log(R.service.handler);
	}
});


// to load a single handler file into R.service.handler
var load_handler = function (filename) {
	//var filename = arguments[0];
	var parsed_filename = path.parse(filename);
	if (!R.shared_utility.endsWith(filename, '.js')) {
		log("incorrect handler filename " + filename + ", only accepts *.js ");
		return;
	}
	//log('loading handler: ' + filename);
	if (!R.service.handler) R.service.handler = {};
	var handler;
	delete require.cache[filename];

	try {
		handler = require(filename);
	} catch (error) {
		log("The handler file cannot be required.");
		log(error);
		log(error.stack);
		return;
	}

	var list = [];

	switch (typeof(handler)) {
		case 'function':
			delete R.service.handler[parsed_filename.name];
			R.service.handler[parsed_filename.name] = handler;
			list.push(parsed_filename.name);
		break;

		case 'object':
			for (var i in handler) {
				delete R.service.handler[i];
				R.service.handler[i] = handler[i];
				list.push(i);
			}
		break;

		default:
			log("unexpected handler type");
		break;
	}
	log("handler loaded " + list.join(',') + ": " + filename, {color:'green'});
}


// to load all handler files at startup
fs.readdir(handler_path, function(err, files) {
	if (err) {
		log(err);
		return;
	}
	for (var i in files){
		load_handler(path.resolve(handler_path, files[i]));
	}
});


// to support automatical reload whenever handler files are edited
fs.watch(handler_path, function (event, filename) {
	switch (event) {
		case 'rename':
		break;

		case 'change':
		  if (!filename) {
    		log('handler:filename is not provided');
				return;
		  } 
			if (!R.utility.endsWith(filename, '.js')) return;
		  var handler = path.resolve(handler_path, filename);
		  //log('handler: auto reloading filename provided: ' + handler);
			R.event.emit('call_latest', {tag: 'reload_handler', countdown: 3, callback: function(){
				//log("loading new handler");
				//log(handler);
				load_handler(handler);
			} });

		break;

		default:
			log("fs.watch returns an unexpected event.");
  		console.log('event is: ' + event);
		break;
	}
});



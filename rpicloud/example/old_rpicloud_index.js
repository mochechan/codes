#!/usr/bin/env node
"use strict";

//console.log("RPI cloud is started here: index.js ");

console.log("current nodejs version: " + process.versions.node + "   (expected: 4.2.2 or above)" );

// to load module files
function load_module(arg){
	//console.log("load_modules: " + arg);

	// The use of async module reading may cause failure due to incorrect sequence,
	// so, never use async to require modules here.
	var files = R.node.fs.readdirSync(arg); 

		for(var i in files) {
			var fullpath = R.node.path.resolve(arg, files[i]);
			var load = true;
			var npm = true;
			var core = false;

			//to ignore the index.js file
			if(process.argv[1].indexOf(files[i]) > -1) load = false;

			// the loading module is in node_modules/
			if(arg.indexOf("node_modules") > -1) npm = true;
			else npm = false;

			// decide whether core or not
			if (arg.indexOf('module') === -1) core = true;

			// the loading filename ends with *.js or *.json 
			if(files[i].match(/.js$/i) || files[i].match(/.json$/i)) {
			} else if (!npm) load = false;

			// the loading filename starts with .  
			if(files[i].indexOf(".") === 0) load = false;

			// the loading filename ends with *.log
			if(files[i].match(/.log$/i)) load = false;

			var module_name = files[i].replace(/\.js$/,'');
			var module_name = module_name.replace(/\.json$/,'');
			//console.log(module_name);

			if (!load) {
				//console.log(i + " ignoring: " + fullpath);
				continue;
			}

			var test_duplicate = function (location, item, fullpath, comment) {
				if (R.log) R.log(i + " loading " + comment + "['" + module_name + "'] " + fullpath);
				else 
				console.log(i + " loading " + comment + "['" + module_name + "'] " + fullpath);
				if (location[item]) {
					console.log("duplicated module name: " + files[i] + "  (All module names should be unique.)");
					process.exit(99);
				}
				location[item] = require(fullpath);
			}

			if (npm) {
				test_duplicate(R.npm, module_name, fullpath, 'R.npm');
			} else if (core) {
				test_duplicate(R, module_name, fullpath, 'R');
			} else {
				test_duplicate(R.module, module_name, fullpath, 'R.module');
			}
		}
}


if(typeof(R) === 'undefined'){
	global.R = {node:{}, npm:{}, module:{}, status:{rpi_root: __dirname, rpi_index: __filename}, service:{timers: {}} }; 
	var modules = ['assert', 'buffer', 'child_process', 'cluster', 'crypto', 'dns', 'events', 'fs', 'http', 'https', 'net', 'os', 'path', 'punycode', 'querystring', 'readline', 'repl', 'stream', 'string_decoder', 'tls', 'dgram', 'url', 'util', 'v8', 'vm', 'zlib'];

	for (var i in modules) R.node[modules[i]] = require(modules[i]);

	R.shared_utility = require('./html/js/shared_utility.js');

	R.event = new R.node.events.EventEmitter();
	R.event.setMaxListeners(0); // The default is 10.

	// nodejs's async mechanism sometime causes problem to load modules
	//load_module(R.node.path.resolve(__dirname, 'node_modules/'));
	load_module(R.node.path.resolve(__dirname, './'));
	load_module(R.node.path.resolve(__dirname, 'lib/'));
	load_module(R.node.path.resolve(__dirname, 'module/'));
	load_module(R.node.path.resolve(__dirname, 'event/'));
} else {
	console.log("RPI cloud is already loaded.");
	process.exit(99);
}

process.on('SIGINT', function () {
  console.log('RPI cloud got a SIGINT.');
	if (typeof(process.env.NODE_ENV) === 'undefined' ) process.exit(0);
});

process.on('uncaughtException', function(err) {
	if (R.log) var log = R.log;
	else var log = console.log;
  log('error: Caught uncaughtException: ', {color: 'red'} );
  log(err);
  log(err.name);
  log(err.message);
  log(err.stack);
	if (typeof(process.env.NODE_ENV) === 'undefined' ) process.exit(0);
});

process.on('unhandledRejection', function(reason, p) {
  console.log("Unhandled Rejection at: Promise ", p, " reason: ", reason);
  // application specific logging, throwing an error, or other logic here
	if (typeof(process.env.NODE_ENV) === 'undefined' ) process.exit(0);
});

setTimeout(function(){
	R.log("Starting RPI cloud...", {color:"green"});
	R.terminal.prompt();
 //dump all system variables
 //console.log(global);
 //console.log(process);
 //console.log(module);

}, 345);


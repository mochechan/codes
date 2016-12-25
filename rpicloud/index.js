/* customizable raspberry pi cloud 

*/

"use strict";


var rc = function () {
	if(! /v6.9.*/.test(process.version)){
		console.log("WARN: nodejs shoud be >= v6.9.1, current: " + process.version);
	}

	var that = this;
	that.status = {dirname: __dirname, filename: __filename, };
	that.config = require('./config.json');
	that.verbose = arguments[0].verbose || that.config.verbose || false;
	that.config.package = require('./package.json');

	that.node = {
		events: require('events'), 
		fs: require('fs'), 
		path: require('path'), 
		os: require('os'), 
		url: require('url'),
	};

	that.npm = {
		//requirejs: require('requirejs'), 
		//eventemitter2: require('eventemitter2').EventEmitter2,
	};

	//that.npm.requirejs.config({baseUrl: __dirname , nodeRequire: require});

	//that.shared_utility = require('./html/js/shared_utility.js');
	var log = that.log = require('./static/log.js');
	//that.log("that.log"); //The log function can be used now.

	that.api = {}; // important: Never call any api in this function rc () {}.

	// done: injecting api from ./api/*.js 
	// todo: recursively function
	that.node.fs.readdir(that.node.path.resolve(__dirname, 'api'), function(){
		if (arguments[0]) {
			throw arguments[0];
		}
		for (var i in arguments[1]) {
			var filename = arguments[1][i];
			if (! filename.match(/\.js$/i)) {
				log("invalid filename: " + filename + ' ');
				continue;
			}
			var api_file = require(that.node.path.resolve(__dirname, 'api', filename));

			if (typeof(api_file) === 'function') {
				var api_name = filename.replace(/\.js$/i,'');
				if (typeof(that.api[api_name]) != 'undefined') {
					log("ignoring duplicated api_name: " + api_name);
					continue;
				}
				log("injecting api: " + api_name + ", from: " + filename);
				that.api[api_name] = api_file;
			} else if (typeof(api_file) === 'object') {
				for (var j in api_file) {
					if (typeof(that.api[j]) != 'undefined') {
						log("duplicated api_name: " + api_name);
						log("ignoring duplicated api_name: " + api_name);
					}
					log("injecting api: " + j + ", from: " + filename);
					that.api[j] = api_file[j];
				}
			} else {
				log('ERROR: please debug');
				process.exit(99);
			}
		}
	});


	// to require "classes" and then new them
/*
	that.module = {};
	that.instance = {};
	var module_require = function module_require () {
		console.log("module_require: ");
		var module_name = that.node.path.parse(arguments[0]);
		that.module[module_name.name] = require(arguments[0]);
		if(typeof(that.module[module_name.name]) === 'function'){
			console.log("module_new: ");
			that.instance[module_name.name] = new that.module[module_name.name];
		}
	}

	var module_list = function module_list () {
		//console.log("In module_list");
		//console.log(arguments[0]);
		var dir = arguments[0];
		that.node.fs.readdir(arguments[0], function () {
			if(arguments[0]) {
				console.log("cannot load module list");
				process.exit(99);
			} 

			//console.log(arguments[1]);
			for (var i in arguments[1]) {
				if(arguments[1][i] && arguments[1][i].match(/\.js$/i)) {
					module_require(that.node.path.resolve( dir, arguments[1][i]));
				}
			}
		});
	}

	module_list(that.node.path.resolve(__dirname, './object/'));
*/


}


rc.prototype.add_api = function(arg){
	var api = arg.api || arg.api_name;
	var callback = arg.callback || arg.cb;

	if(typeof(api) == "string" && typeof(callback) == "function"){
		if(this.api[api]){
			this.log("overwriting a existing API: " + api);
		} else {
			this.log("adding a new API: " + api);
		}
		this.api[api] = callback;
	};
}

rc.prototype.list_api = function () {
	var api_list = [];
	for(var i in this.api){ 
		api_list.push(i);
	}
	return api_list;
}


rc.prototype.call_api = function (api_call) {
	//console.log("In call_api");
	//console.log(api_call);

	var that = this;
	if (typeof(api_call) === 'undefined') {
		that.log("ERROR: undefined API call");
		return;
	}

	if (typeof(api_call) != 'object') {
		that.log("ERROR: API call requires an object input. " + typeof(api_call));
		return;
	}

	var api_name = api_call.api_name || api_call.api;
	var api_args = api_call.api_args || api_call.args || api_call;

	if (typeof(api_name) != 'string') {
		that.log("ERROR: The given api_name is not a string. " + typeof(api_name));
		return;
	}

	if (typeof(that.api[api_name]) === 'function') {
		var error_stack = (new Error().stack);
		var es_array = error_stack.split('\n');
		var caller = (es_array[2].match(/\/.*\.[jJ][sS]:[0-9]*:[0-9]*/)[0]);
		that.log('' + caller + " is calling api: " + api_name + " with args: " + JSON.stringify(api_args));
		process.nextTick(function(){
			that.api[api_name]({_rc: that, args: api_args});
		});
	} else if (typeof(that.api[api_name]) === 'undefined') {
		that.log("WARN: undefined api: " + api_name);
	} else {
		that.log("invalid api: " + api_name);
		that.log("ERROR: please debug" );
		process.nextTick(function(){
			process.exit(99);
		});
	}
}


rc.prototype.on = function () {
	switch (arguments[0]) {
	case 'disposed':
	break;
	default:
	break;
	}
}


rc.prototype.get = function (args) {
	var that = this;
	switch (args) {
	case 'status':
		that.log(this.module);
	break;
	case '':
	break;
	default:
	break;
	}
}


rc.prototype.set = function (args) {
	var that = this;
	switch (args) {
	case 'status':
		that.log(this.module);
	break;
	case '':
	break;
	default:
	break;
	}
}


module.exports = rc;


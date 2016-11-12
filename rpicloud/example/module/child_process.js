/* child_process
R.event.emit("exec", {command: "", options: {}, callback: function(){}});
R.event.emit("spawn", {command: "", control: "", args: [], options: {}, stdout_on_data: function(){}, stderr_on_data: function(){}, on_close: function(){}});
*/

var fs = R.node.fs;
var log = R.log;
R.spawn = {};
var spawn_pool = R.spawn;

// to delete a spawned process by given pid(s)
var delete_by_pid = function () {
	if (arguments[0] && typeof(arguments[0]) === 'string' && spawn_pool[arguments[0]]) {
		log("deleting the spawned process by the pid: " + arguments[0]);
		spawn_pool[arguments[0]].process.kill('SIGHUP');
		//spawn_pool[arguments[0]].process.kill('SIGINT');
	} else if (arguments[0] && Array.isArray(arguments[0])) {
		log("deleting the spawned process by pids: " + arguments[0].join(' '));
		for (var i in arguments[0]) {
			delete_by_pid(arguments[0][i]);
		}
	} else {
		log("pid is not existing: " + arguments[0]);
	}
}

// to delete a spawned process by given tag(s)
var delete_by_tag = function () {
	if (arguments[0] && typeof(arguments[0]) === 'string') {
		log("deleting the spawned process by the tag: " + arguments[0]);
		for (var i in spawn_pool) {
			for (var j in spawn_pool[i].tag) {
				if (spawn_pool[i].tag[j] === arguments[0]) delete_by_pid(i);
			}
		}
	} else if (arguments[0] && Array.isArray(arguments[0])) {
		for (var i in arguments[0]) {
			delete_by_tag(arguments[0][i]);
		}
	}
}

var default_callback = function (error, stdout, stderr) {
	log('This is the default callback. You should assign your own one.');
	console.log('stdout: ' + stdout);
	console.log('stderr: ' + stderr);
    if (error !== null) {
      log('exec error: ' + error);
    }
}

var default_stdout = function (data, spawned) {
	log(data.toString(), {filename: 'spawn_stdout' + spawned.pid, display: false});
}

var default_stderr = function (data, spawned) {
	log(data.toString(), {filename: 'spawn_stderr' + spawned.pid, display: false});
}


R.event.on("spawn", function(){
	// child_process.spawn(command[, args][, options])
	// command = string // args = [] // options = {} // stderr = function () // stdout = function () // close = function ()

	//console.log("child_process.spawn XXXXXXXXXXXXXXXXXX");
	//console.log(arguments);

	if (!arguments[0]) {
		console.log("no any input");
		return;
	}

	if (arguments[0].control) {
		switch (arguments[0].control) {
			case 'list':
				var pids = [];
				for (var i in spawn_pool) {
					pids.push(i);
				}
				log("current pids: " + pids.join(' '));
			break;

			case 'kill':
				if (arguments[0].pid) delete_by_pid(arguments[0].pid);
				if (arguments[0].tag) delete_by_tag(arguments[0].tag);
			break;

			case 'killall':
				var pids = [];
				for (var i in spawn_pool) {
					pids.push(i);
				}
				delete_by_pid(pids);
			break;

			default:
				log("incorrect control");
			break;
		}
		return;
	}

	if (!arguments[0].command) {
		console.log("no command");
		return;
	}

	var spawn_;

	try {
		spawn_ = R.node.child_process.spawn(arguments[0].command, arguments[0].args || [], arguments[0].options || {});
	} catch (error) { 
		log(error); 
		log(error.stack); 
	}

	//console.log("typeof(spawn_)");
	//console.log(typeof(spawn_));
	if (!spawn_ || typeof(spawn_) === 'undefined') {
		log("spawn failure");
		return;
	}
	//console.log(typeof(spawn_.pid));
	//console.log(spawn_.pid);
	if (typeof(spawn_.pid) !== 'number') {
		return;
	} else 
	

	if (spawn_) {
		spawn_.stderr.on('data', function(data){
			if(arguments[0].stderr_on_data && typeof(arguments[0].stderr_on_data) === 'function') {
				arguments[0].stderr_on_data(data);
			} 
			default_stderr(data, spawn_);
		});

		spawn_.stdout.on('data', function(data){
			if(arguments[0].stdout_on_data && typeof(arguments[0].stdout_on_data) === 'function') {
				arguments[0].stdout_on_data(data);
			} 
			default_stdout(data, spawn_);
		});

		spawn_.on('close', function(code){
			log("spawned process on_close: " + this.pid);
			//if(arguments[0].on_close && typeof(arguments[0].on_close) === 'function') {
				//arguments[0].on_close(data);
			//} 

			var pid = this.pid;
			try {
				for (var key in spawn_pool) {
					if (spawn_pool && spawn_pool[key].process && spawn_pool[key].process.pid)
						if (spawn_pool[key].process.pid === pid) {
							delete spawn_pool[key].process;
							delete spawn_pool[key];
						} 
				}
			} catch (error) {
				log("error: process on close");
				log(error);
				log(error.stack);
			}
		});

		spawn_pool[spawn_.pid] = {process: spawn_, command: arguments[0].command};
	}

	if (arguments[0].tag && Array.isArray(arguments[0].tag)) {
		spawn_pool[spawn_.pid].tag = arguments[0].tag;
	} else if (arguments[0].tag && typeof(arguments[0].tag) === 'string') {
		spawn_pool[spawn_.pid].tag = [arguments[0].tag];
	} else {
		log("There is no any given tag.");
	}

	log("spawned pid: " + spawn_.pid + " " + spawn_.spawnargs.join(' '));
});


R.event.on("exec", function(arg){
	// child_process.exec(command[, options], callback)
	// command = string // options = {} // callback = function ()
	//console.log("in child_process.exec XXXXXXXXXXXXXXXXXX");
	//console.log(arguments);

	if (!arguments[0]) {
		console.log("no any input");
		return;
	}

	if (!arguments[0].command) {
		console.log("no command");
		return;
	}

	R.node.child_process.exec(arguments[0].command, arguments[0].options || {}, arguments[0].callback || default_callback);
});



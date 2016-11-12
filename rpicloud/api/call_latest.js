/* ("call_latest", {countdown: 5, tag: "reload_handler", callback: function(){}});

The script only runs the latest task/callback function when receiving consective tasks with identical tag.
default countdown is 5 (seconds)
*/

var log;
var latest = {};


//{test: { tag: "test", status: 'pending', countdown: 10, callback: function(){ console.log("timeouted"); }, }};

var _rc, log;

exports.call_latest = function(){

	if (typeof(arguments[0]._rc) === 'object' && typeof(arguments[0]._rc.log) === 'function') {
		log = arguments[0]._rc.log;
		_rc = arguments[0]._rc;
	} else log = console.log;
	var args = arguments[0].args || {};

	console.log("in only_latest");
	console.log(args);

	if (!args) {
		log("no any input");
		return;
	}

	if (typeof(args) != 'object') {
		log("not a object");
		return;
	}

	if (!args.tag || typeof(args.tag) != 'string') {
		log("invalid tag");
		return;
	}

	if (latest[args.tag]) { 
		log("replacing existing task" + args[0].tag);
		delete latest[args.tag];
	}

	latest[args.tag] = {
		status: 'pending',
		countdown: args.countdown || 5,
		callback: args.callback || function () {
			log("warn: This is a default callback.");
		}
	};

};

/*
R.service.timers.call_latest = setInterval(function(){
	for (var i in R.service.latest) {
		if (!R.service.latest[i]) return;
		if (R.service.latest[i].countdown === 0 && R.service.latest[i].status === 'running') { 
			//console.log("delete");
			delete R.service.latest[i];
		} else if (R.service.latest[i].countdown === 0 && R.service.latest[i].status != 'running') { 
			//console.log("run");
			R.service.latest[i].status = 'running';
			R.service.latest[i].callback();
		} else {
			//console.log("decrease");
			R.service.latest[i].countdown--;
		}
	}
	//if (Object.keys(R.service.latest).length > 0) log(R.service.latest);
}, 1000);
*/
//R.event.emit('only_latest',{tag: "test2", countdown: 20, callback: function(){ log("trigged"); }});
//R.event.emit('only_latest',{tag: "test2", countdown: 20, callback: function(){ log("trigged"); }});
//R.event.emit('only_latest',{tag: "test2", countdown: 20, callback: function(){ log("trigged"); }});
//R.event.emit('only_latest',{tag: "test1", countdown: 20, callback: function(){ log("trigged"); }});
//R.event.emit('only_latest',{tag: "test1", countdown: 20, callback: function(){ log("trigged"); }});


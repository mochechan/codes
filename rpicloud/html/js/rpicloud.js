/* rpicloud browser-side javascript API 
support:
* R.ws({host: ws://window.location.host});
* R.emit("exec", {"command","ls", function() {}});
* R.emit("handler", {"handler","ls", function() {}});
* R.on("ws_onmessage", function () {});
todo:
* R.login({username: "", password:""});
* R.logout({});
* R.get();
* R.post();
* avoid to require another js
*/


//////////////////////////////// global R for RPI cloud
var R = (typeof module === 'undefined' ? {} : module.exports);

(function (exports, global) {

	var config = {
			ws_port: 9090,
			ws_ip: window.location.hostname,
			ws_connected: false,
			logined: false,
	};

	R = {
		status: {
			ws_opened: false, 
			ws_sent: {},
		}, 
		callback_pool:{}, 
		config: config 
	};

	//console.log("in function() R.config"); 

	//////////////////////////////// start of utility functions

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

	var guid = function guid() {
  	function s4() {
    	return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  	}
  	return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
	}

	var short_guid = function guid() {
  	function s4() {
    	return Math.floor((1 + Math.random()) * 0x10000) .toString(16) .substring(1);
  	}
	  return s4();
	}


	/////////////////////// end of utility functions

	/////////////////////// start of ws websocket client

	// http://www.html5rocks.com/en/tutorials/websockets/basics/?redirect_from_locale=tw

	var ws_sent = R.status.ws_sent;
	var ws_client;

	var default_cb = function(){
		console.log("no given callback");
		console.log(arguments);
	}


	R.ws = function(args){
		//to create a new websocket 
		//console.log(args);
		var ws_url = 'ws://' + args.host + '/echo';
		console.log('ws_url: ' + ws_url);
		ws_client = new WebSocket(ws_url, ['soap','xmpp']);

		ws_client.onopen = function () {
			R.status.ws_opened = true;
			//console.log("ws_client.onopen");
			//console.log(arguments);
		};

		ws_client.onerror = function (error) {
			R.status.ws_opened = false;
  		console.log('WebSocket Error ' + error);
		  console.log(arguments);
		};


		// messages from the server
		ws_client.onmessage = function () {
  		console.log('ws_client.onmessage: ' );
		  console.log(arguments);
			var received = arguments[0].data;
			var parsed;
			try {
				parsed = JSON.parse(received);
			} catch (error) {
				console.log(error);
				return;
			}
			console.log("parsed");
			console.log(parsed);
			console.log(ws_sent);
	
			if (!parsed || !parsed.transaction_id) {
				console.log("The received message cannot be parsed to JSON.");
				return;
			}

			if (!parsed.transaction_id) {
				console.log("The received message has no transaction_id.");
				return;
			}

			if(ws_sent[parsed.transaction_id] && typeof(ws_sent[parsed.transaction_id].callback) === 'function') {
				console.log("trigger callback");
				ws_sent[parsed.transaction_id].callback(parsed.result);
				delete ws_sent[parsed.transaction_id];
				return;
			} else {
				//todo: checkout R.on()
			}
		};//end of ws_client.onmessage

		ws_client.onclose = function close() {
			R.status.ws_opened = false;
  		console.log('ws.onclose');
	  	console.log(arguments);
		};

/*
// Sending canvas ImageData as ArrayBuffer
var img = canvas_context.getImageData(0, 0, 400, 320);
var binary = new Uint8Array(img.data.length);
for (var i = 0; i < img.data.length; i++) {
  binary[i] = img.data[i];
}
connection.send(binary.buffer);

// Sending file as Blob
var file = document.querySelector('input[type="file"]').files[0];
connection.send(file);

// Setting binaryType to accept received binary as either 'blob' or 'arraybuffer'
connection.binaryType = 'arraybuffer';
connection.onmessage = function(e) {
  console.log(e.data.byteLength); // ArrayBuffer object if binary
};

// Determining accepted extensions
console.log(connection.extensions);
*/
}; 
	///////////////////////////// end of ws websocket client


	R.on = function() {
			switch (arguments[0]) {
				case "ws_onmessage":
					if (typeof(arguments[1]) === 'function') {
						console.log("registering ws_onmessage callback");
						R.callback_pool["ws_onmessage"] = {callback: arguments[1]};
					}
				break;
				default:
					console.log("incorrect event name");
				break;
			}
		};

	var ws_not_yet_send = [];

	R.emit = function(args, callback) {
			//console.log("In R.emit");
			//console.log(arguments);

			var msg = {
				payload: args, 
				transaction_id: guid(),
			};

			if(R.status.ws_opened === true){
				console.log("ws_client sending" + JSON.stringify(msg));
				ws_client.send(JSON.stringify(msg));
				ws_sent[msg.transaction_id] = {
					payload: args, 
					callback: callback, 
					transaction_id: msg.transaction_id
				};

			} else if(R.status.ws_opened === false){
				//console.log("pushing");
				//console.log([msg, callback]);
				if(typeof(callback) === 'function'){
					ws_not_yet_send.push([msg, callback]);
				}

				setTimeout(function(){
					if(ws_not_yet_send.length > 0){
						var pop = ws_not_yet_send.pop();
						//console.log("pop");
						//console.log(pop);
						R.emit(pop[0].payload, pop[1]);
					}
				}, 777);
			} else {
				console.log("R internal error.");
			}
	};

	R.log = function(msg){
		if(typeof msg === 'string'){
			var m = {api: 'log', msg: msg};
			R.emit(JSON.stringify(m));
		} else {
			console.log("invalid log input, string only");
		}
	};

	
	//console.log("End of R loading");

})('object' === typeof module ? module.exports : (this.R = {}), this);

/* todo:
http://www.matteoagosti.com/blog/2013/02/24/writing-javascript-modules-for-both-browser-and-node/
https://cozy.io/en/hack/getting-started/first-app.html

*/

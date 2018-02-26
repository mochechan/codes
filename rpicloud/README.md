This project is based on nodejs for Raspberry PI.

Features:
* http/websocket/restful/TCPsocket/UDPsocket server share the same session/cookie
* module-based, event-based, handler
* each js file < 5k bytes

How to use:
$ npm install 
$ node index.js

Introduction:
* All node build-in and npm modules will be loaded automatically. 
* Core modules may be cited. To remove may cause problems.
* Modules may cite core modules, and are able to plug. 
*

API:
{api_name: 'string', api_args: {}}


used_port:
9997 tcp socket
9996 udp socket
9998 express restful
9990 express cloudcmd
9999 static_html/sockjs server /upload_form

todo:
load balancer
survey package.json, 
memory_usage.js
file uploader
file downloader
json-rpc 2.0
get rid of 'var'

/* to support memory usage
*/
/* to monitor RPI's internal status
*/
/* self_test, unit test, CI
*/
/* fuzzy: auto-adjust AC/heater
*/

R.event.on("chatroom", function(){
	console.log("chatroom XXXXXXXXXXXXXXXXXX");
	console.log(arguments[0]);
});

cluster
webrtc p2p http://peerjs.com/


known issues:
* requiring actions sometimes fail due to auto-require's sequence 
* npm install web-terminal 

//////////////////////////////////

senario
R.event.emit('command',"exec {\"command\":\"ls\"}", function() {console.log(arguments);});

///////////////////////////// dictionary of function (API)


todo:
event => api
("string",{}) => ({api: "string", args:{}})


usage:
var rc = require('');
var xx = new rc();
xx.add_handler('./handler.js');
xx.remove_handler('./handler.js');
xx.add_event('', function(){});
xx.remove_event('', function(){});
xx.on('11', function(){});
xx.get('22', function (){});
xx.log('');
xx.exit();



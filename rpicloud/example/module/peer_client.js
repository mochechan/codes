
var Peer = require('p2p-node').Peer;
 
var p = new Peer('192.168.0.54');

p.on('connect', function(d) {
  console.log("I'm connected!");
});

p.on('message', function(d) {
  console.log("I got message "+d.command);
});

p.on('error', function(d) {
  console.log("on error!");
});

p.on('end', function(d) {
  console.log("on end");
});


p.on('commandMessage', function(d) {
  console.log("on commandMessage");
});

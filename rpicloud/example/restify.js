/*
*/

var rpicloud_mode = 'standalone';

if (typeof(R) !== 'undefined') {
	rpicloud_mode = 'rpicloud';
	R.event.on('restify', function () {
		console.log('restify XXXXXXX');
		console.log(arguments);
	});
} 

var port = 9090;

var restify = require('restify');

var server = restify.createServer({
  name: 'rpicloud_restify',
  version: '0.0.1'
});

server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());

server.get('/restify/:name/self_test', function (req, res, next) {
	console.log('req');
	console.log(req);
  res.send(req.params);
  return next();
});

server.listen(port, function () {
  console.log('restify server is listening. ');
});


var assert = require('assert');

var client = restify.createJsonClient({
  url: 'http://localhost:' + port,
  version: '~0.0.1'
});

client.get('/restify/mark/self_test', function (err, req, res, obj) {
  assert.ifError(err);
  console.log('restify Server returned: %j', obj);
});


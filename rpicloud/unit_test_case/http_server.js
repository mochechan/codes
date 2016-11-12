
var assert = R.node.assert;
var log = R.log;

var options = {
  host: '127.0.0.1',
  port: R.config.http_port,
  path: '/index.html'
};


var test_case = [
	"http://127.0.0.1:9999/user_status", 
	"http://127.0.0.1:9999/user_logout", 
	"http://127.0.0.1:9999/none"
];

for (var i in test_case) {
	//console.log("test:" + test_case[i]);
	R.node.http.get(R.node.url.parse(test_case[i]), function(res) {
  	//console.log("Got response: " + res.statusCode);
		res.on('data', function (chunk) {
			var received;
			try {
				received = JSON.parse(chunk.toString());
			} catch (error) {
  			log(err);
			  log(err.stack);
				log("The received chunk cannot be parsed to JSON.");
				log(chunk.toString());
			}
			assert.equal(res.statusCode > 0, true, "http.get statusCode failure");
			//console.log(received);
		});

	}).on('error', function(e) {
		assert.equal(true, false, "http.get failure");
  	//console.log("Got error: " + e.message);
	});

}

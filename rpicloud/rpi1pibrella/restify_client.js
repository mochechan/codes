var restify = require('restify');
var client = restify.createJsonClient({
        url: 'http://kay.dlinkddns.com:9999',
        version: '*',
    });

var some_object = {'foo': 'bar', '42': 23}
client.post('/restifypost', some_object, function(err, req, res, obj) {
	console.log(obj);
});



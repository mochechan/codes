var querystring = require('querystring');
var http = require('http');
var dht22 = require('node-dht-sensor');

if (dht22.initialize(22,4)) setInterval(function(){
  var post_data = querystring.stringify({dht22: JSON.stringify(dht22.read())});
	//console.log(post_data);

  var post_options = {
      host: 'src.imoncloud.com',
      port: '38070',
      path: '/event/update_HT',
      method: 'POST',
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(post_data)
      }
  };

  var post_req = http.request(post_options, function(res) {
      res.setEncoding('utf8');
      res.on('data', function (chunk) {
          console.log('Response: ' + chunk);
      });
  });

  post_req.write(post_data);
  post_req.end();
}, 3000);


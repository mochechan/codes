
//////////////////////////////////////// express_restful

var express_restful = R.npm.express();
express_restful.use(R.npm["cookie-parser"]());
express_restful.use(R.npm["express-session"]({ secret: "xxcookie_secretxx", resave: true, saveUninitialized: true }));
express_restful.use(R.npm["body-parser"].urlencoded({extended:true}));
express_restful.use(R.npm["body-parser"].json());


express_restful.get('/login', function (req, res) {
	//console.log("============================ get");
	//console.log(req);
  //res.send('Hello World');
	var html = '<form action="/login" method="post">Your name: <input type="text" name="username"><br>' +
             '<button type="submit">Submit</button></form>';
  if (req.session.username) {
    html += '<br>Your username from your session is: ' + req.session.username;
  }
  res.send(html);
});

express_restful.post('/login', function(req, res){
	//console.log("============================ post");
	//console.log(req);
	if (req.body.username) req.session.username = req.body.username;
  res.redirect('/login');
	//res.send();
});

express_restful.all('/R/*', function (req, res) {
	if (!req.session.username) {
		res.redirect('/login');
		return;
	}

	var _uri1 = decodeURI(req.url);
	var command = _uri1.replace('/R/', '');
	R.event.emit('command', command, function () {
		//console.log("restful callback");
		//console.log(arguments);
		res.send(arguments);
	});
});

express_restful.listen(R.config.express_restful_port, function () { 
	R.log('express_restful is listening ' + R.config.express_restful_port); 
});



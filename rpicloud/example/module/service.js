

R.event.on("service", function(){
	console.log("service XXXXXXXXXXXXXXXXXX");
	console.log(arguments);

	switch (arguments[0].action) {
	case 'list':
		R.node.fs.readdir('./service', function(err, files){
			console.log(files);
		});
	break;
	case 'start':
	break;
	case 'stop':
	break;

	default:
	break;
	}
});



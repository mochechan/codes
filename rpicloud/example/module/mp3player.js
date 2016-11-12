/*
*/
var mp3_path = R.config.mp3path || __dirname;
R.log("mp3_path: " + mp3_path);

var player = R.module.player;

R.event.on("mp3player", function(){

	R.log("mp3player XXXXXXXXXXXXXXXXXX");
	R.log(arguments);

	if (!arguments[0]) {
		console.log("no any input");
		return;
	}

	if (arguments[0].command) {
		switch (arguments[0].command){
			case 'list':
			break;
			case 'play':
			break;
			case 'stop':
			break;
			default:
			break;
		}
	}

});



/*
*/


R.event.on("google_speech", function(){
	console.log("google_speech XXXXXXXXXXXXXXXXXX");
	console.log(arguments[0]);
	
	switch(arguments[0][0]){
		case 'ZH':
			// local IFS=+;/usr/bin/mplayer -ao alsa -really-quiet -noconsolecontrols "http://translate.google.com/translate_tts?ie=utf-8&tl=zh-TW&q=$*";
			// gpio mode 1 in; gpio mode 2 out; 
		break;
		case 'on':
		break;
		case 'off':
		break;
		case 'write':
		break;
		case 'read':
		break;
		default:
		break;
	}
});



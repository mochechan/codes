var ffrec = require('../ffmpeg_copy_rtsp.js');

//var ff = new ffrec('rtsp://163.22.32.118/live1.sdp');
var ff = new ffrec({
	rtsp_url: 'rtsp://163.22.32.62/live1.sdp',
	segment_time: 6,
	dir: '/tmp',
	filename_prefix: 'outputXXX'
});

ff.on('segment_start', function(file){
	console.log("on segment_start: " );
	console.log(file);
});

ff.on('segment_end', function(file){
	console.log("on segment_end: ");
	console.log(file);
});

ff.on('info', function(info){
	console.log("on info: " );
	console.log(info);
});

ff.on('close', function() {
	console.log("on close");
});

setTimeout(function(){
	ff.close();
	//console.log(ff);
},23456);


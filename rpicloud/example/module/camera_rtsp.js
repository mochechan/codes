/* rpi camera for rtsp video server

*/

var log = R.log;

var raspivid_ = "raspivid --output - --timeout 0 -hf --width 640 --height 360 --framerate 15 --verbose --bitrate 12345678 | cvlc --file-caching --live-caching --network-caching -vvv - --sout '#rtp{sdp=rtsp://:8554/live1.sdp}' :demux=h264";

R.event.on("camera_rtsp", function() {
	//console.log("in camera");
	//console.log(arguments);

	switch (arguments[0]) {
		case 'disable':
			R.event.emit("spawn", {control: "kill", tag: ["raspivid","http-server","janus"]});
		break;
		
		case 'enable':
		R.event.emit("spawn", {
			command: "sh",
			args: ["-c", raspivid_],
			options: {},
			stderr_on_data: function(data){
				console.log("stderr:" + data);
			},
			stdout_on_data: function(data){
				console.log("stdout:" + data);
			},
			on_close: function(code){
				console.log("on_close: " + code);
			},
			tag: ["raspivid"]
		});

			log("RPI camera for rtsp is enabled.");
		break;

		default:
		break;
	}
});

//setTimeout(function(){R.event.emit("camera_rtsp", "enable");}, 123);


/* camera on RPI
http://www.rs-online.com/designspark/electronics/blog/building-a-raspberry-pi-2-webrtc-camera 

RPI camera uses h264 to support Firefox webrtc without transcoding. 
*/

var log = R.log;

var raspivid_ = "raspivid --verbose --nopreview -hf -vf --width 640 --height 480 --framerate 10 --bitrate 1234567 --profile baseline --timeout 0 -o - | gst-launch-1.0 -v fdsrc ! h264parse ! rtph264pay config-interval=1 pt=96 ! udpsink host=127.0.0.1 port=8004";

R.event.on("camera_webrtc", function() {
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

		R.event.emit("spawn", {
			command: "/opt/janus/bin/janus",
			args: ["-F", "/opt/janus/etc/janus/"],
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
			tag: ["janus"]
		});

/*
		R.event.emit("spawn", {
			command: "http-server",
			args: ["/opt/janus/share/janus/demos/"],
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
			tag: ["http-server"]
		});
*/
			log("RPI camera is enabled.");
		break;

		default:
		break;
	}
});

//setTimeout(function(){R.event.emit("camera", "enable");}, 123);


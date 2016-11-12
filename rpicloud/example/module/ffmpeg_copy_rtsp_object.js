
var child_process = require("child_process");
var path = require("path");

function ffrec () {
	var that = this;
	//console.log(arguments);
	//console.log(typeof(arguments[0]));
	if (!arguments[0]) return;
	if (typeof(arguments[0]) == 'string') {
		that.rtsp_url = arguments[0];
	} else {
		that.rtsp_url = arguments[0].rtsp_url || 'pipe:0';
	}

	that.segment_time = arguments[0].segment_time || 6;
	that.dir = arguments[0].dir || __dirname;
	that.filename_prefix = arguments[0].filename_prefix || 'ffmpeg_saved';

	that.ffmpeg_args = arguments[0].ffmpeg_args || ['-y', '-loglevel', 'debug', '-i', arguments[0].rtsp_url, '-vcodec', 'copy', '-acodec', 'copy', '-force_key_frames', '\"expr:gte(t,n_forced*9)\"', '-segment_time', that.segment_time, '-f', 'segment', path.resolve(that.dir, that.filename_prefix + '%07d.mp4')];

	if (!that.info) that.info = {};

	that.ffmpeg = child_process.spawn('ffmpeg', that.ffmpeg_args);

	that.ffmpeg.stderr.on('data', function() {
		var stderr = arguments[0].toString('utf8').split('\n');
		//console.log(stderr);
		for (var i in stderr) {
			
			// to recognize video information
			if (stderr[i].indexOf('Stream') > -1 ) {
				if (stderr[i].indexOf('Video') > -1) {
					if (!that.info.video) {
						//console.log(stderr[i]);
						that.info.video = stderr[i];
					}
				} else if (stderr[i].indexOf('Audio') > -1) {
					if (!that.info.audio) {
						//console.log(stderr[i]);
						that.info.audio = stderr[i];
						if (that.info_callback && typeof(that.info_callback) === 'function') {
							that.info_callback(that.info);
						}
					}
				}
			}

			// to recognize segmentations
			if (stderr[i].indexOf('segment:') > -1 ) {
				var stder = stderr[i].match(/segment:.*' /);
				var stde = stder[0].replace(/'/ig,'').replace("segment:",'');
				if (stderr[i].indexOf('starts') > -1) {
					if (that.previous_start != stde) {
						if (that.segment_start_callback && typeof(that.segment_start_callback) === 'function') {
							that.segment_start_callback(path.parse(stde));
						}
					} 
					that.previous_start = stde;
				} else if (stderr[i].indexOf('ended') > -1) {
					if (that.previous_end != stde) {
						if (that.segment_end_callback && typeof(that.segment_end_callback) === 'function') {
							that.segment_end_callback(path.parse(stde));
						}
					} 
					that.previous_end = stde;
				}
			}
		} // end of for
	});
	that.ffmpeg.on('close', function() {
		//console.log(arguments);
		if (that.close_callback && typeof(that.close_callback) === 'function') 
			that.close_callback();
	});
}

ffrec.prototype.on = function () {
	//console.log(arguments);
	switch(arguments[0]){
	case 'info':
		if (arguments[1] && typeof(arguments[1]) === 'function') {
			this.info_callback = arguments[1];
		}
	break;
	case 'segment_start':
		if (arguments[1] && typeof(arguments[1]) === 'function') {
			this.segment_start_callback = arguments[1];
			//console.log("reg seg");
		}
	break;
	case 'segment_end':
		if (arguments[1] && typeof(arguments[1]) === 'function') {
			this.segment_end_callback = arguments[1];
			//console.log("reg seg");
		}
	break;
	case 'close':
		if (arguments[1] && typeof(arguments[1]) === 'function') {
			this.close_callback = arguments[1];
			//console.log("reg close");
		}
	break;
	default:
	break;
	}
}

ffrec.prototype.close = function () {
	//console.log('kill');
	this.ffmpeg.stdin.pause();
	this.ffmpeg.kill();
}

ffrec.prototype.stdinWrite = function () {
	this.ffmpeg.stdin.write(arguments[0], arguments[1]);
}

module.exports = ffrec;


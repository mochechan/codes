/* web/http handlers for file upload and user login
*/

var log = R.log; // for code self-contained
var formidable = require('formidable');
var fs = require('fs');

module.exports = {

"/upload_form": function (request, response) {
  log("/upload_form was called.");

  var body = '<html>'+ '<head>'+ '<meta http-equiv="Content-Type" '+
    'content="text/html; charset=UTF-8" />'+ '</head>'+ '<body>'+
    '<form action="/upload_file" enctype="multipart/form-data" '+ 'method="post">'+
    '<input type="file" name="upload" multiple="multiple">'+
    '<input type="submit" value="Upload file" />'+ '</form>'+ '</body>'+ '</html>';

  response.writeHead(200, {"Content-Type": "text/html"});
  response.write(body);
  response.end();
},

"/upload_file": function (request, response) {
	var that = this;
  log("/upload_file was called.");
  var form = new formidable.IncomingForm();
	form.encoding = 'utf-8'; //Sets encoding for incoming form fields.
	form.uploadDir = R.node.os.tmpDir(); //Sets the directory for placing file uploads in. You can move them later on using fs.rename(). The default is os.tmpDir().
	form.keepExtensions = true; //If you want the files written to form.uploadDir to include the extensions of the original files, set this property to true.
	//console.log(form.type); //Either 'multipart' or 'urlencoded' depending on the incoming request.
	form.maxFieldsSize = 2 * 1024 * 1024; //Limits the amount of memory all fields together (except files) can allocate in bytes. If this value is exceeded, an 'error' event is emitted. The default size is 2MB.
	form.maxFields = 1000; //Limits the number of fields that the querystring parser will decode. Defaults to 1000 (0 for unlimited).
	form.hash = false; //If you want checksums calculated for incoming files, set this to either 'sha1' or 'md5'.
	form.multiples = true; //If this option is enabled, when you call form.parse, the files argument will contain arrays of files for inputs which submit multiple files using the HTML5 multiple attribute.
	//console.log(form.bytesReceived); //The amount of bytes received for this form so far.
	//console.log(form.bytesExpected); //The expected number of bytes in this form.

	form.on('end', function () {
		log("formidable.on end (end of uploading) ");
	});

	form.on('aborted', function () {
		log("formidable.on aborted (abort uploading)");
	});

	form.on('error', function (err) { 
		log("formidable.on error (error uploading)");
		log(err);
	});
 
	form.on('file', function (name, file) {
		log("formidable.on file (finish uploading): " + name );
		log(file);
	});

	form.on('fileBegin', function (name, file) {
		log("formidable.on fileBegin (starting to upload) " + name );
		log(file);
	});

	form.on('field', function (name, value) {
		log("on field: name " + name + ", value " + value);
	});

	form.on('progress', function (bytesReceived, bytesExpected) { 
		var percent = (bytesReceived / bytesExpected * 100);
		if (!that.previous) that.previous = {bytesReceived: bytesReceived, bytesExpected: bytesExpected, percent: percent};
		if ((percent - that.previous.percent) >= 0.1) {
			console.log("formidable.on progress: bytesReceived " + bytesReceived + ", bytesExpected " + bytesExpected + ", percent " + (percent) + "% ");
			that.previous = {bytesReceived: bytesReceived, bytesExpected: bytesExpected, percent: percent};
		} else {
			//console.log('else ' + percent + ' ' + that.previous.percent);
		}
	});

  form.parse(request, function(error, fields, files) {
    log("parsing done files.upload:");
    log(files.upload);
    log("=========== fields:");
    log(fields);

		if (Array.isArray(files.upload)) {
			if (fields.preserveFileName === 'true' ) {
				for (var i in files.upload) {
					// Possible error on Windows systems: tried to rename to an already existing file 
					fs.rename(files.upload[i].path, R.node.path.resolve(form.uploadDir, files.upload[i].name), function (err) {
						if (err) {
							log("ERROR: file upload rename fails");
						}
					});
				}
			}
		} else {
			if (fields.preserveFileName === 'true' ) {
	  	  fs.rename(files.upload.path, R.node.path.resolve(form.uploadDir, files.upload.name), function(err) {
  	  	  if (err) {
						log("ERROR: file upload rename fails");
	  	    }
		    });
			}
		}
    response.writeHead(200, {"Content-Type": "text/html"});
    response.write("received image:<br/><img src='/upload_finish' />");
    response.end();
  });
},

"/upload_finish": function (request, response) {
  log("Request handler /upload_finish was called.");
  response.writeHead(200, {"Content-Type": "image/png"});
  fs.createReadStream("/tmp/test.png").pipe(response);
},

"/user_logout": function (request, response) {
 	request.session.data.user = "Guest";
  response.writeHead(200, {'Content-Type': 'text/plain'});
	var json = {comment: "You have been logged out."};
  response.write(JSON.stringify(json));
 	response.end();
},

"/user_login": function (request, response) {
	// Use this handler to login 
	// please note: this is just an example of how to hook auth into session.js, its not ideal at all
  // let's hardcode a username and password variable into the url
 	var urlParams = R.node.url.parse(request.url, true).query || {};

  if(typeof urlParams.user != 'undefined'){
 	  // if the "name" parameter has been sent, lets log in as that user
   	request.session.data.user = urlParams.user;
  }

	var json = { session: request.session, };

 	// request.session.data.user always defaults to "Guest"
  if(request.session.data.user == "Guest"){
		json.comment = "Hello, you are the guest user.";
 	} else {
		json.comment = "Hello, you are " + request.session.data.user + ". ";
 	}
  response.writeHead(200, {'Content-Type': 'text/plain'});
 	response.write(JSON.stringify(json));
  response.end();
},

"/user_status": function (request, response) {
	// Use this handler to see status
	// please note: this is just an example of how to hook auth into session.js, its not ideal at all
  // let's hardcode a username and password variable into the url
 	var urlParams = R.node.url.parse(request.url, true).query || {};

  if(typeof urlParams.user != 'undefined'){
 	  // if the "name" parameter has been sent, lets log in as that user
   	//request.session.data.user = urlParams.user;
  }

	var json = { session: request.session, };

 	// request.session.data.user always defaults to "Guest"
  if(request.session.data.user == "Guest"){
		json.comment = "Hello, you are the guest user.";
 	} else {
		json.comment = "Hello, you are " + request.session.data.user + ". ";
 	}
  response.writeHead(200, {'Content-Type': 'text/plain'});
 	response.write(JSON.stringify(json));
  response.end();
}

} // end of module.exports =


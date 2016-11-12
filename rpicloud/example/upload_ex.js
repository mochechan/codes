var http = require("http");
var url = require("url");
var querystring = require("querystring"), fs = require("fs"), formidable = require("formidable");


function route(handle, pathname, response, request) {
  console.log("About to route a request for " + pathname);
  if (typeof handle[pathname] === 'function') {
    handle[pathname](response, request);
  } else {
    console.log("No request handler found for " + pathname);
    response.writeHead(404, {"Content-Type": "text/html"});
    response.write("404 Not found");
    response.end();
  }
}


var handle = {};

handle["/upload_form"] = function html_start(response) {
  console.log("Request handler 'start' was called.");

  var body = '<html>'+ '<head>'+ '<meta http-equiv="Content-Type" '+
    'content="text/html; charset=UTF-8" />'+ '</head>'+ '<body>'+
    '<form action="/upload_file" enctype="multipart/form-data" '+ 'method="post">'+
    '<input type="file" name="upload" multiple="multiple">'+
    '<input type="submit" value="Upload file" />'+ '</form>'+ '</body>'+ '</html>';

    response.writeHead(200, {"Content-Type": "text/html"});
    response.write(body);
    response.end();
}

handle["/upload_file"] = function html_upload(response, request) {
  console.log("Request handler 'upload' was called.");

  var form = new formidable.IncomingForm();
  console.log("about to parse");
  form.parse(request, function(error, fields, files) {
    console.log("parsing done");

    /* Possible error on Windows systems: tried to rename to an already existing file */
    fs.rename(files.upload.path, "/tmp/test.png", function(err) {
      if (err) {
        fs.unlink("/tmp/test.png");
        fs.rename(files.upload.path, "/tmp/test.png");
      }
    });
    response.writeHead(200, {"Content-Type": "text/html"});
    response.write("received image:<br/>");
    response.write("<img src='/upload_finish' />");
    response.end();
  });
}

handle["/upload_finish"] = function html_show(response) {
  console.log("Request handler 'show' was called.");
  response.writeHead(200, {"Content-Type": "image/png"});
  fs.createReadStream("/tmp/test.png").pipe(response);
}


  http.createServer(function onRequest(request, response) {
		console.log("requested:" + request.url);
    var pathname = url.parse(request.url).pathname;
    console.log("Request for " + pathname + " received.");
    route(handle, pathname, response, request);
  }).listen(8888, function() {
  	console.log("Server has started.");
	});


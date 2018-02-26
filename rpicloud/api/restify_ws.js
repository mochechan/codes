/*
supports: restify with static html, websocket at the same port 

todo: restify client 
*/

const fs = require('fs')
const path = require('path')
// const cp = require('child_process')
const restify = require('restify')
const WebSocket = require('ws').Server

const Multi = require('multi-rest')

var log, _rc

exports.restify_server_start = function () {
  if (typeof (arguments[0]._rc) === 'object' && typeof (arguments[0]._rc.log) === 'function') {
    _rc = arguments[0]._rc
    log = arguments[0]._rc.log
  } else log = console.log

  // console.log("in restify_server_start arguments");
  // console.log(arguments);

  var parameters = {
    port: arguments[0].args.port,
    html: arguments[0].args.html
  }

  // console.log(parameters);

  var server = restify.createServer({ version: '1.0.0' })
  server.use(restify.plugins.gzipResponse())
  server.use(restify.plugins.bodyParser())
  var ws = new WebSocket({server: server})
  var wsClients = {} // all clients for ws

  var uploadDisk = new Multi({
    driver: {
      type: 'local',
      // path: path.resolve(__dirname, './Downloads/')
      path: '/data/ipcams/uploads/'
    },
    filename: (name) => { // the extention will be added automaticlly 
      console.log('assigning a filename')
      return name
    },
    filefields: {
      video: {
        type: 'video',
        thumbnail: {
          width: 100,
          time: ['10%'],
          count: 1
        },
        required: false,
        extensions: ['mp4']
      },
      image: {
        type: 'picture',
        thumbnail: {
          width: 400,
          height: 300
        },
        required: false,
        extensions: ['png', 'jpg']
      }
    }
  })

  server.use(restify.plugins.acceptParser(server.acceptable))
  server.use(restify.plugins.queryParser())
  server.use(restify.plugins.bodyParser())

  server.post('/upload', uploadDisk, function (req, res, next) {
    console.log('finishing uploading')
    console.log(req.files)
    fs.createReadStream(req.files.file.path).pipe(fs.createWriteStream(path.resolve('/data/ipcams/uploads/', req.files.file.name))).on('end', function () {
      // the callback function sould be deprecated.
      console.log('finished uploading')
      _rc.call_api({
        'jsonrpc': '2.0',
        'api': 'blackBox',
        'method': '',
        'id': 11,
        'params': [],
        'collection': 'file',
        'operator': 'insert',
        'filename': path.resolve('/data/ipcams/uploads/', req.files.file.name),
        'others': {},
        'callback': function () {
          console.log(arguments)
          return arguments
        }
      })
    })

    console.log(req.files.file.path)
    console.log(req.files.file.name)
    res.send({success: true, files: req.files, message: 'file uploaded :)'})
    return next()
  })

  server.get('/favicon.ico', (req, res, next) => {
	  /* if (err) {
      res.send(500)
      return next()
    } */
    log('returning favicon.ico')
    res.send({
      code: 200,
      noEnd: true
    })
    // res.write(file);
    res.end()
    return next()
  })

  server.get(/\/html\/?.*/, restify.plugins.serveStatic({directory: parameters.html || path.resolve(__dirname, '..')}))

  server.get(/\/download\/?.*/, restify.plugins.serveStatic({directory: '/data/ipcams/'}))

  server.get('/test/:name', (request, respond, next) => {
    console.log('restify get')
    console.log(request.params)
    console.log(request.headers['x-forwarded-for'] || request.connection.remoteAddress)

    respond.send(request.params)
  })

  server.post({path: '/restifypost', versions: ['1.0.0']}, function (request, result, next) {
    console.log('in /restifypost')
    console.log(request.headers['x-forwarded-for'] || request.connection.remoteAddress)

    console.log('request.body')
    console.log(request.body)

    let payload = request.body
    payload.callback = function () {
      console.log('in /restifypost callback(): ')
      log(arguments)
      let payloadResult = {
        jsonrpc: request.body.jsonrpc,
        result: arguments,
        id: request.body.id
      }

      log('/restifypost sending: ' + JSON.stringify(payloadResult))

      result.send(payloadResult)
    }

    // TODO: check inputs
    /* if (payload.jsonrpc !== '2.0') {
      result.send(JSON.stringify({'jsonrpc': '2.0', 'error': {'code': -32600, 'message': 'Invalid Request'}, 'id': null}))
      return next()
    } */

    _rc.call_api(payload)

    return next()
  })

  server.listen(parameters.port || 9999, function () {
    log('%s listening at %s', server.name, server.url)
  })

  ws.on('connection', function connection (s) {
    log('ws connection...')
    wsClients[s.id] = s

  	s.on('message', function incoming (message) {
      log('ws received: ')
      log(message)

  	  // console.log(`ws received: ${message}`);

      // FIXME: try catch
      var parsed = JSON.parse(message)

      var payload = parsed.payload

      payload.callback = function () {
        log('ws callback: ')
        log(arguments)
        var payloadResult = {
          result: arguments,
          transaction_id: parsed.transaction_id
        }
	    	log('ws sending:' + JSON.stringify(payloadResult))
	    	s.send(JSON.stringify(payloadResult))
      }

      // console.log(typeof(payload));

      _rc.call_api(payload)
  	})
  })

  ws.on('open', () => {
    log('ws on open')
    log(arguments)
  })

  ws.on('error', () => {
    log('ws on error')
    log(arguments)
  })

  ws.on('headers', () => {
    log('ws on headers')
    // console.log(arguments);
  })

  ws.on('close', function close () {
  	log('ws on close')
  })
}

exports.restify_server_stop = function () {

}

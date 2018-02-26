
const cp = require('child_process')

let nbg6817 = {}

module.exports = function ({args, callback, _rc}) {
  if (typeof (arguments[0]._rc) === 'object' && typeof (arguments[0]._rc.log) === 'function') log = arguments[0]._rc.log
  else log = console.log

  console.log('This is the nbg6817 event.')
  console.log(arguments)
  console.log(arguments[0].args)

  var args = arguments[0].args
  log('The log works in nbg6817.')
  if (typeof args.callback === 'function') {
    args.callback('return nbg6817')
  }

  function listen () {
    cp.exec('nc -l -p 1234', (err, stdout, stderr) => {
      if (err) {}
      nbg6817.cpuinfo = stdout
      check()
    })
    cp.exec('nc -l -p 1235', (err, stdout, stderr) => {
      if (err) {}
      nbg6817.meminfo = stdout
      check()
    })
    cp.exec('nc -l -p 1236', (err, stdout, stderr) => {
      if (err) {}
      nbg6817.uptime = stdout
      check()
    })
    cp.exec('nc -l -p 1237', (err, stdout, stderr) => {
      if (err) {}
      nbg6817.stat = stdout
      check()
    })
    cp.exec('nc -l -p 1238', (err, stdout, stderr) => {
      if (err) {}
      nbg6817.netstat = stdout
      check()
    })
    cp.exec('nc -l -p 1239', (err, stdout, stderr) => {
      if (err) {}
      nbg6817.netlink = stdout
      check()
    })
  }

  function check () {
    console.log(Object.keys(nbg6817))
    if (Object.keys(nbg6817).length === 6) {
      nbg6817.timestamp = Date.now()
      console.log(nbg6817)
      if (nbg6817 && nbg6817.netlink && nbg6817.netstat) {
        _rc.call_api({
          'jsonrpc': '2.0',
          'api': 'blackBox',
          'method': '',
          'id': 11,
          'params': [],
          'collection': 'nbg6817',
          'operator': 'insert',
          'string': JSON.stringify(nbg6817),
          'others': {},
          'callback': function () {
            // console.log(arguments)
            // return arguments
          }
        })

        for (let key in nbg6817) {
          delete nbg6817[key]
        }
      }
      listen()
    }
  }

  listen()
}

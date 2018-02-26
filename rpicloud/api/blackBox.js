/*

steps:

{filename:'', string:'', device:'deviceName et al.', comment:''}

{filename:'', string:'', device:'', comment:'', digest:''}

*/

const childProcess = require('child_process')
const http = require('http')

var log, rc

module.exports = function () {
  console.log('in insertBox() ')

  if (typeof (arguments[0]._rc) === 'object' && typeof (arguments[0]._rc.log) === 'function') {
    log = arguments[0]._rc.log
    rc = arguments[0]._rc
  } else log = console.log

  console.log(arguments[0].args)
  var args = arguments[0].args
  log(args)

  if (args.operator === 'verify') {
    console.log('in blockBox/verify')
    rc.call_api({api: 'mongodb',
      args: {operator: 'find',
        collection: args.collection,
        document0: {filename: args.filename},
        port: 9999,
        html: __dirname,
        callback: function () {
          console.log('=== found === ')
          // console.log(arguments)
          let blockData0 = arguments[1]
          let blockData1 = blockData0[0] || ''
          let blockData = blockData1['digestKey'] || '' // TODO: may crash, need more test
          console.log(blockData)
          // TODO: verify 
          sha256sum(args).then((arg) => {
            // console.log('stage 1 then')
            // console.log(arg)
            if (blockData.indexOf(arg.digest) === -1) {
              console.log('not verified')
              args.callback(null, {verified: false})
            } else {
              console.log('verified')
              args.callback(null, {verified: true})
            }
          })
        }}})
  } else {
    console.log('in blockBox/else')
    sha256sum(args).then((arg) => {
      console.log('======== stage 1 then() ')
      console.log(arg)
      // registerDigest => 
      return registerDigest(arg, args.collection, args.callback)
    }).then((arg) => {
      console.log('======== stage 2 then() ')
      console.log(arg)
    }).catch((arg) => {
      console.log('============ catch() ')
      console.log(arg)
    })
  }
}

function hexEncode (str) {
  let hex, i
  let result = ''
  for (i = 0; i < str.length; i++) {
    hex = str.charCodeAt(i).toString(16)
    result += ('000' + hex).slice(-4)
  }

  return result
}

function hexDecode (str) {
  let j
  let hexes = str.match(/.{1,4}/g) || []
  let back = ''
  for (j = 0; j < hexes.length; j++) {
    back += str.fromCharCode(parseInt(hexes[j], 16))
  }

  return back
}

function registerDigest ({filename, string, comment, deviceID, digest} = {}, collection, callback) {
  deviceID = deviceID || 'default'
  console.log('in registerDigest() ', filename, string, comment, deviceID)
  console.log(typeof callback)
  return new Promise((resolve, reject) => {
    if (digest && typeof digest === 'string' && digest.length > 10) {
      let postData = {'jsonrpc': '2.0', 'method': 'eth_sendTransaction', 'params': [{'from': '0xa2cd4f5dae49f7f9ab8be71886f4c7267f8f9c09', 'value': '0x9184e72a000', 'data': '0x' + digest + '00ff' + hexEncode(deviceID)}], 'id': 67}

      let txid = ''
      geth(JSON.stringify(postData), function (response) {
        console.log('xxxxxxxxxxxx getting txID')
        let args = JSON.parse(arguments['1'])
        console.log(args)
        if (args.error) {
          return reject(new Error(JSON.stringify(args.error)))
        }
        txid = args['result']
        var listening = setInterval(function () {
          // console.log('in interval() ')
          let postData2 = {'jsonrpc': '2.0', 'method': 'eth_getTransactionByHash', 'params': [txid], 'id': 67}
          // console.log(postData2)
          geth(JSON.stringify(postData2), function () {
            console.log('xxxxxxxxxxxx tx')
            let txresponse = JSON.parse(arguments['1'])
            console.log(txresponse['result'])

            if (txresponse['result']['blockNumber'] != null) {
              let document = {
                blockNumber: txresponse['result']['blockNumber'],
                blockHash: txresponse['result']['blockHash'],
                transactionHash: txresponse['result']['hash'],
                digestKey: txresponse['result']['input'],
                filename: filename,
                string: string,
                comment: comment,
                deviceID: deviceID
              }
              mongodbInsert(document, collection, callback)
              clearInterval(listening)
            }
          })
        }, 5000)
      })
    } else {
      // FIXME: 
      return reject(new Error('incorrect digest'))
    }
  })
}

function mongodbInsert (json, collection, callback) {
  rc.call_api({api: 'mongodb',
    args: {operator: 'insertMany',
      collection: collection,
      document0: [json],
      port: 9999,
      html: __dirname,
      callback: callback || function () {
        console.log('=== this is a callback. === ')
        console.log(arguments)
        // TODO: update blockNumber, blockHash, 
      }}})
}

function sha256sum ({filename, string, comment, device} = {}) {
  return new Promise((resolve, reject) => {
    let cmd = ' sha256sum '
    if (filename) {
      cmd = cmd + filename
    } else if (string) {
      cmd = 'echo ' + string + ' | ' + cmd
    } else {
      return reject(new Error('invalid input in sha256sum() '))
    }

    // TODO: check if file exists 

    childProcess.exec(cmd, (err, stdout, stderr) => {
      if (err) {
        reject(err)
      }
      return resolve({digest: parseSha256sum(stdout)['digest'],
        filename: filename,
        string: string,
        comment: comment,
        device: device
      })
    })
  })
}

// supports a single file currently 
function parseSha256sum (string) {
  let parsed = string.replace(/\n/g, '').split('  ')
  return {
    digest: parsed[0],
    filename: parsed[1]
  }
}

// post data to a geth instance via json-rpc 2.0
function geth (postData, callback) {
  console.log('in geth() ', postData)
  let postOptions = {
    host: 'localhost',
    port: '8545',
    path: '/',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(postData)
    }
  }

  let postReq = http.request(postOptions, function (res) {
    let data = ''
    res.setEncoding('utf8')
    res.on('data', (chunk) => {
      data = data + chunk
    })
    res.on('end', () => {
      callback(null, data)
    })
  })

  postReq.write(postData)
  postReq.end()
}

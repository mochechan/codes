/* customizable raspberry pi cloud 

*/

'use strict'

let rc = function () {
  if (!/v6.*/.test(process.version)) {
    console.log('WARN: nodejs shoud be >= v6.*, current: ' + process.version)
  }

  let that = this
  that.status = {dirname: __dirname, filename: __filename}
  that.config = require('./config.json')
  that.verbose = arguments[0].verbose || that.config.verbose || false
  that.config.package = require('./package.json')

  that.node = {
    events: require('events'),
    fs: require('fs'),
    path: require('path'),
    os: require('os'),
    url: require('url')
  }

  that.npm = {
    // requirejs: require('requirejs'), 
    // eventemitter2: require('eventemitter2').EventEmitter2,
  }

  // that.npm.requirejs.config({baseUrl: __dirname , nodeRequire: require});

  // that.shared_utility = require('./html/js/shared_utility.js');
  let log = that.log = require('./static/log.js')
  // that.log("that.log"); //The log function can be used now.

  that.api = {} // important: Never call any api in this function rc () {}.

  // done: injecting api from ./api/*.js 
  // todo: recursively function
  that.node.fs.readdir(that.node.path.resolve(__dirname, 'api'), function () {
    if (arguments[0]) {
      throw arguments[0]
    }

    for (let i in arguments[1]) {
      let filename = arguments[1][i]
      if (!filename.match(/\.js$/i)) {
        log('invalid filename: ' + filename + ' ')
        continue
      }

      let apiFile = require(that.node.path.resolve(__dirname, 'api', filename))

      let apiName = filename.replace(/\.js$/i, '')

      if (typeof (apiFile) === 'function') {
        if (typeof (that.api[apiName]) !== 'undefined') {
          log('ignoring duplicated api_name: ' + apiName)
          continue
        }
        log('injecting api: ' + apiName + ', from: ' + filename)
        that.api[apiName] = apiFile
      } else if (typeof (apiFile) === 'object') {
        for (let j in apiFile) {
          if (typeof (that.api[j]) !== 'undefined') {
            log('duplicated api_name: ' + apiName)
            log('ignoring duplicated api_name: ' + apiName)
          }
          log('injecting api: ' + j + ', from: ' + filename)
          that.api[j] = apiFile[j]
        }
      } else {
        log('ERROR: please debug')
        process.exit(99)
      }
    }
  })
} // end of function rc

rc.prototype.add_api = function (arg) {
  let api = arg.api || arg.api_name
  let callback = arg.callback || arg.cb

  if (typeof (api) === 'string' && typeof (callback) === 'function') {
    if (this.api[api]) {
      this.log('overwriting a existing API: ' + api)
    } else {
      this.log('adding a new API: ' + api)
    }
    this.api[api] = callback
  };
}

rc.prototype.list_api = function () {
  let apiList = []
  for (let i in this.api) {
    apiList.push(i)
  }
  return apiList
}

// TODO: callApi should return a Promise
rc.prototype.call_api = function (apiCall) {
  // console.log("In call_api");
  // console.log(api_call);

  let that = this
  if (typeof (apiCall) === 'undefined') {
    that.log('ERROR: undefined API call')
    return
  }

  if (typeof (apiCall) !== 'object') {
    that.log('ERROR: API call requires an object input. ' + typeof (apiCall))
    return
  }

  let apiName = apiCall.api_name || apiCall.api
  let apiArgs = apiCall.api_args || apiCall.args || apiCall

  if (typeof (apiName) !== 'string') {
    that.log('ERROR: The given api_name is not a string. ' + typeof (apiName))
    return
  }

  if (typeof (that.api[apiName]) === 'function') {
    let errorStack = (new Error().stack)
    let esArray = errorStack.split('\n')
    let caller = (esArray[2].match(/\/.*\.[jJ][sS]:[0-9]*:[0-9]*/)[0])
    that.log('' + caller + ' is calling api: ' + apiName + ' with args: ' + JSON.stringify(apiArgs))
    process.nextTick(function () {
      that.api[apiName]({_rc: that, args: apiArgs})
    })
  } else if (typeof (that.api[apiName]) === 'undefined') {
    that.log('WARN: undefined api: ' + apiName)
  } else {
    that.log('invalid api: ' + apiName)
    that.log('ERROR: please debug')
    process.nextTick(function () {
      process.exit(99)
    })
  }
}

rc.prototype.on = function () {
  switch (arguments[0]) {
    case 'error':
      break
    case 'disposed':
      break
    default:
      break
  }
}

rc.prototype.get = function (args) {
  let that = this
  switch (args) {
    case 'status':
      that.log(this.module)
      break
    case '':
      break
    default:
      break
  }
}

rc.prototype.set = function (args) {
  let that = this
  switch (args) {
    case 'status':
      that.log(this.module)
      break
    case '':
      break
    default:
      break
  }
}

module.exports = rc

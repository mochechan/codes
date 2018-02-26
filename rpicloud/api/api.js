/* in testing

*/

var log, _rc

exports.list_api = function listApi () {
  if (typeof (arguments[0]._rc) === 'object' && typeof (arguments[0]._rc.log) === 'function') {
    log = arguments[0]._rc.log
    _rc = arguments[0]._rc
  } else log = console.log
  log('in list_api')
  // log(arguments);
  console.log(_rc.api)
  log(_rc.api)
}

// input: {api}
exports.call_api = function callApi () {
  if (typeof (arguments[0]._rc) === 'object' && typeof (arguments[0]._rc.log) === 'function') {
    log = arguments[0]._rc.log
    _rc = arguments[0]._rc
  } else log = console.log
  log('in call_api')
  // log(arguments);
  console.log(_rc.api)
  _rc.call_api({api_name: '', api_args: arguments[0].args})
}

var log

module.exports = function demo1 () {
  if (typeof (arguments[0]._rc) === 'object' && typeof (arguments[0]._rc.log) === 'function') log = arguments[0]._rc.log
  else log = console.log

  console.log('This is the demo1 event.')
  console.log(arguments)
  console.log(arguments[0].args)

  var args = arguments[0].args
  log('The log works in demo1.')
  if (typeof args.callback === 'function') {
    args.callback('return demo1')
  }
}

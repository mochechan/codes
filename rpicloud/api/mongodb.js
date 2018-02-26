/*
https://www.npmjs.com/package/mongodb

*/

const MongoClient = require('mongodb').MongoClient
const assert = require('assert')

var mongodbInstance = {}
var log

let url = 'mongodb://localhost:27017/'

mongodbInstance[url] = new Mongodb(url)

module.exports = function mongodb () {
  console.log('in mongodb() ')

  if (typeof (arguments[0]._rc) === 'object' && typeof (arguments[0]._rc.log) === 'function') log = arguments[0]._rc.log
  else log = console.log

  // console.log('This is the mongodb event.')
  // console.log(arguments)
  // console.log(arguments[0].args)
  var args = arguments[0].args
  log(args)

  switch (args.operator) {
    case 'connect':
      // deprecated: already connected
      break
    case 'insertMany':
      mongodbInstance[url].db.collection(args.collection || 'documents').insertMany(args.document0, args.callback)
      break
    case 'find':
      mongodbInstance[url].db.collection(args.collection || 'documents').find(args.document0).toArray(args.callback)
      break
    case 'updateOne':
      mongodbInstance[url].db.collection(args.collection || 'documents').updateOne(args.document0, args.document1, args.callback)
      break
    case 'deleteOne':
      mongodbInstance[url].db.collection(args.collection || 'documents').deleteOne(args.document0, args.callback)
      break
    case 'listCollections':
      console.log('in listCollections: ')
      mongodbInstance[url].db.listCollections().toArray(args.callback)
      break
    case 'createCollection':
      console.log('in createCollection: ')
      mongodbInstance[url].db.createCollection(args.collection, function () { console.log(arguments) })
      break
    case 'renameCollection':
      // TODO: rename/drop a collection
      break
    case 'dropCollection':
      break
    case 'listDatabases':
      console.log('in listDatabases: ')
      // mongodbInstance[url].admin().listDatabases().toArray(args.callback) //useless
      mongodbInstance[url].db.admin().listDatabases(args.callback)
      break
    case 'close':
      mongodbInstance[url].db.close()
      break
    default:
      args.callback(new Error('invalid operation'))
  }
}

function Mongodb (mongodbUrl) {
  var that = this
  that.url = mongodbUrl || 'mongodb://localhost:27017/'
  // Use connect method to connect to the Server 
  MongoClient.connect(that.url, function (err, db) {
    assert.equal(null, err)
    console.log('Connected correctly to the mongodb server')
    that.db = db
  })
}

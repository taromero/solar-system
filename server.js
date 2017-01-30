var argv = require('yargs').argv
var Promise = require('bluebird')
var MongoClient = Promise.promisifyAll(require('mongodb').MongoClient)
var Hapi = require('hapi')
var server = new Hapi.Server()

var dbUser = argv.db_user
var dbPass = argv.db_pass
var mongoUrl = `mongodb://${dbUser}:${dbPass}@ds137149.mlab.com:37149/solar-system`

server.connection({ port: 3000, host: 'localhost' })

server.route({
  method: 'GET',
  path: '/days/{day}',
  handler: function (request, reply) {
    MongoClient.connectAsync(mongoUrl)
      .then((db) => {
        var collection = db.collection('forecast')
        var query = collection.find({ day: parseInt(request.params.day) })
        return Promise.promisify(query.toArray, { context: query })()
      })
      .get(0)
      .then((record) => reply({ day: record.day, forecast: record.forecast }))
  }
})

server.start((err) => {
  if (err) throw err
  console.log(`Server running at: ${server.info.uri}`)
})

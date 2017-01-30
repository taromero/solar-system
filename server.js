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
      .then((record) => {
        reply({
          day: record.day,
          forecast: record.forecast,
          visualize: `ml-solar-sytem.now.com/visualize?day=${record.day}`
        })
      })
  }
})
server.register(require('inert'), (err) => {
  if (err) throw err

  server.route({
    method: 'GET',
    path: '/vizualizer',
    handler: function (request, reply) {
      reply.file('solar-system.html')
    }
  })

  server.route({
    method: 'GET',
    path: '/bundle.js',
    handler: function (request, reply) {
      reply.file('bundle.js')
    }
  })
})

server.start((err) => {
  if (err) throw err
  console.log(`Server running at: ${server.info.uri}`)
})

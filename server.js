var Promise = require('bluebird')
var MongoClient = Promise.promisifyAll(require('mongodb').MongoClient)
var Hapi = require('hapi')
var server = new Hapi.Server()

var mongoUrl = `mongodb://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@ds137149.mlab.com:37149/solar-system`

server.connection({ port: 3000, host: 'localhost' })

server.route({
  method: 'GET',
  path: '/days/{day}',
  handler: function (request, reply) {
    var serverBaseUrl = `${request.connection.info.protocol}://${request.info.host}`
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
          visualize: `${serverBaseUrl}/visualizer?day=${record.day}`
        })
      })
  }
})
server.register(require('inert'), (err) => {
  if (err) throw err

  server.route({
    method: 'GET',
    path: '/visualizer',
    handler: function (request, reply) {
      reply.file('client/solar-system.html')
    }
  })

  server.route({
    method: 'GET',
    path: '/bundle.js',
    handler: function (request, reply) {
      reply.file('client/bundle.js')
    }
  })
})

server.start((err) => {
  if (err) throw err
  console.log(`Server running at: ${server.info.uri}`)
})

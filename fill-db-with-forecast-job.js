var argv = require('yargs').argv
var PlanetFactory = require('./planet-factory')
var ClimateForecaster = require('./climate-forecaster')
var Promise = require('bluebird')
var co = require('co')
var MongoClient = Promise.promisifyAll(require('mongodb').MongoClient)

var dbUser = argv.db_user
var dbPass = argv.db_pass

if (!dbUser || !dbPass) {
  throw new Error('user/password values must be supplied as CLI arguments')
}

var planets = PlanetFactory.sample()

var roughtNumberOfDaysIn10Years = 365 * 10 + 2 // 2 leap-years in average within a 10 years period

var forecast = {}

forecast.drought = ClimateForecaster.daysForCondition(planets, roughtNumberOfDaysIn10Years, 'centerAligned')
forecast.rain = ClimateForecaster.daysForCondition(planets, roughtNumberOfDaysIn10Years, 'planetsContainSun')
forecast.optimalPressureAndTemperature = ClimateForecaster.daysForCondition(planets, roughtNumberOfDaysIn10Years, 'alignedButNotThroughCenter')

co(function * () {
  var mongoUrl = `mongodb://${dbUser}:${dbPass}@ds137149.mlab.com:37149/solar-system`
  console.log('connecting to mongoDb')
  var db = yield MongoClient.connectAsync(mongoUrl)

  console.log('generating records to create')
  var recordsToCreate = generateRange(roughtNumberOfDaysIn10Years)
    .map(toForecast)

  console.log('creating records')
  var collection = Promise.promisifyAll(db.collection('forecast'))
  var dbResponse = yield collection.insertManyAsync(recordsToCreate)
  console.log('done creating records')
  console.log(`inserted ${dbResponse.ops.length} records`)
}).catch((err) => console.log('err', err))

function toForecast (day) {
  var dbRecord = { day: day }
  if (forecast.drought.indexOf(day) >= 0) {
    dbRecord.forecast = 'drought'
  } else if (forecast.rain.indexOf(day) >= 0) {
    dbRecord.forecast = 'rain'
  } else if (forecast.optimalPressureAndTemperature.indexOf(day) >= 0) {
    dbRecord.forecast = 'optimal pressure and temperature'
  } else {
    dbRecord.forecast = 'inconclusive'
  }
  return dbRecord
}

function generateRange (max) {
  return Array.from(new Array(max), (x, i) => i + 1)
}


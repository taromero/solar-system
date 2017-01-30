var PlanetFactory = require('./planet-factory')
var ClimateForecaster = require('./climate-forecaster')

var planets = [
  PlanetFactory.new({ name: 'ferengi', degrees: 0, distanceFromCenter: 500, angularVelocity: -1, orbitColor: 'green' }),
  PlanetFactory.new({ name: 'vulcano', degrees: 0, distanceFromCenter: 1000, angularVelocity: 5, orbitColor: 'teal' }),
  PlanetFactory.new({ name: 'betasoide', degrees: 0, distanceFromCenter: 2000, angularVelocity: -3, orbitColor: 'olive' })
]

var roughtNumberOfDaysIn10Years = 365 * 10 + 2 // 2 leap-years in average within a 10 years period
var droughtPeriods = ClimateForecaster.daysForCondition(planets, roughtNumberOfDaysIn10Years, 'centerAligned')
console.log('Drought periods # of days', droughtPeriods.length)

var rainPeriods = ClimateForecaster.daysForCondition(planets, roughtNumberOfDaysIn10Years, 'planetsContainSun')
console.log('Rain periods # of days', rainPeriods.length)

var maxAreas = ClimateForecaster.daysWithMaxTriangleContainingSun(planets, roughtNumberOfDaysIn10Years)
console.log('Days with raining peaks', maxAreas.days)

var optimalPressureAndTemperature = ClimateForecaster.daysForCondition(planets, roughtNumberOfDaysIn10Years, 'alignedButNotThroughCenter')
console.log('Optimal pressure and temperature # of days', optimalPressureAndTemperature.length)

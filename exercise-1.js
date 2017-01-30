var PlanetFactory = require('./planet-factory')
var ClimateForecaster = require('./climate-forecaster')

var planets = PlanetFactory.sample()

var roughtNumberOfDaysIn10Years = 365 * 10 + 2 // 2 leap-years in average within a 10 years period
var droughtPeriods = ClimateForecaster.daysForCondition(planets, roughtNumberOfDaysIn10Years, 'centerAligned')
console.log('Drought periods # of days', droughtPeriods.length)

var rainPeriods = ClimateForecaster.daysForCondition(planets, roughtNumberOfDaysIn10Years, 'planetsContainSun')
console.log('Rain periods # of days', rainPeriods.length)

var maxAreas = ClimateForecaster.daysWithMaxTriangleContainingSun(planets, roughtNumberOfDaysIn10Years)
console.log('Days with raining peaks', maxAreas.days)

var optimalPressureAndTemperature = ClimateForecaster.daysForCondition(planets, roughtNumberOfDaysIn10Years, 'alignedButNotThroughCenter')
console.log('Optimal pressure and temperature # of days', optimalPressureAndTemperature.length)

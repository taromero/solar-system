var PlanetFactory = require('./planet-factory')
var ClimateForecaster = require('./climate-forecaster')

var planets = PlanetFactory.sample()

var tenYears = 365 * 10 + 2 // 2 leap-years in average within a 10 years period
var droughtPeriods = ClimateForecaster.daysForCondition(planets, tenYears, 'centerAligned')
console.log('Drought periods # of days', droughtPeriods.length)

var rainPeriods = ClimateForecaster.daysForCondition(planets, tenYears, 'planetsContainSun')
console.log('Rain periods # of days', rainPeriods.length)

var maxAreas = ClimateForecaster.daysWithMaxTriangleContainingSun(planets, tenYears)
console.log('Days with raining peaks', maxAreas.days)

var optimalPressureAndTemperature = ClimateForecaster.daysForCondition(planets, tenYears, 'alignedButNotThroughCenter')
console.log('Optimal pressure and temperature # of days', optimalPressureAndTemperature.length)

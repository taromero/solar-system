var PlanetFactory = require('../models/planet-factory')
var Geometry = require('./geometry-utils')

module.exports = {
  daysForCondition: function (planets, maxDays, fnStr) {
    return generateRange(maxDays).filter((i) => this[fnStr](planets.map((p) => p.moveToDay(i)), i))
  },
  centerAligned: function (planets, day) {
    planets.forEach((p) => p.moveToDay(day))
    return this.alignDuringDay(planets, day) &&
      Geometry.straightLineAlignedWithPoint([planets[0], planets[1]], { x: 0, y: 0 })
  },
  alignedButNotThroughCenter: function (planets, day) {
    return this.alignDuringDay(planets, day) &&
      !Geometry.straightLineAlignedWithPoint([planets[0], planets[1]], { x: 0, y: 0 })
  },
  // Checks if the planet in the middle orbit crosses the line
  // formed by the 2 planets in the inner and outer orbits.
  alignDuringDay: function (planets, day) {
    var d1 = planets.map((p) => PlanetFactory.new(p)).map((p) => p.moveToDay(day))
    var d2 = planets.map((p) => PlanetFactory.new(p)).map((p) => p.moveToDay(day + 1))

    var lineSideNumberToday = Geometry.lineSideNumber([d1[0], d1[2]], d1[1])
    var lineSideNumberTomorrow = Geometry.lineSideNumber([d2[0], d2[2]], d2[1])
    return lineSideNumberToday === 0 || ((lineSideNumberToday > 0) !== (lineSideNumberTomorrow > 0))
  },
  planetsContainSun: function (planets, day) {
    return Geometry.insideTriangle({x: 0, y: 0}, planets)
  },
  daysWithLocalMaxTriangleContainingSun: function (planets, maxDays) {
    return generateRange(maxDays).filter(function (day) {
      var d0 = planets.map((p) => PlanetFactory.new(p)).map((p) => p.moveToDay(day - 1))
      var d1 = planets.map((p) => PlanetFactory.new(p)).map((p) => p.moveToDay(day))
      var d2 = planets.map((p) => PlanetFactory.new(p)).map((p) => p.moveToDay(day + 1))
      return Geometry.triangleArea(d0) < Geometry.triangleArea(d1) &&
        Geometry.triangleArea(d2) < Geometry.triangleArea(d1)
    })
  }
}

function generateRange (max) {
  return Array.from(new Array(max), (x, i) => i + 1)
}


var PlanetFactory = require('./planet-factory')
var Geometry = require('./geometry-utils')

module.exports = {
  daysForCondition: function (planets, maxDays, fnStr) {
    return generateRange(maxDays).filter((i) => this[fnStr](planets.map((p) => p.moveToDay(i)), i))
  },
  centerAligned: function (planets, day) {
    return this.alignDuringDay(planets, day) &&
      Geometry.straightLineContainsPoint([planets[0], planets[1]], { x: 0, y: 0 })
  },
  alignedButNotThroughCenter: function (planets, day) {
    return this.alignDuringDay(planets, day) &&
      !Geometry.straightLineContainsPoint([planets[0], planets[1]], { x: 0, y: 0 })
  },
  // Checks if the planet in the middle orbit crosses the line
  // formed by the 2 planets in the inner and outer orbits.
  alignDuringDay: function (planets, day) {
    var d1 = planets.map((p) => PlanetFactory.new(p)).map((p) => p.moveToDay(day))
    var d2 = planets.map((p) => PlanetFactory.new(p)).map((p) => p.moveToDay(day + 1))

    return (
      Geometry.angleBetweenPoints(d1[1], d1[0]) <= Geometry.angleBetweenPoints(d1[1], d1[2]) &&
      Geometry.angleBetweenPoints(d2[1], d2[0]) >= Geometry.angleBetweenPoints(d2[1], d2[2])
    ) ||
    (
      Geometry.angleBetweenPoints(d1[1], d1[0]) >= Geometry.angleBetweenPoints(d1[1], d1[2]) &&
      Geometry.angleBetweenPoints(d2[1], d2[0]) <= Geometry.angleBetweenPoints(d2[1], d2[2])
    )
  },
  maxTriangle: { area: 0 },
  planetsContainSun: function (planets, day) {
    var area = Geometry.triangleArea(planets)
    if (area > this.maxTriangle.area) {
      this.maxTriangle.area = area
      this.maxTriangle.day = day
    }
    return Geometry.inside({x: 0, y: 0}, planets)
  },
  daysWithMaxTriangleContainingSun: function (planets, maxDays) {
    var maxArea = { area: 0, days: [] }
    generateRange(maxDays).forEach((i) => {
      planets.map((p) => p.moveToDay(i))
      var area = Geometry.triangleArea(planets)
      if (area > maxArea.area) {
        maxArea.area = area
        maxArea.days = [i]
      } else if (area === maxArea.area) {
        maxArea.days.push(i)
      }
    })
    return maxArea
  }
}

function generateRange (max) {
  return Array.from(new Array(max), (x, i) => i + 1)
}


var PlanetFactory = require('./planet-factory')
var Geometry = require('./geometry-utils')

window.onload = function () {
  var stage = new createjs.Stage('demoCanvas')
  var planets = PlanetFactory.sample()

  var solarSystem = SolarSystem.new(stage, planets)
  solarSystem.draw()
  solarSystem.updatePlanets(0)

  window.solarSystem = solarSystem

  document.getElementById('animate-planets')
    .addEventListener('click', () => solarSystem.animatePlanets(360))
}

var SolarSystem = {
  new: function (stage, planets) {
    return {
      planets: planets,
      animatePlanets: function (counter) {
        if (counter < 0) return
        this.updatePlanets(counter)
        setTimeout(() => this.animatePlanets(counter - 1), 50)
      },
      updatePlanets: function (day) {
        var self = this
        planets.forEach(updatePlanetPosition(this.points, day))
        this.drawLine(this.points)
        stage.update()

        function updatePlanetPosition (points, day) {
          return function (planet) {
            planet.moveToDay(day)
            var coords = self.coordinatesFromAnguleAndDistance(planet.degrees, planet.distanceFromCenter)
            Object.assign(points[planet.name], coords)
          }
        }
      },
      draw: function (days) {
        var self = this
        planets.forEach((planet) => createCircle(planet.distanceFromCenter, planet.orbitColor))

        var points = planets
          .map(toNamedCoordinates)
          .reduce(toNamedPoints, {})

        this.drawLine(points)
        this.points = points

        // the sun
        createPoint(0, 0, 'yellow')

        stage.update()

        return points

        function toNamedCoordinates (planet) {
          planet.moveToDay(days)
          var coords = self.coordinatesFromAnguleAndDistance(planet.degrees, planet.distanceFromCenter)
          return Object.assign(coords, { name: planet.name })
        }

        function toNamedPoints (prev, curr) {
          var container = {}
          container[curr.name] = createPoint(curr.x, curr.y, 'maroon')
          return Object.assign(prev, container)
        }

        function createCircle (radius, color) {
          var circle = new createjs.Shape()
          circle.graphics.setStrokeDash([2,2])
          circle.graphics.setStrokeStyle(2).beginStroke(color).drawCircle(0, 0, radius)
          circle.x = 200
          circle.y = 200
          stage.addChild(circle)
          return circle
        }

        function createPoint (x, y, color) {
          var point = new createjs.Shape()
          point.graphics.beginFill(color).drawCircle(200, 200, 5)
          point.x = x
          point.y = y
          stage.addChild(point)
          return point
        }
      },
      drawLine: function (points) {
        if (this.unifierLine) stage.removeChild(this.unifierLine)
        var f = points.ferengi
        var v = points.vulcano
        var b = points.betasoide
        this.unifierLine = new createjs.Shape()
        this.unifierLine.graphics.beginStroke('black')
        this.unifierLine.graphics.moveTo(f.x, f.y).lineTo(v.x, v.y).lineTo(b.x, b.y).lineTo(f.x, f.y)
        this.unifierLine.x = 200
        this.unifierLine.y = 200
        stage.addChild(this.unifierLine)
      },
      coordinatesFromAnguleAndDistance: function (degrees, distance) {
        var coords = {
          x: Math.cos(Geometry.degreesToRadians(degrees)) * distance,
          // y coordinates at the canvas are inverted, so we need to change the sign
          y: -Math.sin(Geometry.degreesToRadians(degrees)) * distance
        }
        return coords
      }
    }
  }
}


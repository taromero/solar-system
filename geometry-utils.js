module.exports = {
  straightLineContainsPoint: function (line, point) {
    var angleLine = this.angleBetweenPoints(line[0], line[1])
    var angleWithPoint = this.angleBetweenPoints(line[0], point)
    return angleLine === angleWithPoint || angleLine + 180 === angleWithPoint
  },
  angleBetweenPoints: function (p1, p2) {
    return Math.round(this.radiansToDegrees(Math.atan2(p2.y - p1.y, p2.x - p1.x)))
  },
  triangleArea: function (points) {
    var side1 = pointsDistance(points[0], points[1])
    var side2 = pointsDistance(points[1], points[2])
    var side3 = pointsDistance(points[2], points[0])
    // half of the perimeter
    var hp = (side1 + side2 + side3) / 2
    // Heron's Formula
    return Math.sqrt(hp * (hp - side1) * (hp - side2) * (hp - side3))

    function pointsDistance (point1, point2) {
      var xDistance = point1.x - point2.x
      var yDistance = point1.y - point2.y
      return Math.hypot(xDistance, yDistance)
    }
  },
  // almost copy/pasted from https://github.com/substack/point-in-polygon/blob/master/index.js
  inside: function (point, vs) {
    var x = point.x
    var y = point.y

    var inside = false
    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
      var xi = vs[i].x
      var yi = vs[i].y
      var xj = vs[j].x
      var yj = vs[j].y

      var intersect = ((yi > y) !== (yj > y)) &&
        (x < (xj - xi) * (y - yi) / (yj - yi) + xi)
      if (intersect) inside = !inside
    }

    return inside
  },
  radiansToDegrees: function (radians) {
    return radians * 180 / Math.PI
  },
  degreesToRadians: function (degrees) {
    return degrees * (Math.PI / 180)
  }
}

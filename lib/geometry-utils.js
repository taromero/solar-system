module.exports = {
  straightLineAlignedWithPoint: function (line, point) {
    var angleLine = this.angleBetweenPoints(line[0], line[1])
    var angleWithPoint = this.angleBetweenPoints(line[0], point)
    return angleLine === angleWithPoint ||
      angleLine + 180 === angleWithPoint ||
      angleLine - 180 === angleWithPoint
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
  // Checks if the point is on the same side on each line of the triangle.
  insideTriangle: function (point, triangle) {
    var b0 = this.lineSideNumber([triangle[0], triangle[1]], point) < 0
    var b1 = this.lineSideNumber([triangle[1], triangle[2]], point) < 0
    var b2 = this.lineSideNumber([triangle[2], triangle[0]], point) < 0
    return ((b0 === b1) && (b1 === b2))
  },
  // Numbers with the same sign are within the same side of the line,
  // and those with different signs are on opposite sides.
  lineSideNumber: function (line, point) {
    return (point.x - line[0].x) * (line[1].y - line[0].y) - (point.y - line[0].y) * (line[1].x - line[0].x)
  },
  radiansToDegrees: function (radians) {
    return radians * 180 / Math.PI
  },
  degreesToRadians: function (degrees) {
    return degrees * (Math.PI / 180)
  }
}

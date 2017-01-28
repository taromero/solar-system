function Planet (params) {
  Object.assign(this, params)
}

Planet.prototype.moveToDay = function (numberOfDays) {
  var relativeDegrees = this.angularVelocity * numberOfDays % 360
  var absoluteDegrees = relativeDegrees >= 0 ? relativeDegrees : (relativeDegrees + 360)
  this.degrees = absoluteDegrees
  return this
}

Planet.prototype.calculateCoordinates = function () {
  this.x = Math.cos(degreesToRadians(this.degrees)).toFixed(10) * this.distanceFromCenter
  this.y = Math.sin(degreesToRadians(this.degrees)).toFixed(10) * this.distanceFromCenter
}

function degreesToRadians (degrees) {
  return degrees * 0.0174533
}

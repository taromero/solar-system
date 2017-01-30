var Planet = require('./planet')

module.exports = {
  new: function (...args) {
    var instance = new Planet(...args)
    instance.calculateCoordinates()
    instance.x

    var proxy = {
      set: function (target, prop, value) {
        var originalValue
        target[prop] = value
        if (prop === 'degrees' || prop === 'distanceFromCenter') {
          // Prevent unnecesary recalculations
          if (originalValue !== value) {
            target.calculateCoordinates()
          }
        }
        return true
      }
    }
    return new Proxy(instance, proxy)
  },
  sample: function () {
    return [
      this.new({ name: 'ferengi', degrees: 0, distanceFromCenter: 50, angularVelocity: -1, orbitColor: 'green' }),
      this.new({ name: 'vulcano', degrees: 0, distanceFromCenter: 100, angularVelocity: 5, orbitColor: 'teal' }),
      this.new({ name: 'betasoide', degrees: 0, distanceFromCenter: 200, angularVelocity: -3, orbitColor: 'olive' })
    ]
  }
}

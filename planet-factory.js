var PlanetFactory = {
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
  }
}

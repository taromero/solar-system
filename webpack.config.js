module.exports = {
  entry: [
    './lib/geometry-utils',
    './models/planet',
    './models/planet-factory',
    './lib/climate-forecaster',
    './client/solar-system'
  ],
  output: {
    filename: 'client/bundle.js'
  }
}

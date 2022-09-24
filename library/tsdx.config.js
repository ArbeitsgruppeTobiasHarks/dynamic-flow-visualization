module.exports = {
  rollup(config) {
    if (config.output.format === 'umd') {
      config.output.globals = {
        ...config.output.globals,
        'lodash-es': '_'
      }
    }
    return config
  }
}

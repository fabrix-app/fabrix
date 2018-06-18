'use strict'

const Spool = require('../../../../../dist/common/index').Spool

module.exports = class TestSpool extends Spool {
  constructor (app) {
    super(app, {
      config: require('./config/index'),
      pkg: require('./package')
    })
  }
}

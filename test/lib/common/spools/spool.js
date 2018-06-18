const Spool = require('../../../../dist/common').Spool

module.exports = class TestSpool extends Spool {
  constructor (app) {
    super(app, {
      pkg: {
        name: 'spool-testspool'
      }
    })
  }
}

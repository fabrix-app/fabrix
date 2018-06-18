const Spool = require('../../dist/common/spool').Spool

module.exports = class Testspool extends Spool {
  constructor (app) {
    super(app, {
      pkg: {
        name: 'testspool'
      }
    })
  }
}

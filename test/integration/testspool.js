const Spool = require('../../dist/common').Spool
const Generic = require('../../dist/common').FabrixGeneric

module.exports = class Testspool extends Spool {
  constructor (app) {
    super(app, {
      pkg: {
        name: 'spool-test'
      },
      config: {
        test: {
          val: 0,
          otherval: 1
        }
      },
      api: {
        events: {
          Test: Generic
        }
      }
    })
  }
}

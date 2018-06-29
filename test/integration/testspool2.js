const Spool = require('../../dist/common').Spool
const Generic = require('../../dist/common').FabrixGeneric

module.exports = class Testspool2 extends Spool {
  constructor (app) {
    super(app, {
      pkg: {
        name: 'spool-test2'
      },
      config: {
        test: {
          val: 0,
          otherval: 1
        }
      },
      api: {
        customKey: {
          Test: Generic
        }
      }
    })
  }
}

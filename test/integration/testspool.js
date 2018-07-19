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
          array: [3, 4, 5],
          otherval: 1,
          prefix: null
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

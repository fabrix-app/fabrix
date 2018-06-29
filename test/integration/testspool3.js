const Spool = require('../../dist/common').Spool
const Controller = require('../../dist/common').FabrixController

module.exports = class Testspool3 extends Spool {
  constructor (app) {
    super(app, {
      pkg: {
        name: 'spool-test3'
      },
      config: {
        test: {
          val: 0,
          otherval: 1
        }
      },
      api: {
        controllers: {
          TestController: class TestController extends Controller {
            foo() {
              return 'baz'
            }
          },
          Test2Controller: class Test2Controller extends Controller {
            foo() {
              return 'bar'
            }
          }
        }
      }
    })
  }
}

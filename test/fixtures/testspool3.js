const Spool = require('../../dist/common/index').Spool
const Controller = require('../../dist/common/index').FabrixController

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
            kaz() {
              return 'ba'
            }
          },
          Test2Controller: class Test2Controller extends Controller {
            foo() {
              return 'baz'
            }
            kaz() {
              return 'ba'
            }
          },
          Test3Controller: class Test3Controller extends Controller {
            foo() {
              return 'baz'
            }
            kaz() {
              return 'ba'
            }
          }
        }
      }
    })
  }
}

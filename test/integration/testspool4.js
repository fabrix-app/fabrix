const Spool = require('../../dist/common').Spool
const Controller = require('../../dist/common').FabrixController

module.exports = class Testspool4 extends Spool {
  constructor (app) {
    super(app, {
      pkg: {
        name: 'spool-test4'
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
              return 'barf'
            }
          },
          Test2Controller: class Test2Controller extends Controller {
            foo() {
              return 'barf'
            }
            kaz() {
              return 'baf'
            }
          },
          Test4Controller: class Test4Controller extends Controller {
            foo() {
              return 'barf'
            }
            kaz() {
              return 'baf'
            }
          }
        }
      }
    })
  }
}

const Spool = require('../../dist/common/index').Spool
const Controller = require('../../dist/common/index').FabrixController
const Service = require('../../dist/common/index').FabrixService
const Generic = require('../../dist/common/index').FabrixGeneric

module.exports = class Testspool5 extends Spool {
  constructor (app) {
    super(app, {
      pkg: {
        name: 'spool-test5'
      },
      config: {
        test: {
          val: 0,
          otherval: 1
        }
      },
      api: {
        tests: {
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
          Test5Service: class Test5Service extends Service {
            foo() {
              return 'barf'
            }
            kaz() {
              return 'baf'
            }
          },
          Test6Service: class Test5Service extends Service {
            foo() {
              return 'barf'
            }
            kaz() {
              return 'baf'
            }
          }
        },
        templates: {
          TestService: class TestService extends Service {
            foo() {
              return 'barf'
            }
          },
          Test2Service: class TestService extends Service {
            foo() {
              return 'barf'
            }
          },
          Test5Controller: class Test5Controller extends Controller {
            foo() {
              return 'barf'
            }
            kaz() {
              return 'baf'
            }
          },
          Test6Controller: class Test2Controller extends Controller {
            foo() {
              return 'barf'
            }
            kaz() {
              return 'baf'
            }
          },
        }
      }
    })
  }
}

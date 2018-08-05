const fs = require('fs')
const path = require('path')
const assert = require('assert')
const FabrixApp = require('../../dist').FabrixApp
const Spool = require('../../dist/common').Spool
const Controller = require('../../dist/common').FabrixController
const Testspool = require('./testspool')
const Testspool2 = require('./testspool2')
const Testspool3 = require('./testspool3')
const Testspool4 = require('./testspool4')
const testAppDefinition = require('./testapp')
const lib = require('../../dist/index')

describe('Fabrix', () => {
  describe('@FabrixApp', () => {
    describe('no side effects', () => {
      it('should be able to start and stop many instances in a single node process', () => {
        const cycles = [ ]
        for (let i = 0; i < 10; ++i) {
          cycles.push(new FabrixApp(testAppDefinition).start())
        }

        return Promise.all(cycles)
          .then(apps => Promise.all(apps.map(app => app.stop())))
      })
    })
    describe('#constructor', () => {
      let app
      before(() => {
        app = new FabrixApp(testAppDefinition)
      })

      describe('typical usage', () => {
        it('should be instance of EventEmitter', () => {
          assert(app instanceof require('events').EventEmitter)
        })
        it('should set max number of event listeners', () => {
          assert.equal(app.getMaxListeners(), 128)
        })
        it('should set app properties', () => {
          assert(app.pkg)
          assert(app.config)
          assert(app.api)
        })
        it('should set NODE_ENV', () => {
          assert.equal(process.env.NODE_ENV, 'development')
        })
        it('should get versions', () => {
          assert(app.versions)
        })
      })

      describe('configuration', () => {
        it('should validate an api object with arbitrary keys', () => {
          assert(global.app.api.customkey)
        })
        it('should create missing directories for configured paths', () => {
          assert(fs.statSync(path.resolve(__dirname, 'testdir')))
        })
        it('should set paths.temp if not configured explicitly by user', () => {
          assert(global.app.config.get('main.paths.temp'))
        })
        it('should set paths.logs if not configured explicitly by user', () => {
          assert(global.app.config.get('main.paths.logs'))
        })
        it('should set paths.sockets if not configured explicitly by user', () => {
          assert(global.app.config.get('main.paths.sockets'))
        })
        it('should set resources if not configured explicitly by user', () => {
          assert(global.app.config.get('main.resources'))
        })
      })

      describe('errors', () => {
        it('should require "app" argument to constructor', () => {
          assert.throws(() => new FabrixApp(), RangeError)
        })
        describe('@ApiNotDefinedError', () => {
          it('should throw ApiNotDefinedError if no api definition is provided', () => {
            const def = {
              pkg: { },
              config: {
                main: {
                  paths: { root: __dirname }
                }
              }
            }
            assert.throws(() => new FabrixApp(def), lib.ApiNotDefinedError)
          })
        })
        describe('@PackageNotDefinedError', () => {
          it('should throw PackageNotDefinedError if no pkg definition is provided', () => {
            const def = {
              config: {
                main: {
                  paths: { root: __dirname }
                }
              }
            }
            assert.throws(() => new FabrixApp(def), lib.PackageNotDefinedError)
          })
        })
        describe('@SpoolError', () => {
          it('should throw PackageNotDefinedError if no pkg definition is provided', () => {
            const def = {
              api: { },
              pkg: { },
              config: {
                main: {
                  spools: [
                    class Failspool extends Spool {
                      constructor (app) {
                        super(app)
                      }
                    }
                  ]
                }
              }
            }
            assert.throws(() => new FabrixApp(def), lib.SpoolError)
          })
        })

        it('should cache and freeze process.env', () => {
          process.env.FOO = 'bar'
          const def = {
            api: { },
            config: {
              main: { }
            },
            pkg: { }
          }
          const app = new FabrixApp(def)

          assert.equal(process.env.FOO, 'bar')
          assert.equal(app.env.FOO, 'bar')
          app.env.FOO = 1
          assert.equal(app.env.FOO, 'bar')
        })

        it('should freeze config object after spools are loaded', () => {
          const def = {
            pkg: { },
            api: { },
            config: {
              main: {
                spools: [ Testspool ]
              },
              foo: 'bar'
            }
          }
          const app = new FabrixApp(def)
          assert.equal(app.config.get('foo'), 'bar')

          return app.start().then(() => {
            assert.equal(app.config.get('foo'), 'bar')
            assert.throws(() => app.config.set('foo', 1), Error)
            return app.stop()
          })
        })

        it('should be able to reassign a previously null value', () => {
          const def = {
            pkg: { },
            api: { },
            config: {
              main: {
                spools: [ Testspool ]
              },
              test: {
                prefix: '/api'
              }
            }
          }
          const app = new FabrixApp(def)
          assert.equal(app.config.get('test.prefix'), '/api')
        })

        it('should disallow re-assignment of config object', () => {
          const def = {
            pkg: { },
            api: { },
            config: {
              main: {
                spools: [ Testspool ]
              },
              foo: 'bar'
            }
          }
          const app = new FabrixApp(def)
          assert.equal(app.config.get('foo'), 'bar')
          app.config = { }
          assert.equal(app.config.get('foo'), 'bar')
        })

        it('should get default spool config object from app config', () => {
          const def = {
            pkg: { },
            api: { },
            config: {
              main: {
                spools: [
                  Testspool
                ]
              }
            }
          }
          const app = new FabrixApp(def)
          assert.equal(app.config.get('test.val'), 0)
          assert.equal(app.config.get('test.otherval'), 1)
        })

        it('should override default spool config object from app config', () => {
          const def = {
            pkg: { },
            api: { },
            config: {
              main: {
                spools: [ Testspool ]
              },
              test: {
                val: 1,
                array: [1, 2, 3]
              }
            }
          }
          const app = new FabrixApp(def)
          assert.equal(app.config.get('test.val'), 1)
          assert.deepEqual(app.config.get('test.array'), [1, 2, 3])
          assert.equal(app.config.get('test.otherval'), 1)
        })

        it('should not have root api overridden by api provided by spools with same namespace', () => {
          const def = {
            pkg: { },
            api: {
              controllers: {
                TestController: class TestController extends Controller {
                  foo() {
                    return 'bar'
                  }
                }
              }
            },
            config: {
              main: {
                spools: [
                  Testspool3
                ]
              }
            }
          }
          const app = new FabrixApp(def)
          assert.equal(app.controllers.TestController.foo(), 'bar')
        })

        it('(sanity) should be able to access spool api method if not overridden', () => {
          const def = {
            pkg: { },
            api: { },
            config: {
              main: {
                spools: [
                  Testspool3
                ]
              }
            }
          }
          const app = new FabrixApp(def)
          assert.equal(app.controllers.TestController.foo(), 'baz')
        })

        it('(sanity) should combine api resources in the same name space', () => {
          const def = {
            pkg: { },
            api: {
              controllers: {
                TestController: class TestController extends Controller {
                  foo() {
                    return 'bar'
                  }
                }
              }
            },
            config: {
              main: {
                spools: [
                  Testspool3
                ]
              }
            }
          }
          const app = new FabrixApp(def)
          assert.equal(app.controllers.TestController.foo(), 'bar')
          assert.equal(app.controllers.Test2Controller.foo(), 'baz')
        })

        it('(sanity) should combine api resources in the same name space from different spools in order', () => {
          const def = {
            pkg: { },
            api: { },
            config: {
              main: {
                spools: [
                  Testspool3,
                  Testspool4
                ]
              }
            }
          }
          const app = new FabrixApp(def)

          assert.equal(app.controllers.TestController.foo(), 'barf')
          assert.equal(app.controllers.Test2Controller.foo(), 'barf')
          assert.equal(app.controllers.Test3Controller.foo(), 'baz')
          assert.equal(app.controllers.Test4Controller.foo(), 'barf')

          assert.equal(app.controllers.TestController.kaz(), 'ba')
          assert.equal(app.controllers.Test2Controller.kaz(), 'baf')
          assert.equal(app.controllers.Test3Controller.kaz(), 'ba')
          assert.equal(app.controllers.Test4Controller.kaz(), 'baf')
        })

        it('(sanity) should combine root api resources in the same name space from different spools in order', () => {
          const def = {
            pkg: { },
            api: {
              controllers: {
                TestController: class TestController extends Controller {
                  foo() {
                    return 'bar'
                  }
                }
              }
            },
            config: {
              main: {
                spools: [
                  Testspool3,
                  Testspool4
                ]
              }
            }
          }
          const app = new FabrixApp(def)

          assert.equal(app.controllers.TestController.foo(), 'bar')
          assert.equal(app.controllers.Test2Controller.foo(), 'barf')
          assert.equal(app.controllers.Test3Controller.foo(), 'baz')
          assert.equal(app.controllers.Test4Controller.foo(), 'barf')

          assert.equal(app.controllers.TestController.kaz(), 'ba')
          assert.equal(app.controllers.Test2Controller.kaz(), 'baf')
          assert.equal(app.controllers.Test3Controller.kaz(), 'ba')
          assert.equal(app.controllers.Test4Controller.kaz(), 'baf')
        })

        it('(sanity) should ignore spool resource method becacuse it\'s defined in the app', () => {
          const def = {
            pkg: { },
            api: {
              controllers: {
                TestController: class TestController extends Controller {
                  foo() {
                    return 'bar'
                  }
                }
              }
            },
            config: {
              main: {
                spools: [
                  Testspool3,
                  Testspool4,
                ]
              }
            }
          }
          const app = new FabrixApp(def)
          assert.equal(app.controllers.TestController.foo(), 'bar')
        })

        it('should have default resources', () => {
          const def = {
            pkg: { },
            api: { },
            config: {
              main: {
              }
            }
          }
          const app = new FabrixApp(def)
          assert.deepEqual(app.config.get('main.resources'), [])

          assert(!app['controllers'])
          assert(!app['services'])
          assert(!app['models'])
          assert(!app['resolvers'])
          assert(!app['policies'])
        })

        it('should override default resources', () => {
          const def = {
            pkg: { },
            api: { },
            config: {
              main: {
               resources: ['controllers','events']
              }
            }
          }
          const app = new FabrixApp(def)
          assert.deepEqual(app.config.get('main.resources'), ['controllers', 'events'])
          assert(app['controllers'])
          assert(app['events'])
          assert(!app['models'])
          assert(!app['services'])
          assert(!app['resolvers'])
        })

        it('should lock resources', () => {
          const def = {
            pkg: { },
            api: { },
            config: {
              main: {
                resources: ['controllers','events'],
                lockResources: true,
                spools: [
                  Testspool,
                  Testspool2
                ]
              }
            }
          }
          const app = new FabrixApp(def)
          assert.deepEqual(app.config.get('main.resources'), ['controllers', 'events'])
          assert(app['controllers'])
          assert(app['events'])
          assert(!app['customKey'])
          assert(!app['models'])
          assert(!app['services'])
          assert(!app['policies'])
          assert(!app['resolvers'])
        })

        it('should have combined spool resources', () => {
          const def = {
            pkg: { },
            api: { },
            config: {
              main: {
                spools: [
                  Testspool,
                  Testspool2
                ]
              }
            }
          }
          const app = new FabrixApp(def)
          assert.deepEqual(app.config.get('main.resources'), [
            'events',
            'customKey'
          ])
          assert(!app['controllers'])
          assert(!app['policies'])
          assert(!app['models'])
          assert(!app['services'])
          assert(!app['resolvers'])
          assert(app['events'])
          assert(app['customKey'])
        })

        it('should throw error on incorrectly configured main.resources', () => {
          const def = {
            pkg: { },
            api: { },
            config: {
              main: {
                resources: {}
              }
            }
          }
          assert.throws(() => new FabrixApp(def), Error)
        })
      })
    })

    describe('#after', () => {
      let app
      before(() => {
        app = new FabrixApp(testAppDefinition)
      })

      it('should invoke listener when listening for a single event', () => {
        const eventPromise = app.after([ 'test1' ])
        app.emit('test1')
        return eventPromise
      })
      it('should accept a single event as an array or a string', () => {
        const eventPromise = app.after('test2')
        app.emit('test2')
        return eventPromise
      })
      it('should invoke listener when listening for multiple events', () => {
        const eventPromise = app.after([ 'test3', 'test4', 'test5' ])
        app.emit('test3')
        app.emit('test4')
        app.emit('test5')

        return eventPromise
      })
      it('should invoke listener when listening for multiple possible events', () => {
        const eventPromise = app.after([['test6', 'test7'], 'test8'])
        app.emit('test6')
        app.emit('test8')

        return eventPromise
      })
      it('should pass event parameters through to handler', () => {
        const eventPromise = app.after(['test9', 'test10'])
          .then(results => {
            assert.equal(results[0], 9)
            assert.equal(results[1], 10)
          })

        app.emit('test9', 9)
        app.emit('test10', 10)

        return eventPromise
      })
    })

    describe('#onceAny', () => {
      let app
      before(() => {
        app = new FabrixApp(testAppDefinition)
      })

      it('should pass event parameters through to handler', () => {
        const eventPromise = app.onceAny('test1')
          .then(result => {
            assert.equal(result[0], 1)
          })

        app.emit('test1', 1)

        return eventPromise
      })
    })

    describe('#sanity', () => {
      let app
      before(() => {
        app = new FabrixApp(testAppDefinition)
      })

      // https://github.com/fabrix-app/fabrix/issues/11
      it.skip('should log itself without failing', (done) => {
        app.log.info(app)
        console.log(app)
        done()
      })
    })
  })
})

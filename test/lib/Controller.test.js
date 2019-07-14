const assert = require('assert')
const Controller = require('../../dist/common').FabrixController
const Fabrix = require('../../dist').FabrixApp
const testApp = require('../integration/testapp')

describe('lib/Controller', () => {
  describe('sanity', () => {
    it('should exist', () => {
      assert(Controller)
      // Deprecated v1.6
      // assert(global.Controller)
    })
    it('can instantiate without error', () => {
      const app = new Fabrix(testApp)
      assert(new Controller(app))
    })
  })
  describe('#id', () => {
    it('should return "root" name of Controller', () => {
      const app = new Fabrix(testApp)
      const TestController = class TestController extends Controller { }

      assert.equal(new TestController(app).id, 'test')
    })
  })
  describe('#log', () => {
    it('is a convenience method that simply invokes app.log', done => {
      const app = new Fabrix(testApp)
      const TestController = class TestController extends Controller { }

      app.once('fabrix:log', (level, [ msg ]) => {
          assert.equal(level, 'info')
          assert.equal(msg, 'hello from controller')
          done()
      })

      new TestController(app).log('info', 'hello from controller')
    })
  })
  describe('#app', () => {
    it('is a convenience method that should show the app', () => {
      const app = new Fabrix(testApp)
      const TestController = class TestController extends Controller { }
      assert.deepEqual(new TestController(app).app, app)
    })
  })
  describe('#config', () => {
    it('is a convenience method that should show the app.config', () => {
      const app = new Fabrix(testApp)
      const TestController = class TestController extends Controller { }
      assert.deepEqual(new TestController(app).config, app.config)
    })
  })
  describe('#services', () => {
    it('is a convenience method that should show the app.services', () => {
      const app = new Fabrix(testApp)
      const TestController = class TestController extends Controller { }
      assert.deepEqual(new TestController(app).services, app.services)
    })
  })
  describe('errors', () => {
    it('should require "app" argument to constructor', () => {
      assert.throws(() => new Controller(), Error)
    })
  })
})


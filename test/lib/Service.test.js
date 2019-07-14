const assert = require('assert')
const Fabrix = require('../../dist').FabrixApp
const Service = require('../../dist/common').FabrixService
const testApp = require('../integration/testapp')

describe('lib/Service', () => {
  describe('sanity', () => {
    it('should exist', () => {
      assert(Service)
      // Deprecated v1.6
      // assert(global.Service)
    })
    it('can instantiate without error', () => {
      const app = new Fabrix(testApp)
      assert(new Service(app))
    })
  })
  describe('#id', () => {
    it('should return "root" name of Service', () => {
      const app = new Fabrix(testApp)
      const TestService = class TestService extends Service { }

      assert.equal(new TestService(app).id, 'test')
    })
  })
  describe('#log', () => {
    it('is a convenience method that simply invokes app.log', done => {
      const app = new Fabrix(testApp)
      const TestService = class TestService extends Service { }

      app.once('fabrix:log', (level, [ msg ]) => {
        assert.equal(level, 'info')
        assert.equal(msg, 'hello from service')
        done()
      })

      new TestService(app).log('info', 'hello from service')
    })
  })
  describe('#app', () => {
    it('is a convenience method that should show the app', () => {
      const app = new Fabrix(testApp)
      const TestService = class TestService extends Service { }
      assert.deepEqual(new TestService(app).app, app)
    })
  })
  describe('#config', () => {
    it('is a convenience method that should show the app.config', () => {
      const app = new Fabrix(testApp)
      const TestService = class TestService extends Service { }
      assert.deepEqual(new TestService(app).config, app.config)
    })
  })
  describe('#services', () => {
    it('is a convenience method that should show the app.services', () => {
      const app = new Fabrix(testApp)
      const TestService = class TestService extends Service { }
      assert.deepEqual(new TestService(app).services, app.services)
    })
  })
  describe('#models', () => {
    it('is a convenience method that should show the app.models', () => {
      const app = new Fabrix(testApp)
      const TestService = class TestService extends Service { }
      assert.deepEqual(new TestService(app).models, app.models)
    })
  })
  describe('errors', () => {
    it('should require "app" argument to constructor', () => {
      assert.throws(() => new Service(), Error)
    })
  })
})

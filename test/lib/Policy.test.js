const assert = require('assert')
const Policy = require('../../dist/common/Policy').FabrixPolicy
const Fabrix = require('../../dist').FabrixApp
const testApp = require('../integration/testapp')

describe('lib/Policy', () => {
  describe('sanity', () => {
    it('should exist', () => {
      assert(Policy)
      assert(global.Policy)
    })
    it('can instantiate without error', () => {
      const app = new Fabrix(testApp)
      assert(new Policy(app))
    })
  })
  describe('#id', () => {
    it('should return "root" name of Policy', () => {
      const app = new Fabrix(testApp)
      const TestPolicy = class TestPolicy extends Policy { }

      assert.equal(new TestPolicy(app).id, 'test')
    })
  })
  describe('#log', () => {
    it('is a convenience method that simply invokes app.log', done => {
      const app = new Fabrix(testApp)
      const TestPolicy = class TestPolicy extends Policy { }

      app.once('fabrix:log', (level, [ msg ]) => {
        assert.equal(level, 'info')
        assert.equal(msg, 'hello from policy')
        done()
      })

      new TestPolicy(app).log('info', 'hello from policy')
    })
  })
  describe('#app', () => {
    it('is a convenience method that should show the app', () => {
      const app = new Fabrix(testApp)
      const TestPolicy = class TestPolicy extends Policy { }
      assert.deepEqual(new TestPolicy(app).app, app)
    })
  })
  describe('#config', () => {
    it('is a convenience method that should show the app.config', () => {
      const app = new Fabrix(testApp)
      const TestPolicy = class TestPolicy extends Policy { }
      assert.deepEqual(new TestPolicy(app).config, app.config)
    })
  })
  describe('errors', () => {
    it('should require "app" argument to constructor', () => {
      assert.throws(() => new Policy(), Error)
    })
  })
})

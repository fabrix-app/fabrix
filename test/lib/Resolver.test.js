const assert = require('assert')
const Model = require('../../dist/common').FabrixModel
const Resolver = require('../../dist/common').FabrixResolver

const Fabrix = require('../../dist').FabrixApp
const testApp = require('../integration/testapp')

describe('lib/Resolver', () => {
  describe('sanity', () => {
    it('should exist', () => {
      assert(Resolver)
      assert(global.Resolver)
    })
    it('can instantiate without error', () => {
      const app = new Fabrix(testApp)
      assert(new Resolver(new Model(app)))
    })
  })
  describe('#schema getter', () => {
    const app = new Fabrix(testApp)
    const model = new Model(app)
    assert.deepEqual(new Resolver(model).schema, model.schema)
  })
  describe('#app getter', () => {
    const app = new Fabrix(testApp)
    const model = new Model(app)
    assert.deepEqual(new Resolver(model).app, model.app)
  })
  describe('errors', () => {
    it('should require "model" argument to constructor', () => {
      assert.throws(() => new Resolver(), RangeError)
    })
  })
})


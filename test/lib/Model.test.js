const assert = require('assert')
const Model = require('../../dist/common').FabrixModel
const Resolver = require('../../dist/common').FabrixResolver
const Fabrix = require('../../dist').FabrixApp
const testApp = require('../integration/testapp')

describe('lib/Model', () => {
  describe('sanity', () => {
    it('should exist', () => {
      assert(Model)
      assert(global.Model)
    })
    it('can instantiate without error', () => {
      const app = new Fabrix(testApp)
      assert(new Model(app))
    })
  })

  it('#getModelName', () => {
    const app = new Fabrix(testApp)
    const TestModel = class TestModel extends Model { }
    assert.equal(new TestModel(app).name, 'testmodel')
  })
  describe('#getTableName', () => {
    it('default table name', () => {
      const app = new Fabrix(testApp)
      const TestModel = class TestModel extends Model { }
      assert.equal(new TestModel(app).tableName, 'testmodel')
    })
    it('configured table name', () => {
      const app = new Fabrix(testApp)
      const TestModel = class TestModel extends Model {
        static config () {
          return {
            tableName: 'customtable'
          }
        }
      }
      assert.equal(new TestModel(app).tableName, 'customtable')
    })
  })
  describe('#schema', () => {
    it('returns nothing by default', () => {
      assert.deepEqual(Model.schema(), {})
    })
    it('returns custom schema if set', () => {
      const TestModel = class TestModel extends Model {
        static schema () {
          return {
            columnA: 'string'
          }
        }
      }
      assert.equal(TestModel.schema().columnA, 'string')
    })
  })
  describe('#resolver', () => {
    // it('returns nothing by default', () => {
    //   assert.deepEqual(Model.resolver, Resolver)
    // })
    it('returns a Resolver if set', () => {
      const TestModel = class TestModel extends Model {
        static get resolver () {
          return Resolver
        }
      }
      assert.equal(TestModel.resolver, Resolver)
    })
  })
  describe('errors', () => {
    it('should require "app" argument to constructor', () => {
      assert.throws(() => new Model(), Error)
    })
  })
})

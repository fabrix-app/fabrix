const assert = require('assert')
const _ = require('lodash')
const lib = require('../../dist/index')

describe('lib.Core', () => {
  describe('#getClassMethods', () => {
    const A = class A {
      foo () { }
    }
    const B = class B extends A {
      bar () { }
    }
    const C = class B extends A {
      bar () { }
      baz () { }
      get getter () {
        return 'getter'
      }
      static staticThing () { }
    }
    it('should return class methods for object', () => {
      const methods = lib.Core.getClassMethods(new A(), A)

      assert.equal(methods.length, 1)
      assert.equal(methods[0], 'foo')
    })
    it('should return class methods for all objects in prototype chain', () => {
      const methods = lib.Core.getClassMethods(new B(), B)

      assert.equal(methods.length, 2)
      assert(_.includes(methods, 'foo'))
      assert(_.includes(methods, 'bar'))
    })
    it('should return only *instance methods* and no other type of thing', () => {
      const methods = lib.Core.getClassMethods(new C(), C)

      assert.equal(methods.length, 3)
      assert(_.includes(methods, 'bar'))
      assert(_.includes(methods, 'foo'))
      assert(_.includes(methods, 'baz'))
    })
  })

  describe('#assignGlobals', () => {
    it('should assign values to the global namespace', () => {
      lib.Core.assignGlobals()

      assert(global.Service)
      assert(global.Controller)
      assert(global.Model)
      assert(global.Policy)
      assert(Service)
    })
    it('global variables should be immutable and error if mutation is attempted', () => {
      delete global.Service
      assert(global.Service)
      assert(Service)
    })
    it('should ignore conflicts for identical values', () => {
      const s1 = Service
      lib.Core.assignGlobals()
      lib.Core.assignGlobals()
      lib.Core.assignGlobals()
      lib.Core.assignGlobals()

      assert(global.Service)
      assert(Service)
      assert.equal(s1, Service)
    })
  })
  describe('#handlePromiseRejection', () => {
    it('should throw an error and log it', () => {
      assert.throws(() => lib.Core.handlePromiseRejection(new Error('Promise Rejection Test')), Error)
    })
  })
})

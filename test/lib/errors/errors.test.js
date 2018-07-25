/* eslint new-cap: [0] */
const assert = require('assert')
const Spool = require('../../../dist/common/Spool').Spool
const lib = require('../../../dist/index')

describe('lib.Errors', () => {
  it('all Error types should be global', () => {
    assert(global.ConfigNotDefinedError)
    assert(global.ApiNotDefinedError)
    assert(global.ConfigValueError)
    assert(global.PackageNotDefinedError)
    assert(global.IllegalAccessError)
    assert(global.TimeoutError)
    assert(global.GraphCompletenessError)
    assert(global.NamespaceConflictError)
    assert(global.ValidationError)
    assert(global.SpoolError)
    assert(global.SanityError)
  })

  describe('ConfigNotDefinedError', () => {
    it('#name', () => {
      const err = new ConfigNotDefinedError()
      assert.equal(err.name, 'ConfigNotDefinedError')
    })
  })
  describe('ApiNotDefinedError', () => {
    it('#name', () => {
      const err = new ApiNotDefinedError()
      assert.equal(err.name, 'ApiNotDefinedError')
    })
  })
  describe('ConfigValueError', () => {
    it('#name', () => {
      const err = new ConfigValueError()
      assert.equal(err.name, 'ConfigValueError')
    })
  })
  describe('PackageNotDefinedError', () => {
    it('#name', () => {
      const err = new PackageNotDefinedError()
      assert.equal(err.name, 'PackageNotDefinedError')
    })
  })
  describe('IllegalAccessError', () => {
    it('#name', () => {
      const err = new IllegalAccessError()
      assert.equal(err.name, 'IllegalAccessError')
    })
  })
  describe('TimeoutError', () => {
    it('#name', () => {
      const err = new TimeoutError()
      assert.equal(err.name, 'TimeoutError')
    })
  })
  describe('GraphCompletenessError', () => {
    it('#name', () => {
      const err = new GraphCompletenessError()
      assert.equal(err.name, 'GraphCompletenessError')
    })
  })
  describe('NamespaceConflictError', () => {
    it('#name', () => {
      const err = new NamespaceConflictError()
      assert.equal(err.name, 'NamespaceConflictError')
    })
  })
  describe('ValidationError', () => {
    it('#name', () => {
      const err = new ValidationError()
      // err.constructor.humanizeMessage([])
      assert.equal(err.name, 'ValidationError')
    })
    describe('#message', () => {
      it('should specify missing/undefined spools', () => {
        const testConfig = {
          main: {
            spools: [
              undefined
            ]
          }
        }

        try {
          new lib.Configuration(testConfig)
        }
        catch (e) {
          assert(/The following configuration values are invalid/.test(e.message))
          assert(/main.spools\.0/.test(e.message))
        }
      })

    })
  })
  describe('SanityError', () => {
    it('#name', () => {
      const err = new SanityError()
      // err.constructor.humanizeMessage([])
      assert.equal(err.name, 'SanityError')
    })
    describe('#message', () => {
      it('should specify missing/undefined spools', () => {
        const testConfig = {
          main: {
            spools: [
              undefined
            ]
          }
        }

        try {
          new lib.Configuration(testConfig)
        }
        catch (e) {
          assert(/The following configuration values are invalid/.test(e.message))
          assert(/main.spools\.0/.test(e.message))
        }
      })
    })
  })
  describe('SpoolError', () => {
    it('#name', () => {
      const err = new SpoolError()
      assert.equal(err.name, 'SpoolError')
    })
    describe('#message', () => {
      it('should specify the failed spool and stage', () => {
        const Failspool = class Failspool extends Spool { }
        const err = new SpoolError(Failspool, new Error(), 'constructor')

        assert(/spool failed/.test(err.message))
        assert(/"constructor"/.test(err.message))
        assert(/Failspool spool/.test(err.message))
      })
    })
  })
})


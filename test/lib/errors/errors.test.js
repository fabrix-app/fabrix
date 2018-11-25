/* eslint new-cap: [0] */
const assert = require('assert')
const Spool = require('../../../dist/common/Spool').Spool
const lib = require('../../../dist/index')

const Errors = require('../../../dist/errors')

describe('lib.Errors', () => {
  it('all Error types should be global', () => {
    // Deprecated v1.6
    // assert(global.ConfigNotDefinedError)
    // assert(global.ApiNotDefinedError)
    // assert(global.ConfigValueError)
    // assert(global.PackageNotDefinedError)
    // assert(global.IllegalAccessError)
    // assert(global.TimeoutError)
    // assert(global.GraphCompletenessError)
    // assert(global.NamespaceConflictError)
    // assert(global.ValidationError)
    // assert(global.SpoolError)
    // assert(global.SanityError)
  })

  describe('ConfigNotDefinedError', () => {
    it('#name', () => {
      const err = new Errors.ConfigNotDefinedError()
      assert.equal(err.name, 'ConfigNotDefinedError')
    })
  })
  describe('ApiNotDefinedError', () => {
    it('#name', () => {
      const err = new Errors.ApiNotDefinedError()
      assert.equal(err.name, 'ApiNotDefinedError')
    })
  })
  describe('ConfigValueError', () => {
    it('#name', () => {
      const err = new Errors.ConfigValueError()
      assert.equal(err.name, 'ConfigValueError')
    })
  })
  describe('PackageNotDefinedError', () => {
    it('#name', () => {
      const err = new Errors.PackageNotDefinedError()
      assert.equal(err.name, 'PackageNotDefinedError')
    })
  })
  describe('IllegalAccessError', () => {
    it('#name', () => {
      const err = new Errors.IllegalAccessError()
      assert.equal(err.name, 'IllegalAccessError')
    })
  })
  describe('TimeoutError', () => {
    it('#name', () => {
      const err = new Errors.TimeoutError()
      assert.equal(err.name, 'TimeoutError')
    })
  })
  describe('GraphCompletenessError', () => {
    it('#name', () => {
      const err = new Errors.GraphCompletenessError()
      assert.equal(err.name, 'GraphCompletenessError')
    })
  })
  describe('NamespaceConflictError', () => {
    it('#name', () => {
      const err = new Errors.NamespaceConflictError()
      assert.equal(err.name, 'NamespaceConflictError')
    })
  })
  describe('ValidationError', () => {
    it('#name', () => {
      const err = new Errors.ValidationError()
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
      const err = new Errors.SanityError()
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
      const err = new Errors.SpoolError()
      assert.equal(err.name, 'SpoolError')
    })
    describe('#message', () => {
      it('should specify the failed spool and stage', () => {
        const Failspool = class Failspool extends Spool { }
        const err = new Errors.SpoolError(Failspool, new Error(), 'constructor')

        assert(/spool failed/.test(err.message))
        assert(/"constructor"/.test(err.message))
        assert(/Failspool spool/.test(err.message))
      })
    })
  })
})


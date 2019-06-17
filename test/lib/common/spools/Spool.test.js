const assert = require('assert')
const EventEmitter = require('events').EventEmitter
const smokesignals = require('smokesignals')
const Testspool = require('./spool')

const Fabrix = require('../../../../dist').FabrixApp
const testApp = require('../../../integration/testapp')

describe('spool', () => {
  let app
  beforeEach(() => {
    app = new Fabrix(testApp)
  })

  describe('#constructor', () => {
    it('should construct without error', () => {
      const spool= new Testspool(app)
      assert(spool)
    })
    it('should emit "constructed" event', done => {
      app.once('spool:testspool:constructed', spool=> done())
      new Testspool(app)
    })
  })

  describe('#name', () => {
    it('should return module name', () => {
      const spool= new Testspool(app)
      assert.equal(spool.name, 'testspool')
    })
  })

  describe('#log', () => {
    it('is a convenience method that simply invokes app.log', done => {
      const spool= new Testspool(app)

      app.once('fabrix:log', (level, [ msg ]) => {
        assert.equal(level, 'info')
        assert.equal(msg, 'hello from spool')
        done()
      })

      spool.log('info', 'hello from spool')
    })
  })

  describe('#log silent', () => {
    it('is a convenience method that simply invokes app.log', done => {
      const spool= new Testspool(app)

      app.once('fabrix:log:ignored', (level, [ msg ]) => {
        done()
      })

      spool.log('silly', 'hello ignored from spool')
    })
  })

  describe('#app', () => {
    it('is a convenience method that should show the app', () => {
      const app = new Fabrix(testApp)
      assert.deepEqual(new Testspool(app).app, app)
    })
  })
  describe('#config', () => {
    it('is a convenience method that should show the spool.config', () => {
      const app = new Fabrix(testApp)
      new Testspool(app).config
      // assert.deepEqual(new Testspool(app).config, app.config)
    })
  })

  describe('#api', () => {
    it('is a convenience method that should show the spool.api', () => {
      const app = new Fabrix(testApp)
      new Testspool(app).api
      // assert.deepEqual(new Testspool(app).config, app.config)
    })
  })

  describe('#pkg', () => {
    it('is a convenience method that should show the spool.pkg', () => {
      const app = new Fabrix(testApp)
      new Testspool(app).pkg
      // assert.deepEqual(new Testspool(app).config, app.config)
    })
  })
  describe('#defaultLifecycle', () => {
    it('is a static and not accessible', () => {
      const app = new Fabrix(testApp)
      assert(!new Testspool(app).defaultLifecycle)
    })
  })
  describe('#lifecycle', () => {
    it('is a convenience method that should show the spool.lifecycle', () => {
      const app = new Fabrix(testApp)
      const spool = new Testspool(app)
      assert.deepEqual(spool.lifecycle, Testspool.defaultLifecycle)
    })
  })
})


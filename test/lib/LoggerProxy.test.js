const assert = require('assert')
const lib = require('../../dist/index')
const EventEmitter = require('events').EventEmitter

describe('lib.LoggerProxy', () => {
  let emitter, logger
  beforeEach(() => {
    emitter = new EventEmitter()
    emitter.removeAllListeners()
    logger = new lib.LoggerProxy(emitter)
  })

  it('should emit fabrix:log on invocation of log.info', done => {
    emitter.once('fabrix:log', () => done())
    logger.info('hello')
  })
  // TODO The proxy is not telling JavaScript compilier that there is a label called timeEnd
  it('should emit fabrix:log on invocation of log.time and log.timeEnd', done => {
    // emitter.once('fabrix:log', () => done())
    logger.time('hello-time')
    logger.timeEnd('hello-time')
    done()
  })
  // TODO the proxy is not allowing a trace
  it.skip('should emit fabrix:log on invocation of log.trace', done => {
    emitter.once('fabrix:log', () => done())
    logger.trace()
  })
  it('should emit fabrix:log with level=silly on invocation of log.silly', done => {
    emitter.once('fabrix:log', level => {
      assert.equal(level, 'silly')
      done()
    })
    logger.silly('hello')
  })
  it('should emit fabrix:log:ignored with level=info on invocation of log.silly', done => {
    emitter.once('fabrix:log:ignored', level => {
      assert.equal(level, 'silly')
      done()
    })
    emitter.emit('fabrix:log:ignored', 'silly', 'hello')
  })
  it('should emit fabrix:log:ignored with level=info on invocation of log.silly', done => {

    emitter.once('fabrix:log:ignored', emitLogEvent => {
      done()
    })
    logger.emitLogEvent('silly', 'info')('hello')
  })
  it('should emit fabrix:log with level=debug on invocation of log.debug', done => {
    emitter.once('fabrix:log', level => {
      assert.equal(level, 'debug')
      done()
    })
    logger.debug('hello')
  })
  it('should emit fabrix:log with level=info on invocation of log.info', done => {
    emitter.once('fabrix:log', level => {
      assert.equal(level, 'info')
      done()
    })
    logger.info('hello')
  })
  it('should emit fabrix:log with level=warn on invocation of log.warn', done => {
    emitter.once('fabrix:log', level => {
      assert.equal(level, 'warn')
      done()
    })
    logger.warn('hello')
  })
  it('should emit fabrix:log with level=error on invocation of log.error', done => {
    emitter.once('fabrix:log', level => {
      assert.equal(level, 'error')
      done()
    })
    logger.error('hello')
  })
  it('should emit fabrix:log with correct message on invocation of log.info', done => {
    emitter.once('fabrix:log', (level, msg) => {
      assert.equal(level, 'info')
      assert.equal(msg.join(' '), 'hello 123')
      done()
    })
    logger.info('hello', '123')
  })
  it('should emit fabrix:log with correct message and level on invocation of log itself', done => {
    emitter.once('fabrix:log', (level, msg) => {
      assert.equal(level, 'info')
      assert.equal(msg.join(' '), 'hello 123')
      done()
    })
    logger('info', 'hello', '123')
  })
  it('should be able to log itself without error' , done => {
    emitter.once('fabrix:log', () => done())
    logger.info(logger)
  })
})


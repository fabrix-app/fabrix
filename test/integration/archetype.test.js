const proxyquire = require('proxyquire').noCallThru()
const assert = require('assert')
const Fabrix = require('../../dist').FabrixApp
// const archetype = require('../../archetype/index')

// describe('Archetype', () => {
//   describe('as module (index.js)', () => {
//     let app
//     beforeEach(() => app = new Fabrix(archetype))
//     afterEach(() => app.stop())
//
//     it('should fire right up', done => {
//       const logHandler = (level, [ msg ]) => {
//         if (/Fabrix Documentation/.test(msg)) {
//           app.removeListener('fabrix:log', logHandler)
//           done()
//         }
//       }
//       app.on('fabrix:log', logHandler)
//       app.start()
//     })
//   })
//
//   describe('as executable (server.js)', () => {
//     let app
//     before(() => {
//       const startPromise = proxyquire('../../archetype/server', { fabrix: Fabrix })
//       return startPromise.then(instance => app = instance)
//     })
//
//     it('should be running', done => {
//       const logHandler = (level, [ msg ]) => {
//         if (/running/.test(msg)) {
//           app.removeListener('fabrix:log', logHandler)
//           done()
//         }
//       }
//       app.on('fabrix:log', logHandler)
//       app.log.info('running')
//     })
//     it('should have default configs set', () => {
//       assert.equal(app.config.get('log.level'), 'info')
//     })
//   })
// })

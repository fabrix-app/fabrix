'use strict'

const assert = require('assert')
const FabrixApp = require('../../dist').FabrixApp

describe('#Cold To Hot', () => {
  // TODO Fabrix needs less than 1ms for Cold to Hot
  // TODO Fabrix needs less than 1ms for Hot to Cold
  it('should start in under 3ms (min config)', (done) => {

    const app = new FabrixApp({
      api: {},
      config: {},
      pkg: {
        name: 'cold-to-hot'
      }
    })

    const t0 = process.hrtime()

    app.start()
      .then(() => {
        const t1 = process.hrtime(t0)
        const t = t1[1] / 1e6
        assert(t < 3, `actual time: ${t} ms`)
        console.log('actual time:', t, ' ms')
        // done()
        return
      })
      .then(() => {
        return app.stop()
      })
      .then(() => {
        const t1 = process.hrtime(t0)
        const t = t1[1] / 1e6
        assert(t < 6, `actual time: ${t} ms`)
        console.log('actual time:', t, ' ms')

        done()
      })
      .catch(err => {
        done(err)
      })
  })
})

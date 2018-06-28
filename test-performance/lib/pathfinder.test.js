'use strict'

const assert = require('assert')
const lib = require('../../dist/index')
const Fabrix = require('../../dist').FabrixApp
const Spool = require('../../dist/common').Spool
const testApp = require('../testapp')


describe('lib.Pathfinder', () => {
  describe('Lifecycle', () => {
    const app = new Fabrix(testApp)
    const spools = [
      new Spool(app, {
        pkg: {
          name: 'pack0'
        },
        config: {
          lifecycle: {
            configure: {
              listen: [ ],
              emit: [ 'pack0:configured' ]
            },
            initialize: {
              listen: [ ],
              emit: [ 'pack0:initialized' ]
            }
          }
        }
      }),

      new Spool(app, {
        pkg: {
          name: 'pack1'
        },
        config: {
          lifecycle: {
            configure: {
              listen: [ 'pack0:configured' ],
              emit: [ 'pack1:configured' ]
            },
            initialize: {
              emit: [ 'pack1:initialized', 'pack1:custom' ]
            }
          }
        }
      }),

      new Spool(app, {
        pkg: {
           name: 'pack2'
        },
        config: {
          lifecycle: {
            configure: {
              listen: [ 'pack1:configured' ],
              emit: [ 'pack2:configured' ]
            },
            initialize: {
              listen: [ 'pack1:initialized', 'pack1:custom' ],
              emit: [ 'pack2:initialized' ]
            }
          }
        }
      }),

      new Spool(app, {
        pkg: {
           name: 'pack3'
        },
        config: {
          lifecycle: {
            configure: {
              listen: [ 'pack2:configured' ],
              emit: [ 'pack3:configured' ]
            },
            initialize: {
              listen: [ 'pack2:initialized', 'pack1:custom' ],
              emit: [ 'pack3:initialized' ]
            }
          }
        }
      }),

      new Spool(app, {
        pkg: {
          name: 'pack4'
        },
        config: {
          lifecycle: {
            // dependency with no route to source
            configure: {
              listen: [ 'packX:configured' ],
              emit: [ 'pack4:configured' ]
            },
            // dependency on spoolwith circular dependency
            initialize: {
              listen: [ 'pack5:initialized', 'pack0:initialized' ]
            }
          }
        }
      }),

      // circular dependency
      new Spool(app, {
        pkg: {
          name: 'pack5'
        },
        config: {
          lifecycle: {
            configure: {
              listen: [ 'pack5:configured' ],
              emit: [ 'pack5:configured' ]
            },
            initialize: {
              listen: [ 'pack4:initialized' ],
              emit: [ 'pack5:initialized' ]
            }
          }
        }
      })
    ]

    describe('#isComplete', () => {
      it('should execute in under 5ms (n=6, with errors)', () => {
        const t0 = process.hrtime()
        const path = [ spools[0], spools[1], spools[2], spools[3], spools[4], spools[5] ]

        const complete = lib.Pathfinder.isComplete(path)

        const t1 = process.hrtime(t0)
        const t = t1[1] / 1e6

        assert(t < 5, `actual time: ${t} ms`)
        console.log('actual time:', t, ' ms')
        assert(!complete)
      })
      it('should execute in under 2ms (n=4, no errors)', () => {
        const t0 = process.hrtime()
        const path = [ spools[0], spools[1], spools[2], spools[3] ]

        const complete = lib.Pathfinder.isComplete(path)

        const t1 = process.hrtime(t0)
        const t = t1[1] / 1e6

        assert(t < 2, `actual time: ${t} ms`)
        console.log('actual time:', t, ' ms')
        assert(complete)
      })
    })
  })
})


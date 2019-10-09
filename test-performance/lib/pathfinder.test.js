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
          name: 'spool0'
        },
        config: {
          lifecycle: {
            configure: {
              listen: [ ],
              emit: [ 'spool0:configured' ]
            },
            initialize: {
              listen: [ ],
              emit: [ 'spool0:initialized' ]
            }
          }
        }
      }),

      new Spool(app, {
        pkg: {
          name: 'spool1'
        },
        config: {
          lifecycle: {
            configure: {
              listen: [ 'spool0:configured' ],
              emit: [ 'spool1:configured' ]
            },
            initialize: {
              emit: [ 'spool1:initialized', 'spool1:custom' ]
            }
          }
        }
      }),

      new Spool(app, {
        pkg: {
           name: 'spool2'
        },
        config: {
          lifecycle: {
            configure: {
              listen: [ 'spool1:configured' ],
              emit: [ 'spool2:configured' ]
            },
            initialize: {
              listen: [ 'spool1:initialized', 'spool1:custom' ],
              emit: [ 'spool2:initialized' ]
            }
          }
        }
      }),

      new Spool(app, {
        pkg: {
           name: 'spool3'
        },
        config: {
          lifecycle: {
            configure: {
              listen: [ 'spool2:configured' ],
              emit: [ 'spool3:configured' ]
            },
            initialize: {
              listen: [ 'spool2:initialized', 'spool1:custom' ],
              emit: [ 'spool3:initialized' ]
            }
          }
        }
      }),

      new Spool(app, {
        pkg: {
          name: 'spool4'
        },
        config: {
          lifecycle: {
            // dependency with no route to source
            configure: {
              listen: [ 'spoolX:configured' ],
              emit: [ 'spool4:configured' ]
            },
            // dependency on spoolwith circular dependency
            initialize: {
              listen: [ 'spool5:initialized', 'spool0:initialized' ]
            }
          }
        }
      }),

      // circular dependency
      new Spool(app, {
        pkg: {
          name: 'spool5'
        },
        config: {
          lifecycle: {
            configure: {
              listen: [ 'spool5:configured' ],
              emit: [ 'spool5:configured' ]
            },
            initialize: {
              listen: [ 'spool4:initialized' ],
              emit: [ 'spool5:initialized' ]
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


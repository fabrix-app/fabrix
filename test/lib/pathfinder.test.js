const EventEmitter = require('events').EventEmitter
const assert = require('assert')
const lib = require('../../dist/index')
const Spool = require('../../dist/common/spool').Spool

describe('lib.Pathfinder', () => {
  describe('#getPathErrors', () => {
    it('errors list length should be 0 when no errors found (n=2, h=1)', () => {
      const errors = lib.Pathfinder.getPathErrors({
        packA: true,
        packB: false
      })
      assert.equal(errors.length, 0)
    })
    it('errors list length should be 0 when no errors found (n=4, h=3)', () => {
      const errors = lib.Pathfinder.getPathErrors({
        packA: true,
        packB: {
          packC: {
            packD: true
          }
        }
      })
      assert.equal(errors.length, 0)
    })
    it('errors list length should be 0 when no errors found (n=9, h=4)', () => {
      const errors = lib.Pathfinder.getPathErrors({
        packA: true,
        packB: {
          packC: {
            packD: true,
            packE: {
              packF: true
            },
            packG: true
          }
        },
        packH: {
          packI: true
        }
      })
      assert.equal(errors.length, 0)
    })
    it('errors list length should equal number of errors found (n=6, h=2)', () => {
      const errors = lib.Pathfinder.getPathErrors({
        packA: {
          packB: true
        },
        packC: true,
        packD: new Error(),
        packE: {
          packF: new Error()
        }
      })
      assert.equal(errors.length, 2)
    })
    it('errors list length should equal number of errors found (n=11, h=4)', () => {
      const errors = lib.Pathfinder.getPathErrors({
        packA: true,
        packB: {
          packC: {
            packD: true,
            packE: {
              packF: new Error(),
              packJ: {
                packK: true
              }
            },
            packG: true
          }
        },
        packH: {
          packI: true
        }
      })
      assert.equal(errors.length, 1)
    })
    it('errors list length should equal number of errors found (n=11, h=5)', () => {
      const errors = lib.Pathfinder.getPathErrors({
        packA: true,
        packB: {
          packC: {
            packD: true,
            packE: {
              packF: true,
              packJ: {
                packK: new Error()
              }
            },
            packG: true
          }
        },
        packH: {
          packI: true
        }
      })
      assert.equal(errors.length, 1)
    })
    it('errors list length should equal number of errors found (n=12, h=4)', () => {
      const errors = lib.Pathfinder.getPathErrors({
        packA: true,
        packB: {
          packC: {
            packD: true,
            packE: {
              packF: true,
              packJ: {
                packK: true
              }
            },
            packG: true
          }
        },
        packH: {
          packI: true
        },
        packL: new Error()
      })
      assert.equal(errors.length, 1)
    })
  })
  describe('#getEventProducer', () => {
    const app = new EventEmitter()
    const spools = [
      new Spool(app, {
        pkg: {
          name: 'pack1'
        },
        config: {
          lifecycle: {
            configure: {
              emit: [ 'pack1:configured', 'pack1:custom' ]
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
              emit: [ 'pack2:configured' ]
            },
            initialize: {
              emit: [ 'pack2:initialized' ]
            }
          }
        }
      })
    ]
    it('should return the spool that produces a particular event', () => {
      const producer = lib.Pathfinder.getEventProducer('pack1:configured', 'configure', spools, [ ])
      assert.equal(producer, spools[0])
    })
    it('should return the spool that produces a particular event', () => {
      const producer = lib.Pathfinder.getEventProducer('pack2:configured', 'configure', spools, [ ])
      assert.equal(producer, spools[1])
    })
    it('should return Error if there is no spool that produces the given event', () => {
      const producer = lib.Pathfinder.getEventProducer('nopack', 'configure', spools, [ { name: 'test' } ])
      assert(producer instanceof Error)
    })
  })

  describe('Lifecycle', () => {
    const app = new EventEmitter()
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

    describe('#getLifecyclePath', () => {

      it('should return true if spoolimmediately depends on source (distance=0, base case)', () => {
        const path = lib.Pathfinder.getLifecyclePath (spools[0], 'configure', spools)
        assert.equal(path, true)
      })

      it('should return complete path for valid spool(distance=2, single tree path)', () => {
        const path = lib.Pathfinder.getLifecyclePath (spools[2], 'configure', spools)
        assert(path)
        assert(path.pack1)
        assert.equal(path.pack1.pack0, true)
      })

      it('should return complete path for valid spool(distance=1, complex tree path)', () => {
        const path = lib.Pathfinder.getLifecyclePath (spools[2], 'initialize', spools)
        assert(path)
        assert.equal(path.pack1, true)
      })

      it('should return complete path for valid spool(distance=1, complex tree path)', () => {
        const path = lib.Pathfinder.getLifecyclePath (spools[2], 'initialize', spools)
        assert(path)
        assert.equal(path.pack1, true)
      })

      it('should return complete path for valid spool(distance=2, complex tree path)', () => {
        const path = lib.Pathfinder.getLifecyclePath (spools[3], 'initialize', spools)
        assert(path)
        assert.equal(path.pack2.pack1, true)
        assert.equal(path.pack1, true)
      })

      it('should return path Error leaves for spoolwith no source route', () => {
        const path = lib.Pathfinder.getLifecyclePath (spools[4], 'configure', spools)
        assert(path instanceof Error)
      })

      it('should return path with false leaf for spoolwith circular dependency (within self)', () => {
        const path = lib.Pathfinder.getLifecyclePath (spools[5], 'configure', spools)
        assert(path instanceof Error)
      })

      it('should return path with false leaf for spoolwith circular dependency (b/w dependency and self)', () => {
        const path = lib.Pathfinder.getLifecyclePath (spools[4], 'initialize', spools)
        assert.equal(path.pack0, true)
        assert(path.pack5 instanceof Error)
      })
    })

    describe('#isLifecycleStageValid', () => {
      it('should return true for a valid spool path (pack=sink)', () => {
        const valid = lib.Pathfinder.isLifecycleStageValid(spools[0], 'configure', spools)
        assert(valid)
      })
      it('should return true for a valid spool path (distance>1)', () => {
        const valid = lib.Pathfinder.isLifecycleStageValid(spools[2], 'configure', spools)
        assert(valid)
      })
      it('should return false for a invalid spool path (distance>1)', () => {
        const valid = lib.Pathfinder.isLifecycleStageValid(spools[5], 'configure', spools)
        assert(!valid)
      })
      it('should return false for a invalid spool path (cycle)', () => {
        const valid = lib.Pathfinder.isLifecycleStageValid(spools[4], 'configure', spools)
        assert(!valid)
      })
    })

    describe('#isLifecycleValid', () => {
      it('should return true for a valid spool path (distance=1)', () => {
        const valid = lib.Pathfinder.isLifecycleValid(spools[0], spools)
        assert(valid)
      })
      it('should return true for a valid spool path (distance=2)', () => {
        const valid = lib.Pathfinder.isLifecycleValid(spools[2], spools)
        assert(valid)
      })
      it('should return true for a valid spool path (distance=2)', () => {
        const valid = lib.Pathfinder.isLifecycleValid(spools[4], spools)
        assert(!valid)
      })
    })

    describe('#isComplete', () => {
      it('should return true for a complete spool graph (n=1)', () => {
        const path = [ spools[0] ]
        const valid = lib.Pathfinder.isComplete(path)
        assert(valid)
      })
      it('should return true for a complete spool graph (n=4)', () => {
        const path = [ spools[0], spools[1], spools[2], spools[3] ]
        const valid = lib.Pathfinder.isComplete(path)
        assert(valid)
      })
      it('should return false for an incomplete spool graph (n=6)', () => {
        const path = [ spools[0], spools[1], spools[2], spools[3], spools[4], spools[5] ]
        const valid = lib.Pathfinder.isComplete(path)
        assert(!valid)
      })
    })
  })
})


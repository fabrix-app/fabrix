const EventEmitter = require('events').EventEmitter
const assert = require('assert')
const lib = require('../../dist/index')
const Spool = require('../../dist/common').Spool

describe('lib.Pathfinder', () => {
  describe('#getPathErrors', () => {
    it('errors list length should be 0 when no errors found (n=2, h=1)', () => {
      const errors = lib.Pathfinder.getPathErrors({
        spoolA: true,
        spoolB: false
      })
      assert.equal(errors.length, 0)
    })
    it('errors list length should be 0 when no errors found (n=4, h=3)', () => {
      const errors = lib.Pathfinder.getPathErrors({
        spoolA: true,
        spoolB: {
          spoolC: {
            spoolD: true
          }
        }
      })
      assert.equal(errors.length, 0)
    })
    it('errors list length should be 0 when no errors found (n=9, h=4)', () => {
      const errors = lib.Pathfinder.getPathErrors({
        spoolA: true,
        spoolB: {
          spoolC: {
            spoolD: true,
            spoolE: {
              spoolF: true
            },
            spoolG: true
          }
        },
        spoolH: {
          spoolI: true
        }
      })
      assert.equal(errors.length, 0)
    })
    it('errors list length should equal number of errors found (n=6, h=2)', () => {
      const errors = lib.Pathfinder.getPathErrors({
        spoolA: {
          spoolB: true
        },
        spoolC: true,
        spoolD: new Error(),
        spoolE: {
          spoolF: new Error()
        }
      })
      assert.equal(errors.length, 2)
    })
    it('errors list length should equal number of errors found (n=11, h=4)', () => {
      const errors = lib.Pathfinder.getPathErrors({
        spoolA: true,
        spoolB: {
          spoolC: {
            spoolD: true,
            spoolE: {
              spoolF: new Error(),
              spoolJ: {
                spoolK: true
              }
            },
            spoolG: true
          }
        },
        spoolH: {
          spoolI: true
        }
      })
      assert.equal(errors.length, 1)
    })
    it('errors list length should equal number of errors found (n=11, h=5)', () => {
      const errors = lib.Pathfinder.getPathErrors({
        spoolA: true,
        spoolB: {
          spoolC: {
            spoolD: true,
            spoolE: {
              spoolF: true,
              spoolJ: {
                spoolK: new Error()
              }
            },
            spoolG: true
          }
        },
        spoolH: {
          spoolI: true
        }
      })
      assert.equal(errors.length, 1)
    })
    it('errors list length should equal number of errors found (n=12, h=4)', () => {
      const errors = lib.Pathfinder.getPathErrors({
        spoolA: true,
        spoolB: {
          spoolC: {
            spoolD: true,
            spoolE: {
              spoolF: true,
              spoolJ: {
                spoolK: true
              }
            },
            spoolG: true
          }
        },
        spoolH: {
          spoolI: true
        },
        spoolL: new Error()
      })
      assert.equal(errors.length, 1)
    })
  })
  describe('#getEventProducer', () => {
    const app = new EventEmitter()
    const spools = [
      new Spool(app, {
        pkg: {
          name: 'spool1'
        },
        config: {
          lifecycle: {
            configure: {
              emit: [ 'spool1:configured', 'spool1:custom' ]
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
              emit: [ 'spool2:configured' ]
            },
            initialize: {
              emit: [ 'spool2:initialized' ]
            }
          }
        }
      })
    ]
    it('should return the spool that produces a particular event', () => {
      const producer = lib.Pathfinder.getEventProducer('spool1:configured', 'configure', spools, [ ])
      assert.equal(producer, spools[0])
    })
    it('should return the spool that produces a particular event', () => {
      const producer = lib.Pathfinder.getEventProducer('spool2:configured', 'configure', spools, [ ])
      assert.equal(producer, spools[1])
    })
    it('should return Error if there is no spool that produces the given event', () => {
      const producer = lib.Pathfinder.getEventProducer('nospool', 'configure', spools, [ { name: 'test' } ])
      assert(producer instanceof Error)
    })
  })

  describe('Lifecycle', () => {
    const app = new EventEmitter()
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

    describe('#getLifecyclePath', () => {

      it('should return true if spoolimmediately depends on source (distance=0, base case)', () => {
        const path = lib.Pathfinder.getLifecyclePath (spools[0], 'configure', spools)
        assert.equal(path, true)
      })

      it('should return complete path for valid spool(distance=2, single tree path)', () => {
        const path = lib.Pathfinder.getLifecyclePath (spools[2], 'configure', spools)
        assert(path)
        assert(path.spool1)
        assert.equal(path.spool1.spool0, true)
      })

      it('should return complete path for valid spool(distance=1, complex tree path)', () => {
        const path = lib.Pathfinder.getLifecyclePath (spools[2], 'initialize', spools)
        assert(path)
        assert.equal(path.spool1, true)
      })

      it('should return complete path for valid spool(distance=1, complex tree path)', () => {
        const path = lib.Pathfinder.getLifecyclePath (spools[2], 'initialize', spools)
        assert(path)
        assert.equal(path.spool1, true)
      })

      it('should return complete path for valid spool(distance=2, complex tree path)', () => {
        const path = lib.Pathfinder.getLifecyclePath (spools[3], 'initialize', spools)
        assert(path)
        assert.equal(path.spool2.spool1, true)
        assert.equal(path.spool1, true)
      })

      it('should return path Error leaves for spool with no source route', () => {
        const path = lib.Pathfinder.getLifecyclePath (spools[4], 'configure', spools)
        assert(path instanceof Error)
      })

      it('should return path with false leaf for spool with circular dependency (within self)', () => {
        const path = lib.Pathfinder.getLifecyclePath (spools[5], 'configure', spools)
        assert(path instanceof Error)
      })

      it('should return path with false leaf for spool with circular dependency (b/w dependency and self)', () => {
        const path = lib.Pathfinder.getLifecyclePath (spools[4], 'initialize', spools)
        assert.equal(path.spool0, true)
        assert(path.spool5 instanceof Error)
      })
    })

    describe('#isLifecycleStageValid', () => {
      it('should return true for a valid spool path (spool=sink)', () => {
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


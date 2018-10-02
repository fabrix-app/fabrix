const assert = require('assert')

const Fabrix = require('../../../../dist').FabrixApp
const DatastoreSpool = require('./datastorespool')

describe('# Datastore spool', () => {
  let app
  beforeEach(() => {
    app = new Fabrix({
      api: {},
      config: {
        main: {
          spools: [
            DatastoreSpool
          ]
        }
      },
      pkg: {}
    })
  })

  describe('#name', () => {
    it('should return module name', () => {
      const spool= new DatastoreSpool(app)
      assert.equal(spool.name, 'datastorespool')
    })
  })
})

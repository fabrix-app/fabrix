const assert = require('assert')

const Fabrix = require('../../../../dist').FabrixApp
const ServerSpool = require('./serverspool')

describe('# Server spool', () => {
  let app
  beforeEach(() => {
    app = new Fabrix({
      api: {},
      config: {
        main: {
          spools: [
            ServerSpool
          ]
        }
      },
      pkg: {}
    })
  })

  describe('#name', () => {
    it('should return module name', () => {
      const spool= new ServerSpool(app)
      assert.equal(spool.name, 'serverspool')
    })
  })
})

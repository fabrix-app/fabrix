const Spool = require('../../../../dist/common/spools/server').ServerSpool

module.exports = class ServerSpool extends Spool {
  constructor (app) {
    super(app, {
      pkg: {
        name: 'spool-serverspool'
      }
    })
  }
}

const Spool = require('../../../../dist/common/spools/datastore').DatastoreSpool

module.exports = class DatastoreSpool extends Spool {
  constructor (app) {
    super(app, {
      pkg: {
        name: 'spool-datastorespool'
      }
    })
  }
}

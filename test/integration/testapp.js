const smokesignals = require('smokesignals')
const Testspool = require('./testspool')

module.exports = {
  api: {

  },
  config: {
    main: {
      paths: {
        root: __dirname
      },
      spools: [
        Testspool
      ]
    },
    log: {
      logger: new smokesignals.Logger('silent')
    }
  },
  pkg: {

  }
}

const FabrixApp = require('../dist').FabrixApp

before(() => {
  global.app = new FabrixApp(require('./fixtures/app'))
  return global.app.start()
})

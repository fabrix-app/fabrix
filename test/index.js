const FabrixApp = require('../dist').FabrixApp

before(() => {
  global.app = new FabrixApp(require('./integration/app'))
  return global.app.start()
})

const FabrixApp = require('@fabrix/fabrix').FabrixApp

before(() => {
  global.app = new FabrixApp(require('../dist'))
  return global.app.start()
})

after(() => {
  return global.app.stop()
})

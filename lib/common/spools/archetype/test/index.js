const FabrixApp = require('fabrix').FabrixApp

before(() => {
  global.app = new FabrixApp(require('./app'))
  return global.app.start()
})

after(() => {
  return global.app.stop()
})

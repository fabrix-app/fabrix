const FabrixApp = require('fabrix')

before(() => {
  global.app = new FabrixApp(require('../'))
  return global.app.start()
})

after(() => {
  return global.app.stop()
})

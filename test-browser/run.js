import './integration/browser.test.js'

mocha.checkLeaks()
mocha.globals(['app'])
mocha.run()
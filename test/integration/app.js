const path = require('path')
const _ = require('lodash')
const smokesignals = require('smokesignals')
const Testspool = require('./testspool')

const AppConfigLocales = {
  en: {
    helloworld: 'hello world',
    hello: {
      user: 'hello {{username}}'
    }
  },
  de: {
    helloworld: 'hallo Welt',
    hello: {
      user: 'hallo {{username}}'
    }
  }
}

const App = {
  pkg: {
    name: 'core-spool-test'
  },
  api: {
    customkey: {}
  },
  config: {
    main: {
      spools: [
        Testspool
      ],
      paths: {
        testdir: path.resolve(__dirname, 'testdir')
      }
    },
    log: {
      level: 'silly'
    },
    i18n: {
      lng: 'en',
      resources: {
        en: {
          translation: AppConfigLocales.en
        },
        de: {
          translation: AppConfigLocales.de
        }
      }
    }
  },
  locales: AppConfigLocales
}

_.defaultsDeep(App, smokesignals.FailsafeConfig)
module.exports = App

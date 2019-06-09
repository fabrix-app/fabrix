export const AppConfigLocales = {
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

export const testApp = {
  pkg: {
    name: 'browser-spool-test'
  },
  api: {
    customkey: {}
  },
  config: {
    main: {
      spools: [],
      paths: {},
      target: 'browser'
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

// _.defaultsDeep(App, smokesignals.FailsafeConfig)
// module.exports.testApp = App

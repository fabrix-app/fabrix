const App = {
  api: {},
  config: {
    env: {
      development: {
        myspool: {
          port: 8080,
          nested: {
            test3: 'test'
          },
          added: 'ok'
        }
      },
      testing: {
        myspool: {
          port: 8080,
          nested: {
            test3: 'test'
          },
          added: 'ok'
        }
      }
    },
    myspool: {
      port: 3000,
      nested: {
        test2: 'ok',
        nestedDeep: {
          test3: 'ko'
        }
      }
    },
    main: {
      spools: [
        require('./spool')
      ],
      paths: {
        root: __dirname
      }
    }
  },
  pkg: {}
}

module.exports = App

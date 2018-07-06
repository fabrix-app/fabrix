module.exports = {
  pkg: {
    name: require('../package').name + '-test'
  },
  api: {
    models: { },
    controllers: { },
    services: { }
  },
  config: {
    main: {
      spools: [
        require('../dist/').Archetype
      ]
    }
  }
}

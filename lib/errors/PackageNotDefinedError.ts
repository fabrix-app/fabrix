export class PackageNotDefinedError extends RangeError {
  constructor() {
    super(`
      A "pkg" must be given to the Fabrix constructor. Application cannot start.
      e.g.
      const app = new FabrixApp({
  -->   pkg: require('./package'),
        api: require('./api'),
        config: require('./config')
      })

      For more info, see the Fabrix archetypes:
        - https://git.io/vw845
        - https://git.io/vw84F
      `)
  }

  get name () {
    return 'PackageNotDefinedError'
  }
}


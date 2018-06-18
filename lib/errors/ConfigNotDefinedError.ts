export class ConfigNotDefinedError extends RangeError {
  constructor() {
    super(`
      "config" must be given to the Fabrix constructor, and it must contain
      an object called "main". Application cannot start.
      e.g.

      const app = new FabrixApp({
        pkg: require('./package'),
        api: require('./api'),
  -->   config: require('./config')
      })

      For more info, see the Fabrix archetypes:
        - https://git.io/vw845
        - https://git.io/vw84F
    `)
  }

  get name () {
    return 'ConfigNotDefinedError'
  }
}


export interface ApiNotDefinedError {

}

export class ApiNotDefinedError extends RangeError {
  constructor() {
    super(`
      "api" must be given to the Fabrix constructor, or to the start() method.
      Application cannot start.

      e.g.
      1) Send "api" to the constructor
         const app = new FabrixApp({
           pkg: require('./package'),
     -->   api: require('./api'),
           config: require('./config')
         })

      -- OR --

      2) Send "api" to the start() method:
         const app = new FabrixApp({
           pkg: require('./package'),
           config: require('./config')
         })
         app.start({ api: require('./api') })

      For more info, see the Fabrix archetypes:
        - https://git.io/vw845
        - https://git.io/vw84F
      `)
  }

  get name () {
    return 'ApiNotDefinedError'
  }
}

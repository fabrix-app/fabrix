import { Spool } from '../../'

export class Archetype extends Spool {

  static get lifecycle () {
    return { }
  }

  constructor (app) {
    super(app, {
      config: require('./config/index'),
      api: require('./api/index'),
      pkg: require('./package')
    })
  }

  /**
   * TODO document method
   */
  validate () {

  }

  /**
   * TODO document method
   */
  configure () {

  }

  /**
   * TODO document method
   */
  async initialize () {

  }

  /**
   * TODO document method
   */
  async unload () {

  }
}


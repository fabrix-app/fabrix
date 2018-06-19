import { Spool } from '../../../'

import * as config from './config/index'
import * as pkg from '../package.json'
import * as api from './api/index'

export class Archetype extends Spool {

  static get lifecycle () {
    return { }
  }

  constructor (app) {
    super(app, {
      config: config,
      api: api,
      pkg: pkg
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


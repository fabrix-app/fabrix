// tslint:disable no-unused-expression

import { FabrixApp } from '../index'
import { EventEmitter } from 'events'
import { FabrixGeneric } from './Generic'

/**
 * Fabrix Controller Class.
 */
export class FabrixController extends FabrixGeneric {
  public app: FabrixApp

  constructor (app: FabrixApp) {
    if (!(app instanceof EventEmitter)) {
      throw new Error('The "app" argument must be of type EventEmitter')
    }
    super(app)
    this.app.emit(`controller:${this.id}:constructed`, this)
  }

  get __ () {
    if (this.app.__) {
      return this.app.__
    }
    else {
      throw new Error('Missing spool-i18n, make sure it is included in app.main.spools')
    }
  }

  /**
   * Return the id of this controller
   */
  get id (): string {
    return this.constructor.name.replace(/(\w+)Controller/, '$1').toLowerCase()
  }

  /**
   * Return a reference to the Fabrix logger
   */
  get log (): FabrixApp['log'] {
    return this.app.log
  }

  /**
   * Return a reference to the Fabrix configuration map.
   */
  get config (): FabrixApp['config'] {
    return this.app.config
  }

  /**
   * Return a reference to the Fabrix resource services.
   */
  get services (): FabrixApp['services'] {
    return this.app.services
  }
}

// tslint:disable no-unused-expression

import { EventEmitter } from 'events'
import { defaultsDeep } from 'lodash'
import { writable, enumerable, configurable, IApi, IPkg, ISpoolConfig, ILifecycle } from './index'
import { FabrixApp } from '../index'

/**
 * @class Spool
 * @see {@link https://fabrix.app/doc/en/ref/spool}
 */
export class Spool {
  private _app: FabrixApp
  private _config: ISpoolConfig
  private _pkg: any // IPkg
  private _api: IApi

  /**
   * Return the type of this Spool. By default, this 'misc'.
   * This method can be overridden for spools by declaring a 'type' getter
   * in the extending spool class or by using a spool template such as:
   * webserver, datastore, etc.
   */
  static get type (): string {
    return 'misc'
  }

  /**
   * The Spool lifecycle. At each stage (configure, initialize) define
   * preconditions ("listen") and post-conditions ("emit") of the spool.
   */
  static get defaultLifecycle (): ILifecycle {
    return {
      configure: {
        listen: [ ],
        emit: [ ]
      },
      initialize: {
        listen: [ ],
        emit: [ ]
      }
    }
  }

  /**
   * @constructor
   * @param app FabrixApp instance
   * @param api The api entities defined in this spool (api/ folder)
   * @param config The spool configuration (config/ folder)
   * @param pkg The spool package.json
   *
   * Instantiate the Spool and set some initial properties. All Spools
   * should implement their own constructors, and call super(app, pack) with
   * their own spool definitions. Implementing application logic in the spool
   * constructor is not recommended.
   */
  constructor (
    app: FabrixApp,
    {
      pkg = null,
      config = { },
      api = { }
    }: { pkg: any, config: ISpoolConfig, api: IApi }
  ) {
    if (!(app instanceof EventEmitter)) {
      throw new Error('The "app" argument must be of type EventEmitter')
    }
    if (!pkg) {
      throw new Error('Spool is missing package definition ("spool.pkg")')
    }

    this._app = app
    this._api = api
    this._config = defaultsDeep({}, config, {lifecycle: Spool.defaultLifecycle})
    this._pkg = Object.freeze(pkg)
    this.app.emit(`spool:${this.name}:constructed`, this)
  }


  // @enumerable(false)
//  @configurable(true)
  get app (): FabrixApp {
    return this._app
  }

//  @writable(true)
  get api () {
    return this._api
  }

//  @enumerable(true)
  get config () {
    return this._config
  }

//  @enumerable(false)
//  @writable(false)
  get pkg () {
    return this._pkg
  }

  /**
   * Return a reference to the Fabrix logger
   */
  get log (): FabrixApp['log'] {
    return this.app.log
  }

  /**
   * Validate any necessary preconditions for this spool. We strongly
   * recommend that all Spools override this method and use it to check
   * preconditions.
   */
  validate (): any {

  }

  /**
   * Set any configuration required before the spools are initialized.
   * Spools that require configuration, or need to alter/extend the app's
   * configuration, should override this method.
   */
  configure (): any {

  }

  /**
   * Start any services or listeners necessary for this spool. Spools that
   * run daemon-like services should override this method.
   */
  async initialize (): Promise<any> {

  }

  /**
   * Unload this Spool. This method will instruct the spool to perform
   * any necessary cleanup with the expectation that the app will stop or reload
   * soon thereafter. If your spool runs a daemon or any other thing that may
   * occupy the event loop, implementing this method is important for Fabrix to
   * exit correctly.
   */
  async unload (): Promise<any> {

  }

  /**
   * Return the name of this Spool. By default, this is the name of the
   * npm module (in package.json). This method can be overridden for spools
   * which do not follow the "spool-" prefix naming convention.
   */
  get name (): string {
    return this.pkg.name.replace(/(^@fabrix\/)?spool\-|trailpack\-/, '')
  }

  /**
   * The final Spool lifecycle merged with the configured lifecycle
   */
  get lifecycle (): ILifecycle {
    return this._config.lifecycle
  }


}

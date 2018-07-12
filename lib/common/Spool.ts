// tslint:disable no-unused-expression

import { EventEmitter } from 'events'
import { defaultsDeep, omit } from 'lodash'
import { IApi, IPkg, ISpoolConfig, ILifecycle } from './index'
import { FabrixApp } from '../index'

/**
 * @class Spool
 * @see {@link https://fabrix.app/doc/en/ref/spool}
 */
export interface Spool {
  [key: string]: any
}
export class Spool {
  private _stage = 'pre'
  private _app: FabrixApp
  private _config: ISpoolConfig
  private _pkg: any // IPkg
  private _api: IApi
  private _lifecycle: ILifecycle
  private _spoolConfigKeys = ['lifecycle', 'spool', 'trailpack']

  /**
   * Return the action for the config file of this spool into the app.config
   * replaceable: allow config provided by spool to be completely overridden by app.config
   * hold: do not allow config provided by spool to be overridden by app.config
   * merge: attempt to deep merge config provided by spool with app.config
   * This method can be overridden for spools by declaring a 'configAction' getter
   * in the extending spool class.
   */
  static get configAction (): string {
    return 'merge'
  }

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
      },
      sanity: {
        listen: [ ],
        emit: [ ]
      }
    }
  }

  static configuredSpoolLifecycle (config) {
    const level1 = config.lifecycle || {}
    const level2 = config.spool && config.spool.lifecycle
      ? config.spool.lifecycle : config.trailpack && config.trailpack.lifecycle
        ? config.trailpack.lifecycle : {}
    const level3 = Spool.defaultLifecycle
    return defaultsDeep({}, level1, level2, level3)
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
    }: { pkg?: any, config?: ISpoolConfig, api?: IApi }
  ) {
    if (!(app instanceof EventEmitter)) {
      throw new Error('The "app" argument must be of type EventEmitter')
    }
    if (!pkg) {
      throw new Error('Spool is missing package definition ("spool.pkg")')
    }

    this._app = app
    this._pkg = Object.freeze(pkg)
    this._api = api

    /**
     * Config will pollute the app.config, "lifecycle" and "spool" are spool specific
     * configuration arguments and should be omitted from config
     */
    this._config = omit(config, this._spoolConfigKeys)
    this._lifecycle = Spool.configuredSpoolLifecycle(config)
    this.app.emit(`spool:${this.name}:constructed`, this)
  }

  set stage (val) {
    this._stage = val
  }

  /**
   * Returns the lifecylce stage that the spool is currently in
   */
  get stage () {
    return this._stage
  }

  get app (): FabrixApp {
    return this._app
  }

  get api () {
    return this._api
  }

  /**
   * Virtual Setter for `api`
   */
  set api (api) {
    this._api = api
  }

  get config () {
    return this._config
  }

  /**
   * Virtual Setter for `config`
   */
  set config (config) {
    this._config = config
  }

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
   * Check any configured or initialized state to prove that the Fabrix app in
   * fact does have the values specified by the lifecylce. Spools that require
   * runtime specifications should override this method
   */
  sanity (): any {

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
    return this.pkg.name
      ? this.pkg.name.replace(/(^@fabrix\/)?spool\-|trailpack\-/, '')
      : this.constructor.name.toLowerCase().replace(/Spool$/, '')
  }

  /**
   * The final Spool lifecycle merged with the configured lifecycle
   */
  get lifecycle (): ILifecycle {
    return this._lifecycle
  }


}

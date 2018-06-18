import { EventEmitter } from 'events'
import { Core } from './Core'
import { Configuration } from './Configuration'
import { LoggerProxy } from './LoggerProxy'
import { enumerable, writable, configurable, Spool, IApi, IPkg, IConfig, IEnv } from './common'
import * as Errors from './errors'
import * as pkg from '../package.json'

// inject Error and Resource types into the global namespace
Core.assignGlobals()

/**
 * The Fabrix Application. Merges the configuration and API resources
 * loads Spools, initializes logging and event listeners.
 */
export class FabrixApp extends EventEmitter {

  private _logger: LoggerProxy
  private _env: IEnv
  private _pkg: any // IPkg
  private _config: Configuration
  private _versions: {[key: string]: any }
  private _api: IApi
  private _fabrix: any
  private _spools: {[key: string]: Spool}

  public resources: string[] = ['controllers', 'policies', 'services', 'models', 'resolvers']
  public controllers: {[key: string]: any }
  public services: {[key: string]: any }
  public policies: {[key: string]: any }
  public models: {[key: string]: any }
  public resolvers: {[key: string]: any }
  public routes: any[]

  /**
   * @param app.pkg The application package.json
   * @param app.api The application api (api/ folder)
   * @param app.config The application configuration (config/ folder)
   *
   * Initialize the Fabrix Application and its EventEmitter parentclass. Set
   * some necessary default configuration.
   */
  constructor (app: {
    pkg: IPkg,
    api: IApi,
    config: IConfig
  }) {
    super()

    if (!app) {
      throw new RangeError('No app definition provided to Fabrix constructor')
    }
    if (!app.pkg) {
      throw new Errors.PackageNotDefinedError()
    }
    if (!app.api) {
      throw new Errors.ApiNotDefinedError()
    }

    // Set each api resource to make sure it's provided as an object in app
    this.resources.forEach(resource => {
      app.api[resource] = app.api[resource] || (app.api[resource] = { })
    })

    // set the process node env if not established by environment
    if (!process.env.NODE_ENV) {
      process.env.NODE_ENV = 'development'
    }

    const processEnv = Object.freeze(Object.assign({}, JSON.parse(JSON.stringify(process.env))))

    this._logger = new LoggerProxy(this)
    this._env = processEnv
    this._pkg = app.pkg
    this._versions = process.versions
    this._config = new Configuration(app.config, processEnv)
    this._spools = {}
    this._api = app.api
    this._fabrix = pkg

    // set the max listeners from the config
    this.setMaxListeners(this.config.get('main.maxListeners'))

    // instantiate spools TOTO type of Spool
    this.config.get('main.spools').forEach((NewSpool: any) => {
      try {
        const spool = new NewSpool(this)
        this.spools[spool.name] = spool
        this.config.merge(spool.config)
        Core.mergeApi(this, spool, this.resources)
        Core.bindSpoolMethodListeners(this, spool)
      }
      catch (e) {
        console.log(e.stack)
        throw new Errors.SpoolError(Spool, e, 'constructor')
      }
    })

    // instantiate resource classes and bind resource methods
    this.bindResourceMethods(this.resources)

    // TODO REMOVE: Establish an empty routes paradigm
    this.routes = []

    Core.bindApplicationListeners(this)
    Core.bindSpoolPhaseListeners(this, Object.values(this.spools))
  }

  /**
   * Instantiate resource classes and bind resource methods
   */
  bindResourceMethods(defaults: string[]): void {
    defaults.forEach(resource => {
      try {
        this[resource] = Core.bindMethods(this, resource)
      }
      catch (err) {
        this.log.error(err)
      }
    })
  }

  // @enumerable(false)
  // @writable(false)
  get logger () {
    return this._logger
  }

  // @enumerable(false)
  get env () {
    return this._env
  }

  // @enumerable(false)
  get pkg () {
    return this._pkg
  }

  // @enumerable(false)
  // @writable(false)
  // @configurable(false)
  get versions () {
    return this._versions
  }

  // @writable(false)
  // @configurable(true)
  get config () {
    return this._config
  }

  // @enumerable(false)
  get fabrix () {
    return this._fabrix
  }

  get spools () {
    return this._spools
  }

  get api () {
    return this._api
  }

  /**
   * Return the Fabrix logger
   * fires fabrix:log:* log events
   */
  get log () {
    return this.logger
  }


  /**
   * Start the App. Load all Spools.
   */
  async start (): Promise<any> {
    this.emit('fabrix:start')
    await this.after('fabrix:ready')
    return this
  }

  /**
   * Shutdown. Unbind listeners, unload spools.
   */
  async stop (): Promise<any> {
    this.emit('fabrix:stop')

    await Promise
      .all(Object.values(this.spools).map(spool => {
        this.log.debug('Unloading spool', spool.name, '...')
        return spool.unload()
      }))
      .then(() => {
        this.log.debug('All spools unloaded. Done.')
        this.removeAllListeners()
      })

    return this
  }

  /**
   * Resolve Promise once ANY of the events in the list have emitted.
   */
  async onceAny (events: any): Promise<any> {
    if (!Array.isArray(events)) {
      events = [events]
    }

    let resolveCallback: any

    return Promise
      .race(events.map((eventName: any) => {
        return new Promise(resolve => {
          resolveCallback = resolve
          this.once(eventName, resolveCallback)
        })
      }))
      .then((...args: any[]) => {
        events.forEach((eventName: any) => this.removeListener(eventName, resolveCallback))
        return args
      })
      .catch(err => {
        this.log.error(err, 'handling onceAny events', events)
        throw err
      })
  }

  /**
   * Resolve Promise once all events in the list have emitted. Also accepts
   * a callback.
   */
  async after (events: any): Promise<any> {
    if (!Array.isArray(events)) {
      events = [ events ]
    }

    return Promise
      .all(events.map((eventName: any) => {
        return new Promise(resolve => {
          if (eventName instanceof Array) {
            resolve(this.onceAny(eventName))
          }
          else {
            this.once(eventName, resolve)
          }
        })
      }))
      .catch(err => {
        this.log.error(err, 'handling after events', events)
        throw err
      })
  }
}

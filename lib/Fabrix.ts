import { EventEmitter } from 'events'
import { union } from 'lodash'
import { Core } from './Core'
import { Configuration } from './Configuration'
import { LoggerProxy } from './LoggerProxy'
import { Spool, IApi, IPkg, IConfig, IEnv } from './common'
import * as Errors from './errors'
import * as pkg from '../package.json'
import { FabrixGeneric } from './common/Generic'
import { ServerSpool } from './common/spools/server'
import { ExtensionSpool } from './common/spools/extension'
import { DatastoreSpool } from './common/spools/datastore'
import { SystemSpool } from './common/spools/system'
import { ToolSpool } from './common/spools/tool'
import { MiscSpool } from './common/spools/misc'
import { enumerable } from './common/decorators/enumerable'
import { IVersions } from './common/interfaces/IVersions'

// inject Error and Resource types into the global namespace
// Deprecate Globals v1.6
// Core.assignGlobals()

/**
 * The Fabrix Application. Merges the configuration and API resources
 * loads Spools, initializes logging and event listeners.
 */
export interface FabrixApp extends EventEmitter {
  [key: string]: any
}

export class FabrixApp extends EventEmitter {
  private _logger: LoggerProxy
  private _env: IEnv
  private _pkg: any // IPkg
  private _versions: IVersions
  private _config: Configuration
  private _api: IApi
  private _fabrix: FabrixApp
  private _spools: {[key: string]: Spool | ServerSpool | ExtensionSpool | DatastoreSpool | SystemSpool | ToolSpool | MiscSpool }
  private _resources: string[] = [ ]

  // Deprecate Globals v1.6
  // Fabrix can have any namespace of resource as long as it's unique
  // public controllers: {[key: string]: FabrixController }
  // public services: {[key: string]: FabrixService }
  // public policies: {[key: string]: FabrixPolicy }
  // public models: {[key: string]: FabrixModel }
  // public resolvers: {[key: string]: FabrixResolver }

  /**
   * @param app.pkg The application package.json
   * @param app.api The application api (api/ folder)
   * @param app.config The application configuration (config/ folder)
   *
   * Initialize the Fabrix Application and its EventEmitter parent class. Set
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

    // set the process node env if not established by environment
    if (!process.env.NODE_ENV) {
      process.env.NODE_ENV = 'development'
    }

    // ensure process.env is an immutable object
    const processEnv = Object.freeze(Object.assign({}, JSON.parse(JSON.stringify(process.env))))

    Object.defineProperties(this, {
      _logger: {
        value: new LoggerProxy(this),
        enumerable: false
      },
      _env: {
        value: processEnv,
        enumerable: false
      },
      _pkg: {
        value: app.pkg,
        enumerable: false
      },
      _versions: {
        value: process.versions,
        enumerable: false
      },
      _config: {
        value: new Configuration(app.config, processEnv),
        enumerable: false
      },
      _spools: {
        value: {},
        enumerable: false
      },
      _api: {
        value: app.api,
        enumerable: false
      },
      _fabrix: {
        value: pkg,
        enumerable: false
      }
    })

    // Set the max listeners from the config
    this.setMaxListeners(this.config.get('main.maxListeners'))

    // Set the resources from the configuration (this bypasses the setter with the initial config
    // in case the resourceLock is configured)
    this._resources = this.config.get('main.resources')
    // See if additional resources can be set
    this.resources = union(Object.keys(app.api), this.config.get('main.resources'))

    // Set each api resource to make sure it's provided as an object in the app
    this.resources.forEach(resource => {
      app.api[resource] = app.api[resource] || (app.api[resource] = { })
    })

    // instantiate spools TOTO type of Spool
    this.config.get('main.spools').forEach((NewSpool: any) => {
      try {
        // Create new Instance of the Spool
        const spoolContext = <typeof NewSpool> NewSpool
        const spool = new spoolContext(this, {})
        // Add the spool instance to the app.spools namespace
        this.spools[spool.name] = spool
        // Reconcile the spool.config with the app.config
        this.config.merge(spool.config, spoolContext.configAction)
        // Merge extensions into app.<ext>
        Core.mergeExtensions(this, spool)
        // Merge the spool.api with app.api
        Core.mergeSpoolApi(this, spool)
        // Bind the Spool Listeners to app.emit
        Core.bindSpoolMethodListeners(this, spool)
      }
      catch (e) {
        console.log(e.stack)
        throw new Errors.SpoolError(Spool, e, 'constructor')
      }
    })

    // Merge the API from the spools
    Core.mergeApi(this)
    // Instantiate resource classes and bind resource methods
    Core.bindResourceMethods(this, this.resources)
    // Bind Application Listeners
    Core.bindApplicationListeners(this)
    // Bind the Phase listeners for the Spool lifecycle
    Core.bindSpoolPhaseListeners(this, Object.values(this.spools))

    this.emit('fabrix:constructed')
  }

  // @enumerable(false)
  get logger (): LoggerProxy {
    return this._logger
  }

  // @enumerable(false)
  get env (): IEnv {
    return this._env
  }

  // @enumerable(false)
  get pkg (): IPkg {
    return this._pkg
  }

  // @enumerable(false)
  get versions (): IVersions {
    return this._versions
  }

  // @enumerable(false)
  get config (): Configuration {
    return this._config
  }

  /**
   * Gets the package.json of the Fabrix module
   */
  // @enumerable(false)
  get fabrix (): FabrixApp {
    return this._fabrix
  }

  /**
   * Gets the Spools that have been installed
   */
  // @enumerable(false)
  get spools (): {[key: string]: Spool} {
    return this._spools
  }

  /**
   *   Gets the api
   */
  // @enumerable(false)
  get api (): {[key: string]: FabrixGeneric | {}} {
    return this._api
  }

  /**
   * Return the Fabrix logger
   * fires fabrix:log:* log events
   */
  // @enumerable(false)
  get log (): LoggerProxy {
    return this.logger
  }

  /**
   * Sets available/allowed resources from Api and Spool Apis
   */
  set resources (values: string[]) {
    if (!this.config.get('main.lockResources')) {
      this._resources = Object.assign([], Configuration.initialResources(this.config, values))
      this.config.set('main.resources', this._resources)
    }
  }

  /**
   * Gets the Api resources that have been set
   */
  // @enumerable(false)
  get resources(): string[] {
    return this._resources
  }

  /**
   * Start the App. Load all Spools.
   */
  async start (): Promise<FabrixApp> {
    this.emit('fabrix:start')
    await this.after(['fabrix:ready'])
    return this
  }

  /**
   * Shutdown. Unbind listeners, unload spools.
   */
  async stop (error?): Promise<FabrixApp> {
    this.emit('fabrix:stop')
    if (error) {
      this.emit('fabrix:stop:error', error)
    }

    await Promise
      .all(Object.values(this.spools).map(spool => {
        spool.stage = 'unloading'
        this.log.debug('Unloading spool', spool.name, '...')
        return spool.unload()
      }))
      .then(() => {
        Object.values(this.spools).forEach(spool => { spool.stage = 'unloaded' })
        this.log.debug('All spools unloaded. Done.')
        this.removeAllListeners()
      })
      .catch(err => {
        this.log.error(err, 'while handling stop.')
        throw err
      })

    return this
  }

  /**
   * Resolve Promise once ANY of the events in the list have emitted.
   */
  async onceAny (events: string[] = []): Promise<any[]> {
    if (!Array.isArray(events)) {
      events = [events]
    }

    let resolveCallback: any

    return Promise
      .race(events.map((eventName: string) => {
        return new Promise(resolve => {
          resolveCallback = resolve
          this.once(eventName, resolveCallback)
        })
      }))
      .then((...args: string[]) => {
        args = args.filter(n => n)
        events.forEach((eventName: string) => this.removeListener(eventName, resolveCallback))
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
  async after (events: string | string[] = []): Promise<any[]> {
    if (!Array.isArray(events)) {
      events = [ events ]
    }

    return Promise
      .all(events.map((eventName: string | string[]) => {
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

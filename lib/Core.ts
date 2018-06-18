import { FabrixApp } from './'
import * as mkdirp from 'mkdirp'
import { Templates } from './'
import {
  ApiNotDefinedError,
  ConfigNotDefinedError,
  ConfigValueError,
  GraphCompletenessError,
  IllegalAccessError,
  NamespaceConflictError,
  PackageNotDefinedError,
  TimeoutError,
  SpoolError,
  ValidationError
} from './errors'

import { FabrixService } from './common/Service'
import { FabrixController } from './common/Controller'
import { FabrixPolicy } from './common/Policy'
import { FabrixModel } from './common/Model'
import { FabrixResolver } from './common/Resolver'
import { Spool, ILifecycle } from './common'

declare global {
  namespace NodeJS {
    interface Global {
      [key: string]: any
    }
  }
}

export const Errors = {
  ApiNotDefinedError,
  ConfigNotDefinedError,
  ConfigValueError,
  GraphCompletenessError,
  IllegalAccessError,
  NamespaceConflictError,
  PackageNotDefinedError,
  TimeoutError,
  SpoolError,
  ValidationError
}

export const Core = {

  reservedMethods: [
    'app',
    'api',
    'log',
    '__',
    'constructor',
    'undefined',
    'methods',
    'config',
    'schema',
    'services',
    'models'
  ],

  globals: Object.freeze(Object.assign({
    Service: FabrixService,
    Controller: FabrixController,
    Policy: FabrixPolicy,
    Model: FabrixModel,
    Resolver: FabrixResolver
  }, Errors)),

  globalPropertyOptions: Object.freeze({
    writable: false,
    enumerable: false,
    configurable: false
  }),

  /**
   * Prepare the global namespace with required Fabrix types. Ignore identical
   * values already present; fail on non-matching values.
   *
   * @throw NamespaceConflictError
   */
  assignGlobals (): void {
    Object.entries(Core.globals).forEach(([name, type]) => {
      if (global[name] === type) {
        return
      }
      if (global[name] && global[name] !== type) {
        throw new NamespaceConflictError(name, Object.keys(Core.globals))
      }
      const descriptor = Object.assign({ value: type }, Core.globalPropertyOptions)
      Object.defineProperty(global, name, descriptor)
    })
  },

  /**
   * Bind the context of API resource methods.
   */
  bindMethods (app: FabrixApp, resource: string): any {
    return Object.entries(app.api[resource])
      .map(([ resourceName, Resource ]) => {
        const obj = new Resource(app)

        obj.methods = Core.getClassMethods(obj) || []
        console.log(obj.methods)
        Object.entries(obj.methods).forEach(([ _, method])  => {
          console.log('BROKE', method)
          // TODO
          // obj[method] = obj[method].bind(obj)
        })
        return [ resourceName, obj ]
      })
      .reduce((result, [ resourceName, _resource ]) => Object.assign(result, {
        [resourceName]: _resource
      }), { })
  },

  /**
   * Traverse prototype chain and aggregate all class method names
   */
  getClassMethods (obj: any): string[] {
    const props: string[] = [ ]
    const objectRoot = new Object()

    while (!obj.isPrototypeOf(objectRoot)) {
      Object.getOwnPropertyNames(obj).forEach(prop => {
        if (
          props.indexOf(prop) === -1
          && !Core.reservedMethods.some(p => p === prop)
          && typeof obj[prop] === 'function'
        ) {
          props.push(prop)
        }
      })
      obj = Object.getPrototypeOf(obj)
    }
    return props
  },

  mergeApi (
    app: FabrixApp,
    spool: Spool,
    defaults = ['controllers', 'services', 'policies', 'models', 'resolvers']
  ) {
    defaults.forEach(resource => Object.assign(
      app.api[resource] || {},
      spool.api[resource] || {})
    )
  },

  /**
   * Create configured paths if they don't exist
   */
  async createDefaultPaths (app: FabrixApp) {
    const paths: {[key: string]: string} = app.config.get('main.paths') || { }

    for (const [ , dir ] of Object.entries(paths)) {
      await mkdirp(dir, null, function (err: Error) {
        if (err) {
          app.log.error(err)
        }
      })
    }
  },

  /**
   * Bind listeners to fabrix application events
   */
  bindApplicationListeners (app: FabrixApp) {
    app.once('spool:all:configured', () => {
      if (app.config.get('main.freezeConfig') === false) {
        app.log.warn('freezeConfig is disabled. Configuration will not be frozen.')
        app.log.warn('Please only use this flag for testing/debugging purposes.')
      }
      else {
        app.config.freeze()
      }
    })
    app.once('spool:all:initialized', () => {
      app.log.silly(Templates.silly.initialized)
      app.log.info(Templates.info.initialized)
    })
    app.once('fabrix:ready', () => {
      app.log.info(Templates.info.ready(app))
      app.log.debug(Templates.debug.ready(app))
      app.log.silly(Templates.silly.ready(app))

      app.log.info(Templates.hr)
      app.log.info(Templates.docs)
    })
    app.once('fabrix:stop', () => {
      app.log.info(Templates.info.stop)
      app.config.unfreeze()
    })
  },

  /**
   * Bind lifecycle boundary event listeners. That is, when all spools have
   * completed a particular phase, e.g. "configure" or "initialize", emit an
   * :all:<phase> event.
   */
  bindSpoolPhaseListeners (
    app: FabrixApp,
    spools: Spool[]
  ) {
    const validatedEvents = spools.map(spool => `spool:${spool.name}:validated`)
    const configuredEvents = spools.map(spool => `spool:${spool.name}:configured`)
    const initializedEvents = spools.map(spool => `spool:${spool.name}:initialized`)

    app.after(configuredEvents).then(async () => {
      await this.createDefaultPaths(app)
      app.emit('spool:all:configured')
    })

    app.after(validatedEvents)
      .then(() => app.emit('spool:all:validated'))

    app.after(initializedEvents)
      .then(() => {
        app.emit('spool:all:initialized')
        app.emit('fabrix:ready')
      })
  },

  /**
   * Bind individual lifecycle method listeners. That is, when each spool
   * completes each lifecycle, fire individual events for those spools.
   */
  bindSpoolMethodListeners (
    app: FabrixApp,
    spool: Spool
  ) {
    const lifecycle = spool.lifecycle

    app.after((lifecycle.initialize.listen).concat('spool:all:configured'))
      .then(() => app.log.debug('spool: initializing', spool.name))
      .then(() => spool.initialize())
      .then(() => app.emit(`spool:${spool.name}:initialized`))
      .catch(this.handlePromiseRejection)

    app.after((lifecycle.configure.listen).concat('spool:all:validated'))
      .then(() => app.log.debug('spool: configuring', spool.name))
      .then(() => spool.configure())
      .then(() => app.emit(`spool:${spool.name}:configured`))
      .catch(this.handlePromiseRejection)

    app.after('fabrix:start')
      .then(() => app.log.debug('spool: validating', spool.name))
      .then(() => spool.validate())
      .then(() => app.emit(`spool:${spool.name}:validated`))
      .catch(this.handlePromiseRejection)
  },

  /**
   * Handle a promise rejection
   */
  handlePromiseRejection (err: Error): void {
    console.error(err)
    throw err
  }

}

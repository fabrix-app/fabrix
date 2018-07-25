import { union, defaultsDeep, isArray, toArray, mergeWith } from 'lodash'
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
  SanityError,
  SpoolError,
  ValidationError
} from './errors'

import { FabrixService } from './common/Service'
import { FabrixController } from './common/Controller'
import { FabrixPolicy } from './common/Policy'
import { FabrixModel } from './common/Model'
import { FabrixResolver } from './common/Resolver'
import { Spool, ILifecycle, FabrixGeneric } from './common'

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
  SanityError,
  SpoolError,
  ValidationError
}

export const Core = {
  // An Exception convenience
  BreakException: {},
  // Methods reserved so that they are not autobound
  reservedMethods: [
    'app',
    'api',
    'log',
    '__', // this reserved method comes from i18n
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
    return Object.entries(app.api[resource] || { })
      .map(([ resourceName, Resource ]: [string, any]) => {
        const objContext = <typeof Resource> Resource
        const obj = new objContext(app)

        obj.methods = Core.getClassMethods(obj) || [ ]
        Object.entries(obj.methods).forEach(([ _, method]: [any, string])  => {
          obj[method] = obj[method].bind(obj)
        })
        return [ resourceName, obj ]
      })
      .reduce((result, [ resourceName, _resource ]: [string, any]) => Object.assign(result, {
        [resourceName]: _resource
      }), { })
  },

  /**
   * Instantiate resource classes and bind resource methods
   */
  bindResourceMethods(app: FabrixApp, resources: string[]): void {
    resources.forEach(resource => {
      try {
        app[resource] = Core.bindMethods(app, resource)
      }
      catch (err) {
        app.log.error(err)
      }
    })
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

  /**
   * Get the property names of an Object
   */
  getPropertyNames(obj) {
    return Object.getOwnPropertyNames(obj.prototype)
  },

  /**
   * If the object has a prototype property
   */
  hasPrototypeProperty(obj, proto) {
    return obj.prototype.hasOwnProperty(proto)
  },

  /**
   * Merge the Prototype of uninitiated classes
   */
  mergePrototype(obj, next, proto) {
    obj.prototype[proto] = next.prototype[proto]
  },

  /**
   * Merge the app api resources with the ones provided by the spools
   * Given that they are allowed by app.config.main.resources
   */
  mergeApi (app: FabrixApp) {
    const spools = Object.keys(app.spools).reverse()
    app.resources.forEach(resource => {
      spools.forEach(s => {
        // Add the defaults from the spools Apis
        defaultsDeep(app.api, app.spools[s].api)
        // Deep merge the Api
        Core.mergeApiResource(app, app.spools[s], resource)
      })
    })
  },

  /**
   * Adds Api resources that were not merged by default
   */
  mergeApiResource (app: FabrixApp, spool: Spool, resource: string) {
    if (app.api.hasOwnProperty(resource) && spool.api.hasOwnProperty(resource)) {
      Object.keys(spool.api[resource]).forEach(method => {
        Core.mergeApiResourceMethod(app, spool, resource, method)
      })
    }
  },

  /**
   * Adds Api resource methods that were not merged by default
   */
  mergeApiResourceMethod (app: FabrixApp, spool: Spool, resource: string, method: string) {
    if (spool.api[resource].hasOwnProperty(method) && app.api[resource].hasOwnProperty(method)) {
      const spoolProto = Core.getPropertyNames(spool.api[resource][method])
      spoolProto.forEach(proto => {
        if (!Core.hasPrototypeProperty(app.api[resource][method], proto)) {
          Core.mergePrototype(app.api[resource][method], spool.api[resource][method], proto)
          app.log.silly(`${spool.name}.api.${resource}.${method}.${proto} extending app.api.${resource}.${method}.${proto}`)
        }
      })
    }
  },

  /**
   * Merge the spool api resources with the ones provided by other spools
   * Given that they are allowed by app.config.main.resources
   */
  mergeSpoolApi (app: FabrixApp, spool: Spool) {
    app.resources = union(app.resources, Object.keys(app.api), Object.keys(spool.api))

    const spools = Object.keys(app.spools)
      .filter(s => s !== spool.name)

    app.resources.forEach(resource => {
      spools.forEach(s => {
        Core.mergeSpoolApiResource(app, app.spools[s], spool, resource)
      })
    })
  },

  /**
   * Merge two Spools Api Resources's in order of their load
   */
  mergeSpoolApiResource (app: FabrixApp, spool: Spool, next: Spool, resource: string) {
    if (spool.api.hasOwnProperty(resource) && next.api.hasOwnProperty(resource)) {
      Object.keys(next.api[resource]).forEach(method => {
        Core.mergeSpoolApiResourceMethod(app, spool, next, resource, method)
      })
    }
  },

  /**
   * Merge two Spools Api Resources Method's in order of their load
   */
  mergeSpoolApiResourceMethod (app: FabrixApp, spool: Spool, next: Spool, resource: string, method: string) {
    if (spool.api[resource].hasOwnProperty(method) && next.api[resource].hasOwnProperty(method)) {
      const spoolProto = Core.getPropertyNames(spool.api[resource][method])
      spoolProto.forEach(proto => {
        if (!Core.hasPrototypeProperty(next.api[resource][method], proto)) {
          Core.mergePrototype(next.api[resource][method], spool.api[resource][method], proto)
          app.log.silly(`${spool.name}.api.${resource}.${method}.${proto} extending ${next.name}.api.${resource}.${method}.${proto}`)
        }
      })
    }
  },

  /**
   * Merge extensions provided by spools into the app
   */
  mergeExtensions (
    app: FabrixApp,
    spool: Spool
  ) {
    const extensions = spool.extensions || {}
    for (const ext of Object.keys(extensions)) {
      if (!extensions.hasOwnProperty(ext)) {
        continue
      }
      if (app.hasOwnProperty(ext)) {
        app.log.warn(`Spool Extension ${spool.name}.${ext} overriding app.${ext}`)
      }
      Object.defineProperty(app, ext, spool.extensions[ext])
    }
  },

  defaultsDeep: (...args) => {
    const output = {}
    toArray(args).reverse().forEach(function (item) {
      mergeWith(output, item, function (objectValue, sourceValue) {
        return isArray(sourceValue) ? sourceValue : undefined
      })
    })
    return output
  },

  collector: (stack, key, val) => {
    let idx: any = stack[stack.length - 1].indexOf(key)
    try {
      const props: any = Object.keys(val)
      if (!props.length) {
        throw props
      }
      props.unshift({idx: idx})
      stack.push(props)
    }
    catch (e) {
      while (!(stack[stack.length - 1].length - 2)) {
        idx = stack[stack.length - 1][0].idx
        stack.pop()
      }

      if (idx + 1) {
        stack[stack.length - 1].splice(idx, 1)
      }
    }
    return val
  },

  isNotCircular: (obj) => {
    let stack = [[]]

    try {
      return !!JSON.stringify(obj, Core.collector.bind(null, stack))
    }
    catch (e) {
      if (e.message.indexOf('circular') !== -1) {
        let idx = 0
        let path = ''
        let parentProp = ''
        while (idx + 1) {
          idx = stack.pop()[0].idx
          parentProp = stack[stack.length - 1][idx]
          if (!parentProp) {
            break
          }
          path = '.' + parentProp + path
        }
      }
      return false
    }
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
    app.once('spool:all:sane', () => {
      app.log.silly(Templates.silly.sane)
      app.log.info(Templates.info.sane)
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
    const sanityEvents = spools.map(spool => `spool:${spool.name}:sane`)

    app.after(configuredEvents).then(async () => {
      await this.createDefaultPaths(app)
      app.emit('spool:all:configured')
    })

    app.after(validatedEvents)
      .then(() => app.emit('spool:all:validated'))

    app.after(initializedEvents)
      .then(() => {
        app.emit('spool:all:initialized')
      })

    app.after(sanityEvents)
      .then(() => {
        app.emit('spool:all:sane')
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

    app.after((lifecycle.sanity.listen).concat('spool:all:initialized'))
      .then(() => app.log.debug('spool: sanity check', spool.name))
      .then(() => spool.stage = 'sanity')
      .then(() => spool.sanity())
      .then(() => app.emit(`spool:${spool.name}:sane`))
      .then(() => spool.stage = 'sane')
      .catch(this.handlePromiseRejection)

    app.after((lifecycle.initialize.listen).concat('spool:all:configured'))
      .then(() => app.log.debug('spool: initializing', spool.name))
      .then(() => spool.stage = 'initializing')
      .then(() => spool.initialize())
      .then(() => app.emit(`spool:${spool.name}:initialized`))
      .then(() => spool.stage = 'initialized')
      .catch(this.handlePromiseRejection)

    app.after((lifecycle.configure.listen).concat('spool:all:validated'))
      .then(() => app.log.debug('spool: configuring', spool.name))
      .then(() => spool.stage = 'configuring')
      .then(() => spool.configure())
      .then(() => app.emit(`spool:${spool.name}:configured`))
      .then(() => spool.stage = 'configured')
      .catch(this.handlePromiseRejection)

    app.after('fabrix:start')
      .then(() => app.log.debug('spool: validating', spool.name))
      .then(() => spool.stage = 'validating')
      .then(() => spool.validate())
      .then(() => app.emit(`spool:${spool.name}:validated`))
      .then(() => spool.stage = 'validated')
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

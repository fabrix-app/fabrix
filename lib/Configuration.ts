import { merge, isArray, defaults, union } from 'lodash'
import { resolve, dirname } from 'path'
import { IllegalAccessError, ConfigValueError } from './errors'
import { requireMainFilename } from './utils'

// Proxy Handler for get requests to the configuration
const ConfigurationProxyHandler: ProxyHandler<Configuration> = {
  get (target: any, key: string) {
    if (target.has && target.has(key)) {
      const value = target.immutable === true ? Object.freeze(target.get(key)) : target.get(key)
      return new Proxy(value, ConfigurationProxyHandler)
    }
    else {
      return target.immutable === true ? Object.freeze(target[key]) : target[key]
    }
  }
}

/**
 * Extend map class for getter/setter tuple config
 */
export class Configuration extends Map<any, any> {
  public immutable: boolean
  public env: {}

  /**
   * Flattens configuration tree
   * Recursive
   */
  static flattenTree (tree = { }) {
    // Try to flatten and fail if circular
    try {
      const toReturn: { [key: string]: any } = {}
      Object.entries(tree).forEach(([k, v]) => {
        // if (typeof v === 'object' && v !== null) {
        if (
          v instanceof Object
          && typeof v !== 'function'
        ) {
          // If value is an array, flatten by index and don't try to flatten further
          if (Array.isArray(v)) {
            v.forEach((val, i) => {
              toReturn[`${k}.${i}`] = val
            })
          }
          // If the value is a normal object, keep flattening
          else {
            const flatObject = Configuration.flattenTree(v)
            Object.keys(flatObject).forEach(flatKey => {
              toReturn[`${k}.${flatKey}`] = flatObject[flatKey]
            })
          }
        }
        // Other wise, the value is a function, string, or number etc and should stop flattening
        toReturn[k] = v
      })
      return toReturn
    }
    catch (err) {
      throw new RangeError('Tree is circular, check that there are no circular references in the config')
    }
  }

  /**
   * Defines the initial api resources
   */
  static initialResources (tree, resources = []) {
    if (tree.hasOwnProperty('main') && tree.main.hasOwnProperty('resources')) {
      if (!isArray(tree.main['resources'])) {
        throw new ConfigValueError('if set, main.resources must be an array')
      }
      return tree.main['resources']
    }
    else {
      return resources
    }
  }

  /**
   * Copy and merge the provided configuration into a new object, decorated with
   * necessary default and environment-specific values.
   */
  static buildConfig (initialConfig: {env?: {[key: string]: any}} = { }, nodeEnv?: string) {
    const root = resolve(dirname(requireMainFilename()))
    const temp = resolve(root, '.tmp')
    const envConfig = initialConfig.env && initialConfig.env[nodeEnv] || { }

    const configTemplate = {
      main: {
        resources: Configuration.initialResources(initialConfig),
        lockResources: false,
        maxListeners: 128,
        spools: [ ],
        paths: {
          root: root,
          temp: temp,
          sockets: resolve(temp, 'sockets'),
          logs: resolve(temp, 'log')
        },
        freezeConfig: true,
        createPaths: true
      }
    }

    return merge(configTemplate, initialConfig, envConfig, { env: nodeEnv })
  }

  constructor (
    configTree: {[key: string]: any} = { },
    processEnv: {
      [key: string]: any,
      NODE_ENV?: string
    } = { }
  ) {
    // Constants for configuration
    const config = Configuration.buildConfig(configTree, processEnv['NODE_ENV'])
    const configEntries = Object.entries(Configuration.flattenTree(config))
    // Add to the map constructor
    super(configEntries)

    // Initial values
    this.immutable = false
    this.env = processEnv

    // Bind methods
    this.get = this.get.bind(this)
    this.set = this.set.bind(this)
    this.entries = this.entries.bind(this)
    this.has = this.has.bind(this)

    // Return Proxy
    return new Proxy(this, ConfigurationProxyHandler)
  }

  /**
   * Throws IllegalAccessError if the configuration has already been set to immutable
   * and an attempt to set value occurs.
   */
  set (key: string, value: any) {
    if (this.immutable === true) {
      throw new IllegalAccessError('Cannot set properties directly on config. Use .set(key, value) (immutable)')
    }
    return super.set(key, value)
  }

  /**
    * Merge tree into this configuration if allowed. Return overwritten keys
   */
  merge (configTree: {[key: string]: any}, configAction = 'hold'): { hasKey: boolean, key: any }[] {
    const configEntries = Object.entries(Configuration.flattenTree(configTree))
    return configEntries.map(([ key, value ]) => {
      const hasKey = this.has(key)
      // If the key has never been set, it is added to the config
      // If configAction is set to hold, then it will replace the initial config
      if (!hasKey || configAction === 'hold') {
        this.set(key, value)
      }
      // If configAction is set to merge, it will default values over the initial config
      else if (hasKey && configAction === 'merge') {
        this.set(key, defaults(this.get(key), value))
      }
      // If configAction is replaceable, and the key already exists, it's ignored completely
      // This is because it was set by a higher level app config
      else if (hasKey && configAction === 'replaceable') {
        // Do Nothing
      }
      return { hasKey, key }
    })
  }

  /**
   * Prevent changes to the app configuration
   */
  freeze () {
    this.immutable = true
  }

  /**
   * Allow changes to the app configuration
   */
  unfreeze () {
    this.immutable = false
  }
}


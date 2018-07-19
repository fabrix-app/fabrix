import { merge, isArray, defaults, union } from 'lodash'
import { resolve, dirname } from 'path'
import { IllegalAccessError, ConfigValueError } from './errors'
import { requireMainFilename } from './utils'
import { Core } from './Core'

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
    const toReturn: { [key: string]: any } = {}
    // Try to flatten and fail if unable to resolve circular object
    try {
      Object.entries(tree).forEach(([k, v]) => {
        // if (typeof v === 'object' && v !== null) {
        if (
          v !== null
          && v instanceof Object
          && typeof v !== 'function'
        ) {
          // If value is an array, flatten by index and don't try to flatten further
          if (Array.isArray(v)) {
            v.forEach((val, i) => {
              toReturn[`${k}.${i}`] = val
            })
          }
          else if (!Core.isNotCircular(v)) {
            toReturn[k] = v
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

      // Return the consturcted return object
      return toReturn
    }
    catch (err) {
      if (err !== Core.BreakException) {
        throw new RangeError('Tree is circular and can not be resolved, check that there are no circular references in the config')
      }
      return toReturn
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
   * Recursively sets the tree values on the config map
   */
  private _reverseFlattenSet(key, value) {
    if (/\.[0-9a-z]+$/.test(key)) {
      const decedent = (key).match(/\.([0-9a-z]+)$/)[1]
      const parent = key.replace(/\.[0-9a-z]+$/, '')
      const proto = Array.isArray(value) ? [] : {}
      const newParentValue = Core.defaultsDeep({[decedent]: value}, this.get(parent) || proto)
      super.set(key, value)
      // Recursively reverse flatten the set back up the tree
      return this._reverseFlattenSet(parent, newParentValue)
    }
    else {
      // This is as high as it goes
      return super.set(key, value)
    }
  }
  /**
   * Flattens what is being called to .set
   */
  private _flattenSet(key, value) {
    if (
      value !== null
      && value instanceof Object
      && typeof value !== 'function'
      && !Array.isArray(value)
    ) {
      // Flatten the new value
      const configEntries = Object.entries(Configuration.flattenTree({[key]: value}))
      // Set the flat values
      configEntries.forEach(([_key, _value]) => {
        return super.set(_key, _value)
      })
    }
    // Reverse flatten up the tree
    return this._reverseFlattenSet(key, value)
  }
  /**
   * Throws IllegalAccessError if the configuration has already been set to immutable
   * and an attempt to set value occurs.
   */
  set (key: string, value: any) {
    if (this.immutable === true) {
      throw new IllegalAccessError('Cannot set properties directly on config. Use .set(key, value) (immutable)')
    }
    return this._flattenSet(key, value)
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
        if (value === null) {
          // Do Nothing
        }
        else if (Array.isArray(value)) {
          // Do Nothing
        }
        else if (typeof value === 'number') {
          // Do Nothing
        }
        else if (typeof value === 'string') {
          // Do Nothing
        }
        else {
          this.set(key, Core.defaultsDeep(this.get(key), value))
        }
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


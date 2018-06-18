// const merge = require('lodash.merge')
import { merge } from 'lodash'
import { resolve, dirname } from 'path'
import { IllegalAccessError } from './errors'
import { requireMainFilename } from './utils'


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

export class Configuration extends Map<any, any> {
  public immutable: boolean
  public env: {}

  constructor (
    configTree: {[key: string]: any} = { },
    processEnv: {
      [key: string]: any,
      NODE_ENV?: string
    } = { }
  ) {
    const config = Configuration.buildConfig(configTree, processEnv['NODE_ENV'])
    const configEntries = Object.entries(Configuration.flattenTree(config))
    super(configEntries)

    this.immutable = false
    this.env = processEnv

    this.get = this.get.bind(this)
    this.set = this.set.bind(this)
    this.entries = this.entries.bind(this)
    this.has = this.has.bind(this)

    return new Proxy(this, ConfigurationProxyHandler)
  }

  set (key: string, value: any) {
    if (this.immutable === true) {
      throw new IllegalAccessError('Cannot set properties directly on config. Use .set(key, value) (immutable)')
    }
    return super.set(key, value)
  }

  /**
    * Merge tree into this configuration. Return overwritten keys
   */
  merge (configTree: {[key: string]: any}) {
    const configEntries = Object.entries(Configuration.flattenTree(configTree))
    return configEntries.map(([ key, value ]) => {
      const hasKey = this.has(key)
      this.set(key, value)

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

  /**
   * Flattens configuration tree
   */
  static flattenTree (tree = { }) {
    const toReturn: {[key: string]: any} = { }

    Object.entries(tree).forEach(([ k, v ]) => {
      if (typeof v === 'object' && v !== null) {
        const flatObject = Configuration.flattenTree(v)
        Object.keys(flatObject).forEach(flatKey => {
          toReturn[`${k}.${flatKey}`] = flatObject[flatKey]
        })
      }
      toReturn[k] = v
    })
    return toReturn
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
}


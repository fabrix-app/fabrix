import { FabrixApp } from '../../index'
import { Spool } from '../'
import { pick, omit, mapValues } from 'lodash'

const spindleOptions = [
  'populate',
  'limit',
  'offset',
  'sort'
]

/**
 * Web Server Spool
 *
 * Web Servers should inherit from this Spool in order to provide consistent
 * API for all web servers.
 */
export class ServerSpool extends Spool {

  static get type () {
    return 'server'
  }

  constructor (app: FabrixApp, config) {
    if (!config) {
      throw new Error('ServerSpool must be subclassed. Do not load it directly.')
    }
    super(app, config)
  }

  private _parseQuery(data) {
    return mapValues(data, value => {
      if (value === 'true' || value === 'false') {
        value = value === 'true'
      }

      if (value === '%00' || value === 'null') {
        value = null
      }

      const parseValue = parseFloat(value)

      if (!isNaN(parseValue) && isFinite(value)) {
        value = parseValue
      }

      return value
    })
  }

  /**
   * Extract options from request query and return the object subset.
   */
  public getOptionsFromQuery(query) {
    return this._parseQuery(pick(query, spindleOptions))
  }

  /**
   * Extract the criteria from the query
   */
  public getCriteriaFromQuery(query) {
    return this._parseQuery(omit(query, spindleOptions))
  }
}


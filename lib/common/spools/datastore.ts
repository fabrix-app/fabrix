import { FabrixApp } from '../../index'
import { Spool } from '../'
import { FabrixModel } from '../Model'

/**
 * Datastore Spool
 *
 * Datastores should inherit from this Spool in order to provide consistent
 * API for all datastores.
 */
export class DatastoreSpool extends Spool {
  static get type () {
    return 'datastore'
  }

  constructor (app: FabrixApp, config) {
    if (!config) {
      throw new Error('DatastoreSpool must be subclassed. Do not load it directly.')
    }
    super(app, config)
  }

  /**
   * Map stores to models.
   */
  async initialize (): Promise<any> {
    Object.entries(this.app.models).forEach(([ modelName, model ]) => {
      const modelConfig = (<typeof FabrixModel>model.constructor).config()
      model.store = modelConfig.store || this.app.config.get('stores.models.defaultStore')
    })
    return Promise.resolve()
  }
}


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
  /**
   * A Reference to the Library being used as the ORM
   */
  public _datastore: any

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
      const modelConfig = (<typeof FabrixModel>model.constructor).config(this.app, this._datastore)
      Object.assign(model, { store: modelConfig['store'] || this.app.config.get('models.defaultStore')})
      Object.assign(model, { migrate: modelConfig['migrate'] || this.app.config.get('models.migrate') || 'safe'})
    })
    return Promise.resolve()
  }
}


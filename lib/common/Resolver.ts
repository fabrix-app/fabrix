// tslint:disable no-unused-expression

import { FabrixApp } from '../index'
import { FabrixModel } from './'

/**
 * Fabrix Resolver Class.
 */
export class FabrixResolver {
  private _model: FabrixModel

  constructor (model: FabrixModel, datastore?) {
    if (!model) {
      throw new RangeError('Resolver must be given a Model to bind to')
    }
    this._model = model
    this.app.emit(`resolver:${this.model.name}:constructed`, this)
  }

  get instance(): any {
    return
  }

  /**
   * Return the parent model
   */
  get model(): FabrixModel {
    return this._model
  }

  /**
   * Return the schema of the parent model
   */
  get schema (): FabrixModel['schema'] {
    return this.model.schema
  }

  /**
   * Return the schema of the parent model
   */
  get config (): FabrixModel['config'] {
    return this.model.config
  }

  /**
   * Returns the instance of the parent model
   */
  get app(): FabrixApp {
    return this.model.app
  }

  // public save(...args) {
  //   throw new Error('Orm method for Save not defined')
  // }
  //
  // public update(...args) {
  //   throw new Error('Orm method for Update not defined')
  // }
  //
  // public delete(...args) {
  //   throw new Error('Orm method for Delete not defined')
  // }
  //
  // public get(...args) {
  //   throw new Error('Orm method for Get not defined')
  // }
}


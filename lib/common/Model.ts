import { EventEmitter } from 'events'
import { FabrixApp } from '../index'
import { FabrixResolver } from './'
import { IllegalAccessError } from '../errors'
import { FabrixGeneric } from './Generic'


/**
 * Fabrix Model Class.
 */
export class FabrixModel extends FabrixGeneric {
  private _app: FabrixApp
  private _datastore: any
  private _instance: any
  private _config: {[key: string]: any}
  private _schema: any
  private _resolver: any

  public store
  public migrate

  /**
   * Model configuration
   */
  public static config (app: FabrixApp, datastore?): {[key: string]: any} {
    return {
      tableName: null,
      store: null,
      migrate: null
    }
  }

  /**
   * Model schema. The definition of its fields, their types, indexes,
   * foreign keys, etc go here. Definition will differ based on which
   * ORM/datastore Spool is being used.
   */
  public static schema (app: FabrixApp, datastore?): {[key: string]: any} {
    return {}
  }

  /**
   * The Resolver for this Model. Use Resolvers for resolver-based ORMs such as
   * GraphQL and Falcor. Will typically look something like:
   *    return <resolvers/MyModel>
   *
   * Or, you can define the resolver right here, e.g.
   *    return class MyResolver extends Resolver {
   *      findById (...) {
   *        ...
   *      }
   *    }
   */
  public static get resolver () {
    return FabrixResolver
  }

  /**
   * Construct the model and bind the Resolver
   */
  constructor (app: FabrixApp, datastore?) {
    super(app)

    if (!(app instanceof EventEmitter)) {
      throw new Error('The "app" argument must be of type EventEmitter')
    }
    this._app = app

    this._datastore = datastore

    this.resolver = new (<typeof FabrixModel>this.constructor).resolver(this, datastore)
    this.app.emit(`model:${this.name}:constructed`, this)
  }

  get app(): FabrixApp {
    return this._app
  }

  get datastore() {
    if (!this._datastore) {
      // This will throw an error if the logger is not set yet
      // this.app.log.warn(`${this.name} did not receive an instance of the datastore`)
    }
    return this._datastore
  }

  set datastore(datastore) {
    this._datastore = datastore
  }

  get instance() {
    if (!this._resolver) {
      return
      // This will throw an error if the logger is not set yet
      // this.app.log.warn(`${this.name} did not receive an instance from the datastore`)
    }
    return this._resolver.instance
  }

  /**
   * Return the config of this model
   */
  get config () {
    if (!this._config) {
      this._config = (<typeof FabrixModel>this.constructor).config // (this.app, this.datastore)
    }
    return this._config
  }

  /**
   * Return the schema of this model
   */
  get schema () {
    if (!this._schema) {
      this._schema = (<typeof FabrixModel>this.constructor).config // (this.app, this.datastore)
    }
    return this._schema
  }

  /**
   * Set the resolver for this model
   */
  set resolver (r) {
    if (this.resolver) {
      throw new IllegalAccessError('Cannot change the resolver on a Model')
    }

    this._resolver = r
  }

  /**
   * Return the resolver for this model
   */
  get resolver () {
    return this._resolver
  }

  /**
   * Return the name of this model
   */
  get name (): string {
    return this.constructor.name.toLowerCase()
  }

  /**
   * Return the name of the database table or collection
   */
  get tableName (): string {
    const config = (<typeof FabrixModel>this.constructor).config(this.app, this.datastore)
    return config.tableName || this.name
  }

  /**
   * Bound Methods from the Resolver Class
    save (...args) {
      return this.resolver.save(...args)
    }

    update (...args) {
      return this.resolver.update(...args)
    }

    delete (...args) {
      return this.resolver.delete(...args)
    }

    get (...args) {
      return this.resolver.get(...args)
    }
  */
}

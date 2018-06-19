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
  private _config: {[key: string]: any}
  private _schema: any
  private _resolver: any

  public store

  /**
   * Model configuration
   */
  public static config (): {[key: string]: any} {
    return {
      store: null
    }
  }

  /**
   * Model schema. The definition of its fields, their types, indexes,
   * foreign keys, etc go here. Definition will differ based on which
   * ORM/datastore Spool is being used.
   */
  public static schema (): {[key: string]: any} {
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
  constructor (app: FabrixApp) {
    super(app)

    if (!(app instanceof EventEmitter)) {
      throw new Error('The "app" argument must be of type EventEmitter')
    }
    this._app = app

    this.resolver = new (<typeof FabrixModel>this.constructor).resolver(this)
    this.app.emit(`model:${this.name}:constructed`, this)
  }

  // @enumerable(false)
  // @writable(false)
  get app(): FabrixApp {
    return this._app
  }

  /**
   * Return the config of this model
   */
  get config () {
    if (!this._config) {
      this._config = (<typeof FabrixModel>this.constructor).config()
    }

    return this._config
  }

  /**
   * Return the schema of this model
   */
  get schema () {
    if (!this._schema) {
      this._schema = (<typeof FabrixModel>this.constructor).config
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
    const config = (<typeof FabrixModel>this.constructor).config() || { }
    return config.tableName || this.name
  }
}

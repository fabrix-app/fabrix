import { EventEmitter } from 'events'
import { FabrixApp } from '../index'

export interface FabrixGeneric {
  [key: string]: any
  app: FabrixApp
  methods: string[]
}
/**
 * Fabrix Generic Class.
 */
export class FabrixGeneric {
  public methods: string[] = []

  constructor (
    public app: FabrixApp
  ) {

    if (!(app instanceof EventEmitter)) {
      throw new Error('The "app" argument must be of type EventEmitter')
    }

    Object.defineProperties(this, {
      app: {
        value: app,
        writable: false,
        enumerable: false
      }
    })
  }

  /**
   * Return the id of this controller
   */
  public get id (): string {
    return this.constructor.name.toLowerCase()
  }
}

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
  public app: FabrixApp
  public methods: string[] = []
  constructor (app: FabrixApp) {
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

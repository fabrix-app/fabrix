import { FabrixApp } from '../index'
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
  get id (): string {
    return this.constructor.name.toLowerCase()
  }
}

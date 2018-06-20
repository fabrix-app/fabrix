import { Spool } from '../'

export class ExtensionSpool extends Spool {
  public extensions: {[key: string]: any}

  static get type () {
    return 'extension'
  }
}

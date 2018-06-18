import { Spool } from '../'

export class AbstractSpool extends Spool {

  static get type () {
    return 'extension'
  }
}

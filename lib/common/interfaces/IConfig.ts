import { Spool } from '../Spool'

export interface IConfig {
  [key: string]: any,
  main: {
    spools: Spool[]
  }
}

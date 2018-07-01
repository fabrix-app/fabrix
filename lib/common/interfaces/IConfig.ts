import { Spool } from '../Spool'

export interface IConfig {
  [key: string]: any,
  main: {
    [key: string]: any,
    spools: any[] // typeof Spool[]
  }
}

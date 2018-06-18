import { ILifecycle } from './ILifecycle'

export interface ISpoolConfig {
  lifecycle?: ILifecycle,
  [key: string]: any
}

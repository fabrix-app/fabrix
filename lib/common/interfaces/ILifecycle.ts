export interface ILifecycle {
  validate?: {
    listen: string[],
    emit: string[]
  },
  configure: {
    listen: string[],
    emit: string[]
  },
  initialize: {
    listen: string[],
    emit: string[]
  },
  sanity?: {
    listen: string[],
    emit: string[]
  }
}

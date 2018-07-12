export interface ILifecycle {
  configure: {
    listen: string[],
    emit: string[]
  },
  initialize: {
    listen: string[],
    emit: string[]
  },
  sanity: {
    listen: string[],
    emit: string[]
  }
}

import { GraphCompletenessError } from './errors'
import { Spool, ILifecycle } from './common'

const lifecycleStages = [
  'configure',
  'initialize'
]

export const Pathfinder = {

  /**
   * Return true if the spool dependency graph is "complete"; i.e., that
   * the lifecycle paths for all spools and all stages are valid.
   */
  isComplete (spools: Spool[]): boolean {
    return spools.every(spool => {
      return Pathfinder.isLifecycleValid(spool, spools)
    })
  },

  /**
   * Return true if all stages for a spool are valid; false otherwise
   */
  isLifecycleValid (spool: Spool, spools: Spool[]): boolean {
    return lifecycleStages.every(stageName => {
      return Pathfinder.isLifecycleStageValid(spool, stageName, spools)
    })
  },

  /**
   * Return true if a particular stage is valid for the given spool; false
   * otherwise
   */
  isLifecycleStageValid (spool: Spool, stageName: string, spools: Spool[]): boolean {
    if (!stageName || lifecycleStages.indexOf(stageName) === -1) {
      throw new TypeError(`isLifecycleStageValid: stageName must be one of ${lifecycleStages}`)
    }
    const path = Pathfinder.getLifecyclePath(spool, stageName, spools)
    const terminals = Pathfinder.getPathErrors(path)
    return !terminals.some((t: any) => t instanceof Error)
  },

  /**
   * Traverse the lifecycle path and return the terminal values for each of its
   * branches (lifecycle events)
   */
  getPathErrors (path: any): any[] {
    if (typeof path === 'boolean') {
      return [ ]
    }
    if (path instanceof Error) {
      return [ path ]
    }
    return Object.keys(path)
      .map(key => Pathfinder.getPathErrors(path[key]))
      .reduce((terminals, t) => terminals.concat(t), [ ])
  },

  /**
   *
   */
  getLifecyclePath (spool: Spool, stageName: string, spools: Spool[], path?: any[]): any {
    const stage = spool.lifecycle[stageName] || { }

    if (!path) {
      return Pathfinder.getLifecyclePath(spool, stageName, spools, [ spool ])
    }

    // terminate traversal. if current spoolwaits for no events, then it
    // necessarily reaches the sink, and indicates a complete path.
    if (!stage.listen || (stage.listen! && stage.listen.length === 0)) {
      return true
    }

    // find all spools that produce the event(s) that the current spoolrequires
    const producers = stage.listen
      .map((eventName: string) => {
        return Pathfinder.getEventProducer(eventName, stageName, spools, path)
      })
      .filter((producer: any) => !!producer)


    // return first error encountered in this path. terminate traversal.
    // one or more of the required events are not available.
    const error = producers.find((producer: any) => producer instanceof GraphCompletenessError)
    if (error) {
      return error
    }

    // all producers must themselves have complete paths.
    return producers.reduce((level: any, producer: Spool) => {
      const subpath = path.concat(producer)
      level[producer.name] = Pathfinder.getLifecyclePath(producer, stageName, spools, subpath)
      return level
    }, { })
  },

  /**
   * Return all spools that produce a given event, but which is not contained
   * in the given "path" list.
   */
  getEventProducer (eventName: string, stageName: string, spools: Spool[], path: any[] = [ ]): any {
    const producers = spools
      .filter(spool => {
        const stage = spool.lifecycle[stageName]
        return path.indexOf(spool) === -1 && stage.emit.indexOf(eventName) >= 0
      })

    if (producers.length > 1) {
      return new Error(`More than one spool produces the event ${eventName}`)
    }
    if (producers.length === 0) {
      return new GraphCompletenessError(path[path.length - 1], stageName, eventName)
    }

    return producers[0]
  }
}

/**
 * Spool Configuration
 *
 * @see {@link http://fabrixjs.io/doc/spool/config
 */
export const spool = {
  type: 'misc',
  /**
   * A searchable list of what this spool provides
   */
  provides: {
    /**
     * `resources` are the API namespaces that this spool provides
     */
    resources: [],
    /**
     * `api` is an object of keys containing arrays that declare things like:
     * api: { controllers: ['HelloWorldController'] }
     */
    api: {},
    /**
     * `config` is an array declaring the configurations included in this spool like:
     * config: ['<spoolname>', 'routes']
     */
    config: []
  },
  /**
   * Configure the lifecycle of this spool; that is, how it boots up, and which
   * order it loads relative to other spools.
   */
  lifecycle: {
    configure: {
      /**
       * List of events that must be fired before the configure lifecycle
       * method is invoked on this Spool
       */
      listen: [],

      /**
       * List of events emitted by the configure lifecycle method
       */
      emit: []
    },
    initialize: {
      listen: [],
      emit: []
    }
  }
}


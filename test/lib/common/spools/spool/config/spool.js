/**
 * SpoolConfiguration
 *
 * @see {@link http://fabrix.app/doc/spool/config
 */
module.exports = {

  /**
   * API and config resources provided by this Spool.
   */
  provides: {
    api: {
      controllers: [ ]
      // ...
    },
    config: [ ]
  },

  events: {
    configure: {
      /**
       * List of events that must be fired before the configure lifecycle
       * method is invoked on this Spool
       */
      listen: [ ],

      /**
       * List of events emitted by the configure lifecycle method
       */
      emit: [ ]
    },
    initialize: {
      listen: [ ],
      emit: [ ]
    }
  }
}

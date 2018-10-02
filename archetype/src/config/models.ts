/**
 * Models Configuration
 * (app.config.models)
 *
 * Configure the model defaults
 *
 * @see {@link http://fabrix.app/doc/config/models}
 */
export const models = {
  /**
   * The default store used by models
   */
  defaultStore: 'dev',
  /**
   * The default migration operation if not specified by store
   */
  migrate: 'alter'
}

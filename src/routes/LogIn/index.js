import { injectReducer } from 'store/reducers'

export default (store) => ({
  path: 'log_in',
  /*  Async getComponent is only invoked when route matches   */
  getComponent (nextState, cb) {
    /*  Webpack - use 'require.ensure' to create a split point
        and embed an async module loader (jsonp) when bundling   */
    require.ensure([], (require) => {
      /*  Webpack - use require callback to define
          dependencies for bundling   */
      const LogIn = require('./containers/LogInContainer').default

      /*  Return getComponent   */
      cb(null, LogIn)

    /* Webpack named bundle   */
    }, 'log_in')
  }
})

import { injectReducer } from '../../store/reducers'

export default (store) => ({
  path: 'sign_up',
  /*  Async getComponent is only invoked when route matches   */
  getComponent (nextState, cb) {
    /*  Webpack - use 'require.ensure' to create a split point
        and embed an async module loader (jsonp) when bundling   */
    require.ensure([], (require) => {
      /*  Webpack - use require callback to define
          dependencies for bundling   */
      const SignUp = require('./containers/SignUpContainer').default

      /*  Return getComponent   */
      cb(null, SignUp)

    /* Webpack named bundle   */
    }, 'sign_in')
  }
})

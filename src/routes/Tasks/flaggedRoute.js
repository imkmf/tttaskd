export default (store) => ({
  path: 'flagged',
  /*  Async getComponent is only invoked when route matches   */
  getComponent (nextState, cb) {
    /*  Webpack - use 'require.ensure' to create a split point
        and embed an async module loader (jsonp) when bundling   */
    require.ensure([], (require) => {
      /*  Webpack - use require callback to define
          dependencies for bundling   */
      const Container = require('./containers/FlaggedContainer').default
      // const reducer = require('./modules/tasks').default

      /*  Add the reducer to the store on key 'counter'  */
      // injectReducer(store, { key: 'tasks', reducer })

      /*  Return getComponent   */
      cb(null, Container)

    /* Webpack named bundle   */
    }, 'tasks')
  }
})

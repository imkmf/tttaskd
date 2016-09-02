import { injectReducer } from '../../store/reducers'

import indexRoute from './indexRoute'

import flaggedRoute from './flaggedRoute'
import inboxRoute from './inboxRoute'
import overdueRoute from './overdueRoute'
import completedRoute from './completedRoute'

export default (store) => ({
  path: 'tasks',
  indexRoute: indexRoute(store),
  childRoutes: [
    inboxRoute(store),
    flaggedRoute(store),
    overdueRoute(store),
    completedRoute(store),
  ],

  /*  Async getComponent is only invoked when route matches   */
  getComponent (nextState, cb) {
    /*  Webpack - use 'require.ensure' to create a split point
        and embed an async module loader (jsonp) when bundling   */
    require.ensure([], (require) => {
      /*  Webpack - use require callback to define
          dependencies for bundling   */
      const Tasks = require('./containers/TasksContainer').default
      // const reducer = require('./modules/tasks').default

      /*  Add the reducer to the store on key 'counter'  */
      // injectReducer(store, { key: 'tasks', reducer })

      /*  Return getComponent   */
      cb(null, Tasks)

    /* Webpack named bundle   */
    }, 'tasks')
  }
})

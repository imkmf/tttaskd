import { combineReducers } from 'redux'
import { routerReducer as router } from 'react-router-redux'
import {reducer as formReducer} from 'redux-form';

import appReducer from 'reducers/app'
import tasksReducer from 'reducers/tasks'
import userReducer from 'reducers/user'

export const makeRootReducer = (asyncReducers) => {
  return combineReducers({
    // Add sync reducers here
    form: formReducer,
    app: appReducer,
    tasks: tasksReducer,
    user: userReducer,
    router,
    ...asyncReducers
  })
}

export const injectReducer = (store, { key, reducer }) => {
  store.asyncReducers[key] = reducer
  store.replaceReducer(makeRootReducer(store.asyncReducers))
}

export default makeRootReducer

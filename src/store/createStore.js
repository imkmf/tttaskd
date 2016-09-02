import { applyMiddleware, compose, createStore } from 'redux'
import { routerMiddleware } from 'react-router-redux'
import createLogger from 'redux-logger';
import thunk from 'redux-thunk'
import makeRootReducer from './reducers'

import { persistStore, autoRehydrate } from 'redux-persist'

import Immutable from 'immutable';
import immutableTransform from 'redux-persist-transform-immutable'

export default (initialState = {}, history) => {
  const logger = createLogger({
    stateTransformer: (state) => {
      let newState = {}

      for (var i of Object.keys(state)) {
        if (Immutable.Iterable.isIterable(state[i])) {
          newState[i] = state[i].toJS()
        } else {
          newState[i] = state[i]
        }
      }

      return newState
    }
  })

  // ======================================================
  // Middleware Configuration
  // ======================================================
  const middleware = [logger, thunk, routerMiddleware(history)]

  // ======================================================
  // Store Enhancers
  // ======================================================
  const enhancers = []
  if (__DEBUG__) {
    const devToolsExtension = window.devToolsExtension
    if (typeof devToolsExtension === 'function') {
      enhancers.push(devToolsExtension())
    }
  }

  // ======================================================
  // Store Instantiation and HMR Setup
  // ======================================================
  const store = createStore(
    makeRootReducer(),
    initialState,
    compose(
      applyMiddleware(...middleware),
      autoRehydrate(),
      ...enhancers,
    ),
  )
  store.asyncReducers = {}

  if (module.hot) {
    module.hot.accept('./reducers', () => {
      const reducers = require('./reducers').default
      store.replaceReducer(reducers)
    })
  }

  persistStore(store, {
    blacklist: ['router'],
    transforms: [immutableTransform({})]
  })

  return store
}

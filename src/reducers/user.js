import { List, Map } from 'immutable'
import types from 'actions/types'
import { REHYDRATE } from 'redux-persist/constants'

import mixpanel from 'mixpanel-browser'

// ------------------------------------
// Action Handlers
// ------------------------------------
const userCreated = (state, action) => {
  identifyMixpanel(
    Map(action.user)
  )

  return state.merge({
    requestingUserCreation: false,
    user: action.user,
    userCreationError: null
  })
}

const userCreatedError = (state, action) => {
  return state.merge({
    requestingUserCreation: false,
    userCreationError: action.error
  })
}

const userLoggedIn = (state, action) => {
  identifyMixpanel(
    Map(action.user)
  )

  return state.merge({
    requestingUserLogin: false,
    user: action.user,
    userLoginError: null
  })
}

const userLoggedInError = (state, action) => {
  return state.merge({
    requestingUserLogin: false,
    userLoginError: action.error
  })
}

const userSignOut = (state, action) => {
  return state.merge({
    user: null
  })
}

const identifyMixpanel = (user) => {
  mixpanel.identify(user.get('id'))
  mixpanel.people.set({ '$email': user.get('email') })
}

const storeRehydrated = (state, action) => {
  const userStore = action.payload.user
  const user = userStore.get('user')

  identifyMixpanel(user)

  return state
}

const ACTION_HANDLERS = {
  [types.REQUEST_USER_CREATION]: (state, action) => state.set('requestingUserCreation', true),
  [types.RECEIVE_USER_CREATION]: (state, action) => userCreated(state, action),
  [types.RECEIVE_USER_CREATION_ERROR]: (state, action) => userCreatedError(state, action),

  [types.REQUEST_USER_LOGIN]: (state, action) => state.set('requestingUserLogin', true),
  [types.RECEIVE_USER_LOGIN]: (state, action) => userLoggedIn(state, action),
  [types.RECEIVE_USER_LOGIN_ERROR]: (state, action) => userLoggedInError(state, action),

  [types.SIGN_OUT_USER]: (state, action) => userSignOut(state, action),

  [REHYDRATE]: (state, action) => storeRehydrated(state, action),
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = Map({
  requestingUserCreation: false,
  userCreationError: null,
  requestingUserLogin: false,
  userLoginError: null,
  user: null,
})

export default function tasksReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}

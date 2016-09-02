import 'whatwg-fetch'
import { push } from 'react-router-redux'

// UPDATE
const BASE_URL = __DEV__ ? 'http://localhost:4000' : '<api_url>'

import types from 'actions/types'

// ------------------------------------
// Actions
// ------------------------------------
function requestUserCreation () {
  return {
    type: types.REQUEST_USER_CREATION
  }
}

export const createUser = (form) => {
  const { email, password } = form
  const body = {
    user: { email, password }
  }
  return dispatch => {
    dispatch(requestUserCreation())
    return fetch(
      `${BASE_URL}/auth/sign_up`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    }).
    then((resp) => resp.json()).
    then((json) => {
      if (json.errors) { return dispatch(receiveCreatedUserError(json.errors)) }
      if (json.user) { return dispatch(receiveCreatedUser(json.user)) }
    })
  }
}

function requestUserLogin () {
  return {
    type: types.REQUEST_USER_LOGIN
  }
}

export const loginUser = (form) => {
  const { email, password } = form
  const body = {
    user: { email, password }
  }

  return dispatch => {
    dispatch(requestUserLogin())
    return fetch(
      `${BASE_URL}/auth_user`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    }).
    then((resp) => resp.json()).
    then((json) => {
      if (json.errors) { return dispatch(receiveLoginUserError(json.errors)) }
      if (json.user) { return dispatch(receiveLoginUser(json.user)) }
    })
  }
}

function receiveLoginUserError (error) {
  return {
    error,
    type: types.RECEIVE_USER_LOGIN_ERROR
  }
}

function receiveLoginUser (user) {
  return dispatch => {
    dispatch({
      user,
      type: types.RECEIVE_USER_LOGIN
    })

    dispatch(push('/tasks'))
  }
}

export const signoutUser = () => {
  return dispatch => {
    dispatch({
      type: types.SIGN_OUT_USER
    })

    dispatch(push('/log_in'))
  }
}

function receiveLoginUserError (error) {
  return {
    error,
    type: types.RECEIVE_USER_LOGIN_ERROR
  }
}

function receiveCreatedUser (user) {
  return dispatch => {
    dispatch({
      user,
      type: types.RECEIVE_USER_CREATION
    })

    dispatch(push('/tasks'))
  }
}

export const actions = {
  createUser,
  loginUser,
  signoutUser,
}


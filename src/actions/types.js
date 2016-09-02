import keyMirror from 'keymirror';

export default keyMirror({
  // User actions
  REQUEST_USER_CREATION: null,
  RECEIVE_USER_CREATION: null,
  RECEIVE_USER_CREATION_ERROR: null,

  REQUEST_USER_LOGIN: null,
  RECEIVE_USER_LOGIN: null,
  RECEIVE_USER_LOGIN_ERROR: null,

  SIGN_OUT_USER: null,

  // tasks
  COMPLETE_TASK: null,
  DELETE_TASK: null,
  FILTER_UPDATED: null,

  REQUEST_CONTEXTS: null,
  REQUEST_TASKS: null,
  REQUEST_PROJECTS: null,

  RECEIVE_CONTEXT: null,
  RECEIVE_CONTEXTS: null,
  RECEIVE_TASK: null,
  RECEIVE_TASKS: null,
  RECEIVE_PROJECT: null,
  RECEIVE_PROJECTS: null,

  SHOW_COMPLETED_UPDATE: null,

  UPDATE_SORT_KEY: null,

  ADD_NOTIFICATION: null,
  REMOVE_NOTIFICATION: null,

  // Application
  TOGGLE_SIDEBAR: null
})


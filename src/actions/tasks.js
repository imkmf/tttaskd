import 'whatwg-fetch'
import { push } from 'react-router-redux'

import trackEvent from './trackEvent'

import types from 'actions/types'

// UPDATE
const BASE_URL = __DEV__ ? 'http://localhost:4000' : '<api_url>'

const getAuth = (state) => {
  if (!state.user.get('user')) { return null }
  return state.user.get('user').get('auth_token')
}

// ------------------------------------
// Actions
// ------------------------------------
export function requestContexts() {
  return {
    type: types.REQUEST_CONTEXTS
  }
}

export function requestProjects() {
  return {
    type: types.REQUEST_PROJECTS
  }
}

export function requestTasks() {
  return {
    type: types.REQUEST_TASKS
  }
}

export function receiveTasks(tasks) {
  return {
    tasks,
    type: types.RECEIVE_TASKS
  }
}

export function taskDeleted(task) {
  return (dispatch, getState) => {
    const auth = getAuth(getState())

    return fetch(
      `${BASE_URL}/tasks/${task.id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${auth}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).
      then((resp) => {
        if (resp.status == 401) {
          return dispatch(redirectOnUnauthorized())
        } else {
          trackEvent('Task deleted')
          return dispatch(deleteTask(task))
        }
      })
  }
}

export function deleteTask(task) {
  return {
    task,
    type: types.DELETE_TASK
  }
}

export function receiveTask(task) {
  const nextTask = task.next_task
  const _task = Object.assign({}, task, {
    next_task: null
  })

  return dispatch => {
    dispatch({
      task: _task,
      type: types.RECEIVE_TASK
    })

    if (nextTask) {
      dispatch(addNotification({
        title: `Created '${task.name}' (repeats ${task.recurring_interval})`,
        type: 'info'
      }))

      dispatch({
        task: nextTask,
        type: types.RECEIVE_TASK
      })
    }
  }
}

export function receiveContext(context) {
  return {
    context,
    type: types.RECEIVE_CONTEXT
  }
}

export function receiveProject(project) {
  return {
    project,
    type: types.RECEIVE_PROJECT
  }
}

export function receiveProjects(projects) {
  return {
    projects,
    type: types.RECEIVE_PROJECTS
  }
}

export function receiveContexts(contexts) {
  return {
    contexts,
    type: types.RECEIVE_CONTEXTS
  }
}

export const redirectOnUnauthorized = () => {
  return dispatch => {
    dispatch(push('/log_in'))
  }
}

export const showCompletedUpdated = () => {
  return {
    type: types.SHOW_COMPLETED_UPDATE
  }
}

export const contextCreated = (body) => {
  return (dispatch, getState) => {
    const auth = getAuth(getState())

    return fetch(
      `${BASE_URL}/contexts`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${auth}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ context: body })
    }).
      then((resp) => {
        if (resp.status == 401) {
          return dispatch(redirectOnUnauthorized())
        } else {
          trackEvent('Context created')
          return resp.json().
            then((json) => dispatch(receiveContext(json.context)))
        }
      })
  }
}

export const projectCreated = (body) => {
  return (dispatch, getState) => {
    const auth = getAuth(getState())

    return fetch(
      `${BASE_URL}/projects`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${auth}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ project: body })
    }).
      then((resp) => {
        if (resp.status == 401) {
          return dispatch(redirectOnUnauthorized())
        } else {
          trackEvent('Project created')
          return resp.json().
            then((json) => dispatch(receiveProject(json.project)))
        }
      })
  }
}

export const taskCreated = (body) => {
  return (dispatch, getState) => {
    const auth = getAuth(getState())

    // TODO: Bad manual transform, should standardize this/fix the bug
    let task = body
    if (task.context_id == "true") { task.context_id = null }
    if (task.project_id == "true") { task.project_id = null }

    return fetch(
      `${BASE_URL}/tasks`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${auth}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ task: task })
    }).
      then((resp) => {
        if (resp.status == 401) {
          return dispatch(redirectOnUnauthorized())
        } else {
          trackEvent('Task created')
          return resp.json().
            then((json) => dispatch(receiveTask(json.task)))
        }
      })
  }
}

export const taskUpdated = (task, body) => {
  return (dispatch, getState) => {
    const auth = getAuth(getState())

    // TODO: Bad manual transform, should standardize this/fix the bug
    let taskBody = body
    if (taskBody.context_id == "true") { taskBody.context_id = null }
    if (taskBody.project_id == "true") { taskBody.project_id = null }

    return fetch(
      `${BASE_URL}/tasks/${task.id}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${auth}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ task: taskBody })
    }).
      then((resp) => {
        if (resp.status == 401) {
          return dispatch(redirectOnUnauthorized())
        } else {
          trackEvent('Task updated')
          return resp.json().
            then((json) => dispatch(receiveTask(json.task)))
        }
      })
  }
}

export const tasksRequested = () => {
  return (dispatch, getState) => {
    dispatch(requestTasks())

    const auth = getAuth(getState())

      return fetch(`${BASE_URL}/tasks`, {
        headers: {
          'Authorization': `Bearer ${auth}`
        }
      }).
      then((resp) => {
        if (resp.status === 401) {
          return dispatch(redirectOnUnauthorized())
        } else {
          return resp.json().
            then((json) => dispatch(receiveTasks(json.tasks)))
        }
      })
  }
}

export const projectsRequested = () => {
  return (dispatch, getState) => {
    dispatch(requestProjects())

    const auth = getAuth(getState())

      return fetch(`${BASE_URL}/projects`, {
        headers: {
          'Authorization': `Bearer ${auth}`
        }
      }).
      then((resp) => {
        if (resp.status == 401) {
          return dispatch(redirectOnUnauthorized())
        } else {
          return resp.json().
            then((json) => dispatch(receiveProjects(json.projects)))
        }
      })
  }
}

export const contextsRequested = () => {
  return (dispatch, getState) => {
    dispatch(requestContexts())

    const auth = getAuth(getState())

    return fetch(`${BASE_URL}/contexts`, {
      headers: {
        'Authorization': `Bearer ${auth}`
      }
    }).
    then((resp) => {
      if (resp.status == 401) {
        return dispatch(redirectOnUnauthorized())
      } else {
        return resp.json().
          then((json) => dispatch(receiveContexts(json.contexts)))
      }
    })
  }
}

export const filterUpdated = (filter) => {
  return {
    filter,
    type: types.FILTER_UPDATED
  }
}

export const addNotification = (notification) => {
  return {
    notification,
    type: types.ADD_NOTIFICATION
  }
}

export const removeNotification = (notification) => {
  return {
    notification,
    type: types.REMOVE_NOTIFICATION
  }
}

export const updateSortKey = (sortKey) => {
  return {
    sortKey,
    type: types.UPDATE_SORT_KEY,
  }
}

export const actions = {
  contextCreated,
  contextsRequested,
  filterUpdated,
  projectsRequested,
  projectCreated,
  showCompletedUpdated,
  taskCreated,
  taskUpdated,
  tasksRequested,
  updateSortKey,
}


import types from 'actions/types'
import uuid from 'node-uuid'
import { List, Map } from 'immutable'

// ------------------------------------
// Action Handlers
// ------------------------------------
const updateForKey = (state, key, value) => {
  const wrapped = List(value)
  return state.
    set(key, wrapped).
    set('lastUpdated', Date.now())
}

const updateProjectInState = (state, project) => {
  const stateProjects = state.get('projects')
  const index = stateProjects.findIndex(c => c.id == project.id)
  // index can be zero!
  if (index > -1) {
    const updatedProjects = stateProjects.set(index, project)
    return state.set('projects', updatedProjects)
  } else {
    return state.set('projects', stateProjects.push(project))
  }
}

const updateContextInState = (state, context) => {
  const stateContexts = state.get('contexts')
  const index = stateContexts.findIndex(c => c.id == context.id)
  // index can be zero!
  if (index > -1) {
    const updatedContexts = stateContexts.set(index, context)
    return state.set('contexts', updatedContexts)
  } else {
    return state.set('contexts', stateContexts.push(context))
  }
}

const updateTaskInState = (state, task) => {
  const stateTasks = state.get('tasks')
  const index = stateTasks.findIndex(t => t.id == task.id)
  // index can be zero!
  if (index > -1) {
    const updatedTasks = stateTasks.set(index, task)
    return state.set('tasks', updatedTasks)
  } else {
    return state.set('tasks', stateTasks.push(task))
  }
}

const deleteTaskInState = (state, task) => {
  const stateTasks = state.get('tasks')
  const index = stateTasks.findIndex(t => t.id == task.id)
  // index can be zero!
  if (index > -1) {
    const updatedTasks = stateTasks.delete(index)
    return state.set('tasks', updatedTasks)
  }
}

const updateFilter = (state, filter) => {
  return state.set('filter', filter)
}

const updateTasksInState = (state, tasks) => updateForKey(state, 'tasks', tasks)
const updateProjectsInState = (state, projects) => updateForKey(state, 'projects', projects)
const updateContextsInState = (state, contexts) => updateForKey(state, 'contexts', contexts)
const updateShowCompleted = (state, action) => state.set('showCompleted', !state.get('showCompleted'))

const addNotificationInState = (state, notification) => {
  const notificationWithId = Object.assign({}, notification, {
    id: uuid.v1()
  })
  const newNotifications = state.get('notifications').push(notificationWithId)
  return state.set('notifications', newNotifications)
}

const removeNotificationInState = (state, notification) => {
  const notifications = state.get('notifications')
  const index = notifications.findIndex(n => n.id === notification.id)
  const newNotifications = state.get('notifications').delete(index)
  return state.set('notifications', newNotifications)
}

const ACTION_HANDLERS = {
  [types.COMPLETE_TASK]: (state, action) => updateTaskByCompletion(state, action.task),
  [types.DELETE_TASK]: (state, action) => deleteTaskInState(state, action.task),
  [types.FILTER_UPDATED]: (state, action) => updateFilter(state, action.filter),
  [types.RECEIVE_TASKS]: (state, action) => updateTasksInState(state, action.tasks),
  [types.RECEIVE_TASK]: (state, action) => updateTaskInState(state, action.task),
  [types.RECEIVE_CONTEXT]: (state, action) => updateContextInState(state, action.context),
  [types.RECEIVE_CONTEXTS]: (state, action) => updateContextsInState(state, action.contexts),
  [types.RECEIVE_PROJECT]: (state, action) => updateProjectInState(state, action.project),
  [types.RECEIVE_PROJECTS]: (state, action) => updateProjectsInState(state, action.projects),
  [types.SHOW_COMPLETED_UPDATE]: (state, action) => updateShowCompleted(state, action),
  [types.UPDATE_SORT_KEY]: (state, action) => state.set('sortKey', action.sortKey),

  [types.ADD_NOTIFICATION]: (state, action) => addNotificationInState(state, action.notification),
  [types.REMOVE_NOTIFICATION]: (state, action) => removeNotificationInState(state, action.notification),
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = Map({
  contexts: List(),
  filter: 'inbox',
  lastUpdated: null,
  notifications: List(),
  projects: List(),
  showCompleted: false,
  sortKey: 'due_at',
  tasks: List()
})

export default function tasksReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}

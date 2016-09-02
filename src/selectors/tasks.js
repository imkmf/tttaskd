import { createSelector } from 'reselect'
import moment from 'moment'
import filter from 'lodash/filter'
import compose from 'lodash/fp/compose'
import fz from 'fuzzysearch'

const getTasksReducer = (state) => state.tasks

export const getFilter = createSelector(
  getTasksReducer,
  (tasksReducer) => tasksReducer.get('filter')
)

export const getCompletedToggle = createSelector(
  getTasksReducer,
  (tasksReducer) => tasksReducer.get('showCompleted')
)

export const getNotifications = createSelector(
  getTasksReducer,
  (tasksReducer) => tasksReducer.get('notifications')
)

export const getTasks = createSelector(
  getTasksReducer,
  (tasksReducer) => tasksReducer.get('tasks')
)

const withoutContext = (tasks) => tasks.filter(t => t.context_id == null)
const withoutProject = (tasks) => tasks.filter(t => t.project_id == null)

export const getContexts = createSelector(
  getTasksReducer,
  (tasksReducer) => tasksReducer.get('contexts')
)

export const getProjects = createSelector(
  getTasksReducer,
  (tasksReducer) => tasksReducer.get('projects')
)

export const getInbox = createSelector(
  getTasks,
  (tasks) => compose([withoutContext, withoutProject])(tasks)
)

const downcase = (str) => str.toLowerCase()

const contextHunt = (key, contexts, projects) => {
  const contextName = key.slice(1)
  return contexts.find(c => fz(downcase(contextName), downcase(c.name)))
}

const projectHunt = (key, contexts, projects) => {
  const projectName = key.slice(1)
  return projects.find(p => fz(downcase(projectName), downcase(p.name)))
}

export const getFilteredTasks = createSelector(
  [getFilter, getTasks, getContexts, getProjects, getCompletedToggle],
  (filter, tasks, contexts, projects, showCompleted) => {
    let matchFound = false
    const key = filter.toLowerCase()
    let filteredTasks = tasks

    if (key.includes('flagged')) {
      filteredTasks = tasks.filter(t => t.flagged == true)
      matchFound = true
    }

    if (key.includes('overdue')) {
      filteredTasks = tasks
        .filter(t => moment(t.due_at) < moment())
        .filter(t => t.completed == false)
      matchFound = true
    }

    if (key.length > 1) {
      const contextName = key.split(" ").find(w => w[0] == "@")
      if (contextName) {
        if (contextName[1] == "#") {
          const contextId = contextName.slice(2)
          filteredTasks = filteredTasks.filter(t => t.context_id == contextId)
          matchFound = true
        } else {
          const context = contextHunt(contextName, contexts, projects)
          if (context) {
            filteredTasks = filteredTasks.filter(t => t.context_id === context.id)
            matchFound = true
          }
        }
      }

      const projectName = key.split(" ").find(w => w[0] == "^")
      if (projectName) {
        if (projectName[1] == "#") {
          const projectId = projectName.slice(2)
          filteredTasks = filteredTasks.filter(t => t.project_id == projectId)
          matchFound = true
        } else {
          const project = projectHunt(projectName, contexts, projects)
          if (project) {
            filteredTasks = filteredTasks.filter(t => t.project_id === project.id)
            matchFound = true
          }
        }
      }
    }

    // inbox is super specific and shouldn't hold onto old, non-project/context todos
    if (key.includes('inbox')) {
      const inboxTasks = compose([withoutContext, withoutProject])(tasks)
      matchFound = true
      return inboxTasks.filter(t => t.completed == false)
    }

    if (key.includes('completed')) {
      filteredTasks = tasks.filter(t => t.completed == true)
      matchFound = true
    } else {
      // if showCompleted false, show all incomplete tasks
      if (!showCompleted) {
        filteredTasks = filteredTasks.filter(t => t.completed == false)
      }
    }

    // filtering hasn't turned up anything, start searching tasks
    if (!matchFound) {
      filteredTasks = filteredTasks.filter(t => fz(downcase(key), downcase(t.name)))
    }

    return filteredTasks
  }
)

import _ from 'lodash'

const payload = {
  tasks: [
    {
      id: 1,
      name: 'Write taskd',
      project_id: 1,
      context_id: 1,
      created_at: '2016-07-09T18:13:39.892Z',
      due_at: '2016-07-19T18:13:59.538Z',
      updated_at: '2016-07-09T18:13:59.538Z'
    },
    {
      id: 2,
      name: 'Take out garbage',
      project_id: 2,
      context_id: 2,
      created_at: '2016-07-09T18:13:39.892Z',
      due_at: '2016-07-10T18:13:59.538Z',
      updated_at: '2016-07-09T18:13:59.538Z'
    },
    {
      id: 3,
      name: 'Do the thing',
      project_id: null,
      context_id: null,
      created_at: '2016-07-09T18:13:39.892Z',
      due_at: '2016-07-19T18:13:59.538Z',
      updated_at: '2016-07-09T18:13:59.538Z'
    }
  ],
  projects: [
    {
      id: 1,
      name: 'Software ideas',
      created_at: '2016-07-09T18:13:39.892Z',
      updated_at: '2016-07-09T18:13:59.538Z'
    },
    {
      id: 2,
      name: 'Around the house',
      created_at: '2016-07-09T18:13:39.892Z',
      updated_at: '2016-07-09T18:13:59.538Z'
    }
  ],
  contexts: [
    {
      id: 1,
      name: 'laptop',
      created_at: '2016-07-09T18:13:39.892Z',
      updated_at: '2016-07-09T18:13:59.538Z'
    },
    {
      id: 2,
      name: 'home',
      created_at: '2016-07-09T18:13:39.892Z',
      updated_at: '2016-07-09T18:13:59.538Z'
    }
  ]
}

/*
 * This is super ugly and should be removed
 * in favor of an ORM handling this, or at least
 * in a separate, testable func
 */
const populateTaskWithProject = (task, projects) => {
  const { project_id } = task
  const project = _.find(projects, { id: project_id })
  return _.assign({}, task, { project: project })
}

const populateTaskWithContext = (task, contexts) => {
  const { context_id } = task
  const context = _.find(contexts, { id: context_id })
  return _.assign({}, task, { context: context })
}

export default (() => {
  return _.assign({}, payload, {
    tasks: _.map(payload.tasks, (task) => {
      const taskWProject = populateTaskWithProject(task, payload.projects)
      const taskWContext = populateTaskWithContext(taskWProject, payload.contexts)
      return taskWContext
    })
  })
})()

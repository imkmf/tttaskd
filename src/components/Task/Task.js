import React, { PropTypes } from 'react'

import classes from './Task.scss'
import cx from 'classnames'

import { Button } from 'react-bootstrap'

import Date from 'components/shared/Date'
import Text from 'components/shared/Text'
import Icon from 'components/shared/Icon'

import moment from 'moment'

import { reduxForm } from 'redux-form'
import Select from 'components/Shared/Select'

import domOnlyProps from 'lib/domOnlyProps'

const findContext = (task, contexts) => contexts.find(c => task.context_id === c.id)
const findProject = (task, projects) => projects.find(p => task.project_id === p.id)

class Task extends React.Component {
  constructor(...args) {
    super(...args)
    this.state = { modalNeedsExpansion: false }
    this.editing = this.editing.bind(this)
    this.complete = this.complete.bind(this)
    this.destroy = this.destroy.bind(this)
    this.flag = this.flag.bind(this)
    this.resetModal = this.resetModal.bind(this)
    this.updateTask = this.updateTask.bind(this)
  }

  onChange (filter) {
    this.props.onChange(filter)
    return false
  }

  updateTask (body) {
    this.props.taskUpdated(this.props.task, body)
  }

  complete () {
    const {
      addNotification,
      taskUpdated,
      task
    } = this.props

    taskUpdated(task, { completed: !task.completed })
    const action = task.completed ? 'incomplete' : 'completed'
    addNotification({
      title: `Marked '${task.name}' as ${action}`,
      type: 'info'
    })
  }

  flag () {
    const {
      addNotification,
      taskUpdated,
      task
    } = this.props

    taskUpdated(task, { flagged: !task.flagged })
    const action = task.flagged ? 'Unflagged' : 'Flagged'
    addNotification({
      title: `${action} '${task.name}'`,
      type: 'info'
    })
  }

  destroy () {
    const {
      addNotification,
      taskDeleted,
      task
    } = this.props

    taskDeleted(task)
    addNotification({
      title: `Deleted '${task.name}'`,
      type: 'info'
    })
  }

  resetModal () {
    this.setState({ modalNeedsExpansion: false })
  }

  editing () {
    this.setState({ modalNeedsExpansion: true })
  }

  withProject (task, projects) {
    const project = findProject(task, projects)
    if (project) {
      return (
        <span>
          <span className={classes.icon}><Icon name='angle up' /></span>
          <a href="#" onClick={this.onChange.bind(this, `^#${project.id}`)}>{project.name} (#{project.id})</a>
        </span>
      )
    }
  }

  withContext (task, contexts) {
    const context = findContext(task, contexts)
    if (context) {
      return (
        <span>
          <span className={classes.icon}><Icon name='at' /></span>
          <a href="#" onClick={this.onChange.bind(this, `@#${context.id}`)}>{context.name} (#{context.id})</a>
        </span>
      )
    }
  }

  render () {
    const { contexts, projects, task, taskUpdated } = this.props
    const { modalNeedsExpansion } = this.state
    const overdue = !task.completed && moment(task.due_at) < moment()

    const showSecondColumn = task.project_id || task.context_id || task.due_at
    const showThirdColumn = task.recurring_interval || task.notes

    return (
      <div>
        <div className={cx('ui', 'grid', 'raised', 'segment ') + (overdue ? classes.overdueBorder : null)}>
          <div className={cx('row ' + classes.taskRow)}>
            <div className='one column'>
              <div className='ui checkbox'>
                <input
                  defaultChecked={task.completed}
                  onClick={this.complete}
                  type='checkbox'
                />
                <label></label>
              </div>
            </div>

            <div className='ten wide column'>
              <div className={classes.header}>
                <h4 className={classes.taskTitle}><Text text={task.name} /></h4>
              </div>
            </div>

            <div className='one column'>
            </div>

            <div className='three wide column'>
              <a href="#" className={classes.leftIcon} onClick={this.editing}>
                <Icon name='edit' />
              </a>
              <a href="#" onClick={this.flag}>
                {task.flagged ? <Icon name='flag' /> : <Icon name='flag outline' />}
              </a>
              <a href="#" onClick={this.destroy}>
                <Icon name='trash' />
              </a>
            </div>

            <div className='one column'>
              <small>#{task.id}</small>
            </div>
          </div>

          {showSecondColumn &&
          <div className={cx('row ' + classes.taskRow)}>
            <div className='one column'>
            </div>

            <div className='ten wide column'>
              {this.withProject(task, projects)} {task.context_id && task.project_id && "·"} {this.withContext(task, contexts)}
            </div>

            <div className='one column'>
            </div>

            <div className='three wide column'>
              {task.due_at &&
              <span className={(overdue ? classes.overdue : null)}>Due <Date date={task.due_at} type='relative' /></span>
              }
            </div>
          </div>
          }

          {showThirdColumn &&
          <div className={cx('row ' + classes.taskRow)}>
            <div className='one column'>
            </div>

            <div className='ten wide column'>
              {task.notes && <Text text={task.notes} />}
            </div>

            <div className='one column'>
            </div>

            <div className='three wide column'>
              {task.recurring_interval &&
              <div className={classes.header}>
                <p>
                  <em><Text text={`Repeating ${task.recurring_interval}`} /></em>
                </p>
              </div>
              }
            </div>
          </div>
          }

          <EditTaskForm
            formKey={`task-${task.id}`}
            modalNeedsExpansion={modalNeedsExpansion}
            resetModal={this.resetModal}
            {...this.props}
            onSubmit={this.updateTask}
          />
        </div>
      </div>
    )
  }
}

Task.propTypes = {
  contexts: PropTypes.object,
  projects: PropTypes.object,
  task: PropTypes.shape({
    context: PropTypes.shape({
      name: PropTypes.string
    }),
    due_at: PropTypes.string,
    name: PropTypes.string,
    project: PropTypes.shape({
      name: PropTypes.string
    })
  })
}

export default Task

// form

const fields = [ 'name', 'context_id', 'project_id', 'due_at', 'flagged', 'notes', 'recurring_interval' ]

class EditTaskForm extends React.Component {
  constructor(...args) {
    super(...args)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentDidUpdate (nextProps, nextState) {
    if (this.props.modalNeedsExpansion == true && nextProps.modalNeedsExpansion == false) {
      this.expand()
    }
  }

  contextsForSelect () {
    const contexts = this.props.contexts.sortBy(c => c.name).toJS()
    return contexts.map(c => { return { value: c.id, label: c.name } })
  }

  projectsForSelect () {
    const projects = this.props.projects.sortBy(p => p.name).toJS()
    return projects.map(p => { return { value: p.id, label: p.name } })
  }

  recurringIntervalsForSelect () {
    return [
      { value: 'daily', label: 'Daily' },
      { value: 'weekly', label: 'Weekly' },
      { value: 'monthly', label: 'Monthly' },
    ]
  }

  handleSubmit (payload) {
    this.props.handleSubmit(payload)
    this.expand()
  }

  expand () {
    $(this.refs.modal)
      .modal({
        onHidden: () => { this.props.resetModal() }
      })
      .modal('toggle')
  }

  render () {
    const {
      contexts,
      fields: { name, context_id, project_id, due_at, flagged, notes, recurring_interval },
      projects,
      handleSubmit,
    } = this.props

    const canSubmit = name && context_id && project_id && due_at && flagged

    const contextsForSelect = [].concat(
      <option key="empty" disabled>Context</option>,
      this.contextsForSelect().map((context) =>
        <option key={context.value} value={context.value}>{context.label}</option>
      )
    )

    const projectsForSelect = [].concat(
      <option key="empty" disabled>Project</option>,
      this.projectsForSelect().map((project) =>
        <option key={project.value} value={project.value}>{project.label}</option>
      )
    )

    const intervalsForSelect = [].concat(
      <option key="empty" disabled>Interval</option>,
      this.recurringIntervalsForSelect().map((interval) =>
        <option key={interval.value} value={interval.value}>{interval.label}</option>
      )
    )

    const dueAt = moment(due_at.value).format('Y-MM-DD')

    return (
      <div className='ui modal' ref='modal'>
        <div className='header'>
          New task
        </div>

        <div className='content'>
          <form className='ui form' onSubmit={this.handleSubmit}>
            <div className='field'>
              <label>Task name</label>
              <input
                placeholder="Task Name"
                type="text"
                {...domOnlyProps( name )}
                value={name.value || ''}
              />
            </div>
            <div className='field'>
              <label>Context</label>
              <select
                className='ui selection dropdown'
                name='context_id'
                {...domOnlyProps( context_id )}
                value={context_id.value || ''}
              >
                {contextsForSelect}
              </select>
            </div>
            <div className='field'>
              <label>Project</label>
              <select
                className='ui selection dropdown'
                {...domOnlyProps( project_id )}
                value={project_id.value || ''}
              >
                {projectsForSelect}
              </select>
            </div>
            <div className='field'>
              <label>Repeat task?</label>
              <select
                className='ui selection dropdown'
                {...domOnlyProps( recurring_interval )}
                value={recurring_interval.value || ''}
              >
                {intervalsForSelect}
              </select>
            </div>
            <div className='field'>
              <label>Due At</label>
              <input
                type="date"
                {...domOnlyProps( due_at )}
                value={dueAt || ''}
              />
            </div>
            <div className='field'>
              <div className='ui checkbox'>
                <input
                  type="checkbox"
                  {...domOnlyProps( flagged )}
                  value={flagged || ''}
                />
                <label>Flagged</label>
              </div>
            </div>
            <div className='field'>
              <label>Notes (supports Markdown)</label>
              <textarea
                placeholder="Notes"
                {...domOnlyProps( notes )}
                value={notes.value || ''}
              />
            </div>
            <button
              className='ui button'
              disabled={!canSubmit}
              onClick={this.handleSubmit}
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    )
  }
}

EditTaskForm = reduxForm({
  form: 'editTask',
  fields
},
(state, ownProps) => ({
  initialValues: ownProps.task
}))(EditTaskForm);


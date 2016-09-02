import React from 'react'
import classes from './NewTask.scss'
import { reduxForm } from 'redux-form'
import Select from 'components/Shared/Select'

import domOnlyProps from 'lib/domOnlyProps'

export const fields = [ 'name', 'context_id', 'project_id', 'due_at', 'flagged', 'notes', 'recurring_interval' ]

class NewTask extends React.Component {
  constructor(...args) {
    super(...args)
    this.expand = this.expand.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  expand () {
    $(this.refs.modal).modal('toggle')
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
      <option key="empty" disabled value=''>Interval</option>,
      this.recurringIntervalsForSelect().map((interval) =>
        <option key={interval.value} value={interval.value}>{interval.label}</option>
      )
    )

    return (
      <span>
        <button className="ui labeled icon button" onClick={this.expand}>
          <i className="add icon"></i> Add Task
        </button>

        <div className='ui modal' ref='modal'>
          <div className='header'>
            New task
          </div>

          <div className='content'>
            <form className='ui form' onSubmit={this.handleSubmit}>
              <div className='field'>
                <label>Task name (supports Markdown)</label>
                <input
                  placeholder="Task Name"
                  type="text"
                  {...domOnlyProps(name)}
                />
              </div>
              <div className='field'>
                <label>Context</label>
                <select
                  className='ui selection dropdown'
                  name='context_id'
                  {...domOnlyProps(context_id)}
                >
                  {contextsForSelect}
                </select>
              </div>
              <div className='field'>
                <label>Project</label>
                <select
                  className='ui selection dropdown'
                  {...domOnlyProps(project_id)}
                >
                  {projectsForSelect}
                </select>
              </div>
              <div className='field'>
                <label>Repeat task?</label>
                <select
                  className='ui selection dropdown'
                  {...domOnlyProps(recurring_interval)}
                >
                  {intervalsForSelect}
                </select>
              </div>
              <div className='field'>
                <label>Due At</label>
                <input
                  type="date" {...domOnlyProps(due_at) }/>
              </div>
              <div className='field'>
                <div className='ui checkbox'>
                  <input
                    type="checkbox"
                    {...domOnlyProps(flagged)}
                  />
                  <label>Flagged</label>
                </div>
              </div>
              <div className='field'>
                <label>Notes (supports Markdown)</label>
                <textarea
                  placeholder="Notes"
                  {...domOnlyProps(notes)}
                />
              </div>
              <button
                className='ui button'
                disabled={!canSubmit}
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </span>
    )
  }
}

NewTask = reduxForm({
  form: 'newTask',
  fields
})(NewTask);

export default NewTask;

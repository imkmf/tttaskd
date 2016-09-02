import React from 'react'
import { connect } from 'react-redux'

import classes from './Tasks.scss'

import _ from 'lodash'
import moment from 'moment'

import Icon from 'components/Shared/Icon'
import Task from 'components/Task'

import {
  updateSortKey,
} from 'actions/tasks'

const mapStateToProps = (state, ownProps) => {
  return Object.assign({}, ownProps, {
    sortKey: state.tasks.get('sortKey')
  })
}

const mapActionCreators = {
  updateSortKey,
}

class Tasks extends React.Component {
  constructor(...args) {
    super(...args)
    this.updateSortKey = this.updateSortKey.bind(this)
  }

  updateSortKey (evt) {
    const key = evt.target.value
    this.props.updateSortKey(key)
  }

  render () {
    const {
      addNotification,
      contexts,
      filter,
      onChange,
      projects,
      showCompleted,
      showCompletedUpdated,
      sortKey,
      taskDeleted,
      taskUpdated,
      tasks
    } = this.props

    // TODO: support both ascending and descending, date and string
    let sortedTasks = _.sortBy(tasks.toJS(), sortKey)
    if (['created_at', 'updated_at'].includes(sortKey)) {
      sortedTasks = sortedTasks.reverse()
    }

    return (
      <div>
        {sortedTasks.length ?
        <div>
          <div className="ui form">
            <div className="fields">
              <div className="four wide field">
                <label>Sort tasks by</label>
                <select className="ui fluid dropdown" onChange={this.updateSortKey} value={sortKey}>
                  <option value='' disabled>Sort key</option>
                  <option value='created_at'>Created at</option>
                  <option value='due_at'>Due at</option>
                  <option value='name'>Name</option>
                  <option value='updated_at'>Updated at</option>
                </select>
              </div>
            </div>
          </div>

          <div>
          {sortedTasks.map((task) =>
            <Task
              addNotification={addNotification}
              key={task.id}
              contexts={contexts}
              onChange={onChange}
              projects={projects}
              task={task}
              taskDeleted={taskDeleted}
              taskUpdated={taskUpdated}
            />)}
          </div>
        </div> :
        <div>
          <h4>No tasks</h4>
        </div>
        }
      </div>
    )
  }
}

export default connect(mapStateToProps, mapActionCreators)(Tasks)

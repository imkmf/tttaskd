import React, { Component } from 'react'
import { connect } from 'react-redux'

import _ from 'lodash'

import classes from './TasksContainer.scss'

import cx from 'classnames'

import Header from 'components/Header'
import Sidebar from 'containers/Sidebar'

import FormContainer from './FormContainer'
import Notification from 'components/Notification'

import Task from 'components/Task'
import Taskbar from 'components/Taskbar'
import Tasks from 'components/Tasks'

import {
  toggleSidebar
} from 'actions/application'

import {
  addNotification,
  contextCreated,
  contextsRequested,
  projectCreated,
  projectsRequested,
  removeNotification,
  showCompletedUpdated,
  taskCreated,
  taskDeleted,
  taskUpdated,
  tasksRequested,
} from 'actions/tasks'

import {
  signoutUser
} from 'actions/user'

import {
  getCompletedToggle,
  getContexts,
  getFilter,
  getNotifications,
  getProjects,
  getTasks,
} from 'selectors/tasks'

import {
  getUserInfo
} from 'selectors/user'

const mapStateToProps = (state, ownProps) => {
  return {
    app: state.app,
    contexts: getContexts(state),
    notifications: getNotifications(state),
    path: ownProps.location.pathname,
    projects: getProjects(state),
    showCompleted: getCompletedToggle(state),
    tasks: getTasks(state),
    user: getUserInfo(state),
  }
}

const mapActionCreators = {
  addNotification,
  contextCreated,
  contextsRequested,
  projectCreated,
  projectsRequested,
  removeNotification,
  showCompletedUpdated,
  signoutUser,
  taskCreated,
  taskDeleted,
  taskUpdated,
  tasksRequested,
  toggleSidebar
}

class IndexContainer extends React.Component {
  componentWillMount () {
    const {
      tasksRequested,
      projectsRequested,
      contextsRequested
    } = this.props

    tasksRequested()
    projectsRequested()
    contextsRequested()
  }

  render () {
    const {
      addNotification,
      app,
      contextCreated,
      contexts,
      notifications,
      path,
      projectCreated,
      projects,
      removeNotification,
      showCompleted,
      showCompletedUpdated,
      signoutUser,
      tasks,
      taskCreated,
      taskDeleted,
      taskUpdated,
      user
    } = this.props

    const sidebarExpanded = app.get('sidebarExpanded')

    const filteredTasks = tasks.filter(t => !t.completed)

    return (
      <div>
        <Sidebar />

        <div className={cx(classes.topPad, ' ui masthead vertical segment ', { leftPad: sidebarExpanded })}>
          <h1 className="ui header">Tasks</h1>

          <div className='ui basic segment'>
            <FormContainer
              {...this.props}
            />
          </div>

          <Tasks
            addNotification={addNotification}
            contexts={contexts}
            projects={projects}
            showCompleted={showCompleted}
            showCompletedUpdated={showCompletedUpdated}
            tasks={filteredTasks}
            taskDeleted={taskDeleted}
            taskUpdated={taskUpdated}
          />
        </div>

        <div className={'ui list ' + classes.bottomFix}>
          {notifications.map(( notification, index ) =>
            <Notification
              key={index}
              notification={notification}
              removeNotification={removeNotification}
            />
          )}
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapActionCreators)(IndexContainer)

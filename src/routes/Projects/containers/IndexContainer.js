import React, { Component } from 'react'
import { connect } from 'react-redux'

import _ from 'lodash'

import classes from './ProjectsContainer.scss'
import cx from 'classnames'

import Header from 'components/Header'
import Sidebar from 'containers/Sidebar'

import Notification from 'components/Notification'

import Projects from 'components/Projects'

import {
  addNotification,
  contextCreated,
  contextsRequested,
  projectCreated,
  projectsRequested,
  removeNotification,
  showCompletedUpdated,
  taskCreated,
  taskUpdated,
  tasksRequested,
} from 'actions/tasks'

import {
  signoutUser
} from 'actions/user'

import {
  getCompletedToggle,
  getContexts,
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
  taskUpdated,
  tasksRequested,
}

class ProjectsContainer extends React.Component {
  componentWillMount () {
    const {
      projectsRequested,
      tasksRequested,
    } = this.props

    projectsRequested()
    tasksRequested()
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
      taskUpdated,
      user
    } = this.props

    const sidebarExpanded = app.get('sidebarExpanded')

    return (
      <div>
        <Sidebar />

        <div className={cx(classes.topPad, ' ui masthead vertical segment ', { leftPad: sidebarExpanded })}>
          <Projects
            projects={projects}
            tasks={tasks}
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

export default connect(mapStateToProps, mapActionCreators)(ProjectsContainer)


import React, { Component } from 'react'
import { connect } from 'react-redux'

import _ from 'lodash'

import pluralize from 'pluralize'

import classes from './ContextsContainer.scss'
import cx from 'classnames'

import Header from 'components/Header'
import Sidebar from 'containers/Sidebar'

import Notification from 'components/Notification'

import Projects from 'components/Projects'
import Tasks from 'components/Tasks'

import {
  addNotification,
  contextCreated,
  contextsRequested,
  filterUpdated,
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
    contextId: ownProps.params.contextId,
    contexts: getContexts(state),
    filter: getFilter(state),
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
  filterUpdated,
  projectCreated,
  projectsRequested,
  removeNotification,
  showCompletedUpdated,
  signoutUser,
  taskCreated,
  taskDeleted,
  taskUpdated,
  tasksRequested,
}

class ContextContainer extends React.Component {
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
      contextId,
      contexts,
      filter,
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

    // TODO: check for "short name" if that is built here
    const tasksForContext = tasks.filter(t => !t.completed && t.context_id == contextId)
    const context = contexts.find(c => c.id == contextId)

    return (
      <div>
        <Sidebar />

        <div className={cx(classes.topPad, ' ui masthead vertical segment ', { leftPad: sidebarExpanded })}>
          <h1 className='ui header'>
            {context.name}
          </h1>

          <h3 className='ui header'>
            {pluralize('task', tasksForContext.size, true)}
          </h3>

          <Tasks
            addNotification={addNotification}
            contexts={contexts}
            context={context}
            filter={filter}
            onChange={this.props.filterUpdated}
            projects={projects}
            showCompleted={showCompleted}
            showCompletedUpdated={showCompletedUpdated}
            tasks={tasksForContext}
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

export default connect(mapStateToProps, mapActionCreators)(ContextContainer)

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import _ from 'lodash'
import pluralize from 'pluralize'

import classes from './ContextsContainer.scss'
import cx from 'classnames'

import Header from 'components/Header'
import Sidebar from 'containers/Sidebar'

import Notification from 'components/Notification'

import Projects from 'components/Projects'

import Text from 'components/shared/text'

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

class ContextsContainer extends React.Component {
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
          <h1 className="ui header">
            <div className="content">
              {contexts.size ? pluralize('context', contexts.size, true) : 'No contexts'}
            </div>
          </h1>

          {contexts.map(( context, index ) => {
            const tasksForContext = tasks.filter(t => t.context_id == context.id && !t.completed)

            return (
              <div className='ui grid raised segment' key={index}>
                <div className='twelve wide column'>
                  <h4>
                    <Link to={`/contexts/${context.id}`}>
                      <Text text={context.name} />
                    </Link>
                    {tasksForContext.size ? pluralize('task', tasksForContext.size, true) : 'No tasks'}
                  </h4>
                </div>
              </div>
            )
          })}
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

export default connect(mapStateToProps, mapActionCreators)(ContextsContainer)

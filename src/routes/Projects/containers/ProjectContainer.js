import React, { Component } from 'react'
import { connect } from 'react-redux'

import _ from 'lodash'

import pluralize from 'pluralize'

import classes from './ProjectsContainer.scss'
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
    contexts: getContexts(state),
    filter: getFilter(state),
    notifications: getNotifications(state),
    path: ownProps.location.pathname,
    projectId: ownProps.params.projectId,
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

class ProjectContainer extends React.Component {
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
      filter,
      notifications,
      path,
      projectCreated,
      projectId,
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
    const tasksForProject = tasks.filter(t => !t.completed && t.project_id == projectId)
    const project = projects.find(p => p.id == projectId)

    return (
      <div>
        <Sidebar />

        <div className={cx(classes.topPad, ' ui masthead vertical segment ', { leftPad: sidebarExpanded })}>
          <h1 className='ui header'>
            {project.name}
          </h1>

          <h3 className='ui header'>
            {pluralize('task', tasksForProject.size, true)}
          </h3>

          <Tasks
            addNotification={addNotification}
            contexts={contexts}
            filter={filter}
            onChange={this.props.filterUpdated}
            project={project}
            projects={projects}
            showCompleted={showCompleted}
            showCompletedUpdated={showCompletedUpdated}
            tasks={tasksForProject}
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

export default connect(mapStateToProps, mapActionCreators)(ProjectContainer)

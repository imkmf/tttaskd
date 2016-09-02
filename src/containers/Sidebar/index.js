import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import classes from './Sidebar.scss'
import cx from 'classnames'
import { Link } from 'react-router'
import _ from 'lodash'

import versionSha from 'lib/version'

import {
  toggleSidebar
} from 'actions/application'

import {
  contextsRequested,
  projectsRequested,
  tasksRequested,
} from 'actions/tasks'

import {
  signoutUser
} from 'actions/user'

import {
  getContexts,
  getProjects,
  getTasks,
} from 'selectors/tasks'

import {
  getUserInfo
} from 'selectors/user'

const mapStateToProps = (state) => {
  return {
    app: state.app,
    contexts: getContexts(state),
    path: _.get(state, 'router.locationBeforeTransitions.pathname'),
    projects: getProjects(state),
    tasks: getTasks(state),
    user: getUserInfo(state),
  }
}

const mapActionCreators = {
  contextsRequested,
  projectsRequested,
  signoutUser,
  tasksRequested,
  toggleSidebar
}

class Sidebar extends React.Component {
  static propTypes = {
    path: PropTypes.string.isRequired
  }

  renderHiddenSidebar () {
    return (
      <div className="ui text menu">
        <div className="ui container">
          <a
            className="launch icon item"
            onClick={this.props.toggleSidebar}
          >
            <i className="content icon"></i>
          </a>
          <a
            className="item"
          >
            tttaskd
          </a>
        </div>
      </div>
    )
  }

  isActive (key) {
    return key == this.props.path
  }

  renderSidebar () {
    const {
      contexts,
      projects,
      signoutUser,
    } = this.props

    const loggedIn = !!this.props.user

    return (
      <div>
        <div
          className={'ui left vertical sticky menu fixed top large-text ' + classes.sidebar}
          ref='sidebar'
        >
          <div className='item'>
            <div className='header'>
              <i
                className={classes.closeIcon + " close layout icon"}
                onClick={this.props.toggleSidebar}
              />
              tttaskd
            </div>
            <div className='menu'>
              <Link
                className={cx('item', { active: this.isActive('/tasks/inbox') })}
                to='/tasks/inbox'>
                Inbox
              </Link>
              <Link
                className={cx('item', { active: this.isActive('/tasks') })}
                to='/tasks'>
                Tasks
              </Link>
              <Link
                className={cx('item', { active: this.isActive('/tasks/overdue') })}
                to='/tasks/overdue'>
                Overdue
              </Link>
              <Link
                className={cx('item', { active: this.isActive('/tasks/flagged') })}
                to='/tasks/flagged'>
                Flagged
              </Link>
              <Link
                className={cx('item', { active: this.isActive('/tasks/completed') })}
                to='/tasks/completed'>
                Completed
              </Link>
            </div>
          </div>

          <div className='item'>
            <div className='header'>
              <Link
                className={cx(classes.headerLink, { active: this.isActive('/projects') })}
                to='/projects'>
                Projects
              </Link>
            </div>
            <div className='menu'>
              {projects.map(project =>
                <Link
                  className={cx('item', { active: this.isActive(`/projects/${project.id}`) })}
                  key={project.id}
                  to={`/projects/${project.id}`}>
                  {project.name}
                </Link>
              )}
            </div>
          </div>

          <div className='item'>
            <div className='header'>
              <Link
                className={cx(classes.headerLink, { active: this.isActive('/contexts') })}
                to='/contexts'>
                Contexts
              </Link>
            </div>
            <div className='menu'>
              {contexts.map(context =>
                <Link
                  className={cx('item', { active: this.isActive(`/contexts/${context.id}`) })}
                  key={context.id}
                  to={`/contexts/${context.id}`}>
                  {context.name}
                </Link>
              )}
            </div>
          </div>

          <div className='item'>
            <div className='header'>Account</div>

            <div className='menu'>
              {!loggedIn && (
                <Link to='/log_in' className='item'>
                  Log in
                </Link>
              )}

              {!loggedIn && (
                <Link to='/sign_up' className='item'>
                  Sign up
                </Link>
              )}

              {loggedIn && (
                <a
                  className='item'
                  onClick={signoutUser}
                >
                  Sign out
                </a>
              )}
            </div>
          </div>

          <div className='item'>
            <small><code>Version {versionSha}</code></small>
          </div>
        </div>
      </div>
    )
  }

  render () {
    const { app } = this.props
    const sidebarExpanded = app.get('sidebarExpanded')
    return sidebarExpanded ? this.renderSidebar() : this.renderHiddenSidebar()
  }
}

export default connect(mapStateToProps, mapActionCreators)(Sidebar)

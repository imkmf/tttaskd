import React, { Component } from 'react'

import _ from 'lodash'

import { Link } from 'react-router'
import Text from './shared/Text'

import pluralize from 'pluralize'

class Project extends React.Component {
  render () {
    const {
      project,
      tasks,
    } = this.props

    const tasksForDisplay = tasks.filter(t => !t.completed)

    return (
      <div>
        <div className='ui grid raised segment'>
          <div className='twelve wide column'>
            <h4>
              <Link to={`/projects/${project.id}`}>
                <Text text={project.name} />
              </Link>
              {tasksForDisplay.size ? pluralize('task', tasksForDisplay.size, true) : 'No tasks'}
            </h4>
          </div>
        </div>
      </div>
    )
  }
}

export default Project

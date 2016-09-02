import React, { Component } from 'react'

import _ from 'lodash'
import pluralize from 'pluralize'

import Project from 'components/Project'

class Projects extends React.Component {
  render () {
    const {
      projects,
      tasks,
    } = this.props

    return (
      <div>
        <h1 className="ui header">
          <div className="content">
            {projects.size ? pluralize('project', projects.size, true) : 'No projects'}
          </div>
        </h1>

        {projects.map(( project, index ) => {
          const tasksForProject = tasks.filter(t => t.project_id == project.id)

          return <Project
            key={index}
            project={project}
            tasks={tasksForProject}
          />
        })}
      </div>
    )
  }
}

export default Projects

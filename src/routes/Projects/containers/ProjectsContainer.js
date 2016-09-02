import React, { Component } from 'react'

class ProjectsContainer extends React.Component {
  render () {
    return <div>{React.cloneElement(this.props.children, ...this.props)}</div>
  }
}

export default ProjectsContainer

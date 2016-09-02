import React from 'react'

class TasksContainer extends React.Component {
  render () {
    return (
      <div>
        {React.cloneElement(this.props.children, ...this.props)}
      </div>
    )
  }
}

export default TasksContainer

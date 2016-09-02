import React, { Component } from 'react'

class ContextsContainer extends React.Component {
  render () {
    return <div>{React.cloneElement(this.props.children, ...this.props)}</div>
  }
}

export default ContextsContainer

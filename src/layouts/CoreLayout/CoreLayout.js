import React, { Component } from 'react'
import { connect } from 'react-redux'

import 'styles/core.scss'

class CoreLayout extends React.Component {
  render () {
    const { location } = this.props
    const { pathname } = location

    if (pathname && ['/log_in', '/sign_up'].includes(pathname)) {
      return (
        <div id='account'>
          {this.props.children}
        </div>
      )
    } else {
      return (
        <div className='ui container'>
          {this.props.children}
        </div>
      )
    }
  }
}

export default CoreLayout

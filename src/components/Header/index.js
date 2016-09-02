import React, { Component } from 'react'

class Header extends Component {
  render () {
    return (
      <div className="ui fixed text main menu">
        <div className="ui container">
          <a className="launch icon item">
            <i className="content icon"></i>
          </a>
        </div>
      </div>
    )
  }
}

export default Header

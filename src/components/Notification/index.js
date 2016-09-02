import React, { Component } from 'react'
import classes from './Notification.scss'
import _ from 'lodash'

class Notification extends Component {
  constructor (...args) {
    super(...args)
    this.close = this.close.bind(this)
  }

  close () {
    const notification = this.refs.notification
    $(notification).transition('fade')
    _.delay(this.props.removeNotification, 1500, this.props.notification)
  }

  componentDidMount () {
    _.delay(this.close, 3000)
  }

  typeForNotification (type) {
    var resolved
    switch (type) {
      case 'error':
        resolved = 'negative'
        break;
      case 'warning':
        resolved = 'warning'
        break;
      case 'alert':
        resolved = 'warning'
        break;
      default:
        resolved = 'info'
    }

    return resolved
  }

  render () {
    const { notification, removeNotification } = this.props
    const type = this.typeForNotification(notification.type)

    return (
      <div className={'ui floating message ' + type} ref='notification'>
        <i className="close icon" onClick={this.close}></i>
        <div className={'header ' + classes.headerPad}>
          {notification.title}
        </div>
        {notification.subtitle}
      </div>
    )
  }
}

export default Notification

import React, { Component, PropTypes } from 'react'
import _ from 'lodash'
import moment from 'moment'

const BasicDate = (props) => (
  <span className={props.classes}>{props.date}</span>
)

BasicDate.propTypes = {
  classes: PropTypes.string,
  date: PropTypes.string,
  type: PropTypes.string
}

const RelativeDate = (props) => (
  <span className={props.classes}>{moment(props.date).fromNow()}</span>
)

RelativeDate.propTypes = {
  classes: PropTypes.string,
  date: PropTypes.string,
  type: PropTypes.string
}

class Date extends Component {
  constructor (...args) {
    super(...args)
    this.state = {
      key: Math.random(),
      updating: true,
    }
    this.updateDate = this.updateDate.bind(this)
  }

  componentDidMount () {
    this.timer = setInterval(this.updateDate, 1000 * 5)
  }

  componentWillUnmount () {
    clearInterval(this.timer)
  }

  updateDate () {
    this.setState({ key: Math.random() })
  }

  render () {
    const { key } = this.state
    const { type } = this.props
    if (type === 'relative') {
      return <RelativeDate {...this.props} key={key} />
    } else {
      return <BasicDate {...this.props} key={key} />
    }
  }
}

Date.propTypes = {
  classes: PropTypes.string,
  date: PropTypes.string,
  type: PropTypes.string
}

export default Date

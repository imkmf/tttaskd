import React from 'react'
import classes from './Taskbar.scss'

class Taskbar extends React.Component {
  constructor(...args) {
    super(...args)
    this.onInputChange = this.onInputChange.bind(this)
  }

  onInputChange () {
    const { onChange } = this.props
    const input = this.refs.input
    onChange(input.value)
  }

  render () {
    const {
      filter,
      hideTaskbar
    } = this.props
    return (
      <div>
        {!hideTaskbar &&
          <div className="ui icon input">
            <input
              type="text"
              placeholder="Search..."
              onChange={this.onInputChange}
              ref='input'
              value={filter}
            />
            <i className="circular search link icon"></i>
          </div>
        }
      </div>
    )
  }
}

export default Taskbar


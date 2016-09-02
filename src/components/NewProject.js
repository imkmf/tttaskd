import React from 'react'
import { reduxForm } from 'redux-form'
import domOnlyProps from 'lib/domOnlyProps'

export const fields = [ 'name' ]

class NewProject extends React.Component {
  constructor(...args) {
    super(...args)
    this.expand = this.expand.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  expand () {
    $(this.refs.modal).modal('toggle')
  }

  handleSubmit (payload) {
    this.props.handleSubmit(payload)
    this.expand()
  }

  render () {
    const {
      fields: { name },
      handleSubmit,
    } = this.props

    const canSubmit = name

    return (
      <span>
        <button className="ui labeled icon button" onClick={this.expand}>
          <i className="add icon"></i> Add Project
        </button>

        <div className='ui modal' ref='modal'>
          <div className='header'>
            New project
          </div>

          <div className='content'>
            <form className='ui form' onSubmit={this.handleSubmit}>
              <div className='field'>
                <label>Project name</label>
                <input
                  placeholder="Project Name"
                  type="text"
                  {...domOnlyProps(name)}
                />
              </div>
              <button
                className='ui button'
                disabled={!canSubmit}
                onClick={this.handleSubmit}
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </span>
    )
  }
}

NewProject = reduxForm({
  form: 'newProject',
  fields
})(NewProject)

export default NewProject

import React, { Component } from 'react'
import { connect } from 'react-redux'

import _ from 'lodash'

import NewContext from 'components/NewContext'
import NewProject from 'components/NewProject'
import NewTask from 'components/NewTask'

export default class FormContainer extends Component {
  render () {
    const {
      contextCreated,
      contexts,
      projects,
      projectCreated,
      taskCreated
    } = this.props

    return (
      <div className='ui stackable four column grid'>
        <NewTask
          contexts={contexts}
          onSubmit={taskCreated}
          projects={projects}
        />

        <NewContext
          onSubmit={contextCreated}
        />

        <NewProject
          onSubmit={projectCreated}
        />
      </div>
    )
  }
}

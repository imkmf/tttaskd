import React, { Component } from 'react'
import { connect } from 'react-redux'
import { reduxForm } from 'redux-form'
import { Link } from 'react-router'

import _ from 'lodash'

import emailValidator from 'email-validator'

import {
  createUser
} from 'actions/user'

import {
  getUser
} from 'selectors/user'

import classes from './SignUpContainer.scss'

const mapStateToProps = ( state ) => ({
  user: getUser(state)
})

const mapActionCreators = {
  createUser
}

// Client side validation
function validate(values) {
  const errors = {};
  if (!values.email || values.email.trim() === '') {
    errors.email = 'Enter an email';
  }
  if (values.email) {
    if (values.email.trim().length > 0) {
      if (!emailValidator.validate(values.email.trim())) {
        errors.email = 'Enter a valid email'
      }
    }
  }
  if (!values.password || values.password.trim() === '') {
    errors.password = 'Enter password';
  }

  return errors;
}

class SignUpForm extends React.Component {
  render () {
    const {
      fields: { email, password },
      handleSubmit,
      submitting,
      submittedUserError
    } = this.props

    let emailError, passwordError
    if (submittedUserError) {
      emailError = submittedUserError.email
      passwordError = submittedUserError.password
    }

    let userError
    if (submittedUserError) {
      userError = submittedUserError.user
    }
    const canSubmit = email.value.length && password.value.length && !submitting

    return (
      <form className='ui large form' onSubmit={handleSubmit}>
        {userError ? <div class="ui error message">{userError[0]}</div> : ''}

        <div className='field'>
          <div className="ui left icon input">
            <i className="user icon"></i>
            <input
              id='email'
              placeholder='steve@apple.com'
              required
              type='text'
              {...email}
            />
          </div>
          {email.touched ? <div className='ui error message'>{email.error}</div> : ''}
        </div>

        <div className='field'>
          <div className="ui left icon input">
            <i className="lock icon"></i>
            <input
              id='password'
              placeholder='password'
              required
              type='password'
              {...password}
            />
          </div>
          {password.touched ? <div className='ui error message'>{password.error}</div> : ''}
        </div>

        <button
          className='ui fluid large teal submit button'
          disabled={!canSubmit}
          onClick={handleSubmit}
        >
          Sign up
        </button>
      </form>
    )
  }
}

SignUpForm = reduxForm({
  form: 'signUpForm',
  fields: ['email', 'password'],
  validate
})(SignUpForm);

class SignUpContainer extends React.Component {
  constructor (...args) {
    super(...args)
    this.onSubmit = this.onSubmit.bind(this)
  }

  onSubmit (payload) {
    this.props.createUser(payload)
  }

  render () {
    const {
      createUser,
      user
    } = this.props

    const submittedUserError = user.get('userCreationError')

    return (
      <div className="ui middle aligned center aligned grid">
        <div className="column">
          <h2 className="ui teal header">
            <div className="content">
              Sign up
            </div>
          </h2>

          <SignUpForm
            onSubmit={this.onSubmit}
            submittedUserError={submittedUserError ? submittedUserError.toJS() : null}
          />

          <div className="ui message">
            <Link to='/log_in'>
              Already have an account?
            </Link>
          </div>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapActionCreators)(SignUpContainer)


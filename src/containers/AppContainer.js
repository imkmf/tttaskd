import React, { PropTypes } from 'react'
import { Router } from 'react-router'
import { Provider } from 'react-redux'

import mixpanel from 'mixpanel-browser'

class AppContainer extends React.Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    routes: PropTypes.object.isRequired,
    routerKey: PropTypes.number,
    store: PropTypes.object.isRequired
  }

  componentDidMount () {
    // UPDATE
    mixpanel.init('<mixpanel_key>', {
      api_host: "https://api.mixpanel.com"
    })
    console.debug('mixpanel initialized')
  }

  render () {
    const { history, routes, routerKey, store } = this.props

    return (
      <Provider store={store}>
        <Router history={history} children={routes} key={routerKey} />
      </Provider>
    )
  }
}

export default AppContainer

import mixpanel from 'mixpanel-browser'

const trackEvent = (action, options) => {
  return new Promise((resolve, _) => {
    mixpanel.track(action, options, response => resolve(response))
  })
}

export default trackEvent

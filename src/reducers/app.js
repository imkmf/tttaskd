import { List, Map } from 'immutable'

import types from 'actions/types'

const ACTION_HANDLERS = {
  [types.TOGGLE_SIDEBAR]: (state, action) => state.set('sidebarExpanded', !state.get('sidebarExpanded'))
}

const initialState = Map({
  sidebarExpanded: false
})

export default function appReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}

import { createSelector } from 'reselect'
export const getUser = (state) => state.user
export const getUserInfo = createSelector(
  getUser,
  (userReducer) => userReducer.get('user')
)

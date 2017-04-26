import { createFirebaseListener } from './firebaseHelpers'
import { getFirebasePath } from '../actionHelpers'

export const registerUsersDataListener = () => (
	(dispatch, getState) => createFirebaseListener(dispatch, getState, 'users', getFirebasePath('users'))
)

export const registerGroupsDataListener = () => (
	(dispatch, getState) => createFirebaseListener(dispatch, getState, 'groups', getFirebasePath('groups'))
)

export const registerBranchesDataListener = () => (
	(dispatch, getState) => createFirebaseListener(dispatch, getState, 'branches', getFirebasePath('branches'))
)

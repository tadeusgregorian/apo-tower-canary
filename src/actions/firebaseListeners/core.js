import { createFirebaseListener } from './firebaseHelpers'

export const registerUsersDataListener = () => 		(dispatch, getState) => createFirebaseListener(dispatch, getState, 'users', 'users')
export const registerGroupsDataListener = () => 	(dispatch, getState) => createFirebaseListener(dispatch, getState, 'groups', 'groups')
export const registerBranchesDataListener = () =>	(dispatch, getState) => createFirebaseListener(dispatch, getState, 'branches', 'branches')

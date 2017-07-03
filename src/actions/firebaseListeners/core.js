import FBInstance from '../../firebaseInstance'
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

export const checkClientDate = () => (dispatch) => {
	FBInstance.database().ref(".info/serverTimeOffset").on('value', snap => {
		const offsetTooBig = Math.abs(snap.val()) > (1000 * 60 * 60 * 3) // if difference to real time is less than 3 hours

		offsetTooBig ? dispatch({type: 'CLIENT_DATE_INCORRECT'}) : dispatch({type: 'CLIENT_DATE_CORRECT'})
	})
}

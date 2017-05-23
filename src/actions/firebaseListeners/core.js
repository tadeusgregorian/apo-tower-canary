import FBInstance from '../../firebaseInstance'
import { createFirebaseListener } from './firebaseHelpers'
import { getFirebasePath } from '../actionHelpers'
import { startNewDayChecker } from 'helpers'
import moment from 'moment'

export const registerUsersDataListener = () => (
	(dispatch, getState) => createFirebaseListener(dispatch, getState, 'users', getFirebasePath('users'))
)

export const registerGroupsDataListener = () => (
	(dispatch, getState) => createFirebaseListener(dispatch, getState, 'groups', getFirebasePath('groups'))
)

export const registerBranchesDataListener = () => (
	(dispatch, getState) => createFirebaseListener(dispatch, getState, 'branches', getFirebasePath('branches'))
)

export const synchronizeClientTime = () => (dispatch) => {
	FBInstance.database().ref(".info/serverTimeOffset").on('value', snap => {
	  const offset = snap.val()
		const correctTime = +new Date() + offset

		if (Math.abs(offset) < (1000 * 60 * 10)){
			dispatch({type: 'CLIENT_TIME_CORRECT'})
			startNewDayChecker()
		} else {
			moment.now = () => correctTime
			startNewDayChecker()
			dispatch({type: 'TASKS_SET_CURRENT_DAY', payload: parseInt(moment().format('YYYYMMDD'), 10) })
			dispatch({type: 'CLIENT_TIME_SYNCHRONIZED'})
		}
	})
}

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

		// for testing reasons:
		// const addTime = ( 1000 * 60 * 60 * 24 ) * 4
		// moment.now = () => (+new Date() + addTime)
		// dispatch({type: 'TASKS_SET_CURRENT_DAY', payload: parseInt(moment().format('YYYYMMDD'), 10) })
		// dispatch({type: 'CLIENT_TIME_SYNCHRONIZED'})
		// return
		// testing part ends here

		if (Math.abs(offset) < (1000 * 60 * 10)){ // if difference to real time is less than 10 min
			dispatch({type: 'CLIENT_TIME_CORRECT'})
			startNewDayChecker()
		} else {
			moment.now = () => (+new Date() + offset)
			startNewDayChecker()
			dispatch({type: 'TASKS_SET_CURRENT_DAY', payload: parseInt(moment().format('YYYYMMDD'), 10) })
			dispatch({type: 'CLIENT_TIME_SYNCHRONIZED'})
		}
	})
}

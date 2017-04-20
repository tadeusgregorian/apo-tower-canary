import FBInstance from '../../firebaseInstance'
import { createFirebaseListener } from './firebaseHelpers';
import { getFirebasePath } from '../actionHelpers'

export const setRepeatingTasksListener = () => {
	return (dispatch, getState) => {
		createFirebaseListener(dispatch, getState, 'repeatingTasks', getFirebasePath('repeatingTasks'))
	}
}

export const setSingleTasksListener = () => {
	return (dispatch, getState) => {
		const date = getState().ui.taskManager.currentDay
		const dbPath = getFirebasePath('singleTasks')
		const queryRef = FBInstance.database().ref(dbPath).orderByChild("onetimerDate").equalTo(date)
		createFirebaseListener(dispatch, getState, 'singleTasks', dbPath, queryRef)

		const dbPath_checked = getFirebasePath('checked')
		const queryRef_checked = FBInstance.database().ref(dbPath_checked).orderByChild("taskDate").equalTo(date)
		createFirebaseListener(dispatch, getState, 'checked', dbPath_checked, queryRef_checked)
	}
}

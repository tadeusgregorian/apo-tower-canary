import FBInstance from '../../firebaseInstance'
import { createFirebaseListener } from './firebaseHelpers';

export const setRepeatingTasksListener = () => {
	return (dispatch, getState) => {
		const dbPath = 'taskManager/branches/' + getState().core.selectedBranch + '/tasks/repeating'
		createFirebaseListener(dispatch, getState, 'repeatingTasks', dbPath)
	}
}

export const setSingleTasksListener = () => {
	return (dispatch, getState) => {
		const date = getState().ui.taskManager.currentDay
		const dbPath = 'taskManager/branches/' + getState().core.selectedBranch + '/tasks/single'
		const queryRef = FBInstance.database().ref(dbPath).orderByChild("onetimerDate").equalTo(date)
		createFirebaseListener(dispatch, getState, 'singleTasks', dbPath, queryRef)

		const dbPath_checked = 'taskManager/branches/' + getState().core.selectedBranch + '/checked'
		const queryRef_checked = FBInstance.database().ref(dbPath_checked).orderByChild("taskDate").equalTo(date)
		createFirebaseListener(dispatch, getState, 'checked', dbPath_checked, queryRef_checked)
	}
}

import FBInstance from '../../firebaseInstance'
import { createFirebaseListener } from './firebaseHelpers';

export const setRepeatingTasksListener = () => {
	return (dispatch, getState) => {
		const dbPath = 'taskManager/branches/' + getState().core.selectedBranch.ID + '/tasks/repeating'
		createFirebaseListener(dispatch, getState, 'repeatingTasks', dbPath)
	}
}

export const setSingleTasksListener = (date) => {
	return (dispatch, getState) => {
		const dbPath = 'taskManager/branches/' + getState().core.selectedBranch.ID + '/tasks/single'
		const queryRef = FBInstance.database().ref(dbPath).orderByChild("onetimerDate").equalTo(date)
		createFirebaseListener(dispatch, getState, 'singleTasks', dbPath, queryRef)

		const dbPath_checked = 'taskManager/branches/' + getState().core.selectedBranch.ID + '/checked'
		const queryRef_checked = FBInstance.database().ref(dbPath_checked).orderByChild("taskDate").equalTo(date)
		createFirebaseListener(dispatch, getState, 'checked', dbPath_checked, queryRef_checked)
	}
}

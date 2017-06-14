import FBInstance from '../../firebaseInstance'
import { createFirebaseListener } from './firebaseHelpers';
import { getFirebasePath } from '../actionHelpers'
import { updateUndoneTasks } from '../undoneTasksUpdater'
import { getTodaySmart } from 'helpers'


const aWhileAgo = 20170301 // we start here ( as late as possible , so initial calculation of undoneTasks isnt going to far )

export const setRepeatingTasksListener = () => {
	return (dispatch, getState) => {
		createFirebaseListener(dispatch, getState, 'repeatingTasks', getFirebasePath('repeatingTasks'))
		.then(res => createFirebaseListener(dispatch, getState, 'lastUTUpdate', getFirebasePath('lastUTUpdate'), null, true))
		.then(lastUpdate => lastUpdate !== getTodaySmart() && updateUndoneTasks(lastUpdate || aWhileAgo)(dispatch, getState))
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

export const setUndoneTasksListener = () => {
	return (dispatch, getState) =>
		createFirebaseListener(dispatch, getState, 'undoneTasks', getFirebasePath('undoneTasks'))
}

export const setLastUTUpdateListener = () => {
	return (dispatch, getState) =>
		createFirebaseListener(dispatch, getState, 'lastUTUpdate', getFirebasePath('lastUTUpdate'), null, true)
}

export const setTaskManagerListeners = () => {
	return (dispatch, getState) => {
		console.log('who calls this ?')
		getState().taskManager.repeatingTasksDataStatus 	=== 'NOT_REQUESTED' && setRepeatingTasksListener()(dispatch, getState)
		getState().taskManager.singleTasksDataStatus 			=== 'NOT_REQUESTED' && setSingleTasksListener()(dispatch, getState)
		getState().taskManager.undoneTasksDataStatus 			=== 'NOT_REQUESTED' && setUndoneTasksListener()(dispatch, getState)
	}
}

export const refreshTaskManagerListeners = () => {
	return (dispatch, getState) => {
		setRepeatingTasksListener()(dispatch, getState)
		setSingleTasksListener()(dispatch, getState)
		setUndoneTasksListener()(dispatch, getState)
	}
}

export const setAllSingleTasksListener = () => ((dispatch, getState) => {
	const dbPath = getFirebasePath('singleTasks')
	const queryRef = FBInstance.database().ref(dbPath).orderByChild("originalShiftedTask").endAt(0)
	createFirebaseListener(dispatch, getState, 'allSingleTasks', dbPath, queryRef)
})

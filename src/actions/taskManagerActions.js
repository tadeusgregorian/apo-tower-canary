import FBInstance from '../firebaseInstance';
import { createShortGuid } from 'helpers';
import { getFirebasePath } from './actionHelpers'
import moment from 'moment';

const getCategory = (task) => {return (task.onetimerDate ? 'singleTasks' : 'repeatingTasks')}

//shiftedTo and taskObj are optional
export function checkTask(branchID, taskID, taskDate, checkType, userID, shiftedTo, taskObj) {
	const guid = createShortGuid()
	const checked = {
		ID: guid,
		taskID: taskID,
		taskDate: taskDate,
		shiftedTo: shiftedTo || null, //null creates no db-entry in Firebase)
		date: moment().toISOString(),
		by: userID,
		type: checkType
	}
	let updates = {};
	updates['taskManager/branches/'+branchID+'/checked/'+guid] = checked
	updates['taskManager/branches/'+branchID+'/checkedMini/'+taskDate+'/'+taskID] = 1
	if(checkType == 'shifted') {
		const newShiftedTask = { ...taskObj, ID: guid, onetimerDate: shiftedTo, originalShiftedTask: {ID: taskID, date: taskDate} }
		updates['taskManager/branches/'+branchID+'/tasks/single/'+guid] = newShiftedTask
	}
	FBInstance.database().ref().update(updates)
}

export function uncheckTask(branchID, taskID, taskDate, checkedID) {
	let updates = {};
	updates['taskManager/branches/'+branchID+'/checked/'+checkedID] = null
	updates['taskManager/branches/'+branchID+'/checkedMini/'+taskDate+'/'+taskID] = null
	FBInstance.database().ref().update(updates)
}


export function updateTask(task, branchID) {
	FBInstance.database().ref('tasks').child(task.ID).set(task);
}

export function createTask(task) {
	return(dispatch, getState) => {
		const ref = FBInstance.database().ref(getFirebasePath(getCategory(task), getState))
		ref.child(task.ID).set(task)
		}
}


export const editAndCreateTask = (oldTask, newTask) => {
	return(dispatch, getState) => {
		let updates = {}
		updates[getFirebasePath('repeatingTasks', getState)+'/'+oldTask.ID+'/endDate'] = oldTask.endDate
		updates[getFirebasePath('repeatingTasks', getState)+'/'+oldTask.ID+'/isDuplicate'] = true
		updates[getFirebasePath('singleTasks', getState)+'/'+newTask.ID] = newTask
		FBInstance.database().ref().update(updates)
	}
}

export function deleteTask(task) {
	return (dispatch, getState) => {
		FBInstance.database().ref(getFirebasePath(getCategory(task), getState)).child(task.ID).remove()
	}
}

export const endRepeatingTask = (task, endDate) => {
	return (dispatch, getState) => {
		let updates = {}
		updates[getFirebasePath('repeatingTasks', getState) + task.ID + '/endDate'] = endDate
		FBInstance.database().ref().update(updates)
	}
}

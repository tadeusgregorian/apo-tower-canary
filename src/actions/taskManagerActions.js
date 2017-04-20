import FBInstance from '../firebaseInstance';
import { createShortGuid } from 'helpers';
import { getFirebasePath } from './actionHelpers'
import moment from 'moment';

const getCategory = (task) => {return (task.onetimerDate ? 'singleTasks' : 'repeatingTasks')}

//shiftedTo and taskObj are optional
export function checkTask(taskID, taskDate, checkType, userID, shiftedTo, taskObj) {
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
	updates[getFirebasePath('checked')+guid] = checked
	updates[getFirebasePath('checkedMini')+taskDate+'/'+taskID] = 1
	if(checkType == 'shifted') {
		const newShiftedTask = {
			...taskObj,
			ID: guid,
			onetimerDate: shiftedTo,
			originalShiftedTask: {ID: taskID, date: taskDate}
		}
		updates[getFirebasePath('singleTasks')+guid] = newShiftedTask
	}
	FBInstance.database().ref().update(updates)
}

export function uncheckTask(taskID, taskDate, checkedID) {
	let updates = {}
	updates[getFirebasePath('checked')+checkedID] = null
	updates[getFirebasePath('checkedMini')+taskDate+'/'+taskID] = null
	FBInstance.database().ref().update(updates)
}

export function createTask(task) {
	const ref = FBInstance.database().ref(getFirebasePath(getCategory(task)))
	ref.child(task.ID).set(task)
}


export const editAndCreateTask = (oldTask, newTask) => {
	let updates = {}
	updates[getFirebasePath('repeatingTasks') + oldTask.ID+'/endDate'] = oldTask.endDate
	updates[getFirebasePath('repeatingTasks') + oldTask.ID+'/isDuplicate'] = true
	updates[getFirebasePath('singleTasks') + newTask.ID] = newTask
	FBInstance.database().ref().update(updates)
}

export function deleteTask(task) {
	FBInstance.database().ref(getFirebasePath(getCategory(task))).child(task.ID).remove()
}

export const endRepeatingTask = (task, endDate) => {
	let updates = {}
	updates[getFirebasePath('repeatingTasks') + task.ID + '/endDate'] = endDate
	FBInstance.database().ref().update(updates)
}

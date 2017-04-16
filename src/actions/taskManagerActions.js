import FBInstance from '../firebaseInstance';
import { createShortGuid } from 'helpers';
import moment from 'moment';

const getCategory = (task) => {return (task.onetimerDate ? 'single' : 'repeating')}

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

export function createTask(task, branchID) {
	const ref 			= FBInstance.database().ref('taskManager/branches/'+branchID+'/tasks/'+getCategory(task))
	ref.child(task.ID).set(task)
}

export const editAndCreateTask = (oldTask, newTask, branchID) => {
	let updates = {}
	updates['taskManager/branches/'+branchID+'/tasks/'+getCategory(oldTask)+'/'+oldTask.ID+'/endDate'] = oldTask.endDate
	updates['taskManager/branches/'+branchID+'/tasks/'+getCategory(oldTask)+'/'+oldTask.ID+'/isDuplicate'] = true
	updates['taskManager/branches/'+branchID+'/tasks/'+getCategory(newTask)+'/'+newTask.ID] = newTask
	FBInstance.database().ref().update(updates)
}

export function deleteTask(taskID, category, branchID) {
	FBInstance.database().ref('taskManager/branches/'+branchID+'/tasks/'+category).child(taskID).remove();
}

export const endRepeatingTask = (taskID, endDate, branchID) => {
	let updates = {}
	updates['taskManager/branches/'+branchID+'/tasks/repeating/'+taskID+'/endDate'] = endDate
	FBInstance.database().ref().update(updates)
}

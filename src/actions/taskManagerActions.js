import FBInstance from '../firebaseInstance';
import { createShortGuid } from 'helpers';
import { getFirebasePath } from './actionHelpers'
import moment from 'moment';

const today = parseInt(moment().format('YYYYMMDD'), 10)
const getCategory = (task) => {return (task.onetimerDate ? 'singleTasks' : 'repeatingTasks')}


export function checkTask(task, checkType, taskDate, shiftedTo = null) {
	return(dispatch, getState) => {
		// note: cant get task from store, because when checking task from checkbox, there is no taskObj in redux-store.
		const userID = getState().core.selectedUser

		const checkID = taskDate + task.ID
		const currentIsoTime = moment().toISOString()
		const checked = { ID: checkID, taskID: task.ID , taskDate, type: checkType,  by: userID, date: currentIsoTime}
		if(shiftedTo) checked['shiftedTo'] = shiftedTo
		let updates = {}
		updates[getFirebasePath('checked')+checkID] = checked
		updates[getFirebasePath('checkedMini')+taskDate+'/'+task.ID] = 1

		if(checkType === 'shifted') { // create a new single Task as a copy of the shifted Task
			const guid = createShortGuid()
			const newShiftedTask = { ...task, ID: guid, onetimerDate: shiftedTo, originalShiftedTask: {ID: task.ID, date: taskDate}}
			updates[getFirebasePath('singleTasks')+ guid] = newShiftedTask
		}

		//Update undoneTasks if task is in past
		if(taskDate < today){
			console.log(taskDate)
			console.log(task.ID)
		}
		if(taskDate < today) updates[getFirebasePath('undoneTasks') + taskDate + task.ID] = null

		FBInstance.database().ref().update(updates)
	}
}

export function uncheckTask(task, taskDate) {
	return(dispatch, getState) => {

		const checkID = taskDate + task.ID
		let updates = {}
		updates[getFirebasePath('checked')+checkID] = null
		updates[getFirebasePath('checkedMini')+taskDate+'/'+task.ID] = null
		if(taskDate < today) {
			updates[getFirebasePath('undoneTasks') + taskDate + task.ID] = {
				...task,
				ID: taskDate+task.ID,
				taskID: task.ID,
				taskDate: taskDate,
			}
		}
		FBInstance.database().ref().update(updates)
	}
}

export function createTask(taskObj) {
	const task = {...taskObj, ID: createShortGuid(), creationDate: moment().toISOString()}
	const ref = FBInstance.database().ref(getFirebasePath(getCategory(task)))
	ref.child(task.ID).set(task)
}

export const editAndCreateTask = (oldTask, newTask) => {
	let updates = {}
	updates[getFirebasePath('repeatingTasks') + oldTask.ID+'/endDate'] = oldTask.endDate
	updates[getFirebasePath('repeatingTasks') + oldTask.ID+'/isDuplicate'] = true
	updates[getFirebasePath('repeatingTasks') + newTask.ID] = newTask
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

export const addReplacement = (taskID, replacedUserID , replacerID) => {
	const ref = FBInstance.database().ref(getFirebasePath('repeatingTasks')).child(taskID + '/assignedUsers/' + replacedUserID)
	ref.set(replacerID)
}

export const removeReplacement = (taskID, replacedUserID) => {
	// if there is no replacement it looks like: .assignedUsers.replacedUserID: 1
	// if there is a  replacement it looks like: .assignedUsers.replacedUserID: replacerUserID
	const ref = FBInstance.database().ref(getFirebasePath('repeatingTasks')).child(taskID + '/assignedUsers/' + replacedUserID)
	ref.set(1)
}

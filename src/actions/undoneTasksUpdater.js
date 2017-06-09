import FBInstance from '../firebaseInstance'
import { getFirebasePath } from './actionHelpers'
import { getSmartDayRange, getTodaySmart, getYesterdaySmart } from 'helpers'
import { getTasksForDay } from 'selectors/tasksDaySelector'
import _ from 'lodash'

const writeUndoneTasksToDB = (undoneTasksInRange) => {
	let updates = {[getFirebasePath('lastUTUpdate')]: getTodaySmart()}
	undoneTasksInRange.forEach(t => updates[getFirebasePath('undoneTasks') + t.ID] = t)
	FBInstance.database().ref().update(updates)
}

const getUndoneTasksInRange = (range, repeatingTasks, singleTasks, checkedMini) => {
	const tasksGrid = range.map(day => {
		const tasks = getTasksForDay(repeatingTasks, singleTasks, day)
		return tasks.map(t => ({
			...t,
			ID: day+t.ID,
			taskID: t.ID,
			taskDate: day,
		}))
	})

	const tasksFlat =  tasksGrid.reduce((acc, curr) => acc.concat(curr))
	return  tasksFlat.filter(t => !(checkedMini && checkedMini[t.taskDate] && checkedMini[t.taskDate][t.taskID]))
}

export const updateUndoneTasks = (lastUpdate) => {
	return (dispatch, getState) => {

		const singleTasksPath = getFirebasePath('singleTasks')
		const checkedMini 		= getFirebasePath('checkedMini')
		const singleTasksRef 	= FBInstance.database().ref(singleTasksPath).orderByChild("onetimerDate").startAt(lastUpdate).endAt(getYesterdaySmart()+'')
		const checkedMiniRef	= FBInstance.database().ref(checkedMini).orderByKey().startAt(lastUpdate+'').endAt(getYesterdaySmart()+'')

		singleTasksRef.once('value', tSnap => {
			checkedMiniRef.once('value', cSnap => {

				const repeatingTasks 	= getState().taskManager.repeatingTasks
				const singleTasks 		= [..._.values(tSnap.val())]
				const checkedMini 		= cSnap.val()

				//console.log(lastUpdate)
				const range = getSmartDayRange(lastUpdate, getYesterdaySmart())
				const undoneTasksInRange = getUndoneTasksInRange(range, repeatingTasks, singleTasks, checkedMini)
				writeUndoneTasksToDB(undoneTasksInRange)
			})
		})
	}
}

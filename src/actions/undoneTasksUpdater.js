import FBInstance from '../firebaseInstance'
import { getFirebasePath } from './actionHelpers'
import { getSmartDayRange } from 'helpers'
import { getTasksForDay } from 'selectors/tasksDaySelector'
import moment from 'moment'
import _ from 'lodash'

const yesterday =  parseInt(moment().subtract(1, 'day').format('YYYYMMDD'), 10)
const today = parseInt(moment().format('YYYYMMDD'), 10)

const writeUndoneTasksToDB = (undoneTasksInRange) => {
	let updates = {[getFirebasePath('lastUTUpdate')]: today}
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
		const singleTasksRef 	= FBInstance.database().ref(singleTasksPath).orderByChild("onetimerDate").startAt(lastUpdate).endAt(yesterday)
		const checkedMiniRef	= FBInstance.database().ref(checkedMini).orderByKey().startAt(lastUpdate+'').endAt(yesterday+'')

		singleTasksRef.once('value', tSnap => {
			checkedMiniRef.once('value', cSnap => {

				const repeatingTasks 	= getState().taskManager.repeatingTasks
				const singleTasks 		= [..._.values(tSnap.val())]
				const checkedMini 		= cSnap.val()

				//console.log(lastUpdate)
				const range = getSmartDayRange(lastUpdate, yesterday)
				const undoneTasksInRange = getUndoneTasksInRange(range, repeatingTasks, singleTasks, checkedMini)
				writeUndoneTasksToDB(undoneTasksInRange)
			})
		})
	}
}

import FBInstance from '../firebaseInstance'
import { getFirebasePath } from './actionHelpers'
import { getSmartDayRange } from 'helpers'
import { getTasksForDay } from 'selectors/tasksDaySelector'
import moment from 'moment'

const yesterday =  parseInt(moment().subtract(1, 'day').format('YYYYMMDD'))

export const updateUndoneTasks = (lastUpdate) => {
	return (dispatch, getState) => {

		const singleTasksPath = getFirebasePath('singleTasks')
		const checkedMini 		= getFirebasePath('checkedMini')
		const singleTasksRef 	= FBInstance.database().ref(singleTasksPath).orderByChild("onetimerDate").startAt(lastUpdate).endAt(yesterday)
		const checkedMiniRef	= FBInstance.database().ref(checkedMini).orderByKey().startAt(lastUpdate+'').endAt(yesterday+'')

		singleTasksRef.once('value', tSnap => {
			checkedMiniRef.once('value', cSnap => {
				const range = getSmartDayRange(lastUpdate, yesterday)
				const undoneTasksInRange = getUndoneTasksInRange(getState, range, tSnap)
			})
		})
	}
}

const getUndoneTasksInDay = (getState, range, singleTasks) => {
	const repeatingTasks = getState().taskManager.repeatingTasks
	console.log( getTasksForDay(repeatingTasks, singleTasks, ))
}

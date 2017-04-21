import { combineReducers } from 'redux'
import { createFirebaseReducer_array, createDataStatusReducer } from './reducerHelpers'

const repeatingTasks 				= createFirebaseReducer_array('repeatingTasks') // these are all repeatingTasks
const singleTasks 					= createFirebaseReducer_array('singleTasks') // these are the single tasks of today
const checked								= createFirebaseReducer_array('checked') // these are the checked of today

const repeatingTasksDataStatus  		= createDataStatusReducer('repeatingTasks')
const singleTasksDataStatus					= createDataStatusReducer('singleTasks')
const checkedDataStatus							= createDataStatusReducer('checked')

export default combineReducers({
	checked,
	singleTasks,
	repeatingTasks,
	checkedDataStatus,
	singleTasksDataStatus,
	repeatingTasksDataStatus
})

import { combineReducers } from 'redux'
import { createFirebaseReducer_array, createDataStatusReducer,  createFirebaseReducer_simple} from './reducerHelpers'

const repeatingTasks 				= createFirebaseReducer_array('repeatingTasks') // these are all repeatingTasks
const singleTasks 					= createFirebaseReducer_array('singleTasks') // these are the single tasks of today
const allSingleTasks 				= createFirebaseReducer_array('allSingleTasks') // these are all single tasks ( excluding shifted )
const checked								= createFirebaseReducer_array('checked') // these are the checked of today
const undoneTasks						= createFirebaseReducer_array('undoneTasks')
const lastUTUpdate					= createFirebaseReducer_simple('lastUTUpdate')

const repeatingTasksDataStatus  		= createDataStatusReducer('repeatingTasks')
const singleTasksDataStatus					= createDataStatusReducer('singleTasks')
const allSingleTasksDataStatus		= createDataStatusReducer('allSingleTasks')
const checkedDataStatus							= createDataStatusReducer('checked')
const undoneTasksDataStatus					= createDataStatusReducer('undoneTasks')
const lastUTUpdateDataStatus				= createDataStatusReducer('lastUTUpdate')

export default combineReducers({
	checked,
	singleTasks,
	repeatingTasks,
	allSingleTasks,
	undoneTasks,
	checkedDataStatus,
	lastUTUpdate,
	singleTasksDataStatus,
	repeatingTasksDataStatus,
	allSingleTasksDataStatus,
	undoneTasksDataStatus,
	lastUTUpdateDataStatus
})

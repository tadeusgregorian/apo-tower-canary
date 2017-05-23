import {combineReducers} from 'redux';
import moment from 'moment'

const currentDay = (state = parseInt(moment().format('YYYYMMDD'), 10), action) => {
	switch (action.type) {
	case 'TASKS_SET_CURRENT_DAY' : return action.payload
	default: return state
	}
}

const checkingTask = (state = null, action) => {
	switch (action.type) {
	case 'SET_CHECKING_TASK' 		: return action.payload
	case 'CLOSE_CHECKING_TASK' 	: return null
	default: return state
	}
}

const taskWizard = (state = null, action) => {
	switch (action.type) {
	case 'OPEN_ADD_TASK_WIZARD' 	: return 'add'
	case 'OPEN_EDIT_TASK_WIZARD' 	: return 'edit'
	case 'CLOSE_TASK_WIZARD' 			: return null
	default: return state
	}
}

const taskDetailsPopup = (state = null, action) => {
	switch (action.type) {
	case 'OPEN_TASK_DETAILS_POPUP' 		: return action.payload
	case 'CLOSE_TASK_DETAILS_POPUP'  	: return null
	default: return state
	}
}

const deleteTaskPopup = (state = null, action) => {
	switch (action.type) {
	case 'OPEN_DELETE_TASK_POPUP' 	: return action.payload
	case 'CLOSE_DELETE_TASK_POPUP'  : return null
	default: return state
	}
}

const undoneTasksModal = (state = null, action) => {
	switch (action.type) {
	case 'OPEN_UNDONDE_TASKS_MODAL' 	: return action.payload
	case 'CLOSE_UNDONDE_TASKS_MODAL'  : return null
	default: return state
	}
}


export default combineReducers({
	currentDay,
	checkingTask,
	taskWizard,
	taskDetailsPopup,
	deleteTaskPopup,
	undoneTasksModal
})

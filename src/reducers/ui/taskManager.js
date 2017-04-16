import {combineReducers} from 'redux';

const currentDay = (state = 0, action) => {
	switch (action.type) {
	case 'TASKS_SET_CURRENT_DAY' : return action.payload
	default: return state
	}
}

const checkingTask = (state = null, action) => {
	switch (action.type) {
	case 'SET_CHECKING_TASK' : return action.payload
	case 'CLOSE_CHECKING_TASK' : return null
	default: return state
	}
}

const taskWizard = (state = null, action) => {
	switch (action.type) {
	case 'OPEN_ADD_TASK_WIZARD' : return 'add'
	case 'OPEN_EDIT_TASK_WIZARD' : return 'edit'
	case 'CLOSE_TASK_WIZARD' : return null
	default: return state
	}
}

const currentWizardStep = (state = 0, action) => {
	switch (action.type) {
	case 'CLOSE_TASK_WIZARD' : return 0
	case 'OPEN_ADD_TASK_WIZARD' : return 0
	case 'OPEN_EDIT_TASK_WIZARD' : return 0
	case 'NEXT_WIZARD_STEP' : return state + 1
	case 'PREVIOUS_WIZARD_STEP' : return state - 1
	default: return state
	}
}

const operatingTask = (state = {}, action) => {
	switch (action.type) {
	case 'OPEN_EDIT_TASK_WIZARD' : return action.payload
	case 'EDIT_OPERATING_TASK' :  return { ...state, ...action.payload}
	case 'SET_OPERATING_TASK'  :  return action.payload
	case 'CLOSE_TASK_WIZARD' : return {}
	default: return state
	}
}

const taskDetailsPopup = (state = null, action) => {
	switch (action.type) {
	case 'OPEN_TASK_DETAILS_POPUP' :  return action.payload
	case 'CLOSE_TASK_DETAILS_POPUP'  :  return null
	default: return state
	}
}

const deleteTaskPopup = (state = null, action) => {
	switch (action.type) {
	case 'OPEN_DELETE_TASK_POPUP' :  return action.payload
	case 'CLOSE_DELETE_TASK_POPUP'  :  return null
	default: return state
	}
}


export default combineReducers({
	currentDay,
	checkingTask,
	taskWizard,
	currentWizardStep,
	operatingTask,
	taskDetailsPopup,
	deleteTaskPopup
})

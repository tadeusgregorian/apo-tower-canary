import {combineReducers} from 'redux';

const qmWizard = (state = null, action) => {
	switch (action.type) {
	case 'OPEN_ADD_QM_WIZARD' : return 'add'
	case 'OPEN_EDIT_QM_WIZARD' : return 'edit'
	case 'CLOSE_QM_WIZARD' : return null
	default: return state
	}
}

const currentWizardStep = (state = 0, action) => {
	switch (action.type) {
	case 'CLOSE_QM_WIZARD' : return 0
	case 'OPEN_ADD_QM_WIZARD' : return 0
	case 'OPEN_EDIT_QM_WIZARD' : return 0
	case 'NEXT_WIZARD_STEP' : return state + 1
	case 'PREVIOUS_WIZARD_STEP' : return state - 1
	default: return state
	}
}

const operatingQm = (state = {}, action) => {
	switch (action.type) {
	case 'OPEN_EDIT_QM_WIZARD' : return action.payload
	case 'EDIT_OPERATING_QM' :  return { ...state, ...action.payload}
	case 'SET_OPERATING_QM'  :  return action.payload
	case 'CLOSE_QM_WIZARD' : return {}
	default: return state
	}
}

export default combineReducers({
	qmWizard,
	currentWizardStep,
	operatingQm
})

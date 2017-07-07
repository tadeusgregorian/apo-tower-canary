import { simpleReducer } from '../reducerHelpers'
import {combineReducers} from 'redux';

const selectBranchDialog = simpleReducer({
	default: 										false,
	OPEN_SELECT_BRANCH_DIALOG: 	true,
	CLOSE_SELECT_BRANCH_DIALOG: false,
})

const adminPinDialog = (state = { isOpen: false }, action) => {
	switch (action.type) {
	case 'OPEN_ADMIN_PIN_DIALOG' 	: return { isOpen: true, mode: action.payload }
	case 'CLOSE_ADMIN_PIN_DIALOG' : return { isOpen: false }
	default: return state
	}
}

const confirmPopup = simpleReducer({
	default: 							null,
	OPEN_CONFIRM_POPUP: 	'PAYLOAD',
	CLOSE_CONFIRM_POPUP:	null
})

const introVideoPopup = (state = { isOpen: false }, action) => {
	switch (action.type) {
	case 'OPEN_INTROVIDEO_POPUP' 	: return { isOpen: true }
	case 'CLOSE_INTROVIDEO_POPUP' : 	return { isOpen: false }
	default: return state
	}
}

export default combineReducers({
	selectBranchDialog,
	adminPinDialog,
  confirmPopup,
	introVideoPopup
})

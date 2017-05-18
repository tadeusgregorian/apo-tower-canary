import { simpleReducer } from '../reducerHelpers'
import {combineReducers} from 'redux';

const selectBranchDialog = simpleReducer({
	default: 										false,
	OPEN_SELECT_BRANCH_DIALOG: 	true,
	CLOSE_SELECT_BRANCH_DIALOG: false,
})

const adminPinDialog = simpleReducer({
	default: 								false,
	OPEN_ADMIN_PIN_DIALOG: 	'PAYLOAD',
	CLOSE_ADMIN_PIN_DIALOG: false,
})

const confirmPopup = simpleReducer({
	default: 							null,
	OPEN_CONFIRM_POPUP: 	'PAYLOAD',
	CLOSE_CONFIRM_POPUP:	null
})

export default combineReducers({
	selectBranchDialog,
	adminPinDialog,
  confirmPopup
})

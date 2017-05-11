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

export default combineReducers({
	selectBranchDialog,
	adminPinDialog
})

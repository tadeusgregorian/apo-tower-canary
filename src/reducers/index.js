import {combineReducers} from 'redux';
import {
	users,
	groups,
	branches,
	usersDataStatus,
	groupsDataStatus,
	branchesDataStatus
} from './data';
import ui from './ui'
import taskManager from './taskManager'
import qmLetters from './qmLetters'
import firebaseListeners from './firebaseListeners'
import core from './core'
import auth from './auth'
import accountDetails from './accountDetails'


const rootReducer = combineReducers({
	data: combineReducers({
		branches,
		users,
		groups,
		dataStatus: combineReducers({usersDataStatus, groupsDataStatus, branchesDataStatus})
	}),
	core,
	auth,
	taskManager,
	qmLetters,
	ui,
	firebaseListeners,
	accountDetails
});

export default rootReducer

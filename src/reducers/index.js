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
import { selectedBranch, selectedUser, clientTimeSynchronization } from './core'
import auth from './auth'


const rootReducer = combineReducers({
	data: combineReducers({
		branches,
		users,
		groups,
		dataStatus: combineReducers({usersDataStatus, groupsDataStatus, branchesDataStatus})
	}),
	core: combineReducers({ selectedBranch, selectedUser, clientTimeSynchronization }),
	auth,
	taskManager,
	qmLetters,
	ui,
	firebaseListeners
});

export default rootReducer

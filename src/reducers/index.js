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
import taskManager from './taskManager';
import qmLetters from './qmLetters';
import firebaseListeners from './firebaseListeners'
import { selectedBranch, selectedUser } from './core';
import { authState, authMessage } from './auth'


const rootReducer = combineReducers({
	data: combineReducers({
		branches,
		users,
		groups,
		dataStatus: combineReducers({usersDataStatus, groupsDataStatus, branchesDataStatus})
	}),
	core: combineReducers({ selectedBranch, selectedUser}),
	auth: combineReducers({ authState, authMessage }),
	taskManager: taskManager,
	qmLetters: qmLetters,
	ui: ui,
	firebaseListeners: firebaseListeners
});

export default rootReducer;

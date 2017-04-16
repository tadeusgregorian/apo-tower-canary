import {combineReducers} from 'redux';
import {
	users,
	groups,
	isTryingToAuth,
	branches,
	usersDataStatus,
	groupsDataStatus,
	branchesDataStatus
} from './data';
import ui from './ui'
import taskManager from './taskManager';
import qmLetters from './qmLetters';
import firebaseListeners from './firebaseListeners'
import {busy, selectedBranch, selectedUser, adminLoggedIn} from './core';


const rootReducer = combineReducers({
	data: combineReducers({
		branches,
		users,
		groups,
		isTryingToAuth,
		dataStatus: combineReducers({usersDataStatus, groupsDataStatus, branchesDataStatus})
	}),
	core: combineReducers({busy, selectedBranch, selectedUser, adminLoggedIn}),
	taskManager: taskManager,
	qmLetters: qmLetters,
	ui: ui,
	firebaseListeners: firebaseListeners
});

export default rootReducer;

import { simpleReducer } from './reducerHelpers'
import { combineReducers } from 'redux'

const selectedBranch = (state = localStorage.apotowerbranch || null, action) => {
	switch (action.type) {
	case 'SELECT_BRANCH': { return action.payload }
	default: return state;
	}
}

const selectedUser = (state = null, action) => {
	if(action.type === 'SET_SELECTED_USER')console.log(action.type)
	if(action.type === 'ADMIN_LOGGED_IN')console.log(action.type)
	if(action.type === 'REMOVE_SELECTED_USER')console.log(action.type)

	switch (action.type) {
	case 'SET_SELECTED_USER'		: return action.payload
	case 'ADMIN_LOGGED_IN' 			: return action.payload
	case 'REMOVE_SELECTED_USER'	: return null
	default: return state
	}
}

const clientDateCorrect = simpleReducer({
	default: 										null,
	CLIENT_DATE_CORRECT: 				true,
	CLIENT_DATE_INCORRECT: 			false,
})

const clientDateChecked = simpleReducer({
	default: 										false,
	CLIENT_DATE_CORRECT: 				true,
	CLIENT_DATE_INCORRECT: 			true,
})

export default combineReducers({
	selectedBranch,
	selectedUser,
	clientDateCorrect,
	clientDateChecked
})

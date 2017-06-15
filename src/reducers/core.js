import { simpleReducer } from './reducerHelpers'

export const selectedBranch = (state = localStorage.apotowerbranch || null, action) => {
	switch (action.type) {
	case 'SELECT_BRANCH': { return action.payload }
	default: return state;
	}
}

export const selectedUser = (state = null, action) => {
	switch (action.type) {
	case 'SET_SELECTED_USER': return action.payload
	case 'REMOVE_SELECTED_USER': return null
	default: return state
	}
}

export const clientTimeSynchronization = simpleReducer({
	default: 										false,
	CLIENT_TIME_SYNCHRONIZED: 	'timeWasSynchronized',
	CLIENT_TIME_CORRECT: 				'notNecessaryTimeCorrect',
})

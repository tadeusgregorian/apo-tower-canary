import { simpleReducer } from './reducerHelpers'
import { combineReducers } from 'redux'


const authState = simpleReducer({
	default: 								null,
	USER_LOGGED_IN: 				'loggedIn',
	USER_LOGGED_OUT: 				'loggedOut',
	USER_IS_AUTHENTICATING: 'isAuthenticating'
})

const accountID = simpleReducer({
	USER_IS_AUTHENTICATING: null,
	USER_LOGGED_IN: 				'PAYLOAD',
	USER_LOGGED_OUT: 				null
})

const authMessage = simpleReducer({
	SET_AUTH_MESSAGE: 				'PAYLOAD',
	USER_LOGGED_IN: 					null
})

const adminIsLoggedIn = simpleReducer({
	default:							false,
	ADMIN_LOGGED_IN:			true,
	ADMIN_LOGGED_OUT:			false,
	REMOVE_SELECTED_USER: false
})

export default combineReducers({
	authState,
	accountID,
	authMessage,
	adminIsLoggedIn
})

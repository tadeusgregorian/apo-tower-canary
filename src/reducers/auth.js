import { simpleReducer } from './reducerHelpers'
import { combineReducers } from 'redux'

//const defualtAuthState = (process.env.NODE_ENV === 'development') ? 'loggedIn' : null

const authState = simpleReducer({
	default: 								'isAuthenticating',
	USER_LOGGED_IN: 				'loggedIn',
	USER_LOGGED_OUT: 				'loggedOut',
	USER_IS_AUTHENTICATING: 'isAuthenticating'
})

const adminIsLoggedIn = simpleReducer({
	default:							false,
	ADMIN_LOGGED_IN:			true,
	ADMIN_LOGGED_OUT:			false,
	REMOVE_SELECTED_USER: false
})

export default combineReducers({
	authState,
	adminIsLoggedIn
})

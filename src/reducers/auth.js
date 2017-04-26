import { simpleReducer } from './reducerHelpers'

export const authState = simpleReducer({
	default: 								'null',
	USER_LOGGED_IN: 				'loggedIn',
	USER_LOGGED_OUT: 				'loggedOut',
	USER_IS_AUTHENTICATING: 'isAuthenticating'
})

export const accountID = simpleReducer({
	USER_IS_AUTHENTICATING: null,
	USER_LOGGED_IN: 				'PAYLOAD',
	USER_LOGGED_OUT: 				null
})

export const authMessage = simpleReducer({
	SET_AUTH_MESSAGE: 				'PAYLOAD',
	USER_LOGGED_IN: 					null
})

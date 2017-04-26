import { firebaseAuth } from '../../firebaseInstance'
import { trackFBListeners } from './firebaseHelpers'

export const setAuthStateListener = () => {
	return (dispatch, getState) => {
		trackFBListeners(dispatch, getState, 'firebaseAuth', 'noPath')
		dispatch({type: 'USER_IS_AUTHENTICATING'})
		firebaseAuth().onAuthStateChanged((user) => {
			if(user) window.accountID = user.uid
			console.log(window.accountID)
			dispatch({
				type: user ? 'USER_LOGGED_IN' : 'USER_LOGGED_OUT',
				payload: user ? user.uid : null
			})
		})
	}
}

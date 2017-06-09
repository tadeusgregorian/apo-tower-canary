import { firebaseAuth } from '../../firebaseInstance'
import { trackFBListeners } from './firebaseHelpers'
import { Toast } from 'helpers'

export const setAuthStateListener = () => {
	return (dispatch, getState) => {
		trackFBListeners(dispatch, getState, 'firebaseAuth', 'noPath')
		dispatch({type: 'USER_IS_AUTHENTICATING'})

		firebaseAuth().onAuthStateChanged((user) => {

			if(user) Toast.success('Willkommen im Apotower')
			if(user) window.accountID = user.uid
			dispatch({
				type: user ? 'USER_LOGGED_IN' : 'USER_LOGGED_OUT',
				payload: user ? user.uid : null
			})
		})
	}
}

import { firebaseAuth } from '../../firebaseInstance'

export const setAuthStateListener = () => {
	return (dispatch) => {
		firebaseAuth().onAuthStateChanged((user) => {
			console.log('authState changed!')
			dispatch({type: user ? 'USER_LOGGED_IN' : 'USER_LOGGED_OUT'})
		})
	}
}

import { firebaseAuth } from '../firebaseInstance'


export function signInWithEmailAndPassword (email, pw) {
	return dispatch => firebaseAuth().signInWithEmailAndPassword(email, pw)
}

export function logout () {
  return dispatch => firebaseAuth().signOut()
}

// for later
export function createUser (email, pw) {
	return dispatch => firebaseAuth().createUserWithEmailAndPassword(email, pw)
}

// for later on
export function resetPassword (email) {
  return dispatch => firebaseAuth().sendPasswordResetEmail(email)
}

import FBInstance from '../firebaseInstance';
import { firebaseAuth } from '../firebaseInstance'
import { replaceDotsWithCommas } from 'helpers'

export function signInWithEmailAndPassword (email, pw) {
	return firebaseAuth().signInWithEmailAndPassword(email, pw)
}

export function logoutFromFirebase () {
  firebaseAuth().signOut()
}

export function checkIfEmailExists (email) {
	const emailWithCommas = replaceDotsWithCommas(email) // we have emails saved with Commas in Firebase ( Dots are not allowed in Firebase )
	const accountEmailsRef = FBInstance.database().ref('accountEmails/' + emailWithCommas)
	return accountEmailsRef.once('value').then(snap => snap.exists())
}

export function sendPasswordResetEmail (email) {
  firebaseAuth().sendPasswordResetEmail(email)
}

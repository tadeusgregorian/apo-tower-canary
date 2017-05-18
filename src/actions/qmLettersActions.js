import FBInstance from '../firebaseInstance'
import { createGuid } from 'helpers';
import moment from 'moment'
import { getFirebasePath } from './actionHelpers'

export const readQm = (qmID, userID) => {
	const ref	= FBInstance.database().ref(getFirebasePath('qmLetters')+qmID+'/assignedUsers/'+userID)
	ref.set(2)
}

export const unreadQm = (qmID, userID) => {
	const ref	= FBInstance.database().ref(getFirebasePath('qmLetters')+qmID+'/assignedUsers/'+userID)
	ref.set(1)
}

export function createQm(qmData) {
	const qm = { ...qmData,
		date: moment().toISOString(),
		ID: createGuid()
	}
	FBInstance.database().ref(getFirebasePath('qmLetters')).child(qm.ID).set(qm);
}

export function editQm(qm, callback) {
	FBInstance.database().ref(getFirebasePath('qmLetters')).child(qm.ID).set(qm, callback)
}

export function deleteQm(qmID) {
	FBInstance.database().ref(getFirebasePath('qmLetters')).child(qmID).remove()
}

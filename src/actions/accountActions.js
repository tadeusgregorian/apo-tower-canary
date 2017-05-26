import FBInstance from '../firebaseInstance';
import { getFirebasePath } from './actionHelpers'

export const requestAdminPinEmail = (userID, email) => {
	let updates = {}
	updates[getFirebasePath('users') + userID + '/adminEmail'] = email
	updates[getFirebasePath('users') + userID + '/adminPinStatus'] = 'requested'
	FBInstance.database().ref().update(updates)
}

export const saveAdminPinToDB = (adminUserID, pinHash) => {
	FBInstance.database().ref(getFirebasePath('users')).child(adminUserID+'/adminHash').set(pinHash)
}

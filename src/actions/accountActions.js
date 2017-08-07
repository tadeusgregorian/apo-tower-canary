import FBInstance from '../firebaseInstance';
import { getFirebasePath } from './actionHelpers'

export const saveAdminPinToDB = (adminUserID, pinHash) => {
	FBInstance.database().ref(getFirebasePath('users')).child(adminUserID+'/adminHash').set(pinHash)
}

export const updateIntroVideoWatched = (newStatus) => {
	FBInstance.database().ref(getFirebasePath('accountDetails')).child('introVideoWatched').set(newStatus)
}

import FBInstance from '../firebaseInstance';
import { getFirebasePath } from './actionHelpers';
import moment from 'moment'
import _ from 'lodash';

export function deleteUser(userID, callback) {
		const now = moment().toISOString()
		FBInstance.database().ref(getFirebasePath('users')).child(userID).child('deleted').set(now)
}

export function editUser(user) {
	FBInstance.database().ref(getFirebasePath('users')).child(user.ID).set(user)
}

export function addNewUser(user) {
	FBInstance.database().ref(getFirebasePath('users')).child(user.ID).set(user)
}

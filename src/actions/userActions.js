import FBInstance from '../firebaseInstance';
import { createShortGuid } from 'helpers';
import { getFirebasePath } from './actionHelpers';
import moment from 'moment'
import _ from 'lodash';

export function deleteUser(userID, callback) {
		const now = moment().toISOString()
		FBInstance.database().ref(getFirebasePath('users')).child(userID).child('deleted').set(now)
}

export function editUser(user, callback) {
	return dispatch => {
		return FBInstance.database().ref(getFirebasePath('users')).child(user.ID).set(user, callback);
	};
}

export function addNewUser(_user, callback) {
	let user = {
		..._user,
		ID: createShortGuid(),
		isOnVacation: false,
	}

	return dispatch => {
		return FBInstance.database().ref(getFirebasePath('users')).child(user.ID).set(user, callback);
	};
}

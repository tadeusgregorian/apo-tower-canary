import FBInstance from '../firebaseInstance';
import { createGuid } from 'helpers';
import _ from 'lodash';

export function deleteUser(userID, callback) {
	return dispatch => {
		return FBInstance.database().ref('users').child(userID).remove(callback);
	};
}

export function editUser(user, callback) {
	return dispatch => {
		return FBInstance.database().ref('users').child(user.ID).set(user, callback);
	};
}

export function addNewUser(_user, callback) {
	let user = {
		..._user,
		ID: createGuid(),
		isOnVacation: false,
	}
	return dispatch => {
		return FBInstance.database().ref('users').child(user.ID).set(user, callback);
	};
}

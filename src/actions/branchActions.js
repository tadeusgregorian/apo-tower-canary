import FBInstance from '../firebaseInstance';
import { createGuid } from 'helpers';
import _ from 'lodash';

export function deleteBranch(branchID, callback) {
	return dispatch => {
		return FBInstance.database().ref('branches').child(branchID).remove().then(function () {
			callback();
		}).catch(function (error) {});
	}
}

export function addNewBranch(branchName, callback) {
	let branch = {
		ID: createGuid(),
		name: branchName
	};
	return dispatch => {
		return FBInstance.database().ref('branches').child(branch.ID).set(branch, callback);
	};
}

export function addUserToBranch(userID, branches, callback) {
	return dispatch => {
		return FBInstance.database().ref('users').child(userID).child('branches').set(branches, callback);
	};
}

export function removeUserFromBranch(branchID, userID, callback) {
	return dispatch => {
		return FBInstance.database().ref('users').child(userID).child('branches').child(branchID).remove().then(function () {
			callback();
		}).catch(function (error) {});
	};
}

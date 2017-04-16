import FBInstance from '../firebaseInstance';
import { createGuid } from 'helpers';
import _ from 'lodash';

// Put your firebase DB manipulations in here

export function deleteGroup(groupID, callback) {
	return dispatch => {
		return FBInstance.database().ref('groups').child(groupID).remove().then(function () {
			callback();
		}).catch(function (error) {
			console.log(error);
		})
	}
}

export function addNewGroup(groupName, callback) {
	let group = {
		ID: createGuid(),
		name: groupName
	};
	return dispatch => {
		return FBInstance.database().ref('groups').child(group.ID).set(group, callback);
	};
}

export function addUserToGroup(userID, groups, callback) {
	return dispatch => {
		return FBInstance.database().ref('users').child(userID).child('assignedGroups').set(groups, callback);
	};
}

export function removeUserFromGroup(groupID, userID, callback) {
	return dispatch => {
		return FBInstance.database().ref('users').child(userID).child('assignedGroups').child(groupID).remove().then(function () {
			callback();
		}).catch(function (error) {});
	};
}

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

export function changeVacationStatusOfUser(userID, isOnVacation, callback) {
	return dispatch => {
		return FBInstance.database().ref('users').child(userID).child('isOnVacation').set(isOnVacation).then(function () {
			callback(isOnVacation)
		}).catch(function (error) { console.log(error) })
	}
}

export function authenticate(username, password, onSuccess, onFail) {
	return dispatch => {
		return FBInstance.auth().signInWithEmailAndPassword(username + '@mail.de', password).then((authData) => onSuccess && onSuccess()).catch(e => onFail && onFail(e));
	};
}

export function fixColors(userID, colorHash) {
	return dispatch => {
		return FBInstance.database().ref('users').child(userID).child('color').set(colorHash);
	};
}

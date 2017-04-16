import FBInstance from '../firebaseInstance';
import { createGuid } from 'helpers';
import _ from 'lodash';

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

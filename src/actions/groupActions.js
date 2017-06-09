import FBInstance from '../firebaseInstance';
import { getFirebasePath } from './actionHelpers'
import { createShortGuid } from 'helpers';
import _ from 'lodash';

export function deleteGroup(groupID, users) {

	let updates = {}
	updates[getFirebasePath('groups') + groupID] = null
	users.forEach(u => {if(u.assignedGroups && u.assignedGroups[groupID]) updates[getFirebasePath('users') + u.ID + '/assignedGroups/' + groupID] = null})
	FBInstance.database().ref().update(updates)
}

export function addNewGroup(groupName) {
	let group = { ID: createShortGuid(), name: groupName }
	FBInstance.database().ref(getFirebasePath('groups')).child(group.ID).set(group)
}

export function editGroup(groupObj) {
	FBInstance.database().ref(getFirebasePath('groups')).child(groupObj.ID).set(groupObj)
}

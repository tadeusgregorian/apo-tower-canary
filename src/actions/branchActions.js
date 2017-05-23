import FBInstance from '../firebaseInstance';
import { getFirebasePath } from './actionHelpers'
import { createShortGuid } from 'helpers';
import _ from 'lodash';

export function deleteBranch(branchID, users) {
	let updates = {}
	updates[getFirebasePath('branches') + branchID] = null
	users.forEach(u => {if(u.branches[branchID]) updates[getFirebasePath('users') + u.ID + '/branches/' + branchID] = null})
	FBInstance.database().ref().update(updates)
}

export function addNewBranch(branchName) {
	let branch = { ID: createShortGuid(), name: branchName }
	FBInstance.database().ref(getFirebasePath('branches')).child(branch.ID).set(branch)
}

export function editBranch(branchObj) {
	FBInstance.database().ref(getFirebasePath('branches')).child(branchObj.ID).set(branchObj)
}

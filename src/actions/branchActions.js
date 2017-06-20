import FBInstance from '../firebaseInstance';
import { getFirebasePath } from './actionHelpers'
import { createShortGuid } from 'helpers';
import _ from 'lodash';

export function deleteBranch(branchID, users) {
	let updates = {}
	updates[getFirebasePath('branches') + branchID] = null
	// we dont have to do this: cause we only let branches to be deleted if it is completeley empty!
	//users.forEach(u => {if(u.branches[branchID]) updates[getFirebasePath('users') + u.ID + '/branches/' + branchID] = null})
	FBInstance.database().ref().update(updates)
}

export function addNewBranch(branchName, adminUserID) {
	// the admin user gets automatically added to a newly created branch
	const branchID 		= createShortGuid()
	const updates 		= {}

	updates[getFirebasePath('branches') + branchID +'/ID'] = branchID
	updates[getFirebasePath('branches') + branchID +'/name'] = branchName
	updates[getFirebasePath('users') + adminUserID +'/branches/' + branchID] = 1
	FBInstance.database().ref().update(updates)
}

export function editBranch(branchObj) {
	FBInstance.database().ref(getFirebasePath('branches')).child(branchObj.ID).set(branchObj)
}

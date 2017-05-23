import FBInstance from '../firebaseInstance';
import { getFirebasePath } from './actionHelpers'
import { createShortGuid } from 'helpers';
import _ from 'lodash';

export function deleteBranch(branchID) {
	FBInstance.database().ref(getFirebasePath('branches')).child(branchID).remove()
}

export function addNewBranch(branchName) {
	let branch = { ID: createShortGuid(), name: branchName }
	FBInstance.database().ref(getFirebasePath('branches')).child(branch.ID).set(branch)
}

export function editBranch(branchObj) {
	FBInstance.database().ref(getFirebasePath('branches')).child(branchObj.ID).set(branchObj)
}

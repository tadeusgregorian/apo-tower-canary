/* eslint-disable no-use-before-define */
import FBInstance, { serverTimestamp } from '../firebaseInstance'
import { firebaseAuth } from '../firebaseInstance'
import { createShortGuid, replaceDotsWithCommas } from 'helpers'

export const createUserWithEmailAndPassword = (email, password) => {
	return firebaseAuth().createUserWithEmailAndPassword(email, password)
}

export const createNewAccountOnDB = (accountID, pharmacyName, email) => {
	const emailWithCommas = replaceDotsWithCommas(email)
	const initialAccountData = getInitialAccountData(accountID, pharmacyName, email)
	const ref = FBInstance.database().ref()

	ref.child('accounts/'      + accountID).set(initialAccountData)
	ref.child('accountEmails/' + emailWithCommas).set(accountID)
}

const getInitialAccountData = (accountID, pharmacyName, email) => {
	const firstBranchID = createShortGuid()
	const firstGrouptID = createShortGuid()

	return {
		groups: 					getInitialGroups(firstGrouptID),
		branches: 				getInitialBranch(pharmacyName, firstBranchID),
		users: 						getInitialUser(firstBranchID, firstGrouptID),
		accountDetails: 	getAccountDetails(accountID, email)
	}
}

const getInitialGroups = (firstGrouptID) => {
	const groupID_1 = firstGrouptID
	const groupID_2 = createShortGuid()
	const groupID_3 = createShortGuid()
	return {
		[groupID_1]: {ID: groupID_1, name: 'Apotheker', notDeletable: true},
		[groupID_2]: {ID: groupID_2, name: 'PTA', notDeletable: true},
		[groupID_3]: {ID: groupID_3, name: 'PKA', notDeletable: true},
	}
}

const getInitialBranch = (pharmacyName, firstBranchID) => {
	return {[firstBranchID]: {ID: firstBranchID, name: pharmacyName, notDeletable: true}}
}

const getInitialUser = (firstBranchID, firstGrouptID) => {
	return {u001: {
		ID: 'u001',
		name: 'Admin',
		nameInitials: 'Admi',
		color: '#2ecc71',
		isAdmin: true,
		branches: {[firstBranchID]: 1},
		assignedGroups: {[firstGrouptID]: 1}
	}}
}

const getAccountDetails = (accountID, email) => {
	return {
		ID: accountID,
		email: email,
		creationTime: serverTimestamp,
		maxBranches: 2,
		maxUsers: 20,
	}
}

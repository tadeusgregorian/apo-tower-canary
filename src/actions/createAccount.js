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
	return {
		groups: 					getInitialGroups(),
		branches: 				getInitialBranch(pharmacyName),
		users: 						getInitialUser(),
		accountDetails: 	getAccountDetails(accountID, email)
	}
}

const getInitialGroups = () => {
	const groupID_1 = createShortGuid()
	const groupID_2 = createShortGuid()
	return {
		[groupID_1]: {ID: groupID_1, name: 'Apotheker', notDeletable: true},
		[groupID_2]: {ID: groupID_2, name: 'PTA', notDeletable: true}
	}
}

const getInitialBranch = (pharmacyName) => {
	return {Z03930initialBranchID: {ID: 'Z03930initialBranchID', name: pharmacyName, notDeletable: true}}
}

const getInitialUser = (branchID) => {
	return {u001: {
		ID: 'u001',
		name: 'Admin',
		nameInitials: 'Admi',
		color: '#2ecc71',
		isAdmin: true,
		branches: {Z03930initialBranchID: 1}
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

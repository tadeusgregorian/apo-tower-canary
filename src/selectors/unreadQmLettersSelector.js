import { createSelector } from 'reselect';

const getUsers = 		(state) => { return state.data.users }
const getQms = 			(state) => { return state.qmLetters.all }
const getBranchID = (state) => { return state.core.selectedBranch.ID}

const calculateUnreadQmLetters = (users, qmLetters, branchID) => {
	let unreadQmsGrid = {}
	users.filter(u => u.branches[branchID]).forEach(u => unreadQmsGrid[u.ID] = 0) // populate grid with userID: 0
	qmLetters.forEach(qm => {
		for(let uID in qm.assignedUsers) {
			if(qm.assignedUsers[uID]===1) ++unreadQmsGrid[uID]
		}
	})
	return unreadQmsGrid
}

export const getUnreadQmLetters = createSelector([ getUsers, getQms, getBranchID ], calculateUnreadQmLetters)

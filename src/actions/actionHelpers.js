
// This function holds the Information, where in the FirebaseDB each Node sits
export const getFirebasePath	= (target) => {

	const branchID = window.selectedBranch
	const accPath = 'accounts/' + window.accountID

	switch(target){
		case 'checked': 				return accPath + '/taskManager/branches/'+branchID+'/checked/'
		case 'checkedMini': 		return accPath + '/taskManager/branches/'+branchID+'/checkedMini/'
		case 'singleTasks': 		return accPath + '/taskManager/branches/'+branchID+'/tasks/single/'
		case 'repeatingTasks': 	return accPath + '/taskManager/branches/'+branchID+'/tasks/repeating/'
		case 'undoneTasks': 		return accPath + '/taskManager/branches/'+branchID+'/undoneTasks/results/'
		case 'lastUTUpdate': 		return accPath + '/taskManager/branches/'+branchID+'/undoneTasks/lastUpdate/'
		case 'qmLetters':	 			return accPath + '/qmLetters/'
		case 'users': 					return accPath + '/users/'
		case 'branches': 				return accPath + '/branches/'
		case 'groups': 					return accPath + '/groups/'
		default : throw new Error('target is not existing Tade ( getFirebasePath ), target: ' + target)
	}
}

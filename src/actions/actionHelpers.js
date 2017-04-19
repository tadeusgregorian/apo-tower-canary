

// This function holds the Information, where in the FirebaseDB each Node sits
export const getFirebasePath	= (target, getState = null) => {
	const branchID = getState().core.selectedBranch

	switch(target){
		case 'checked': return 'taskManager/branches/'+branchID+'/checked/'
		case 'checkedMini': return 'taskManager/branches/'+branchID+'/checkedMini/'
		case 'singleTasks': return 'taskManager/branches/'+branchID+'/tasks/single/'
		case 'repeatingTasks': return 'taskManager/branches/'+branchID+'/tasks/repeating/'
		default : return 'no path tade, cause no target match'
	}
}

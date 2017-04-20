
// This function holds the Information, where in the FirebaseDB each Node sits
export const getFirebasePath	= (target) => {
	if(!window.selectedBranch) throw new Error('window.selectBranch existiert noch nicht!')
	const branchID = window.selectedBranch

	switch(target){
		case 'checked': return 'taskManager/branches/'+branchID+'/checked/'
		case 'checkedMini': return 'taskManager/branches/'+branchID+'/checkedMini/'
		case 'singleTasks': return 'taskManager/branches/'+branchID+'/tasks/single/'
		case 'repeatingTasks': return 'taskManager/branches/'+branchID+'/tasks/repeating/'
		default : return 'no path tade, cause no target match'
	}
}

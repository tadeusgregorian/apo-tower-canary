export function selectBranch(branch) {
	console.log('action:::')
	console.log(branch)
	localStorage.setItem('branch', branch.ID )
	return {type: 'SELECT_BRANCH', payload: branch.ID }
}

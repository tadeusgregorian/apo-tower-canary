export function selectBranch(branch) {
	localStorage.setItem('branch', branch.ID )
	return {type: 'SELECT_BRANCH', payload: branch.ID }
}

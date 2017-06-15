export function selectBranch(branch) {
	localStorage.setItem('apotowerbranch', branch.ID )
	window.selectedBranch = branch.ID // window.selectedBranch hast to be up to date: gets used in getFirebasePath()
	return {type: 'SELECT_BRANCH', payload: branch.ID }
}

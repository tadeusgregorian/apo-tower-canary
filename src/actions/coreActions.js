export function addBusy() {
	return { type: 'ADD_BUSY' };
}

export function removeBusy() {
	return { type: 'REMOVE_BUSY' };
}

export function selectBranch(branch) {
	localStorage.setItem('branch', branch.ID )
	return {type: 'SELECT_BRANCH', payload: branch.ID }
}

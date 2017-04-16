export function addBusy() {
	return { type: 'ADD_BUSY' };
}

export function removeBusy() {
	return { type: 'REMOVE_BUSY' };
}

export function selectBranch(branch) {
	localStorage.setItem('branch', JSON.stringify(branch));
	return {type: 'SELECT_BRANCH', payload: branch};
}

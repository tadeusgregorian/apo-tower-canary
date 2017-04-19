import _ from 'lodash';

export const selectedBranch = (state = localStorage.branch || null, action) => {
	switch (action.type) {
	case 'SELECT_BRANCH': return action.payload;
	default: return state;
	}
}

export const selectedUser = (state = null, action) => {
	switch (action.type) {
	case 'SET_SELECTED_USER': return action.payload
	case 'REMOVE_SELECTED_USER': return null
	default: return state
	}
}

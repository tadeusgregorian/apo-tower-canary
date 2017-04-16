import _ from 'lodash';
import { createDataStatusReducer, createFirebaseReducer_array} from './reducerHelpers'


export const auth = (state = null, action) => {
	switch (action.type) {
	case 'AUTH': return action.payload
	default: return state
	}
};

export const isTryingToAuth = (state = true, action) => {
	switch (action.type) {
	case 'IS_TRYING_TO_AUTH': return action.payload
	default: return state
	}
}

export const users = createFirebaseReducer_array('users');
export const groups = createFirebaseReducer_array('groups');
export const branches = createFirebaseReducer_array('branches');

export const usersDataStatus = createDataStatusReducer('users');
export const groupsDataStatus = createDataStatusReducer('groups');
export const branchesDataStatus = createDataStatusReducer('branches');

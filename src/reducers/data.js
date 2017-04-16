import { createDataStatusReducer, createFirebaseReducer_array} from './reducerHelpers'

export const users = createFirebaseReducer_array('users');
export const groups = createFirebaseReducer_array('groups');
export const branches = createFirebaseReducer_array('branches');

export const usersDataStatus = createDataStatusReducer('users');
export const groupsDataStatus = createDataStatusReducer('groups');
export const branchesDataStatus = createDataStatusReducer('branches');

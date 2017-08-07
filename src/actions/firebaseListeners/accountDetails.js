import { createFirebaseListener } from './firebaseHelpers';
import { getFirebasePath } from '../actionHelpers'

export const setAccountDetailsListener = () => (dispatch, getState) => {
		createFirebaseListener(dispatch, getState, 'accountDetails', getFirebasePath('accountDetails'), null, true)
}

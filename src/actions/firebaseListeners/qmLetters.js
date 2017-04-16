import { createFirebaseListener } from './firebaseHelpers'

export const setQmLettersListener = () => {
	return (dispatch, getState) => createFirebaseListener(dispatch, getState, 'qmLetters', 'qmLetters')
}

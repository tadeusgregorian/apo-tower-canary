import { createFirebaseListener } from './firebaseHelpers'
import { getFirebasePath } from '../actionHelpers'


export const setQmLettersListener = () => (
	(dispatch, getState) => createFirebaseListener(dispatch, getState, 'qmLetters', getFirebasePath('qmLetters'))
)

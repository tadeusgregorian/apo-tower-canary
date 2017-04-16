import {combineReducers} from 'redux';
import _ from 'lodash';
import { createFirebaseReducer_array, createDataStatusReducer } from './reducerHelpers'

const all = createFirebaseReducer_array('qmLetters')
const dataStatus = createDataStatusReducer('qmLetters')

export default combineReducers({
	dataStatus,
	all
})

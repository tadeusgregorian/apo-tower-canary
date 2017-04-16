import {combineReducers} from 'redux';

import taskManager from './taskManager'
import qmLetters from './qmLetters'

export default combineReducers({
	taskManager,
	qmLetters
})

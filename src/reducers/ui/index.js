import {combineReducers} from 'redux';

import taskManager from './taskManager'
import qmLetters from './qmLetters'
import app from './app'

export default combineReducers({
	taskManager,
	qmLetters,
	app
})

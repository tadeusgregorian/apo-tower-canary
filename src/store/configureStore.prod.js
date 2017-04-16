import thunk from 'redux-thunk'
import { createStore, applyMiddleware, compose } from 'redux'
import rootReducer from '../reducers'

export default function configureStore(initialState) {
	const store =  createStore(rootReducer, initialState, compose(applyMiddleware(thunk)))
	return store
}

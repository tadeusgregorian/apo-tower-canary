import _ from 'lodash';

export default (state = {}, action) => {
	switch (action.type) {
	case 'ADD_FIREBASE_LISTENER' 		: return { ...state, [action.listenerTarget]: action.listenerPath }
	case 'REMOVE_FIREBASE_LISTENER' : return { ...state, [action.listenerTarget]: null }
	default: return state;
	}
}

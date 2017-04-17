import FBInstance from '../../firebaseInstance';

export const addFBListener = (ref, fbAction, target, dispatch, childrenCount = 0) => {
	let childrenAdded = 0
	ref.on(fbAction, snapshot => {
		// this is a workaround because Firebase fires initial child_added events even though we have already done once(value)
		if(fbAction == 'child_added' && childrenAdded < childrenCount) { childrenAdded++; return }
		dispatch({ type: fbAction + '_' + target, payload: snapshot.val(), key: snapshot.key })
	})
}

export const trackFBListeners = (dispatch, getState, listenerTarget, newPath) => {
	const listenerPath = getState().firebaseListeners[listenerTarget]
	if(listenerPath) FBInstance.database().ref(listenerPath).off()
	dispatch({type: 'ADD_FIREBASE_LISTENER', listenerTarget: listenerTarget, listenerPath: newPath})
}

export const createFirebaseListener = (dispatch, getState, target, dbPath, queryRef = null) => {

	trackFBListeners(dispatch, getState, target, dbPath)
	dispatch({type: 'data_requested_' + target })

	const ref = queryRef || FBInstance.database().ref(dbPath)
	ref.once('value').then(snapshot =>{
		dispatch({ type: 'value_received_' + target, payload: snapshot.val() })

		const childrenCount = snapshot.exists() ? Object.keys(snapshot.val()).length : 0
		addFBListener(ref, 'child_changed', target, dispatch)
		addFBListener(ref, 'child_added', 	target, dispatch, childrenCount)
		addFBListener(ref, 'child_removed', target, dispatch)
	})
}

import FBInstance from '../firebaseInstance';
import { shortenGuid } from 'helpers';
import _ from 'lodash'

export const updateQmLetters = (qmLetters) => {

	const qmListRef =  FBInstance.database().ref('qmList')
	qmListRef.once('value').then(snap =>{
		const qmLetters = _.values(snap.val())

		let newQms = {}

		qmLetters.forEach(qm => {
			let newQm = { ...qm }

			newQm.assignedUsers = {}
			_.values(qm.assignedUsers).forEach(uID =>{ if(uID.length > 20) newQm.assignedUsers[shortenGuid(uID)] = 1})
			_.values(qm.usersRed).forEach(uID =>{if(uID.length > 20)  newQm.assignedUsers[shortenGuid(uID)] = 2})
			newQm.isUrgent = qm.isUrgent ? true : null
			newQm.creatorID = shortenGuid(qm.creatorID)
			//newQm.ID = shortenGuid(qm.ID)
			delete newQm.usersRed

			newQms[qm.ID] = newQm
		})

		const ref = FBInstance.database().ref('qmLetters')
		ref.off()
		ref.set(newQms)
		console.log('qmLetterRefreshed')
	})
}

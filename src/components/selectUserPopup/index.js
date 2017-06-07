import React from 'react'
import SModal from 'components/sModal'
import SButton from 'components/sButton'
import SelectUserBox from 'components/selectUsersBox'
import './styles.css'

export default ({onClose, users, onUserSelected, selectedUserID}) =>  {

	const onUserClicked = (userID) => {
		console.log('selected user is: '+userID)
		onUserSelected(userID)
		onClose()
	}

	return (
		<SModal.Main onClose={onClose} title='Mitarbeiter auswählen'>
			<SModal.Body>
				<fb className="bodyContent">
					<SelectUserBox
						users={users}
						userClicked={onUserClicked}
					/>
				</fb>
			</SModal.Body>
			<SModal.Footer>
				<SButton label='Abbrechen' onClick={onClose}/>
			</SModal.Footer>
		</SModal.Main>
	)
}

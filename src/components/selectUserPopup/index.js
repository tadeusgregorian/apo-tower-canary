import React from 'react'
import SModal from 'components/sModal'
import SButton from 'components/sButton'
import SelectUsersBox from 'components/selectUsersBox'
import _ from 'lodash'
import './styles.css'

export default ({onClose, users, onUserSelected, selectedUser, blockedUsers}) =>  {

	const onUserClicked = (userID) => {
		onUserSelected(userID)
		onClose()
	}

	return (
		<SModal.Main onClose={onClose} title='Mitarbeiter auswählen'>
			<SModal.Body>
				<fb className="bodyContent">
					<SelectUsersBox
						blockedUsers={blockedUsers} 		// array
						selectedUsers={[selectedUser]} 	// userID
						users={users}										// array[userObj]
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

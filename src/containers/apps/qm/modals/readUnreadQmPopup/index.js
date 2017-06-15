import SButton from 'components/sButton'
import React, {PureComponent} from 'react'
import {readQm, unreadQm} from 'actions'
import AssignedUsers from 'components/assignedUsers'
import './styles.css'
import { Storage } from '../../../../../firebaseInstance'
import { downloadFile } from 'helpers'
import AttachmentBar from './attachmentBar'
import CreatedInfo from './createdInfo'
import SModal from 'components/sModal'
import _ from 'lodash'

export default class ReadUnreadQmPopup extends PureComponent {
	constructor(props) {
		super(props)

		this.state = { downloadLinksForAttachments: [] }
	}

	componentDidMount() {
		this.props.qmData.files && this.props.qmData.files.forEach(f => {
			Storage.ref(`${window.accountID}/qm/${f.guid}`).child(f.name).getDownloadURL().then(url => {
				this.setState({downloadLinksForAttachments: [...this.state.downloadLinksForAttachments, {...f, url}]})
			})
		})
	}


	readUnread() {
		const qmID 		= this.props.qmData.ID
		const userID 	= this.props.userID
		this.props.onClose()
		this.props.hasRed ? unreadQm(qmID, userID) : readQm(qmID, userID)
	}


	tryToDownloadFile = (f) => {
		let filteredUrls 	= this.state.downloadLinksForAttachments.filter(a => a.guid === f.guid)
		let filteredFile 	= filteredUrls.length && filteredUrls[0]
		if (filteredFile) downloadFile(filteredFile.url, filteredFile.name)
	}

	tryToOpenPDF = (f) => {
		let filteredUrls 	= this.state.downloadLinksForAttachments.filter(a => a.guid === f.guid)
		let filteredUrl 	= filteredUrls.length && filteredUrls[0].url
		if (filteredUrl)  window.open(filteredUrl)
	}

	render() {
		const { users, qmData, userID } = this.props

		const userIsAdmin     	= users.find(u => u.ID === userID).isAdmin
		const userIsCreator 		= userID === qmData.creatorID
		const allowedToEdit   	= userIsCreator || userIsAdmin
		const userIsAssigned		= !!qmData.assignedUsers[userID]

		const assignedUsers 	= _.keys(qmData.assignedUsers)
		const usersRed 					= assignedUsers.filter(uid => qmData.assignedUsers[uid] === 2)
		const createdBy 				= users.find(u => u.ID === qmData.creatorID).name

		return (
			<SModal.Main title={qmData.subject} onClose={this.props.onClose}>
				<SModal.Body>
					<fb className='rurModalAssignedUsers'>
							<AssignedUsers {...{assignedUsers, users, usersRed}} tooltipRight/>
					</fb>
					<fb className="rurModalBodyContent">
						<CreatedInfo createdBy={createdBy} creationDate={qmData.date}/>
						{qmData.text  && <p className="qmText">{qmData.text}</p>}
						{qmData.files && qmData.files.map(f => (
								<AttachmentBar
									file={f}
									key={f.name + f.uploadTime + f.size}
									tryToOpenPDF={this.tryToOpenPDF}
									tryToDownloadFile={this.tryToDownloadFile}
								/>
						))}
					</fb>
				</SModal.Body>
				<SModal.Footer>
				  { allowedToEdit && [
						<SButton key='1'
							label='bearbeiten'
							onClick={ () => {
								this.props.openAddEditQmWizard(false, qmData)
								this.props.onClose();
							}}
						/>,
						<SButton key='2'
							label='löschen'
							onClick={ () => {
								this.props.openDeleteQmPopup(qmData)
								this.props.onClose();
							}}
						/>
					]}
					{ userIsAssigned &&
						<SButton
						right
						color={this.props.hasRed ?  '#f39c12' : '#2ecc71'}
						label={this.props.hasRed ? 'Ungelesen' : 'Gelesen'}
						onClick={() => this.readUnread()}
					/>}
				</SModal.Footer>
			</SModal.Main>
		)
	}
}

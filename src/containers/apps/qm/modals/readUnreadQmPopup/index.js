import SButton from 'components/sButton'
import React, {PureComponent} from 'react'
import {readQm, unreadQm} from 'actions'
import AssignedUsers from 'components/assignedUsers'
import './styles.css'
import { Storage } from '../../../../../firebaseInstance'
import { downloadFile, playTaskCheckSound } from 'helpers'
import AttachmentBar from './attachmentBar'
import SModal from 'components/sModal'
import _ from 'lodash'

export default class ReadUnreadQmPopup extends PureComponent {
	constructor(props) {
		super(props)

		this.readerIsCreator = this.props.userID===this.props.qmData.creatorID;
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
		playTaskCheckSound()
		this.props.onClose()
		this.props.hasRed ? unreadQm(qmID, userID) : readQm(qmID, userID)
	}


	tryToDownloadFile = (f) => {
		let filteredUrls = this.state.downloadLinksForAttachments.filter(a => a.guid===f.guid)
		let filteredFile = filteredUrls.length && filteredUrls[0]
		if (filteredFile) {
			downloadFile(filteredFile.url, filteredFile.name);
		}
	}

	tryToOpenPDF = (f) => {
		let filteredUrls = this.state.downloadLinksForAttachments.filter(a => a.guid===f.guid)
		let filteredUrl = filteredUrls.length && filteredUrls[0].url
		if (filteredUrl) {
			window.open(filteredUrl)
		}
	}

	render() {
		const assignedUsers = _.keys(this.props.qmData.assignedUsers)
		const usersRed = assignedUsers.filter(uid => this.props.qmData.assignedUsers[uid] === 2)
		const users = this.props.users
		return (
			<SModal.Main title={this.props.qmData.subject} onClose={this.props.onClose}>
				<SModal.Body>
					<fb className='rurModalAssignedUsers'>
						<AssignedUsers {...{assignedUsers, users, usersRed}} />
					</fb>
					<fb className="rurModalBodyContent">
						<p>{this.props.qmData.text}</p>
						{this.props.qmData.files && this.props.qmData.files.map(f => (
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
					  { this.readerIsCreator &&
							[
								<SButton key='1'
									label='bearbeiten'
									onClick={ () => {
										this.props.openAddEditQmWizard(false, this.props.qmData)
										this.props.onClose();
									}}
								/>,
								<SButton key='2'
									label='löschen'
									onClick={ () => {
										this.props.openDeleteQmPopup(this.props.qmData)
										this.props.onClose();
									}}
								/>
							]
						 }
							<SButton
								position='right'
								color={this.props.hasRed ?  '#f39c12' : '#2ecc71'}
								label={this.props.hasRed ? 'Ungelesen' : 'Gelesen'}
								onClick={() => this.readUnread()}
								disabled={this.readerIsCreator}
							/>
				</SModal.Footer>
			</SModal.Main>
		)
	}
}

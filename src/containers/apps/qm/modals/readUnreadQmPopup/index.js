import RaisedButton from 'material-ui/RaisedButton'
import FlatButton from 'material-ui/FlatButton'
import FontIcon from 'material-ui/FontIcon'
import React, {PureComponent} from 'react'
import {readQm, unreadQm} from 'actions'
import AssignedUsers from 'components/assignedUsers'
import 'styles/modals.scss'
import './styles.scss'
import { Storage } from '../../../../../firebaseInstance'
import { downloadFile, playTaskCheckSound } from 'helpers'
import _ from 'lodash'

export default class ReadUnreadQmPopup extends PureComponent {
	constructor(props) {
		super(props)

		this.readerIsCreator = this.props.userID == this.props.qmData.creatorID;
		this.state = { downloadLinksForAttachments: [] }
	}

	componentDidMount() {
		this.props.qmData.files && this.props.qmData.files.forEach(f => {
			Storage.ref(`qm/${f.guid}`).child(f.name).getDownloadURL().then(url => {
				this.setState({downloadLinksForAttachments: [...this.state.downloadLinksForAttachments, {...f, url}]})
			})
		})
	}


	readUnread() {
		const qmID 		= this.props.qmData.ID
		const userID 	= this.props.userID
		playTaskCheckSound()
		this.props.close()
		this.props.hasRead ? unreadQm(qmID, userID) : readQm(qmID, userID)
	}


	tryToDownloadFile = (f) => {
		let filteredUrls = this.state.downloadLinksForAttachments.filter(a => a.guid == f.guid)
		let filteredFile = filteredUrls.length && filteredUrls[0]
		if (filteredFile) {
			downloadFile(filteredFile.url, filteredFile.name);
		}
	}

	tryToOpenPDF = (f) => {
		let filteredUrls = this.state.downloadLinksForAttachments.filter(a => a.guid == f.guid)
		let filteredUrl = filteredUrls.length && filteredUrls[0].url
		if (filteredUrl) {
			window.open(filteredUrl)
		}
	}

	render() {
		return (
			<fb className="readUnreadQmPopup modal">
				<header>
					<h4 style={{color: this.props.qmData.isUrgent ? 'red' : ''}}>{this.props.qmData.subject}</h4>
					<fb className="assignedUsersWrapper">
						<AssignedUsers
							assignedUsers={_.keys(this.props.qmData.assignedUsers)}
							usersRed={this.props.qmData.usersRed}
							users={this.props.users} />
					</fb>
				</header>
				<content>
					<p>{this.props.qmData.text}</p>
					{this.props.qmData.files && this.props.qmData.files.map(f => {
						const fileIsViewable = f.name.substr(-4) == ".pdf";
						console.log(f.name.substr(-4))
						return (
							<fb key={f.name + f.uploadTime + f.size} className="file downloadable">

							<FlatButton
								primary={true}
								className="iconButton"
								onTouchTap={() => this.tryToDownloadFile(f)}
								icon={<FontIcon className="icon icon-download" />} />
								{ fileIsViewable ?
									<FlatButton
										primary={true}
										className="iconButton"
										onTouchTap={() => this.tryToOpenPDF(f)}
										icon={<FontIcon className="icon icon-eye" />} />
								: null}
								<fb className="name">{f.name}</fb>
							</fb>
						)})}
				</content>
				<footer>
					<div className="content-right">
					  { this.readerIsCreator ? (
							<fb className="editDeleteButtonWrapper">
								<RaisedButton
									label='bearbeiten'
									primary={true} onTouchTap={ () => {
										this.props.openAddEditQmWizard(false, this.props.qmData)
										this.props.close();
									}}
								/>
								<RaisedButton
									label='löschen'
									primary={true} onTouchTap={ () => {
										this.props.openDeleteQmPopup(this.props.qmData)
										this.props.close();
									}}
								/>
							</fb>)
						 : null}
						<RaisedButton
							label={this.props.hasRead ? 'Ungelesen' : 'Gelesen'}
							primary={true} onTouchTap={() => this.readUnread()}
							disabled={this.readerIsCreator}
						/>
					</div>
				</footer>
			</fb>
		);
	}
}

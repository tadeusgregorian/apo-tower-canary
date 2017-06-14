import React, { PureComponent } from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux';
import QmLetters from './letters'
import composeWizard from 'composers/wizard';
import DefineContentStep from './modals/defineContentStep'
import AssignUsersStep from './modals/assignUsersStep'
import { createQm, editQm, deleteQm } from 'actions'
import { openConfirmPopup, closeConfirmPopup } from 'actions'
import _ from 'lodash';
import Dialog from 'material-ui/Dialog';
import ReadUnreadQmPopup from './modals/readUnreadQmPopup/index.js';
import TextField from 'material-ui/TextField'
import SCheckbox from 'components/sCheckbox'
import ConfirmPopup from 'components/confirmPopup'
import './styles.css'


class QmApp extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			readUnreadQmDialogOpen: false,
			addEditQmWizardOpen: false,
			showOnlyUnreadQms: false,
			adminWantsToSeeAll: false,
			filter: ""
		}
	}

	//componentDidMount = () => this.props.setSelectedUser(this.props.match.params.userID)
	closeReadUnreadQmModal = () => 	this.setState({readUnreadQmDialogOpen: false})
	closeAddEditQmWizard = () => this.setState({addEditQmWizardOpen: false})

	openReadUnreadQmModal = (hasRed, qmData) => {
		console.log(qmData)
		this.readUnreadQmPopup = (<ReadUnreadQmPopup
			userID={this.props.selectedUser}
			users={this.props.users}
			hasRed={hasRed}
			qmData={qmData}
			onClose={this.closeReadUnreadQmModal}
			openAddEditQmWizard={this.openAddEditQmWizard}
			openDeleteQmPopup={this.openDeleteQmPopup}
		/>)
		this.setState({readUnreadQmDialogOpen: true})
	}

	openAddEditQmWizard = (isAdding = true, qmData = null) => {
		this.setState({addEditQmWizardOpen: true});
		let Wizard = composeWizard([DefineContentStep, AssignUsersStep], qmData)
		this.addEditQmWizard = (<Wizard
			onClose={this.closeAddEditQmWizard}
			onStepsComplete={isAdding ? this.saveFreshQmToDB : this.saveEditedQmToDB}
		/>)
	}

	saveFreshQmToDB = (freshQm) => {
		this.props.createQm(freshQm)
		this.setState({addEditQmWizardOpen: false})
	}

	saveEditedQmToDB = (freshQm) => {
		editQm(freshQm)
		this.setState({addEditQmWizardOpen: false})
	}

	openDeleteQmPopup = (qm) => {
		const deleteQmPopup =
			<ConfirmPopup
				acceptBtnLabel='Löschen'
				declineBtnLabel='Abbrechen'
				acceptBtnRed={true}
				title={'Löschen einer Ansage'}
				text={'Möchten sie diese Ansage wirklich löschen ?'}
				onAccept={() => deleteQm(qm.ID)}
				onClose={this.props.closeConfirmPopup}
			/>
		this.props.openConfirmPopup(deleteQmPopup)
	}

	onSearchFieldChanged = (e) => {
		this.setState({filter: e.target.value})
	}

	adminEyeCheckboxClicked = () => {
		// cant have both, logically
		this.setState({ adminWantsToSeeAll: !this.state.adminWantsToSeeAll, showOnlyUnreadQms: false })
	}

	unreadCheckboxClicked = () => {
		// cant have both, logically
		this.setState({ showOnlyUnreadQms: !this.state.showOnlyUnreadQms, adminWantsToSeeAll: false })
	}

	userIsAdmin = () => !!this.props.users.find(u => u.ID === this.props.selectedUser).isAdmin

	render() {
		console.log('rendering all ?')
		return (
			<fb className='qmAppWrapper'>
				<fb className="vertical qmAppMain">
					<header className="qmHead">
						<fb className="searchWrapper">
							<icon className="icon-search no-border"></icon>
							<TextField floatingLabelText="Suche" floatingLabelStyle={{color: 'grey'}} value={this.state.filter} onChange={this.onSearchFieldChanged}/>
						</fb>
						<fb className="unreadCheckbox">
							<SCheckbox
								label='nur ungelesene'
								isChecked={this.state.showOnlyUnreadQms}
								onCheck={this.unreadCheckboxClicked}
							/>
						</fb>
						{ this.userIsAdmin() &&
							<fb className="adminEyeCheckbox">
							<SCheckbox
								label='Adminmodus'
								isChecked={this.state.adminWantsToSeeAll}
								onCheck={this.adminEyeCheckboxClicked}
							/>
							<fb className="adminEyeInfo" data-balloon='Im Adminmodus sind die QM-Briefe aller sichtbar' data-balloon-pos='top' >
								<fb className="icon icon-information2" />
							</fb>
						</fb>}
						<fb className='addQmButton' onClick={this.openAddEditQmWizard}>
							<fb className='addQmButtonIconWrapper'><icon className='icon icon-plus'/></fb>
							<fb className='addQmButtonText'>QM ERSTELLEN</fb>
						</fb>
					</header>
					<QmLetters
						adminWantsToSeeAll={this.state.adminWantsToSeeAll}
						showOnlyUnreadQms={this.state.showOnlyUnreadQms}
						userID={this.props.selectedUser}
						qmLetters={this.props.qmLetters}
						users={this.props.users}
						openReadUnreadQmModal={this.openReadUnreadQmModal}
						filterText={this.state.filter}
					/>
					<Dialog bodyClassName='sModal'
						open={this.state.readUnreadQmDialogOpen}
						onRequestClose={this.closeReadUnreadQmModal}>
						{this.readUnreadQmPopup}
					</Dialog>
					<Dialog bodyClassName='sModal'
						open={this.state.addEditQmWizardOpen}
						onRequestClose={this.closeAddEditQmWizard}>
						{this.addEditQmWizard}
					</Dialog>
				</fb>
			</fb>
		)
	}
}

const mapDispatchToProps = (dispatch) => (
	bindActionCreators({
		setSelectedUser: (userID) => ({type: 'SET_SELECTED_USER', payload: userID}),
		createQm,
		openConfirmPopup,
		closeConfirmPopup,
	}, dispatch)
)

const mapStateToProps = (state) => ({
	qmLetters: state.qmLetters.all,
	users: state.data.users,
	selectedUser: state.core.selectedUser
})

export default connect(mapStateToProps, mapDispatchToProps)(QmApp);

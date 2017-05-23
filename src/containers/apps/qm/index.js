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
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';
import ConfirmPopup from 'components/confirmPopup'
import ReactTooltip from 'react-tooltip'
import './styles.css'


class QmApp extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			readUnreadQmDialogOpen: false,
			addEditQmWizardOpen: false,
			showOnlyUnreadQms: false,
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
	};

	// -------- Add and edit qm letter
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

	render() {
		return (
			<fb className='qmAppWrapper'>
				<fb className="vertical qmAppMain">
					<header className="horizontal">
						<fb>
							<icon className="icon-search no-border"></icon>
							<TextField floatingLabelText="Suche" floatingLabelStyle={{color: 'grey'}} value={this.state.filter} onChange={this.onSearchFieldChanged}/>
						</fb>
						<fb className="filterUnreadCheckbox">
							<Checkbox
								label="Nur ungelesene anzeigen"
								style={{fontSize: "14px"}}
								checked={this.state.showOnlyUnreadQms}
								onCheck={()=>{ this.setState({showOnlyUnreadQms: !this.state.showOnlyUnreadQms})}}
							/>
						</fb>
						<fb className='addQmButton' onClick={this.openAddEditQmWizard}>
							<fb className='addQmButtonIconWrapper'><icon className='icon icon-plus'/></fb>
							<fb className='addQmButtonText'>QM ERSTELLEN</fb>
						</fb>
					</header>
					<QmLetters
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
					<ReactTooltip id='fullUserName' type='dark' delayShow={100} className="highestZIndex"/>
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

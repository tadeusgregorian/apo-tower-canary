import React, { PureComponent } from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux';
import QmLetters from './letters'
import composeWizard from 'composers/qmWizard';
import DefineContentStep from './modals/defineContentStep'
import AssignUsersStep from './modals/assignUsersStep'
import { createQm, editQm} from 'actions/index';
import _ from 'lodash';
import Dialog from 'material-ui/Dialog';
import ReadUnreadQmPopup from './modals/readUnreadQmPopup/index.js';
import DeleteQmPopup from './modals/deleteQmPopup';
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';
import './styles.css'


class QmApp extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			readUnreadQmDialogOpen: false,
			addEditQmWizardOpen: false,
			deleteQmPopupOpen: false,
			showOnlyUnreadQms: false,
			filter: ""
		}
	}

	componentDidMount = () => this.props.setSelectedUser(this.props.match.params.userID)

	closeReadUnreadQmModal = () => 	this.setState({readUnreadQmDialogOpen: false})

	openReadUnreadQmModal = (hasRead, qmData) => {
		this.readUnreadQmPopup = (<ReadUnreadQmPopup
			userID={this.props.selectedUser}
			users={this.props.users}
			hasRead={hasRead}
			qmData={qmData}
			close={this.closeReadUnreadQmModal}
			openAddEditQmWizard={this.openAddEditQmWizard}
			openDeleteQmPopup={this.openDeleteQmPopup}
		/>)
		this.setState({readUnreadQmDialogOpen: true})
	};

	// -------- Add and edit qm letter (When adding new qm, param must be true)
	openAddEditQmWizard = (isAdding, qmData) => {
		this.setState({addEditQmWizardOpen: true});
		let Wizard = composeWizard([DefineContentStep, AssignUsersStep]);
		this.addEditQmWizard = (<Wizard
			user={this.props.user}
			creatorID={this.props.user.ID}
			initData={qmData}
			close={this.closeAddEditQmWizard}
			onFinish={isAdding ? createQm : editQm}
		/>)
	}

	closeAddEditQmWizard = () => this.setState({addEditQmWizardOpen: false})

	openDeleteQmPopup = (qm) => {
		this.setState({deleteQmPopupOpen: true})
		this.deleteQmPopup = (<DeleteQmPopup qm={qm} close={()=>this.setState({deleteQmPopupOpen: false})}/>)
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
						<fb className='addQmButton' onClick={() => this.openAddEditQmWizard(true)}>
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
					<Dialog className="materialDialog"
						open={this.state.readUnreadQmDialogOpen}
						onRequestClose={this.closeReadUnreadQmModal}>
						{this.readUnreadQmPopup}
					</Dialog>
					<Dialog className="materialDialog"
						open={this.state.addEditQmWizardOpen}
						onRequestClose={this.closeAddEditQmWizard}>
						{this.addEditQmWizard}
					</Dialog>
					<Dialog className="materialDialog"
						open={this.state.deleteQmPopupOpen}
						onRequestClose={this.closeDeleteQmPopup}>
						{this.deleteQmPopup}
					</Dialog>
				</fb>
			</fb>
		)
	}
}

const mapDispatchToProps = (dispatch) => (
	bindActionCreators({
		setSelectedUser: (userID) => dispatch({type: 'SET_SELECTED_USER', payload: userID})
	}, dispatch)
)

const mapStateToProps = (state) => ({
	qmLetters: state.qmLetters.all,
	users: state.data.users,
	selectedUser: state.core.selectedUser
})

export default connect(mapStateToProps, mapDispatchToProps)(QmApp);

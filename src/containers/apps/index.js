//@flow
import React, {PureComponent} from 'react'
import {connect} from 'react-redux'
import { Route, withRouter } from 'react-router-dom'
import {bindActionCreators} from 'redux'
import Dialog from 'material-ui/Dialog'
import EnterAdminPinPopup from 'components/enterAdminPinPopup'
import SelectBranchDialog from 'components/selectBranchDialog'
import {
	registerUsersDataListener,
	registerGroupsDataListener,
	registerBranchesDataListener,
	setQmLettersListener
} from 'actions'

import Topbar 			from './topbar'
import TaskManager 	from './taskManager'
import QmApp 				from './qm'
import AdminPanel 	from './adminPanel'

class Apps extends PureComponent {

	componentDidMount() {
		this.props.usersDataStatus 		== 'NOT_REQUESTED' && this.props.registerUsersDataListener()
		this.props.groupsDataStatus 	== 'NOT_REQUESTED' && this.props.registerGroupsDataListener()
		this.props.branchesDataStatus == 'NOT_REQUESTED' && this.props.registerBranchesDataListener()

		this.props.qmLettersDataStatus  == 'NOT_REQUESTED' && this.props.setQmLettersListener()
		window.selectedBranch = this.props.selectedBranch || null
		window.accountID = this.props.accountID
	}

	componentWillReceiveProps(nP) {
		!nP.selectedBranch && nP.branches.length && !this.props.selectBranchDialog && this.openSelectbranchDialog()

		const branchHasChanged = nP.selectedBranch !== this.props.selectedBranch
		if(branchHasChanged) { window.selectedBranch = nP.selectedBranch }
	}

	requiredDataIsLoaded = () => {
		if (this.props.usersDataStatus 			!== 'LOADED') return false
		if (this.props.branchesDataStatus  	!== 'LOADED') return false
		if (this.props.groupsDataStatus 		!== 'LOADED') return false
		if (this.props.qmLettersDataStatus 	!== 'LOADED') return false
		return true
	}

	render() {
		if(!this.requiredDataIsLoaded()) return <fb>loading...</fb>
		const user = this.props.selectedUser && this.props.users && this.props.users.find(u => u.ID == this.props.selectedUser)
		return (
			<fb id="apps">
				<fb className="vertical">
					<Topbar userMode={!!user} user={user} location={this.props.location} />
						<fb id="app">
							<Route path='/Apps/TaskManager' component={TaskManager} />
							<Route path='/Apps/QM/:userID' 	component={QmApp} />
							<Route path='/Apps/Adminpanel' 	component={AdminPanel} />
						</fb>
				</fb>
				<Dialog open={!!this.props.selectBranchDialog} modal={true}>
					<SelectBranchDialog close={this.props.closeSelectbranchDialog}/>
				</Dialog>
				<Dialog open={!!this.props.adminPinDialog} onRequestClose={this.props.closeAdminPinDialog} bodyClassName='sModal' contentStyle={{width: '480px'}}>
					<EnterAdminPinPopup />
				</Dialog>
			</fb>
		)
	}
}


const mapStateToProps = (state) => {
	return {
		accountID: state.auth.accountID,
		users: state.data.users,
		branches: state.data.branches,

		usersDataStatus: state.data.dataStatus.usersDataStatus,
		groupsDataStatus: state.data.dataStatus.groupsDataStatus,
		qmLettersDataStatus: state.qmLetters.dataStatus,
		branchesDataStatus: state.data.dataStatus.branchesDataStatus,

		selectedBranch: state.core.selectedBranch,
		selectedUser: state.core.selectedUser,
		currentDay: state.ui.taskManager.currentDay,
		adminPinDialog: state.ui.app.adminPinDialog,
		selectBranchDialog: state.ui.app.selectBranchDialog
	}
}


const mapDispatchToProps = (dispatch) => {
	return bindActionCreators({
		registerUsersDataListener,
		registerGroupsDataListener,
		registerBranchesDataListener,
		setQmLettersListener,
		setSelectedUser: 		(userID) => dispatch({type: 'SET_SELECTED_USER', payload: userID}),
		closeAdminPinDialog: 			() => dispatch({type: 'CLOSE_ADMIN_PIN_DIALOG'}),
		openSelectbranchDialog: 	() => dispatch({type: 'OPEN_SELECT_BRANCH_DIALOG'}),
		closeSelectbranchDialog: 	() =>	dispatch({type: 'CLOSE_SELECT_BRANCH_DIALOG'})
	}, dispatch)
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Apps))

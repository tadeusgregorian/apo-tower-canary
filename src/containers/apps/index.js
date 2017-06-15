// @flow
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
	setQmLettersListener,
	synchronizeClientTime,
	selectBranch
} from 'actions'

import UserTopbar 	from './topbar/userTopbar'
import PublicTopbar from './topbar/publicTopbar'
import TaskManager 	from './taskManager'
import QmApp 				from './qm'
import AdminPanel 	from './adminPanel'
import UserProfile 	from './userProfile'

class Apps extends PureComponent{

	componentDidMount() {
		this.props.synchronizeClientTime()
		this.props.usersDataStatus 		=== 'NOT_REQUESTED' && this.props.registerUsersDataListener()
		this.props.groupsDataStatus 	=== 'NOT_REQUESTED' && this.props.registerGroupsDataListener()
		this.props.branchesDataStatus === 'NOT_REQUESTED' && this.props.registerBranchesDataListener()
		this.props.qmLettersDataStatus  === 'NOT_REQUESTED' && this.props.setQmLettersListener()

	}

	componentWillReceiveProps(nP) {
		if(nP.branchesDataStatus !== 'LOADED') return
		!nP.selectedBranch && nP.branches.length > 1 && !this.props.selectBranchDialog && this.props.openSelectbranchDialog()
		!nP.selectedBranch && nP.branches.length === 1 && this.props.selectBranch(nP.branches[0])
		nP.selectedBranch && !nP.branches.find(b => b.ID === nP.selectedBranch) && this.props.selectBranch(nP.branches[0]) // important edge case scenario, when there is a selectedBranch in local storage, that doesnt exists in this account.
	}

	componentDidUpdate() {
		const tP = this.props
		const urlIncludesPublic = tP.location.pathname.includes('Public')
		if(urlIncludesPublic && tP.selectedUser) tP.removeSelectedUser()	// when redirected to a url containting 'Public' we remove the selectedUser -> props.selectedUser is what changes the UI
		if(!urlIncludesPublic && !tP.selectedUser) tP.history.push('/Apps/TaskManager/Kalender/Public') // someone is in unpublic area, without a selectedUser -> get him out
	}

	requiredDataIsLoaded = () => {
		if (!this.props.clientTimeSynchronization)				return false
		if (this.props.usersDataStatus 			!== 'LOADED') return false
		if (this.props.branchesDataStatus  	!== 'LOADED') return false
		if (this.props.groupsDataStatus 		!== 'LOADED') return false
		if (this.props.qmLettersDataStatus 	!== 'LOADED') return false
		return true
	}

	render() {
		if(!this.requiredDataIsLoaded()) return <fb>loading...</fb>
		const user = this.props.selectedUser && this.props.users && this.props.users.find(u => u.ID===this.props.selectedUser)
		return (
			<fb id="apps">
				<fb id="appsContent">
					{user ? <UserTopbar /> : <PublicTopbar />}
					<fb id="appMain">
						<Route path='/Apps/TaskManager' 					component={TaskManager} />
						<Route path='/Apps/QM'  									component={QmApp} />
						<Route path='/Apps/Adminpanel' 						component={AdminPanel} />
						<Route path='/Apps/Profil' 								component={UserProfile} />
					</fb>
				</fb>
				<Dialog open={!!this.props.selectBranchDialog} modal={true}>
					<SelectBranchDialog close={this.props.closeSelectbranchDialog}/>
				</Dialog>
				<Dialog open={!!this.props.adminPinDialog} onRequestClose={this.props.closeAdminPinDialog} bodyClassName='sModal' contentStyle={{width: '480px'}}>
					<EnterAdminPinPopup />
				</Dialog>
				<Dialog open={!!this.props.confirmPopup} onRequestClose={this.props.closeConfirmPopup} bodyClassName='sModal'>
					{this.props.confirmPopup}
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
		selectBranchDialog: state.ui.app.selectBranchDialog,

		confirmPopup: state.ui.app.confirmPopup,
		clientTimeSynchronization: state.core.clientTimeSynchronization,
	}
}


const mapDispatchToProps = (dispatch) => {
	return bindActionCreators({
		registerUsersDataListener,
		registerGroupsDataListener,
		registerBranchesDataListener,
		setQmLettersListener,
		setSelectedUser: 		(userID) => ({type: 'SET_SELECTED_USER', payload: userID}),
		removeSelectedUser: 			() => ({type: 'REMOVE_SELECTED_USER'}),
		closeAdminPinDialog: 			() => ({type: 'CLOSE_ADMIN_PIN_DIALOG'}),
		openSelectbranchDialog: 	() => ({type: 'OPEN_SELECT_BRANCH_DIALOG'}),
		closeSelectbranchDialog: 	() =>	({type: 'CLOSE_SELECT_BRANCH_DIALOG'}),
		closeConfirmPopup:				() => ({type: 'CLOSE_CONFIRM_POPUP'}),
		synchronizeClientTime,
		selectBranch
	}, dispatch)
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Apps))

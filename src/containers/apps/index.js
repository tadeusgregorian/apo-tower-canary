// @flow
import React, {PureComponent} from 'react'
import {connect} from 'react-redux'
import { Route, withRouter } from 'react-router-dom'
import {bindActionCreators} from 'redux'
import Dialog from 'material-ui/Dialog'
import { startNewDayChecker } from 'helpers'
import InfoNote 					from 'components/infoNote'
import EnterAdminPinPopup from 'components/enterAdminPinPopup'
import SelectBranchDialog from 'components/selectBranchDialog'
import IntroVideoPopup 		from 'components/introVideoPopup'
import {
	registerUsersDataListener,
	registerGroupsDataListener,
	registerBranchesDataListener,
	setQmLettersListener,
	checkClientDate,
	selectBranch
} from 'actions'

import {
	removeSelectedUser,
	closeAdminPinDialog,
	openSelectbranchDialog,
	closeSelectbranchDialog,
	closeConfirmPopup,
	closeIntroVideoPopup
} from 'actions/ui/core'

import UserTopbar 	from './topbar/userTopbar'
import PublicTopbar from './topbar/publicTopbar'
import TaskManager 	from './taskManager'
import QmApp 				from './qm'
import AdminPanel 	from './adminPanel'
import UserProfile 	from './userProfile'

class Apps extends PureComponent{

	componentDidMount() {
		this.props.checkClientDate()
		startNewDayChecker()
		this.props.usersDataStatus 		=== 'NOT_REQUESTED' && this.props.registerUsersDataListener()
		this.props.groupsDataStatus 	=== 'NOT_REQUESTED' && this.props.registerGroupsDataListener()
		this.props.branchesDataStatus === 'NOT_REQUESTED' && this.props.registerBranchesDataListener()
		this.props.qmLettersDataStatus  === 'NOT_REQUESTED' && this.props.setQmLettersListener()

	}

	componentWillReceiveProps(nP) {
		if(nP.branchesDataStatus !== 'LOADED') return
		!nP.selectedBranch && nP.branches.length > 1 && !this.props.selectBranchDialog && this.props.openSelectbranchDialog()
		!nP.selectedBranch && nP.branches.length === 1 && this.props.selectBranch(nP.branches[0])
		nP.selectedBranch && !nP.branches.find(b => b.ID === nP.selectedBranch) && this.props.selectBranch(nP.branches[0]) // important edge case scenario, when there is a selectedBranch in local storage, but that branch doesnt exists in this account.
	}

	componentDidUpdate(prevProps) {
		const tP = this.props
		const urlIncludesPublic = tP.location.pathname.includes('Public')
		const userJustEntered = tP.selectedUser && !prevProps.selectedUser
		if(urlIncludesPublic && tP.selectedUser && !userJustEntered) tP.removeSelectedUser()	// when redirected to a url containting 'Public' we remove the selectedUser -> props.selectedUser is what changes the UI
		if(!urlIncludesPublic && !tP.selectedUser) tP.history.push('/Apps/TaskManager/Kalender/Public') // someone is in non-public area, without a selectedUser -> redirect him OUT !
	}

	requiredDataIsLoaded = () => {
		if (!this.props.clientDateChecked)	return false
		if (this.props.usersDataStatus 			!== 'LOADED') return false
		if (this.props.branchesDataStatus  	!== 'LOADED') return false
		if (this.props.groupsDataStatus 		!== 'LOADED') return false
		if (this.props.qmLettersDataStatus 	!== 'LOADED') return false
		return true
	}

	render() {
		const tp = this.props
		if(!this.requiredDataIsLoaded()) return <fb>loading...</fb>
		if(!tp.clientDateCorrect) return <InfoNote type='warning' text='Die Datum/Zeit Einstellung Ihres Computers ist falsch. Bitte korrigiren Sie diese und laden Sie die Seite neu.' />
		const user = tp.selectedUser && tp.users && tp.users.find(u => u.ID === tp.selectedUser)
		return (
			<fb id="apps">
				{ tp.selectedBranch &&
					<fb id="appsContent">
						{user ? <UserTopbar /> : <PublicTopbar />}
						<fb id="appMain">
							<Route path='/Apps/TaskManager' 					component={TaskManager} />
							<Route path='/Apps/QM'  									component={QmApp} />
							<Route path='/Apps/Adminpanel' 						component={AdminPanel} />
							<Route path='/Apps/Profil' 								render={() => <UserProfile user={user} />} />
						</fb>
					</fb>
				}
				<Dialog open={!!tp.selectBranchDialog} modal={true}>
					<SelectBranchDialog close={tp.closeSelectbranchDialog}/>
				</Dialog>
				<Dialog open={tp.introVideoPopup.isOpen} onRequestClose={tp.closeIntroVideoPopup} bodyClassName='sModal' contentStyle={{maxWidth: '940px', width: '940px'}}>
					<IntroVideoPopup closePopup={tp.closeIntroVideoPopup}/>
				</Dialog>
				<Dialog open={tp.adminPinDialog.isOpen} onRequestClose={tp.closeAdminPinDialog} bodyClassName='sModal' contentStyle={{width: '480px'}}>
					<EnterAdminPinPopup mode={tp.adminPinDialog.mode}/>
				</Dialog>
				<Dialog open={!!tp.confirmPopup} onRequestClose={tp.closeConfirmPopup} bodyClassName='sModal'>
					{tp.confirmPopup}
				</Dialog>
			</fb>
		)
	}
}


const mapStateToProps = (state) => {
	return {
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
		introVideoPopup: state.ui.app.introVideoPopup,

		confirmPopup: state.ui.app.confirmPopup,
		clientDateChecked: state.core.clientDateChecked,
		clientDateCorrect: state.core.clientDateCorrect,
	}
}


const mapDispatchToProps = (dispatch) => {
	return bindActionCreators({
		registerUsersDataListener,
		registerGroupsDataListener,
		registerBranchesDataListener,
		setQmLettersListener,
		removeSelectedUser,
		closeAdminPinDialog,
		openSelectbranchDialog,
		closeSelectbranchDialog,
		closeConfirmPopup,
		checkClientDate,
		selectBranch,
		closeIntroVideoPopup
	}, dispatch)
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Apps))

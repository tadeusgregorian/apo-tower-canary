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
	setAccountDetailsListener,
	checkClientDate,
	selectBranch
} from 'actions'

import {
	removeSelectedUser,
	closeAdminPinDialog,
	openSelectbranchDialog,
	closeSelectbranchDialog,
	closeConfirmPopup,
	openIntroVideoPopup,
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
		this.props.usersDataStatus 					=== 'NOT_REQUESTED' && this.props.registerUsersDataListener()
		this.props.groupsDataStatus 				=== 'NOT_REQUESTED' && this.props.registerGroupsDataListener()
		this.props.branchesDataStatus 			=== 'NOT_REQUESTED' && this.props.registerBranchesDataListener()
		this.props.qmLettersDataStatus  		=== 'NOT_REQUESTED' && this.props.setQmLettersListener()
		this.props.accountDetailsDataStatus === 'NOT_REQUESTED' && this.props.setAccountDetailsListener()

	}

	componentWillReceiveProps(nP) {
		const tP = this.props
		if(nP.branchesDataStatus !== 'LOADED') return
		!nP.selectedBranch && nP.branches.length > 1 && !tP.selectBranchDialog && tP.openSelectbranchDialog()
		!nP.selectedBranch && nP.branches.length === 1 && tP.selectBranch(nP.branches[0])
		nP.selectedBranch && !nP.branches.find(b => b.ID === nP.selectedBranch) && tP.selectBranch(nP.branches[0]) // important edge case scenario, when there is a selectedBranch in local storage, but that branch doesnt exists in this account.
		if(this.requiredDataJustLoaded(tP, nP) && nP.introVideoWatched !== 'sufficent') setTimeout(() => this.props.openIntroVideoPopup(), 2000)
	}

	componentDidUpdate(prevProps) {
		const tP = this.props
		const urlIncludesPublic = tP.location.pathname.includes('Public')
		const userJustEntered = tP.selectedUser && !prevProps.selectedUser
		if(urlIncludesPublic && tP.selectedUser && !userJustEntered) tP.removeSelectedUser()	// when redirected to a url containting 'Public' we remove the selectedUser -> props.selectedUser is what changes the UI
		if(!urlIncludesPublic && !tP.selectedUser) tP.history.push('/Apps/TaskManager/Kalender/Public') // someone is in non-public area, without a selectedUser -> redirect him OUT !
	}

	requiredDataLoaded = (props) => {
		if (!props.clientDateChecked)	return false
		if (props.usersDataStatus 					!== 'LOADED') return false
		if (props.branchesDataStatus  			!== 'LOADED') return false
		if (props.groupsDataStatus 					!== 'LOADED') return false
		if (props.qmLettersDataStatus 			!== 'LOADED') return false
		if (props.accountDetailsDataStatus 	!== 'LOADED') return false
		return true
	}

	requiredDataJustLoaded = (oldP, newP) => (!this.requiredDataLoaded(oldP) && this.requiredDataLoaded(newP))

	render() {
		const tp = this.props
		if(!this.requiredDataLoaded(tp)) return <fb>loading...</fb>
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
					<IntroVideoPopup closePopup={tp.closeIntroVideoPopup} introVideoWatched={tp.introVideoWatched} introVideoPopup={tp.introVideoPopup}/>
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
		branchesDataStatus: state.data.dataStatus.branchesDataStatus,
		qmLettersDataStatus: state.qmLetters.dataStatus,
		accountDetailsDataStatus: state.accountDetails.dataStatus,

		selectedBranch: state.core.selectedBranch,
		selectedUser: state.core.selectedUser,
		currentDay: state.ui.taskManager.currentDay,
		adminPinDialog: state.ui.app.adminPinDialog,
		selectBranchDialog: state.ui.app.selectBranchDialog,

		confirmPopup: state.ui.app.confirmPopup,
		clientDateChecked: state.core.clientDateChecked,
		clientDateCorrect: state.core.clientDateCorrect,
		introVideoWatched: state.accountDetails.data.introVideoWatched,
		introVideoPopup: state.ui.app.introVideoPopup,
	}
}


const mapDispatchToProps = (dispatch) => {
	return bindActionCreators({
		registerUsersDataListener,
		registerGroupsDataListener,
		registerBranchesDataListener,
		setQmLettersListener,
		setAccountDetailsListener,
		removeSelectedUser,
		closeAdminPinDialog,
		openSelectbranchDialog,
		closeSelectbranchDialog,
		closeConfirmPopup,
		checkClientDate,
		selectBranch,
		closeIntroVideoPopup,
		openIntroVideoPopup
	}, dispatch)
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Apps))

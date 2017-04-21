//@flow
import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import { Route, withRouter } from 'react-router-dom'
import {bindActionCreators} from 'redux';
import Dialog from 'material-ui/Dialog';
import SelectBranchDialog from 'components/selectBranchDialog';
import {
	registerUsersDataListener,
	registerGroupsDataListener,
	registerBranchesDataListener,
	setQmLettersListener,
	setRepeatingTasksListener,
	setSingleTasksListener
} from 'actions'

import Topbar from './topbar';
import TaskManager from './taskManager'
import QmApp from './qm'
import AdminPanel from './adminPanel'

class Apps extends PureComponent {
	constructor(props) {
		super(props)
		this.state = { selectBranchDialogIsOpen: false }
	}

	componentDidMount() {
		this.props.usersDataStatus 		== 'NOT_REQUESTED' && this.props.registerUsersDataListener()
		this.props.groupsDataStatus 	== 'NOT_REQUESTED' && this.props.registerGroupsDataListener()
		this.props.branchesDataStatus == 'NOT_REQUESTED' && this.props.registerBranchesDataListener()

		this.props.qmLettersDataStatus  == 'NOT_REQUESTED' && this.props.setQmLettersListener()
		window.selectedBranch = this.props.selectedBranch || null
	}

	componentWillReceiveProps(nP) {
		!nP.selectedBranch && nP.branches.length && this.setState({selectBranchDialogIsOpen: true})

		// Pull new Data from FB if Branch has changed ( when the active listenerPath doesnt contain current branchID)
		//const branchHasChanged = nP.repeatingTasks_listenerPath && !nP.repeatingTasks_listenerPath.includes(nP.selectedBranch)
		const branchHasChanged = nP.selectedBranch !== this.props.selectedBranch
		if(branchHasChanged) {
			console.log('BRANCH CHANGED')
			window.selectedBranch = nP.selectedBranch
			this.props.setRepeatingTasksListener()
			this.props.setSingleTasksListener()
		}
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
						<Topbar
							userMode={!!user}
							user={user}
							location={this.props.location}
							openSelectbranchDialog={() => this.setState({selectBranchDialogIsOpen: true})}/>
						<fb>
							<fb id="app">
								<Route path='/Apps/TaskManager' component={TaskManager} />
								<Route path='/Apps/QM/:userID' component={QmApp} />
								<Route path='/Apps/Admin' component={AdminPanel} />
							</fb>
						</fb>
					</fb>
					<Dialog open={this.state.selectBranchDialogIsOpen} modal={true}>
						<SelectBranchDialog close={() => this.setState({selectBranchDialogIsOpen: false})}/>
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
		repeatingTasks_listenerPath: state.firebaseListeners.repeatingTasks,
		currentDay: state.ui.taskManager.currentDay
	}
}


const mapDispatchToProps = (dispatch) => {
	return bindActionCreators({
		setRepeatingTasksListener,
		setSingleTasksListener,
		registerUsersDataListener,
		registerGroupsDataListener,
		setQmLettersListener,
		registerBranchesDataListener,
		setSelectedUser: (userID) => dispatch({type: 'SET_SELECTED_USER', payload: userID})
	}, dispatch);
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Apps))

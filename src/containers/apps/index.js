import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Dialog from 'material-ui/Dialog';
import SelectBranchDialog from 'components/selectBranchDialog';
import {registerUsersDataListener, registerGroupsDataListener, registerBranchesDataListener} from 'actions';
import {setQmLettersListener, setRepeatingTasksListener, setCheckedMiniListener} from 'actions';
import Topbar from './topbar';

class Apps extends PureComponent {
	constructor(props) {
		super(props)
		this.state = { selectBranchDialogIsOpen: false }
	}

	componentWillReceiveProps(nextProps, nextState) {
		// open selectBranchPopup if no branch is selected.
		if (!nextProps.selectedBranch && nextProps.branches && nextProps.branches.length && !nextState.selectBranchDialogIsOpen) {
			this.setState({selectBranchDialogIsOpen: true})
		}
	}

	componentWillMount() {
	 	this.props.usersDataStatus 		== 'NOT_REQUESTED' && this.props.registerUsersDataListener()
		this.props.groupsDataStatus 	== 'NOT_REQUESTED' && this.props.registerGroupsDataListener()
		this.props.branchesDataStatus == 'NOT_REQUESTED' && this.props.registerBranchesDataListener()

		this.props.qmLettersDataStatus 				== 'NOT_REQUESTED' && this.props.setQmLettersListener()
		this.props.repeatingTasks_dataStatus 	== 'NOT_REQUESTED' && this.props.setRepeatingTasksListener()

		this.props.params.id && this.props.setSelectedUser(this.props.params.id)
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
		const user = this.props.params.id && this.props.users && this.props.users.find(u => u.ID == this.props.params.id)
		return (
				<fb id="root">
					<fb className="vertical">
						<Topbar
							userMode={!!user}
							user={user}
							params={this.props.params}
							location={this.props.location}
							openSelectbranchDialog={() => this.setState({selectBranchDialogIsOpen: true})}/>
						<fb>
							<fb id="app">
								{React.cloneElement(this.props.children, {user})}
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
		repeatingTasks_dataStatus: state.taskManager.repeatingTasks_dataStatus,
		checkedMini_dataStatus: state.taskManager.checkedMini_dataStatus,
		selectedBranch: state.core.selectedBranch,
	}
}


const mapDispatchToProps = (dispatch) => {
	return bindActionCreators({
		registerUsersDataListener,
		registerGroupsDataListener,
		setQmLettersListener,
		registerBranchesDataListener,
		setRepeatingTasksListener,
		setCheckedMiniListener,
		setSelectedUser: (userID) => dispatch({type: 'SET_SELECTED_USER', payload: userID})
	}, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Apps);

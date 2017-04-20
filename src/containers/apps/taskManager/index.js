import React, {PureComponent} from 'react';
import { Route } from 'react-router-dom'
import Calendar 				from './calendar'
import TasksEdit 				from './editing'
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Navbar from 'components/navbar';
import SelectUserBar from 'components/selectUserBar';
import {
	setRepeatingTasksListener,
	setSingleTasksListener,
} from 'actions'
import _ from 'lodash';

class TaskManager extends PureComponent {

	componentDidMount = () => {
		console.log('ComponentDidMount: ', TaskManager)
		this.props.repeatingTasks_dataStatus 	== 'NOT_REQUESTED' && this.props.setRepeatingTasksListener()
		this.props.singleTasks_dataStatus 		== 'NOT_REQUESTED' && this.props.setSingleTasksListener()
	}

	render() {
		const { selectedUser , match, selectedBranch} = this.props
		const navBarRoutes = [
			{name: "Kalender", 	path: 'Apps/TaskManager/Kalender'},
			{name: "Editor", 		path: 'Apps/TaskManager/Editor'}
		]

		return (
			<main className="vertical">
				{ selectedUser ?
					<Navbar user={selectedUser} routes={navBarRoutes}/> :
					<SelectUserBar selectedBranch={selectedBranch}/>
				}
				<Route path={match.url + '/Kalender'} component={Calendar}/>
				<Route path={match.url + '/Editor'}   component={TasksEdit}/>
			</main>
		)
	}
}

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators({
		setRepeatingTasksListener,
		setSingleTasksListener,
		setSelectedUser: (userID) => dispatch({type: 'SET_SELECTED_USER', payload: userID})
	}, dispatch);
};

const mapStateToProps = (state) => {
	return {
		selectedBranch: state.core.selectedBranch,
		selectedUser: state.core.selectedUser,
		repeatingTasks_dataStatus: state.taskManager.repeatingTasks_dataStatus,
		singleTasks_dataStatus: state.taskManager.singleTasks_dataStatus
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(TaskManager);

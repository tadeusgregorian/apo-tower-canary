import React, {PureComponent} from 'react';
import { Route } from 'react-router-dom'
import Calendar 				from './calendar'
import TasksEdit 				from './editing'
import {connect} from 'react-redux';
import Navbar from 'components/navbar';
import SelectUserBar from 'components/selectUserBar';
import _ from 'lodash';

class TaskManager extends PureComponent {

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

const mapStateToProps = (state) => {
	return {
		selectedBranch: state.core.selectedBranch,
		selectedUser: state.core.selectedUser
	};
};

export default connect(mapStateToProps)(TaskManager);

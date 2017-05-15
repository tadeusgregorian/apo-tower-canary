// @flow

import React, {PureComponent} from 'react';
import { Route, Redirect } from 'react-router-dom'
import Calendar 				from './calendar'
import TasksEdit 				from './editing'
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
//import Navbar from 'components/navbar';
import SelectUserBar from 'components/selectUserBar';
import { setTaskManagerListeners, refreshTaskManagerListeners } from 'actions/index'
import _ from 'lodash';

class TaskManager extends PureComponent {

	componentDidMount = () => this.props.setTaskManagerListeners()

	componentWillReceiveProps = (nP) => {
		const branchHasChanged = nP.selectedBranch !== this.props.selectedBranch
		if(branchHasChanged) this.props.refreshTaskManagerListeners()
	}

	render() {
		const { selectedUser , match, selectedBranch } = this.props
		// const navBarRoutes = [
		// 	{name: "Kalender", 	path: 'Apps/TaskManager/Kalender'},
		// 	{name: "Editor", 		path: 'Apps/TaskManager/Editor'}
		// ]

		return (
			<main className="vertical">
				{ !selectedUser &&
					//<Navbar user={selectedUser} routes={navBarRoutes}/> :
					<SelectUserBar selectedBranch={selectedBranch}/>
				}
				<Route path={match.url} exact render={() => <Redirect to={match.url+'/Kalender'}/>} />
				<Route path={match.url + '/Kalender'} component={Calendar}/>
				<Route path={match.url + '/Editor'}   component={TasksEdit}/>
			</main>
		)
	}
}

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators({
		setTaskManagerListeners,
		refreshTaskManagerListeners,
	}, dispatch);
};

const mapStateToProps = (state) => {
	return {
		selectedBranch: state.core.selectedBranch,
		selectedUser: state.core.selectedUser,
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(TaskManager);

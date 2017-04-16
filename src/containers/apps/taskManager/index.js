import React, {PureComponent} from 'react';
import { Route } from 'react-router-dom'
import Calendar 				from './calendar'
import TasksEdit 				from './editing'
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {setRepeatingTasksListener} from 'actions';
import Navbar from 'components/navbar';
import SelectUserBar from 'components/selectUserBar';
import _ from 'lodash';

class TaskManager extends PureComponent {

	render() {
		const {user, match} = this.props
		return (
			<main className="vertical">
				{ user ?
					<Navbar
						user={user}
						location={this.props.location}
						routes={[
							{name: "Kalender", 	path: `Apps/TaskManager/Kalender/${user.ID}`},
							{name: "Editor", 		path: `Apps/TaskManager/Editor/${user.ID}/`}
						]}
					/> :
					<SelectUserBar selectedBranch={this.props.selectedBranch}/>
					}
					<Route path={match.url + '/Kalender'} component={Calendar}/>
					<Route path={match.url + '/Editor'} 	component={TasksEdit}/>
			</main>
		)
	}
}

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators({
		setRepeatingTasksListener
	}, dispatch);
};

const mapStateToProps = (state) => {
	return {
		selectedBranch: state.core.selectedBranch
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(TaskManager);

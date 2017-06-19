import React, { PureComponent } from 'react';
import { Route } 			from 'react-router-dom'
import { connect } 							from 'react-redux';
import { bindActionCreators } 	from 'redux';

import Calendar 			from './calendar'
import Editor 				from './editor'
import Replacements 	from './replacements'
import SelectUserTopbar 	from 'components/selectUserTopbar';

import { setTaskManagerListeners, refreshTaskManagerListeners } from 'actions/index'
import _ from 'lodash'

class TaskManager extends PureComponent {

	componentDidMount = () => this.props.setTaskManagerListeners()

	componentWillReceiveProps = (nP) => {
		const branchHasChanged = nP.selectedBranch !== this.props.selectedBranch
		if(branchHasChanged) this.props.refreshTaskManagerListeners()
	}

	render() {
		const { selectedUser , match, selectedBranch } = this.props

		return (
			<fb className="vertical height100">
				{ !selectedUser && <SelectUserTopbar selectedBranch={selectedBranch}/> }
				{/* <Route path={match.url} exact render={() => <Redirect to={match.url+'/Kalender'}/>} /> */}
				<Route path={match.url + '/Kalender'} 	component={Calendar}/>
				<Route path={match.url + '/Editor'}   	component={Editor}/>
				<Route path={match.url + '/Vertretung'} component={Replacements}/>
			</fb>
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

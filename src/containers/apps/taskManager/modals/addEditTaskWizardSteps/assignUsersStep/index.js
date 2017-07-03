import React, { PureComponent } from 'react';
import _ from 'lodash';
import {connect} from 'react-redux';
import SelectUsersBox from 'components/selectUsersBox'
import './styles.css'

class AssignUsersStep extends PureComponent {

	componentWillMount = () =>  {
		this.props.setStepTitle('Weisen Sie die Aufgabe zu')
		this.props.setStepCompleteChecker((task) => !!_.keys(task.assignedUsers).length)
	}

	selectDeselectUser = (uID) => {
		const oldAU = this.props.OTask.assignedUsers
		const newAU = oldAU && oldAU[uID] ? _.omit(oldAU, uID) : { ...oldAU, [uID]: 1 }
		this.props.editOTask({assignedUsers: newAU})
	}

	render = () => (
		<fb className='tasksAssignUsersMain'>
			<SelectUsersBox
				users={this.props.users}
				selectedUsers={_.keys(this.props.OTask.assignedUsers)}
				userClicked={this.selectDeselectUser}
			/>
		</fb>
	)
}

const mapStateToProps = (state) => {
	return {
		users: state.data.users.filter(u => u.branches[state.core.selectedBranch]).filter(u => !u.deleted), // we filter here already, because we just deal with this branch here.
		groups: state.data.groups
	}
}

export default connect(mapStateToProps)(AssignUsersStep);

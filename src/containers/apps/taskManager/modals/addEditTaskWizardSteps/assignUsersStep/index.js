import React, { PureComponent } from 'react';
import cN from 'classnames';
import {filterUsersByGroup} from 'helpers';
import _ from 'lodash';
import {connect} from 'react-redux';
import ChipBar from 'components/chipBar'
import SelectUsersBox from 'components/selectUsersBox'
import './styles.css'

class AssignUsersStep extends PureComponent {
	constructor(props) {
		super(props)
		this.state = { selectedGroups: [] }
	}

	componentWillMount = () =>  {
		this.props.setStepTitle('Weisen sie die Aufgabe zu')
		this.props.setStepCompleteChecker((task) => !!_.keys(task.assignedUsers).length)
	}

	selectUsersByGroup = (gID) => {
		let selectedGroups = _.clone(this.state.selectedGroups)
		const index = selectedGroups.indexOf(gID)
		index < 0 ? selectedGroups.push(gID) : selectedGroups.splice(index, 1)
		this.setState({selectedGroups: selectedGroups })

		let selectedUsersIds = {}
		for (let i of selectedGroups) {
			let usersArray = filterUsersByGroup(this.props.users, i)
			for (let f of usersArray) {
				selectedUsersIds[f.ID] = 1
			}
		}
		this.props.editOTask({assignedUsers: selectedUsersIds})
	}

	selectDeselectUser = (uID) => {
		const oldAU = this.props.OTask.assignedUsers
		const newAU = oldAU && oldAU[uID] ? _.omit(oldAU, uID) : { ...oldAU, [uID]: 1 }
		this.props.editOTask({assignedUsers: newAU})
	}

	render() {
		return (
			<fb className='assignUsersMain'>
				<ChipBar
					chips={this.props.groups}
					selectedChips={this.state.selectedGroups}
					chipClicked={this.selectUsersByGroup}
				/>
				<SelectUsersBox
					users={this.props.users}
					selectedUsers={this.props.OTask.assignedUsers}
					userClicked={this.selectDeselectUser}
				/>
			</fb>
		)
	}
}

const mapStateToProps = (state) => {
	return {
		users: state.data.users.filter(u => u.branches && u.branches[state.core.selectedBranch]), // we filter here already, because we just deal with this branch here.
		groups: state.data.groups
	}
}

export default connect(mapStateToProps)(AssignUsersStep);

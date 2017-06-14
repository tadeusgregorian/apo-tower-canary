import React, { PureComponent } from 'react';
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

		this.replacements = {}
		_.keys(props.OTask.assignedUsers).forEach(uID => {
			props.OTask.assignedUsers[uID] !== 1 && (this.replacements[uID] = props.OTask.assignedUsers[uID])
		})
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
				selectedUsersIds[f.ID] = this.oneOrReplacer(f.ID)
			}
		}
		this.props.editOTask({assignedUsers: selectedUsersIds})
	}

	selectDeselectUser = (uID) => {
		const oldAU = this.props.OTask.assignedUsers
		const newAU = oldAU && oldAU[uID] ? _.omit(oldAU, uID) : { ...oldAU, [uID]: this.oneOrReplacer(uID) }
		this.props.editOTask({assignedUsers: newAU})
	}

	// if there is a replacement ( only in edit mode ) we return that otherwise 1
	// so we preserve the replacement when deselecting and selecting the user again
	oneOrReplacer = (uID) => (this.replacements[uID] || 1)

	render() {
		console.log(this.props.OTask.assignedUsers)
		console.log(this.replacements)

		return (
			<fb className='tasksAssignUsersMain'>
				<ChipBar
					chips={this.props.groups}
					selectedChips={this.state.selectedGroups}
					chipClicked={this.selectUsersByGroup}
				/>
				<SelectUsersBox
					users={this.props.users}
					selectedUsers={_.keys(this.props.OTask.assignedUsers)}
					userClicked={this.selectDeselectUser}
				/>
			</fb>
		)
	}
}

const mapStateToProps = (state) => {
	return {
		users: state.data.users.filter(u => u.branches[state.core.selectedBranch]).filter(u => !u.deleted), // we filter here already, because we just deal with this branch here.
		groups: state.data.groups
	}
}

export default connect(mapStateToProps)(AssignUsersStep);

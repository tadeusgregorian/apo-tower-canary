import React, {Component} from 'react';
import {connect} from 'react-redux';
import {filterUsersByBranch, filterUsersByGroup} from 'helpers'
import ChipBar from 'components/chipBar'
import SelectUsersBox from 'components/selectUsersBox'
import _ from 'lodash';
import './styles.css';


class AssignUsersStep extends Component {
	constructor(props) {
		super(props)

		this.state = { selectedGroups: [], selectedBranches: [] }
	}

	componentWillMount = () =>  {
		this.props.setStepTitle('Mitarbeiter auswählen')
		this.props.setStepCompleteChecker((qm) => !!_.keys(qm.assignedUsers).length)
	}

	selectUsersByGroup = (gID) => {
		const selecteds = this.state.selectedGroups
		const deselecting = _.includes(selecteds, gID)
		const newGroups =  deselecting ? _.without(selecteds, gID) : _.concat(selecteds, gID)

		this.setState({selectedGroups: newGroups})

		let selectedUsersIds = {}
		for (let i of newGroups) {
			let usersArray = filterUsersByGroup(this.props.users, i).filter(u => u.ID !== this.props.selectedUser)
			let usersArrayFiltered = []
			let selectedBranches =  (this.state.selectedBranches.length > 0) ? this.state.selectedBranches : this.props.branches.map(b => b.ID)  // if non branch selected, there should be no branch filter.
			for (let b of selectedBranches) { usersArrayFiltered.push(...filterUsersByBranch(usersArray, b)) }
			for (let f of usersArrayFiltered) { selectedUsersIds[f.ID] = 1 }
		}
		this.props.editOTask({assignedUsers: selectedUsersIds})
	}

	selectDeselectUser = (uID) => {
		const oldAU = this.props.OTask.assignedUsers
		const newAU = oldAU && oldAU[uID] ? _.omit(oldAU, uID) : { ...oldAU, [uID]: 1 }
		this.props.editOTask({assignedUsers: newAU})
	}

	selectUsersByBranch = (bID) => {
		const selecteds = this.state.selectedBranches
		const deselecting = _.includes(selecteds, bID)
		const newBras =  deselecting ? _.without(selecteds, bID) : _.concat(selecteds, bID)

		this.setState({selectedBranches: newBras})

		let selectedUsersIds = {}
		for (let i of newBras) {
			let usersArray = filterUsersByBranch(this.props.users, i).filter(u => u.ID !== this.props.selectedUser)
			for (let f of usersArray) { selectedUsersIds[f.ID] = 1 }
		}
		this.props.editOTask({assignedUsers: selectedUsersIds});
	}

	render() {
		console.log(this.props.OTask.assignedUsers)

		return (
			<fb className="qmAssignUsersStep">
				{ this.props.branches.length > 1 &&
					<fb className="chipBarBranches chipbarWrapper">
						<ChipBar
							chips={this.props.branches}
							selectedChips={this.state.selectedBranches}
							chipClicked={this.selectUsersByBranch}
						/>
					</fb>
				}
					<fb className="chipBarGroups chipbarWrapper">
						<ChipBar
							chips={this.props.groups}
							selectedChips={this.state.selectedGroups}
							chipClicked={this.selectUsersByGroup}
						/>
					</fb>
					<fb className="selectUsersBox">
						<SelectUsersBox
							users={this.props.users.filter(u => u.ID !== this.props.selectedUser)}
							selectedUsers={_.keys(this.props.OTask.assignedUsers)}
							userClicked={this.selectDeselectUser}
						/>
					</fb>
			</fb>
		)
	}
}

const mapStateToProps = (state) => {
	return {
		selectedUser: state.core.selectedUser,
		users: state.data.users.filter(u => !u.deleted),
		groups: state.data.groups,
		branches: state.data.branches
	}
}

export default connect(mapStateToProps)(AssignUsersStep);

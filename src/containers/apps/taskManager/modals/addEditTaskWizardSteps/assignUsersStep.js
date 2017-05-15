import React, { PureComponent } from 'react';
import cN from 'classnames';
import {filterUsersByGroup} from 'helpers';
import _ from 'lodash';
import {connect} from 'react-redux';
import WizardFooter from 'components/wizardFooter'
import 'styles/modals.css';

class AssignUsersStep extends PureComponent {
	constructor(props) {
		super(props)

		this.state = { selectedGroups: [] }
	}

	selectUsersByGroup(g) {
		let selectedGroups = _.clone(this.state.selectedGroups)
		let index = selectedGroups.indexOf(g.ID)
		index < 0 ? selectedGroups.push(g.ID) : selectedGroups.removeAt(index)
		this.setState({selectedGroups: selectedGroups})

		let selectedUsersIds = {}
		for (let i of selectedGroups) {
			let usersArray = filterUsersByGroup(this.props.users, i)
			for (let f of usersArray) {
				selectedUsersIds[f.ID] = 1
			}
		}
		this.props.editOTask({assignedUsers: selectedUsersIds})
	}

	selectDeselectUser(uID) {
		const oldAU = this.props.OTask.assignedUsers
		const newAU = oldAU && oldAU[uID] ? _.omit(oldAU, uID) : { ...oldAU, [uID]: 1 }
		this.props.editOTask({assignedUsers: newAU})
	}

	render() {
		const assignedUsers = this.props.OTask.assignedUsers
		return (
			<fb>
				<content>
				<header>
					<h3>Nutzer zuweisen</h3>
				</header>
					<fb className="user-group-wrapper">
						{this.props.groups.map(g => {
							let isSelected = (this.state.selectedGroups.indexOf(g.ID) >= 0);
							return (
								<div key={g.ID} className={cN({"user-group": true, "selected": isSelected})} style={{
									backgroundColor: (isSelected ? 'blue' : "#BBBBBB") }} onClick={() => this.selectUsersByGroup(g)}>
									{g.name}
								</div>
							)
						})}
					</fb>

					<fb className="modal-user-wrapper padding-top">
						{this.props.users.map(u => {
							let isSelected = assignedUsers && assignedUsers[u.ID]
							return (
								<fb key={u.ID} className={cN({'modal-user': true, 'selected': isSelected})} onClick={() => this.selectDeselectUser(u.ID)} style={{
									color: (isSelected ? 'blue': '#353535'), borderColor: (isSelected ? 'blue' : 'grey')
								}}>
									{u.name}
								</fb>
							)
						})}
					</fb>
				</content>
				<WizardFooter
					disableForward={_.keys(this.props.OTask.assignedUsers).length===0}
					stepForward={this.props.saveTaskToDB}
					stepBackward={this.props.stepBackward}
					finalStep={true}
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

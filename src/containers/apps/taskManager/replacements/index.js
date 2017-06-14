import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import _ from 'lodash';

import Dialog from 'material-ui/Dialog';
import { getTodaySmart } from 'helpers'
import { addReplacement, removeReplacement } from 'actions'

import Tasks						from './tasks'
import ListHead  				from './listHead'

import TaskDetailsPopup from '../modals/taskDetailsPopup'
import SelectUserPopup 	from 'components/selectUserPopup'
import './styles.css'

class Editor extends PureComponent {
	constructor(props) {
		super(props)

		this.state = {
			taskDetailsPopupOpen: false,
			selectUserPopupOpen: 	false,
		}
	}

	removeReplacement = (taskID) => removeReplacement(taskID, this.props.selectedUser)

	openReplacementPopup = (task) => {
		const { selectedUser, selectedBranch, users } = this.props
		const relevantUsers = users.filter(u => u.ID !== selectedUser && u.branches[selectedBranch])
		this.selectUserPopup = (
			<SelectUserPopup
				users={relevantUsers} // users of this Branch except selectedUser
				selectedUser={task.assignedUsers[selectedUser]} // sorry very confusing: selectedUser used twice as name... ( TODO: change name of state.core.selectedUser )
				blockedUsers={_.keys(task.assignedUsers)}
				onUserSelected={(replacer) => addReplacement(task.ID, selectedUser, replacer)}
				whyBlocked='ist bereits für diese Aufgabe verantwortlich'
				title='Vertretung auswählen'
				onClose={() => this.setState({selectUserPopupOpen: false})}
			/>
		)
		this.setState({selectUserPopupOpen: true})
	}

	openTaskDetailsPopup = (task) => {
		console.log(task);
		this.taskDetailsPopup = (
			<TaskDetailsPopup
				task={task}
				users={this.props.users}
				withoutFooter={true}
				onClose={() => this.setState({taskDetailsPopupOpen: false})}
			/>
		)
		this.setState({taskDetailsPopupOpen: true})
	}

	taskIsNotInPast = (t) => {
		return (!t.endDate) || t.endDate > getTodaySmart()
	}

	render() {
		return (
			<fb className="replacementsMain">
					<fb className="replacementsContent">
						<fb className="replacementInfoText">
						</fb>
						<fb className="taskListWrapper">
							<ListHead selectedCategory={this.state.selectedCategory}/>
							<Tasks
								removeReplacement={this.removeReplacement}
								openTaskDetailsPopup={this.openTaskDetailsPopup}
								openReplacementPopup={this.openReplacementPopup}
								tasks={this.props.repeatingTasks.filter(this.taskIsNotInPast)}
								users={this.props.users}
								selectedUser={this.props.selectedUser}
							/>
						</fb>
						<Dialog
							bodyClassName='sModal'
							open={this.state.taskDetailsPopupOpen}
							onRequestClose={() => this.setState({taskDetailsPopupOpen: false})}>
							{this.taskDetailsPopup}
						</Dialog>
						<Dialog
							bodyClassName='sModal'
							open={this.state.selectUserPopupOpen}
							onRequestClose={() => this.setState({selectUserPopupOpen: false})}>
							{this.selectUserPopup}
						</Dialog>
					</fb>
				</fb>
		)
	}
}

const mapStateToProps = (state) => {
	return {
		repeatingTasks: state.taskManager.repeatingTasks.filter(t => t.assignedUsers[state.core.selectedUser]),
		users: state.data.users,
		selectedUser: state.core.selectedUser,
		selectedBranch: state.core.selectedBranch,
	}
}

export default connect(mapStateToProps)(Editor)

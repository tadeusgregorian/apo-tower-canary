import React, { PureComponent } from 'react';
import cN from 'classnames';
import { getTypeAndPatternOfTask } from 'helpers';
import RaisedButton from 'material-ui/RaisedButton';
import AssignedUsers from 'components/assignedUsers';
import moment from 'moment'
import _ from 'lodash'
import 'styles/modals.css';
import './styles.css';


export default class TaskDetailsPopup extends PureComponent {

	editTask = () => {
		this.props.close()
		this.props.openEditTaskWizard(this.props.task)
	}

	deleteTask = () => {
		this.props.close()
		this.props.openDeleteTaskPopup(this.props.task)
	}

	render() {
		const t = this.props.task
		const taskTypeAndPattern = getTypeAndPatternOfTask(t);

		return (
			<fb className="modal taskDetailsPopup">
				<header>
					<h4 className="no-margin">{t.subject}</h4>
					{ t.prio > 0 ? <p><b style={{color: 'red'}}>Aufgabe mit hoher Priorität</b></p> : null }
					<p>Erstellt von <b>{this.props.users.find(u => u.ID===t.creatorID).name }
					</b> am <b> {moment(t.creationDate).format('DD.MM.YYYY')}</b></p>
					<p><b>{taskTypeAndPattern.type} </b> {(taskTypeAndPattern.patternFullLength || taskTypeAndPattern.pattern)}</p>
					<fb className="assignedUsersWrapper">
						<AssignedUsers assignedUsers={_.keys(t.assignedUsers)} users={this.props.users} />
					</fb>
				</header>
				<footer>
					<RaisedButton
					  onClick={this.editTask}
					  label="Bearbeiten"
					  primary={true}
					  disabled={!this.props.editable}
					/>
					<RaisedButton
						className="margin-left"
						onClick={this.deleteTask}
						label={t.onetimerDate || t.irregularDates ? "Löschen" : "Löschen"}
						primary={true}
						disabled={!this.props.editable}
					/>
				</footer>
			</fb>
		)
	}
}

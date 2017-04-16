import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import 'styles/modals.scss';
import {TaskType} from 'constants'
import {getTodaySmart} from 'helpers'


export default class ChooseTypeStep extends Component {

	getInitialOTask = (type) => {
		switch (type) {
		case TaskType.weekly :
		case TaskType.monthly :
		case TaskType.daily :	return {type: type, startDate: getTodaySmart()}
		case TaskType.yearly : return {type: type, startDate: getTodaySmart(), yearly: [getTodaySmart()]}
		case TaskType.onetimer : return {type: type, onetimerDate: getTodaySmart()}
		case TaskType.irregular : return {type: type, irregularDates: [getTodaySmart()]}
		default: return null
		}
	}

	taskTypeSelected = (type) => {
		this.props.setOTask(this.getInitialOTask(type))
		this.props.stepForward()
	}

	render() {
		return (
			<div className="chooseTypeStep">
				<header>
					<h3>Typ auswählen</h3>
				</header>
				<content className="horizontal offset j-center a-center wrap margin-bottom">
					<fb className="nonRepetetiveTasks buttonsWrapper">
						<RaisedButton primary={true} label="Einmalig" onClick={() => this.taskTypeSelected(TaskType.onetimer)} />
						<RaisedButton primary={true} label="Multidatum" onClick={() => this.taskTypeSelected(TaskType.irregular)} />
					</fb>
					<fb className="repetetiveTasks buttonsWrapper">
						<RaisedButton primary={true} label="Täglich" onClick={() => this.taskTypeSelected(TaskType.daily)} />
						<RaisedButton primary={true} label="Wöchentlich" onClick={() => this.taskTypeSelected(TaskType.weekly)} />
						<RaisedButton primary={true} label="Monatlich" onClick={() => this.taskTypeSelected(TaskType.monthly)} />
						<RaisedButton primary={true} label="Jährlich" onClick={() => this.taskTypeSelected(TaskType.yearly)} />
					</fb>
				</content>
			</div>
		);
	}
}

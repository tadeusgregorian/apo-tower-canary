import React, { Component } from 'react';
import SButton from 'components/sButton';
import {TaskType} from 'constants'
import {getTodaySmart} from 'helpers'
import './styles.css';


export default class ChooseTypeStep extends Component {

	componentWillMount(){
		this.props.setStepTitle('Aufgabentyp auswählen')
		this.props.removeFooter()
	}

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

	onClick = (type) => {
		this.props.setOTask(this.getInitialOTask(type))
		this.props.stepForward()
	}

	bStyle = () => ({
		width: '280px',
    height: '36px'
	})

	render() {
		return (
			<fb className="chooseTypeStep">
					<fb className="nonRepetetiveTasks buttonsWrapper">
						<SButton label="Einmalig" 	onClick={() => this.onClick(TaskType.onetimer)}  color={'#2ECC71'} sStyle={this.bStyle()}/>
						<SButton label="Multidatum" onClick={() => this.onClick(TaskType.irregular)} color={'#2ECC71'} sStyle={this.bStyle()} />
					</fb>
					<fb className="repetetiveTasks buttonsWrapper wBorderLeft">
						<SButton label="Täglich" 			onClick={() => this.onClick(TaskType.daily)}   color={'#2ECC71'} sStyle={this.bStyle()}/>
						<SButton label="Wöchentlich" 	onClick={() => this.onClick(TaskType.weekly)}  color={'#2ECC71'} sStyle={this.bStyle()}/>
						<SButton label="Monatlich" 		onClick={() => this.onClick(TaskType.monthly)} color={'#2ECC71'} sStyle={this.bStyle()}/>
						<SButton label="Jährlich" 		onClick={() => this.onClick(TaskType.yearly)}  color={'#2ECC71'} sStyle={this.bStyle()}/>
					</fb>
			</fb>
		);
	}
}

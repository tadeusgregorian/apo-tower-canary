import React  from 'react';
import {PureComponent} from 'react';
import _ from 'lodash'
import './styles.scss';
import UndoneTasksButton from './undoneTasksButton';
import moment from 'moment'
import DateNavigator from './dateNavigator'


export default class DayHead extends PureComponent {
/* eslint-disable no-unused-vars */

	render() {
		const dayMoment = moment(this.props.currentDay, 'YYYYMMDD')
		const { isFuture, userMode, jumpToDate, numberOfUndoneTasks, lastDateWithUndoneTask} = this.props

		console.log(this.props.lastDateWithUndoneTask)
		return (
			<fb className="head">
				<fb className="a-center">
					<fb className="date">{(dayMoment.format('dddd DD')+'. '+dayMoment.format('MMM').toUpperCase().substr(0, 3))}</fb>

					{ isFuture ?
						<fb className="futurePastIndicator">ZUKUNFT</fb> :
						<UndoneTasksButton
							jumpToDate={jumpToDate}
							numberOfUndoneTasks={numberOfUndoneTasks}
							lastDateWithUndoneTask={lastDateWithUndoneTask}/>
					}

					{	userMode &&
						<fb className='addTaskButton' onClick={this.props.openAddEditTaskWizard}>
							<fb className='addTaskButtonIconWrapper'><icon className='icon icon-plus'/></fb>
							<fb className='addTaskButtonText'>NEUE AUFGABE</fb>
						</fb> }

				</fb>
				<DateNavigator {...this.props} />
			</fb>
		)
	}
}

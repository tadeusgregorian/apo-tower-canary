import React  from 'react';
import {PureComponent} from 'react';
import _ from 'lodash'
import './styles.css';
import UndoneTasksButton from './undoneTasksButton';
import moment from 'moment'
import DateNavigator from './dateNavigator'


export default class DayHead extends PureComponent {

	render() {
		const dayMoment = moment(this.props.currentDay, 'YYYYMMDD')
		const { isFuture, userMode, numberOfUndoneTasks, openUndoneTasksModal} = this.props

		return (
			<fb className="head">
				<fb className="a-center">
					<fb className="date" style={{marginLeft: userMode ? '39px' : '4px'}}>
						{(dayMoment.format('dddd DD')+'. '+dayMoment.format('MMM').toUpperCase().substr(0, 3))}
					</fb>

					{ isFuture ?
						<fb className="futurePastIndicator"></fb> :
						<UndoneTasksButton
							numberOfUndoneTasks={numberOfUndoneTasks}
							openUndoneTasksModal={openUndoneTasksModal}
						/>
					}

					{	userMode &&
						<fb className='addTaskButton' onClick={this.props.openAddEditTaskWizard}>
							<fb className='addTaskButtonIconWrapper'><icon className='icon icon-plus'/></fb>
						</fb> }

				</fb>
				<DateNavigator {...this.props} />
			</fb>
		)
	}
}

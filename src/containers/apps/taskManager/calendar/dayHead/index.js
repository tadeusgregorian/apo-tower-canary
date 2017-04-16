import cN  from 'classnames';
import React  from 'react';
import {PureComponent} from 'react';
import _ from 'lodash'
import './styles.scss';
import Paging from './paging';
import OpenTasksFromPastBlock from './openTasksFromPastBlock';
import moment from 'moment'


export default class DayHead extends PureComponent {

	getNumberOfUncheckedTasks = () => {
		let count = 0;
		const grid = this.props.uncheckedTasksGrid
		_.values(grid).forEach(day => count += day.length)
		return count
	}

	getLastDayWithUncheckedTask = () => {
		const currentDay 	= this.props.currentDay
		const gridCleaned = _.omitBy(this.props.uncheckedTasksGrid, (taskIDs => taskIDs.length == 0))
		const daysArray  	= _.keys(gridCleaned).sort()
		const daysInPast 	= daysArray.filter(d => d < currentDay)
		let dateToJumpTo 	= (daysInPast.length == 0) ? daysArray[daysArray.length - 1] : daysInPast[daysInPast.length - 1]
		// if we are already at the beginning of the grid, it jumps to the end again
		return parseInt(dateToJumpTo)
	}

	render() {
		const dayMoment = moment(this.props.currentDay, 'YYYYMMDD')
		const numberOfUncheckedTasks = this.getNumberOfUncheckedTasks()

		return (
			<fb className="head">
				<fb className="a-center">
					<fb className="date"> {dayMoment.format('dddd DD')}. {dayMoment.format('MMM').toUpperCase().substr(0, 3)}</fb>
					{this.props.isFuture ? <fb className="futurePastIndicator">ZUKUNFT</fb> :
						<OpenTasksFromPastBlock
							clickHandler={() => numberOfUncheckedTasks && this.props.jumpToDate(this.getLastDayWithUncheckedTask())}
							numberOfUncheckedTasks={numberOfUncheckedTasks}
						/>
				  }
				</fb>
				<fb className="dayControl">
					<Paging clickHandler={() => this.props.onPagingHandler(-1)} direction={"left"} />
						<button
							onTouchTap={this.props.jumpToToday}
							disabled={this.props.isToday}
							className={cN({'disabled': this.props.isToday, 'jumpToTodayButton': true})}
						>Heute</button>
						<icon
							onTouchTap={this.props.openDatePicker}
							className="icon-calendar icon jumpToDateIcon"
						/>
					<Paging clickHandler={() => this.props.onPagingHandler(1)} direction={"right"} />
				</fb>
			</fb>
		)
	}
}

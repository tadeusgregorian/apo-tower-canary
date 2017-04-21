import cN  from 'classnames';
import React  from 'react';
import {PureComponent} from 'react';
import _ from 'lodash'
import './styles.scss';
import Paging from './paging';
import OpenTasksFromPastBlock from './openTasksFromPastBlock';
import moment from 'moment'


export default class DayHead extends PureComponent {

	render() {
		const dayMoment = moment(this.props.currentDay, 'YYYYMMDD')

		return (
			<fb className="head">
				<fb className="a-center">
					<fb className="date"> {dayMoment.format('dddd DD')}. {dayMoment.format('MMM').toUpperCase().substr(0, 3)}</fb>
					{this.props.isFuture ? <fb className="futurePastIndicator">ZUKUNFT</fb> :
						<OpenTasksFromPastBlock
							clickHandler={() => false && this.props.jumpToDate(()=>console.log('Do something TADE'))}
							numberOfUncheckedTasks='4'
						/>
				  }
					{	this.props.userMode &&
						<fb className='addTaskButton' onClick={this.props.openAddEditTaskWizard}>
							<fb className='addTaskButtonIconWrapper'><icon className='icon icon-plus'/></fb>
							<fb className='addTaskButtonText'>NEUE AUFGABE</fb>
						</fb>
					}
				</fb>
				<fb className="dayControl">
					<Paging clickHandler={this.props.goToNextDay} direction={"left"} />
						<button
							onTouchTap={this.props.jumpToToday}
							disabled={this.props.isToday}
							className={cN({'disabled': this.props.isToday, 'jumpToTodayButton': true})}
						>Heute</button>
						<icon
							onTouchTap={this.props.openDatePicker}
							className="icon-calendar icon jumpToDateIcon"
						/>
					<Paging clickHandler={this.props.goToPrevDay} direction={"right"} />
				</fb>
			</fb>
		)
	}
}

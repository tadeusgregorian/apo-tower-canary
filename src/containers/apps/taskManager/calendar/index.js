import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import _ from 'lodash';
import moment from 'moment'
import Day from './day';
import DayHead from './dayHead'
import {checkTask, uncheckTask, createTask} from 'actions';
import Dialog from 'material-ui/Dialog';
import CheckUncheckTaskPopup from '../modals/checkUncheckTaskPopup'
import DaysTransitionGroup from './daysTransitionGroup';

import composeWizard 			from 'composers/wizard'
import AssignUsersStep 		from '../modals/addEditTaskWizardSteps/assignUsersStep'
import ChooseTypeStep 		from '../modals/addEditTaskWizardSteps/chooseTypeStep'
import DefineContentStep 	from '../modals/addEditTaskWizardSteps/defineContentStep'
import SetTimingStep 			from '../modals/addEditTaskWizardSteps/setTimingStep'

import DatePicker from 'material-ui/DatePicker';
import { addDays, subtractDays } 			from 'helpers'
import { setSingleTasksListener } 		from 'actions'
import { extendTasksWithChecked } 		from 'selectors/extendTasksWithChecked'
import { taskDataLoaded }							from 'selectors/taskDataLoaded'
import { getLastDateWithUndoneTask }	from 'selectors/lastDateWithUndoneTask'
import './styles.scss';


class Calendar extends PureComponent {
	constructor(props) {
		super(props)

		this.state = { removeDay: false }
		this.today = parseInt(moment().format('YYYYMMDD'))
	}

	componentWillReceiveProps = (nP) => {
		const dayChanged = this.props.currentDay !== nP.currentDay
		dayChanged && this.props.setSingleTasksListener()
	}

	numberOfUndoneTasks = () => {
		if(!this.props.selectedUser) return this.props.undoneTasks.length
		return this.props.undoneTasks.filter(t => t.assignedUsers[this.props.selectedUser]).length
	}

	openAddEditTaskWizard = () => {
		this.props.openAddTaskWizard()
		let Wizard = composeWizard([ChooseTypeStep, SetTimingStep, DefineContentStep, AssignUsersStep])
		this.addEditTaskWizard = <Wizard saveTaskToDB={this.saveOperatingTaskToDB}/>
	}

	checkUncheckTask = (isUnchecking, taskObj, checkType, userID = this.props.selectedUser, shiftedTo = false) => {
		//playTaskCheckSound(); // come back here and put sound back in.
		if(!isUnchecking)  checkTask(taskObj, this.props.currentDay, checkType, userID, shiftedTo)
		if(isUnchecking) uncheckTask(taskObj, this.props.currentDay)
	}

	saveOperatingTaskToDB = () => {
		createTask({ ...this.props.operatingTask, creatorID: this.props.selectedUser })
		this.props.closeTaskWizard()
	}

	jumpToToday = () => 		 	this.moveToDay(this.today)
	jumpToDate  = (newDay) => this.moveToDay(newDay)
	goToNextDay = () => 			this.moveToDay(subtractDays(this.props.currentDay, 1))
	goToPrevDay = () => 			this.moveToDay(addDays(this.props.currentDay, 1))

	moveToDay = (newDay) => {
		this.setState({ removeDay: true, movingDayBackward: newDay < this.props.currentDay })
		setTimeout(()=>{
			this.props.setCurrentDay(newDay)
			this.setState({removeDay: false})
		}, 160)
	}

	renderDay = (day) => {
		return  [<Day
			users={this.props.users}
			key={day}
			day={day}
			tasks={this.props.tasks}
			tasksLoaded={this.props.taskDataLoaded}
			checkUncheckTask={this.checkUncheckTask}
			openCheckUncheckTaskPopup={this.props.setCheckingTask}
			selectedBranch={this.props.selectedBranch}
			selectedUser={this.props.selectedUser}
		/>]
	}


	render() {
		const userMode = !!this.props.selectedUser
		return (
			<content className="calendar">
				<fb className="daysWrapper">
					<DayHead
						goToNextDay={this.goToNextDay}
						goToPrevDay={this.goToPrevDay}
						isToday={this.props.currentDay == this.today}
						currentDay={this.props.currentDay}
						isFuture={this.props.currentDay > this.today}
						openAddEditTaskWizard={this.openAddEditTaskWizard}
						jumpToToday={this.jumpToToday}
						jumpToDate={this.jumpToDate}
						openDatePicker={() => this.refs.jumpToDatePicker.openDialog()}
						userMode={userMode}
						lastDateWithUndoneTask={this.props.lastDateWithUndoneTask}
						numberOfUndoneTasks={this.numberOfUndoneTasks()}
						loadingPastTasks={true} // COME BACK HERE
					/>
					<DaysTransitionGroup movingDirection={this.state.movingDayBackward}>
						{this.state.removeDay ? [] : this.renderDay(this.props.currentDay)}
					</DaysTransitionGroup>

				</fb>
				<DatePicker style={{"display": "none"}}
					ref='jumpToDatePicker'
					onChange={(e, d) => {if (!(typeof d === 'string' || d instanceof String)) this.jumpToDate(parseInt(moment(d).format('YYYYMMDD')))}}
					floatingLabelText="asd"
					cancelLabel="Abbrechen"
					autoOk={true}
					DateTimeFormat={window.DateTimeFormat}
					locale="de-DE"/>
				<Dialog open={!!this.props.checkingTask} onRequestClose={this.props.closeCheckingTask}>
					<CheckUncheckTaskPopup checkUncheck={this.checkUncheckTask}/>
				</Dialog>
				<Dialog
					className="materialDialog addEditTaskWizard"
					open={this.props.taskWizard === 'add'}
					onRequestClose={this.props.closeTaskWizard}
					children={this.addEditTaskWizard} />
			</content>
		);
	}
}

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators({
		createTask,
		setSingleTasksListener,
		openAddTaskWizard: 	() => ({type: 'OPEN_ADD_TASK_WIZARD'}),
		closeTaskWizard: 		() => ({type: 'CLOSE_TASK_WIZARD'}),
		setCheckingTask: 		(task) => ({type: 'SET_CHECKING_TASK', payload: task}),
		closeCheckingTask: 	() => ({type: 'CLOSE_CHECKING_TASK'}),
		setCurrentDay: 			(smartDate) => ({type: 'TASKS_SET_CURRENT_DAY', payload: smartDate})
	}, dispatch);
}

const mapStateToProps = (state) => {
	return {
		users: state.data.users,
		branches: state.data.branches,
		selectedBranch: state.core.selectedBranch,
		currentDay: state.ui.taskManager.currentDay,
		checkingTask: state.ui.taskManager.checkingTask,
		tasks: extendTasksWithChecked(state),
		taskDataLoaded: taskDataLoaded(state),
		lastDateWithUndoneTask: getLastDateWithUndoneTask(state),
		operatingTask: state.ui.taskManager.operatingTask,
		taskWizard: state.ui.taskManager.taskWizard,
		selectedUser: state.core.selectedUser,
		undoneTasks: state.taskManager.undoneTasks
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Calendar)

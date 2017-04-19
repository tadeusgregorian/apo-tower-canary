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
import { addDays, subtractDays, playTaskCheckSound, createShortGuid} from 'helpers'
import { setSingleTasksListener } from 'actions'
import { extendTasksWithChecked } from 'selectors/extendTasksWithChecked'
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

	openCheckUncheckTaskPopup = (task) => {
		this.checkUncheckTaskPopup = (<CheckUncheckTaskPopup
			data={task}
			checkUncheckTask={this.checkUncheckTask}
			shiftTaskTo={this.shiftTaskTo}
			close={this.props.closeCheckingTask}
			users={this.props.users}
			selectedUser={this.props.selectedUser}/>)
		this.props.setCheckingTask(task)
	}

	openAddEditTaskWizard = () => {
		this.props.openAddTaskWizard()
		let Wizard = composeWizard([ChooseTypeStep, SetTimingStep, DefineContentStep, AssignUsersStep])
		this.addEditTaskWizard = <Wizard saveTaskToDB={this.saveOperatingTaskToDB}/>
	}

	checkUncheckTask = (isUnchecking, taskID, checkType, userID = this.props.selectedUser, shiftedTo = false, taskObj = null) => {
		playTaskCheckSound();
		const {selectedBranch, currentDay, checked} = this.props
		const checkedID = isUnchecking && checked.find(c => c.taskID == taskID).ID
		if(!isUnchecking)  checkTask(selectedBranch, taskID, currentDay, checkType, userID, shiftedTo, taskObj)
		if(isUnchecking) uncheckTask(selectedBranch, taskID, currentDay, checkedID)
	}

	saveOperatingTaskToDB = () => {
		const newTask = {
			...this.props.operatingTask,
			ID: createShortGuid(),
			creationDate: moment().toISOString(),
			creatorID: this.props.selectedUser
		}
		createTask(newTask, this.props.selectedBranch)
		this.props.closeTaskWizard()
	}

	updateFBListener = () => { this.props.setSingleTasksListener() }

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
			dataStatus={this.props.singleTasks_dataStatus}
			checkUncheckTask={this.checkUncheckTask}
			openCheckUncheckTaskPopup={this.openCheckUncheckTaskPopup}
			selectedBranch={this.props.selectedBranch}
		/>]
	}


	render() {
		const userMode = !!this.props.selectedUser
		return (
			<content className="calendar">
				<fb className="daysWrapper">
				{/*<fb className='updateDBButton' onClick={()=>updateQmLetters(this.props.qmLetters)}>updateQmLetters</fb>
				<fb className='updateDBButton' onClick={()=>shortenUsers(this.props.users)}>shortenUsers</fb>
				<fb className='updateDBButton' onClick={()=>moveTasksToBranches(this.props.allTasks)}>moveTasksToBranches</fb>
				<fb className='updateDBButton' onClick={()=>createCheckedInBranches(this.props.allTasks)}>createCheckedInBranches</fb>
				<fb className='updateDBButton' onClick={()=>deleteTaskManager()}>deleteTaskManager</fb>
				<fb className='updateDBButton' onClick={()=>createCheckedCount(this.props.branches, this.props.checked, this.props.repeatingTasks)}>createCheckedCount</fb> */}
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
				<Dialog style={{zIndex: 900}}
					open={!!this.props.checkingTask}
					onRequestClose={this.props.closeCheckingTask}
					children={this.checkUncheckTaskPopup} />
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
		checked: state.taskManager.checked,
		singleTasks_dataStatus: state.taskManager.singleTasks_dataStatus,
		tasks: extendTasksWithChecked(state),
		operatingTask: state.ui.taskManager.operatingTask,
		taskWizard: state.ui.taskManager.taskWizard,
		selectedUser: state.core.selectedUser,
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Calendar)

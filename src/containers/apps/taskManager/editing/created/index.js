import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import _ from 'lodash';
import moment from 'moment'

import { createTask, editAndCreateTask, deleteTask, endRepeatingTask } from 'actions';
import { setSingleTasksNoShiftedListener } from 'actions';
import Dialog from 'material-ui/Dialog';
import cN from 'classnames'

import composeWizard 			from 'composers/wizard'
import AssignUsersStep 		from '../../modals/addEditTaskWizardSteps/assignUsersStep'
import DefineContentStep 	from '../../modals/addEditTaskWizardSteps/defineContentStep'
import SetTimingStep 			from '../../modals/addEditTaskWizardSteps/setTimingStep'

import toastr from 'toastr'
import EditCreatedTask from './task'
import FilterBar from './filterBar'
import { stringIncludes, getTodaySmart, getYesterdaySmart, createShortGuid } from 'helpers'
import LazyLoad, {forceCheck} from 'react-lazyload'

import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'
import TextField from 'material-ui/TextField'
import Checkbox from 'material-ui/Checkbox'
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton'

import DeleteTaskPopup from '../../modals/deleteTaskPopup'
import TaskDetailsPopup from '../../modals/taskDetailsPopup'
import './styles.scss'

class EditCreatedTasks extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			filterCreator: null,
			filterAssignedUser: this.props.user.ID,
			taskSearchString: '',
			hidePastTask: true,
			selectedCategory: 'repeating'
		}
	}

	componentDidUpdate = () => forceCheck()

	openTaskDetailsPopup = (task, isInPast) => {
		const editable = !isInPast && task.creatorID == this.props.selectedUser
		this.props.openTaskDetailsPopup(task, editable)
	}

	openEditTaskWizard = (task) => {
		this.props.openEditTaskWizard(task)
		let Wizard = composeWizard([SetTimingStep, DefineContentStep, AssignUsersStep])
		this.addEditTaskWizard = <Wizard saveTaskToDB={this.editTask}/>
	}

	deleteOrEndTask = (task) => {
		const category = task.onetimerDate ? 'single' : 'repeating'
		const branchID = this.props.selectedBranch.ID
		if(task.onetimerDate || task.startDate >= getTodaySmart()) {
			deleteTask(task.ID, category, branchID)
		} else {
			endRepeatingTask(task.ID, getYesterdaySmart(), branchID)
		}
	}

	editTask = () => {
		const task = this.props.operatingTask
		if(task.onetimerDate || (!task.onetimerDate && task.startDate >= getTodaySmart())) {
			createTask(task, this.props.selectedBranch.ID) // this just overrides the task with new version.
		} else {
			const yesterdaySmart = parseInt(moment().subtract(1, 'day').format('YYYYMMDD'))
			editAndCreateTask(
				{ID: task.ID, endDate: yesterdaySmart},
				{ ...task, ID: createShortGuid(), startDate: getTodaySmart(), originalStartDate: task.startDate, originalTaskID: task.ID },
				this.props.selectedBranch.ID
			)
		}
		this.props.closeTaskWizard()
	}

	filteredSortedTasks() {
		const {filterCreator, filterAssignedUser, taskSearchString} = this.state
		const tasks = this.state.selectedCategory == 'repeating' ? this.props.repeatingTasks : this.props.singleTasks
		let filtTs = tasks.filter(t => !t.isDuplicate && !t.originalShiftedTask);
		if (filterCreator && filterCreator !== "none") 						filtTs = filtTs.filter(t => t.creatorID == filterCreator)
		if (filterAssignedUser && filterAssignedUser !== "none") 	filtTs = filtTs.filter(t => t.assignedUsers && t.assignedUsers[filterAssignedUser])
		if (this.state.taskSearchString) 													filtTs = filtTs.filter(t => stringIncludes(t.subject+' '+t.text, taskSearchString))
		return filtTs.sortBy(((t) => moment(t.creationDate).format('YYYYMMDD')), true)
	}

	renderTasks = () => {
		if (this.state.selectedCategory == 'single' && this.props.singleTasks_dataStatus != 'LOADED') return (<fb>loading...</fb>)

		const today = getTodaySmart()
		return this.filteredSortedTasks().map(t => {
			const isInPast =  t.endDate && t.endDate < today || t.onetimerDate && t.onetimerDate < today
			if (this.state.hidePastTask && isInPast) return false
			return (
				<LazyLoad height={44} overflow={true} offset={30} once={true} debounce={80} key={t.ID} placeholder={(<fb style={{height:'44px', borderTop:'1px solid #d3d3d3', paddingTop:'14px', paddingLeft:'14px', color:'#d3d3d3'}}>loading...</fb>)} >
					<EditCreatedTask
						today={today}
						users={this.props.users}
						user={this.props.user}
						task={t}
						isInPast={isInPast}
						openTaskDetailsPopup={this.openTaskDetailsPopup} />
				</LazyLoad>
			)
		})
	}

	renderSearchFilterBar = () => { return(
			<FilterBar
				users={this.props.users}
				filterCreator={this.state.filterCreator}
				filterAssignedUser={this.state.filterAssignedUser}
				taskSearchString={this.state.taskSearchString}
				selectedCategory={this.state.selectedCategory}
				hidePastTask={this.state.hidePastTask}
				changeFilter={this.changeFilter}
				changeCategoryTo={this.changeCategoryTo}
			/>
	)}

	renderHeaderRow() { return(
		<fb className="taskRow headerRow">
			<fb className="creator">Ersteller</fb>
			<fb className="taskInfo">Aufgabe</fb>
			<fb className="assignedUsers">Beauftragte</fb>
			<fb className="taskType">Typ</fb>
			<fb className="creationDate">erstellt am</fb>
		</fb>)
	}

	changeFilter = (changeObj) => this.setState(changeObj)

	changeCategoryTo = (category) => {
		this.setState({selectedCategory: category})
		if(this.props.singleTasks_dataStatus == 'NOT_REQUESTED') this.props.setSingleTasksNoShiftedListener()
	}

	render() {
		return (
			<fb className="taskEditWrapper">
				<fb className="tasksEdit">
					<content className={cN({"no-padding": true, "createdTasksContent": true})}>
						{this.renderSearchFilterBar()}
						<fb className="vertical taskListWrapper">
								{this.renderHeaderRow()}
							<fb className="edit-tasks-list">
								{this.renderTasks()}
							</fb>
						</fb>
						<Dialog open={this.props.taskWizard == 'edit'} onRequestClose={this.props.closeTaskWizard}>
							{this.addEditTaskWizard}
						</Dialog>
						<Dialog open={!!this.props.deleteTaskPopup} onRequestClose={this.props.closeDeleteTaskPopup}>
							<DeleteTaskPopup
								task={this.props.deleteTaskPopup && this.props.deleteTaskPopup.task}
								close={this.props.closeDeleteTaskPopup}
								deleteTask={this.deleteOrEndTask}
							/>
						</Dialog>
						<Dialog open={!!this.props.taskDetailsPopup} onRequestClose={this.props.closeTaskDetailsPopup}>
							<TaskDetailsPopup
								task={this.props.taskDetailsPopup && this.props.taskDetailsPopup.task}
								users={this.props.users}
								editable={this.props.taskDetailsPopup && this.props.taskDetailsPopup.editable}
								openDeleteTaskPopup={this.props.openDeleteTaskPopup}
								openEditTaskWizard={this.openEditTaskWizard}
								close={this.props.closeTaskDetailsPopup}
							/>
						</Dialog>
					</content>
				</fb>
			</fb>
		)
	}
}

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators({
		openEditTaskWizard: 		(task) 						=> ({type: 'OPEN_EDIT_TASK_WIZARD', payload: task}),
		closeTaskWizard: 				() 								=> ({type: 'CLOSE_TASK_WIZARD'}),
		openDeleteTaskPopup: 		(task)						=> ({type: 'OPEN_DELETE_TASK_POPUP', payload: {task}}),
		closeDeleteTaskPopup: 	()      					=> ({type: 'CLOSE_DELETE_TASK_POPUP'}),
		openTaskDetailsPopup: 	(task, editable) 	=> ({type: 'OPEN_TASK_DETAILS_POPUP', payload: {task, editable}}),
		closeTaskDetailsPopup:  () 								=> ({type: 'CLOSE_TASK_DETAILS_POPUP'}),
		setSingleTasksNoShiftedListener
	}, dispatch)
}

const mapStateToProps = (state) => {
	return {
		taskWizard: state.ui.taskManager.taskWizard,
		operatingTask: state.ui.taskManager.operatingTask,
		deleteTaskPopup: state.ui.taskManager.deleteTaskPopup,
		taskDetailsPopup: state.ui.taskManager.taskDetailsPopup,
		repeatingTasks: state.taskManager.repeatingTasks,
		singleTasks: state.taskManager.singleTasksNoShifted,
		singleTasks_dataStatus: state.taskManager.singleTasksNoShifted_dataStatus,
		users: state.data.users.filter(u => u.branches && u.branches[state.core.selectedBranch.ID]),
		selectedUser: state.core.selectedUser,
		selectedBranch: state.core.selectedBranch
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(EditCreatedTasks);

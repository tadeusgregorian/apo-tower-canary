import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import _ from 'lodash';
import moment from 'moment'

import { openConfirmPopup, closeConfirmPopup } from 'actions'
import { createTask, editAndCreateTask, deleteTask, endRepeatingTask } from 'actions';
import { setAllSingleTasksListener } from 'actions';
import Dialog from 'material-ui/Dialog';

import composeWizard 			from 'composers/wizard'
import AssignUsersStep 		from '../modals/addEditTaskWizardSteps/assignUsersStep'
import DefineContentStep 	from '../modals/addEditTaskWizardSteps/defineContentStep'
import SetTimingStep 			from '../modals/addEditTaskWizardSteps/setTimingStep'

import EditCreatedTask 	from './task'
import FilterBar 				from './filterBar'
import ListHead  				from './listHead'

import { stringIncludes, getTodaySmart, getYesterdaySmart, createShortGuid } from 'helpers'
import LazyLoad, {forceCheck} from 'react-lazyload'

import ConfirmPopup from 'components/confirmPopup'
import TaskDetailsPopup from '../modals/taskDetailsPopup'

import { deleteTaskText } from 'constants/modalTexts'
import './styles.css'

class Editor extends PureComponent {
	constructor(props) {
		super(props)
		this.today = getTodaySmart()

		this.state = {
			taskDetailsPopupOpen: false,
			filterCreator: null,
			filterAssignedUser: this.props.selectedUser,
			taskSearchString: '',
			hidePastTask: true,
			selectedCategory: 'repeating'
		}
	}

	componentDidUpdate = () => forceCheck()

	openTaskDetailsPopup = (task, isInPast) => {
		const editable = (!isInPast) && task.creatorID === this.props.selectedUser
		this.taskDetailsPopup = (
			<TaskDetailsPopup
				task={task}
				users={this.props.users}
				editable={editable}
				deleteTask={this.openDeleteTaskPopup}
				editTask={this.openEditTaskWizard}
				onClose={() => this.setState({taskDetailsPopupOpen: false})}
			/>
		)
		this.setState({taskDetailsPopupOpen: true})
	}

	openEditTaskWizard = (task) => {
		this.props.openEditTaskWizard(task)
		let Wizard = composeWizard([SetTimingStep, DefineContentStep, AssignUsersStep], task)
		this.addEditTaskWizard = <Wizard
			onStepsComplete={this.editTask}
			onClose={this.props.closeTaskWizard}
		/>
	}

	openDeleteTaskPopup = (task) => {
		// its deletable if its onetimerTask or if it hasnt started yet
		const deletable = task.onetimerDate || task.startDate >= getTodaySmart()
		const comp = <ConfirmPopup
			acceptBtnLabel={deletable ? 'Löschen' : 'Beenden' }
			declineBtnLabel='Abbrechen'
			acceptBtnRed={true}
			title={deleteTaskText[deletable ? 'deletable' : 'endable'].title}
			text={deleteTaskText[deletable ? 'deletable' : 'endable'].text}
			onAccept={() => this.deleteOrEndTask(task)}
			onClose={this.props.closeConfirmPopup}
		/>
		this.props.openConfirmPopup(comp)
	}

	deleteOrEndTask = (task) => {
		(task.onetimerDate || task.startDate >= getTodaySmart()) ?
			deleteTask(task) :
			endRepeatingTask(task, getYesterdaySmart())
	}

	editTask = (task) => {
		if(task.onetimerDate || (!task.onetimerDate && task.startDate >= getTodaySmart())) {
			createTask(task) // this just overrides the task with new version.
		} else {
			editAndCreateTask(
				{ID: task.ID, endDate: getYesterdaySmart()},
				{ ...task,
					ID: createShortGuid(),
					startDate: getTodaySmart(),
					originalStartDate: task.startDate,
					originalTaskID: task.ID
				}
			)
		}
		this.props.closeTaskWizard()
	}

	taskIsInPast = (t) => ((t.endDate && t.endDate < this.today) || (t.onetimerDate && t.onetimerDate < this.today))

	filteredSortedTasks() {
		const {filterCreator, filterAssignedUser, taskSearchString, hidePastTask} = this.state
		const tasks = this.state.selectedCategory==='repeating' ? this.props.repeatingTasks : this.props.allSingleTasks
		let filtTs = tasks.filter(t => !t.isDuplicate && !t.originalShiftedTask)

		if (hidePastTask)																					filtTs = filtTs.filter(t => !this.taskIsInPast(t))
		if (filterCreator && filterCreator !== "none") 						filtTs = filtTs.filter(t => t.creatorID===filterCreator)
		if (filterAssignedUser && filterAssignedUser !== "none") 	filtTs = filtTs.filter(t => t.assignedUsers && t.assignedUsers[filterAssignedUser])
		if (this.state.taskSearchString) 													filtTs = filtTs.filter(t => stringIncludes(t.subject+' '+t.text, taskSearchString))

		return _.sortBy(filtTs, (t) => moment(t.creationDate).format('YYYYMMDD'))
	}

	renderTasks = () => {
		if (this.state.selectedCategory==='single' && this.props.allSingleTasksDataStatus !== 'LOADED') return (<fb>loading...</fb>)

		return this.filteredSortedTasks().map(t => (
				<LazyLoad height={44} overflow={true} offset={30} once={true} debounce={80} key={t.ID} placeholder={(<fb style={{height:'44px', borderTop:'1px solid #d3d3d3', paddingTop:'14px', paddingLeft:'14px', color:'#d3d3d3'}}>loading...</fb>)} >
					<EditCreatedTask
						today={this.today}
						users={this.props.users}
						user={this.props.selectedUser}
						task={t}
						isInPast={this.taskIsInPast(t)}
						openTaskDetailsPopup={this.openTaskDetailsPopup} />
				</LazyLoad>
			)
		)
	}

	renderSearchFilterBar = () => (
			<FilterBar
				users={this.props.users}
				filterCreator={this.state.filterCreator}
				filterAssignedUser={this.state.filterAssignedUser}
				taskSearchString={this.state.taskSearchString}
				selectedCategory={this.state.selectedCategory}
				hidePastTask={this.state.hidePastTask}
				changeFilter={(changeObj) => this.setState(changeObj)}
				changeCategoryTo={this.changeCategoryTo}
			/>
	)

	changeCategoryTo = (category) => {
		this.setState({selectedCategory: category})
		if(this.props.allSingleTasksDataStatus==='NOT_REQUESTED') this.props.setAllSingleTasksListener()
	}

	render() {
		console.log('RENDERING EDITOR')
		return (
			<fb className="taskManagerEditorMain">
					<fb className="editorContent">
						{this.renderSearchFilterBar()}
						<fb className="vertical taskListWrapper">
							<ListHead />
							<fb className="taskList">
								{this.renderTasks()}
							</fb>
						</fb>
						<Dialog
							bodyClassName='sModal'
							open={this.props.taskWizard==='edit'}
							onRequestClose={this.props.closeTaskWizard}>
							{this.addEditTaskWizard}
						</Dialog>
						<Dialog
							bodyClassName='sModal'
							open={this.state.taskDetailsPopupOpen}
							onRequestClose={() => this.setState({taskDetailsPopupOpen: false})}>
							{this.taskDetailsPopup}
						</Dialog>
					</fb>
				</fb>
		)
	}
}

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators({
		openEditTaskWizard: 		(task) 						=> ({type: 'OPEN_EDIT_TASK_WIZARD', payload: task}),
		closeTaskWizard: 				() 								=> ({type: 'CLOSE_TASK_WIZARD'}),
		setAllSingleTasksListener,
		openConfirmPopup,
		closeConfirmPopup
	}, dispatch)
}

const mapStateToProps = (state) => {
	return {
		taskWizard: state.ui.taskManager.taskWizard,
		operatingTask: state.ui.taskManager.operatingTask,
		deleteTaskPopup: state.ui.taskManager.deleteTaskPopup,
		taskDetailsPopup: state.ui.taskManager.taskDetailsPopup,
		repeatingTasks: state.taskManager.repeatingTasks,
		allSingleTasks: state.taskManager.allSingleTasks,
		allSingleTasksDataStatus: state.taskManager.allSingleTasksDataStatus,
		users: state.data.users.filter(u => u.branches && u.branches[state.core.selectedBranch]),
		selectedUser: state.core.selectedUser,
		selectedBranch: state.core.selectedBranch
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Editor)

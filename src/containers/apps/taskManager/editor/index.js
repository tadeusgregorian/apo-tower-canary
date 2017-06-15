import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import _ from 'lodash';

import { openConfirmPopup, closeConfirmPopup } from 'actions'
import { editAndCreateTask, deleteTask, endRepeatingTask, overrideTask } from 'actions';
import { setAllSingleTasksListener } from 'actions';
import Dialog from 'material-ui/Dialog';

import composeWizard 			from 'composers/wizard'
import AssignUsersStep 		from '../modals/addEditTaskWizardSteps/assignUsersStep'
import DefineContentStep 	from '../modals/addEditTaskWizardSteps/defineContentStep'
import SetTimingStep 			from '../modals/addEditTaskWizardSteps/setTimingStep'

import Tasks						from './tasks'
import FilterBar 				from './filterBar'
import ListHead  				from './listHead'

import { getTodaySmart, getYesterdaySmart, createShortGuid } from 'helpers'

import ConfirmPopup from 'components/confirmPopup'
import TaskDetailsPopup from '../modals/taskDetailsPopup'
import { deleteTaskText } from 'constants/modalTexts'

import './styles.css'

class Editor extends PureComponent {
	constructor(props) {
		super(props)

		this.state = {
			taskDetailsPopupOpen: false,
			filterCreator: null,
			filterAssignedUser: this.props.selectedUser,
			taskSearchString: '',
			showPastTask: false,
			selectedCategory: 'repeating' // can be: 'single' or 'repeating'
		}
	}

	openTaskDetailsPopup = (task, isInPast) => {
		console.log(task)
		const isCreator = task.creatorID === this.props.selectedUser
		const isAdmin		= this.props.users.find(u => u.ID === this.props.selectedUser).isAdmin
		const editable 	= (!isInPast) && (isCreator || isAdmin)
		this.taskDetailsPopup = (
			<TaskDetailsPopup
				task={task}
				users={this.props.users}
				editable={editable}
				deletable={task.onetimerDate || task.startDate >= getTodaySmart()}
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
		// if a task is not deletable ( repTasks that started in past ) -> they get ended ( endDate gets set to yesterday )
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
		if(task.onetimerDate || task.startDate >= getTodaySmart()) {
			overrideTask(task)
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

	renderSearchFilterBar = () => (
			<FilterBar
				users={this.props.users}
				filterCreator={this.state.filterCreator}
				filterAssignedUser={this.state.filterAssignedUser}
				taskSearchString={this.state.taskSearchString}
				selectedCategory={this.state.selectedCategory}
				showPastTask={this.state.showPastTask}
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
							<ListHead selectedCategory={this.state.selectedCategory}/>
							<Tasks
								openTaskDetailsPopup={this.openTaskDetailsPopup}
								today={ getTodaySmart() }
								tasks={this.state.selectedCategory === 'repeating' ? this.props.repeatingTasks : this.props.allSingleTasks}
								{...this.props}
								{...this.state}
							/>
						</fb>
						<Dialog
							bodyClassName='sModal'
							open={this.props.taskWizard === 'edit'}
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
		repeatingTasks: state.taskManager.repeatingTasks,
		allSingleTasks: state.taskManager.allSingleTasks,
		allSingleTasksDataStatus: state.taskManager.allSingleTasksDataStatus,
		users: state.data.users.filter(u => u.branches && u.branches[state.core.selectedBranch]),
		selectedUser: state.core.selectedUser,
		selectedBranch: state.core.selectedBranch
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Editor)

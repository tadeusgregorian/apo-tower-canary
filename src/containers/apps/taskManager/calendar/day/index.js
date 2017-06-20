import React, {PureComponent} from 'react';
import cN from 'classnames';
import _ from 'lodash';
import moment from 'moment';
import TaskTransitionGroup from './taskTransitionGroup';
import './styles.css';
import DayFooter from './dayFooter'
import Task from './task';
import DummyTasks from './dummyTasks'



export default class Day extends PureComponent {
	constructor(props) {
		super(props)

		this.state = {
			showDoneTasks: false,
			showEveryonesTasks: false,
		}
		this.blockAnimation = false // blocks the TaskEnter and TaskLeave Animation
	}

	componentWillReceiveProps(nextProps){
		// this ensures that whenever a user enters his space, showEveryonesTasks is false.
		if(this.props.selectedUser && !nextProps.selectedUser) this.setState({showEveryonesTasks: false})
	}

	componentWillUpdate(nextProps, nextState){
		if(this.props.selectedUser !== nextProps.selectedUser) this.blockAnimation = true
		if(this.state !== nextState) this.blockAnimation = true
	}

	componentDidUpdate(prevProps, prevState){
		if(this.props.selectedUser !== prevProps.selectedUser) this.blockAnimation = false
		if(this.state !== prevState) this.blockAnimation = false
	}

	render() {
		const {tasks, users, selectedUser, day, checkUncheckTask, openCheckUncheckTaskPopup, tasksLoaded} = this.props;
		const {showDoneTasks, showEveryonesTasks} = this.state
		if(!tasks) return null
		if(!tasksLoaded) return(<DummyTasks />)

		const filteredTasks = tasks.filter(t => !selectedUser || showEveryonesTasks || t.assignedUsers[selectedUser])
		const checkedTasksCount = filteredTasks.filter(t => t.isDone || t.isIgnored).length
		const visibleTasks = _.sortBy(filteredTasks.filter(t => showDoneTasks || (!t.isDone && !t.isIgnored)), [
			t => !!t.isDone || !!t.isIgnored || !!t.isShifted,
			t => !t.prio,
			t => moment(t.creationDate).unix() * -1,
			"subject",
		])
		return (
			<fb className={cN({tasksDay: true, fullWidthDay: true, inUserMode: selectedUser})}>
				<fb className={`tasksWrapper`}>
					<TaskTransitionGroup blockAnimation={this.blockAnimation}>
						{ visibleTasks.length ?  visibleTasks.map(t => <Task
										data={t}
										key={t.ID + t.isDone} // adding isDone, so transitionGroup animates Enter and Leave when checking
										withCheckbox={!!selectedUser}
										dateString={day}
										onCheckboxClick={() => checkUncheckTask(t, t.isDone, 'done')}
										users={users}
										clickHandler={() => openCheckUncheckTaskPopup(t)}/>)
						: <fb className="noTasksBlock">Keine offenen Aufgaben für Heute!</fb>}
					</TaskTransitionGroup>
					<DayFooter
						showHideDoneTasks={() => this.setState({ showDoneTasks: (!showDoneTasks) })}
						showHideEveryonesTasks={() => this.setState({ showEveryonesTasks: (!showEveryonesTasks) })}
						showDoneTasks={showDoneTasks}
						showEveryonesTasks={showEveryonesTasks}
						checkedTasksCount={checkedTasksCount}
						userMode={!!selectedUser}
					/>
				</fb>
			</fb>
		);
	}
}

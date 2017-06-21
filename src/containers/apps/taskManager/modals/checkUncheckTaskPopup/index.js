import React, { Component } from 'react';
import AssignedUsers from 'components/assignedUsers'
import SButton from 'components/sButton'
import DatePicker from 'material-ui/DatePicker';
import ShiftedFromBox from './shiftedFromBox'
import DoneByInfoRow from './doneByInfoRow'
import TaskTypeInfo from '../components/taskTypeInfo'
import CreatedInfo from '../components/createdInfo'
import moment from 'moment'
import SModal from 'components/sModal'
import _ from 'lodash'
import 'styles/modals.css';
import './styles.css';

export default class CheckUncheckTaskPopup extends Component {

	firstAcceptableDate = () => {
		const today = moment().startOf('day')
		const currentDay = moment(this.props.currentDay, 'YYYYMMDD')
		return today.isBefore(currentDay) ? currentDay.add(1, 'day').toDate() : today.add(1, 'day').toDate()
	}

	render() {
		// this is a random Workaround for a bug ( after closing the Popup there is a last Render which causes bugs... MaterialUI bug )
		if(!this.props.checkingTask) return <fb></fb>
		const t = this.props.checkingTask
		const { users } = this.props

		// undoneTasks (coming from firebase: tasks/undoneTasksk/results ) have a prop taskDate
		// if it exists we take it, otherwise task was clicked from calendar/day component.
		// in this case the currentDay is the taskDate
		const taskDate = t.taskDate || this.props.currentDay
		const assignedUsers = _.keys(t.assignedUsers).filter(uID => t.assignedUsers[uID] !== 'replacer')
		const isChecked = t.isDone || t.isIgnored || t.isShifted
		const colorStyle = isChecked ? 'blackAndWhite' : 'colorful'

		const createdBy = users.find(u => u.ID === t.creatorID).name

		return (
			<SModal.Main title={t.subject} onClose={this.props.onClose}>
				<SModal.Body>
					<fb className='cucModalAssignedUsers'>
						<AssignedUsers {...{assignedUsers, users}} usersRed={[t.isDoneBy]} colorStyle={colorStyle} tooltipRight/>
					</fb>
					<fb className="checkUncheckModalBodyContent">
						<TaskTypeInfo task={t} />
						<CreatedInfo createdBy={createdBy} creationDate={t.creationDate} />
						<DoneByInfoRow task={t} users={users} />
						{ t.originalShiftedTask && 	<ShiftedFromBox originalDate={t.originalShiftedTask.date}/> }
						{ t.text && 								<fb className='modalTaskText'>{t.text}</fb> }
					</fb>
				</SModal.Body>
				{this.props.userMode &&
					<SModal.Footer>
						<SButton
							label={t.isIgnored ? 'Ignorierung aufheben' : 'Ignorieren'}
							onClick={() => this.props.checkUncheck(t, !!t.isIgnored, 'ignored', taskDate)}
							disabled={!!t.isDone || !!t.isShifted}
						/>
						<SButton
							label='Verschieben'
							onClick={()=>this.refs.shiftTaskDatePicker.openDialog()}
							disabled={isChecked}
						/>
						<SButton
							right
							color={'#2ECC71'}
							label={t.isDone ? 'Nicht erledigt' : 'Erledigt'}
							onClick={() => this.props.checkUncheck(t, !!t.isDone, 'done', taskDate)}
							disabled={!!t.isIgnored || !!t.isShifted}
						/>
					</SModal.Footer>
				}
				<DatePicker style={{"display": "none"}}
					ref='shiftTaskDatePicker'
					onChange={(e, d) => { this.props.checkUncheck(t, false, 'shifted', taskDate, parseInt(moment(d).format('YYYYMMDD'), 10))}}
					floatingLabelText="fakeText_Shift"
					cancelLabel="Abbrechen"
					okLabel="Verschieben"
					DateTimeFormat={window.DateTimeFormat}
					minDate={this.firstAcceptableDate()}
					locale="de-DE"/>
			</SModal.Main>
		)
	}
}

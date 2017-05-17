import React, { Component } from 'react';
import { getTypeAndPatternOfTask } from 'helpers';
import AssignedUsers from 'components/assignedUsers'
import SButton from 'components/sButton'
import DatePicker from 'material-ui/DatePicker';
import ShiftedFromBox from './shiftedFromBox'
import DoneByInfoRow from './doneByInfoRow'
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
		const users = this.props.users
		const taskTypeAndPattern = getTypeAndPatternOfTask(t)
		const assignedUsers = _.keys(t.assignedUsers)
		const isChecked = t.isDone || t.isIgnored || t.isShifted

		console.log(t)

		const createdBy = 	t.creatorID 		&& users.find(u => u.ID===t.creatorID).name

		const modalButtons = (
			<fb>
				<SButton
					label={t.isIgnored ? 'Ignorierung aufheben' : 'Ignorieren'}
					onClick={() => this.props.checkUncheck(t, !!t.isIgnored, 'ignored')}
					disabled={!!t.isDone || !!t.isShifted}
				/>
				<SButton
					label='Verschieben'
					onClick={()=>this.refs.shiftTaskDatePicker.openDialog()}
					disabled={isChecked}
				/>
				<fb className='rightSide'>
					<SButton
						color={'#2ECC71'}
						label={t.isDone ? 'Nicht erledigt' : 'Erledigt'}
						onClick={() => this.props.checkUncheck(t, !!t.isDone, 'done')}
						disabled={!!t.isIgnored || !!t.isShifted}
					/>
				</fb>
			</fb>
		)

		return (
			<SModal.Main title={t.subject} onClose={this.props.onClose}>
				<SModal.Body>
					<fb className='modalAssignedUsers'>
						<AssignedUsers {...{assignedUsers, users}} usersRead={[t.isDoneBy]} colorStyle={isChecked ? 'blackAndWhite' : 'colorful'}/>
					</fb>
					<fb className='modalTaskTypeInfo'>
						<icon className='icon-insert_invitation nop'/> <bo>{taskTypeAndPattern.type} </bo> {(taskTypeAndPattern.patternFullLength || taskTypeAndPattern.pattern)}
					</fb>
					<fb className='createdInfo'>
						<icon className='icon-account_circle nop'/><p>Erstellt von <b>{createdBy}</b> am<b> {moment(t.creationDate).format('DD.MM.YYYY')}</b></p>
					</fb>
					<DoneByInfoRow task={t} users={users} />
					{ t.originalShiftedTask && 	<ShiftedFromBox originalDate={t.originalShiftedTask.date}/> }
					{ t.text && 								<fb className='modalTaskText'>{t.text}</fb> }
				</SModal.Body>
				<SModal.Footer>
					{this.props.userMode && modalButtons}
				</SModal.Footer>
				<DatePicker style={{"display": "none"}}
					ref='shiftTaskDatePicker'
					onChange={(e, d) => { this.props.checkUncheck(t, false, 'shifted', parseInt(moment(d).format('YYYYMMDD'), 10))}}
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

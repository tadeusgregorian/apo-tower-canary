import React, { Component } from 'react';
import { getTypeAndPatternOfTask } from 'helpers';
import RaisedButton from 'material-ui/RaisedButton';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import DatePicker from 'material-ui/DatePicker';
import moment from 'moment'
import 'styles/modals.scss';
import './styles.scss';

class CheckUncheckTaskPopup extends Component {

	checkUncheckTask = (isUnchecking, checkType, shiftedTo = null) => {
		this.props.closeCheckingTask()
		this.props.checkUncheck(isUnchecking, this.props.checkingTask, checkType, this.props.selectedUser, shiftedTo)
	}

	render() {
		// this is a random Workaround for a bug ( after closing the Popup there is a last Render which causes bugs... MaterialUI bug )
		if(!this.props.checkingTask) return <fb></fb>
		const t = this.props.checkingTask
		const taskTypeAndPattern = getTypeAndPatternOfTask(t)
		const creatorName = this.props.users.find(u => u.ID == t.creatorID).name
		const userMode = !!this.props.selectedUser
		const ignoreButton = (
			<RaisedButton
				label={t.isIgnored ? 'Ignorierung aufheben' : 'Ignorieren'}
				onTouchTap={() => this.checkUncheckTask(t.isIgnored, 'ignored')}
				disabled={!!t.isDone || !!t.isShifted}
				primary={!!t.isIgnored}
			/>)

		const checkUncheckButton = 	(
			<RaisedButton
				primary={true}
				label={t.isDone ? 'Nicht erledigt' : 'Erledigt'}
				onTouchTap={() => this.checkUncheckTask(t.isDone, 'done')}
				disabled={!!t.isIgnored || !!t.isShifted}
			/>)

		const shiftButton = 	(
			<RaisedButton
				primary={true}
				label={'Verschieben'}
				onTouchTap={()=>this.refs.shiftTaskDatePicker.openDialog()}
				disabled={!!t.isIgnored || !!t.isShifted || !!t.isDone}
			/>)

		return (
			<fb className='modal checkUncheckTaskPopupMain'>
				<header>
					<h4 className="no-margin">{t.subject}</h4>
					<p>Erstellt von <b>{creatorName} </b>am<b> {moment(t.creationDate).format('DD.MM.YYYY')}</b></p>
					<p><b>{taskTypeAndPattern.type} </b> {(taskTypeAndPattern.patternFullLength || taskTypeAndPattern.pattern)}</p>
					{ t.isDone &&
						<p>Erledigt am <b>{moment(t.isDoneDate).format('DD.MM.YYYY HH:mm')}</b> von <b>{this.props.users.find(u => u.ID == t.isDoneBy).name}</b></p>
					}
					{ t.isIgnored &&
						<p>Ignoriert am <b>{moment(t.isIgnoredDate).format('DD.MM.YYYY HH:mm')}</b> von <b>{this.props.users.find(u => u.ID == t.isIgnoredBy).name}</b></p>
					}
					{ t.originalShiftedTask &&
						<fb style={{flexDirection: 'column', border: '1px solid orange', padding: 3}}>
							<fb>Verschobene Aufgabe</fb>
							<fb>Wurde auf diesen Tag verschoben</fb>
							<fb>Ursprünglich fällig am: <b>{moment(t.originalShiftedTask.date, 'YYYYMMDD').format('DD.MM.YY')}</b></fb>
						</fb>
					}
				</header>
				<content><fb className="no-shrink margin-bottom">{t.text}</fb></content>
				<footer>
					{userMode && ignoreButton}
					{userMode && shiftButton}
					<fb className="right no-grow">{userMode && checkUncheckButton}</fb>
				</footer>
				<DatePicker style={{"display": "none"}}
					ref='shiftTaskDatePicker'
					onChange={(e, d) => { this.checkUncheckTask(false, 'shifted', parseInt(moment(d).format('YYYYMMDD')))}}
					floatingLabelText="fakeText_Shift"
					cancelLabel="Abbrechen"
					okLabel="Verschieben"
					DateTimeFormat={window.DateTimeFormat}
					locale="de-DE"/>
			</fb>
		)
	}
}

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators({
		setCheckingTask: 		(task) => ({type: 'SET_CHECKING_TASK', payload: task}),
		closeCheckingTask: 	() => ({type: 'CLOSE_CHECKING_TASK'})
	}, dispatch);
}

const mapStateToProps = (state) => {
	return {
		users: state.data.users,
		selectedBranch: state.core.selectedBranch,
		checkingTask: state.ui.taskManager.checkingTask,
		selectedUser: state.core.selectedUser,
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(CheckUncheckTaskPopup)

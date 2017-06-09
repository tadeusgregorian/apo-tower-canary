import React, { PureComponent } from 'react'
import cN from 'classnames'
import DatePicker from 'material-ui/DatePicker'
import RaisedButton from 'material-ui/RaisedButton'
import Checkbox from 'material-ui/Checkbox'
import { Wochentage, TaskType } from 'constants'
import FontIcon from 'material-ui/FontIcon'
import DropDownMenu from 'material-ui/DropDownMenu'
import MenuItem from 'material-ui/MenuItem'
import WizardDatePicker from '../wizardDatePicker'
import _ from 'lodash';
import { getTodaySmart, addDays} from 'helpers';
import moment from 'moment'
import {connect} from 'react-redux';
import { Toast } from 'helpers'
import './styles.css';

class SetTimingStep extends PureComponent {

	componentWillMount(){
		this.props.setStepTitle(this.getStepTitle())
		this.props.setStepCompleteChecker(this.readyForNextStep)
	}

	getStepTitle = () => {
		switch (this.props.OTask.type) {
		case TaskType.onetimer: 	return 'Einmalige Aufgabe - Datum auswählen'
		case TaskType.daily: 			return 'Tägliche Aufgabe'
		case TaskType.yearly: 		return 'Järliche Aufgabe - Datum auswählen'
		case TaskType.irregular:	return 'Multidatum - Daten auswählen'
		case TaskType.weekly: 		return 'Wochentage auswählen'
		case TaskType.monthly: 		return 'Tage im Monat auswählen'
		default: return false
		}
	}

	toggleWeekday(wd) {
		let weekly = this.props.OTask.weekly ? [...this.props.OTask.weekly] : []
		weekly.includes(wd) ?  _.pull(weekly, wd) : weekly.push(wd)
		this.props.editOTask({	weekly })
	}

	toggleMonthday(md) {
		let monthly = this.props.OTask.monthly ? [...this.props.OTask.monthly] : []
		monthly.includes(md) ? _.pull(monthly, md) : monthly.push(md)
		this.props.editOTask({ monthly })
	}

	// dateType is either 'startDate' or 'endDate'
	renderWizardDatePicker = (dateType) => { return (
		<WizardDatePicker
			pickedDate={dateType==='startDate' ? this.props.OTask.startDate : this.props.OTask.endDate}
			label={dateType==='startDate' ? 'Startdatum' : 'Enddatum'}
			withToggle={dateType==='endDate'}
			disabled={dateType==='startDate' && this.props.mode==='edit' && this.props.OTask.startDate < getTodaySmart()}
			changePickedDate={dateType==='startDate' ? this.editStartDate : this.editEndDate}
			firstAcceptableDate={dateType==='startDate' ? getTodaySmart() : addDays(this.props.OTask.startDate, 1)}
		/>)
	}

	renderOneTimerSelector() { return (
		<fb className='vertical oneTimerContent'>
				<WizardDatePicker
					//openOnMount={true}
					pickedDate={this.props.OTask.onetimerDate}
					label={'Datum'}
					firstAcceptableDate={getTodaySmart()}
					changePickedDate={(newDate) => this.props.editOTask({onetimerDate: newDate})}
				/>
		</fb>
	)}

	renderReapeatEveryBox = (defaultLabelText, labelText) => {
		return (<fb className="materialUiMenuContainer margin-top">
			<DropDownMenu maxHeight={300} value={this.props.OTask.repeatEvery || 1} onChange={(e, i, v) => this.props.editOTask({repeatEvery: v===1 ? null : v})}>
				{_.range(1, 13).map(i => {
					let primaryText = i===1 ? defaultLabelText : `Alle ${i} ${labelText}`
					return (<MenuItem value={i} key={i} primaryText={primaryText} />)
				})}
			</DropDownMenu>
		</fb>)
	}

	editStartDate = (newDate) => {
		this.props.editOTask({startDate: newDate})
		const endDate = this.props.OTask.endDate
		if (newDate && endDate && newDate >= endDate) {
			this.props.editOTask({endDate: addDays(newDate, 1)})
			Toast.warning('Achtung, das Enddatum wurde angepasst.')
		}
	}
	editEndDate   = (newDate) => this.props.editOTask({endDate: newDate})

	renderWeeklySelector() {
		const weekly = this.props.OTask.weekly || []
		return (
			<fb className="vertical weeklyContent">
					<fb className="horizontal padding-bottom">
						<fb className="weekdays only-horizontal">
							{Wochentage.map(w =>
								<fb key={w} className={(cN({weekdayBox: true, selected: _.includes(weekly, w) }))} onClick={() => this.toggleWeekday(w)}>{w}</fb>
							)}
						</fb>
					</fb>
					<fb>
						{ this.renderReapeatEveryBox("Jede Woche", "Wochen") }
						{ this.renderWizardDatePicker('startDate') }
					</fb>
					<fb className="margin-top panel no-shrink">
						{ this.renderWizardDatePicker('endDate') }
					</fb>
			</fb>
		)
	}

	renderDailySelector = () => (
		<fb className="vertical dailyContent">
			<fb className="horizontal">
				<fb className="dateBoxOuterWrapper">{ this.renderWizardDatePicker('startDate') }</fb>
				<fb className="checkboxesWrapper vertical">
					<fb className="checkboxWrapper">
						<Checkbox
							onClick={() => this.props.editOTask({includeSaturday: this.props.OTask.includeSaturday ? null : true})} // we prefere null because it creates no Firebase-entry
							checked={!!this.props.OTask.includeSaturday}
							label="Inklusive Samstags"
						/>
					</fb>
					<fb className="checkboxesWrapper">
						<Checkbox
							onClick={() => this.props.editOTask({includeSunday: this.props.OTask.includeSunday ? null : true})} // we prefere null because it creates no Firebase-entry
							checked={!!this.props.OTask.includeSunday}
							label="Inklusive Sonntags"
						/>
					</fb>
				</fb>
			</fb>
			<fb className="margin-top panel">{ this.renderWizardDatePicker('endDate') }</fb>
		</fb>
	)

	yearlyDateSelected = (e, d, i) => {
		let yearliesClone = [...this.props.OTask.yearly]
		yearliesClone[i] = parseInt(moment(d).format('YYYYMMDD'), 10)
		this.props.editOTask({yearly: yearliesClone})
	}

	renderYearlySelector() {
		const yearly = this.props.OTask.yearly
		return (
			<fb className="vertical yearlyContent">
					<fb className="margin-bottom wrap overflowY only-horizontal no-grow no-shrink">
						{ yearly.map((smartDate, i) =>
							<fb key={i} style={{paddingBottom: "2px"}}>
									<DatePicker
										value={moment(smartDate, 'YYYYMMDD').toDate()}
										formatDate={(d) => moment(d).format("DD. MMM")}
										onChange={(e, d) => this.yearlyDateSelected(e, d, i)}
										minDate={moment().startOf('year').toDate()}
							      maxDate={moment().endOf('year').toDate()}
										disableYearSelection={true}
										autoOk={true}
										floatingLabelText={`Jährlicher am:`}
										okLabel="OK"
										cancelLabel="Abbrechen"
										DateTimeFormat={window.DateTimeFormat}
										locale="de-DE"
							  />
								{ yearly.length > 1 &&
								<icon className="icon icon-remove_circle removeDateIcon" onClick={
									() => { this.props.editOTask({ yearly: yearly.filter((d, index) => i !== index) })}
								} /> }
							</fb>
						)}
					</fb>
					<fb className="no-shrink no-grow">
						<RaisedButton
							label="Weiteren Tag hinzufügen"
							onClick={() => this.props.editOTask({yearly: [...yearly, getTodaySmart() ]})}
							icon={<FontIcon className="icon icon-add_circle"/>}
						/>
					</fb>
					<fb className="no-grow no-shrink">
						{ this.renderReapeatEveryBox("Jedes Jahr", "Jahre") }
						{ this.renderWizardDatePicker('startDate') }
					</fb>
					<fb className="margin-top no-shrink panel">
						{ this.renderWizardDatePicker('endDate') }
					</fb>
			</fb>
		)
	}

	irregularDateSelected = (d, i) => {
		let irregularDatesClone = [...this.props.OTask.irregularDates]
		irregularDatesClone[i] = parseInt(moment(d).format('YYYYMMDD'), 10)
		this.props.editOTask({irregularDates: irregularDatesClone})
	}

	setIrregularDates = (datesArray) => {
		const firstDate = _.min(datesArray)
		const lastDate  = _.max(datesArray)
		this.props.editOTask({
			irregularDates: datesArray,
			startDate: firstDate,
			endDate: lastDate
		})
	}

	renderIrregularSelector() {
		const dates = this.props.OTask.irregularDates
		return (
			<fb className="vertical irregularDatesContent">
					<fb className="margin-bottom wrap overflowY offset only-horizontal">
						{dates.map((smartDate, i) =>
							(<fb key={i} style={{paddingBottom: "2px", cursor: 'pointer'}}>
								<DatePicker
									value={moment(smartDate, 'YYYYMMDD').toDate()}
									onChange={(e, d) => this.irregularDateSelected(d, i)}
									shouldDisableDate={(d) => moment(d).format('YYYYMMDD') < getTodaySmart()}
									autoOk={true}
									floatingLabelText={`${(i + 1)}. Datum`}
									okLabel="OK" cancelLabel="Abbrechen"
									DateTimeFormat={window.DateTimeFormat} locale="de-DE"
							  />
								{ dates.length > 1 &&
									<fb className="icon icon-remove_circle" onClick={() => { this.setIrregularDates(dates.filter((d, index) => i !== index)) }}></fb>
								}
							</fb>)
						)}
					</fb>
					<fb className="no-shrink margin-bottom">
						<RaisedButton
							label="Weiteres Datum hinzufügen"
							onClick={()=>this.setIrregularDates([...dates, getTodaySmart()])}
							icon={<FontIcon className="icon icon-add_circle"/>}
						/>
					</fb>
			</fb>
		)
	}

	renderMonthlySelector() {
		const monthdays = _.range(1, 32, 1);
		let relevantMonthlength = null;
		const monthly = this.props.OTask.monthly || []

		if(_.includes(monthly, 31)) relevantMonthlength = 31
		if(_.includes(monthly, 30)) relevantMonthlength = 30
		if(_.includes(monthly, 29)) relevantMonthlength = 29

		return (
			<fb className="vertical monthlyContent">
					<fb className="monthdays slim wrap no-grow no-shrink">
						{	monthdays.map(w =>
							<fb key={w} className={(cN({monthdayBox: true, selected: _.includes(monthly, w) }))} onClick={() => this.toggleMonthday(w)}>{w}</fb>
						)}
					</fb>
					{  relevantMonthlength &&
							<fb className="margin-top panel no-grow no-shrink infoText">
								<icon className="no-border icon-warning-2 no-padding margin-right"></icon>An Monaten mit weniger als {relevantMonthlength} Tagen, wird die Aufgabe automatisch vorgezogen.
							</fb> }
					<fb className="no-grow no-shrink">
						{ this.renderReapeatEveryBox("Jeden Monat", "Monate") }
						{ this.renderWizardDatePicker('startDate') }
					</fb>
					<fb className="margin-top panel no-grow no-shrink">{ this.renderWizardDatePicker('endDate') }</fb>
			</fb>
		)
	}

	renderContent = () => {
		switch (this.props.OTask.type) {
		case TaskType.onetimer: 	return this.renderOneTimerSelector()
		case TaskType.weekly: 		return this.renderWeeklySelector()
		case TaskType.monthly: 		return this.renderMonthlySelector()
		case TaskType.daily: 			return this.renderDailySelector()
		case TaskType.yearly: 		return this.renderYearlySelector()
		case TaskType.irregular:	return this.renderIrregularSelector()
		default: return null
		}
	}

	readyForNextStep = (task) => {
		console.log(task)
		switch (task.type) {
		case TaskType.onetimer: 	return true
		case TaskType.daily: 			return true
		case TaskType.yearly: 		return true
		case TaskType.irregular:	return true
		case TaskType.weekly: 		return task.weekly  && task.weekly.length
		case TaskType.monthly: 		return task.monthly && task.monthly.length
		default: return false
		}
	}

	render() { return (
		<fb className='vertical setTimingStepMain'>
			{	this.renderContent() }
		</fb>
	)}
}

const mapStateToProps = (state) => ({
	mode: state.ui.taskManager.taskWizard
})

export default connect(mapStateToProps)(SetTimingStep)

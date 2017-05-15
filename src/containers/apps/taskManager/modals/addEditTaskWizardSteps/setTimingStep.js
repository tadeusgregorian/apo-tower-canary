import React, { PureComponent } from 'react'
import cN from 'classnames'
import DatePicker from 'material-ui/DatePicker'
import RaisedButton from 'material-ui/RaisedButton'
import Checkbox from 'material-ui/Checkbox'
import { Wochentage, TaskType } from 'constants'
import FontIcon from 'material-ui/FontIcon'
import DropDownMenu from 'material-ui/DropDownMenu'
import MenuItem from 'material-ui/MenuItem'
import WizardFooter from 'components/wizardFooter'
import WizardDatePicker from './wizardDatePicker'
import _ from 'lodash';
import { getTodaySmart, addDays} from 'helpers';
import 'styles/modals.css';
import moment from 'moment'

export default class SetTimingStep extends PureComponent {

	toggleWeekday(wd) {
		let weekly = this.props.OTask.weekly ? [...this.props.OTask.weekly] : []
		weekly.includes(wd) ?  weekly.remove(wd) : weekly.push(wd)
		this.props.editOTask({	weekly })
	}

	toggleMonthday(md) {
		let monthly = this.props.OTask.monthly ? [...this.props.OTask.monthly] : []
		monthly.includes(md) ? monthly.remove(md) : monthly.push(md)
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
		<fb className='vertical'>
			<header><h3>Datum auswählen</h3></header>
			<content>
				<WizardDatePicker
					pickedDate={this.props.OTask.onetimerDate}
					label={'Datum'}
					firstAcceptableDate={getTodaySmart()}
					changePickedDate={(newDate) => this.props.editOTask({onetimerDate: newDate})}
				/>
			</content>
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

	editStartDate = (newDate) => this.props.editOTask({startDate: newDate})
	editEndDate   = (newDate) => this.props.editOTask({endDate: newDate})

	renderWeeklySelector() {
		const weekly = this.props.OTask.weekly || []
		return (
			<fb className="vertical">
				<header><h3>Wochentage auswählen</h3></header>
				<content>
					<fb className="horizontal padding-bottom">
						<fb className="weekdays offset only-horizontal slim">
							{Wochentage.map(w => (<fb
								key={w}
								className={(cN({weekdayBox: true, selected: weekly.find(w)}))}
								onClick={() => this.toggleWeekday(w)}
								style={{borderColor: weekly.find(w) ? 'blue' : "#BBBBBB"}}
								>{w}</fb>))}
						</fb>
					</fb>
					<fb>
						{ this.renderReapeatEveryBox("Jede Woche", "Wochen") }
						{ this.renderWizardDatePicker('startDate') }
					</fb>
					<fb className="margin-top panel no-shrink">
						{ this.renderWizardDatePicker('endDate') }
					</fb>
				</content>
			</fb>
		)
	}

	renderDailySelector() {	return (
		<fb className="vertical">
			<header><h3>Tägliche Aufgabe</h3></header>
			<content>
				<fb className="margin-top">
					<Checkbox
						onClick={() => this.props.editOTask({includeSaturday: this.props.OTask.includeSaturday ? null : true})} // we prefere null because it creates no Firebase-entry
						checked={!!this.props.OTask.includeSaturday}
						label="Inklusive Samstag"
					/>
				</fb>
				<fb className="margin-top">
					<Checkbox
						onClick={() => this.props.editOTask({includeSunday: this.props.OTask.includeSunday ? null : true})} // we prefere null because it creates no Firebase-entry
						checked={!!this.props.OTask.includeSunday}
						label="Inklusive Sonntag"
					/>
				</fb>
				<fb className="margin-top">{ this.renderWizardDatePicker('startDate') }</fb>
				<fb className="margin-top panel">{ this.renderWizardDatePicker('endDate') }</fb>
			</content>
		</fb>
	)}

	yearlyDateSelected = (e, d, i) => {
		let yearliesClone = [...this.props.OTask.yearly]
		yearliesClone[i] = parseInt(moment(d).format('YYYYMMDD'), 10)
		this.props.editOTask({yearly: yearliesClone})
	}

	renderYearlySelector() {
		const yearly = this.props.OTask.yearly
		return (
			<fb className="vertical">
				<header><h3>Jährliche Aufgaben</h3></header>
				<content>
					<fb className="margin-bottom wrap overflowY offset only-horizontal no-grow no-shrink">
						{ yearly.map((smartDate, i) => (
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
								<icon onClick={() => {
									if(yearly.length===1) return
								  let yearliesClone = [...yearly]
								  yearliesClone.removeAt(i)
								  this.props.editOTask({yearly: yearliesClone})
							  }} className="icon icon-remove_circle no-border"/></fb>)
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
				</content>
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
		const irregularDates = this.props.OTask.irregularDates
		return (
			<fb className="vertical">
				<header><h3>Unregelmäßige Aufgaben</h3></header>
				<content>
					<fb className="margin-bottom wrap overflowY offset only-horizontal">
						{irregularDates.map((smartDate, i) =>
							(<fb key={i} style={{paddingBottom: "2px"}}>
								<DatePicker
									value={moment(smartDate, 'YYYYMMDD').toDate()}
									onChange={(e, d) => this.irregularDateSelected(d, i)}
									shouldDisableDate={(d) => moment(d).format('YYYYMMDD') < getTodaySmart()}
									autoOk={true}
									floatingLabelText={`${(i + 1)}. Datum`}
									okLabel="OK" cancelLabel="Abbrechen"
									DateTimeFormat={window.DateTimeFormat} locale="de-DE"
							  />
								<icon onClick={() => {
									if(irregularDates.length===1) return
								  let irregularDatesClone = [...irregularDates]
								  irregularDatesClone.removeAt(i)
								  this.setIrregularDates(irregularDatesClone)
							  }} className="icon icon-remove_circle no-border"/>
							</fb>)
						)}
					</fb>
					<fb className="no-shrink margin-bottom">
						<RaisedButton
							label="Weiteres Datum hinzufügen"
							onClick={()=>this.setIrregularDates([...irregularDates, getTodaySmart()])}
							icon={<FontIcon className="icon icon-add_circle"/>}
						/>
					</fb>
				</content>
			</fb>
		)
	}

	renderMonthlySelector() {
		const monthdays = _.range(1, 32, 1);
		let relevantMonthlength = null;
		const monthly = this.props.OTask.monthly || []

		if(monthly.find(31)) relevantMonthlength = 31
		if(monthly.find(30)) relevantMonthlength = 30
		if(monthly.find(29)) relevantMonthlength = 29

		return (
			<fb className="vertical">
				<header><h3>Tage im Monat auswählen</h3></header>
				<content>
					<fb className="monthdays offset slim wrap margin-bottom no-grow no-shrink">
						{monthdays.map(w => (<fb key={w} className={(cN({monthdayBox: true, selected: monthly.find(w)}))}
							style={{borderColor: monthly.find(w) ? 'blue' : "#BBBBBB"}}
							onClick={() => this.toggleMonthday(w)}
							>{w}</fb>))}
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
				</content>
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

	readyForNextStep = () => {
		switch (this.props.OTask.type) {
		case TaskType.onetimer: 	return true
		case TaskType.daily: 			return true
		case TaskType.yearly: 		return true
		case TaskType.irregular:	return true
		case TaskType.weekly: 		return this.props.OTask.weekly && this.props.OTask.weekly.length
		case TaskType.monthly: 		return this.props.OTask.monthly && this.props.OTask.monthly.length
		default: return false
		}
	}

	render() { return (
		<fb className='vertical setTimingStepMain'>
			{	this.renderContent() }
			<WizardFooter
				stepForward={this.props.stepForward}
				stepBackward={this.props.stepBackward}
				disableBackward={this.props.mode==='edit'}
				disableForward={!this.readyForNextStep()}/>
		</fb>
	)}
}

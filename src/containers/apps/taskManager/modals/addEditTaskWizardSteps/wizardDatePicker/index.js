import React from 'react'
import DatePicker from 'material-ui/DatePicker'
import Toggle from 'material-ui/Toggle'
import moment from 'moment'
import 'styles/modals.css'


export default function WizardDatePicker(props) {
	const {pickedDate, label, withToggle, disabled, changePickedDate, firstAcceptableDate} = props
	return(
		<fb className="horizontal _1-of-2 no-shrink">
			{ withToggle &&
				<fb className="no-shrink margin-right no-grow dateToggle">
					<Toggle
					  label={"Mit " + label}
						labelPosition="right"
					  onClick={() => changePickedDate(pickedDate ? null : firstAcceptableDate)} //toogling leads to adding or removing a date to the OTask
					  toggled={!!pickedDate}
						/>
				</fb>
			}
			{
				!!pickedDate &&
				<fb className="dateBoxWrapper">
					<DatePicker
						disabled={disabled}
						value={moment(pickedDate, 'YYYYMMDD').toDate()}
						onChange={(e, d) => changePickedDate(parseInt(moment(d).format('YYYYMMDD'), 10))}
						shouldDisableDate={(d) => moment(d).format('YYYYMMDD') < firstAcceptableDate}
						floatingLabelText={label}
						okLabel="OK"
						cancelLabel="Abbrechen"
						autoOk={true}
						DateTimeFormat={window.DateTimeFormat}
						locale="de-DE"
					  />
				  </fb>
				}
		</fb>
	)
}

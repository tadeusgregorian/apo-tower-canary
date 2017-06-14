import React from 'react'
import moment from 'moment'
import './styles.css'

export default ({task:t, users}) => {
	const doneBy = 			t.isDoneBy 			&& users.find(u => u.ID===t.isDoneBy).name
	const ignoredBy = 	t.isIgnoredBy 	&& users.find(u => u.ID===t.isIgnoredBy).name
	const shiftedBy = 	t.isShiftedBy 	&& users.find(u => u.ID===t.isShiftedBy).name
	const doneDate = 		t.isDoneDate 		&& moment.unix(t.isDoneDate).format('DD.MM.YYYY - HH:mm')
	const ignoredDate = t.isIgnoredDate && moment.unix(t.isIgnoredDate).format('DD.MM.YYYY - HH:mm')
	//const shiftedDate = t.isShiftedDate && moment(t.isShiftedDate).format('DD.MM.YYYY')
	const shiftedTo =		t.isShiftedTo   && moment(t.isShiftedTo, 'YYYYMMDD').format('DD.MM.YYYY')

	return(
		<fb>
			{	doneBy &&
				<fb className='smallInfoRow done'>
					<icon className='icon-check_circle nop'/><p>Erledigt von <b>{doneBy}</b> am<b> {doneDate}</b></p>
				</fb>
			}
			{	ignoredBy &&
				<fb className='smallInfoRow ignored'>
					<icon className='icon-error nop'/><p>Ignoriert von <b>{ignoredBy}</b> am<b> {ignoredDate}</b></p>
				</fb>
			}
			{	shiftedBy &&
				<fb className='smallInfoRow ignored'>
					<icon className='icon-error nop'/>
						<p>Verschoben von <b>{shiftedBy}</b> auf den<b> {shiftedTo}</b></p>
				</fb>
			}
		</fb>
	)
}

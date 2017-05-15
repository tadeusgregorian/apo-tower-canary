import React from 'react'
import moment from 'moment'
import './styles.css'

export default ({originalDate}) => (
		<fb className='shiftedFromInfoMain'>
			<icon className='icon-arrow-right2'/>
			<fb>Diese Aufgabe wurde vom {moment(originalDate, 'YYYYMMDD').format('DD.MM.YY')} hierher verschoben.</fb>
		</fb>
)

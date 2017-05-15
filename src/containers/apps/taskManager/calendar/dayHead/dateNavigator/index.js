import cN  from 'classnames';
import React from 'react';
import './styles.css';
import Paging from './paging';

const DateNavigator = ({isToday, goToNextDay, goToPrevDay, jumpToToday, openDatePicker}) => (
	<fb className="dayControl">
		<Paging clickHandler={goToNextDay} direction={"left"} />
			<button
				onClick={jumpToToday}
				disabled={isToday}
				className={cN({'disabled': isToday, 'jumpToTodayButton': true})}>
				Heute
			</button>
			<icon onClick={openDatePicker} className="icon-calendar jumpToDateIcon"/>
		<Paging clickHandler={goToPrevDay} direction={"right"} />
	</fb>
)

export default DateNavigator;

import cN  from 'classnames';
import React from 'react';
import './styles.scss';
import Paging from './paging';

const DateNavigator = ({isToday, goToNextDay, goToPrevDay, jumpToToday, openDatePicker}) => (
	<fb className="dayControl">
		<Paging clickHandler={goToNextDay} direction={"left"} />
			<button
				onTouchTap={jumpToToday}
				disabled={isToday}
				className={cN({'disabled': isToday, 'jumpToTodayButton': true})}>
				Heute
			</button>
			<icon onTouchTap={openDatePicker} className="icon-calendar jumpToDateIcon"/>
		<Paging clickHandler={goToPrevDay} direction={"right"} />
	</fb>
)

export default DateNavigator;

import React from 'react';
import cN from 'classnames';
import _ from 'lodash';
// import Toggle from 'material-ui/Toggle';
// import Checkbox from 'material-ui/Checkbox';
import './styles.css';

const DayFooter = ({
	showHideDoneTasks,
	showDoneTasks,
	checkedTasksCount,
	showHideEveryonesTasks,
	showEveryonesTasks,
	userMode
}) => (
	<fb className='dayFooter'>
		{!!checkedTasksCount &&
			<fb className="dayFooterItem" onClick={showHideDoneTasks}>
					<icon className={cN({ icon: true, "icon-expand_less": showDoneTasks, "icon-expand_more": !showDoneTasks})}/>
					<fb className='itemText'>{showDoneTasks ? ('ERLEDIGTE AUSBLENDEN ') : ('ERLEDIGTE ANZEIGEN')}</fb>
					{!showDoneTasks && <fb className="doneTasksIndicator">{(checkedTasksCount)}</fb>}
			</fb>
		}
		{userMode &&
			<fb className="dayFooterItem" onClick={showHideEveryonesTasks}>
					<icon className={cN({'icon-expand_less': showEveryonesTasks, 'icon-expand_more': !showEveryonesTasks})}/>
					<fb className='itemText'>{showEveryonesTasks ? ('NUR MEINE AUFGABEN') : ('AUFGABEN ALLER ANZEIGEN')}</fb>
			</fb>
		}
	</fb>
)

export default DayFooter

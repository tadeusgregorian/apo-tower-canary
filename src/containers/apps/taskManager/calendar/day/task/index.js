import cN  from 'classnames';
import RoundCheckbox  from 'components/roundCheckbox';
import React, { PureComponent } from 'react';
import AssignedUsers from 'components/assignedUsers';
import moment from 'moment'
import './styles.css';
import _ from 'lodash'


export default class Task extends PureComponent {

	render() {
		const t = this.props.data;
		const { clickHandler, onCheckboxClick, withCheckbox, users } = this.props;
		const prio = t.prio && !(t.isDone || t.isIgnored || t.isShifted) // there is only Prio 2 now , Prio 0 and 1 are deprecated. // needs to refactored in future to a Boolean Flag
		const originalDate = t.originalShiftedTask && moment(t.originalShiftedTask.date, 'YYYYMMDD').format('DD.MM.YY')

		const assignedUsersNoReplaced = _.keys(t.assignedUsers).filter(uID => t.assignedUsers[uID] !== 'replaced')
		const replacers = _.keys(t.assignedUsers).filter(uID => t.assignedUsers[uID] === 'replacer')

		return (
			<fb className="taskItemWrapper">
				{withCheckbox &&
					 <RoundCheckbox
							invisible={t.isIgnored || (t.isShifted && !t.isDone) }
							checked={t.isDone && !t.isIgnored}
							clickHandler={(e) => onCheckboxClick(t)} />
					}
				<fb className={cN({ task: true, prio, isDone: t.isDone, isIgnored: t.isIgnored || t.isShifted })}>
					<fb className="body taskBody" onClick={clickHandler}>
						<fb className="head">
							<fb className="subject">{t.subject}</fb>
						</fb>
						{ t.isIgnored && <fb className="tag">ignoriert</fb>  }
						{ t.isShifted && <fb className="tag">verschoben</fb> }
						{ t.originalShiftedTask && <fb className="tag">{originalDate}</fb> }
						{ !t.isIgnored && !t.isShifted &&
						<fb className="assignedUsersWrapper">
						 	<AssignedUsers
								assignedUsers={assignedUsersNoReplaced}
								replacers={replacers}
								users={users}
								usersRed={[t.isDoneBy]}
								colorStyle={ t.isDone ? 'blackAndWhite' : 'colorful'}
							/>
						</fb>
						}
					</fb>
				</fb>
			</fb>
		);
	}
}

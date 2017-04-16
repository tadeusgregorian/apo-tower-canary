import cN  from 'classnames';
import RoundCheckbox  from 'components/roundCheckbox';
import React, { PureComponent } from 'react';
import AssignedUsers from 'components/assignedUsers';
import './styles.scss';
import _ from 'lodash'


export default class Task extends PureComponent {

	render() {
		const t = this.props.data;
		const { clickHandler, onCheckboxClick, withCheckbox, users } = this.props;
		const prio = t.prio && !(t.isDone || t.isIgnored || t.isShifted) // there is only Prio 2 now , Prio 0 and 1 are deprecated. // needs to refactored in future to a Boolean Flag
		return (
			<fb className="taskItemWrapper">
				{withCheckbox
					? <RoundCheckbox
							invisible={t.isIgnored || (t.isShifted && !t.isDone) }
							checked={t.isDone && !t.isIgnored}
							clickHandler={(e) => onCheckboxClick(t)} />
					: null}
				<fb className={cN({ task: true, prio, isDone: t.isDone, isIgnored: t.isIgnored || t.isShifted })}>
					<fb className="body" onTouchTap={clickHandler}>
						<fb className="head">
							<fb className="subject">{t.subject}</fb>
						</fb>
						{ t.isIgnored && <fb className="tag">ignoriert</fb>  }
						{ t.isShifted && <fb className="tag">verschoben</fb> }
						{ !t.isIgnored && !t.isShifted &&
							 	<AssignedUsers
									assignedUsers={_.keys(t.assignedUsers)}
									users={users}
									usersRead={[t.isDoneBy]}
									colorStyle={ t.isDone ? 'blackAndWhite' : 'colorful'}
								/>
						}
					</fb>
				</fb>
			</fb>
		);
	}
}

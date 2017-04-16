import React, { PureComponent } from 'react';
import _ from 'lodash';
import cN from 'classnames';
import './styles.scss';
import miniUser from 'components/miniUser';
import AssignedUsers from 'components/assignedUsers';
import moment from 'moment'

export default class QmLetter extends PureComponent {

	render() {
		let {qm, users, user, hasRead} = this.props
		let creator = users.find(u => u.ID && u.ID == qm.creatorID)
		const usersRead = _.keys(qm.assignedUsers).filter(uID => qm.assignedUsers[uID] == 2)
		if (!creator) throw new Error('cand find the Creator of the QMLetter')
		let userIsCreator = (user.ID == qm.creatorID)
		let userIsCreatorOrAdmin = user.adminHash || userIsCreator

		return (
			<fb className={cN({letter: true, "hasRed": hasRead, needsBorderBottom: true })} onTouchTap={() => this.props.openReadUnreadQmModal(hasRead, qm)}>
				<fb className="author" style={{ color: creator.color }}>
					{creator.nameInitials}
				</fb>
				<fb className="subject">
				<fb className="isUrgentWrapper">
					{qm.isUrgent ? <icon className="icon-error no-border a-center no-padding"></icon> : null }
				</fb>
					{qm.files ? <icon className="icon-attachment no-border a-center no-padding" style={{ color: "grey" }}></icon> : null}
					<span className="subjectTextWrapper">{qm.subject}</span>
				</fb>
				<fb className='assignedUsersWrapper'>
					<AssignedUsers assignedUsers={_.keys(qm.assignedUsers)} usersRead={usersRead} maxDisplayedMiniUsers={5} users={users}/>
				</fb>
				<fb className="date">{moment(qm.date).format('DD. MMM')}</fb>
			</fb>
		)
	}
}

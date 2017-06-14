import React, { PureComponent } from 'react';
import _ from 'lodash';
import cN from 'classnames';
import './styles.css';
//import AssignedUsers from 'components/assignedUsers';
import RedQmsBox from './redQmsBox'
import moment from 'moment'

export default class QmLetter extends PureComponent {

	render() {
		console.log('rende')
		let {qm, users, hasRed} = this.props
		let creator = users.find(u => u.ID && u.ID===qm.creatorID)
		const usersRed = _.keys(qm.assignedUsers).filter(uID => qm.assignedUsers[uID]===2)
		const assignedUsersCount = _.keys(qm.assignedUsers).length
		const usersRedCount = usersRed.length
		//let userIsCreator = (user.ID===qm.creatorID)
		//let userIsCreatorOrAdmin = user.adminHash || userIsCreator

		return (
			<fb className={cN({letter: true, "hasRed": hasRed, needsBorderBottom: true })} onClick={() => this.props.openReadUnreadQmModal(hasRed, qm)}>
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
					<RedQmsBox redNum={usersRedCount} totalNum={assignedUsersCount} />
					{/* <AssignedUsers assignedUsers={_.keys(qm.assignedUsers)} usersRed={usersRed} maxDisplayedMiniUsers={5} users={users}/> */}
				</fb>
				<fb className="date">{moment.unix(qm.date).format('DD. MMM')}</fb>
			</fb>
		)
	}
}

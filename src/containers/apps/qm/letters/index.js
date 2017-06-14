import React, { PureComponent } from 'react';
import QmLetter from './letter';
import _ from 'lodash';
import LazyLoad from 'react-lazyload';
import { forceCheck } from 'react-lazyload';
import { stringIncludes } from 'helpers'
import './styles.css'

export default class QmLetters extends PureComponent {

	componentDidUpdate = (prevProps) => {
		if(prevProps.filterText !== this.props.filterText) forceCheck()
		if(prevProps.showOnlyUnreadQms !== this.props.showOnlyUnreadQms) forceCheck()
		if(prevProps.adminWantsToSeeAll !== this.props.adminWantsToSeeAll) forceCheck()
	}

	render = () => {
		const {
			users,
			userID,
			qmLetters,
			filterText,
			adminWantsToSeeAll,
			showOnlyUnreadQms,
			openReadUnreadQmModal,
		} = this.props

		if (!qmLetters) return []

		//const qmLettersSorted =  this.props.qmLetters.sortBy((qm) => moment(qm.date).unix(), true)
		let qmLettersSorted = [ ...qmLetters ].sort((a, b) => a.date < b.date ? 1 : -1).filter(qm => {
			const isRelevant 					= qm.assignedUsers[userID] || qm.creatorID === userID || adminWantsToSeeAll
			const isAssignedAndUnread = qm.assignedUsers[userID] && qm.assignedUsers[userID] !== 2
			const filterMatches 			= filterText && stringIncludes(qm.subject+' '+qm.text, filterText)

			if(filterText && !filterMatches) 								return false
			if(showOnlyUnreadQms && !isAssignedAndUnread) 	return false
			if(!isRelevant) 																return false
			return true
		})

		qmLettersSorted = qmLettersSorted.map(qm => {
			const currentUserIsCreator 	= (userID === qm.creatorID)
			const currentUserHasRed 		= qm.assignedUsers[userID] === 2
			const hasRed 								= !!(currentUserHasRed || currentUserIsCreator)

			return { ...qm, hasRed}
		})

		return(
			// this is a div because Lazyload doesnt work here with display: flex ( dont change this tade )
			<div className="qmLetters">
				{qmLettersSorted.map(qm => (
					<LazyLoad key={qm.ID} height={45} overflow once offset={60}>
						<QmLetter openReadUnreadQmModal={openReadUnreadQmModal} qm={qm} hasRed={qm.hasRed} users={users}/>
					</LazyLoad>
				))}
			</div>
		)
	}
}

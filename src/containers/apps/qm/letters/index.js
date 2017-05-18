import React, { PureComponent } from 'react';
import QmLetter from './letter';
import _ from 'lodash';
import LazyLoad from 'react-lazyload';
import {forceCheck} from 'react-lazyload';
import { stringIncludes } from 'helpers'
import './styles.css'

export default class QmLetters extends PureComponent {
	//componentDidUpdate = () => { forceCheck() }
	componentWillReceiveProps = (nP) => {
		if(nP.filterText !== this.props.filterText) forceCheck()
		if(nP.showOnlyUnreadQms !== this.props.showOnlyUnreadQms) forceCheck()
	}

	renderQmLetters = () => {
		const {userID, qmLetters, filterText, showOnlyUnreadQms} = this.props

		if (!qmLetters) return []

		//const qmLettersSorted =  this.props.qmLetters.sortBy((qm) => moment(qm.date).unix(), true)
		let qmLettersSorted = [ ...qmLetters ].sort((a, b) => a.date < b.date ? 1 : -1).filter(qm => {
			const isRelevant = qm.assignedUsers[userID] || qm.creatorID===this.props.userID
			const isAssignedAndUnread = qm.assignedUsers[userID] && qm.assignedUsers[userID] !== 2
			const filterMatches = filterText && stringIncludes(qm.subject+' '+qm.text, filterText)

			if(filterText && !filterMatches) return false
			if(showOnlyUnreadQms && !isAssignedAndUnread) return false
			if(!isRelevant) return false
			return true
		})
		return qmLettersSorted.map((qm, i) => {

			const currentUserIsCreator = (userID===qm.creatorID)
			const currentUserHasRed = qm.assignedUsers[userID]===2
			const hasRed = !!(currentUserHasRed || currentUserIsCreator)

			return(
				<LazyLoad placeholder={(<fb style={{ height:45, borderBottom: '1px solid lightgrey'}} className="no-grow no-shrink"></fb>)}
					key={qm.ID}
					overflow={true}
					once={true}
					debounce={200}
					offset={30}
				>
					<QmLetter
						openReadUnreadQmModal={this.props.openReadUnreadQmModal}
						qm={qm}
						hasRed={hasRed}
						users={this.props.users}
					/>
				</LazyLoad>
			)
		})
	}

	render = () => {
		return (
			<main className="qmLettersMainWrapper">
				<content className="qmLetters">
					{this.renderQmLetters()}
					{this.props.filter && <b className="padding textCenter">Nachrichten werden gefiltert nach:  "{this.props.filter}"</b>}
				</content>
			</main>
		)
	}
}

import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import composeWizard from 'composers/qmWizard';
import QmLetter from './letter';
import DefineContentStep from './modals/defineContentStep'
import AssignUsersStep from './modals/assignUsersStep'
import { readQm, unreadQm, createQm, editQm} from 'actions/index';
import _ from 'lodash';
import Dialog from 'material-ui/Dialog';
import ReadUnreadQmPopup from './modals/readUnreadQmPopup/index.js';
import DeleteQmPopup from './modals/deleteQmPopup';
import TextField from 'material-ui/TextField';
import ContentAdd from 'material-ui/svg-icons/content/add';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import cN from 'classnames';
import LazyLoad from 'react-lazyload';
import Checkbox from 'material-ui/Checkbox';
import {forceCheck} from 'react-lazyload';
import moment from 'moment'
import './styles.scss'

class QmLetters extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			readUnreadQmDialogOpen: false,
			addEditQmWizardOpen: false,
			deleteQmPopupOpen: false,
			showOnlyUnreadQms: false,
			filter: ""
		}
	}

	componentDidUpdate = () => { forceCheck() }

	// -------- Read and Unread QM
	closeReadUnreadQmModal = () => 	this.setState({readUnreadQmDialogOpen: false})

	openReadUnreadQmModal = (hasRead, qmData) => {
		this.readUnreadQmPopup = (<ReadUnreadQmPopup
			user={this.props.user}
			users={this.props.users}
			hasRead={hasRead}
			qmData={qmData}
			close={this.closeReadUnreadQmModal}
			openAddEditQmWizard={this.openAddEditQmWizard}
			openDeleteQmPopup={this.openDeleteQmPopup}
		/>)
		this.setState({readUnreadQmDialogOpen: true})
	};

	// -------- Add and edit qm letter (When adding new qm, param must be true)
	openAddEditQmWizard = (isAdding, qmData) => {
		this.setState({addEditQmWizardOpen: true});
		let Wizard = composeWizard([DefineContentStep, AssignUsersStep]);
		this.addEditQmWizard = (<Wizard
			user={this.props.user}
			creatorID={this.props.user.ID}
			initData={qmData}
			close={this.closeAddEditQmWizard}
			onFinish={isAdding ? createQm : editQm}
		/>)
	}

	closeAddEditQmWizard = () => this.setState({addEditQmWizardOpen: false})

	openDeleteQmPopup = (qm) => {
		this.setState({deleteQmPopupOpen: true});
		this.deleteQmPopup = (<DeleteQmPopup qm={qm} close={()=>this.setState({deleteQmPopupOpen: false})}/>)
	}

	renderQmLetters = () => {
		console.log('rerender!')
		const {user, qmLetters} = this.props

		if (!qmLetters) return []

		//const qmLettersSorted =  this.props.qmLetters.sortBy((qm) => moment(qm.date).unix(), true)
		let qmLettersSorted = [ ...qmLetters ].sort((a, b) => a.date < b.date ? 1 : -1).filter(qm => {
			if (this.state.showOnlyUnreadQms) return qm.assignedUsers[user.ID] && qm.assignedUsers[user.ID] != 2
			return qm.assignedUsers[user.ID] || qm.creatorID == this.props.user.ID
		})
		return qmLettersSorted.map((qm, i) => {

			const currentUserIsCreator = (user.ID == qm.creatorID)
			const currentUserHasRed = qm.assignedUsers[user.ID] == 2
			const hasRead = !!(currentUserHasRed || currentUserIsCreator)

			return(
				<LazyLoad placeholder={(<fb style={{ height:45, borderBottom: '1px solid lightgrey'}} className="no-grow no-shrink"></fb>)}
					key={qm.ID}
					overflow={true}
					once={true}
					debounce={200}
					offset={30}
				>
					<QmLetter
						openReadUnreadQmModal={this.openReadUnreadQmModal}
						user={user}
						qm={qm}
						hasRead={hasRead}
						users={this.props.users}
					/>
				</LazyLoad>
			)
		})
	}

	onSearchFieldChanged = (e) => {
		this.setState({filter: e.target.value})
		forceCheck()
	}

	render = () => {
		return (
			<main className="qmLettersMainWrapper">
				<header className="horizontal left">
					<fb>
						<icon className="icon-search no-border"></icon>
						<TextField floatingLabelText="Suche" floatingLabelStyle={{color: 'grey'}} value={this.state.filter} onChange={this.onSearchFieldChanged}/>
					</fb>
					<fb className="filterUnreadCheckbox">
						<Checkbox
							label="Nur ungelesene anzeigen"
							style={{fontSize: "14px"}}
							checked={this.state.showOnlyUnreadQms}
							onCheck={()=>{ this.setState({showOnlyUnreadQms: !this.state.showOnlyUnreadQms})}}
						/>
					</fb>
				</header>
				<content className="qmLetters">
					{this.renderQmLetters()}
					{this.state.filter
						? <b className="padding textCenter">Nachrichten werden gerade mit "{this.state.filter}" gefiltert.</b>
					: null}
				</content>
				<fb className="bottomButtonBar">
					<FloatingActionButton onTouchTap={() => this.openAddEditQmWizard(true)}>
						<ContentAdd/>
					</FloatingActionButton>
				</fb>
				<Dialog className="materialDialog" open={this.state.readUnreadQmDialogOpen} onRequestClose={this.closeReadUnreadQmModal}>
					{this.readUnreadQmPopup}
				</Dialog>
				<Dialog className="materialDialog" open={this.state.addEditQmWizardOpen} onRequestClose={this.closeAddEditQmWizard}>
					{this.addEditQmWizard}
				</Dialog>
				<Dialog className="materialDialog" open={this.state.deleteQmPopupOpen} onRequestClose={this.closeDeleteQmPopup}>
					{this.deleteQmPopup}
				</Dialog>
			</main>
		)
	}
}

const mapStateToProps = (state) => ({
	qmLetters: state.qmLetters.all,
	users: state.data.users
})

export default connect(mapStateToProps)(QmLetters);

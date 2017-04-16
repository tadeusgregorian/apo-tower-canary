import React, {PureComponent} from 'react'
import { Route, Link } from 'react-router-dom'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import Popover from 'material-ui/Popover'
import Menu from 'material-ui/Menu'
import MenuItem from 'material-ui/MenuItem'
import './styles.scss'
import _ from 'lodash'
import { getUnreadQmLetters } from 'selectors/unreadQmLettersSelector'
import cN from 'classnames'
import {openSelectUser, signOut, adminLoggedOut} from 'actions/index'

class Topbar extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			settingsPopoverIsOpen: false,
			settingsButton: null
		}
	}

	goBackToHome = () => {
		console.log('Remove SelectedUser from REDUX and redirect home')
	}

	render() {
		let { pathname } = this.props.location;
		let currentApp = '';
		if(pathname.includes('Apps/TaskManager/')) { currentApp = 'task' }
		if(pathname.includes('Apps/Qm/')) { currentApp = 'qm' }
		if(pathname.includes('Apps/Roster/')) { currentApp = 'roster' }
		if(pathname.includes('Apps/Adminpanel/')) { currentApp = 'adminpanel' }

		const {user, userMode} = this.props
		let userID = this.props.params && this.props.params.id;
		let qmNotifications = user && this.props.unreadQmLetters[user.ID];

		return (
			<fb id="topbar" className={cN({topbarBoxshadow: userMode ? true : false})} style={{background: userMode ? user.color : '#134f77', height: userMode ? '48px' : ''}}>
				<fb className="topbarContentWrapper">
					<fb className="left">
						{ userMode && <Link to={'/'}><icon className="backButton icon-arrow-left2"/></Link> }
						{ userMode &&
							<fb className="topbarButton topbarTasksButton">
								<Link to={`Apps/TaskManager/${userID}`}><icon className="icon icon-stack no-border"></icon></Link>
							</fb>
						}
						{ userMode &&
							<fb className="topbarButton topbarQmsButton">
								<Link to={`Apps/Qm/${userID}`}><icon className="icon icon-mail no-border"></icon></Link>
							</fb>
						}
						{ userMode &&
							<fb className="topbarButton topbarAdminpanelButton">
								<Link to={'Apps/Adminpanel'}><icon className="icon icon-cogs no-border"></icon></Link>
							</fb>
						}
						{ this.props.selectedBranch && !userMode &&
							<fb className="branchLabel">
								<icon className="icon-cloud-download branchIcon"></icon>
								<fb>{this.props.selectedBranch.name}</fb>
							</fb>
						}
					</fb>
					<fb className="center"></fb>
					<fb className="right">
						<fb className="navigation">
						</fb>
						{ userMode ? 	<fb className="userName">{user.name}</fb> : null }
						<icon className="menuButton icon-dehaze"
									onTouchTap={(e) => this.setState({settingsPopoverIsOpen: true, settingsButton: e.currentTarget})}
						/>
				</fb>
				<Popover
					open={this.state.settingsPopoverIsOpen}
					anchorEl={this.state.settingsButton}
					anchorOrigin={{horizontal: 'right', vertical: 'top'}}
					targetOrigin={{horizontal: 'right', vertical: 'bottom'}}
					onRequestClose={() => this.setState({settingsPopoverIsOpen: false})}>
					<Menu>
						<MenuItem primaryText="Filliale wechseln" onTouchTap={() => {
							this.props.openSelectbranchDialog();
							this.setState({settingsPopoverIsOpen: false})
						}}/>
						<MenuItem primaryText="Abmelden" onTouchTap={() => this.props.signOut()}/>
					</Menu>
				</Popover>
				</fb>
			</fb>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		selectedBranch: state.core.selectedBranch,
		qmLetters: state.data.qmLetters,
		users: state.data.users,
		unreadQmLetters: getUnreadQmLetters(state)
	};
};

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators({
		signOut,
		openSelectUser,
		adminLoggedOut,
		removeSelectedUser: () => dispatch({type: 'REMOVE_SELECTED_USER'})
	}, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Topbar);

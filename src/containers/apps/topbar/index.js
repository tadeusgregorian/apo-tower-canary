import React, {PureComponent} from 'react'
import { Link } from 'react-router-dom'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import Popover from 'material-ui/Popover'
import Menu from 'material-ui/Menu'
import MenuItem from 'material-ui/MenuItem'
import './styles.scss'
import _ from 'lodash'
import cN from 'classnames'

class Topbar extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			settingsPopoverIsOpen: false,
			settingsButton: null
		}
	}

	goBackToHome = () => this.props.removeSelectedUser()

	render() {
		const {user, userMode, selectedUser} = this.props
		let userID = selectedUser

		return (
			<fb id="topbar" className={cN({topbarBoxshadow: userMode ? true : false})} style={{background: userMode ? user.color : '#134f77', height: userMode ? '48px' : ''}}>
				<fb className="topbarContentWrapper">
					<fb className="left">
						{ userMode && <icon onClick={this.goBackToHome} className="backButton icon-arrow-left2"/> }
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

const mapStateToProps = (state) => ({
		selectedBranch: state.core.selectedBranch,
		selectedUser: state.core.selectedUser
})

const mapDispatchToProps = (dispatch) => (
	bindActionCreators({
		removeSelectedUser: () => dispatch({type: 'REMOVE_SELECTED_USER'})
	}, dispatch)
)

export default connect(mapStateToProps, mapDispatchToProps)(Topbar)

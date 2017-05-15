import React, {PureComponent} from 'react'
import { Link } from 'react-router-dom'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import { logoutFromFirebase } from 'actions'
import Popover from 'material-ui/Popover'
import Menu from 'material-ui/Menu'
import MenuItem from 'material-ui/MenuItem'
import './styles.css'
import _ from 'lodash'
import cN from 'classnames'

class Topbar extends PureComponent {
	constructor(props) {
		super(props)

		this.state = {
			settingsPopoverIsOpen: false,
			settingsButton: null
		}
	}

	goBackToHome = () => this.props.removeSelectedUser()


	render() {
		const {user, userMode, selectedUser, selectedBranch, branches} = this.props
		const selectedBranchObj = branches.find(b => b.ID === selectedBranch)
		const selectedBranchName = selectedBranchObj ? selectedBranchObj.name : ''

		return (
			<fb id="topbar" className={cN({topbarBoxshadow: userMode ? true : false})} style={{background: userMode ? user.color : '#134f77', height: userMode ? '48px' : ''}}>
				<fb className="topbarContentWrapper">
					<fb className="left">
						{ userMode ?
							<fb>
								<Link to='/Apps/TaskManager'>
									<icon onClick={this.props.removeSelectedUser} className="backButton icon-arrow-left2"/>
								</Link>
								<Link to={`/Apps/TaskManager/Kalender/${selectedUser}`}>
									<fb className="topbarButton topbarTasksButton"><icon className="icon icon-stack no-border"></icon></fb>
								</Link>
								<Link to={`/Apps/QM/${selectedUser}`}>
									<fb className="topbarButton topbarQmsButton"><icon className="icon icon-mail no-border"></icon></fb>
								</Link>
								<Link to={'/Apps/Adminpanel'}>
									<fb className="topbarButton topbarAdminpanelButton"><icon className="icon icon-cogs no-border"></icon></fb>
								</Link>
							</fb> :
							<fb className="branchLabel">
								<icon className="icon-cloud-download branchIcon"></icon>
								<fb>{selectedBranchName}</fb>
							</fb>
						}
					</fb>
					<fb className="right">
						{ userMode ? 	<fb className="userName">{user.name}</fb> : null }
						<icon className="menuButton icon-dehaze" onClick={(e) => this.setState({settingsPopoverIsOpen: true, settingsButton: e.currentTarget})}/>
				</fb>
				<Popover
					open={this.state.settingsPopoverIsOpen}
					anchorEl={this.state.settingsButton}
					anchorOrigin={{horizontal: 'right', vertical: 'top'}}
					targetOrigin={{horizontal: 'right', vertical: 'bottom'}}
					onRequestClose={() => this.setState({settingsPopoverIsOpen: false})}>
					<Menu>
						<MenuItem primaryText="Filliale wechseln" onClick={() => {
							this.props.openSelectbranchDialog();
							this.setState({settingsPopoverIsOpen: false})
						}}/>
						<MenuItem primaryText="Abmelden" onClick={() => this.props.logoutFromFirebase()}/>
					</Menu>
				</Popover>
				</fb>
			</fb>
		)
	}
}

const mapStateToProps = (state) => ({
	branches: state.data.branches,
	selectedBranch: state.core.selectedBranch,
	selectedUser: state.core.selectedUser
})

const mapDispatchToProps = (dispatch) => (
	bindActionCreators({
		logoutFromFirebase,
		removeSelectedUser: 		() => dispatch({type: 'REMOVE_SELECTED_USER'}),
		openSelectbranchDialog: () => dispatch({type: 'OPEN_SELECT_BRANCH_DIALOG'})
	}, dispatch)
)

export default connect(mapStateToProps, mapDispatchToProps)(Topbar)

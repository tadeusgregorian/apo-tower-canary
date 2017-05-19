import React, { PureComponent } from 'react'
import { NavLink, Route } from 'react-router-dom'
import { Redirect } from 'react-router'
import AdminpanelUsers from './users'
import AdminpanelGroups from './groups'
import AdminpanelBranches from './branches'
import './styles.css'



export default class AdminPanel extends PureComponent {

	render() {
		//const {userID} = this.props.match.params
		const baseUrl = '/Apps/Adminpanel/'
		return (
			<fb className="adminpanel">
				<fb className='adminpanel-body edgebox'>
					<div className='adminpanel-navbar'>
						<NavLink activeClassName="selected" className="navbar-item" to={`${baseUrl}Mitarbeiter`}>Mitarbeiter</NavLink>
						<NavLink activeClassName="selected" className="navbar-item" to={`${baseUrl}Gruppen`}>Gruppen</NavLink>
						<NavLink activeClassName="selected" className="navbar-item" to={`${baseUrl}Filianen`}>Filianen</NavLink>
					</div>
					<div className='adminPanelContent'>
						<Route path="/Apps/AdminPanel" exact				render={() => <Redirect to="/Apps/AdminPanel/Mitarbeiter" />} />
						<Route path='/Apps/AdminPanel/Mitarbeiter'	component={AdminpanelUsers} />
						<Route path='/Apps/AdminPanel/Gruppen' 			component={AdminpanelGroups} />
						<Route path='/Apps/AdminPanel/Filianen' 		component={AdminpanelBranches} />
					</div>
				</fb>
			</fb>
		)
	}
}

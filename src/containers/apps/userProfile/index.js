import React, { PureComponent } from 'react'
import { NavLink, Route, withRouter } from 'react-router-dom'
import { Redirect } from 'react-router'
import Vacation from './vacation'
import UserColor from './userColor'
import AdminPin from './adminPin'
import './styles.css'



class UserProfile extends PureComponent {

	render() {
		const isAdmin = this.props.user.isAdmin
		const baseUrl = '/Apps/Profil/'
		return (
			<fb className="userProfile">
				<fb className='userProfile-body edgebox'>
					<div className='userProfile-navbar'>
						<NavLink activeClassName="selected" className="navbar-item" to={`${baseUrl}Urlaub`}>Urlaub</NavLink>
						<NavLink activeClassName="selected" className="navbar-item" to={`${baseUrl}Pin`}>Admin-PIN</NavLink>
						<NavLink activeClassName="selected" className="navbar-item" to={`${baseUrl}Farbe`}>Profilfarbe</NavLink>
					</div>
					<div className='userProfileContent'>
						<Route path="/Apps/Profil" exact		render={() => <Redirect to="/Apps/Profil/Urlaub" />} />
						<Route path='/Apps/Profil/Urlaub'		component={Vacation} />
						<Route path='/Apps/Profil/Pin'			render={() => isAdmin ? <AdminPin /> : <Redirect to="/Apps/TaskManager/Kalender/Public" />  } />
						<Route path='/Apps/Profil/Farbe'		component={UserColor} />
					</div>
				</fb>
			</fb>
		)
	}
}

export default withRouter(UserProfile)

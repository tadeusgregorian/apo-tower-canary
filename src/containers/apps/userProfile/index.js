import React, { PureComponent } from 'react'
import { NavLink, Route } from 'react-router-dom'
import { Redirect } from 'react-router'
import Vacation from './vacation'
import UserColor from './userColor'
import './styles.css'



export default class UserProfile extends PureComponent {

	render() {
		const baseUrl = '/Apps/Profil/'
		return (
			<fb className="userProfile">
				<fb className='userProfile-body edgebox'>
					<div className='userProfile-navbar'>
						<NavLink activeClassName="selected" className="navbar-item" to={`${baseUrl}Urlaub`}>Urlaub</NavLink>
						<NavLink activeClassName="selected" className="navbar-item" to={`${baseUrl}Farbe`}>Profilfarbe</NavLink>
					</div>
					<div className='userProfileContent'>
						<Route path="/Apps/Profil" exact				render={() => <Redirect to="/Apps/Profil/Urlaub" />} />
						<Route path='/Apps/Profil/Urlaub'	component={Vacation} />
						<Route path='/Apps/Profil/Farbe'	component={UserColor} />
					</div>
				</fb>
			</fb>
		)
	}
}

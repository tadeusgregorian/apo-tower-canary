import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetch } from 'redux';
import { Link } from 'react-router';
import { PropTypes } from 'prop-types'
import cN from 'classnames';
import './styles.scss';


export default class AdminPanel extends React.Component {

	static contextTypes = { router: PropTypes.object }

	goBack = () => this.context.router.push('/Apps/')


	render() {
		let pathname = this.props.location.pathname;
		return (
			<fb className="adminpanel">
				<fb className='adminpanel-body edgebox'>
					<div className='adminpanel-navbar'>
						<div className={cN({'navbar-item': true, 'selected': (pathname.includes('Users'))})} onTouchTap={() => this.context.router.push(`/Apps/Adminpanel/${this.props.params.id}/Users/`)}>Mitarbeiter</div>
						<div className={cN({'navbar-item': true, 'selected': (pathname.includes('Branches'))})}  onTouchTap={() => this.context.router.push(`/Apps/Adminpanel/${this.props.params.id}/Branches/`)} >Filianen</div>
						<div className={cN({'navbar-item': true, 'selected': (pathname.includes('Groups'))})}  onTouchTap={() => this.context.router.push(`/Apps/Adminpanel/${this.props.params.id}/Groups/`)} >Gruppen</div>
					</div>
					<div className='content'>{this.props.children}</div>
				</fb>
			</fb>
		)
	}
}
